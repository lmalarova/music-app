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
import Icon from "react-native-vector-icons/Ionicons";

const NavigationArrow = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name="arrow-back" size={24} color="white" />
    </TouchableOpacity>
  );
};

const RatedSongsScreen = ({ navigation, route }) => {
  const [songs, setSongs] = useState([]);

  const emptyState = () => {
    setSongs([]);
  };

  const getSongs = async () => {
    let currentUser = await firebase.auth().currentUser;
    user = await firebase
      .database()
      .ref("users/" + currentUser.uid)
      .once("value");
    user = user.val();

    let songsTemp = [];
    setSongs([]);

    for (let i = 0; i < user.ratedSongs.length; i++) {
      songsTemp.push(user.ratedSongs[i]);
    }
    setSongs((arr) => [...arr, ...songsTemp]);
  };

  const handleConfirm = async () => {
    navigation.push("RecommendedSongsScreen");
    emptyState();
  };

  const handleNavigation = async () => {
    navigation.push("RecommendedSongsScreen");
  };

  useEffect(() => {
    getSongs();
  }, []);

  return (
    <SafeAreaView style={styles.container} behavior="padding">
      <View style={styles.headerRated}>
        <NavigationArrow onPress={handleNavigation} />
        <Text style={styles.headerText}>Odporúčané pesničky</Text>
      </View>
      <ScrollView>
        <Text style={styles.initialHeader}>Tvoje ohodnotené pesničky!</Text>
        <View style={styles.songContainer}>
          {!!songs.length &&
            songs.map((elem) => (
              <View style={styles.songRow} key={elem.id}>
                <View style={styles.songInfoContainer}>
                  <Text style={styles.songAuthor}>{elem.author}</Text>
                  <Text style={styles.songName}>{elem.name}</Text>
                </View>
                <StarRating rating={elem.rating} onChange={() => {}} />
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RatedSongsScreen;
