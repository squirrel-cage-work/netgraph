import json
import boto3
import logging
from neo4j  import GraphDatabase, basic_auth

logger = logging.getLogger()

def lambda_handler(event, context):
    
    deviceName = event['pathParameters']['deviceName']

    ''' neo4j login parameter from ssm parameter store
    '''

    ssm = boto3.client('ssm')
    responses = ssm.get_parameters(
        Names=[
            'neo4j-url',
            'neo4j-username',
            'neo4j-password'
        ]
    )

    for response in responses['Parameters']:
        if response['Name'] == 'neo4j-url':
            neo4j_url = response['Value']
        if response['Name'] == 'neo4j-username':
            neo4j_username = response['Value']
        if response['Name'] == 'neo4j-password':
            neo4j_password = response['Value']
            
    
    response = []
    
    try:
        driver = GraphDatabase.driver(neo4j_url, auth=basic_auth(neo4j_username, neo4j_password))
        session = driver.session()
        
        if event['httpMethod'] == 'GET':
            query = '''
            MATCH (s:Switch {name: 'Switch001'})-[si:HAS_INTERFACE]->(i:Interface)
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
            logger.info(event)
            
            for item in json.loads(event['body']):
                interfaceType   = item['properties']['interfaceType']
                interfaceNumber = item['properties']['interfaceNumber']
                tags            = item['properties']['tags']
                
                query = '''
                MATCH (s:Switch {name: $deviceName})
                CREATE (i:Interface {name: $interfaceNumber, Tag: $tags})
                CREATE (s)-[si:HAS_INTERFACE {Type: $interfaceType}]->(i)
                '''
                logging.info(query)


                parameters = {
                    'deviceName': deviceName,
                    'interfaceNumber': interfaceNumber,
                    'interfaceType': interfaceType,
                    'tags': tags,
                }

                results = session.run(query, parameters)

    except Exception as e:
        logging.info(e)
        response = {
            "statusCode": 500,
            'headers': {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": '*',
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
            },
            "body": str(e),
        }
        return response 
    finally:
        session.close()
    
            
    
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
