import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styles } from "../styles/styles";
import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import Icon from "react-native-vector-icons/Ionicons";

const NavigationArrow = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name="arrow-forward" size={24} color="white" />
    </TouchableOpacity>
  );
};

const RecommendedSongsScreen = ({ route, navigation }) => {
  const [songs, setSongs] = useState([]);

  const getSongs = async () => {
    let currentUser = await firebase.auth().currentUser;
    user = await firebase
      .database()
      .ref("users/" + currentUser.uid)
      .once("value");
    user = user.val();

    const songIds = user.recommendedSongs;
    setSongs([]);
    let songsTemp = [];

    for (let i = 0; i < songIds.length; i++) {
      const snapshot = await firebase
        .database()
        .ref("/songs/" + songIds[i])
        .once("value");
      let songTemp = snapshot.val();
      songTemp.rating = 0;
      songsTemp.push(songTemp);
    }
    setSongs((arr) => [...arr, ...songsTemp]);
  };

  const handleDetail = async (song) => {
    navigation.push("RecommendedSongDetailScreen", {
      song: song,
      songs: songs
    });
  };

  const handleNavigation = async () => {
    navigation.push("RatedSongsScreen");
  };

  useEffect(() => {
    getSongs();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRecommended}>
        <Text style={styles.headerText}>Ohodnotené pesničky</Text>
        <NavigationArrow onPress={handleNavigation} />
      </View>
      <Text style={styles.initialHeader}>Tvoje odporúčané pesničky!</Text>
      <ScrollView>
        <View style={styles.songContainer}>
          {!!songs.length &&
            songs.map((elem, index) => (
              <TouchableOpacity
                onPress={() => {
                  handleDetail(elem);
                }}
                key={index}
              >
                <View style={styles.songRow} key={index}>
                  <Text style={styles.songAuthor}>{elem.author} </Text>
                  <Text style={styles.songName}>{elem.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecommendedSongsScreen;
