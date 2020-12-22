from flask import Flask, flash, request, redirect, url_for, render_template, send_from_directory, session, jsonify, make_response
import os
import sys
import UtilityFunctions.SQLDBUtilities as DBUtilities
import UtilityFunctions.CosmosDBUtilities as CosmosUtilities
import UtilityFunctions.SessionUtilities as SessionUtilities
import Recommender.PredictNextArticle as PredictNextArticle
import UtilityFunctions.ArticleDataUtilities as ArticleDataUtilities
from flask_cors import CORS, cross_origin

#TO RUN:
#export FLASK_APP=main.py
#export FLASK_DEBUG=1
#flask run
# need to be in the /FlaskServer directory. 


app = Flask(__name__)



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
    nextArticleUrl = PredictNextArticle.predictNextArticlev1()
    ArticleDataUtilities.pushDataOnArticle(nextArticleUrl)
    print(nextArticleUrl)
    return nextArticleUrl

@app.route('/pushUserInteractionData',methods=['POST'])
@cross_origin(supports_credentials=True, origin=['https://en.wikipedia.org/', 'https://127.0.0.1/'])
def pushUserInteraction():
    #Check that they're logged in. This is an API enpoint, so it is ok if these are in the request. 
    #The below might work without params, depends how API works with session
    loggedIn = SessionUtilities.checkLoggedIn()
    if(loggedIn == False):
        #probs returning a redirect would be better
        return "Error"
    
    #don't need these things anymore
    ModifiedUserInteraction = request.json
    ModifiedUserInteraction['user'] = session['user']['id']
    #passes info in a POST request about what the user did. No return type
    # how long did they spend on the article. What is the content of the article?
    # did they click on anything? 
    CosmosUtilities.pushUserData(ModifiedUserInteraction)
    # THis data is all used to then push to the database so we know more about user tendencies. 
    return "True"

@app.route('/insert',methods=['GET'])
@cross_origin()
def getInsert():
    return render_template('LeftRightArrows.html')

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
@cross_origin(supports_credentials=True, origin=['https://en.wikipedia.org/', 'https://127.0.0.1/', 'http://127.0.0.1/'])
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