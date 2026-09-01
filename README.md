# Netra

**AI-Powered Criminal Network Analysis System**

*Built for Smart India Hackathon 2026 — addressing NCRB Problem Statement #26189*
*Ministry of Home Affairs · National Crime Records Bureau · Women Safety Division*

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Hackathon](https://img.shields.io/badge/hackathon-internal-blue)
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

```mermaid
flowchart TB
    subgraph Client
        A[Next.js Frontend<br/>Dashboard + Graph Viz]
    end

    subgraph AIService [AI/NLP Microservice]
        B[FastAPI - Python]
        B1[LLM Entity Extraction]
        B2[Facial Embedding - InsightFace/FaceNet]
        B --> B1
        B --> B2
    end

    subgraph Databases
        C[(Supabase / Postgres<br/>Auth · Metadata · pgvector)]
        D[(Neo4j<br/>Entities · Relationships · Centrality)]
    end

    A -->|REST| B
    B -->|writes| D
    B -->|writes| C
    A -->|queries| D
    A -->|queries| C
```

Postgres handles rows, auth, and vector similarity search. Neo4j handles relationship
traversal and graph algorithms — centrality, pattern detection. Neo4j is the single
source of truth for entities and relationships; Postgres never duplicates that data,
only references it by ID.

---

## Build Progress

```mermaid
gantt
    title Netra — Build Timeline
    dateFormat  YYYY-MM-DD
    axisFormat  %d %b

    section Planning
    Problem framing & app flow     :done, p1, 2026-08-20, 4d
    Architecture & schema lock     :done, p2, after p1, 2d
    UI mockups (5 screens)         :done, p3, after p2, 3d

    section Data
    Master graph generator         :active, d1, 2026-09-02, 3d
    Case manifest + tiering        :d2, after d1, 2d
    FIR/CDR/financial generation   :d3, after d2, 3d
    Face asset generation          :d4, after d2, 2d

    section Backend
    Neo4j schema + seed script     :b1, after d2, 3d
    Entity extraction pipeline     :b2, after d1, 4d
    Centrality & pattern detection :b3, after b1, 3d
    Facial search endpoint         :b4, after d4, 3d

    section Frontend
    Ingestion screens              :f1, 2026-09-05, 3d
    Dashboard & graph view         :f2, after f1, 4d
    Lead injection flow            :f3, after f2, 2d

    section Wrap-up
    Integration testing            :w1, after b3, 2d
    Demo script + report export    :w2, after w1, 2d
```

| Segment | Status | Owner |
|---|---|---|
| Problem framing & app flow | Done | Team |
| Architecture & schema design | Done | Team |
| UI/UX mockups | Done | [Designer name] |
| Data generation pipeline | In progress | [Your name] |
| Neo4j schema & seed | Not started | [DB teammate] |
| AI/NLP extraction | Not started | [ML teammate] |
| Frontend dashboard | Not started | [Frontend teammate] |
| Integration & demo prep | Not started | Team |

Update this table as work progresses — it's the fastest way for anyone opening the repo
to understand where things stand.

---

## Repo Structure

```
netra/
├── frontend/     → Next.js dashboard
├── backend/      → FastAPI AI/NLP microservice
├── data/         → dummy data generators, case manifest, raw files
├── db/           → Neo4j schema/seed scripts, Supabase migrations
├── docs/         → project reference docs
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

## Team & Ownership

| Area | Owner |
|---|---|
| Frontend | TBD |
| AI/NLP Backend | TBD |
| Database (Neo4j + Supabase) | TBD |
| Data Ingestion & Generation | [Your name] |

---

## Getting Started

*(to be filled in as each part comes online)*

---
