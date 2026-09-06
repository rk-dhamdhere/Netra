from neo4j import GraphDatabase

NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "dev_password"

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

def write_to_neo4j(graph_data: dict):
    """Writes the extracted POLE+O JSON dictionary into Neo4j."""
    with driver.session() as session:
        # 1. Merge Persons
        for person in graph_data.get("persons", []):
            session.run("""
                MERGE (p:Person {id: $id})
                SET p.name = $name, p.risk_score = $risk, p.tier = $tier
            """, id=person["id"], name=person.get("name"), risk=person.get("risk_score"), tier=person.get("hierarchy_tier"))
        
        # 2. Merge Objects (Phones, Vehicles, etc.)
        for obj in graph_data.get("objects", []):
            session.run("""
                MERGE (o:Object {id: $id})
                SET o.type = $type, o.value = $value
            """, id=obj["id"], type=obj.get("type"), value=obj.get("identifier_value"))
            
        # 3. Merge Relationships
        for rel in graph_data.get("relationships", []):
            rel_type = rel.get("relation_type", "RELATED_TO").upper()
            session.run(f"""
                MATCH (source {{id: $source_id}})
                MATCH (target {{id: $target_id}})
                MERGE (source)-[r:{rel_type}]->(target)
            """, source_id=rel["source_id"], target_id=rel["target_id"])
            
    print("Successfully ingested graph data into Neo4j!")