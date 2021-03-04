import requests
import random
import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import UtilityFunctions.CosmosDBUtilities as CosmosUtilities
from flask import session
from Models.user import user
import numpy as np
from scipy import stats
import jenkspy


def removeArticlesRead(similarArticles):
    
    # Convert from numpy to list
    similarArticles = similarArticles.tolist()
    # Read and store userID and then query the interactions table based on that id to return articles read
    userID = session['user']['id']
    articlesReadJSON = CosmosUtilities.getArticlesRead(userID)
    articlesRead = []

    # Convert dictionary to array for articles
    for article in articlesReadJSON:
        nameOfArticle = article['article']
        articlesRead.append(nameOfArticle)
    
    # Remove articles that the user has already read and return modified array of articles
    for article in articlesRead:
        if article in similarArticles:
            similarArticles.remove(article)
    
    return similarArticles

def getPopularityBasedRecs():
   
    # Normalizing data from pageViews and pageViewsTrend
    pageMetrics = CosmosUtilities.getPageMetrics() 
    pageMetrics_data = pd.DataFrame(pageMetrics)
    pageViews = pageMetrics_data['pageViews'].tolist()
    pageViewsTrend = pageMetrics_data['pageViewTrend'].tolist()
    pageMetrics_data['pageViews_zscore'] = stats.zscore(pageViews)
    pageMetrics_data['pageViewsTrend_zscore'] = stats.zscore(pageViewsTrend)
    pageMetrics_data['Adjusted_Page_Views_zscore'] = pageMetrics_data['pageViews_zscore'] * 0.75
    pageMetrics_data['sumOfScores'] = pageMetrics_data['Adjusted_Page_Views_zscore'] + pageMetrics_data['pageViewsTrend_zscore']
    # print(np.max(pageMetrics_data['Adjusted_Page_Views_zscore']))
    
    pageMetrics_data = pageMetrics_data.sort_values(by='sumOfScores', ascending=False)
    # print(pageMetrics_data)
    # Returns the top 15 articles
    similarArticles = pageMetrics_data.iloc[:3]['title'].values

    # Removes articles that the user has already read
    modifiedSimilarArticles =  removeArticlesRead(similarArticles)

    # index = random.randint(0,len(modifiedSimilarArticles)-1)
    # print("THE INDEX IS: " + str(index))
    # print('THE URL IS: ' +modifiedSimilarArticles[index])
   
    return modifiedSimilarArticles

def computeCosineSim():

    items = CosmosUtilities.getArticlesV2()
    metadata = pd.DataFrame(items)
    
    #define a TF-IDF vectorizer object. remove all english stop words such as 'the', 'a'
    tfidf = TfidfVectorizer(stop_words='english')

    #replace NaN values with an empty string
    metadata['firstParagraph'] = metadata['firstParagraph'].fillna('')

    #construct the required TF-IDF matrix by fitting and transforming the data
    tfidf_matrix = tfidf.fit_transform(metadata['firstParagraph'])

    #since we have already vectorized the matrix, we can directly take the dot prodcut to find the cosine similarity 
    #thus, we can use sklearn's linear_kernel() instead of consine_similarity() since it is faster
    #compute cos similarity matrix, which returns each article's cos siilarity score with every other article based on overview

    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

    return cosine_sim, metadata

def getContentBasedRecs(userID):

    OnboardingItems = CosmosUtilities.getUsersOnboardedArticles(userID)
    #Filter it to just the ArticleNames
    articleNames =[]
    for articleInteraction in OnboardingItems:
        articleNames.append(articleInteraction['article'].replace('?printable=yes',""))


    #this just returns a random response
    # res = requests.get('https://en.wikipedia.org/wiki/Special:Random')

    # return res.url
  
    # titlesArray = ['https://en.wikipedia.org/wiki/Toronto_Raptors','https://en.wikipedia.org/wiki/Toronto_Maple_Leafs', 'https://en.wikipedia.org/wiki/Tyler,_the_Creator']
    titlesArray = articleNames
    #Changed from hardcoded.
    
    #input var title is array of "liked" titles that were inputted by the user through onboarding
    cosine_sim, metadata = computeCosineSim()
    similarArticles = []
    #construct a reverse map of indices and article titles
    indices = pd.Series(metadata.index, index=metadata['title']).drop_duplicates()
    for i in titlesArray:
        idx = indices[i]

        #get pairwise similarity scores of all article with that title
        sim_scores = list(enumerate(cosine_sim[idx]))

        #sort the scores of the 10 most similar articles
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        #get the scores of the 3 most similar articles
        sim_scores = sim_scores[1:4]

        #get the article indices
        article_indices = [i[0] for i in sim_scores]

        titleOfArticle = metadata['title'].iloc[article_indices]
        titleOfArticle = titleOfArticle.to_numpy()
        res = [article.replace(' ', '_') for article in titleOfArticle]
        
        #iterate through the list of titles of articles and append wikipedia url
        for i in range (len(titleOfArticle)):
            similarArticles.append(res[i])

    modifiedSimilarArticles =  removeArticlesRead(np.array(similarArticles))

    return modifiedSimilarArticles

