import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styles } from "../styles/styles";
import StarRating from "react-native-star-rating-widget";
import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import { recommendSongs } from "../logic/recommendSongs";

const InitialSongsRateScreen = ({ navigation, route }) => {
  const [songs, setSongs] = useState([]);

  const emptyState = () => {
    setSongs([]);
  };

  const getRandomSong = async () => {
    let randomNumber = Math.floor(Math.random() * 1000 + 1);
    let snapshot = await firebase
      .database()
      .ref("/songs/" + randomNumber)
      .once("value");

    return snapshot.val();
  };

  const fillSongArray = async (count) => {
    let temp = [];
    setSongs([]);
    for (let i = 0; i < count; i++) {
      let song = await getRandomSong();
      song.rating = 0;
      temp.push(song);
    }
    setSongs((arr) => [...arr, ...temp]);
  };

  const changeSong = (songs) => {
    setSongs(songs);
  };

  const setRating = async (id, rating) => {
    setSongs(
      songs.map((song) => {
        if (song.id === id) {
          // Create a *new* object with changes
          return { ...song, rating: rating };
        } else {
          // No changes
          return song;
        }
      })
    );
  };

  const handleDetail = async (songId) => {
    navigation.push("SongDetailScreen", {
      songId: songId,
      songs: songs,
    });
  };

  const handleConfirm = async () => {
    console.log("RECOMMENDING");
    navigation.push("LoadingScreen");

    try {
      const currentUser = firebase.auth().currentUser;
      const userSnapshot = await firebase
        .database()
        .ref("users/" + currentUser.uid)
        .once("value");
      const user = userSnapshot.val();

      const userRatingsSnapshot = await firebase
        .database()
        .ref("ratings/" + (user.id - 1))
        .once("value");
      const userRatings = userRatingsSnapshot.val();

      const updateRatingsPromises = songs.map((song) =>
        firebase
          .database()
          .ref("ratings/" + (user.id - 1))
          .update({
            [song.id]: song.rating,
          })
      );

      await Promise.all(updateRatingsPromises);

      const ratingsSnapshot = await firebase
        .database()
        .ref("ratings/")
        .once("value");
      const ratings = ratingsSnapshot.val();

      const recommendedSongs = await recommendSongs(
        user.id - 1,
        user.country,
        user.year,
        10,
        ratings,
        true
      );

      console.log(recommendedSongs);

      await firebase
        .database()
        .ref("users/" + currentUser.uid)
        .update({
          recommendedSongs: recommendedSongs,
        });

      navigation.push("RecommendedSongsScreen");
      emptyState();
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };

  useEffect(() => {
    if (route.params) {
      changeSong(route.params["songs"]);
    } else {
      fillSongArray(5);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container} behavior="padding">
      <ScrollView>
        <Text style={styles.initialHeader}>
          Tell us what you think about these songs!
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleConfirm} style={styles.button}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.songContainer}>
          {!!songs.length &&
            songs.map((elem, index) => (
              <TouchableOpacity
                onPress={() => {
                  handleDetail(elem.id);
                }}
                key={index}
              >
                <View style={styles.songRow}>
                  <View style={styles.songInfoContainer}>
                    <Text style={styles.songAuthor}>{elem.author}</Text>
                    <Text style={styles.songName}>{elem.name}</Text>
                  </View>
                  <StarRating
                    rating={songs[index].rating}
                    onChange={(e) => setRating(elem.id, e)}
                  />
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InitialSongsRateScreen;
