import json
import boto3
from neo4j  import GraphDatabase, basic_auth

def string_to_unicode(s):
    return '-'.join(str(ord(c)) for c in s)

def lambda_handler(event, context):

    deviceType = event['pathParameters']['deviceType']
    deviceName = event['pathParameters']['deviceName']
    nodeParam  = string_to_unicode(deviceName)

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
    
    print(nodeParam)

    if deviceType == 'switches':
        if event['httpMethod'] == 'POST':
            query = '''
            CREATE (s$nodeParam:Switch {name: $deviceName})
            '''
            
    parameters = {
        'nodeParam': nodeParam,
        'deviceName': deviceName
    }
            
    results = session.run(query, parameters)

    for record in results:
        print(record)


    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
