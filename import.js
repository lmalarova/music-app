// In your index.js
const { initializeFirebaseApp, restore } = require("firestore-export-import");
const serviceAccount = require("./serviceAccountKey.json");
var admin = require("firebase-admin");

const databaseURL =
  "https://bachelor-thesis-app-12cc5-default-rtdb.europe-west1.firebasedatabase.app";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://bachelor-thesis-app-12cc5-default-rtdb.europe-west1.firebasedatabase.app",
});

// // Initiate Firebase App
// // appName is optional, you can omit it.
// initializeFirebaseApp(serviceAccount, databaseURL);

// // Start importing your data
// // The array of date, location and reference fields are optional
// restore("./import.json").catch((e) => {
//   console.log(e);
// });

// Get a reference to the Firestore collection
const collectionRef = admin.firestore().collection("users");

// Read the JSON data
const jsonData = require("./import.json");

// Define the batch size
const batchSize = 500;

// Divide the data into batches
const data = jsonData.data;
const batches = [];
for (let i = 0; i < data.length; i++) {
  // const batch = admin.firestore().batch();
  collectionRef.doc().set({
    i: {},
  });
  for (let j = 0; j < data[i].length; j++) {
    // const row = data[j];
    // const docRef = collectionRef.doc(j);
    // batch.set(docRef, {
    //   name: row[0],
    //   age: row[1],
    //   gender: row[2],
    // });
    collectionRef.doc().set({
      j: data[i][j],
    });
  }
  // batches.push(batch);
}

// Write the batches to Firestore
// batches.forEach((batch) => {
//   batch.commit();
// });
