import requests

#This will host a series of prediction algorithm candidates, one of which will be selected to be deployed to production

def predictNextArticlev1():
    #this just returns a random response
    res = requests.get('https://en.wikipedia.org/wiki/Special:Random')
    return res.url
