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
    
    orgName = event['pathParameters']['orgName']

    response = []
    
    try:
        with driver.session() as session:

            if event['httpMethod'] == 'GET':
                query = '''
                MATCH (vo:VlanOrg {name: $orgName})-[vov:HAS_VLAN]->(v:Vlan)
                RETURN vov, v
                '''
            
                parameters = {
                    'orgName': orgName
                }
            
                results = session.run(query, parameters)
            
                for record in results:
                    body = {
                        'properties': {
                            'vlanid': record['v']['name'],
                        }
                    }
                    response.append(body)
            
            elif event['httpMethod'] == 'POST':
                print(event)
                for item in event['body']:
                    vlanid   = item['properties']['vlanid']
                    print(vlanid)
                    query = '''
                    MATCH (vo:VlanOrg {name: $orgName})
                    CREATE (v:Vlan {name: $vlanid})
                    CREATE (vo)-[vov:HAS_VLAN]->(v)
                    '''

                    parameters = {
                        'orgName': orgName,
                        'vlanid': vlanid,
                    }

                    results = session.run(query, parameters)
                
            elif event['httpMethod'] == 'DELETE':
            
                for item in event['body']:
                    vlanid   = item['properties']['vlanid']

                    query = '''
                    MATCH (vo:VlanOrg {name: $orgName})-[vov:HAS_VLAN]->(v:Vlan {name: $vlanid})
                    DELETE vov, v
                    '''
            
                    parameters = {
                        'orgName': orgName,
                        'vlanid': vlanid,
                    }

                    results = session.run(query, parameters)

    except Exception as e:
        logging.error("Error occurred: %s", str(e))
        response = {
            "statusCode": 500,
            'headers': {
                "Access-Control-Allow-Headers": "Content-Type",
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
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": '*',
            "Access-Control-Allow-Methods": "*"
        },
        'body': json.dumps(response)
    }