def predictNextArticlev1(currentURL, userID):
    print('THE CURRENT URL IS: ')
    print(currentURL)
    contentBasedRecs = getContentBasedRecs(userID)
    popularityBasedRecs = getPopularityBasedRecs()
    
    allInitialRecommendations = contentBasedRecs + popularityBasedRecs

    # loop through all initial recommendations and check if the currentURL is recommended, remove if true

    for x in allInitialRecommendations:
        if x == currentURL:
            allInitialRecommendations.remove(currentURL)

    # for i in range (len(allInitialRecommendations)-1):
    #     if (allInitialRecommendations[i] == currentURL):
    #         allInitialRecommendations.remove(currentURL)

    # # return array of all initial recommendations
    # articles.append(allInitialRecommendations)

    if not allInitialRecommendations:
        CFRecommendations = collaborativeFiltering()
        # articles.append(CFRecommendations)
        for i in range (len(CFRecommendations)-1):
            if (CFRecommendations[i] == currentURL):
                CFRecommendations.remove(currentURL)
        print('PROVIDING COLLABORATIVE FILTERING RECOMMENDATION...')
        index = random.randint(0,len(CFRecommendations)-1)
        CFRecommendationsWithoutPrintables = []
        print(CFRecommendationsWithoutPrintables)
        for x in CFRecommendations:
            #Sometimes the links pulled from the database have "printable" appended at the end. 
            #remove it if so.
            if('?printable=yes' in x):
                CFRecommendationsWithoutPrintables.append(x.replace('?printable=yes',''))
            else:
                CFRecommendationsWithoutPrintables.append(x)
        return CFRecommendationsWithoutPrintables[index]
    else:
        print("PROVIDING CONTENT/POPULARITY BASED RECOMMENDATION...")
        index = random.randint(0,len(allInitialRecommendations)-1)
       
        # print(allInitialRecommendations)
        return allInitialRecommendations[index]

def collaborativeFiltering():
    userRatingsData = CosmosUtilities.getUserRatingsData()
    userRatingsDataDf = pd.DataFrame(userRatingsData).fillna(0)
    userRatingsDataDf['timeSpent'] = abs(userRatingsDataDf['timeSpent'].values)
    userRatingsDataDf['liked'] = userRatingsDataDf['liked'].values.astype(str)
    userRatingsDataDf = userRatingsDataDf.sort_values(by="timeSpent")
    breaks = jenkspy.jenks_breaks(userRatingsDataDf['timeSpent'], nb_class = 3)
    userRatingsDataDf["timeSpent"] = pd.cut(userRatingsDataDf["timeSpent"], 
                                               bins = breaks, 
                                               labels = ['low', 'med', 'high'],
                                              include_lowest=True)
    
    numeric_categories = {"timeSpent": {"low": 1, "med": 2, "high": 3},
    "liked":{"0":0, "False": 0, "True": 2}}
    userRatingsDataDf = userRatingsDataDf.replace(numeric_categories)
    userRatingsDataDf['rating'] = userRatingsDataDf.timeSpent.values + userRatingsDataDf.liked.values
    # print("RATINGS: ", userRatingsDataDf['rating'].values)
    ratingsTable = userRatingsDataDf.pivot_table(index=['article'], columns=['user'], values='rating').fillna(0)
    # print("RATINGS TABLE: ", ratingsTable.values)
    # print("Matrix before factorization: ")
    # print(ratingsTable)
    mf = matrixFactorization(ratingsTable.values, K=3, alpha=0.1, beta=0.0001, iterations=200)
    mf.train()
    # print("Matrix after factorization: ")
    # print(mf.full_matrix())
    ratingsTable = ratingsTable.reset_index()
    columns = ratingsTable.columns.values.tolist()
    columns.pop(0) 
    # print(columns)
    df = pd.DataFrame(mf.full_matrix(), columns = columns )
    df['article'] = ratingsTable['article'].values
    df.set_index('article', inplace = True)
    recommendedArticles = getCFArticles(df).tolist()
    

    return recommendedArticles

