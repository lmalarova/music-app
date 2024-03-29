import {
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { styles } from "../styles/styles";
import React, { useState, useEffect } from "react";
import StarRating from "react-native-star-rating-widget";
import * as firebase from "firebase";

const SongDetailScreen = ({ navigation, route }) => {
  const [newSong, setNewSong] = useState({});
  const [newSongs, setNewSongs] = useState([]);
  const [oldSongId, setOldSongId] = useState();

  const getSong = async () => {
    const songId = route.params["songId"];
    const songs = route.params["songs"];

    setOldSongId(songId);
    setNewSongs(songs);
    setNewSong({});

    songs.forEach((song) => {
      if (song.id == songId) setNewSong(song);
    });
  };

  const setRating = async (song, rating) => {
    setNewSong(() => {
      return { ...song, rating: rating };
    });

    setNewSongs(
      newSongs.map((item) => {
        if (item.id === song.id) {
          // Create a *new* object with changes
          return { ...item, rating: rating };
        } else {
          // No changes
          return item;
        }
      })
    );
  };

  const handleChangeSong = async () => {
    let randomNumber = Math.floor(Math.random() * 1000 + 1);
    let snapshot = await firebase
      .database()
      .ref("/songs/" + randomNumber)
      .once("value");

    setNewSong(snapshot.val());
    setNewSongs([]);
    let newSongsTemp = [];

    newSongs.forEach((item) => {
      if (item.id == oldSongId) {
        newSongsTemp.push(snapshot.val());
        setOldSongId(snapshot.val().id);
      } else {
        newSongsTemp.push(item);
      }
    });

    setNewSongs(newSongsTemp);
  };

  const handleConfirm = () => {
    navigation.push("InitialSongsRateScreen", {
      songs: newSongs,
    });
  };

  useEffect(() => {
    getSong();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.detailContainer}>
        <Text style={styles.initialHeader}>{newSong.name}</Text>
        <View style={styles.songDetailContainer}>
          <Text style={styles.songAuthor}>{newSong.author}</Text>
          <Text style={styles.songInfo}>{newSong.country}</Text>
          <Text style={styles.songInfo}>{newSong.year}</Text>
          <Text style={styles.songInfo}>{newSong.genre}</Text>
          <StarRating
            style={styles.starRatingDetail}
            rating={newSong.rating}
            onChange={(e) => setRating(newSong, e)}
          />
          <TouchableOpacity onPress={handleConfirm} style={styles.button}>
            <Text style={styles.buttonText}>Potvdiť</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonDetailContainer}>
        <TouchableOpacity onPress={handleChangeSong} style={styles.button}>
          <Text style={styles.buttonText}>Zmeniť pieseň</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SongDetailScreen;
