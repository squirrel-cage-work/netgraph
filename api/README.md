# Netgraph API

## Create API

```
aws apigateway import-rest-api \
    --parameters endpointConfigurationTypes=REGIONAL \
    --fail-on-warnings \
    --cli-binary-format raw-in-base64-out \
    --body 'file://netgraph-api-schema.yml'
```
### Resource Policy

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

## Delete API

```
aws apigateway delete-rest-api --rest-api-id <API ID>
```
