import * as firebase from "firebase";
import { recommendSongs } from "../logic/recommendSongs";
import { computeSimilarity } from "../logic/recommendSongs";
import { firebaseConfig } from "../firebase";

let ratings;

beforeAll(async () => {
  // Initialize Firebase
  // if (firebase.apps.length === 0) {
  //   app = firebase.initializeApp(firebaseConfig);
  // } else {
  //   app = firebase.app();
  // }

  // create test ratings matrix
  ratings = [
    [0, 0, 3, 0, 1, 5, 0, 1.5, 0, 0.5],
    [2, 0, 0, 2, 1, 5, 0, 1.5, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 4, 0, 0, 1, 5, 0, 1.5, 0, 0],
    [4, 0, 3, 0, 1, 5, 0, 0, 0, 2],
    [0, 0, 1.5, 0, 1, 0, 0, 1.5, 4, 0],
    [2.5, 0, 2, 0, 1, 5, 3, 0.5, 0, 0],
    [0, 1, 0, 4, 1, 3, 2, 1.5, 0, 1],
    [0.5, 0, 3, 0, 1, 2, 0, 1.5, 0, 0],
    [0, 0, 3, 0, 0, 5, 1, 1.5, 0, 0],
  ];
});

afterAll(() => {
  // Kill this firebase app.
  firebase.app().delete();
});

describe("recommendSongs", () => {
  // Test case 1: Test with valid inputs
  it("should return an array of recommended songs", async () => {
    const userId = 1;
    const userCountry = "Slovakia";
    const userYear = "1990";
    const numRecommendations = 5;
    const first = true;

    const recommendations = await recommendSongs(
      userId,
      userCountry,
      userYear,
      numRecommendations,
      ratings,
      first
    );

    expect(recommendations).toHaveLength(numRecommendations);
    expect(Array.isArray(recommendations)).toBeTruthy();
  });

  it("should return an array of recommended songs considering country and year", async () => {
    const userId = 1;
    const userCountry = "Slovakia";
    const userYear = "1990";
    const numRecommendations = 5;
    const first = false;

    const recommendations = await recommendSongs(
      userId,
      userCountry,
      userYear,
      numRecommendations,
      ratings,
      first
    );

    expect(recommendations).toHaveLength(numRecommendations);
    expect(Array.isArray(recommendations)).toBeTruthy();
  });

  // Test case 2: Test with missing user ratings
  it("should throw an error when user ratings are missing", async () => {
    const userId = 10;
    const userCountry = "Slovakia";
    const userYear = "1990";
    const numRecommendations = 5;
    const first = false;

    await expect(
      recommendSongs(
        userId,
        userCountry,
        userYear,
        numRecommendations,
        ratings,
        first
      )
    ).rejects.toThrow("Bad request");
  });

  // Test case 3: Test with empty ratings
  it("should return an empty array when ratings are empty", async () => {
    const userId = 1;
    const userCountry = "Slovakia";
    const userYear = "1990";
    const numRecommendations = 5;
    const ratings = [];
    const first = false;

    const recommendations = await recommendSongs(
      userId,
      userCountry,
      userYear,
      numRecommendations,
      ratings,
      first
    );

    expect(recommendations).toHaveLength(0);
    expect(Array.isArray(recommendations)).toBeTruthy();
  });

  // Test case 4: Test with a small number of ratings and recommendations
  it("should return an array of recommended songs with a small number of ratings and recommendations", async () => {
    const userId = 0;
    const userCountry = "Slovakia";
    const userYear = "1990";
    const numRecommendations = 2;
    const ratings2 = [
      [4, 0, 0],
      [1, 3, 4],
      [5, 2, 3],
    ];
    const first = false;

    const recommendations = await recommendSongs(
      userId,
      userCountry,
      userYear,
      numRecommendations,
      ratings2,
      first
    );

    expect(recommendations).toHaveLength(numRecommendations);
    expect(Array.isArray(recommendations)).toBeTruthy();
  });

  // Test case 5: Test with no similar users
  it("should return an empty array when there are no similar users", async () => {
    const userId = 1;
    const userCountry = "Slovakia";
    const userYear = "1990";
    const numRecommendations = 5;
    const ratings3 = [
      [0, 0, 3, 0, 1, 5, 0, 1.5, 0, 0.5],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 4, 0, 0, 1, 5, 0, 1.5, 0, 0],
      [4, 0, 3, 0, 1, 5, 0, 0, 0, 2],
      [0, 0, 1.5, 0, 1, 0, 0, 1.5, 4, 0],
      [2.5, 0, 2, 0, 1, 5, 3, 0.5, 0, 0],
      [0, 1, 0, 4, 1, 3, 2, 1.5, 0, 1],
      [0.5, 0, 3, 0, 1, 2, 0, 1.5, 0, 0],
      [0, 0, 3, 0, 0, 5, 1, 1.5, 0, 0],
    ];
    const first = false;

    const recommendations = await recommendSongs(
      userId,
      userCountry,
      userYear,
      numRecommendations,
      ratings3,
      first
    );

    expect(recommendations).toHaveLength(0);
    expect(Array.isArray(recommendations)).toBeTruthy();
  });

  // Test case 6: Test with negative similarity values
  it("should return an array of recommended songs with negative similarity values", async () => {
    // Mock the Math.sqrt function to always return -1
    jest.spyOn(global.Math, "sqrt").mockReturnValue(-1);

    const userId = 1;
    const userCountry = "Slovakia";
    const userYear = "1990";
    const numRecommendations = 5;
    const first = false;

    const recommendations = await recommendSongs(
      userId,
      userCountry,
      userYear,
      numRecommendations,
      ratings,
      first
    );

    expect(recommendations).toHaveLength(numRecommendations);
    expect(Array.isArray(recommendations)).toBeTruthy();
    global.Math.sqrt.mockRestore();
  });
});

