import os
from fastapi import APIRouter, HTTPException
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "dev_password")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

@router.get("/graph-data")
async def get_graph_data():
    """
    Fetches the POLE+O graph topology for the React Flow frontend.
    """
    cypher_query = """
    MATCH (n)
    OPTIONAL MATCH (n)-[r]->(m)
    RETURN collect(DISTINCT n) AS nodes, collect(DISTINCT r) AS edges
    """
    
    try:
        with driver.session() as session:
            result = session.run(cypher_query)
            record = result.single()
            
            if not record:
                return {"nodes": [], "edges": []}
            
            raw_nodes = record["nodes"] or []
            raw_edges = record["edges"] or []
            
            # Map Neo4j nodes to React Flow format
            nodes = [
                {
                    "id": str(node.get("id", node.element_id)),
                    "data": {
                        **dict(node),
                        "labels": list(node.labels),
                        "node_type": next(iter(node.labels), "Entity"),
                        "visual_weight": (
                            "kingpin" if node.get("is_kingpin") or str(node.get("tier") or "").lower() == "kingpin"
                            else "mule" if str(node.get("tier") or "").lower() in {"mule", "low-level", "low_level"}
                            else "standard"
                        ),
                    },
                    "position": {"x": 100, "y": 100}
                }
                for node in raw_nodes
            ]
            
            # Map Neo4j relationships to React Flow format
            edges = [
                {
                    "id": str(rel.element_id),
                    "source": str(rel.start_node.get("id", rel.start_node.element_id)),
                    "target": str(rel.end_node.get("id", rel.end_node.element_id)),
                    "label": rel.type,
                    "data": dict(rel)
                }
                for rel in raw_edges
            ]
            
            return {
                "nodes": nodes,
                "edges": edges
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")