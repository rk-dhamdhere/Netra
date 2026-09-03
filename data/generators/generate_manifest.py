import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import random
import pandas as pd
from graph_topology import G, hubs, hub_kingpin_ids, all_regular_persons, bridge_person_ids, bridges

random.seed(7)  # separate seed from graph generation, keeps manifest sampling independent

# ---------------------------------------------------------
# Build hub_id -> list of person_ids (kingpin + regular members, NO bridges)
# ---------------------------------------------------------
hub_members = {hub["hub_id"]: [] for hub in hubs}
for hub_id, kingpin_id in hub_kingpin_ids.items():
    hub_members[hub_id].append(kingpin_id)
for person_id, hub_id in all_regular_persons:
    hub_members[hub_id].append(person_id)

# Map each bridge to its actual person_id + the two hubs it connects
bridge_info = []
for bridge, bp_id in zip(bridges, bridge_person_ids):
    bridge_info.append({
        "bridge_id": bridge["bridge_id"],
        "person_id": bp_id,
        "hub_1": bridge["hub_1"],
        "hub_2": bridge["hub_2"],
        "type": bridge["type"],
    })

manifest_rows = []
case_counter = 1

def next_case_id():
    global case_counter
    cid = f"case_{case_counter:03d}"
    case_counter += 1
    return cid

# ===========================================================
# TIER 3 — 6 FLAGSHIP CASES (one per hub, absorbs every bridge touching that hub)
# ===========================================================
flagship_case_ids = {}

for hub in hubs:
    hub_id = hub["hub_id"]
    case_id = next_case_id()
    flagship_case_ids[hub_id] = case_id

    core_entities = random.sample(hub_members[hub_id], k=min(10, len(hub_members[hub_id])))
    bridges_here = [b for b in bridge_info if b["hub_1"] == hub_id or b["hub_2"] == hub_id]
    bridge_entities_here = [b["person_id"] for b in bridges_here]

    all_entities = list(set(core_entities + bridge_entities_here))

    manifest_rows.append({
        "case_id": case_id,
        "tier": 3,
        "hub_id": hub_id,
        "num_entities": len(all_entities),
        "entities_involved": ";".join(all_entities),
        "evidence_types": "FIR;CDR;Financial;Photo",
        "bridge_entities": ";".join(bridge_entities_here),
        "linked_cases": "",  # resolved below, once all 6 flagship case_ids exist
    })

# now that all 6 flagships exist, resolve linked_cases for each
for row in manifest_rows:
    if row["bridge_entities"]:
        bp_ids = row["bridge_entities"].split(";")
        linked = set()
        for bp_id in bp_ids:
            match = next(b for b in bridge_info if b["person_id"] == bp_id)
            other_hub = match["hub_2"] if match["hub_1"] == row["hub_id"] else match["hub_1"]
            linked.add(flagship_case_ids[other_hub])
        row["linked_cases"] = ";".join(sorted(linked))

# ===========================================================
# TIER 3 — remaining 44 organic dense cases (no bridges)
# ===========================================================
TIER3_TOTAL = 50
remaining_tier3 = TIER3_TOTAL - len(hubs)

for _ in range(remaining_tier3):
    hub = random.choice(hubs)
    hub_id = hub["hub_id"]
    case_id = next_case_id()

    pool = hub_members[hub_id]
    k = random.randint(8, min(15, len(pool)))
    entities = random.sample(pool, k=k)

    manifest_rows.append({
        "case_id": case_id,
        "tier": 3,
        "hub_id": hub_id,
        "num_entities": len(entities),
        "entities_involved": ";".join(entities),
        "evidence_types": "FIR;CDR;Financial;Photo",
        "bridge_entities": "",
        "linked_cases": "",
    })

# ===========================================================
# TIER 1 — 80 cases (1-2 entities, single hub, no bridges — except 9 reveal cases)
# ===========================================================
TIER1_TOTAL = 80
NUM_REVEAL_CASES = 9

reveal_bridge_sample = random.sample(bridge_info, k=min(NUM_REVEAL_CASES, len(bridge_info)))

for i in range(TIER1_TOTAL):
    case_id = next_case_id()

    if i < len(reveal_bridge_sample):
        bridge = reveal_bridge_sample[i]
        hub_id = bridge["hub_1"]
        entities = [bridge["person_id"]]
        if random.random() < 0.5:
            extra_pool = [p for p in hub_members[hub_id] if p != bridge["person_id"]]
            entities.append(random.choice(extra_pool))
        bridge_entities_here = [bridge["person_id"]]
    else:
        hub = random.choice(hubs)
        hub_id = hub["hub_id"]
        pool = hub_members[hub_id]
        k = random.randint(1, 2)
        entities = random.sample(pool, k=k)
        bridge_entities_here = []

    manifest_rows.append({
        "case_id": case_id,
        "tier": 1,
        "hub_id": hub_id,
        "num_entities": len(entities),
        "entities_involved": ";".join(entities),
        "evidence_types": "FIR",
        "bridge_entities": ";".join(bridge_entities_here),
        "linked_cases": "",
    })

# ===========================================================
# TIER 2 — 70 cases (3-6 entities, single hub, FIR + one extra evidence type)
# ===========================================================
TIER2_TOTAL = 70
extra_evidence_options = ["CDR", "Financial", "Photo"]

for _ in range(TIER2_TOTAL):
    hub = random.choice(hubs)
    hub_id = hub["hub_id"]
    case_id = next_case_id()

    pool = hub_members[hub_id]
    k = random.randint(3, min(6, len(pool)))
    entities = random.sample(pool, k=k)
    extra_evidence = random.choice(extra_evidence_options)

    manifest_rows.append({
        "case_id": case_id,
        "tier": 2,
        "hub_id": hub_id,
        "num_entities": len(entities),
        "entities_involved": ";".join(entities),
        "evidence_types": f"FIR;{extra_evidence}",
        "bridge_entities": "",
        "linked_cases": "",
    })

# ===========================================================
# EXPORT + SANITY CHECK
# ===========================================================
if __name__ == "__main__":
    df = pd.DataFrame(manifest_rows)
    os.makedirs("data/manifest", exist_ok=True)
    df.to_csv("data/manifest/case_manifest.csv", index=False)

    print(f"Total cases generated: {len(df)}")
    print(df["tier"].value_counts().sort_index())
    print(f"\nFlagship (bridge-anchored) Tier 3 cases: {len(hubs)}")
    print(f"Tier 1 reveal cases (carrying a bridge): {len(reveal_bridge_sample)}")
    print(f"Total bridges accounted for across flagships: {len(bridge_info)}")
    print("\nExported: data/manifest/case_manifest.csv")