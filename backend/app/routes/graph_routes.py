import os
from fastapi import APIRouter
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "dev_password")

try:
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
except Exception:
    driver = None

# Global dynamic cache that holds the most recent AI extraction
LATEST_GRAPH_CACHE = {
    "nodes": [],
    "edges": []
}

def update_latest_graph(graph_dict: dict):
    """
    Called by extract_fir_endpoint to keep the graph in sync with the user's latest FIR text.
    """
    global LATEST_GRAPH_CACHE

    nodes = []
    edges = []

    # 1. Parse Suspects / Persons
    suspects = graph_dict.get("suspects", []) or graph_dict.get("persons", [])
    primary_id = None

    for idx, suspect in enumerate(suspects):
        name = suspect if isinstance(suspect, str) else suspect.get("name", f"Suspect {idx+1}")
        s_id = f"person_{idx+1}"
        if idx == 0:
            primary_id = s_id
        
        nodes.append({
            "id": s_id,
            "data": {
                "name": name,
                "risk_score": 95 if idx == 0 else 75,
                "tier": "Primary" if idx == 0 else "Associate",
                "labels": ["Person"],
                "node_type": "Person",
                "visual_weight": "kingpin" if idx == 0 else "mule"
            },
            "position": {"x": 380 if idx == 0 else 200, "y": 80 if idx == 0 else 240}
        })

    # Link primary suspect to associates
    if primary_id and len(suspects) > 1:
        for idx in range(1, len(suspects)):
            edges.append({
                "id": f"edge_primary_assoc_{idx}",
                "source": primary_id,
                "target": f"person_{idx+1}",
                "label": "OPERATIONAL_ASSOCIATE"
            })

    # 2. Parse Vehicles
    vehicles = graph_dict.get("vehicles", [])
    for idx, vehicle in enumerate(vehicles):
        name = vehicle if isinstance(vehicle, str) else vehicle.get("name", vehicle.get("model", f"Vehicle {idx+1}"))
        v_id = f"vehicle_{idx+1}"
        nodes.append({
            "id": v_id,
            "data": {
                "name": name,
                "type": "vehicle",
                "labels": ["Vehicle"],
                "node_type": "Vehicle",
                "visual_weight": "standard"
            },
            "position": {"x": 560, "y": 240}
        })
        if primary_id:
            edges.append({
                "id": f"edge_{primary_id}_{v_id}",
                "source": primary_id,
                "target": v_id,
                "label": "OPERATED_VEHICLE"
            })

    # 3. Parse Locations
    locations = graph_dict.get("locations", [])
    for idx, loc in enumerate(locations):
        name = loc if isinstance(loc, str) else loc.get("name", f"Location {idx+1}")
        l_id = f"loc_{idx+1}"
        nodes.append({
            "id": l_id,
            "data": {
                "name": name,
                "type": "location",
                "labels": ["Location"],
                "node_type": "Location",
                "visual_weight": "standard"
            },
            "position": {"x": 260 + (idx * 240), "y": 380}
        })
        # Link associate or vehicle to location
        target_src = f"person_{min(2, len(suspects))}" if len(suspects) >= 2 else primary_id
        if target_src:
            edges.append({
                "id": f"edge_{target_src}_{l_id}",
                "source": target_src,
                "target": l_id,
                "label": "LAST_KNOWN_SIGHTING"
            })

    LATEST_GRAPH_CACHE = {
        "nodes": nodes,
        "edges": edges
    }

@router.get("/graph-data")
async def get_graph_data():
    """
    Returns active Neo4j graph data, or the latest dynamic AI extraction cache if Neo4j is offline.
    """
    cypher_query = """
    MATCH (n)
    OPTIONAL MATCH (n)-[r]->(m)
    RETURN collect(DISTINCT n) AS nodes, collect(DISTINCT r) AS edges
    """
    
    try:
        if driver is None:
            raise Exception("Neo4j driver not initialized.")
            
        with driver.session() as session:
            result = session.run(cypher_query)
            record = result.single()
            if not record or not record["nodes"]:
                raise Exception("Neo4j returned empty nodes.")
            
            raw_nodes = record["nodes"] or []
            raw_edges = record["edges"] or []
            
            nodes = [
                {
                    "id": str(node.get("id", node.element_id)),
                    "data": {
                        **dict(node),
                        "labels": list(node.labels),
                        "node_type": next(iter(node.labels), "Entity"),
                        "visual_weight": (
                            "kingpin" if node.get("is_kingpin") or str(node.get("tier") or "").lower() == "kingpin"
                            else "mule" if str(node.get("tier") or "").lower() in {"mule", "low-level"}
                            else "standard"
                        ),
                    },
                    "position": {"x": 100, "y": 100}
                }
                for node in raw_nodes
            ]
            
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
            
            return {"nodes": nodes, "edges": edges}

    except Exception as e:
        print(f"[INFO] Using dynamic extraction cache (Neo4j: {e})")
        # If cache has nodes from recent extraction, serve them
        if LATEST_GRAPH_CACHE["nodes"]:
            return LATEST_GRAPH_CACHE
        
        # Fallback default
        return {
            "nodes": [
                {
                    "id": "node_vikram_malhotra",
                    "data": {
                        "name": "Vikram Malhotra",
                        "risk_score": 92,
                        "tier": "Primary",
                        "labels": ["Person"],
                        "node_type": "Person",
                        "visual_weight": "kingpin"
                    },
                    "position": {"x": 380, "y": 80}
                },
                {
                    "id": "node_rajesh",
                    "data": {
                        "name": "Rajesh",
                        "risk_score": 74,
                        "tier": "Associate",
                        "labels": ["Person"],
                        "node_type": "Person",
                        "visual_weight": "mule"
                    },
                    "position": {"x": 200, "y": 240}
                },
                {
                    "id": "node_scorpio",
                    "data": {
                        "name": "White Scorpio (DL-8C-4921)",
                        "type": "vehicle",
                        "labels": ["Vehicle"],
                        "node_type": "Vehicle",
                        "visual_weight": "standard"
                    },
                    "position": {"x": 560, "y": 240}
                },
                {
                    "id": "node_lajpat_nagar",
                    "data": {
                        "name": "Lajpat Nagar Market",
                        "type": "location",
                        "labels": ["Location"],
                        "node_type": "Location",
                        "visual_weight": "standard"
                    },
                    "position": {"x": 380, "y": 380}
                }
            ],
            "edges": [
                {
                    "id": "edge_malhotra_rajesh",
                    "source": "node_vikram_malhotra",
                    "target": "node_rajesh",
                    "label": "OPERATIONAL_MEETING"
                },
                {
                    "id": "edge_malhotra_scorpio",
                    "source": "node_vikram_malhotra",
                    "target": "node_scorpio",
                    "label": "SEEN_IN_VEHICLE"
                },
                {
                    "id": "edge_meeting_lajpat",
                    "source": "node_rajesh",
                    "target": "node_lajpat_nagar",
                    "label": "MEETING_LOCATION"
                }
            ]
        }