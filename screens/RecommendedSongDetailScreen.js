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

const RecommendedSongDetailScreen = ({ navigation, route }) => {
  const [songId, setSongId] = useState();
  const [song, setSong] = useState({});

  const getSong = async () => {
    console.log("HALOOOOO DOPICEEE");
    const songId = route.params["songId"];

    console.log(songId);

    const song = await firebase
      .database()
      .ref("/songs/" + (songId - 1))
      .once("value");
    console.log(song);
    setSong(song);
  };

  // const getSongs = async () => {
  //   let currentUser = await firebase.auth().currentUser;
  //   user = await firebase
  //     .database()
  //     .ref("users/" + currentUser.uid)
  //     .once("value");
  //   user = user.val();

  //   const songIds = user.recommendedSongs;
  //   let songsTemp = [];

  //   for (let i = 0; i < songIds.length; i++) {
  //     const snapshot = await firebase
  //       .database()
  //       .ref("/songs/" + songIds[i])
  //       .once("value");
  //     let songTemp = snapshot.val();
  //     songTemp.rating = 0;
  //     songsTemp.push(songTemp);
  //   }
  // };

  const setRating = async (songTemp, rating) => {
    console.log("RATING");
    setSong(() => {
      return { ...songTemp, rating: rating };
    });
  };

  const handleConfirm = async () => {
    // get current user
    let currentUser = await firebase.auth().currentUser;
    user = await firebase
      .database()
      .ref("users/" + currentUser.uid)
      .once("value");
    user = user.val();

    // get his recommended songs
    const songIds = user.recommendedSongs;

    if (song.rating != 0) {
      for (let i = 0; i < songIds.length; i++) {
        if (songIds[i].id == song.id) {
          songIds.splice(i, 1);

          // update song rating in ratings matrix
          firebase
            .database()
            .ref("ratings/" + (user.id - 1))
            .update({
              [song.id]: song.rating,
            });
        }
      }
    }
    // update recommended songs of user
    firebase
      .database()
      .ref("users/" + currentUser.uid)
      .update({
        recommendedSongs: songIds,
      });

    navigation.push("RecommendedSongsScreen");
  };

  // const handleGoBack = () => {
  //   navigation.push(RecommendedSongsScreen);
  // };

  useEffect(() => {
    getSong();
    // getSongs();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.detailContainer}>
        <Text style={styles.initialHeader}>{song.name}</Text>
        <View style={styles.songDetailContainer}>
          <Text style={styles.songAuthor}>{song.author}</Text>
          <Text style={styles.songInfo}>{song.country}</Text>
          <Text style={styles.songInfo}>{song.year}</Text>
          <Text style={styles.songInfo}>{song.genre}</Text>
          <StarRating
            style={styles.starRatingDetail}
            rating={song.rating}
            onChange={(e) => setRating(song, e)}
          />
        </View>
      </View>
      <View style={styles.buttonDetailContainer}>
        <TouchableOpacity onPress={handleConfirm} style={styles.button}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RecommendedSongDetailScreen;
