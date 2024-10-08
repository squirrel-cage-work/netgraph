import json
import boto3
import logging
import time
from neo4j  import GraphDatabase, basic_auth

logger = logging.getLogger()

''' get parameters to access neo4j from ssm parameter store
'''
ssm = boto3.client('ssm')

responses = ssm.get_parameters(
    Names=[
        'neo4j-url',
        'neo4j-username',
        'neo4j-password'
    ],
    WithDecryption=True
)

for response in responses['Parameters']:
    if response['Name'] == 'neo4j-url':
        neo4j_url = response['Value']
    if response['Name'] == 'neo4j-username':
        neo4j_username = response['Value']
    if response['Name'] == 'neo4j-password':
        neo4j_password = response['Value']

'''  create driver
'''
driver = GraphDatabase.driver(neo4j_url, auth=basic_auth(neo4j_username, neo4j_password))

def lambda_handler(event, context):

    devices    = event['pathParameters']['devices']

    ''' neo4j login parameter from ssm parameter store
    '''

    response = []
    
    try:
        with driver.session() as session:

            if devices == 'switches':
                if event['httpMethod'] == 'GET':
                    query = '''
                    MATCH (n:Switch) RETURN n
                    '''
                    results = session.run(query)
                
                    for record in results:
                        name   = record['n']['name']
                        tenant = record['n']['Tenant']

                        body   = {
                            "deviceName": name,
                            "properties": {
                                "tenant": tenant
                                }
                            }
            
                        response.append(body)
            
            elif devices == 'tenants':
                if event['httpMethod'] == 'GET':
                    query = '''
                    MATCH (n:Tenant) RETURN n
                    '''            
                
                    results = session.run(query)
                
                    for record in results:
                        name   = record['n']['name']

                        body   = {
                            "deviceName": name,
                            "properties": {
                                }
                            }
            
                        response.append(body)

            elif devices == 'routers':
                if event['httpMethod'] == 'GET':
                    query = '''
                    MATCH (n:Router) RETURN n
                    '''            
                
                    results = session.run(query)
                
                    for record in results:
                        name   = record['n']['name']

                        body   = {
                            "deviceName": name,
                            "properties": {
                                }
                            }
            
                        response.append(body)
    
    except Exception as e:
        logging.error("Error occurred: %s", str(e))
        response = {
            "statusCode": 500,
            'headers': {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": '*',
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
            },
            "body": "An internal server error occurred."
        }
        return response 
        

    # TODO implement
    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": '*',
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        'body': json.dumps(response)
    }