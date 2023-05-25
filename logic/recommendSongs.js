import * as firebase from "firebase";

export async function recommendSongs(
  userId,
  userCountry,
  userYear,
  numRecommendations,
  ratings,
  first
) {
  // Create an object to hold the similarities between users
  let similarities = {};

  ratings = Object.values(ratings);
  // Compute the similarities between the target user and all other users
  for (let i = 1; i < ratings.length; i++) {
    let otherUserId = i;
    let otherUser;

    // console.log(otherUserId);

    if (otherUserId !== userId) {
      let similarity;

      if (first) {
        similarity = computeSimilarity(
          userId,
          userCountry,
          userYear,
          otherUserId,
          null,
          null,
          ratings
        );
      } else {
        let snapshot = await firebase
          .database()
          .ref("users")
          .orderByChild("id") // Use orderByChild method to specify the property to order by
          .equalTo(otherUserId) // Use equalTo method to specify the value to match
          .once("value");
        otherUser = snapshot.val();
        // Compute the similarity between the target user and the other user
        similarity = computeSimilarity(
          userId,
          userCountry,
          userYear,
          otherUserId,
          otherUser.country,
          otherUser.date_birth,
          ratings
        );
      }

      // Add the similarity to the similarities object
      similarities[otherUserId] = similarity;
    }
  }

  // Sort the similarities in descending order
  let sortedSimilarities = Object.entries(similarities).sort(
    (a, b) => b[1] - a[1]
  );

  // console.log(sortedSimilarities);

  // Initialize an object to hold the recommended songs and their scores
  let recommendations = {};

  // Loop over the most similar users and add their rated songs to the recommendations
  for (
    let i = 0;
    i < sortedSimilarities.length;
    // Object.keys(recommendations).length < numRecommendations;
    i++
  ) {
    let otherUserId = sortedSimilarities[i][0];
    let similarity = sortedSimilarities[i][1];

    // console.log(Object.keys(recommendations).length);
    // console.log(otherUserId);

    // Get the songs rated by the other user that the target user has not rated
    let otherUserRatings = ratings[otherUserId];
    let targetUserRatings = ratings[userId];
    // console.log(otherUserRatings);
    let unratedSongs = [];
    for (let i = 0; i < targetUserRatings.length; i++) {
      if (targetUserRatings[i] === 0 && otherUserRatings[i] !== 0) {
        unratedSongs.push(i);
      }
    }

    // Add the unrated songs to the recommendations
    for (
      let j = 0;
      j < unratedSongs.length;
      // Object.keys(recommendations).length < numRecommendations;
      j++
    ) {
      let songId = unratedSongs[j];
      let score = otherUserRatings[songId] * similarity;
      if (!(songId in recommendations)) {
        recommendations[songId] = score;
      } else {
        recommendations[songId] += score;
      }
    }
  }

  // Sort the recommendations in descending order of score
  let sortedRecommendations = Object.entries(recommendations).sort(
    (a, b) => b[1] - a[1]
  );

  // Return the top recommended songs
  return sortedRecommendations.slice(0, numRecommendations).map((r) => r[0]);
}

// compute similarity using Pearson correlation coefficient
function computeSimilarity(
  userId1,
  userCountry,
  userYear,
  userId2,
  otherUserCountry,
  otherUserYear,
  ratings
) {
  // Get the ratings for the two users
  let ratings1 = ratings[userId1];
  let ratings2 = ratings[userId2];

  // Compute the dot product and magnitudes of the two rating vectors
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  for (let songId in ratings1) {
    if (ratings2[songId] != 0 && ratings1[songId] != 0) {
      dotProduct += ratings1[songId] * ratings2[songId];
    }
    magnitude1 += ratings1[songId] ** 2;
  }
  for (let songId in ratings2) {
    magnitude2 += ratings2[songId] ** 2;
  }

  let similarity;
  if (otherUserCountry == null) {
    similarity = dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
  } else {
    // Calculate the age difference between users
    const ageDifference = Math.abs(
      new Date(userYear) - new Date(otherUserYear)
    );
    // Compute the similarity between the two users
    similarity =
      (dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2))) *
      (userCountry === otherUserCountry ? 1.2 : 1) * // Increase weight by 20% if same country
      (ageDifference <= 10 ? 1.1 : 1); // Increase weight by 10% if age difference <= 10 years;
  }

  if (isNaN(similarity)) {
    return 0;
  }

  return similarity;
}
