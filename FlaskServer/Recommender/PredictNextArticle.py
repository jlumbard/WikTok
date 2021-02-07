import requests
import random
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import UtilityFunctions.CosmosDBUtilities as CosmosUtilities

#This will host a series of prediction algorithm candidates, one of which will be selected to be deployed to production

# def predictNextArticlev1():
#     #this just returns a random response
#     # res = requests.get('https://en.wikipedia.org/wiki/Special:Random')
  
#     items = CosmosUtilities.getArticlesV2()
#     metadata = pd.DataFrame(items)
#     print(metadata)
#     # print(res.url)
#     return res.url

def computeCosineSim():

    items = CosmosUtilities.getArticlesV2()
    metadata = pd.DataFrame(items)
    
    # Figure out API call to DB for dataset
    #metadata = pd.read_csv("SampleWikiDB-v1.csv")

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

    titlesArray = ['Toronto_Raptors','Toronto_Maple_Leafs', 'Tyler,_the_Creator']
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
            similarArticles.append('https://en.wikipedia.org/wiki/' + res[i])

    
    print('THE LENGTH OF SIMILARARTICLES IS: ' + str(len(similarArticles)))
    print(similarArticles)
    index = random.randint(0,len(similarArticles)-1)
    print("THE INDEX IS: " + str(index))
    
    #return the top 5 most similar articles
    print('THE URL IS: ' +similarArticles[index])
    return similarArticles[index]
