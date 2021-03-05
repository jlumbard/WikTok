from flask import Flask, flash, request, redirect, url_for, render_template, send_from_directory, session, jsonify, make_response
import os
import sys
import UtilityFunctions.SQLDBUtilities as DBUtilities
import UtilityFunctions.CosmosDBUtilities as CosmosUtilities
import UtilityFunctions.SessionUtilities as SessionUtilities
import Recommender.PredictNextArticle as PredictNextArticle
import UtilityFunctions.ArticleDataUtilities as ArticleDataUtilities
from flask_cors import CORS, cross_origin
import pandas as pd
import random
import datetime

#TO RUN:
#export FLASK_APP=main.py
#export FLASK_DEBUG=1
#flask run
# need to be in the /FlaskServer directory. 


app = Flask(__name__)
#context = ('server.crt', 'server.key')#certificate and key files
#app.run(debug=True, ssl_context=context)


app.config['SESSION_COOKIE_SAMESITE'] = "None"
app.config['SESSION_COOKIE_SECURE'] = True
CORS(app, supports_credentials=True)
if sys.version_info[0] < 3:
    raise Exception("Must be using Python 3")
app.secret_key = '\xf0\x07\xee\xa1\xde\x92cQp\x8e\x0c\xf7\x9f\xd3x\xfa\xb1\xd0\x03\xfdIq\xe3'

@app.before_request
def before_request():
    if not request.is_secure and not app.debug:
        url = request.url.replace("http://", "https://", 1)
        code = 301
        return redirect(url, code=code)

@app.route('/')
@app.route('/index')
def homeTestPage():
    print(session)
    if(session.get('user',False)):
        return ("Hello from WikTok! You are signed in.")
    else:
        return ("Hello from WikTok! You are NOT signed in. Sign in at <a href='/logIn'>/logIn</a>")

@app.route('/getNextArticleRedirect',methods=['GET'])
@cross_origin()
def getNextArticleRedirect():
    return redirect(getNextArticle())

@app.route('/getNextArticle',methods=['GET'])
@cross_origin(supports_credentials=True, origin=['https://en.wikipedia.org/', 'https://127.0.0.1/'])
def getNextArticle():
    # print(session.get('user',None))
    # print(session)
    #probably passes the userID or guid on their session. 
    #article they're currently on and their engagement with it should already be pushed, seperate endpoint.
    # or should it?
    #returns, next article to nav to and then client side javascript just redirects them there.
    print("Current Article is:")
    print(request.args.get('currentURL',None))
    currentURL = request.args.get('currentURL',None)
    if( not session.get('user',False)):
        print("user not in session")
        return redirect(url_for('homeTestPage'))
    

    nextArticleUrl = PredictNextArticle.predictNextArticlev1(currentURL,session['user']['id'])
    ArticleDataUtilities.pushDataOnArticle(nextArticleUrl)
    print(nextArticleUrl)
    return nextArticleUrl

@app.route('/pushUserInteractionData',methods=['POST'])
@cross_origin(supports_credentials=True, origin=['https://en.wikipedia.org/', 'https://127.0.0.1/'])
def pushUserInteraction():
    print("PUSH USER")
    #Check that they're logged in. This is an API enpoint, so it is ok if these are in the request. 
    #The below might work without params, depends how API works with session
    loggedIn = SessionUtilities.checkLoggedIn()
    print(loggedIn)
    if(loggedIn == False):
        #probs returning a redirect would be better
        print("Not logged in")
        return "Error"
    
    #don't need these things anymore
    ModifiedUserInteraction = request.json
    ModifiedUserInteraction['user'] = session['user']['id']
    #passes info in a POST request about what the user did. No return type
    # how long did they spend on the article. What is the content of the article?
    # did they click on anything? 
    print("pushing interaction")
    CosmosUtilities.pushUserData(ModifiedUserInteraction)
    # THis data is all used to then push to the database so we know more about user tendencies. 
    return "True"

