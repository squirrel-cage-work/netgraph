# ネットワーク構成管理プロジェクト：netgraph

このプロジェクトではグラフデータベースを使用して複雑なネットワーク構成を管理するグラフデータベースを目指しています。

## 概要

現状のこのグラフデータベースではネットワークスイッチ、ルータ、インターフェース、VLANの関係を表現して管理することができます。主要なコンポーネントと関係性は以下の通りです。

1. **Switch**: ネットワークスイッチ
2. **Router**: ネットワークルータ
3. **Interface**: 物理インターフェース
4. **VLAN**:VLAN

## データモデル

### ノード

1. **Switch**
   - 属性: name, Tenant
   - 例: `(s000001:Switch {name: 'Switch000001', Tenant: '[UserA, UserB, UserC]'})`

### Switch Interface

- Not Support
  - access port
  - 他多数
- Support
  - simple trunk port
    
![image](https://github.com/squirrel-cage-work/netgraph/assets/87857140/06dd0e90-f998-40da-a8ed-a7f72132e72b)

- Node
  - Switch 筐体
    - properties name = Switch ホスト名, Tenant = 収容されている部署やユーザなど 
  - Switch Interface
    - properties name = Interface 名, Tenant = 収容されている部署やユーザなど, Tag = True/False
  - VLAN
    - properties name = VLAN ID, Tenant = 収容されているユーザ
   
- Relationship
  - Siwtch 筐体 -(1)-> Switch Interface -(2)-> VLAN
    - (1) properties Type = GigabitEthernet etc.., Tenant = 収容されている部署やユーザなど
    - (2) properties Type = Virtualization, Tenant = 収容されている部署やユーザなど

Node Example
```
// Switch000001
CREATE (s000001:Switch {name: 'Switch000001', Tenant: '[UserA, UserB, UserC]'})

// Interfaces with Switch000001
CREATE (i000001:Interface {name: '0/1', Tenant: '[UserA, UserB]', Tag: 'True})
CREATE (i000002:Interface {name: '0/2', Tenant: '[UserC]', Tag: 'False'})

// VLAN with Interface 0/1 of Switch000001
CREATE (v000001:VLAN {name: '10', Tenant: '[UserA]'})
CREATE (v000002:VLAN {name: '20', Tenant: '[UserB]'})

// VLAN with Interface 0/1 of Switch000001
CREATE (v000003:VLAN {name: '30', Tenant: '[UserC]'})
```

Relationship Example
```
// Relationship between Switch000001 and Interface0/1 and 0/2
CREATE (s000001)-[:Direct { Type: "GigabitEthernet", Tenant: '[UserA, UserB]' }]->(i000001)
CREATE (s000001)-[:Direct { Type: "GigabitEthernet", Tenant: '[UserC]'}]->(i000002)

// Relationship between Interface0/1,2 and vlan10,20 
CREATE (i000001)-[:Direct { Type: "Virtualization", Tenant: '[UserA]'}]->(v000001)
CREATE (i000001)-[:Direct { Type: "Virtualization", Tenant: '[UserB]'}]->(v000002)
CREATE (i000002)-[:Direct { Type: "Virtualization", Tenant: '[UserB]'}]->(v000003)
```

Neo4j View
![image](https://github.com/squirrel-cage-work/netgraph/assets/87857140/a2357ba0-06ca-4706-9925-3da8cc106400)

#### Router Interface 

![image](https://github.com/squirrel-cage-work/netgraph/assets/87857140/2b88923d-e32c-4798-8c6f-2c78ca6d69de)

以下のようなケースの場合の Neo4j 上での Router Interface の rule は以下の通り。

- Node
  - Router 筐体
    - properties : name = Router ホスト名, Tenant = 収容されている部署やユーザなど
  - Router Interface
    - properties : name = Interface 名, Tenant = 収容されている部署やユーザなど
- VLAN / VRF
  - properties : name = VLAN ID, Tenant = 収容されている部署やユーザなど

- Relationship
  - Router 筐体 --> Router Interface --> VLAN/VRF

Node Example
``` example
CREATE (r000001:Router {name: 'Router000001', Tenant: '[UserA, UserB]'})

CREATE (i000001:Interface {name: '0/1', Tenant: '[UserA, UserB]'})
CREATE (i000002:Interface {name: '0/2'})

CREATE (v000001:VLANVRF {name: '10', Tenant: '[UserA]'})
CREATE (v000002:VLANVRF {name: '20', Tenant: '[UserB]'})
````

Relationship Example
```
CREATE (r000001)-[:Direct { Type: "GigabitEthernet", Tenant: '[UserA, UserB]' }]->(i000001)
CREATE (r000001)-[:Direct { Type: "GigabitEthernet"}]->(i000002)

CREATE (i000001)-[:Direct { Type: "Virtualization", Tenant: '[UserA]'}]->(v000001)
CREATE (i000001)-[:Direct { Type: "Virtualization", Tenant: '[UserB]'}]->(v000002)
```

Neo4j View
![image](https://github.com/squirrel-cage-work/netgraph/assets/87857140/96a48729-9a42-4e9f-b1dd-db55bca4a99e)

### Switch Interface

