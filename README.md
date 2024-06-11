
### Rule

#### Router 

![image](https://github.com/squirrel-cage-work/netgraph/assets/87857140/2b88923d-e32c-4798-8c6f-2c78ca6d69de)

Router Node 例：
``` example
CREATE (r000001:Router {name: 'Router000001', Tenant: '[UserA, UserB]'})

CREATE (i000001:Interface {name: '0/1', Tenant: '[UserA, UserB]'})
CREATE (i000002:Interface {name: '0/2'})

CREATE (v000001:VLANVRF {name: '10', Tenant: '[UserA]'})
CREATE (v000002:VLANVRF {name: '20', Tenant: '[UserB]'})
````

Router relationship 例
```
CREATE (r000001)-[:Direct { Type: "GigabitEthernet", Tenant: '[UserA, UserB]' }]->(i000001)
CREATE (r000001)-[:Direct { Type: "GigabitEthernet"}]->(i000002)

CREATE (i000001)-[:Direct { Type: "Virtualization", Tenant: '[UserA]'}]->(v000001)
CREATE (i000001)-[:Direct { Type: "Virtualization", Tenant: '[UserB]'}]->(v000002)
```

![image](https://github.com/squirrel-cage-work/netgraph/assets/87857140/96a48729-9a42-4e9f-b1dd-db55bca4a99e)
