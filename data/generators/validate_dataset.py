import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import pandas as pd
from graph_topology import G, bridge_person_ids

MANIFEST_PATH = "data/manifest/case_manifest.csv"

def load_manifest():
    return pd.read_csv(MANIFEST_PATH, keep_default_na=False)

def check_case_counts(df, issues):
    total = len(df)
    if total != 200:
        issues.append(f"[FAIL] Expected 200 cases, found {total}")
    else:
        print(f"[PASS] Total cases: {total}")

    tier_counts = df["tier"].value_counts().to_dict()
    expected = {1: 80, 2: 70, 3: 50}
    for tier, expected_count in expected.items():
        actual = tier_counts.get(tier, 0)
        if actual != expected_count:
            issues.append(f"[FAIL] Tier {tier} expected {expected_count} cases, found {actual}")
        else:
            print(f"[PASS] Tier {tier}: {actual} cases")

    dupes = df["case_id"].duplicated().sum()
    if dupes > 0:
        issues.append(f"[FAIL] {dupes} duplicate case_id values found")
    else:
        print("[PASS] No duplicate case IDs")

def check_entity_references(df, issues):
    broken = []
    for _, row in df.iterrows():
        entity_ids = row["entities_involved"].split(";") if row["entities_involved"] else []
        for eid in entity_ids:
            if eid not in G.nodes:
                broken.append((row["case_id"], eid))
    if broken:
        issues.append(f"[FAIL] {len(broken)} entity references point to nonexistent nodes: {broken[:5]}...")
    else:
        print("[PASS] All entity references resolve to real graph nodes")

def check_tier_entity_counts(df, issues):
    bad = []
    for _, row in df.iterrows():
        entity_ids = row["entities_involved"].split(";") if row["entities_involved"] else []
        n = len(entity_ids)
        tier = row["tier"]
        if tier == 1 and not (1 <= n <= 2):
            bad.append((row["case_id"], tier, n))
        elif tier == 2 and not (3 <= n <= 6):
            bad.append((row["case_id"], tier, n))
        elif tier == 3 and n < 8:
            bad.append((row["case_id"], tier, n))
    if bad:
        issues.append(f"[FAIL] {len(bad)} cases violate tier entity-count rules: {bad[:5]}...")
    else:
        print("[PASS] All cases respect tier entity-count rules")

def check_evidence_types(df, issues):
    bad = []
    for _, row in df.iterrows():
        tier = row["tier"]
        evidence = set(row["evidence_types"].split(";"))
        if tier == 1 and evidence != {"FIR"}:
            bad.append((row["case_id"], evidence))
        elif tier == 3 and evidence != {"FIR", "CDR", "Financial", "Photo"}:
            bad.append((row["case_id"], evidence))
    if bad:
        issues.append(f"[FAIL] {len(bad)} cases have unexpected evidence_types for their tier: {bad[:5]}...")
    else:
        print("[PASS] Evidence types match tier rules")

def check_bridge_consistency(df, issues):
    bad_membership = []
    bad_not_real_bridge = []
    for _, row in df.iterrows():
        entity_ids = set(row["entities_involved"].split(";") if row["entities_involved"] else [])
        bridge_ids = row["bridge_entities"].split(";") if row["bridge_entities"] else []
        for bid in bridge_ids:
            if bid not in entity_ids:
                bad_membership.append((row["case_id"], bid))
            if bid not in bridge_person_ids:
                bad_not_real_bridge.append((row["case_id"], bid))
    if bad_membership:
        issues.append(f"[FAIL] {len(bad_membership)} bridge_entities not present in that case's entities_involved: {bad_membership[:5]}...")
    else:
        print("[PASS] All listed bridge_entities are present in their case's entity list")

    if bad_not_real_bridge:
        issues.append(f"[FAIL] {len(bad_not_real_bridge)} bridge_entities aren't actually one of the 12 real bridge persons: {bad_not_real_bridge[:5]}...")
    else:
        print("[PASS] All listed bridge_entities are genuine bridge persons")

def check_link_symmetry(df, issues):
    link_map = {row["case_id"]: set(row["linked_cases"].split(";")) if row["linked_cases"] else set()
                for _, row in df.iterrows()}
    asymmetric = []
    for case_id, linked in link_map.items():
        for other in linked:
            if other in link_map and case_id not in link_map[other]:
                asymmetric.append((case_id, other))
    if asymmetric:
        issues.append(f"[FAIL] {len(asymmetric)} one-directional links found (A links to B, B doesn't link back): {asymmetric[:5]}...")
    else:
        print("[PASS] All case links are symmetric")

def check_files_exist(df, issues):
    missing_fir = []
    missing_cdr = []
    missing_financial = []
    missing_photos = []

    for _, row in df.iterrows():
        case_id = row["case_id"]
        evidence = row["evidence_types"].split(";")

        if not os.path.exists(f"data/raw/firs/{case_id}.txt"):
            missing_fir.append(case_id)

        if "CDR" in evidence and not os.path.exists(f"data/raw/cdrs/per_case/{case_id}_cdr.csv"):
            missing_cdr.append(case_id)

        if "Financial" in evidence and not os.path.exists(f"data/raw/financial/per_case/{case_id}_financial.csv"):
            missing_financial.append(case_id)

        if "Photo" in evidence:
            entity_ids = row["entities_involved"].split(";") if row["entities_involved"] else []
            for eid in entity_ids:
                if G.nodes.get(eid, {}).get("node_type") == "Person":
                    if not os.path.exists(f"data/raw/photos/{eid}.jpg"):
                        missing_photos.append((case_id, eid))

    if missing_fir:
        issues.append(f"[FAIL] {len(missing_fir)} cases missing their FIR text file: {missing_fir[:5]}...")
    else:
        print("[PASS] All 200 FIR text files exist")

    if missing_cdr:
        issues.append(f"[INFO] {len(missing_cdr)} CDR-flagged cases have no per-case CDR file (may be expected — no matching calls generated): {missing_cdr[:5]}...")
    else:
        print("[PASS] All CDR-flagged cases have a per-case CDR file")

    if missing_financial:
        issues.append(f"[INFO] {len(missing_financial)} Financial-flagged cases have no per-case file (may be expected — no matching transactions generated): {missing_financial[:5]}...")
    else:
        print("[PASS] All Financial-flagged cases have a per-case file")

    if missing_photos:
        issues.append(f"[FAIL] {len(missing_photos)} Photo-flagged persons are missing their photo file: {missing_photos[:5]}...")
    else:
        print("[PASS] All required photos exist")

if __name__ == "__main__":
    df = load_manifest()
    issues = []

    print("=" * 60)
    print("DATASET VALIDATION REPORT")
    print("=" * 60)

    check_case_counts(df, issues)
    check_entity_references(df, issues)
    check_tier_entity_counts(df, issues)
    check_evidence_types(df, issues)
    check_bridge_consistency(df, issues)
    check_link_symmetry(df, issues)
    check_files_exist(df, issues)

    print("\n" + "=" * 60)
    if issues:
        print(f"VALIDATION COMPLETE — {len(issues)} ISSUE(S) FOUND:")
        for issue in issues:
            print(issue)
    else:
        print("VALIDATION COMPLETE — ALL CHECKS PASSED, NO ISSUES FOUND")
    print("=" * 60)