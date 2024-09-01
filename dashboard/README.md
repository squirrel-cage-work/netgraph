# Dashboard

![image](https://github.com/user-attachments/assets/7d6cfddd-be88-436a-a41f-46615a95e091)

## Getting Start

### Prerequisites

1. Include your api gateway path in config.js.

## Tenant Management

You can create tenants, which are You can register a unique tenant ID and any name.

![image](https://github.com/user-attachments/assets/915079d7-58ab-49ab-8719-756704d03334)



### Tenant Management API and Graph 

``` API
{
  "tenantId": string,
  "tenantName": string
}
```

``` CREATE
CREATE (t:Tenant {id: '123456789', name: 'hoge'})
RETURN t
```

``` UPDATE
MATCH (t:Tenant {id: '123456789'})
SET t.name = 'huga'
RETURN t
```

``` DELETE
MATCH (t:Tenant {tenantId: 'tenant123'})
DELETE t
```

``` GET
MATCH (t:Tenant)
RETURN t.id AS TenantID, t.name AS TenantName
ORDER BY t.id
```

