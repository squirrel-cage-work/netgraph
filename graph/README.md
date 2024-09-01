#

## Tenant Management

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

