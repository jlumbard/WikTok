import UtilityFunctions.SQLDBUtilities as DBUtilities # pylint: disable=import-error
from flask import session
from Models.user import user  # pylint: disable=import-error


def checkLoggedIn(userID = None, sessionID = None):
    if(userID == None):
        userID = session['user']['id']
    if(sessionID == None):
        sessionID = session['sessionID']
    #if userID matches the sessionID they passed then we're chilling
    sessionIDTest = DBUtilities.getUserIdBySessionKey(sessionID)
    if(sessionIDTest != False): #The above function returns false if the sessionID doesnt exist or is invalid
        return False;
    else:
        if(sessionID == sessionIDTest):
            return True;

def addSessionCookie(sessionUser):
    session['user'] = user.tracker.serialize(user.tracker(sessionUser.trackerID, sessionUser.fname+" "+sessionUser.lname, sessionUser.email, sessionUser.level))
    session['login'] = DBUtilities.addSessionCookie()