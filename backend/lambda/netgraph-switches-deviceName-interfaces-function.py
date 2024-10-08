import json
import boto3
import logging
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
    
    deviceName = event['pathParameters']['deviceName']

    response = []
    
    try:
        with driver.session() as session:

            if event['httpMethod'] == 'GET':
                query = '''
                MATCH (s:Switch {name: $deviceName})-[si:HAS_INTERFACE]->(i:Interface)
                RETURN i, si;
                '''
            
                parameters = {
                    'deviceName': deviceName
                }
            
                results = session.run(query, parameters)
            
                for record in results:
                    body = {
                        'properties': {
                            'interfaceType': record['si']['Type'],
                            'interfaceNumber': record['i']['name'],
                            'tags': record['i']['Tag']
                        }
                    }
                    response.append(body)
            
            elif event['httpMethod'] == 'POST':
            
            
                for item in json.loads(event['body']):
                    interfaceType   = item['properties']['interfaceType']
                    interfaceNumber = item['properties']['interfaceNumber']
                    tags            = item['properties']['tags']
                
                    query = '''
                    MATCH (s:Switch {name: $deviceName})
                    CREATE (i:Interface {name: $interfaceNumber, Tag: $tags})
                    CREATE (s)-[si:HAS_INTERFACE {Type: $interfaceType}]->(i)
                    '''

                    parameters = {
                        'deviceName': deviceName,
                        'interfaceNumber': interfaceNumber,
                        'interfaceType': interfaceType,
                        'tags': tags,
                    }

                    results = session.run(query, parameters)
                
            elif event['httpMethod'] == 'DELETE':
            
                for item in json.loads(event['body']):
                    interfaceType   = item['properties']['interfaceType']
                    interfaceNumber = item['properties']['interfaceNumber']
                    tags            = item['properties']['tags']
                
                    query = '''
                    MATCH (s:Switch {name: $deviceName})-[si:HAS_INTERFACE]->(i:Interface {name: $interfaceNumber})
                    DELETE si, i
                    '''
            
                    parameters = {
                        'deviceName': deviceName,
                        'interfaceNumber': interfaceNumber,
                        'interfaceType': interfaceType,
                        'tags': tags,
                    }

                    results = session.run(query, parameters)

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
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
        },
        'body': json.dumps(response)
    }
