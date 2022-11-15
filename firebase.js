// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBF2qvacPTPTww6fUjqfJ-E2cJNnSvOPZw",
  authDomain: "bachelor-thesis-app-12cc5.firebaseapp.com",
  databaseURL:
    "https://bachelor-thesis-app-12cc5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bachelor-thesis-app-12cc5",
  storageBucket: "bachelor-thesis-app-12cc5.appspot.com",
  messagingSenderId: "933215841352",
  appId: "1:933215841352:web:809224f204d8a8ba5d7c7d",
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();

export function writeUserData(userId, email) {
  firebase
    .database()
    .ref("users/" + userId)
    .set({
      email: email,
    });
}

firebase
  .database()
  .ref("users/Jwc4JkXU75Va1XscdT0kPbWvIJc2")
  .set({
    email: "test12@gmail.com",
    nickname: "test",
    ratedSongs: [
      {
        songId: "12345",
        rating: 4,
      },
      {
        ratedSong: "12346",
        rating: 1,
      },
    ],
    recommendedSongs: ["12", "123"],
    nowPlayingSong: "12345",
  });

firebase.database().ref("songs/12345").set({
  name: "Lazy Song",
  author: "Bruno Mars",
  genre: "Pop",
});

firebase.database().ref("songs/12346").set({
  name: "My heart will go on",
  author: "Celine Dion",
  genre: "Pop",
});

export { auth };
