import UtilityFunctions.SQLDBUtilities as DBUtilities # pylint: disable=import-error
import UtilityFunctions.CosmosDBUtilities as CosmosUtilities # pylint: disable=import-error
from flask import session
from Models.user import user  # pylint: disable=import-error



def checkLoggedIn(userID = None, sessionID = None):
    if(userID == None):
        if(session.get('user')):
            userID = session['user']['id']
    if(sessionID == None):
        if(session.get('sessionID')):
            sessionID = session['sessionID']
    #if userID matches the sessionID they passed then we're chilling
    sessionIDTest = CosmosUtilities.getUserIdBySessionKey(sessionID)
    if(sessionIDTest['userID'] == False): #The above function returns false if the sessionID doesnt exist or is invalid
        return False
    else:
        if(userID == sessionIDTest['userID']):
            return True;
        else:
            return False

def addSessionCookie(sessionUser):
    print("here")
    print(sessionUser)
    session['user'] = user.serialize(user(sessionUser['id'], sessionUser['fname']+" "+sessionUser['lname'], sessionUser['email'], sessionUser['level']))
    session['sessionID'] = CosmosUtilities.addSessionCookie()