def getCFArticles(df):
    userID = session['user']['id']
    recommendationValues = df[userID]
    df = df.loc[:, df.columns == userID]
    articlesUnread = removeArticlesRead(df.index.values)
    filtered_df = df[df.index.isin(articlesUnread)]
    filtered_df = filtered_df.sort_values(by=userID, ascending=False)
    recommendedArticles = filtered_df.iloc[:10]
    recommendedArticles = recommendedArticles.index.values

    return recommendedArticles

class matrixFactorization():

    def __init__(self, R, K, alpha, beta, iterations):
        """
        Perform matrix factorization to predict empty
        entries in a matrix.

        Arguments
        - R (ndarray)   : user-item rating matrix
        - K (int)       : number of latent dimensions
        - alpha (float) : learning rate
        - beta (float)  : regularization parameter
        """

        self.R = R
        self.num_users, self.num_items = R.shape
        self.K = K
        self.alpha = alpha
        self.beta = beta
        self.iterations = iterations

    def train(self):
        # Initialize user and item latent feature matrice
        self.P = np.random.normal(scale=1./self.K, size=(self.num_users, self.K))
        self.Q = np.random.normal(scale=1./self.K, size=(self.num_items, self.K))

        # Initialize the biases
        self.b_u = np.zeros(self.num_users)
        self.b_i = np.zeros(self.num_items)
        self.b = np.mean(self.R[np.where(self.R != 0)])

        # Create a list of training samples
        self.samples = [
            (i, j, self.R[i, j])
            for i in range(self.num_users)
            for j in range(self.num_items)
            if self.R[i, j] > 0
        ]

        # Perform stochastic gradient descent for number of iterations
        training_process = []
        for i in range(self.iterations):
            np.random.shuffle(self.samples)
            self.sgd()
            mse = self.mse()
            training_process.append((i, mse))
            # if (i+1) % 10 == 0:
                # print("Iteration: %d ; Mean Squared Error = %.4f" % (i+1, mse))

        return training_process

    def mse(self):
        """
        A function to compute the total mean square error
        """
        xs, ys = self.R.nonzero()
        predicted = self.full_matrix()
        error = 0
        for x, y in zip(xs, ys):
            error += pow(self.R[x, y] - predicted[x, y], 2)
        return np.sqrt(error)

    def sgd(self):
        """
        Perform stochastic gradient descent
        """
        for i, j, r in self.samples:
            # Computer prediction and error
            prediction = self.get_rating(i, j)
            e = (r - prediction)

            # Update biases
            self.b_u[i] += self.alpha * (e - self.beta * self.b_u[i])
            self.b_i[j] += self.alpha * (e - self.beta * self.b_i[j])

            # Update user and item latent feature matrices
            self.P[i, :] += self.alpha * (e * self.Q[j, :] - self.beta * self.P[i,:])
            self.Q[j, :] += self.alpha * (e * self.P[i, :] - self.beta * self.Q[j,:])

    def get_rating(self, i, j):
        """
        Get the predicted rating of user i and item j
        """
        prediction = self.b + self.b_u[i] + self.b_i[j] + self.P[i, :].dot(self.Q[j, :].T)
        return prediction

    def full_matrix(self):
        """
        Computer the full matrix using the resultant biases, P and Q
        """
        return self.b + self.b_u[:,np.newaxis] + self.b_i[np.newaxis:,] + self.P.dot(self.Q.T)

# return list of articles
def returnRecsForSideTab(currentURL, userID):

    articles = []
    print('THE CURRENT URL IS: ')
    print(currentURL)
    contentBasedRecs = getContentBasedRecs(userID)
    popularityBasedRecs = getPopularityBasedRecs()
    CFRecommendations = collaborativeFiltering()
    
    articles = contentBasedRecs + popularityBasedRecs + CFRecommendations

    # loop through all initial recommendations and check if the currentURL is recommended, remove if true
    for i in range (len(articles)-1):
        if (articles[i] == currentURL):
            articles.remove(currentURL)
  

    RecommendationsWithoutPrintables = []
        # print(CFRecommendationsWithoutPrintables)
    for x in articles:
        #Sometimes the links pulled from the database have "printable" appended at the end. 
        #remove it if so.
        if('?printable=yes' in x):
            RecommendationsWithoutPrintables.append(x.replace('?printable=yes',''))
        else:
            RecommendationsWithoutPrintables.append(x)
    
  
   

    recommendationsNoDuplicates = []
    for x in RecommendationsWithoutPrintables:
        if x not in recommendationsNoDuplicates:
            recommendationsNoDuplicates.append(x)

    print("articles list for side tab: ")
    print(recommendationsNoDuplicates)

    print("length: ")
    print(len(recommendationsNoDuplicates))
    return recommendationsNoDuplicates


