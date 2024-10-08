# graph database archtecture

## node types and properties

1. Switch
    * properties: name, Tenant
    * example: ```(s:Switch {name: 'Switch000001', Tenant: '[UserA, UserB, UserC]'})```
2. Interface
    * properties: name, Tenant, Tag
    * example: ```(i:Interface {name: '0/1', Tenant: '[UserA, UserB]', Tag: 'True'})```
3. VRF
    * properties: name, Tenant
    * example: ``` CREATE (vr:Vrf {name: '10', Tenant: '[UserA]'})```
4. Tenant
    * properties: name
    * example: ```(t:Tenant {name: 'UserA'})```

### vlan scop and vlan id node and properties

1. VLAN Org
    * properties: name
    * example: ```(vo:VlanOrg {name: 'Cluster1'})```
1. VLAN
    * properties: name, Tenant
    * example: ```(v:Vlan {name: '10', Tenant: '[UserA]'})```

## relationship

1. HAS_INTERFACE
    * note: relationship between switches and interfaces
    * properties: Type, Tenant
    * example: ``` (s)-[si:HAS_INTERFACE { Type: "GigabitEthernet", Tenant: '[UserA, UserB]' }]->(i) ```
    * note: relationship between routers and interfaces
    * properties: Type, Tenant
    * example: ``` (r)-[ri:HAS_INTERFACE { Type: "GigabitEthernet", Tenant: '[UserA, UserB]' }]->(i) ```
2. ASSOCIATED_WITH
    * note: relationship between interface of swith and vlan
    * properties: Type, Tenant
    * example: ``` (i)-[iv:ASSOCIATED_WITH { Type: "VLAN", Tenant: '[UserA]'}]->(v) ```
    * note: relationship between interface of router and vrf
    * properties: Type, Tenant
    * example: ``` (r)-[rvr:ASSOCIATED_WITH { Type: "VRF", Tenant: '[UserA]' }]->(vr) ```
3. CONNECTED_TO
    * note: connection
    * peoperties: Type, Tenant
    * exmaple: ``` (v)-[vv:CONNECTED_TO { Type: "VLAN", Tenant: '[UserA]'}]->(v) ```
4. HAS_VLAN
    * note: relationship between vlan scope and vlan
    * example ```(vo)-[vov:HAS_VLAN]->(v)```

## example of data query

### /tenants/{tenantName}

* POST : create a tenant.
```
CREATE (t:Tenant {name: $tenantName})
RETURN t
```

* DELETE : delete a tenant.
```
MATCH (t:Tenant {name: $tenantName})
DELETE t
```

### /switches/{deviceName}

* POST : create a switch.
```
CREATE (s:Switch {name: $deviceName})
RETURN s
```

* DELETE : delete a switch
```
MATCH (s:Switch {name: $deviceName})
DELETE s
```

### /switches/{deviceName}/intrefaces

* POST : create an interface of the switch and relationship between the switch and an interface. It represents the relationship between the switch and the interface.  
```
MATCH (s:Switch {name: $deviceName})
CREATE (i:Interface {name: $interfaceNumber, Tag: $tags})
CREATE (s)-[si:HAS_INTERFACE {Type: $interfaceType}]->(i)
```

* GET : fetch interfaces associated with the switch.
```
MATCH (s:Switch {name: $deviceName})-[si:HAS_INTERFACE]->(i:Interface)
RETURN i, si;
```

### /routers/{deviceName}

* POST : create a router.
```
CREATE (r:Router {name: $deviceName})
RETURN r
```

* DELETE : delete a switch
```
MATCH (r:Router {name: $deviceName})
DELETE r
```

### /routers/{deviceName}/intrefaces

* POST : create an interface of the router and relationship between the router and an interface. It represents the relationship between the router and the interface.  
```
MATCH (r:Router {name: $deviceName})
CREATE (i:Interface {name: $interfaceNumber, Tag: $tags})
CREATE (r)-[si:HAS_INTERFACE {Type: $interfaceType}]->(i)
```

* GET : fetch interfaces associated with the router.
```
MATCH (r:Router {name: $deviceName})-[si:HAS_INTERFACE]->(i:Interface)
RETURN i, si;
```

## features

1. Multi-tenant support: Tenant attributes on each node and relationship allow resource sharing by multiple users or groups.
2. Flexible attribute management: Attributes can be added to each node and relationship as needed.
3. Hierarchical Structure: Represents hierarchical relationships between Switches, Routers, Interfaces, and VLANs.
4. Physical/Logical Separation: Distinguish between physical connections (HAS_INTERFACE) and logical relationships  (ASSOCIATED_WITH, CONNECTED_TO).

