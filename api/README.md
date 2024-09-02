# Netgraph API

## Create API

```
aws apigateway import-rest-api \
    --parameters endpointConfigurationTypes=REGIONAL \
    --fail-on-warnings \
    --cli-binary-format raw-in-base64-out \
    --body 'file://netgraph-api-schema.yml'
```

## Delete API

```
aws apigateway delete-rest-api --rest-api-id <API ID>
```
