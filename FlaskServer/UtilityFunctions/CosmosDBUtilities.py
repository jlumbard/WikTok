
import azure.cosmos.documents as documents
import azure.cosmos.cosmos_client as cosmos_client
import azure.cosmos.exceptions as exceptions
from azure.cosmos.partition_key import PartitionKey
import datetime

import FlaskServer.Config.CosmosConfig as config

HOST = config.settings['host']
MASTER_KEY = config.settings['master_key']
DATABASE_ID = config.settings['database_id']
CONTAINER_ID = config.settings['container_id']

# above copied from Azure example.

def getContainer():
    client = cosmos_client.CosmosClient(HOST, {'masterKey': MASTER_KEY}, user_agent="CosmosDBDotnetQuickstart", user_agent_overwrite=True)
    db = client.get_database_client(DATABASE_ID)
    container = db.get_container_client(CONTAINER_ID)
    return container

def pushUserData(dataArray):
    container = getContainer()
    #The data array below will have to be formatted.
    container.create_item(body=dataArray)

def initDatabase():
    client = cosmos_client.CosmosClient(HOST, {'masterKey': MASTER_KEY}, user_agent="CosmosDBDotnetQuickstart", user_agent_overwrite=True)
    db = client.create_database(id=DATABASE_ID)
    db.create_container(id=CONTAINER_ID, partition_key=PartitionKey(path='/account_number'), offer_throughput=400)
