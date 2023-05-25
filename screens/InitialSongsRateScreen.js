import {
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
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
    let currentUser = await firebase.auth().currentUser;
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

    songs.map(async (song) => {
      await firebase
        .database()
        .ref("ratings/" + (user.id - 1))
        .update({
          [song.id]: song.rating,
        });
    });

    let ratings = await firebase.database().ref("ratings/").once("value");
    ratings = ratings.val();

    // const ratings = [
    //   [0, 0, 3, 0, 1, 5, 0, 1.5, 0, 0.5],
    //   [2, 0, 0, 2, 1, 5, 3, 1.5, 0, 0],
    //   [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 4, 0, 0, 1, 5, 0, 1.5, 0, 0],
    //   [4, 0, 3, 0, 1, 5, 0, 0, 0, 2],
    //   [0, 0, 1.5, 0, 1, 0, 0, 1.5, 4, 0],
    //   [2.5, 0, 2, 0, 1, 5, 3, 0.5, 0, 0],
    //   [0, 1, 0, 4, 1, 3, 2, 1.5, 0, 1],
    //   [0.5, 0, 3, 0, 1, 2, 0, 1.5, 0, 0],
    //   [0, 0, 3, 0, 0, 5, 1, 1.5, 0, 0],
    // ];

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
  };

  useEffect(() => {
    if (route.params) {
      changeSong(route.params["songs"]);
    } else {
      fillSongArray(5);
    }
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.initialHeader}>
        Tell us what you think about these songs!
      </Text>
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
                <Text style={styles.songAuthor}>{elem.author}</Text>
                <Text style={styles.songName}>{elem.name}</Text>
                <View>
                  <StarRating
                    rating={songs[index].rating}
                    onChange={(e) => setRating(elem.id, e)}
                  />
                </View>
              </View>
            </TouchableOpacity>
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
