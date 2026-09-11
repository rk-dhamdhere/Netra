# Netra — Demo Walkthrough

Curated case stories for live demonstration, selected from the full 200-case synthetic dataset.

---

## 1. The Flagship Network
*A rich, fully-evidenced case showing the complete dashboard experience*

**Case ID:** `case_004` | **Tier:** 3 | **Evidence:** FIR, CDR, Financial, Photo

**Entities involved:** Victor Kannan, Urvashi Ray, Suresh Bhagat, Alka Wable, Mohan Verma, Naresh Gowda, and 9 more

**FIR Excerpt:**
> On 14 July 2024, a case was registered regarding Financial Fraud / Cheating (BNS Sec. 318) in the vicinity of Wadala Godown. The complaint names the following individual(s) as involved: Victor Kannan, Urvashi Ray, Suresh Bhagat, Alka Wable, Mohan Verma, Naresh Gowda, and 9 other associate(s). Call records associated with Victor Kannan (+914228421020), Urvashi Ray (+911161528098), Suresh Bhagat (18...

**CDR Evidence:** 1000 call records on file
**Financial Evidence:** 282 transactions on file — **6 flagged suspicious**

**Talking point:** This case has 5 planted cross-case connections — use it to show the full graph, map, and AI Insights views.

---

## 2. The Hidden Connection (Core Demo Moment)
*A routine, unrelated-looking case turns out to be linked to a major investigation*

**Case A (minor):** `case_051` — Tier 1, appears to be a standalone, low-priority report.
**Case B (major):** `case_004` — Tier 3, a large, richly-evidenced investigation.

**Shared entity (the actual link):** Naresh Gowda

**Case A entities:** Naresh Gowda, Priya Rastogi
**Case B entities:** Victor Kannan, Urvashi Ray, Suresh Bhagat, Alka Wable, Mohan Verma, Naresh Gowda, and 9 more

**How to present this:**
1. Open Case `case_051` first — it looks unremarkable, easy to dismiss.
2. Show the system flags a shared entity with Case `case_004`.
3. Pivot to the major case's full network graph — reveal the scale of what the 'small' case was actually connected to.

**Talking point:** This is the entire premise of Netra in one interaction — a human investigator reading Case A alone would have no reason to suspect it connects to anything larger.

---

## 3. Suspicious Financial Pattern
*A planted circular money-laundering pattern for the system to detect*

**Case ID:** `case_001` | **Tier:** 3 | **Evidence:** FIR, CDR, Financial, Photo

**Entities involved:** Lajita Chatterjee, Pappu Kasai, Iqbal Shaikh, Hemangini Lalla, Rushil Saini, Ayushman Chander, and 8 more

**FIR Excerpt:**
> On 15 July 2024, a case was registered regarding Narcotics Offence (NDPS Act, Sec. 8) in the vicinity of Dadar Hideout. The complaint names the following individual(s) as involved: Lajita Chatterjee, Pappu Kasai, Iqbal Shaikh, Hemangini Lalla, Rushil Saini, Ayushman Chander, and 8 other associate(s). Call records associated with Lajita Chatterjee (9367632016), Pappu Kasai (+911467866912), Iqbal Sh...

**CDR Evidence:** 1053 call records on file
**Financial Evidence:** 82 transactions on file — **2 flagged suspicious**

**Talking point:** Contains 2 transactions flagged as part of a circular transfer pattern — use this to demonstrate automated anomaly detection.

---

## 4. Cross-Case Facial Recognition
*The same individual appears in two separate case files under different circumstances*

**Shared person:** Lajita Chatterjee (`p_012`)
**Appears in:** Case `case_025` (Tier 3) and Case `case_010` (Tier 3)

**How to present this:**
1. Upload or select Lajita Chatterjee's photo from Case `case_025`.
2. Run it through the face search.
3. System surfaces the match in Case `case_010` — a case the investigator may not have connected otherwise.

**Talking point:** Facial identification isn't limited to a single case file — it searches across the entire system's photo history.

---

## 5. Control Case — No False Positives
*A genuinely isolated case, included to show the system doesn't invent connections*

**Case ID:** `case_060` | **Tier:** 1 | **Evidence:** FIR

**Entities involved:** Anamika Kanda

**FIR Excerpt:**
> On 19 August 2023, a case was registered regarding Missing Person Report in the vicinity of Kurla Warehouse. The complaint names the following individual(s) as involved: Anamika Kanda. Investigating Officer: Oeshi Minhas.


**Talking point:** This case has no planted connections to anything else. Use it to demonstrate that the system correctly reports no cross-case links when none exist — a key trust signal for investigators.

---
