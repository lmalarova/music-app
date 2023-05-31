import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import SignUpScreen from "./screens/SignUpScreen";
import InitialProfileInfoScreen from "./screens/InitialProfileInfoScreen";
import InitialSongsRateScreen from "./screens/InitialSongsRateScreen";
import RecommendedSongsScreen from "./screens/RecommendedSongsScreen";
import SongDetailScreen from "./screens/SongDetailScreen";
import RecommendedSongDetailScreen from "./screens/RecommendedSongDetailScreen";
import LoadingScreen from "./screens/LoadingScreen";
import * as firebase from "firebase";
import { recommendSongs } from "./logic/recommendSongs";

const Stack = createNativeStackNavigator();

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
    20,
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
};

export default function App() {
  let interval;

  interval = setInterval(() => {
    runCode();
  }, 900000); // 900000 milliseconds = 15 minutes

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="SignUp"
          component={SignUpScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="InitialSongsRateScreen"
          component={InitialSongsRateScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="InitialProfileInfoScreen"
          component={InitialProfileInfoScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="RecommendedSongsScreen"
          component={RecommendedSongsScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="SongDetailScreen"
          component={SongDetailScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="RecommendedSongDetailScreen"
          component={RecommendedSongDetailScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="LoadingScreen"
          component={LoadingScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
