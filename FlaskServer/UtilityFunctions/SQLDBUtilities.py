from sqlalchemy import create_engine, text
from Models.user import user  # pylint: disable=import-error
import pandas
from datetime import datetime, timedelta
import bcrypt
from flask import session
import uuid
import Config.SQLConfig as sqlConfig # pylint: disable=import-error


def getEngine():
    #This returns the sqlalchemy connection object that we use to make queries
    return create_engine(sqlConfig.settings['sqlString']) 

def initiateDatabase():
    # This only needs to be run once, but is left in for reference. 
    database = getEngine()
    database.execute("CREATE TABLE IF NOT EXISTS User (userID int NOT NULL AUTO_INCREMENT, email varchar(100), hashedPassword varchar(150), fname varchar(20), lname varchar(30), level int, PRIMARY KEY(userID), UNIQUE(email))")
    database.execute("CREATE TABLE IF NOT EXISTS UserSession (userID int, uniqueIDKey varchar(38), expiry DATETIME , PRIMARY KEY(uniqueIDKey), FOREIGN KEY(userID) REFERENCES User(userID))")

def addUser(email, password, fname, lname, level):

    database = getEngine()
    hashedPword = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    stmt = text("INSERT INTO User (email, hashedPassword, fname,lname,level) VALUES(:EMAIL,:HASH, :FNAME,:LNAME,:LEVEL)")
    database.execute(stmt, EMAIL = email, HASH=hashedPword, FNAME=fname, LNAME = lname, LEVEL=level) 

def addSessionCookie():
    userID = user.deserialize(session['user']).id
    database = getEngine()
    UU = uuid.uuid1()
    stmt = text("INSERT INTO UserSession ( userID, uniqueIDKey, expiry) VALUES(:ID,:UUID, :EXPIRY)")
    database.execute(stmt, ID=userID, UUID = UU, EXPIRY =  datetime.now() + timedelta(days=14))
    #is this problematic?
    #Maybe look it up and see @Lewis
    return UU