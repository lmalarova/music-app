import {
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { styles } from "../styles/styles";
import React, { Component, useState } from "react";
import * as firebase from "firebase";

const InitialSongsRateScreen = () => {
  const [song_rating, setSongRating] = useState("");
  const [songId, setSongId] = useState("");

  firebase
    .database()
    .ref("/songs/" + Math.floor(Math.random() * 100) + 1)
    .once("value")
    .then((snapshot) => {
      console.log(snapshot.val());
      let randomSong = snapshot.val();
    });

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.initialHeader}>
        Tell us what you think about these songs!
      </Text>
      <View>
        <Text>{randomSong}</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default InitialSongsRateScreen;
