import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import json
import pandas as pd
from graph_topology import G

MANIFEST_PATH = "data/manifest/case_manifest.csv"
FIR_INDEX_PATH = "data/manifest/fir_index.csv"
PHOTO_INDEX_PATH = "data/manifest/photo_index.csv"
OUTPUT_DIR = "data/manifest/case_bundles"

def load_fir_text(case_id):
    path = f"data/raw/firs/{case_id}.txt"
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return None

def load_csv_as_records(path):
    if os.path.exists(path):
        return pd.read_csv(path, dtype=str).to_dict(orient="records")
    return []

def get_photo_map():
    if os.path.exists(PHOTO_INDEX_PATH):
        photo_df = pd.read_csv(PHOTO_INDEX_PATH, keep_default_na=False)
        return {row["person_id"]: row["file_path"] for _, row in photo_df.iterrows()}
    return {}

def build_entity_details(entity_ids, photo_map):
    details = []
    for eid in entity_ids:
        if eid not in G.nodes:
            continue
        node = G.nodes[eid]
        details.append({
            "entity_id": eid,
            "name": node.get("name"),
            "hierarchy_tier": node.get("hierarchy_tier"),
            "risk_score": node.get("risk_score"),
            "is_kingpin": node.get("is_kingpin", False),
            "photo_path": photo_map.get(eid)
        })
    return details

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    manifest = pd.read_csv(MANIFEST_PATH, keep_default_na=False)
    photo_map = get_photo_map()

    bundles_written = 0

    for _, row in manifest.iterrows():
        case_id = row["case_id"]
        entity_ids = row["entities_involved"].split(";") if row["entities_involved"] else []
        evidence_types = row["evidence_types"].split(";")

        bundle = {
            "case_id": case_id,
            "tier": int(row["tier"]),
            "hub_id": row["hub_id"],
            "evidence_types": evidence_types,
            "bridge_entities": row["bridge_entities"].split(";") if row["bridge_entities"] else [],
            "linked_cases": row["linked_cases"].split(";") if row["linked_cases"] else [],
            "entities": build_entity_details(entity_ids, photo_map),
            "fir_text": load_fir_text(case_id),
            "cdr_records": load_csv_as_records(f"data/raw/cdrs/per_case/{case_id}_cdr.csv") if "CDR" in evidence_types else [],
            "financial_records": load_csv_as_records(f"data/raw/financial/per_case/{case_id}_financial.csv") if "Financial" in evidence_types else [],
        }

        with open(f"{OUTPUT_DIR}/{case_id}.json", "w", encoding="utf-8") as f:
            json.dump(bundle, f, indent=2)

        bundles_written += 1

    print(f"Case bundles written: {bundles_written}")
    print(f"Output directory: {OUTPUT_DIR}")
    print("\nSample bundle (case_001) preview:")
    with open(f"{OUTPUT_DIR}/case_001.json", encoding="utf-8") as f:
        sample = json.load(f)
        preview = {k: (v if k != "fir_text" else v[:150] + "...") for k, v in sample.items()}
        print(json.dumps(preview, indent=2))