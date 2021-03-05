
import azure.cosmos.documents as documents
import azure.cosmos.cosmos_client as cosmos_client
import azure.cosmos.exceptions as exceptions
from azure.cosmos.partition_key import PartitionKey
import datetime
import uuid
import Config.CosmosConfig as config # pylint: disable=import-error
import bcrypt
from Models.user import user  # pylint: disable=import-error
from datetime import datetime, timedelta
from flask import session

HOST = config.settings['host']
MASTER_KEY = config.settings['master_key']
DATABASE_ID = config.settings['database_id']
INTERACTIONS_CONTAINER_ID = config.settings['interactions_container_id']
PAGES_CONTAINER_ID = config.settings['pages_container_id']
USERS_CONTAINER_ID = config.settings['users_container_id']
USERSESSION_CONTAINER_ID = config.settings['userSession_container_id']

# above copied from Azure example.

def getContainer(containerID):
    client = cosmos_client.CosmosClient(HOST, {'masterKey': MASTER_KEY}, user_agent="CosmosDBDotnetQuickstart", user_agent_overwrite=True)
    db = client.get_database_client(DATABASE_ID)
    container = db.get_container_client(containerID)
    return container
    
def initContainers():
    #init the db
    print("error! re-initializing DBs")
    client = cosmos_client.CosmosClient(HOST, {'masterKey': MASTER_KEY}, user_agent="CosmosDBDotnetQuickstart", user_agent_overwrite=True)
    #db = client.create_database(id=DATABASE_ID)
    db = client.get_database_client(DATABASE_ID)
    db.create_container(id=INTERACTIONS_CONTAINER_ID, partition_key=PartitionKey(path='/account_number'), offer_throughput=400)
    db.create_container(id=PAGES_CONTAINER_ID, partition_key=PartitionKey(path='/account_number'), offer_throughput=400)
    db.create_container(id=USERS_CONTAINER_ID, partition_key=PartitionKey(path='/account_number'), offer_throughput=400)
    db.create_container(id=USERSESSION_CONTAINER_ID, partition_key=PartitionKey(path='/account_number'), offer_throughput=400)

def pushWikiPageData(dataArray):
    #initContainers()
    dataArray['id'] = str(uuid.uuid4())
    container = getContainer(PAGES_CONTAINER_ID)
    #The data array below will have to be formatted.
    container.create_item(body=dataArray)

def pushUserData(dataArray):
    dataArray['id'] = str(uuid.uuid4())
    dataArray['datePushed'] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    container = getContainer(INTERACTIONS_CONTAINER_ID)
    #The data array below will have to be formatted.
    print(dataArray)
    container.create_item(body=dataArray)

#AFTER THIS IS SQL IMPORTS THAT WERE MIGRATED. BEWARE, UNTESTED CODE.
def addUser(email, password, fname, lname, level):
    
    id = str(uuid.uuid4())
    container = getContainer(USERS_CONTAINER_ID)
    hashedPword = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    #The data array below will have to be formatted.
    container.create_item(body={'email':email, 'password':hashedPword.decode(), 'fname':fname, 'lname':lname, 'level':level, 'id':id})

def addSessionCookie():
    id = str(uuid.uuid4())
    UU = uuid.uuid1()
    userID = user.deserialize(session['user']).id
    container = getContainer(USERSESSION_CONTAINER_ID)
    container.create_item(body={'UUID':str(UU), 'userID':userID, 'expiry':str(datetime.now() + timedelta(days=14)),'id':id})
    return UU

def getUserIdBySessionKey(ID):
    container = getContainer(USERSESSION_CONTAINER_ID)
    print(ID)
    query = "SELECT * FROM UserSessionV1 us WHERE us.UUID = @UniqueID"

    items = list(container.query_items(
        query=query,
        enable_cross_partition_query=True,
        parameters=[dict(name="@UniqueID", value=str(ID))]
    ))
    print(items)
    if(len(items) != 0):
        if(datetime.strptime(items[0]['expiry'],'%Y-%m-%d %H:%M:%S.%f') <= datetime.now()):
            return False
    else:
        return False
    return items[0]

def markUserOnboarded(ID):
    container = getContainer(USERS_CONTAINER_ID)
    
    query = "SELECT * FROM UsersV1 us WHERE us.id = @UniqueID"

    items = list(container.query_items(
        query=query,
        enable_cross_partition_query=True,
        parameters=[dict(name="@UniqueID", value=str(ID))]
    ))
    updatedItem = items[0]
    updatedItem['Onboarded'] = True
    container.upsert_item(updatedItem)

