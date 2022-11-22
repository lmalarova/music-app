import {
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { styles } from "../styles/styles";
import React, { useState, useEffect } from "react";
import * as firebase from "firebase";

const InitialSongsRateScreen = () => {
  const [song, setSong] = useState([]);
  const [songRating, setSongRating] = useState("");
  const [songId, setSongId] = useState("");

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
      temp.push(await getRandomSong());
      console.log(temp);
    } 
    setSong(arr => [...arr, ...temp]);
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
      {!!song.length && song.map((elem, index) => (               
        <View style={styles.songRow} key={index}>
          <Text style={styles.songAuthor}>{elem.author}</Text>
          <Text style={styles.songName}>{elem.name}</Text>
        </View>
      ))}
      </View>
    </KeyboardAvoidingView>
  );
};

export default InitialSongsRateScreen;
