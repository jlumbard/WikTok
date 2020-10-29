import os

settings = {
    'host': os.environ.get('ACCOUNT_HOST', 'https://jlumbard.documents.azure.com:443/'),
    'master_key': os.environ.get('ACCOUNT_KEY', 'BlbQb65UIOausyjKvPH9o14ahuulkwYbDZ0Os9pmWOdWrREPJvmBR3O5ixx1uAZkEoAajj3tpAOTdjeuz8DXDw=='),
    'database_id': os.environ.get('COSMOS_DATABASE', 'ToDoList'),
    'container_id': os.environ.get('COSMOS_CONTAINER', 'Items'),
}