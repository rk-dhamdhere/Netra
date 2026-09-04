import networkx as nx
from faker import Faker
import random
import datetime

random.seed(42)
fake = Faker('en_IN')

G = nx.DiGraph()  # directed, since POLE+O relationships have direction

# ---------------------------------------------------------
# 1. HUBS — hard-coded from your Phase 1 spreadsheet
# ---------------------------------------------------------
hubs = [
    {"hub_id": "H1", "kingpin_name": "Raju Mehta", "org_name": "Dadar Syndicate", "org_type": "narcotics", "base_location": "Dadar Hideout"},
    {"hub_id": "H2", "kingpin_name": "Vikram Solanki", "org_name": "Kurla Network", "org_type": "extortion", "base_location": "Kurla Warehouse"},
    {"hub_id": "H3", "kingpin_name": "Imran Sheikh", "org_name": "Andheri Cell", "org_type": "trafficking", "base_location": "Andheri Flat"},
    {"hub_id": "H4", "kingpin_name": "Deepak Naik", "org_name": "Wadala Group", "org_type": "financial_fraud", "base_location": "Wadala Godown"},
    {"hub_id": "H5", "kingpin_name": "Sunil Pradhan", "org_name": "Thane Syndicate", "org_type": "narcotics", "base_location": "Thane Base"},
    {"hub_id": "H6", "kingpin_name": "Faisal Khan", "org_name": "Bandra Cell", "org_type": "trafficking", "base_location": "Bandra Apartment"},
]

CLUSTER_SIZE = 17

# ---------------------------------------------------------
# 2. BRIDGES
# ---------------------------------------------------------
bridges = [
    {"bridge_id": "B1", "name": "Pappu Kasai", "hub_1": "H1", "hub_2": "H2", "type": "shared_person"},
    {"bridge_id": "B2", "name": "Ram Yadav", "hub_1": "H2", "hub_2": "H3", "type": "shared_phone"},
    {"bridge_id": "B3", "name": "Mohan Verma", "hub_1": "H3", "hub_2": "H4", "type": "shared_account"},
    {"bridge_id": "B4", "name": "Suresh Bhagat", "hub_1": "H4", "hub_2": "H5", "type": "shared_vehicle"},
    {"bridge_id": "B5", "name": "Anil Kamble", "hub_1": "H5", "hub_2": "H6", "type": "shared_location"},
    {"bridge_id": "B6", "name": "Iqbal Shaikh", "hub_1": "H1", "hub_2": "H3", "type": "shared_person"},
    {"bridge_id": "B7", "name": "Naresh Gowda", "hub_1": "H2", "hub_2": "H4", "type": "shared_phone"},
    {"bridge_id": "B8", "name": "Salim Ansari", "hub_1": "H3", "hub_2": "H5", "type": "shared_account"},
    {"bridge_id": "B9", "name": "Vinod Chavan", "hub_1": "H4", "hub_2": "H6", "type": "shared_vehicle"},
    {"bridge_id": "B10", "name": "Ashok Rane", "hub_1": "H1", "hub_2": "H5", "type": "shared_location"},
    {"bridge_id": "B11", "name": "Zubair Malik", "hub_1": "H2", "hub_2": "H6", "type": "shared_person"},
    {"bridge_id": "B12", "name": "Prakash Salvi", "hub_1": "H1", "hub_2": "H4", "type": "shared_phone"},
]

