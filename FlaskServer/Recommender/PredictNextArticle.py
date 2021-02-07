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

#This will host a series of prediction algorithm candidates, one of which will be selected to be deployed to production


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

def predictNextArticlev2():
   
    # Normalizing data from pageViews and pageViewsTrend
    pageMetrics = CosmosUtilities.getPageMetrics() 
    pageMetrics_data = pd.DataFrame(pageMetrics)
    pageViews = pageMetrics_data['pageViews'].tolist()
    pageViewsTrend = pageMetrics_data['pageViewTrend'].tolist()
    pageMetrics_data['pageViews_zscore'] = stats.zscore(pageViews)
    pageMetrics_data['pageViewsTrend_zscore'] = stats.zscore(pageViewsTrend)
    pageMetrics_data['Adjusted_Page_Views_zscore'] = pageMetrics_data['pageViews_zscore'] * 0.75
    pageMetrics_data['sumOfScores'] = pageMetrics_data['Adjusted_Page_Views_zscore'] + pageMetrics_data['pageViewsTrend_zscore']
    print(np.max(pageMetrics_data['Adjusted_Page_Views_zscore']))
    
    pageMetrics_data = pageMetrics_data.sort_values(by='sumOfScores', ascending=False)
    # print(pageMetrics_data)
    # Returns the top 15 articles
    similarArticles = pageMetrics_data.iloc[:3]['title'].values

    # Removes articles that the user has already read
    modifiedSimilarArticles =  removeArticlesRead(similarArticles)

    index = random.randint(0,len(modifiedSimilarArticles)-1)
    print("THE INDEX IS: " + str(index))
    print('THE URL IS: ' +modifiedSimilarArticles[index])
   
    return modifiedSimilarArticles[index]

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

def predictNextArticlev1():
    #this just returns a random response
    # res = requests.get('https://en.wikipedia.org/wiki/Special:Random')

    # return res.url
  
    titlesArray = ['https://en.wikipedia.org/wiki/Toronto_Raptors','https://en.wikipedia.org/wiki/Toronto_Maple_Leafs', 'https://en.wikipedia.org/wiki/Tyler,_the_Creator','https://en.wikipedia.org/wiki/Barack_Obama']
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

    # print("SIMILAR ARTICLES")
    # print(similarArticles)

    modifiedSimilarArticles =  removeArticlesRead(np.array(similarArticles))

    # print("MODIFIED SIMILAR ARTICLES")
    # print(modifiedSimilarArticles)

    print('THE LENGTH OF SIMILARARTICLES IS: ' + str(len(modifiedSimilarArticles)))
    print(modifiedSimilarArticles)
    index = random.randint(0,len(modifiedSimilarArticles)-1)
    print("THE INDEX IS: " + str(index))
    
    #return the top 5 most similar articles
    print('THE URL IS: ' +modifiedSimilarArticles[index])
    return modifiedSimilarArticles[index]
