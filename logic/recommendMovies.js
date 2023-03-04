function recommendMovies(userId, numRecommendations, ratings) {
  // Create an object to hold the similarities between users
  let similarities = {};

  // Compute the similarities between the target user and all other users
  for (let i = 0; i < ratings.length; i++) {
    let otherUserId = ratings[i].userId;
    if (otherUserId !== userId) {
      // Compute the similarity between the target user and the other user
      let similarity = computeSimilarity(userId, otherUserId, ratings);

      // Add the similarity to the similarities object
      similarities[otherUserId] = similarity;
    }
  }

  // Sort the similarities in descending order
  let sortedSimilarities = Object.entries(similarities).sort(
    (a, b) => b[1] - a[1]
  );

  // Initialize an object to hold the recommended movies and their scores
  let recommendations = {};

  // Loop over the most similar users and add their rated movies to the recommendations
  for (
    let i = 0;
    i < sortedSimilarities.length &&
    Object.keys(recommendations).length < numRecommendations;
    i++
  ) {
    let otherUserId = sortedSimilarities[i][0];
    let similarity = sortedSimilarities[i][1];

    // Get the movies rated by the other user that the target user has not seen
    let otherUserRatings = ratings.find(
      (r) => r.userId === otherUserId
    ).ratings;
    let targetUserRatings = ratings.find((r) => r.userId === userId).ratings;
    let unratedMovies = Object.keys(otherUserRatings).filter(
      (m) => !(m in targetUserRatings)
    );

    // Add the unrated movies to the recommendations
    for (
      let j = 0;
      j < unratedMovies.length &&
      Object.keys(recommendations).length < numRecommendations;
      j++
    ) {
      let movieId = unratedMovies[j];
      let score = otherUserRatings[movieId] * similarity;
      if (!(movieId in recommendations)) {
        recommendations[movieId] = score;
      } else {
        recommendations[movieId] += score;
      }
    }
  }

  // Sort the recommendations in descending order of score
  let sortedRecommendations = Object.entries(recommendations).sort(
    (a, b) => b[1] - a[1]
  );

  // Return the top recommended movies
  return sortedRecommendations.slice(0, numRecommendations).map((r) => r[0]);
}

// compute similarity using Pearson correlation coefficient
function computeSimilarity(userId1, userId2, ratings) {
  // Get the ratings for the two users
  let ratings1 = ratings.find((r) => r.userId === userId1).ratings;
  let ratings2 = ratings.find((r) => r.userId === userId2).ratings;

  // Compute the dot product and magnitudes of the two rating vectors
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  for (let movieId in ratings1) {
    if (movieId in ratings2) {
      dotProduct += ratings1[movieId] * ratings2[movieId];
    }
    magnitude1 += ratings1[movieId] ** 2;
  }
  for (let movieId in ratings2) {
    magnitude2 += ratings2[movieId] ** 2;
  }

  // Compute the similarity between the two users
  let similarity = dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
  if (isNaN(similarity)) {
    return 0;
  }
  return similarity;
}
