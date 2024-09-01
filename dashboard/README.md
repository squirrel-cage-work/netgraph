# Dashboard

![image](https://github.com/user-attachments/assets/7d6cfddd-be88-436a-a41f-46615a95e091)

## Getting Start

### Prerequisites

1. Include your api gateway path in config.js.

## Tenant

You can create tenants, which are You can register a unique tenant ID and any name.

![image](https://github.com/user-attachments/assets/915079d7-58ab-49ab-8719-756704d03334)

### Tenant API and Graph 

The API definitions are as follows.

* Path : /tenants/{tenantId}
* Method : GET, POST, PUT, DELETE
```Body
{
  "tenantName": string
}
```

The cypher query at this time is as follows.

```
CREATE CONSTRAINT uniqueTenantId FOR (t:Tenant) REQUIRE (t.id) IS UNIQUE;
```

```CREATE(POST)
// CREATE (POST)
CREATE (t:Tenant {id: '123456789', name: 'hoge'})
RETURN t
```

```UPDATE(PUT)
// UPDATE (PUT)
MATCH (t:Tenant {id: '123456789'})
SET t.name = 'huga'
RETURN t
```

```DELETE(DELETE)
// DELETE (DELETE)
MATCH (t:Tenant {tenantId: 'tenant123'})
DELETE t
```

```GET(GET)
// GET (GET)
MATCH (t:Tenant)
RETURN t.id AS TenantID, t.name AS TenantName
ORDER BY t.id
```
## Devices

The API definitions are as follows.

* Path : /devices/{deviceType}/{deviceName}
  * deviceType : switches, routers
* Method : GET, POST, PUT, DELETE

### Switches

The API definitions are as follows.

* Path : /devices/switches/{deviceName}
* Method : GET, POST, PUT, DELETE
```Body
{
  "tenantName": string [option]
}
```

