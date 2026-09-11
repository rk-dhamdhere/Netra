import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import json

SHORTLIST_PATH = "data/manifest/demo_case_shortlist.json"
BUNDLES_DIR = "data/manifest/case_bundles"
OUTPUT_PATH = "docs/Demo_Walkthrough.md"

def load_bundle(case_id):
    path = f"{BUNDLES_DIR}/{case_id}.json"
    if not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def format_entity_list(bundle, limit=6):
    entities = bundle.get("entities", [])
    names = [e["name"] for e in entities[:limit]]
    remainder = len(entities) - len(names)
    text = ", ".join(names)
    if remainder > 0:
        text += f", and {remainder} more"
    return text

def section_single_case(title, subtitle, case_id, talking_point):
    bundle = load_bundle(case_id)
    if not bundle:
        return f"## {title}\n\n*Case bundle for {case_id} not found — run export_full_case_bundles.py first.*\n\n---\n"

    lines = [f"## {title}", f"*{subtitle}*", ""]
    lines.append(f"**Case ID:** `{case_id}` | **Tier:** {bundle['tier']} | **Evidence:** {', '.join(bundle['evidence_types'])}")
    lines.append("")
    lines.append(f"**Entities involved:** {format_entity_list(bundle)}")
    lines.append("")
    lines.append("**FIR Excerpt:**")
    lines.append(f"> {bundle['fir_text'][:400]}{'...' if len(bundle['fir_text']) > 400 else ''}")
    lines.append("")
    if bundle["cdr_records"]:
        lines.append(f"**CDR Evidence:** {len(bundle['cdr_records'])} call records on file")
    if bundle["financial_records"]:
        suspicious = [r for r in bundle["financial_records"] if r.get("FLAG") == "suspicious"]
        lines.append(f"**Financial Evidence:** {len(bundle['financial_records'])} transactions on file"
                      + (f" — **{len(suspicious)} flagged suspicious**" if suspicious else ""))
    lines.append("")
    lines.append(f"**Talking point:** {talking_point}")
    lines.append("\n---\n")
    return "\n".join(lines)

def section_reveal_pair(shortlist):
    data = shortlist.get("reveal_pair")
    if not data:
        return ""
    minor_bundle = load_bundle(data["minor_case_id"])
    major_bundle = load_bundle(data["major_case_id"])
    if not minor_bundle or not major_bundle:
        return ""

    minor_names = {e["name"] for e in minor_bundle["entities"]}
    major_names = {e["name"] for e in major_bundle["entities"]}
    shared = minor_names & major_names
    shared_str = ", ".join(shared) if shared else "unknown — check bridge_entities manually"

    lines = [
        "## 2. The Hidden Connection (Core Demo Moment)",
        "*A routine, unrelated-looking case turns out to be linked to a major investigation*",
        "",
        f"**Case A (minor):** `{data['minor_case_id']}` — Tier {minor_bundle['tier']}, appears to be a standalone, low-priority report.",
        f"**Case B (major):** `{data['major_case_id']}` — Tier {major_bundle['tier']}, a large, richly-evidenced investigation.",
        "",
        f"**Shared entity (the actual link):** {shared_str}",
        "",
        f"**Case A entities:** {format_entity_list(minor_bundle)}",
        f"**Case B entities:** {format_entity_list(major_bundle)}",
        "",
        "**How to present this:**",
        f"1. Open Case `{data['minor_case_id']}` first — it looks unremarkable, easy to dismiss.",
        f"2. Show the system flags a shared entity with Case `{data['major_case_id']}`.",
        "3. Pivot to the major case's full network graph — reveal the scale of what the 'small' case was actually connected to.",
        "",
        "**Talking point:** This is the entire premise of Netra in one interaction — a human investigator reading Case A alone would have no reason to suspect it connects to anything larger.",
        "\n---\n"
    ]
    return "\n".join(lines)

def section_face_match(shortlist):
    data = shortlist.get("face_match_pair")
    if not data:
        return ""
    case_a, case_b = data["case_ids"]
    bundle_a = load_bundle(case_a)
    bundle_b = load_bundle(case_b)
    if not bundle_a or not bundle_b:
        return ""

    lines = [
        "## 4. Cross-Case Facial Recognition",
        "*The same individual appears in two separate case files under different circumstances*",
        "",
        f"**Shared person:** {data['person_name']} (`{data['shared_person_id']}`)",
        f"**Appears in:** Case `{case_a}` (Tier {bundle_a['tier']}) and Case `{case_b}` (Tier {bundle_b['tier']})",
        "",
        "**How to present this:**",
        f"1. Upload or select {data['person_name']}'s photo from Case `{case_a}`.",
        "2. Run it through the face search.",
        f"3. System surfaces the match in Case `{case_b}` — a case the investigator may not have connected otherwise.",
        "",
        "**Talking point:** Facial identification isn't limited to a single case file — it searches across the entire system's photo history.",
        "\n---\n"
    ]
    return "\n".join(lines)

if __name__ == "__main__":
    if not os.path.exists(SHORTLIST_PATH):
        print(f"ERROR: {SHORTLIST_PATH} not found. Run select_demo_cases.py first.")
        exit(1)

    with open(SHORTLIST_PATH, encoding="utf-8") as f:
        shortlist = json.load(f)

    doc = ["# Netra — Demo Walkthrough", "", "Curated case stories for live demonstration, selected from the full 200-case synthetic dataset.", "", "---", ""]

    if "strongest_flagship" in shortlist:
        doc.append(section_single_case(
            "1. The Flagship Network",
            "A rich, fully-evidenced case showing the complete dashboard experience",
            shortlist["strongest_flagship"]["case_id"],
            f"This case has {shortlist['strongest_flagship']['bridge_count']} planted cross-case connections — use it to show the full graph, map, and AI Insights views."
        ))

    doc.append(section_reveal_pair(shortlist))

    if "financial_pattern_case" in shortlist:
        doc.append(section_single_case(
            "3. Suspicious Financial Pattern",
            "A planted circular money-laundering pattern for the system to detect",
            shortlist["financial_pattern_case"]["case_id"],
            f"Contains {shortlist['financial_pattern_case']['suspicious_transaction_count']} transactions flagged as part of a circular transfer pattern — use this to demonstrate automated anomaly detection."
        ))

    doc.append(section_face_match(shortlist))

    if "mundane_control_case" in shortlist:
        doc.append(section_single_case(
            "5. Control Case — No False Positives",
            "A genuinely isolated case, included to show the system doesn't invent connections",
            shortlist["mundane_control_case"]["case_id"],
            "This case has no planted connections to anything else. Use it to demonstrate that the system correctly reports no cross-case links when none exist — a key trust signal for investigators."
        ))

    os.makedirs("docs", exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(doc))

    print(f"Demo walkthrough written to {OUTPUT_PATH}")