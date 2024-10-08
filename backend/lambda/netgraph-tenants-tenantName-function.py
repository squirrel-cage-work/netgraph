import json
import boto3
import logging
from neo4j import GraphDatabase, basic_auth

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
    
    tenantName = event['pathParameters']['tenantName']

    ''' neo4j login parameter from ssm parameter store
    '''

    try:
        with driver.session() as session:
        
            if event['httpMethod'] == 'POST':
                query = '''
                CREATE (t:Tenant {name: $tenantName})
                RETURN t
                '''
            
                parameters = {
                    'tenantName': tenantName
                }
            
                results = session.run(query, parameters)
            
                response = {
                    'message': 'success'
                }
            
            elif event['httpMethod'] == 'DELETE':
                query = '''
                MATCH (t:Tenant {name: $tenantName})
                DELETE t
                '''
            
                parameters = {
                    'tenantName': tenantName
                }

                results = session.run(query, parameters)
            
                response = {
                    'message': 'success'
                }

    except Exception as e:
        logging.error("Error occurred: %s", str(e))
        response = {
            "statusCode": 500,
            'headers': {
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
                "Access-Control-Allow-Origin": '*',
                "Access-Control-Allow-Methods": "*"
            },
            "body": "An internal server error occurred."
        }
        return response 

    
    # TODO implement
    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
            "Access-Control-Allow-Origin": '*',
            "Access-Control-Allow-Methods": "*"
        },
        'body': json.dumps(response)
    }
