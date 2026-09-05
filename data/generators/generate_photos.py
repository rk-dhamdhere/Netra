import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import time
import requests
import pandas as pd
from graph_topology import G

FACE_SOURCE_URL = "https://thispersondoesnotexist.com"
OUTPUT_DIR = "data/raw/photos"
DELAY_SECONDS = 1.5  # be polite to the free service, avoid rate-limiting

def get_persons_needing_photos():
    manifest = pd.read_csv("data/manifest/case_manifest.csv", keep_default_na=False)
    photo_person_ids = set()

    for _, row in manifest.iterrows():
        evidence_types = row["evidence_types"].split(";")
        if "Photo" in evidence_types:
            entity_ids = row["entities_involved"].split(";") if row["entities_involved"] else []
            for eid in entity_ids:
                if eid in G.nodes and G.nodes[eid].get("node_type") == "Person":
                    photo_person_ids.add(eid)

    return sorted(photo_person_ids)

def download_face(save_path, retries=3):
    for attempt in range(retries):
        try:
            response = requests.get(FACE_SOURCE_URL, timeout=10)
            response.raise_for_status()
            with open(save_path, "wb") as f:
                f.write(response.content)
            return True
        except requests.RequestException as e:
            print(f"  Attempt {attempt + 1} failed: {e}")
            time.sleep(2)
    return False

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    person_ids = get_persons_needing_photos()
    print(f"Persons requiring a photo (appear in a Photo-evidence case): {len(person_ids)}")

    index_rows = []
    failures = []

    for i, pid in enumerate(person_ids, start=1):
        name = G.nodes[pid].get("name", "Unknown")
        file_path = f"{OUTPUT_DIR}/{pid}.jpg"

        print(f"[{i}/{len(person_ids)}] Downloading face for {name} ({pid})...")
        success = download_face(file_path)

        if success:
            index_rows.append({
                "person_id": pid,
                "name": name,
                "hierarchy_tier": G.nodes[pid].get("hierarchy_tier", ""),
                "file_path": file_path,
            })
        else:
            failures.append(pid)

        time.sleep(DELAY_SECONDS)

    index_df = pd.DataFrame(index_rows)
    os.makedirs("data/manifest", exist_ok=True)
    index_df.to_csv("data/manifest/photo_index.csv", index=False)

    print(f"\nPhotos successfully downloaded: {len(index_rows)}")
    print(f"Failures: {len(failures)}")
    if failures:
        print(f"  -> {failures}")
    print("Exported: data/manifest/photo_index.csv")