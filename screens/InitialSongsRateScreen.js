import {
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { styles } from "../styles/styles";
import StarRating from 'react-native-star-rating-widget';
import React, { useState, useEffect } from "react";
import * as firebase from "firebase";

const InitialSongsRateScreen = () => {
  const [songs, setSongs] = useState([]);

  const getRandomSong = async () => {
    let snapshot = await firebase
      .database()
      .ref("/songs/" + Math.floor(Math.random() * 100) + 1)
      .once("value");

    return snapshot.val();
  };

  const fillSongArray = async (count) => {
    let temp = [];
    for (let i = 0; i < count; i++) {
      let song = await getRandomSong();
      song.rating = 0;
      temp.push(song);
    } 
    setSongs(arr => [...arr, ...temp]);
  };

  const setRating = async (id, rating) => {
    setSongs(songs.map(song => {
      if (song.id === id) {
        // Create a *new* object with changes
        return { ...song, rating: rating };
      } else {
        // No changes
        return song;
      }
    }));
    console.log(songs);
  };

  const handleConfirm = async () => {
    const currentUser = await firebase.auth().currentUser;
    console.log(currentUser.uid);
    await firebase
      .database()
      .ref("users/" + currentUser.uid)
      .update({
        rated_song: songs
      });
  };

  useEffect(() => {
    fillSongArray(5);
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.initialHeader}>
        Tell us what you think about these songs!
      </Text>
      <View style={styles.songContainer}>
      {!!songs.length && songs.map((elem, index) => (               
        <View style={styles.songRow} key={index}>
          <Text style={styles.songAuthor}>{elem.author}</Text>
          <Text style={styles.songName}>{elem.name}</Text>
          <StarRating rating={songs[index].rating} onChange={e => setRating(elem.id, e)} />
        </View>
      ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleConfirm}
          style={[styles.button, styles.button]}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default InitialSongsRateScreen;
