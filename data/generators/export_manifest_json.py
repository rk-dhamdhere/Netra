import pandas as pd
import json
import os

INPUT_PATH = "data/manifest/case_manifest.csv"
OUTPUT_PATH = "data/manifest/case_manifest.json"

LIST_COLUMNS = ["entities_involved", "evidence_types", "bridge_entities", "linked_cases"]

def csv_row_to_json_record(row):
    record = row.to_dict()
    for col in LIST_COLUMNS:
        value = record.get(col, "")
        if isinstance(value, str) and value:
            record[col] = value.split(";")
        else:
            record[col] = []
    return record

if __name__ == "__main__":
    if not os.path.exists(INPUT_PATH):
        print(f"ERROR: {INPUT_PATH} not found. Run generate_manifest.py first.")
        exit(1)

    df = pd.read_csv(INPUT_PATH, keep_default_na=False)
    records = [csv_row_to_json_record(row) for _, row in df.iterrows()]

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)

    print(f"Converted {len(records)} cases from CSV to JSON.")
    print(f"Exported: {OUTPUT_PATH}")
    print("\nSample record (first case):")
    print(json.dumps(records[0], indent=2))