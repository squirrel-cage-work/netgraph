# Network Topology Management Project: netgraph (開発中/under development)

The project aims to use a graph database to manage complex network topologies.
Learn more about dashboards [here](https://github.com/squirrel-cage-work/netgraph/tree/main/frontend) and about backend [here](https://github.com/squirrel-cage-work/netgraph/tree/main/backend).

## Overview 

The goal of this project is to represent and manage the relationships between network switches, routers, interfaces, and VLANs using graph database (neo4j). Data modeling can be found [here](https://github.com/squirrel-cage-work/netgraph/blob/main/docs/graph_architecture.md).

## Getting Start

1. start neo4j aura

## Initial Setup

Please preconfigure neo4j with the following commands.

```
CREATE CONSTRAINT uniqueTenantId FOR (t:Tenant) REQUIRE (t.id) IS UNIQUE;
```

## GraphDB Model

please see [this link](https://github.com/squirrel-cage-work/netgraph/blob/main/docs/graph_architecture.md).

### Switch Interface（修正前）
    
![image](https://github.com/squirrel-cage-work/netgraph/assets/87857140/06dd0e90-f998-40da-a8ed-a7f72132e72b)
   
Node Example
```
// Switch000001
CREATE (s000001:Switch {name: 'Switch000001', Tenant: '[UserA, UserB, UserC]'})

// Interfaces with Switch000001
CREATE (i000001:Interface {name: '0/1', Tenant: '[UserA, UserB]', Tag: 'True'})
CREATE (i000002:Interface {name: '0/2', Tenant: '[UserC]', Tag: 'False'})

// VLAN with Interface 0/1 of Switch000001
CREATE (v000001:VLAN {name: '10', Tenant: '[UserA]'})
CREATE (v000002:VLAN {name: '20', Tenant: '[UserB]'})

// VLAN with Interface 0/1 of Switch000001
CREATE (v000003:VLAN {name: '30', Tenant: '[UserC]'})

// Relationship between Switch000001 and Interface0/1 and 0/2
CREATE (s000001)-[:HAS_INTERFACE { Type: "GigabitEthernet", Tenant: '[UserA, UserB]' }]->(i000001)
CREATE (s000001)-[:HAS_INTERFACE { Type: "GigabitEthernet", Tenant: '[UserC]'}]->(i000002)

// Relationship between Interface0/1,2 and vlan10,20 
CREATE (i000001)-[:ASSOCIATED_WITH  { Type: "VLAN", Tenant: '[UserA]'}]->(v000001)
CREATE (i000001)-[:ASSOCIATED_WITH  { Type: "VLAN", Tenant: '[UserB]'}]->(v000002)
CREATE (i000002)-[:ASSOCIATED_WITH  { Type: "VLAN", Tenant: '[UserB]'}]->(v000003)

// Switch000002
CREATE (s000002:Switch {name: 'Switch000002', Tenant: '[UserA, UserB, UserC]'})

// Interfaces with Switch000001
CREATE (i000003:Interface {name: '0/1', Tenant: '[UserA, UserB]', Tag: 'True'})
CREATE (i000004:Interface {name: '0/2', Tenant: '[UserC]', Tag: 'False'})

// VLAN with Interface 0/1 of Switch000001
CREATE (v000004:VLAN {name: '10', Tenant: '[UserA]'})
CREATE (v000005:VLAN {name: '20', Tenant: '[UserB]'})

// VLAN with Interface 0/1 of Switch000001
CREATE (v000006:VLAN {name: '30', Tenant: '[UserC]'})

// Relationship between Switch000001 and Interface0/1 and 0/2
CREATE (s000002)-[:HAS_INTERFACE { Type: "GigabitEthernet", Tenant: '[UserA, UserB]' }]->(i000003)
CREATE (s000002)-[:HAS_INTERFACE { Type: "GigabitEthernet", Tenant: '[UserC]'}]->(i000004)

// Relationship between Interface0/1,2 and vlan10,20 
CREATE (i000003)-[:ASSOCIATED_WITH { Type: "VLAN", Tenant: '[UserA]'}]->(v000004)
CREATE (i000003)-[:ASSOCIATED_WITH { Type: "VLAN", Tenant: '[UserB]'}]->(v000005)

CREATE (v000001)-[:CONNECTED_TO { Type: "VLAN", Tenant: '[UserA]'}]->(v000004)
CREATE (v000004)-[:CONNECTED_TO { Type: "VLAN", Tenant: '[UserA]'}]->(v000001)

CREATE (v000002)-[:CONNECTED_TO { Type: "VLAN", Tenant: '[UserB]'}]->(v000005)
CREATE (v000005)-[:CONNECTED_TO { Type: "VLAN", Tenant: '[UserB]'}]->(v000002)

CREATE (v000003)-[:CONNECTED_TO { Type: "VLAN", Tenant: '[UserC]'}]->(i000004)
CREATE (i000004)-[:CONNECTED_TO { Type: "VLAN", Tenant: '[UserC]'}]->(v000003)
```

Neo4j View
![neo4j_network_topology_9](https://github.com/user-attachments/assets/e0b7bc6f-d5c3-4537-aa94-2e7e9285e776)

#### Router Interface（修正前）

![image](https://github.com/squirrel-cage-work/netgraph/assets/87857140/2b88923d-e32c-4798-8c6f-2c78ca6d69de)

Node Example
``` example
CREATE (r000001:Router {name: 'Router000001', Tenant: '[UserA, UserB]'})

// Interfaces with Router000001
CREATE (i000001:Interface {name: '0/1', Tenant: '[UserA, UserB]'})
CREATE (i000002:Interface {name: '0/2', Tenant: 'None'})

// VLANVRF for Interfaces of Router000001
CREATE (vr000001:VRF {name: '10', Tenant: '[UserA]'})
CREATE (vr000002:VRF {name: '20', Tenant: '[UserB]'})

// Relationships between Router000001 and Interfaces
CREATE (r000001)-[:HAS_INTERFACE { Type: "GigabitEthernet", Tenant: '[UserA, UserB]' }]->(i000001)
CREATE (r000001)-[:HAS_INTERFACE { Type: "GigabitEthernet", Tenant: 'None' }]->(i000002)

// Relationships between Interfaces and VLANVRFs
CREATE (i000001)-[:ASSOCIATED_WITH { Type: "VRF", Tenant: '[UserA]' }]->(vr000001)
CREATE (i000001)-[:ASSOCIATED_WITH { Type: "VRF", Tenant: '[UserB]' }]->(vr000002)
```

Neo4j View
![image](https://github.com/squirrel-cage-work/netgraph/assets/87857140/96a48729-9a42-4e9f-b1dd-db55bca4a99e)


