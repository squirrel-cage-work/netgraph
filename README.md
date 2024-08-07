# ネットワーク構成管理プロジェクト：netgraph

このプロジェクトではグラフデータベースを使用して複雑なネットワーク構成を管理するグラフデータベースを目指しています。

## 概要

現状のこのグラフデータベースではネットワークスイッチ、ルータ、インターフェース、VLANの関係を表現して管理することができます。主要なコンポーネントと関係性は以下の通りです。

1. **Switch**: ネットワークスイッチ
2. **Router**: ネットワークルータ
3. **Interface**: 物理インターフェース
4. **VLAN**: VLAN
5. **VRF**: VRF

## データモデル

### ノード

1. **Switch**
   - 属性: name, Tenant
   - 例: `(s000001:Switch {name: 'Switch000001', Tenant: '[UserA, UserB, UserC]'})`
     
2. **Interface**
   - 属性: name, Tenant, tag
   - 例: `(i000001:Interface {name: '0/1', Tenant: '[UserA, UserB]', Tag: 'True'})`

3. **VLAN**
    - 属性: name, Tenant
    - 例: `(v000001:VLAN {name: '10', Tenant: '[UserA]'})`
  
4. **VRF**
   - 属性: name, Tenant
   - 例: `CREATE (vr000001:VRF {name: '10', Tenant: '[UserA]'})`

### リレーションシップ

1. **HAS_INTERFACE**
   - スイッチとインターフェースの関係
   - 属性: Type, Tenant
   - 例: `(s000001)-[:HAS_INTERFACE { Type: "GigabitEthernet", Tenant: '[UserA, UserB]' }]->(i000001)`
   - ルータとインターフェースの関係
   - 属性: Type, Tenant
   - 例: `(r000001)-[:HAS_INTERFACE { Type: "GigabitEthernet", Tenant: '[UserA, UserB]' }]->(i000001)`

2. **ASSOCIATED_WITH**
   - スイッチインターフェースとVLANの関係
   - 属性: Type, Tenant
   - 例: `(i000001)-[:ASSOCIATED_WITH { Type: "VLAN", Tenant: '[UserA]'}]->(v000001)`
   - ルータインターフェースとVRFの関係
   - 属性: Type, Tenant
   - 例: `(i000001)-[:ASSOCIATED_WITH { Type: "VRF", Tenant: '[UserA]' }]->(vr000001)`
  
3. **CONNECTED_TO**
   - 接続
   - 属性: Type, Tenant
   - 例: `(v000001)-[:CONNECTED_TO { Type: "VLAN", Tenant: '[UserA]'}]->(v000004)`

## 特徴

1. **マルチテナント対応**: 各ノードとリレーションシップに`Tenant`属性があるため、複数のユーザーやグループによるリソース共有が可能になります。

2. **柔軟な属性管理**: 必要に応じて各ノードやリレーションシップに属性を追加できます。

3. **階層構造**: Switch, Router, Interface, VLAN の階層関係を表現します。

4. **物理/論理分離**: 物理的な接続（HAS_INTERFACE）と論理的な関連（ASSOCIATED_WITH, CONNECTED_TO）を区別します。

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