# ---------------------------------------------------------
# 3. LOCATIONS
# ---------------------------------------------------------
locations = [
    {"id": "L1", "name": "Dadar Hideout", "type": "hideout", "linked": "H1"},
    {"id": "L2", "name": "Kurla Warehouse", "type": "hideout", "linked": "H2"},
    {"id": "L3", "name": "Andheri Flat", "type": "hideout", "linked": "H3"},
    {"id": "L4", "name": "Wadala Godown", "type": "hideout", "linked": "H4"},
    {"id": "L5", "name": "Thane Base", "type": "hideout", "linked": "H5"},
    {"id": "L6", "name": "Bandra Apartment", "type": "hideout", "linked": "H6"},
    {"id": "L7", "name": "Dadar Railway Terminus", "type": "meeting_point", "linked": "shared"},
    {"id": "L8", "name": "Kurla Junction", "type": "meeting_point", "linked": "shared"},
    {"id": "L9", "name": "Sion Circle", "type": "meeting_point", "linked": "shared"},
    {"id": "L10", "name": "Wadala Depot", "type": "meeting_point", "linked": "shared"},
    {"id": "L11", "name": "Thane Station", "type": "meeting_point", "linked": "shared"},
    {"id": "L12", "name": "Tower Site MT-4521", "type": "cell_tower", "linked": "unassigned"},
    {"id": "L13", "name": "Tower Site MT-6102", "type": "cell_tower", "linked": "unassigned"},
    {"id": "L14", "name": "Tower Site MT-3387", "type": "cell_tower", "linked": "unassigned"},
    {"id": "L15", "name": "Tower Site MT-7745", "type": "cell_tower", "linked": "unassigned"},
    {"id": "L16", "name": "Tower Site MT-2210", "type": "cell_tower", "linked": "unassigned"},
    {"id": "L17", "name": "Chembur Drop Point", "type": "drop_location", "linked": "unassigned"},
    {"id": "L18", "name": "Vashi Drop Point", "type": "drop_location", "linked": "unassigned"},
    {"id": "L19", "name": "Mulund Drop Point", "type": "drop_location", "linked": "unassigned"},
    {"id": "L20", "name": "Bhandup Drop Point", "type": "drop_location", "linked": "unassigned"},
    {"id": "L21", "name": "Ghatkopar Safehouse", "type": "safehouse", "linked": "unassigned"},
    {"id": "L22", "name": "Vikhroli Safehouse", "type": "safehouse", "linked": "unassigned"},
    {"id": "L23", "name": "Mankhurd Crime Scene", "type": "incident_location", "linked": "unassigned"},
    {"id": "L24", "name": "Trombay Crime Scene", "type": "incident_location", "linked": "unassigned"},
    {"id": "L25", "name": "Sewri Crime Scene", "type": "incident_location", "linked": "unassigned"},
]

# ---------------------------------------------------------
# 4. PERSON NODES — kingpins + cluster + bridges
# ---------------------------------------------------------
person_counter = 1

def next_person_id():
    global person_counter
    pid = f"p_{person_counter:03d}"
    person_counter += 1
    return pid

hub_kingpin_ids = {}
all_regular_persons = []

for hub in hubs:
    kingpin_id = next_person_id()
    hub_kingpin_ids[hub["hub_id"]] = kingpin_id

    G.add_node(kingpin_id,
               node_type="Person", name=hub["kingpin_name"],
               risk_score=round(random.uniform(0.85, 0.97), 2),
               hierarchy_tier="Kingpin", is_kingpin=True,
               base_location=hub["base_location"], home_hub=hub["hub_id"])

    for i in range(CLUSTER_SIZE - 1):
        member_id = next_person_id()
        tier = "Lieutenant" if i < 3 else "Associate"
        risk = round(random.uniform(0.5, 0.75), 2) if tier == "Lieutenant" else round(random.uniform(0.1, 0.45), 2)

        G.add_node(member_id,
                   node_type="Person", name=fake.name(),
                   risk_score=risk, hierarchy_tier=tier,
                   is_kingpin=False, home_hub=hub["hub_id"])

        all_regular_persons.append((member_id, hub["hub_id"]))

        if tier == "Lieutenant":
            G.add_edge(kingpin_id, member_id, relationship="DIRECTS")
        else:
            G.add_edge(member_id, kingpin_id, relationship="ASSOCIATED_WITH")

# ---------------------------------------------------------
# 5. BRIDGE PERSONS
# ---------------------------------------------------------
bridge_person_ids = []

for bridge in bridges:
    bridge_id = next_person_id()
    G.add_node(bridge_id,
               node_type="Person", name=bridge["name"],
               risk_score=round(random.uniform(0.55, 0.8), 2),
               hierarchy_tier="Associate", is_kingpin=False,
               bridge_type=bridge["type"])

    bridge_person_ids.append(bridge_id)

    hub1_kingpin = hub_kingpin_ids[bridge["hub_1"]]
    hub2_kingpin = hub_kingpin_ids[bridge["hub_2"]]

    G.add_edge(bridge_id, hub1_kingpin, relationship="ASSOCIATED_WITH")
    G.add_edge(bridge_id, hub2_kingpin, relationship="ASSOCIATED_WITH")

# ---------------------------------------------------------
# 6. ORGANIZATION NODES + AFFILIATION WIRING
# ---------------------------------------------------------
hub_org_ids = {}

for hub in hubs:
    org_id = f"org_{hub['hub_id']}"
    hub_org_ids[hub["hub_id"]] = org_id

    G.add_node(org_id, node_type="Organization", name=hub["org_name"], org_type=hub["org_type"])

    kingpin_id = hub_kingpin_ids[hub["hub_id"]]
    G.add_edge(kingpin_id, org_id, relationship="OPERATES")

for person_id, hub_id in all_regular_persons:
    org_id = hub_org_ids[hub_id]
    G.add_edge(person_id, org_id, relationship="AFFILIATED_WITH")

