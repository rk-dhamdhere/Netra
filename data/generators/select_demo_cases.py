import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import json
import pandas as pd
from graph_topology import G

MANIFEST_PATH = "data/manifest/case_manifest.csv"

def load_manifest():
    return pd.read_csv(MANIFEST_PATH, keep_default_na=False)

def find_strongest_flagship(df):
    """Tier 3 case with the most bridge entities — richest cross-case story."""
    candidates = df[(df["tier"] == 3) & (df["bridge_entities"] != "")]
    if candidates.empty:
        return None
    candidates = candidates.copy()
    candidates["bridge_count"] = candidates["bridge_entities"].apply(lambda x: len(x.split(";")))
    best = candidates.sort_values("bridge_count", ascending=False).iloc[0]
    return best["case_id"], best["bridge_count"]

def find_best_reveal_case(df):
    """Tier 1 case carrying a bridge, linked to a flagship via that bridge's hub connections."""
    # Build hub_id -> flagship case_id lookup
    flagship_by_hub = {}
    flagship_rows = df[(df["tier"] == 3) & (df["bridge_entities"] != "")]
    for _, row in flagship_rows.iterrows():
        flagship_by_hub[row["hub_id"]] = row["case_id"]

    reveal_candidates = df[(df["tier"] == 1) & (df["bridge_entities"] != "")]
    best = None
    best_linked_richness = -1

    for _, row in reveal_candidates.iterrows():
        bridge_ids = row["bridge_entities"].split(";")
        for bridge_id in bridge_ids:
            node_data = G.nodes.get(bridge_id, {})
            # bridge persons don't store hub directly, so check their edges to kingpins
            for _, target, edge_data in G.out_edges(bridge_id, data=True):
                target_data = G.nodes.get(target, {})
                if target_data.get("is_kingpin"):
                    linked_hub = target_data.get("home_hub")
                    linked_case = flagship_by_hub.get(linked_hub)
                    if linked_case:
                        linked_row = df[df["case_id"] == linked_case]
                        if not linked_row.empty:
                            num_entities = linked_row.iloc[0]["num_entities"]
                            if num_entities > best_linked_richness:
                                best_linked_richness = num_entities
                                best = (row["case_id"], linked_case)
    return best

def find_financial_pattern_case(df):
    """Case whose per-case financial file contains a 'suspicious'-flagged transaction."""
    for _, row in df.iterrows():
        if "Financial" not in row["evidence_types"]:
            continue
        path = f"data/raw/financial/per_case/{row['case_id']}_financial.csv"
        if os.path.exists(path):
            fin_df = pd.read_csv(path, dtype=str)
            if "FLAG" in fin_df.columns and (fin_df["FLAG"] == "suspicious").any():
                suspicious_count = (fin_df["FLAG"] == "suspicious").sum()
                return row["case_id"], suspicious_count
    return None

def find_face_match_pair(df):
    """Two Photo-evidence cases sharing the same Person entity (a bridge)."""
    photo_cases = df[df["evidence_types"].str.contains("Photo")]
    person_to_cases = {}
    for _, row in photo_cases.iterrows():
        entity_ids = row["entities_involved"].split(";") if row["entities_involved"] else []
        for eid in entity_ids:
            if G.nodes.get(eid, {}).get("node_type") == "Person":
                person_to_cases.setdefault(eid, []).append(row["case_id"])
    for person_id, case_ids in person_to_cases.items():
        unique_cases = list(set(case_ids))
        if len(unique_cases) >= 2:
            return person_id, unique_cases[:2]
    return None

def find_mundane_control_case(df):
    """Tier 1 case with no bridges, no links — a clean 'nothing to see here' control."""
    candidates = df[
        (df["tier"] == 1) &
        (df["bridge_entities"] == "") &
        (df["linked_cases"] == "")
    ]
    if candidates.empty:
        return None
    return candidates.iloc[0]["case_id"]

if __name__ == "__main__":
    df = load_manifest()
    shortlist = {}

    flagship = find_strongest_flagship(df)
    if flagship:
        shortlist["strongest_flagship"] = {
            "case_id": flagship[0],
            "bridge_count": int(flagship[1]),
            "reason": "Tier 3 case with the most planted bridge connections — richest single-case story"
        }

    reveal_pair = find_best_reveal_case(df)
    if reveal_pair:
        shortlist["reveal_pair"] = {
            "minor_case_id": reveal_pair[0],
            "major_case_id": reveal_pair[1],
            "reason": "A small Tier 1 case secretly linked to a major Tier 3 case — the core 'hidden connection' demo moment"
        }

    financial_case = find_financial_pattern_case(df)
    if financial_case:
        shortlist["financial_pattern_case"] = {
            "case_id": financial_case[0],
            "suspicious_transaction_count": int(financial_case[1]),
            "reason": "Contains a planted circular money-laundering pattern — demonstrates suspicious pattern detection"
        }

    face_match = find_face_match_pair(df)
    if face_match:
        shortlist["face_match_pair"] = {
            "shared_person_id": face_match[0],
            "person_name": G.nodes[face_match[0]].get("name"),
            "case_ids": face_match[1],
            "reason": "Same person's photo appears in two different cases — demonstrates cross-case facial recognition"
        }

    mundane = find_mundane_control_case(df)
    if mundane:
        shortlist["mundane_control_case"] = {
            "case_id": mundane,
            "reason": "Genuinely isolated Tier 1 case — demonstrates the system correctly finds NO false connection"
        }

    os.makedirs("data/manifest", exist_ok=True)
    with open("data/manifest/demo_case_shortlist.json", "w", encoding="utf-8") as f:
        json.dump(shortlist, f, indent=2)

    print("=" * 60)
    print("DEMO CASE SHORTLIST")
    print("=" * 60)
    print(json.dumps(shortlist, indent=2))
    print("\nSaved to data/manifest/demo_case_shortlist.json")