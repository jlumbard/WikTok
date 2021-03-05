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
    print("ARTICLELINK")
    print(articleLink)
    #https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/University_of_Regina/daily/2020101000/2020103000
    articleTitle = articleLink.split('/wiki/')[1]
    articleData = {}
    articleData['firstParagraph'], articleData['title'] = returnWikipediaFirstParagraph(articleLink)
    articleData['pageViews'],articleData['pageViewTrend'], articleData['rankedKeywords'] = getMetrics(articleTitle)
    # print("made it to the end of returndataonarticle")
    return articleData

def getMetrics(articleTitle):
    end = datetime.today().strftime('%Y%m%d00')
    start = (datetime.today() - timedelta(days=6*30)).strftime('%Y%m%d00')
    if('?printable=yes' in articleTitle):
        articleTitle = articleTitle.replace('?printable=yes','')

    pageViewURL = "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/" + articleTitle +"/monthly/"+start+"/"+end
    # print(pageViewURL)

    headers= {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "sec-ch-ua": '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "user-agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36'
    }
    r = requests.get(pageViewURL, headers=headers)
    print(r)

    pageContentURL = 'https://en.wikipedia.org/wiki/' + articleTitle
    pageR = requests.get(pageContentURL)

    rankedKeywords = getRankedKeywordsFromArticle(pageR)

    totalViews = 0
    viewEachMonth = []
    # print(r.text)
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
    print(articleLink)
    articleLink = WikipedidCanonicalTitle(articleLink)
    articleData = returnDataOnArticle(articleLink)
    # print("WE HAVE ARRIVED OUTSIDE OF THE FUNCTION")
    articleDoesntExist = CosmosDBUtilities.getArticleByTitle(articleData['title']) #True if it doesn't exist 
    if(articleDoesntExist):
        print("ARTICLE DIDN'T EXIST, PUSHING TO DB")
        CosmosDBUtilities.pushWikiPageData(articleData)
    else:
        print("ARTICLE EXISTED")
    #This doesn't have any error handling

def getRankedKeywordsFromArticle(articleText):
    #articleText will be the whole html
    #nltk.download()
    soup = BeautifulSoup(articleText.text, features="xml")
    ps = soup.select("p")
    intro = '\n'.join([ para.text for para in ps])
    rake = Rake()
    rake.extract_keywords_from_text(intro)
    keywordsWithScores = rake.get_ranked_phrases_with_scores()
    if(len(keywordsWithScores)>=5):
        top5KeywordsWithScores = [keywordsWithScores[0],keywordsWithScores[1],keywordsWithScores[2],keywordsWithScores[3],keywordsWithScores[4]]
        return top5KeywordsWithScores
    else:
        return []

def returnWikipediaFirstParagraph(link):
    r = requests.get(link)
    soup = BeautifulSoup(r.text, features="xml")
    allText=""

    for textChunk in soup.select('.mw-parser-output p'):
        allText = allText + " " + textChunk.text
        if(not textChunk.text.isspace()):
            break
    canonicalTitle = soup.find('link', {'rel':'canonical'})['href']
    return allText, canonicalTitle

def WikipedidCanonicalTitle(link):
    r = requests.get(link)
    soup = BeautifulSoup(r.text, features="xml")
    canonicalTitle = soup.find('link', {'rel':'canonical'})['href']
    return canonicalTitle

