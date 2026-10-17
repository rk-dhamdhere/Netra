"""Import the generated 200-case manifest into Neo4j."""

import csv
import os
from pathlib import Path

from neo4j import GraphDatabase


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "data" / "manifest" / "case_manifest.csv"


def import_cases() -> int:
    driver = GraphDatabase.driver(
        os.getenv("NEO4J_URI", "bolt://localhost:7687"),
        auth=(
            os.getenv("NEO4J_USER", "neo4j"),
            os.getenv("NEO4J_PASSWORD", "dev_password"),
        ),
    )
    imported = 0
    try:
        with MANIFEST.open(newline="", encoding="utf-8") as handle:
            rows = csv.DictReader(handle)
            with driver.session() as session:
                for row in rows:
                    people = [item for item in row["entities_involved"].split(";") if item]
                    session.run(
                        """
                        MERGE (c:Case {id: $case_id})
                        SET c.tier = $tier,
                            c.hub_id = $hub_id,
                            c.num_entities = toInteger($num_entities),
                            c.evidence_types = $evidence_types
                        WITH c
                        UNWIND $people AS person_id
                        MERGE (p:Person {id: person_id})
                        MERGE (p)-[:INVOLVED_IN]->(c)
                        """,
                        case_id=row["case_id"],
                        tier=row["tier"],
                        hub_id=row["hub_id"],
                        num_entities=row["num_entities"],
                        evidence_types=row["evidence_types"],
                        people=people,
                    )
                    imported += 1
    finally:
        driver.close()
    return imported


if __name__ == "__main__":
    print(f"Imported {import_cases()} cases into Neo4j")
