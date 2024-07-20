import re
import logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def check_properties_for_switch(node_id,node_properties):
    """
    この関数は与えられた文字列が以下の特定の形式に一致するかどうかを確認します。
    1. node_id が s で始まり、続けて6桁の数字が含まれている形式
    2. node_properties name: '<switch_name>', Tenant: '[<tenant1>, <tenant2>, ...]' の形式
    """

    node_id_pattern         = r"^s\d{6}$"
    node_properties_pattern = r"name:\s*'([^']*)'\s*,\s*Tenant:\s*'\[\s*(.*?)\s*\]'" 

    if re.fullmatch(node_id_pattern, node_id) is None:
        logging.error(f"Invalid node_id: {node_id}")
        return False
    if re.fullmatch(node_properties_pattern, node_properties) is None:
        logging.error(f"Invalid node_properties: {node_properties}")
        return False

    return True

def validate_cypher_syntax(query):
    # 正規表現パターン
    pattern = r"""
    CREATE\s+\(
        (\w+):(\w+) # ノードIDとラベル
        \s*\{       # プロパティの開始
        (.*?)       # プロパティの内容
        \}          # プロパティの終了
    \)
    """
    match = re.search(pattern, query, re.IGNORECASE | re.VERBOSE)

    node_id         = match.group(1) # ノードID
    node_label      = match.group(2) # ノードラベル
    node_properties = match.group(3) # プロパティの内容

    # 
    if node_label == 'Switch':
        if check_properties_for_switch(node_id,node_properties):
            logging.info("Node properties are valid.")
            return node_id, node_label, node_properties
        else:
            logging.warning("Node properties are invalid.")
            return None, None, None
        

'''
Test
'''

query1 = '''
CREATE (s000001:Switch {name: 'Switch000001', Tenant: '[UserA, UserB, UserC]'})
'''

query2 = '''
CREATE (s000001:Switch {name: 'Switch000001'})
'''

query3 = '''
CREATE (i000001:Switch {name: 'Switch000001', Tenant: '[UserA, UserB, UserC]'})
'''

response = validate_cypher_syntax(query1)
print(response)
