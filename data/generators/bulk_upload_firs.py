import os
import json
import time
import requests

FIR_DIR = "data/raw/firs"
ENDPOINT = "http://localhost:8000/api/v1/upload-case-file"
DELAY_SECONDS = 0.5

def upload_fir(filepath):
    with open(filepath, "rb") as f:
        files = {"file": (os.path.basename(filepath), f, "text/plain")}
        try:
            response = requests.post(ENDPOINT, files=files, timeout=30)
            response.raise_for_status()
            return True, response.json()
        except requests.RequestException as e:
            return False, str(e)

if __name__ == "__main__":
    if not os.path.exists(FIR_DIR):
        print(f"ERROR: {FIR_DIR} not found.")
        exit(1)

    fir_files = sorted(f for f in os.listdir(FIR_DIR) if f.endswith(".txt"))

    # Start with a small test batch — change this to len(fir_files) once confirmed working
    TEST_BATCH_SIZE = 5
    fir_files = fir_files[:TEST_BATCH_SIZE]

    print(f"Uploading {len(fir_files)} FIR file(s) to {ENDPOINT}...\n")

    results = []
    for filename in fir_files:
        case_id = filename.replace(".txt", "")
        path = os.path.join(FIR_DIR, filename)

        success, response_data = upload_fir(path)

        if success:
            print(f"[OK]   {case_id}")
        else:
            print(f"[FAIL] {case_id} — {response_data}")

        results.append({
            "case_id": case_id,
            "success": success,
            "response": response_data
        })

        time.sleep(DELAY_SECONDS)

    succeeded = sum(1 for r in results if r["success"])
    failed = len(results) - succeeded

    print(f"\nDone. Succeeded: {succeeded}, Failed: {failed}")

    with open("data/manifest/upload_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print("Full results saved to data/manifest/upload_results.json")