import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import random
import datetime
import pandas as pd
from faker import Faker
from graph_topology import G, hubs

fake = Faker('en_IN')
random.seed(11)

# ---------------------------------------------------------
# Optional LLM polish — only runs if ANTHROPIC_API_KEY is set
# ---------------------------------------------------------
USE_LLM_POLISH = bool(os.environ.get("ANTHROPIC_API_KEY"))

if USE_LLM_POLISH:
    try:
        import anthropic
        client = anthropic.Anthropic()
    except ImportError:
        print("anthropic package not installed — falling back to template-only text.")
        USE_LLM_POLISH = False

def polish_with_llm(draft_text):
    if not USE_LLM_POLISH:
        return draft_text
    try:
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=300,
            messages=[{
                "role": "user",
                "content": (
                    "Rewrite this police FIR draft into natural, slightly terse "
                    "official police-report language. Keep every name, number, "
                    "date, and location EXACTLY as given — do not invent or omit "
                    "any entity. Do not add commentary, just return the rewritten "
                    f"report text:\n\n{draft_text}"
                )
            }]
        )
        return response.content[0].text.strip()
    except Exception as e:
        print(f"LLM polish failed ({e}), using template text instead.")
        return draft_text

# ---------------------------------------------------------
# Category mapping — org_type -> plausible legal category
# ---------------------------------------------------------
CATEGORY_MAP = {
    "narcotics": "Narcotics Offence (NDPS Act, Sec. 8)",
    "extortion": "Extortion (BNS Sec. 308)",
    "trafficking": "Human Trafficking (BNS Sec. 143)",
    "financial_fraud": "Financial Fraud / Cheating (BNS Sec. 318)",
}

GENERIC_TIER1_CATEGORIES = [
    "Theft (BNS Sec. 303)",
    "Public Nuisance (BNS Sec. 296)",
    "Simple Assault (BNS Sec. 115)",
    "Missing Person Report",
]

hub_lookup = {hub["hub_id"]: hub for hub in hubs}

start_date = datetime.date(2022, 1, 1)
end_date = datetime.date(2026, 1, 1)
date_range_days = (end_date - start_date).days

def random_date():
    return start_date + datetime.timedelta(days=random.randint(0, date_range_days))

def get_person_objects(person_id, obj_type, relationship):
    results = []
    for _, obj_id, data in G.out_edges(person_id, data=True):
        if data.get("relationship") == relationship:
            obj_data = G.nodes[obj_id]
            if obj_data.get("node_type") == "Object" and obj_data.get("type") == obj_type:
                results.append(obj_data.get("identifier_value"))
    return results

# ---------------------------------------------------------
# Build one FIR narrative for a single case row
# ---------------------------------------------------------
def build_fir_text(row):
    entity_ids = row["entities_involved"].split(";") if row["entities_involved"] else []
    entity_names = [G.nodes[eid].get("name", "Unknown") for eid in entity_ids if eid in G.nodes]

    evidence_types = row["evidence_types"].split(";")
    officer_name = fake.name()
    incident_date = random_date()

    if row["tier"] == 1:
        category = random.choice(GENERIC_TIER1_CATEGORIES)
        hub = hub_lookup.get(row["hub_id"])
        location = hub["base_location"].replace("Hideout", "area").replace("Godown", "locality") if hub else "the local area"
    else:
        hub = hub_lookup.get(row["hub_id"])
        category = CATEGORY_MAP.get(hub["org_type"], "General Offence") if hub else "General Offence"
        location = hub["base_location"] if hub else "an undisclosed location"

    if len(entity_names) > 6:
        shown_names = entity_names[:6]
        names_str = ", ".join(shown_names) + f", and {len(entity_names) - 6} other associate(s)"
    elif entity_names:
        names_str = ", ".join(entity_names)
    else:
        names_str = "an unidentified individual"

    draft = (
        f"On {incident_date.strftime('%d %B %Y')}, a case was registered regarding "
        f"{category} in the vicinity of {location}. "
        f"The complaint names the following individual(s) as involved: {names_str}. "
    )

    if "CDR" in evidence_types:
        phone_mentions = []
        for eid in entity_ids:
            phones = get_person_objects(eid, "phone", "USES")
            if phones:
                phone_mentions.append(f"{G.nodes[eid]['name']} ({phones[0]})")
        if phone_mentions:
            shown = phone_mentions[:4]
            remainder = len(phone_mentions) - len(shown)
            mention_str = ", ".join(shown)
            if remainder > 0:
                mention_str += f", and {remainder} other associate(s)"
            draft += (
                "Call records associated with " + mention_str +
                " have been requested for cross-verification. "
            )

    if "Financial" in evidence_types:
        acct_mentions = []
        for eid in entity_ids:
            accounts = get_person_objects(eid, "bank_account", "OWNS")
            if accounts:
                acct_mentions.append(f"{G.nodes[eid]['name']} (Acct: {accounts[0]})")
        if acct_mentions:
            shown = acct_mentions[:4]
            remainder = len(acct_mentions) - len(shown)
            mention_str = ", ".join(shown)
            if remainder > 0:
                mention_str += f", and {remainder} other account(s)"
            draft += (
                "Financial records linked to " + mention_str +
                " are being examined for suspicious transaction patterns. "
            )

    if "Photo" in evidence_types:
        draft += "Photographic evidence, including suspect identification images, has been attached to this case file. "

    if row.get("bridge_entities"):
        draft += (
            "Preliminary review suggests a possible connection to prior "
            "intelligence on record; further cross-referencing is recommended. "
        )

    draft += f"Investigating Officer: {officer_name}."

    final_text = polish_with_llm(draft)
    return final_text, category, officer_name, incident_date

# ---------------------------------------------------------
# MAIN — run across every case in the manifest
# ---------------------------------------------------------
if __name__ == "__main__":
    manifest_path = "data/manifest/case_manifest.csv"
    manifest = pd.read_csv(manifest_path, keep_default_na=False)

    os.makedirs("data/raw/firs", exist_ok=True)
    index_rows = []

    for _, row in manifest.iterrows():
        fir_text, category, officer, incident_date = build_fir_text(row)

        file_path = f"data/raw/firs/{row['case_id']}.txt"
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(fir_text)

        index_rows.append({
            "case_id": row["case_id"],
            "tier": row["tier"],
            "category": category,
            "officer": officer,
            "incident_date": incident_date.isoformat(),
            "file_path": file_path,
        })

    index_df = pd.DataFrame(index_rows)
    index_df.to_csv("data/manifest/fir_index.csv", index=False)

    print(f"Generated {len(index_rows)} FIR files in data/raw/firs/")
    print(f"LLM polish enabled: {USE_LLM_POLISH}")
    print("\nSample FIR (first case):")
    print("-" * 60)
    with open(index_rows[0]["file_path"], encoding="utf-8") as f:
        print(f.read())
    print("-" * 60)