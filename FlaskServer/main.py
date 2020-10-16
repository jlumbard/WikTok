from flask import Flask, flash, request, redirect, url_for, render_template, send_from_directory, session, jsonify, make_response
import os
import sys

#TO RUN:
#export FLASK_APP=main.py
#export FLASK_DEBUG=1
#flask run
# need to be in the /FlaskServer directory. 


app = Flask(__name__)
if sys.version_info[0] < 3:
    raise Exception("Must be using Python 3")

@app.before_request
def before_request():
    if not request.is_secure and not app.debug:
        url = request.url.replace("http://", "https://", 1)
        code = 301
        return redirect(url, code=code)

@app.route('/')
@app.route('/index')
def homeTestPage():
    return ("Hello from flask!")

#Expected endpoints 


@app.route('/getNextArticle')
def getNextArticle():
    #probably passes the userID or guid on their session. 
    #article they're currently on and their engagement with it should already be pushed, seperate endpoint.
    # or should it?

    #returns, next article to nav to and then client side javascript just redirects them there.
    return "NOT IMPLEMENTED"


@app.route('/pushUserInteractionData')
def pushUserInteraction():
    #passes info in a POST request about what the user did. No return type
    # how long did they spend on the article. What is the content of the article?
    # did they click on anything? 

    # THis data is all used to then push to the database so we know more about user tendencies. 
    return "NOT IMPLEMENTED"