@app.route('/insert',methods=['GET'])
@cross_origin()
def getInsert():
    return render_template('LeftRightArrows.html')

@app.route('/getRecentStats',methods=['GET'])
@cross_origin(supports_credentials=True, origin=['https://en.wikipedia.org/', 'https://127.0.0.1/'])
def getRecentStats():
    if( not session.get('user',False)):
        return "ERROR"
    allArticles = CosmosUtilities.getAllArticlesReadData(session['user']['id'])
    #convert back to datetime
    articlesRead = 0
    minutesRead = 0
    for x in allArticles:
        if(x.get('datePushed',False)):
            x['datePushed'] = datetime.datetime.strptime(x['datePushed'].replace('"',''),"%d/%m/%Y %H:%M:%S")
            if(x['datePushed'] >= datetime.datetime.now() - datetime.timedelta(hours=24)):
                #if its less than a day old
                articlesRead += 1
                minutesRead += abs(x['timeSpent'])
    favoriteTopic = "Music"
    mostRecentTopic = "Music"
    return {'articlesRead':articlesRead, 'minutesRead':minutesRead,'favoriteTopic':favoriteTopic,'mostRecentTopic':mostRecentTopic}

@app.route('/getUser',methods=['GET'])
@cross_origin(supports_credentials=True, origin=['https://en.wikipedia.org/', 'https://127.0.0.1/', 'http://127.0.0.1/'])
def getUserInfo():
    print(session)
    if(session.get('user',False)):
        sessionUser = CosmosUtilities.getUserIdBySessionKey(session['sessionID'])
        #passes back too much...
        return CosmosUtilities.getUserByID(sessionUser['userID'])
    else:
        return ("Redirect Should happen here")

@app.route('/signUp',methods=['POST'])
@cross_origin(supports_credentials=True, origin=['https://en.wikipedia.org/', 'https://127.0.0.1/', 'http://127.0.0.1/'])
def signUp():
    print(request.json)
    print(request.json['fname'])
    print("sign up ")
    emailExists = CosmosUtilities.getUser(request.json['email'])
    print(emailExists)
    if(emailExists == None):
        CosmosUtilities.addUser(request.json['email'], request.json['password'],request.json['fname'],request.json['lname'],1)
        #SHould probs actually return a redirect. 
        print("success in sign up.")
        return "SUCCESS"
    else:
        print("failed sign up")
        return "FAILED"
        #Fails because user already exists


@app.route('/signIn', methods=['GET','POST'])
@cross_origin(supports_credentials=True, origin=['https://en.wikipedia.org/', 'https://127.0.0.1/', 'http://127.0.0.1:3000'])
def signIn():
    print('signin')
    print(request.json)
    username = request.json.get('uname',None)
    pword = request.json.get('pword',None)

    #With incorrect credentials
    if(username == None or pword == None):
        return "Error"

    if(CosmosUtilities.checkUser(request.json['uname'], request.json['pword'])):
        print("SIGNED IN!")
        user = CosmosUtilities.getUser(request.json['uname'])
        SessionUtilities.addSessionCookie(user)
        return user
    else:
        print("NOT SIGNED IN.")
        # Add some sort of flag here for something didn't work
        session['alert'] = "Incorrect credentials"
        return "error",404

@app.route('/logIn', methods=['GET'])
def logInPage():
    return render_template('login.html')

@app.route('/getPopularityBasedRecs', methods=['GET'])
@cross_origin(supports_credentials=True, origin=['https://en.wikipedia.org/', 'https://127.0.0.1/', 'http://127.0.0.1:3000'])
def getPopularityBasedRecs():
    if(not session.get('user',False)):
        return "Error"
    pBasedRecs = PredictNextArticle.returnRecsForSideTab(request.args.get('currentURL',None),session['user']['id'])
    return {'arr':pBasedRecs}

