# AWS Settings

### Lambda Functions

```
pip install -t ./python neo4j==5.20.0
zip -r neo4j.zip python/
```

Create a lambda layer using the zip file created above; upload the zip file with any name and select Python 3.12 as the runtime. Also Attach an appropriate policy allowing access to SSM and set the timeout to 10 seconds.

### Systems Manager Parameter Store

Store your neo4j url, username and password in the parameter store. The parameter names should be as follows.

```
neo4j-url
neo4j-username
neo4j-password
```
### API Gateway



### API

#### Dashboard API Response

```
{
  "statusCode": 200,
  "totalswitches": 3
}
```

#### Tenant Management API 

```
{
  "tenantId": string,
  "tenantName": string
}
```