# ---------------------------------------------------------
# 7. LOCATION NODES
# ---------------------------------------------------------
for loc in locations:
    loc_node_id = f"loc_{loc['id']}"
    G.add_node(loc_node_id,
               node_type="Location", address=loc["name"],
               location_type=loc["type"],
               tower_id=loc["id"] if loc["type"] == "cell_tower" else None)

# ===========================================================
# PHASE 3 — OBJECTS
# ===========================================================
obj_counter = 1

def next_obj_id():
    global obj_counter
    oid = f"obj_{obj_counter:03d}"
    obj_counter += 1
    return oid

all_persons = [n for n, d in G.nodes(data=True) if d.get("node_type") == "Person"]
lieutenant_ids = [n for n, d in G.nodes(data=True) if d.get("hierarchy_tier") == "Lieutenant"]
kingpin_ids = [n for n, d in G.nodes(data=True) if d.get("is_kingpin")]

for person_id in all_persons:
    num_phones = random.choice([1, 2])
    for _ in range(num_phones):
        obj_id = next_obj_id()
        is_burner = random.random() < 0.15
        G.add_node(obj_id, node_type="Object", type="phone",
                   identifier_value=fake.phone_number(), is_burner=is_burner)
        G.add_edge(person_id, obj_id, relationship="USES")

for person_id in all_persons:
    if random.random() < 0.25:
        obj_id = next_obj_id()
        plate = f"MH-{random.randint(1,50):02d}-{random.choice('ABCDEFGHJKLMNPQR')}{random.choice('ABCDEFGHJKLMNPQR')}-{random.randint(1000,9999)}"
        G.add_node(obj_id, node_type="Object", type="vehicle",
                   identifier_value=plate, is_burner=False)
        G.add_edge(person_id, obj_id, relationship="USES")

for person_id in all_persons:
    if random.random() < 0.333:
        obj_id = next_obj_id()
        acct_number = f"ACC{random.randint(100000,999999)}"
        G.add_node(obj_id, node_type="Object", type="bank_account",
                   identifier_value=acct_number, is_burner=False)
        G.add_edge(person_id, obj_id, relationship="OWNS")

weapon_lieutenants = random.sample(lieutenant_ids, k=min(3, len(lieutenant_ids)))
weapon_holders = kingpin_ids + weapon_lieutenants

for person_id in weapon_holders:
    obj_id = next_obj_id()
    weapon_serial = f"WPN{random.randint(10000,99999)}"
    G.add_node(obj_id, node_type="Object", type="weapon",
               identifier_value=weapon_serial, is_burner=False)
    G.add_edge(person_id, obj_id, relationship="OWNS")

# ===========================================================
# PHASE 4 — CALLED edges (CDR) and TRANSFERRED_MONEY_TO edges (financial)
# ===========================================================
phone_objects = []
for obj_id, data in list(G.nodes(data=True)):
    if data.get("node_type") == "Object" and data.get("type") == "phone":
        owners = [u for u, v, d in G.in_edges(obj_id, data=True) if d.get("relationship") == "USES"]
        if owners:
            owner = owners[0]
            tier = G.nodes[owner].get("hierarchy_tier", "Associate")
            phone_objects.append((obj_id, owner, tier))

tier_weight = {"Kingpin": 8, "Lieutenant": 5, "Associate": 1}
phone_weights = [tier_weight.get(t, 1) for (_, _, t) in phone_objects]

TOTAL_CALLS = 4400
call_records = []

start_date = datetime.date(2022, 1, 1)
end_date = datetime.date(2026, 1, 1)
date_range_days = (end_date - start_date).days

towers = [loc for loc in locations if loc["type"] == "cell_tower"]

for _ in range(TOTAL_CALLS):
    caller_idx, receiver_idx = random.choices(range(len(phone_objects)), weights=phone_weights, k=2)
    if caller_idx == receiver_idx:
        continue
    caller_obj, _, _ = phone_objects[caller_idx]
    receiver_obj, _, _ = phone_objects[receiver_idx]

    duration_sec = random.randint(5, 900)
    call_date = start_date + datetime.timedelta(days=random.randint(0, date_range_days))
    tower_id = random.choice(towers)["id"] if towers else "UNKNOWN"

    call_records.append({
        "CALLER": G.nodes[caller_obj]["identifier_value"],
        "RECEIVER": G.nodes[receiver_obj]["identifier_value"],
        "DURATION_SEC": duration_sec,
        "TOWER_ID": tower_id,
        "DATE": call_date.isoformat(),
    })

    if G.has_edge(caller_obj, receiver_obj):
        G[caller_obj][receiver_obj]["call_count"] += 1
        G[caller_obj][receiver_obj]["total_duration"] += duration_sec
    else:
        G.add_edge(caller_obj, receiver_obj, relationship="CALLED", call_count=1, total_duration=duration_sec)

