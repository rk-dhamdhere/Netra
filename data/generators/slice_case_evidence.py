import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import pandas as pd
from graph_topology import G

def get_phones_for_entities(entity_ids):
    phones = set()
    for eid in entity_ids:
        if eid not in G.nodes:
            continue
        for _, obj_id, data in G.out_edges(eid, data=True):
            if data.get("relationship") == "USES":
                obj_data = G.nodes[obj_id]
                if obj_data.get("node_type") == "Object" and obj_data.get("type") == "phone":
                    phones.add(obj_data.get("identifier_value"))
    return phones

def get_accounts_for_entities(entity_ids):
    accounts = set()
    for eid in entity_ids:
        if eid not in G.nodes:
            continue
        for _, obj_id, data in G.out_edges(eid, data=True):
            if data.get("relationship") == "OWNS":
                obj_data = G.nodes[obj_id]
                if obj_data.get("node_type") == "Object" and obj_data.get("type") == "bank_account":
                    accounts.add(obj_data.get("identifier_value"))
    return accounts

if __name__ == "__main__":
    manifest = pd.read_csv("data/manifest/case_manifest.csv", keep_default_na=False)
    master_cdr = pd.read_csv("data/raw/cdrs/master_cdr_log.csv")
    master_financial = pd.read_csv("data/raw/financial/master_transaction_log.csv")

    os.makedirs("data/raw/cdrs/per_case", exist_ok=True)
    os.makedirs("data/raw/financial/per_case", exist_ok=True)

    cdr_cases_written = 0
    financial_cases_written = 0
    empty_cdr_cases = []
    empty_financial_cases = []

    for _, row in manifest.iterrows():
        entity_ids = row["entities_involved"].split(";") if row["entities_involved"] else []
        evidence_types = row["evidence_types"].split(";")
        case_id = row["case_id"]

        if "CDR" in evidence_types:
            phones = get_phones_for_entities(entity_ids)
            case_cdr = master_cdr[
                master_cdr["CALLER"].isin(phones) | master_cdr["RECEIVER"].isin(phones)
            ]
            if len(case_cdr) > 0:
                case_cdr.to_csv(f"data/raw/cdrs/per_case/{case_id}_cdr.csv", index=False)
                cdr_cases_written += 1
            else:
                empty_cdr_cases.append(case_id)

        if "Financial" in evidence_types:
            accounts = get_accounts_for_entities(entity_ids)
            case_financial = master_financial[
                master_financial["FROM_ACCOUNT"].isin(accounts) | master_financial["TO_ACCOUNT"].isin(accounts)
            ]
            if len(case_financial) > 0:
                case_financial.to_csv(f"data/raw/financial/per_case/{case_id}_financial.csv", index=False)
                financial_cases_written += 1
            else:
                empty_financial_cases.append(case_id)

    print(f"CDR files written: {cdr_cases_written}")
    print(f"Financial files written: {financial_cases_written}")
    print(f"\nCases flagged for CDR but got 0 matching rows: {len(empty_cdr_cases)}")
    if empty_cdr_cases:
        print(f"  -> {empty_cdr_cases[:10]}{'...' if len(empty_cdr_cases) > 10 else ''}")
    print(f"Cases flagged for Financial but got 0 matching rows: {len(empty_financial_cases)}")
    if empty_financial_cases:
        print(f"  -> {empty_financial_cases[:10]}{'...' if len(empty_financial_cases) > 10 else ''}")