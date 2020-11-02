import UtilityFunctions.CosmosDBUtilities as CosmosDBUtilities  # pylint: disable=import-error
from datetime import datetime, timedelta
import json
import requests
from scipy.stats import linregress
from rake_nltk import Rake
from bs4 import BeautifulSoup 
import nltk

#All wikipedia REST documentations:
#https://wikimedia.org/api/rest_v1/#/


# endpoint for pageviews
#https://wikimedia.org/api/rest_v1/metrics/pageviews/
# example page: 
#https://pageviews.toolforge.org/?project=en.wikipedia.org&platform=all-access&agent=user&redirects=0&range=latest-20&pages=University_of_Western_Ontario

#URL format for a regular page, I think scrapeable:
#https://en.wikipedia.org/wiki/Wikipedia:Database_download

def returnDataOnArticle(articleLink):
    #https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/University_of_Regina/daily/2020101000/2020103000
    articleTitle = articleLink.split('/wiki/')[1]
    articleData = {}
    articleData['title'] = articleTitle
    articleData['pageViews'],articleData['pageViewTrend'], articleData['rankedKeywords'] = getMetrics(articleTitle)
    return articleData

def getMetrics(articleTitle):
    end = datetime.today().strftime('%Y%m%d00')
    start = (datetime.today() - timedelta(days=6*30)).strftime('%Y%m%d00')
    pageViewURL = "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/" + articleTitle +"/monthly/"+start+"/"+end
    r = requests.get(pageViewURL)

    pageContentURL = 'https://en.wikipedia.org/wiki/' + articleTitle
    pageR = requests.get(pageContentURL)

    rankedKeywords = getRankedKeywordsFromArticle(pageR)

    totalViews = 0
    viewEachMonth = []
    jsj = json.loads(r.text)
    #Use the below loop for two things: calc the total number of views and the way it is trending last 6 months in an array
    for weeklyMetric in jsj['items']:
        totalViews = totalViews+weeklyMetric['views']
        viewEachMonth.append(weeklyMetric['views'])
    #Now we have total views, get the trend in the data
    trendVal = getViewNumberTrend(viewEachMonth)
    return (totalViews, trendVal, rankedKeywords)

#we could do a unit test here
def getViewNumberTrend(arrayOfValues):
    #The below is like just a 1 to x counter
    defaultCounter = []
    for x in range(0,len(arrayOfValues)):
        defaultCounter.append(x)
    regressResult = linregress(defaultCounter, arrayOfValues)
    return regressResult.slope

def pushDataOnArticle(articleLink):
    articleData = returnDataOnArticle(articleLink)
    CosmosDBUtilities.pushWikiPageData(articleData)
    #This doesn't have any error handling

def getRankedKeywordsFromArticle(articleText):
    #articleText will be the whole html
    #nltk.download()
    soup = BeautifulSoup(articleText.text)
    ps = soup.select("p")
    intro = '\n'.join([ para.text for para in ps])
    rake = Rake()
    rake.extract_keywords_from_text(intro)
    keywordsWithScores = rake.get_ranked_phrases_with_scores()
    top5KeywordsWithScores = [keywordsWithScores[0],keywordsWithScores[1],keywordsWithScores[2],keywordsWithScores[3],keywordsWithScores[4],keywordsWithScores[5],keywordsWithScores[6],keywordsWithScores[7],keywordsWithScores[8],keywordsWithScores[9]]
    return 
