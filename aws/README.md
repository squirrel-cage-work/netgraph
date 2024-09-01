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

### Systems Manager Parameter Store

Store your neo4j url, username and password in the parameter store. The parameter names should be as follows.

```
neo4j-url
neo4j-username
neo4j-password
```
### API Gateway



### API

see https://github.com/squirrel-cage-work/netgraph/blob/main/dashboard/README.md
