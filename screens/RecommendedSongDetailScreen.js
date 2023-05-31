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
import { recommendSongs } from "../logic/recommendSongs";

const RecommendedSongDetailScreen = ({ navigation, route }) => {
  const [song, setSong] = useState({});
  const [counter, setCounter] = useState(0);

  const getSong = async () => {
    setSong(route.params["song"]);
    setCounter(route.params["counterValue"]);
    console.log("DETAIL");
    console.log(counter);
    if (route.params["counterValue"] == undefined) {
      setCounter(0);
    }
  };

  const runCode = async () => {
    console.log("startcode at " + new Date());
    // Put your code that you want to run every hour here
    let currentUser = await firebase.auth().currentUser;
    let user;
    user = await firebase
      .database()
      .ref("users/" + currentUser.uid)
      .once("value");
    user = user.val();

    let userRatings = await firebase
      .database()
      .ref("ratings/" + (user.id - 1))
      .once("value");
    userRatings = userRatings.val();

    let ratings = await firebase.database().ref("ratings/").once("value");
    ratings = ratings.val();

    const recommendedSongs = await recommendSongs(
      user.id - 1,
      user.country,
      user.year,
      10,
      ratings,
      false
    );

    console.log(recommendedSongs);

    await firebase
      .database()
      .ref("users/" + currentUser.uid)
      .update({
        recommendedSongs: recommendedSongs,
      });
    console.log("Code executed" + new Date());
    setCounter(0);
  };

  const setRating = async (songTemp, rating) => {
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
    console.log("BEFORE DELETION");
    console.log(songIds);

    if (song.rating != 0) {
      for (let i = 0; i < songIds.length; i++) {
        if (songIds[i] == song.id - 1) {
          console.log("BEFOR");
          console.log(counter);
          setCounter((prevCounter) => prevCounter + 1);
          songIds.splice(i, 1);
          console.log("AFTER");
          console.log(counter);

          // update song rating in ratings matrix
          firebase
            .database()
            .ref("ratings/" + (user.id - 1))
            .update({
              [song.id - 1]: song.rating,
            });

          const newRatedSongs = [...user.ratedSongs, song];
          // update recommended and rated songs of user
          firebase
            .database()
            .ref("users/" + currentUser.uid)
            .update({
              recommendedSongs: songIds,
              ratedSongs: newRatedSongs,
            });
        }
      }
    }

    console.log("AFTER DELETION");
    console.log(songIds);

    navigation.push("RecommendedSongsScreen", {
      counterValue: counter,
    });
  };

  const handleBack = async () => {
    navigation.push("RecommendedSongsScreen", {
      counterValue: counter,
    });
  };

  useEffect(() => {
    getSong();
    if (counter >= 3) runCode();
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
        <TouchableOpacity onPress={handleBack} style={styles.button}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleConfirm} style={styles.button}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RecommendedSongDetailScreen;