@app.route('/AddDataScripting', methods=['GET'])
def AddData():
    df = pd.read_csv('/Users/brocklumbard/Desktop/SampleWikiDB-v1.csv')
    for i,row in df.iterrows():
        print("pushing "+ df.at[i,'title'])
        ArticleDataUtilities.pushDataOnArticle('https://en.wikipedia.org/wiki/' + df.at[i,'title'].replace(' ','_'))

    return "AddedData!"

@app.route('/getData', methods=['GET'])
def getData():
    print(pd.DataFrame(CosmosUtilities.getArticles()))
    return pd.DataFrame(CosmosUtilities.getArticles())

@app.route('/signOut', methods=['GET'])
def signOutPage():
    if(session.get('sessionID')):
        session.pop('sessionID')
    if(session.get('user')):
        session.pop('user')
    return redirect(url_for('homeTestPage'))

@app.route('/signUp', methods=['GET'])
def signUpPage():
    return render_template('SignUp.html')

@app.route('/test',methods=['GET'])
def test():
    print("test")
    return('test')

@cross_origin(supports_credentials=True, origin=['https://en.wikipedia.org/', 'https://127.0.0.1/', 'http://127.0.0.1:3000'])
@app.route('/getOnboardArticles', methods=['GET'])
def getOnboardingArticles():
    onboardingArticles = {'Sports': ['Toronto Raptors', 'National Basketball Association', "Larry O'Brien Trophy", 'Boston Celtics', 'Dallas Mavericks', 'Atlanta Hawks', 'List of National Basketball Association awards', 'Toronto Maple Leafs', 'National Hockey League', 'Edmonton Oilers', 'Boston Bruins'], 'Music': ['Nas', '2pac', 'Jay-z', 'Run-DMC', 'Tyler, the Creator', 'Drake', 'Beyoncé', 'Brockhampton', 'Kanye West', 'A Tribe Called Quest'], 'Entertainment': ['Fornite', 'PlayStation 5', 'Twitch gameplay', 'Call of Duty: Black Ops', 'Xbox Series X and Series S', 'Rocket League', 'League of Legends', 'Dumpling', 'Big Mac', 'Poutine', 'Hamburger', 'Hot dog', 'Pretzel', 'Gordon Ramsay', 'Fried dough'], 'News': ['Apple', 'Android', 'Cloud Computing', 'Microsoft', 'Amazon', 'Huawei', 'Facebook', 'Instagram', 'Sony', 'Toshiba', 'Donald Trump', 'Joe Biden', 'Barack Obama', 'Constitution of the United States', 'Democracy', 'Republican Party', 'Democratic Party']}
    randomizedOnboardingArticles = onboardingArticles
    #shuffle the list and grab a random 3 from each category
    for articleCategory in onboardingArticles:
        print(articleCategory)
        random.shuffle(randomizedOnboardingArticles[articleCategory])
        randomizedOnboardingArticles[articleCategory] = randomizedOnboardingArticles[articleCategory][:3]
        newArticles=[]
        for article in randomizedOnboardingArticles[articleCategory]:
            newArticles.append('https://en.wikipedia.org/wiki/'+article.replace(" ","_"))
        randomizedOnboardingArticles[articleCategory] = newArticles

    return randomizedOnboardingArticles

@cross_origin(supports_credentials=True, origin=['https://en.wikipedia.org/', 'https://127.0.0.1/', 'http://127.0.0.1:3000', 'http://127.0.0.1/', 'http://localhost:3000'])
@app.route('/pushOnboardArticles', methods=['POST'])
def pushOnboardingArticles():
    CosmosUtilities.markUserOnboarded(session['user']['id'])
    print(request.json)
    for link in request.json:
        CosmosUtilities.pushOnboardedArticles(link,session['user']['id'])
    return {"status":"Confirmed"}

@app.route('/randomOnboardTest', methods=['GET'])
def randomOnboardTest():
    return str(CosmosUtilities.getUsersOnboardedArticles('cac374ab-932a-43db-9b8e-d4eb930adff4'))

if __name__ == '__main__':
    app.run(ssl_context=('server.crt', 'server.key'), debug=True)