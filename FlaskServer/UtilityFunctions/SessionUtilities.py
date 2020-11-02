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
    if(sessionIDTest.userID == False): #The above function returns false if the sessionID doesnt exist or is invalid
        return False
    else:
        if(userID == sessionIDTest.userID):
            return True;
        else:
            return False

def addSessionCookie(sessionUser):
    print("here")
    session['user'] = user.serialize(user(sessionUser.userID, sessionUser.fname+" "+sessionUser.lname, sessionUser.email, sessionUser.level))
    session['sessionID'] = DBUtilities.addSessionCookie()