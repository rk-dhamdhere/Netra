import os
import pandas as pd

DEMO_CASE_IDS = ["case_004", "case_051", "case_001", "case_025", "case_010"]
OUTPUT_DIR = "data/demo_package"

def export_case_evidence(case_id):
    case_folder = os.path.join(OUTPUT_DIR, case_id)
    os.makedirs(case_folder, exist_ok=True)

    exported = []

    cdr_path = f"data/raw/cdrs/per_case/{case_id}_cdr.csv"
    if os.path.exists(cdr_path):
        cdr_df = pd.read_csv(cdr_path, dtype=str)
        out_path = os.path.join(case_folder, f"{case_id}_cdr.xlsx")
        cdr_df.to_excel(out_path, index=False, engine="openpyxl")
        exported.append((out_path, len(cdr_df)))

    financial_path = f"data/raw/financial/per_case/{case_id}_financial.csv"
    if os.path.exists(financial_path):
        fin_df = pd.read_csv(financial_path, dtype=str)
        out_path = os.path.join(case_folder, f"{case_id}_financial.xlsx")
        fin_df.to_excel(out_path, index=False, engine="openpyxl")
        exported.append((out_path, len(fin_df)))

    return exported

if __name__ == "__main__":
    print(f"Exporting real evidence data for {len(DEMO_CASE_IDS)} demo cases...\n")

    for case_id in DEMO_CASE_IDS:
        results = export_case_evidence(case_id)
        if not results:
            print(f"[SKIP] {case_id} — no CDR or financial evidence files found on disk")
            continue
        for path, row_count in results:
            print(f"[OK]   {path} — {row_count} rows")

    print(f"\nDone. Files written under {OUTPUT_DIR}/<case_id>/")