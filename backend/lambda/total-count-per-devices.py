import json
import boto3
from neo4j  import GraphDatabase, basic_auth

def lambda_handler(event, context):

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

    driver = GraphDatabase.driver(neo4j_url, auth=basic_auth(neo4j_username, neo4j_password))
    
    session = driver.session()
    
    query = '''
    MATCH (s:Switch)
    RETURN COUNT(s) AS totalswitches
    '''
    
    results = session.run(query)
    
    for record in results:
        totalswitches = record['totalswitches']
    
    # TODO implement
    return {
        'statusCode': 200,
        'totalswitches': totalswitches
    }
