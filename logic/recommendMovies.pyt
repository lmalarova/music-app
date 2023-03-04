import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# example user ratings (1000 users x 1000 movies)
ratings = np.random.randint(0, 5, size=(1000, 1000))
# print(ratings)
# calculate user-user similarity matrix
user_sim = cosine_similarity(ratings)

# print(user_sim)

def recommend_movies(user_id, ratings, user_sim, k=10, n=10):
    """
    Recommends n movies for the given user based on the ratings of k most similar users.
    """
    # find k most similar users
    similar_users = np.argsort(user_sim[user_id])[::-1][1:k+1]
    # predict ratings for unrated movies
    unrated_movies = np.where(ratings[user_id] == 0)[0]
    predicted_ratings = []
    for movie_id in unrated_movies:
        ratings_sum = 0
        sim_sum = 0
        for sim_user_id in similar_users:
            if ratings[sim_user_id, movie_id] > 0:
                ratings_sum += user_sim[user_id, sim_user_id] * ratings[sim_user_id, movie_id]
                sim_sum += user_sim[user_id, sim_user_id]
        if sim_sum > 0:
            predicted_rating = ratings_sum / sim_sum
        else:
            predicted_rating = 0
        predicted_ratings.append(predicted_rating)
    
    # recommend top n movies with highest predicted ratings
    top_movies = np.argsort(predicted_ratings)[::-1][:n]
    recommended_movies = unrated_movies[top_movies]
    return recommended_movies

# recommend 10 movies for user 0
user_id = 0
recommended_movies = recommend_movies(user_id, ratings, user_sim, k=10, n=10)
print(recommended_movies)
