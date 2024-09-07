# AWS Settings

### Lambda Functions

```
pip install -t ./python neo4j==5.20.0
zip -r neo4j.zip python/
```

Create a lambda layer using the zip file created above; upload the zip file with any name and select Python 3.12 as the runtime. Also Attach an appropriate inline policy allowing access to SSM and set the timeout to 10 seconds. The inline policy is bellow.

``` 
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "getParameterFromSSM",
			"Effect": "Allow",
			"Action": [
				"ssm:GetParameters"
			],
			"Resource": "*"
		}
	]
}
```

#### Basic error handling

Query errors from neo4j are basically defined as follows.
```
try:
    results = session.run(query)
    for record in results:
        print(record["*****"])
except Exception as e:
    response = json.dumps({
        "statusCode": 500,
        "body": str(e),
    })
    return response 
finally:
    session.close()
```

### Systems Manager Parameter Store

Store your neo4j url, username and password in the parameter store. The parameter names should be as follows.

```
neo4j-url
neo4j-username
neo4j-password
```
### API Gateway

Please refer [here](https://docs.aws.amazon.com/apigateway/latest/developerguide/permissions.html#api-gateway-control-access-iam-permissions-model-for-calling-api) to create the execution role.
The execution role should be named ```APIGatewayLambdaExecutionRole```.

Download netgraph-api-schema.yml and replace <accountId> with your account Id. After deploying the lambda 
function, build an API Gateway based on OpenAPI.

```
aws apigateway import-rest-api \
    --parameters endpointConfigurationTypes=REGIONAL \
    --fail-on-warnings \
    --cli-binary-format raw-in-base64-out \
    --body 'file://netgraph-api-schema.yml'
```

If you want to use the resource policy, please refer to the following.

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "execute-api:Invoke",
      "Resource": "arn:aws:execute-api:<region code>:<account id>:<api id>/*/*/*",
      "Condition": {
        "NotIpAddress": {
          "aws:SourceIp": "<source ip>/32"
        }
      }
    },
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "execute-api:Invoke",
      "Resource": "arn:aws:execute-api:<region code>:<account id>:<api id>/*/*/*"
    }
  ]
}
```

To delete an API, see below.

```
aws apigateway delete-rest-api --rest-api-id <API ID>
```