describe("computeSimilarity", () => {
  // Test case for same country weight
  it("should add weight to similarities if users have the same country", () => {
    const userId1 = 0;
    const userCountry = "Slovakia";
    const userYear = "1990";
    const userId2 = 1;
    const otherUserCountry = "Slovakia";
    const otherUserYear = "1972";
    const ratings = [
      [0, 3, 4, 0, 5],
      [4, 0, 0, 2, 3],
    ];

    const similarity = computeSimilarity(
      userId1,
      userCountry,
      userYear,
      userId2,
      otherUserCountry,
      otherUserYear,
      ratings
    );

    // Calculate the expected similarity based on the ratings
    const dotProduct = 3 * 0 + 4 * 0 + 5 * 3 + 0 * 2;
    const magnitude1 = Math.sqrt(3 ** 2 + 4 ** 2 + 5 ** 2);
    const magnitude2 = Math.sqrt(4 ** 2 + 2 ** 2 + 3 ** 2);
    const expectedSimilarity = (dotProduct / (magnitude1 * magnitude2)) * 1.2;

    expect(similarity).toBeCloseTo(expectedSimilarity);
  });

  // Test case for similar age weight
  it("should add weight to similarities if users have a similar age", () => {
    const userId1 = 0;
    const userCountry = "Slovakia";
    const userYear = "1990";
    const userId2 = 1;
    const otherUserCountry = "China";
    const otherUserYear = "1988";
    const ratings = [
      [0, 3, 4, 0, 5],
      [4, 0, 0, 2, 3],
    ];

    const similarity = computeSimilarity(
      userId1,
      userCountry,
      userYear,
      userId2,
      otherUserCountry,
      otherUserYear,
      ratings
    );

    // Calculate the expected similarity based on the ratings
    const dotProduct = 3 * 0 + 4 * 0 + 5 * 3 + 0 * 2;
    const magnitude1 = Math.sqrt(3 ** 2 + 4 ** 2 + 5 ** 2);
    const magnitude2 = Math.sqrt(4 ** 2 + 2 ** 2 + 3 ** 2);
    const expectedSimilarity = (dotProduct / (magnitude1 * magnitude2)) * 1.1;

    expect(similarity).toBeCloseTo(expectedSimilarity);
  });

  it("should add weight to similarities if users have the same country and similar age", () => {
    const userId1 = 0;
    const userCountry = "Slovakia";
    const userYear = "1990";
    const userId2 = 1;
    const otherUserCountry = "Slovakia";
    const otherUserYear = "1982";
    const ratings = [
      [0, 3, 4, 0, 5],
      [4, 0, 0, 2, 3],
    ];

    const similarity = computeSimilarity(
      userId1,
      userCountry,
      userYear,
      userId2,
      otherUserCountry,
      otherUserYear,
      ratings
    );

    // Calculate the expected similarity based on the ratings
    const dotProduct = 3 * 0 + 4 * 0 + 5 * 3 + 0 * 2;
    const magnitude1 = Math.sqrt(3 ** 2 + 4 ** 2 + 5 ** 2);
    const magnitude2 = Math.sqrt(4 ** 2 + 2 ** 2 + 3 ** 2);
    const expectedSimilarity = (dotProduct / (magnitude1 * magnitude2)) * 1.3;

    const tolerance = 0.000005; // Set a tolerance for the comparison

    expect(similarity).toBeGreaterThanOrEqual(expectedSimilarity);
  });
});