account_objects = []
for obj_id, data in list(G.nodes(data=True)):
    if data.get("node_type") == "Object" and data.get("type") == "bank_account":
        owners = [u for u, v, d in G.in_edges(obj_id, data=True) if d.get("relationship") == "OWNS"]
        if owners:
            owner = owners[0]
            tier = G.nodes[owner].get("hierarchy_tier", "Associate")
            account_objects.append((obj_id, owner, tier))

TOTAL_TRANSACTIONS = 1170
transaction_records = []
modes = ["NEFT", "UPI", "Cash Deposit", "RTGS"]

def make_transaction(from_obj, to_obj, amount=None, flagged=False):
    amount = amount or random.randint(2000, 150000)
    txn_date = start_date + datetime.timedelta(days=random.randint(0, date_range_days))
    transaction_records.append({
        "FROM_ACCOUNT": G.nodes[from_obj]["identifier_value"],
        "TO_ACCOUNT": G.nodes[to_obj]["identifier_value"],
        "AMOUNT": amount,
        "TYPE": random.choice(modes),
        "DATE": txn_date.isoformat(),
        "FLAG": "suspicious" if flagged else "normal",
    })
    if G.has_edge(from_obj, to_obj):
        G[from_obj][to_obj]["txn_count"] += 1
        G[from_obj][to_obj]["total_amount"] += amount
    else:
        G.add_edge(from_obj, to_obj, relationship="TRANSFERRED_MONEY_TO", txn_count=1, total_amount=amount)

NUM_CYCLES = 6
if len(account_objects) >= 3:
    for _ in range(NUM_CYCLES):
        a, b, c = [acc[0] for acc in random.sample(account_objects, k=3)]
        amt = random.randint(40000, 120000)
        make_transaction(a, b, amount=amt, flagged=True)
        make_transaction(b, c, amount=round(amt * 0.9), flagged=True)
        make_transaction(c, a, amount=round(amt * 0.8), flagged=True)

account_weights = [tier_weight.get(t, 1) for (_, _, t) in account_objects]
remaining = TOTAL_TRANSACTIONS - len(transaction_records)

for _ in range(max(0, remaining)):
    from_idx, to_idx = random.choices(range(len(account_objects)), weights=account_weights, k=2)
    if from_idx == to_idx:
        continue
    make_transaction(account_objects[from_idx][0], account_objects[to_idx][0])

# ---------------------------------------------------------
# SANITY CHECK OUTPUT (only one block, runs last)
# ---------------------------------------------------------
if __name__ == "__main__":
    node_counts = {}
    for _, data in G.nodes(data=True):
        t = data.get("node_type", "Unknown")
        node_counts[t] = node_counts.get(t, 0) + 1

    print("=== NODE COUNTS ===")
    for t, c in node_counts.items():
        print(f"{t}: {c}")
    print(f"TOTAL NODES: {G.number_of_nodes()}")
    print(f"TOTAL EDGES: {G.number_of_edges()}")

    print("\n=== AFFILIATION CHECK ===")
    affiliation_edges = [e for e in G.edges(data=True) if e[2].get("relationship") == "AFFILIATED_WITH"]
    print(f"AFFILIATED_WITH edges: {len(affiliation_edges)}")

    print("\n=== CALLED EDGES ===")
    called_edges = [e for e in G.edges(data=True) if e[2].get("relationship") == "CALLED"]
    print(f"Unique CALLED edges (aggregated): {len(called_edges)}")
    print(f"Raw call records generated: {len(call_records)}")

    print("\n=== TRANSFERRED_MONEY_TO EDGES ===")
    txn_edges = [e for e in G.edges(data=True) if e[2].get("relationship") == "TRANSFERRED_MONEY_TO"]
    print(f"Unique transfer edges (aggregated): {len(txn_edges)}")
    print(f"Raw transaction records generated: {len(transaction_records)}")
    flagged = [t for t in transaction_records if t["FLAG"] == "suspicious"]
    print(f"Flagged suspicious transactions: {len(flagged)}")

    import pandas as pd
    import os

    os.makedirs("data/raw/cdrs", exist_ok=True)
    os.makedirs("data/raw/financial", exist_ok=True)

    pd.DataFrame(call_records).to_csv("data/raw/cdrs/master_cdr_log.csv", index=False)
    pd.DataFrame(transaction_records).to_csv("data/raw/financial/master_transaction_log.csv", index=False)

    print("\nExported: data/raw/cdrs/master_cdr_log.csv")
    print("Exported: data/raw/financial/master_transaction_log.csv")