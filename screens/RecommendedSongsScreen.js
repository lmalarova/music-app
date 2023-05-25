import {
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { styles } from "../styles/styles";
import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const RecommendedSongsScreen = ({ route, navigation }) => {
  const [songs, setSongs] = useState([]);
  const Tab = createBottomTabNavigator();

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

  const handleDetail = async (songId) => {
    navigation.push("SongDetailScreen", {
      songId: songId,
      songs: songs,
    });
  };

  useEffect(() => {
    getSongs();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.initialHeader}>
        These are songs recommended for you!
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
              <View style={styles.songRow} key={index}>
                <Text style={styles.songAuthor}>{elem.author}</Text>
                <Text style={styles.songName}>{elem.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
      </View>
      {/* <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer> */}
    </KeyboardAvoidingView>
  );
};

export default RecommendedSongsScreen;
