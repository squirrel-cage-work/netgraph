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
    
    body = json.loads(event['body'])
    tenantId = body['tenantId']
    tenantName = body['tenantName']
    
    if event['httpMethod'] == 'POST':
        query = '''
        CREATE (t:Tenant {id: $tenantId, name: $tenantName})
        RETURN t
        '''
    elif event['httpMethod'] == 'PUT':
        query = '''
        MATCH (t:Tenant {id: $tenantId})
        SET t.name = $tenantName
        RETURN t
        '''
    elif event['httpMethod'] == 'DELETE':
        query = '''
        MATCH (t:Tenant {tenantId: $tenantId})
        DELETE t
        '''
    elif event['httpMethod'] == 'GET':
        query = '''
        MATCH (t:Tenant)
        RETURN t.id AS TenantID, t.name AS TenantName
        ORDER BY t.id
        '''

    parameters = {
        'tenantId': tenantId,
        'tenantName': tenantName
    }
            
    results = session.run(query, parameters)

    for record in results:
        print(record)

    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
