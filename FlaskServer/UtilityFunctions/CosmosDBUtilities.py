
import azure.cosmos.documents as documents
import azure.cosmos.cosmos_client as cosmos_client
import azure.cosmos.exceptions as exceptions
from azure.cosmos.partition_key import PartitionKey
import datetime
import uuid
import Config.CosmosConfig as config # pylint: disable=import-error

HOST = config.settings['host']
MASTER_KEY = config.settings['master_key']
DATABASE_ID = config.settings['database_id']
INTERACTIONS_CONTAINER_ID = config.settings['interactions_container_id']
PAGES_CONTAINER_ID = config.settings['pages_container_id']

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
    db = client.create_database(id=DATABASE_ID)
    db.create_container(id=INTERACTIONS_CONTAINER_ID, partition_key=PartitionKey(path='/account_number'), offer_throughput=400)
    db.create_container(id=PAGES_CONTAINER_ID, partition_key=PartitionKey(path='/account_number'), offer_throughput=400)


def pushWikiPageData(dataArray):
    #initContainers()
    dataArray['id'] = str(uuid.uuid4())
    container = getContainer(PAGES_CONTAINER_ID)
    #The data array below will have to be formatted.
    container.create_item(body=dataArray)

def pushUserData(dataArray):
    dataArray['id'] = str(uuid.uuid4())
    container = getContainer(INTERACTIONS_CONTAINER_ID)
    #The data array below will have to be formatted.
    container.create_item(body=dataArray)