def pushOnboardedArticles(articleTitle, userID):
    dataArray = {}
    dataArray['article'] = articleTitle
    dataArray['Onboarding'] = True
    dataArray['id']=str(uuid.uuid4())
    dataArray['userID']= userID
    container = getContainer(INTERACTIONS_CONTAINER_ID)
    #The data array below will have to be formatted.
    print(dataArray)
    container.create_item(body=dataArray)

def getUsersOnboardedArticles(userID):
    container = getContainer(INTERACTIONS_CONTAINER_ID)
    
    query = "SELECT * FROM InteractionsV1 i WHERE i.userID = @UniqueID AND i.Onboarding = true"
    items = list(container.query_items(
        query=query,
        enable_cross_partition_query=True,
        parameters=[dict(name="@UniqueID", value=str(userID))]
    ))
    return items

def getArticleByTitle(title):
    # initContainers()

    container = getContainer(PAGES_CONTAINER_ID)
    query = "SELECT * FROM PagesV1 us WHERE us.title = @UniqueID"

    items = list(container.query_items(
        query=query,
        enable_cross_partition_query=True,
        parameters=[dict(name="@UniqueID", value=str(title))]
    ))
    # print("ITEMS")
    print(items)
    if(len(items) == 0):
        return True
    else:
        return False

def getArticles():
    container = getContainer(PAGES_CONTAINER_ID)
    query = "SELECT * FROM PagesV1 us"

    items = list(container.query_items(
        query=query,
        enable_cross_partition_query=True
    ))
    return items

def getArticlesV2():
    container = getContainer(PAGES_CONTAINER_ID)
    query = "SELECT DISTINCT us.title, us.firstParagraph FROM PagesV1 us"

    items = list(container.query_items(
        query=query,
        enable_cross_partition_query=True
    ))
    return items

def getPageMetrics():
    container = getContainer(PAGES_CONTAINER_ID)
    query = "SELECT us.title, us.pageViews, us.pageViewTrend FROM PagesV1 us"
    items = list(container.query_items(
        query=query,
        enable_cross_partition_query=True
    ))
    return items

def getUser(username):
    # initContainers()
    container = getContainer(USERS_CONTAINER_ID)
    print(container)
    query = "SELECT * FROM UsersV1 u WHERE u.email = @email"

    items = list(container.query_items(
        query=query,
        enable_cross_partition_query=True,
        parameters=[dict(name="@email", value=username)]
    ))
    return items[0] if 0 < len(items) else None

def getUserByID(ID):
    #initContainers()
    container = getContainer(USERS_CONTAINER_ID)
    print(container)
    query = "SELECT * FROM UsersV1 u WHERE u.id = @ID"

    items = list(container.query_items(
        query=query,
        enable_cross_partition_query=True,
        parameters=[dict(name="@ID", value=ID)]
    ))
    return items[0] if 0 < len(items) else None

def getArticlesRead(ID):
    container = getContainer(INTERACTIONS_CONTAINER_ID)
    query = "SELECT DISTINCT u.article FROM InteractionsV1 u WHERE u.user=@ID"
    items = list(container.query_items(
        query=query,
        enable_cross_partition_query=True,
        parameters=[dict(name="@ID", value=ID)]
    ))
    return items

def getAllArticlesReadData(ID):
    container = getContainer(INTERACTIONS_CONTAINER_ID)
    query = "SELECT DISTINCT * FROM InteractionsV1 u WHERE u.user=@ID"
    items = list(container.query_items(
        query=query,
        enable_cross_partition_query=True,
        parameters=[dict(name="@ID", value=ID)]
    ))
    return items

def checkUser(email, pword):
    trackResult = getUser(email)
    print(trackResult)
    if(trackResult == None):
        return False
    else:
        return (bcrypt.checkpw(pword.encode('utf8'), trackResult['password'].encode('utf8')))

def getUserRatingsData():
    container = getContainer(INTERACTIONS_CONTAINER_ID)
    query = "SELECT us.user, us.timeSpent, us.article, us.liked FROM InteractionsV1 us WHERE CONTAINS (us.article, 'https://en.wikipedia.org', true)"
    items = list(container.query_items(
        query=query,
        enable_cross_partition_query=True
    ))
    return items