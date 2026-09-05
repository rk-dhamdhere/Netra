# Netra

**AI-Powered Criminal Network Analysis System**

*Built for Smart India Hackathon — addressing NCRB Problem Statement #26189*
*Ministry of Home Affairs · National Crime Records Bureau · Women Safety Division*

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Hackathon](https://img.shields.io/badge/hackathon-Smart%20India%20Hackathon-blue)
![License](https://img.shields.io/badge/license-TBD-lightgrey)
![Theme](https://img.shields.io/badge/theme-blockchain%20%26%20cybersecurity-purple)

---

## Overview

Modern criminal activity is networked — suspects, phones, bank accounts, vehicles, and
locations are all connected, but that evidence sits fragmented across FIRs, call records,
financial logs, and surveillance reports. Investigators can be sitting on the exact data
needed to connect two "unrelated" cases and never see it.

Netra ingests raw, messy case evidence and automatically:

- Extracts entities (people, phones, accounts, vehicles, locations) from unstructured text
- Builds a knowledge graph connecting them across cases
- Identifies key influencers using network centrality analysis
- Flags suspicious patterns — circular transfers, high-frequency short calls
- Matches faces across every case in the system
- Updates live as new field intelligence comes in
- Exports findings into a court/briefing-ready report

Most individual case files, read in isolation, look unrelated to one another. Netra's
purpose is to find the ones that aren't.

---

## Architecture

![Architecture Diagram](docs/assets/architecture.png)

Postgres handles rows, auth, and vector similarity search. Neo4j handles relationship
traversal and graph algorithms — centrality, pattern detection. Neo4j is the single
source of truth for entities and relationships; Postgres never duplicates that data,
only references it by ID.

---

## Build Progress

![Planning](https://img.shields.io/badge/Planning-100%25-brightgreen)
![Data Generation](https://img.shields.io/badge/Data%20Generation-95%25-brightgreen)
![Database](https://img.shields.io/badge/Database-0%25-red)
![AI%2FNLP Backend](https://img.shields.io/badge/AI%2FNLP%20Backend-25%25-red)
![Frontend](https://img.shields.io/badge/Frontend-25%25-red)
![Integration](https://img.shields.io/badge/Integration-0%25-red)

| Segment | Working On It | Notes |
|---|---|---|
| Planning & App Flow | Team | Done |
| UI/UX Mockups | Sohan Darde | Done |
| Data Generation | Rishikesh Dhamdhere | Master graph, manifest, FIR text, per-case CDR/financial slicing, and photos all complete and reproducible end-to-end. Only the Neo4j seed/import script remains, pending sync with DB owner. |
| Database (Neo4j + Supabase) | Tanmay Madhavi | Not started |
| AI/NLP Backend | Rohan Ayare & Taswi Tawde | FastAPI upload endpoint + Gemini extraction worker initialized |
| Frontend | Shubham Jadhav | React Flow knowledge graph UI initialized |
| Integration & Demo Prep | Taswi Tawde | Not started |

Update the badge percentages as work progresses — red under 30%, yellow 30–79%, green
80% and above. Each badge is just a URL, so editing the number is a one-line change:

```
https://img.shields.io/badge/Data%20Generation-95%25-brightgreen
                                    ^label      ^%   ^color
```

---

## Repo Structure

```
netra/
├── frontend/     → Next.js dashboard
├── backend/      → FastAPI AI/NLP microservice
├── data/         → dummy data generators, case manifest, raw files
├── db/           → Neo4j schema/seed scripts, Supabase migrations
├── docs/         → project reference docs + diagrams
└── scripts/      → setup/dev utilities
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind, Cytoscape.js |
| AI/NLP Backend | Python, FastAPI, LLM APIs |
| Structured Data & Auth | Supabase (Postgres + pgvector) |
| Graph Database | Neo4j (+ Graph Data Science library for centrality) |
| Facial Recognition | InsightFace / FaceNet |

---

## Research & Reading List

The techniques behind Netra draw on established work in criminal network analysis,
graph-based financial crime detection, and legal-text NLP.

**Network analysis & key player detection**
- Duijn & Klerks et al. — [Using social network analysis to target criminal networks](https://www.researchgate.net/publication/225788132_Using_social_network_analysis_to_target_criminal_networks) — extends Borgatti's key-player approach with weighted actors and relationships, directly relevant to our centrality/influencer ranking.
- [Covert Network Analysis for Key Player Detection and Event Prediction Using a Hybrid Classifier](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4127216/) — centrality-based key player detection combined with outlier/anomaly detection.
- [Social network analysis as a tool for criminal intelligence](https://www.researchgate.net/publication/318037428_Social_network_analysis_as_a_tool_for_criminal_intelligence_Understanding_its_potential_from_the_perspectives_of_intelligence_analysts) — practitioner-facing view of how real analysts use SNA to find overlooked connections.
- [The Game is the Game: Dynamic network analysis and shifting roles in criminal networks](https://www.researchgate.net/publication/349440215_Using_social_network_analysis_to_study_crime_Navigating_the_challenges_of_criminal_justice_records) (2025 preprint) — introduces time as a variable in key-player identification, relevant to our timeline/incident-history view.

**Graph-based financial crime detection**
- [Graph Neural Networks for Financial Fraud Detection: A Review](https://arxiv.org/pdf/2411.05815) — survey of GNN approaches to AML.
- [Finding Money Launderers Using Heterogeneous Graph Neural Networks](https://arxiv.org/abs/2307.13499) — GNN approach applied to real bank transaction data, relevant to our suspicious-transaction-pattern detection.

**NLP entity extraction from legal/police text**
- [Named Entity Recognition and Resolution in Legal Text](https://www.researchgate.net/publication/220745968_Named_Entity_Recognition_and_Resolution_in_Legal_Text) — foundational approach to extracting and resolving named entities from legal documents.
- [Named Entity Recognition in Indian court judgments](https://huggingface.co/opennyaiorg/en_legal_ner_trf) (Kalamkar et al., 2022) — Indian-context legal NER model and dataset, directly applicable to FIR-style text.
- [Named-Entity Recognition for Portuguese Police Reports](https://www.dcc.fc.up.pt/~mantunes/papers/jiue2018.pdf) — one of the few papers specifically on extracting entities from police report text rather than generic documents.

---

## Getting Started

*(to be filled in as each part comes online)*

---

*Built for Smart India Hackathon, [Dates TBD]*