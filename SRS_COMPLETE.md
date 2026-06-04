# Software Requirements Specification (SRS)
## AutoInsight AI — Agentic Data Analysis Platform

**Document Version:** 2.0  
**Date:** June 4, 2026  
**Project:** AutoInsight AI (Genetic AI Platform)  
**Repository:** https://github.com/vk9199kadam-hue/gen-ai  
**Prepared For:** Development Team & Stakeholders  
**Status:** Complete — Ready for Phase 3 Development  

---

# TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [Project Overview](#2-project-overview)
3. [System Architecture](#3-system-architecture)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Data Flow & Pipeline Design](#6-data-flow--pipeline-design)
7. [API Specification](#7-api-specification)
8. [Database Design](#8-database-design)
9. [LLM Integration Design](#9-llm-integration-design)
10. [Authentication & Security](#10-authentication--security)
11. [Frontend Requirements](#11-frontend-requirements)
12. [Visualization System](#12-visualization-system)
13. [Deployment Architecture](#13-deployment-architecture)
14. [Testing Strategy](#14-testing-strategy)
15. [Phase 3 Integration Plan](#15-phase-3-integration-plan)
16. [Glossary](#16-glossary)

---

# 1. INTRODUCTION

## 1.1 Purpose

This document provides a **complete, detailed specification** of the AutoInsight AI system. It is written so that **any developer** — regardless of their experience level — can read it, understand the entire system, and complete the remaining work (LLM connection, database setup, and visualization).

## 1.2 Scope

AutoInsight AI is an **agentic AI platform** that:
- Takes raw CSV files as input
- Automatically discovers the data's structure (columns, types, formats) using AI
- Cleans the data with AI-recommended strategies
- Finds hidden relationships between data columns using an AI agent
- Generates comprehensive analytical reports with 8 sections
- Allows users to ask questions about their data in plain English
- Creates automatic dashboards with charts and visualizations

## 1.3 Definitions & Acronyms

| Term | Definition |
|------|-----------|
| **LLM** | Large Language Model (AI like GPT, Qwen, Llama) |
| **Groq** | AI inference platform offering fast LLM API access (free tier available) |
| **Ollama** | Local AI model runner — runs AI models on your own computer |
| **FastAPI** | Python web framework for building APIs |
| **Next.js** | React framework for building frontend web applications |
| **PostgreSQL** | Open-source relational database |
| **Redis** | In-memory data store used for caching and task queues |
| **S3/MinIO** | Object storage for files (S3 = Amazon, MinIO = local/self-hosted version) |
| **LangGraph** | Framework for building AI agent workflows |
| **Pydantic** | Python library for data validation using type hints |
| **Polars** | Fast data processing library (like pandas, but faster) |
| **SSE** | Server-Sent Events — real-time data streaming from server to browser |
| **JWT** | JSON Web Token — used for authentication |
| **RBAC** | Role-Based Access Control — admin/analyst/viewer permissions |
| **UDM** | Unified Data Model — the final enriched data structure |
| **Celery** | Background task queue for running long operations |
| **NLQ** | Natural Language Query — asking data questions in plain English |
| **CSV** | Comma-Separated Values — a common data file format |
| **JSON** | JavaScript Object Notation — data format |
| **Parquet** | Efficient column-oriented data file format |

## 1.4 Technology Stack Summary

### Backend
- **Language:** Python 3.11+
- **API Framework:** FastAPI
- **AI/ML:** LangGraph, LangChain, Polars, NumPy, SciPy
- **Database:** PostgreSQL 15 (async via asyncpg)
- **Cache:** Redis 7
- **File Storage:** S3/MinIO (via boto3)
- **Task Queue:** Celery
- **Authentication:** JWT (python-jose) + bcrypt (passlib)

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **State Management:** Zustand
- **HTTP Client:** Axios + TanStack React Query
- **Charts:** Plotly.js
- **Styling:** TailwindCSS

### Infrastructure
- **Containers:** Docker + Docker Compose
- **Orchestration:** Kubernetes
- **Reverse Proxy:** Nginx
- **Monitoring:** Prometheus

---

# 2. PROJECT OVERVIEW

## 2.1 What This System Does (Simple Explanation)

Imagine you have a CSV file with sales data. You don't know what columns mean, what the data types are, or what patterns exist. Normally, a data analyst would spend hours:
1. Opening the file in Excel
2. Figuring out what each column means
3. Finding and fixing errors
4. Looking for relationships (e.g., "sales go up when temperature goes down")
5. Creating charts and writing reports

**AutoInsight AI does all of this automatically in minutes.** You upload a CSV file, and the system:
1. **Understands** each column (is it a date? a number? a category?)
2. **Cleans** the data (fixes missing values, removes duplicates)
3. **Discovers relationships** (finds hidden patterns between columns)
4. **Creates new columns** (calculates useful metrics from existing data)
5. **Generates a report** (8-section comprehensive analysis)
6. **Lets you ask questions** ("What were the top 5 products last month?")
7. **Builds a dashboard** (automatic charts and visualizations)

## 2.2 The 4-Stage Pipeline (The Heart of the System)

```
Your CSV File
    │
    ▼
┌─────────────────────────────────────────────┐
│  STAGE 1: CSV → JSON Schema Inference       │
│  "What does this data look like?"            │
│  • Detect file encoding (UTF-8, Latin-1, etc.)│
│  • Read column names                         │
│  • Use AI to figure out what each column is  │
│  • Output: SchemaInferenceResponse           │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│  STAGE 2: Data Cleaning                     │
│  "What's wrong with this data and how to     │
│   fix it?"                                    │
│  • Find missing values, outliers, duplicates│
│  • AI creates a cleaning plan               │
│  • You approve/modify the plan              │
│  • Apply transformations                    │
│  • Output: Cleaned DataFrame + QualityReport│
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│  STAGE 3: LangGraph Agent                   │
│  "What relationships exist between columns?" │
│  • Profile data distributions               │
│  • Find candidate relationships             │
│  • AI validates and types each relationship │
│  • Confidence scoring (0.0 to 1.0)          │
│  • Generate derived column expressions      │
│  • Output: UnifiedDataModel (UDM)           │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│  STAGE 4: Column Engineering                │
│  "Create new useful columns"                 │
│  • Safely evaluate derived column formulas  │
│  • Validate output types                    │
│  • Build visualization schema               │
│  • Generate dashboard layout                │
│  • Output: Complete UDM (ready for reports) │
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│  STAGE 5: Report Engine                     │
│  "Generate the 8-section analytical report"  │
│  • Phase 1: Deterministic profiling (free)  │
│  • Phase 2: 8 AI sub-agents in parallel     │
│  • Phase 3: Validate with confidence scores │
│  • Phase 4: Export to HTML/PDF/XLSX/Markdown│
└─────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────┐
│  STAGE 6: NLQ + Dashboard                   │
│  "Ask questions, see charts"                 │
│  • Natural language → SQL translation       │
│  • Auto-generated dashboard with charts     │
│  • Interactive filtering                    │
└─────────────────────────────────────────────┘
```

## 2.3 Project Folder Structure (Explained)

```
gen-ai/
│
├── source code/                    ← This is where ALL the working code lives
│   │
│   ├── backend/                    ← Python FastAPI server (the "brain")
│   │   ├── api.py                  ← All API endpoints (login, upload, pipeline, reports)
│   │   ├── auth.py                 ← Login, JWT tokens, user permissions
│   │   ├── config.py               ← Settings loaded from .env file
│   │   ├── database.py             ← PostgreSQL connection and queries
│   │   ├── llm_factory.py          ← AI model connector (Groq or Ollama)
│   │   ├── schemas.py              ← Data models (all the shapes of data)
│   │   ├── cache.py                ← Redis caching layer
│   │   ├── storage.py              ← S3/MinIO file storage
│   │   ├── upload.py               ← File upload handler
│   │   ├── tasks.py                ← Background tasks (Celery)
│   │   ├── tools.py                ← Data processing tools
│   │   │
│   │   ├── pipeline/               ← The 4-stage pipeline
│   │   │   ├── orchestrator.py     ← Pipeline controller (runs all stages)
│   │   │   ├── progress.py         ← Progress tracker for SSE
│   │   │   ├── stage1_csv_to_json.py     ← Stage 1
│   │   │   ├── stage2_data_clean.py      ← Stage 2
│   │   │   ├── stage3_langgraph_agent.py ← Stage 3 (the AI agent)
│   │   │   └── stage4_column_engine.py   ← Stage 4
│   │   │
│   │   ├── report/                 ← Report generation engine
│   │   │   ├── orchestrator.py     ← Report controller
│   │   │   ├── phase1_profiling.py ← Deterministic stats
│   │   │   ├── phase2_sub_agents.py← 8 AI sub-agents
│   │   │   ├── phase3_validation.py← Validation
│   │   │   └── phase4_export.py    ← Export to HTML/PDF/XLSX
│   │   │
│   │   ├── nlq/                    ← Natural Language Query
│   │   ├── middleware/             ← Security and logging middleware
│   │   └── prompt_registry.py      ← AI prompt templates
│   │
│   ├── autoinsight-ai/             ← Full-stack version (with frontend + Docker)
│   │   ├── backend/                ← Same as above with additions
│   │   ├── frontend/               ← Next.js React website
│   │   │   ├── src/app/            ← Pages (login, dashboard, upload, etc.)
│   │   │   ├── src/components/     ← Reusable UI components
│   │   │   └── src/lib/            ← API client and utilities
│   │   ├── k8s/                    ← Kubernetes deployment files
│   │   └── docker-compose*.yml     ← Docker setup files
│   │
│   ├── scripts/
│   │   └── migrate.py              ← Database migration script (creates tables)
│   │
│   ├── tests/                      ← Test files
│   ├── requirements.txt            ← Python dependencies
│   ├── .env.template               ← Environment variable template
│   └── Dockerfile                  ← Docker container definition
│
└── INFRASTRUCTURE_REPORT.md        ← Infrastructure analysis (already created)
```

## 2.4 Current Status: What Works and What's Left

| Feature | Status | Details |
|---------|--------|---------|
| API Framework | ✅ Complete | All 24 endpoints implemented |
| File Upload | ✅ Complete | Chunked upload with progress tracking |
| Pipeline Stage 1 | ✅ Complete | CSV parsing + AI schema inference |
| Pipeline Stage 2 | ✅ Complete | Data profiling + cleaning plan |
| Pipeline Stage 3 | ✅ Complete | LangGraph agent with 4 nodes |
| Pipeline Stage 4 | ✅ Complete | Column engineering + UDM assembly |
| Report Engine | ✅ Complete | 4-phase engine with 8 sub-agents |
| Authentication | ⚠️ Partial | JWT works, but login needs database |
| User Registration | ⚠️ Partial | Returns mock data, needs database |
| NLQ | ⚠️ Placeholder | Returns placeholder response |
| Dashboard | ⚠️ Placeholder | Returns empty structure |
| Frontend | ✅ Complete | All pages built |
| Docker/K8s | ✅ Complete | Deployment files ready |

### What's Left to Do (Phase 3)
1. **Connect LLM** — Add Groq API key
2. **Connect Database** — Set up PostgreSQL
3. **Fix Login/Register** — Make them work with database
4. **Build NLQ** — Implement natural language querying
5. **Build Dashboard** — Implement actual dashboard with charts
6. **Add Visualization** — Create interactive charts and visualizations

---

# 3. SYSTEM ARCHITECTURE

## 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER (Web Browser)                          │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  Login   │  │  Upload  │  │Dashboard │  │  Reports │            │
│  │  Page    │  │  Page    │  │  Page    │  │  Page    │            │
│  │          │  │          │  │          │  │          │            │
│  │Next.js 14│  │Next.js 14│  │Next.js 14│  │Next.js 14│            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ HTTPS + JSON
                           │ SSE (real-time)
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     FASTAPI BACKEND (Python)                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    API Layer (api.py)                       │   │
│  │  24 REST endpoints + SSE streaming + middleware             │   │
│  └──────────────────────┬──────────────────────────────────────┘   │
│                         │                                           │
│  ┌──────────────────────┼──────────────────────────────────────┐   │
│  │                      │                                      │   │
│  ▼                      ▼                                      ▼   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Auth       │  │   Pipeline   │  │   Report Engine      │   │
│  │   Module     │  │   Orchestr.  │  │   (4-phase)          │   │
│  │  (JWT+RBAC)  │  │  (4 stages)  │  │                      │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   LLM        │  │   NLQ        │  │   Dashboard          │   │
│  │   Factory    │  │   Engine     │  │   Generator          │   │
│  │  (Groq/      │  │              │  │                      │   │
│  │   Ollama)    │  │              │  │                      │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │PostgreSQL│  │  Redis   │  │  S3/     │
    │   15     │  │    7     │  │  MinIO   │
    │          │  │          │  │          │
    │ Metadata │  │ Cache +  │  │ Files +  │
    │ Users    │  │ Queue    │  │ Reports  │
    │ Pipelines│  │ Progress │  │ Parquet  │
    │ Reports  │  │ Sessions │  │ Snapshots│
    └──────────┘  └──────────┘  └──────────┘
```

## 3.2 Component Relationships

### Data Flow (Step-by-Step)

```
1. User uploads CSV via browser
   → Frontend calls POST /api/v1/upload/initiate
   → Backend creates upload session, returns upload_id
   → Frontend uploads file in chunks
   → Backend stores in staging, computes hash, detects encoding
   → Backend stores in S3/MinIO

2. User clicks "Analyze"
   → Frontend calls POST /api/v1/pipeline/run
   → Backend starts pipeline in background
   → Frontend subscribes to SSE stream: GET /api/v1/pipeline/events/{id}
   → Real-time progress updates shown in browser

3. Pipeline runs 4 stages
   → Each stage checks Redis cache first (skip if already processed)
   → Stage 1: CSV parsing + AI schema inference
   → Stage 2: Quality profiling + AI cleaning plan
   → Stage 3: LangGraph agent discovers relationships
   → Stage 4: Column engineering creates derived columns

4. Results stored
   → UnifiedDataModel saved to S3 (JSON)
   → Pipeline record saved to PostgreSQL
   → SSE sends completion event to frontend

5. User generates report
   → Frontend calls POST /api/v1/reports/generate
   → Report engine runs 4 phases (deterministic + 8 AI sub-agents)
   → Report saved, export URLs generated
   → User downloads HTML/PDF/XLSX

6. User asks NLQ questions
   → Frontend calls POST /api/v1/nlq/query
   → AI translates question to SQL/metrics
   → Results returned with chart config
```

## 3.3 Technology Decisions (Why Each Technology Was Chosen)

| Technology | Why Chosen | Alternative Considered |
|-----------|-----------|----------------------|
| **FastAPI** | Fast, async, auto-generates API docs, great Python ecosystem | Flask (slower, no async), Django (too heavy) |
| **PostgreSQL** | Best open-source relational DB, JSONB support, mature | MySQL (less feature-rich), MongoDB (no SQL) |
| **Redis** | Fastest in-memory store, perfect for caching + queues | Memcached (no persistence), no SQL |
| **Groq (Qwen 2.5 72B)** | Free tier, extremely fast inference, good quality | OpenAI GPT-4 (expensive), Anthropic Claude (expensive) |
| **Ollama (Llama 3.1)** | Fully local, offline, free, no API key needed | HuggingFace (requires API, slower) |
| **Polars** | 10x faster than pandas, lazy evaluation, parallel | Pandas (slow on large files), Dask (complex) |
| **LangGraph** | Built for AI agents, state management, retry logic | LangChain alone (no workflow), custom code (complex) |
| **Next.js 14** | SSR, App Router, great DX, Vercel deployment | React alone (no SSR), Vue (smaller ecosystem) |
| **Plotly.js** | Interactive charts, 40+ chart types, no coding needed | D3.js (complex), Chart.js (fewer features) |
| **Docker** | Reproducible environments, easy deployment | Manual setup (error-prone), VMs (heavy) |
| **Celery** | Production-ready task queue, Redis integration | RQ (simpler, less features), custom threads (unreliable) |

---

# 4. FUNCTIONAL REQUIREMENTS

## 4.1 User Management (FR-01)

### FR-01.1: User Registration
- **What:** New users can create accounts
- **Input:** Email, password (min 8 chars), name
- **Output:** User account with analyst role by default
- **Storage:** PostgreSQL `users` table (password hashed with bcrypt)
- **Validation:**
  - Email must be valid format (regex check)
  - Password must be 8-128 characters
  - Email must be unique
  - Name must be 1-255 characters

### FR-01.2: User Login
- **What:** Existing users can log in
- **Input:** Email, password
- **Output:** JWT access token (15 min expiry) + refresh token (7 days expiry)
- **Process:**
  1. Look up user by email in database
  2. Verify password hash using bcrypt
  3. If valid, create access + refresh tokens
  4. Return tokens to frontend
  5. Frontend stores tokens in localStorage

### FR-01.3: Token Refresh
- **What:** Get new access token without re-login
- **Input:** Refresh token
- **Output:** New access + refresh token pair
- **Process:** Verify refresh token, create new tokens

### FR-01.4: Role-Based Access Control
- **Roles:**
  - **Admin:** Full access, can manage users, see everything
  - **Analyst:** Can upload data, run pipelines, generate reports, use NLQ
  - **Viewer:** Can only view dashboards and reports (read-only)
- **Implementation:** Each API endpoint checks user role via `require_role()` dependency

## 4.2 File Upload (FR-02)

### FR-02.1: File Validation
- **Allowed types:** .csv, .tsv, .json, .parquet
- **Max size:** 100 MB (configurable)
- **Validation:** File extension check, size limit, filename sanitization

### FR-02.2: Chunked Upload
- **Why:** Large files uploaded in small pieces to avoid timeout
- **Flow:**
  1. `POST /upload/initiate` → Get `upload_id`
  2. `POST /upload/chunk` → Upload each piece (with chunk index)
  3. `POST /upload/complete/{id}` → Finalize upload
- **Progress:** Tracked in Redis, streamed to frontend via SSE

### FR-02.3: Duplicate Detection
- **Method:** MD5 hash of file content
- **Behavior:** If same hash exists, warn user (don't block — they may want to re-analyze)

### FR-02.4: Encoding Detection
- **Method:** `chardet` library analyzes file content
- **Supported encodings:** UTF-8, Latin-1, ASCII, ISO-8859-1, etc.
- **Fallback:** UTF-8 if detection fails

## 4.3 Pipeline Execution (FR-03)

### FR-03.1: Stage 1 — CSV → JSON Schema Inference

**What it does:**
- Reads the raw CSV file
- Detects encoding using chardet
- Parses CSV using Polars (fast, handles large files)
- Sends a sample of rows (20 rows) to the AI
- AI tells us:
  - What type each column is (number, date, text, category, etc.)
  - What format dates use (YYYY-MM-DD, DD/MM/YYYY, etc.)
  - Whether column can have null values
  - Confidence score (how sure the AI is)
  - Reasoning (why it chose that type)

**AI Prompt Example:**
```
You are a data schema expert. Analyze this CSV sample and infer the schema.

CSV Sample:
Name,Age,Join_Date,Salary
John,35,2023-01-15,75000
Jane,28,2023-03-20,65000
Bob,42,2022-11-10,85000

Return JSON with:
- column_name: original column name
- detected_type: one of [int, float, str, date, datetime, boolean, categorical, text]
- format_spec: format string if applicable (e.g., "%Y-%m-%d" for dates)
- confidence: 0.0 to 1.0
- reasoning: why you chose this type
- nullable: whether column can have null values
- sample_values: up to 5 sample values
```

**Output:** `SchemaInferenceResponse` object containing all column inferences.

**Caching:** If the same file (same MD5 hash) was already processed, return cached result from Redis (saves AI cost).

**Fallback (if AI is unavailable):** Use deterministic rules — if all values are numbers → int/float, if matches date pattern → date, etc.

### FR-03.2: Stage 2 — Data Cleaning

**What it does:**
- Profiles the data quality:
  - Missing value percentage per column
  - Outlier detection (IQR method + Z-score)
  - Duplicate row detection
  - PII (personal info) detection (email, phone, SSN patterns)
- AI creates a cleaning plan with recommended actions
- User can approve, modify, or reject each action
- Approved transformations are applied using Polars

**Cleaning Operations Available:**
| Operation | What it does | Example |
|-----------|-------------|---------|
| **Impute (mean)** | Replace missing numbers with average | Missing salary → average salary |
| **Impute (median)** | Replace missing numbers with middle value | Missing age → median age |
| **Impute (mode)** | Replace missing text with most common value | Missing city → most common city |
| **Impute (constant)** | Replace missing with fixed value | Missing status → "Unknown" |
| **Mask PII** | Hide personal information | email@example.com → ***@***.com |
| **Cap outliers** | Limit extreme values to reasonable range | Salary > $1M → cap at $500K |
| **Remove duplicates** | Delete exact duplicate rows | 2 identical rows → keep 1 |
| **Transform** | Apply formula to column | "2023-01-15" → parse as date |

**AI Prompt Example:**
```
You are a data cleaning expert. Here is the quality profile of a dataset:

Quality Profile:
- Column "Age": 15% missing values, 3 outliers detected
- Column "Salary": 5% missing values, distribution is skewed right
- Column "Email": 2% PII detected
- 12 duplicate rows found

Generate a cleaning plan with specific operations for each issue.
For each operation, provide:
- column: which column to fix
- issue: what's wrong
- strategy: impute/mask/cap/remove/transform
- parameters: specific values (e.g., fill with mean)
- confidence: how sure you are this is correct (0.0-1.0)
- reasoning: why you recommend this
```

**Output:** Cleaned DataFrame + QualityProfile + CleaningPlan

### FR-03.3: Stage 3 — LangGraph Agent (Relationship Discovery)

**What it does (THE MOST IMPORTANT STAGE):**
This is where the AI "thinks" about the data and finds relationships.

**4-Node Workflow:**

```
Node 1: profile_step (FAST — ~0.5 seconds)
  • Compute statistics for each column
  • Mean, median, std, min, max for numbers
  • Unique values, most common for categories
  • Distribution shape

Node 2: discover_step (FAST — ~1.2 seconds)
  • Calculate correlations between all column pairs
  • Find value overlaps (e.g., Customer_ID appears in both tables)
  • Generate candidate relationships

Node 3: reason_step (AI — ~3.8 seconds)
  • AI reviews each candidate relationship
  • Validates if the relationship makes sense
  • Types the relationship (one-to-one, one-to-many, many-to-many)
  • Assigns confidence score
  • Recommends chart type for visualization
  • Generates derived column expressions

Node 4: executor_step (FAST — ~1.1 seconds)
  • Assembles the UnifiedDataModel
  • Filters out low-confidence relationships (< 0.65)
  • Records audit trail
```

**Validation Gate:**
- Relationships with confidence < 0.65 are filtered out
- If AI fails, retry up to 3 times with exponential backoff
- If all retries fail, use deterministic fallback (correlation-based)

**Output:** `UnifiedDataModel` containing:
- Original columns
- Cleaned columns
- Derived columns (new columns to create)
- Discovered relationships
- Full audit trail
- Visualization schema
- Dashboard layout recommendations

### FR-03.4: Stage 4 — Column Engineering

**What it does:**
- Takes the derived column expressions from Stage 3
- Safely evaluates each expression using Polars
- Validates the output type
- Checks for NaN/Infinity values
- Records audit trail for each operation

**Safety:** Uses AST-based sandbox — dangerous operations (os, sys, exec, eval) are blocked.

**Example Derived Columns:**
```python
# AI might suggest:
{"name": "Profit_Margin", "expression": "(Revenue - Cost) / Revenue * 100"}
{"name": "Age_Group", "expression": "pl.col('Age').cut([18, 35, 50, 65])"}
{"name": "Is_Weekend", "expression": "pl.col('Date').dt.weekday() >= 5"}
```

**Output:** Complete `UnifiedDataModel` with all columns materialized.

## 4.4 Report Generation (FR-04)

### FR-04.1: 4-Phase Report Engine

**Phase 1: Deterministic Profiling (FREE — No AI)**
Computes using only code (no LLM calls):
- Schema metadata (column names, types, null counts)
- Univariate statistics (mean, median, std, IQR, skew, kurtosis)
- Bivariate correlation matrix (Pearson correlations)
- Time series trends (if date columns exist)
- Domain classification (sales, healthcare, finance, etc.)

**Phase 2: 8 Parallel AI Sub-Agents**
8 AI agents work simultaneously (using `asyncio.gather`):

| Sub-Agent | What it writes | Section |
|-----------|---------------|---------|
| Business Understanding | What the data is about, business context | Section 1 |
| Data Collection | How data was collected, limitations | Section 2 |
| Cleaning Analysis | What cleaning was done, impact on quality | Section 3 |
| Exploratory Data Analysis | Key patterns, distributions, outliers | Section 4 |
| Statistical Analysis | Hypothesis tests, significance, correlations | Section 5 |
| Dashboard Visualization | Recommended charts, what to show | Section 6 |
| Insights | Key findings from the data | Section 7 |
| Recommendations | Actionable next steps | Section 8 |

**Phase 3: Validation**
- Each section validated with Pydantic
- Confidence score computed per section
- Overall report confidence = average of all 8 sections
- Sections with confidence < 0.50 are flagged

**Phase 4: Multi-Format Export**
- **HTML:** Interactive report with embedded charts (Jinja2 template)
- **PDF:** Print-ready report (WeasyPrint)
- **Markdown:** Plain text report
- **Excel:** Structured data with multiple sheets (openpyxl)

### FR-04.2: Report Confidence Badges

| Confidence Score | Badge Color | Meaning |
|-----------------|-------------|---------|
| 0.90 - 1.00 | 🟢 Green | Auto-apply, highly reliable |
| 0.70 - 0.89 | 🟡 Yellow | Manual review recommended |
| 0.50 - 0.69 | 🟠 Orange | Review required, may be incomplete |
| < 0.50 | 🔴 Red | Advisory only, use with caution |

## 4.5 Natural Language Querying (FR-05)

### FR-05.1: NLQ Flow
```
User asks: "What were the top 5 products by revenue last quarter?"
    ↓
AI translates to metrics:
  • Metric: SUM(Revenue)
  • Dimension: Product_Name
  • Filter: Date >= '2024-01-01' AND Date <= '2024-03-31'
  • Order By: SUM(Revenue) DESC
  • Limit: 5
    ↓
Execute against UDM
    ↓
Return: Table of results + Vega-Lite chart config
```

### FR-05.2: NLQ Response Format
```json
{
  "natural_language_response": "The top 5 products by revenue last quarter were...",
  "sql_generated": "SELECT Product_Name, SUM(Revenue)...",
  "chart_config": {"type": "bar", "data": [...], "encoding": {...}},
  "results": [{"Product_Name": "Widget A", "Revenue": 150000}, ...],
  "row_count": 5,
  "processing_time_ms": 1200,
  "confidence": 0.85
}
```

## 4.6 Dashboard Generation (FR-06)

### FR-06.1: Auto-Generated Dashboard
- Based on UDM relationships and viz schema
- Suggests chart types for each relationship
- Supports: bar, line, scatter, heatmap, box, pie, histogram, area, bubble, treemap
- Layout: 2-column grid (configurable)
- Interactive filters (date range, category, etc.)

### FR-06.2: Chart Configuration (Vega-Lite)
Each chart is described using Vega-Lite specification:
```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "mark": "bar",
  "encoding": {
    "x": {"field": "Product_Name", "type": "nominal"},
    "y": {"field": "Revenue", "type": "quantitative", "aggregate": "sum"},
    "color": {"field": "Category", "type": "nominal"}
  }
}
```

---

# 5. NON-FUNCTIONAL REQUIREMENTS

## 5.1 Performance Requirements

| Requirement | Target | Measurement |
|------------|--------|-------------|
| API Response Time | < 200ms for simple queries | p95 latency |
| Pipeline Execution | < 5 minutes for 100MB CSV | End-to-end |
| Schema Inference | < 10 seconds | Stage 1 only |
| Report Generation | < 3 minutes | All 8 sections |
| NLQ Response | < 3 seconds | Query to response |
| Concurrent Users | 100 simultaneous users | Load tested |
| File Upload | Support files up to 100MB | Max size |

## 5.2 Scalability Requirements

| Requirement | Target |
|------------|--------|
| Horizontal scaling | Add more API worker instances |
| Database | Connection pooling (2-20 connections) |
| Cache | Redis cluster support |
| Storage | S3-compatible, unlimited files |

## 5.3 Reliability Requirements

| Requirement | Target |
|------------|--------|
| Uptime | 99.9% (8.76 hours downtime/year max) |
| Data loss | Zero — all uploads stored in S3 + metadata in PostgreSQL |
| Pipeline recovery | Retry up to 3 times per stage on failure |
| Backup | Daily PostgreSQL backups, S3 versioning |

## 5.4 Security Requirements

| Requirement | Implementation |
|------------|---------------|
| Authentication | JWT tokens (15 min access, 7 days refresh) |
| Password storage | bcrypt with 12 rounds |
| API security | RBAC on every endpoint |
| CORS | Configurable allowed origins |
| SQL injection | Parameterized queries (asyncpg) |
| Code injection | AST sandbox for derived column evaluation |
| File upload | Extension whitelist, size limit, sanitization |

## 5.5 Compatibility Requirements

| Requirement | Details |
|------------|---------|
| Browsers | Chrome 90+, Firefox 90+, Safari 14+, Edge 90+ |
| Python | 3.11+ (tested with 3.11, 3.12) |
| PostgreSQL | 14+ (tested with 15) |
| Redis | 6+ (tested with 7) |
| Docker | 20.10+ |
| Kubernetes | 1.24+ |

---

# 6. DATA FLOW & PIPELINE DESIGN

## 6.1 Complete Data Flow Diagram

```
┌─────────┐
│  CSV    │  User uploads a CSV file
│  File   │
└────┬────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  ENCODING DETECTION (chardet)               │
│  Input: raw bytes                           │
│  Output: "UTF-8" / "Latin-1" / etc.        │
│  Time: ~0.1 seconds                         │
└─────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  FILE HASH COMPUTATION (MD5)                │
│  Input: file bytes                          │
│  Output: "abc123def456..."                  │
│  Purpose: Check Redis cache — skip if       │
│           already processed                  │
└─────────────────────────────────────────────┘
     │
     ├─ CACHE HIT ───────────────────────────┐
     │                                        ▼
     │                              Return cached schema
     │                              from Redis (instant)
     │
     ▼
┌─────────────────────────────────────────────┐
│  STAGE 1: CSV PARSING                       │
│  Input: file path + encoding                │
│  Process:                                   │
│    1. Read CSV with Polars                  │
│    2. Take first 20 rows as sample          │
│    3. Send sample to AI (Groq Qwen 2.5 72B)│
│    4. AI returns schema with types          │
│    5. Validate with Pydantic                │
│    6. Cache result in Redis (24h TTL)      │
│  Output: SchemaInferenceResponse            │
│  Time: ~5-10 seconds                        │
│  Cost: ~$0.001 per file (Groq free tier)   │
└─────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  STAGE 2: DATA CLEANING                     │
│  Input: DataFrame from Stage 1              │
│  Process:                                   │
│    1. Profile quality (missing, outliers,   │
│       duplicates, PII)                      │
│    2. Send profile to AI for cleaning plan  │
│    3. User approves/modifies plan           │
│    4. Apply transformations with Polars     │
│    5. Save Parquet snapshot to S3           │
│    6. Log to audit trail                    │
│  Output: Cleaned DataFrame + QualityProfile │
│  Time: ~10-30 seconds                       │
│  Cost: ~$0.002 per file                     │
└─────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  STAGE 3: LANGGRAPH AGENT                   │
│  Input: Cleaned DataFrame                   │
│  Process:                                   │
│    Node 1: profile_step (deterministic)     │
│      → Statistics, distributions            │
│    Node 2: discover_step (deterministic)    │
│      → Correlations, value overlaps         │
│    Node 3: reason_step (AI call)            │
│      → AI validates relationships           │
│      → Types relationships                  │
│      → Confidence scoring                   │
│    VALIDATION GATE                          │
│      → Filter confidence < 0.65            │
│      → Retry up to 3 times if AI fails      │
│    Node 4: executor_step (deterministic)    │
│      → Generate derived column expressions  │
│      → Assemble UDM                         │
│  Output: UnifiedDataModel                   │
│  Time: ~15-45 seconds                       │
│  Cost: ~$0.005 per file                     │
└─────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  STAGE 4: COLUMN ENGINEERING                │
│  Input: UDM + Cleaned DataFrame             │
│  Process:                                   │
│    1. For each derived column:              │
│       a. Validate expression (no dangerous  │
│          code)                              │
│       b. Evaluate with Polars               │
│       c. Validate output type               │
│       d. Check for NaN/Inf                  │
│    2. Generate viz schema                   │
│    3. Generate dashboard layout             │
│  Output: Complete UDM                       │
│  Time: ~5-15 seconds                        │
│  Cost: $0 (no AI calls)                     │
└─────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  STORAGE                                    │
│  1. UDM JSON → S3                           │
│  2. Pipeline record → PostgreSQL            │
│  3. Progress state → Redis                  │
│  4. SSE completion event → Frontend         │
└─────────────────────────────────────────────┘
```

## 6.2 Caching Strategy

| What to Cache | Where | TTL | Why |
|--------------|-------|-----|-----|
| Schema inference result | Redis | 24 hours | Same file re-uploaded → instant result |
| Pipeline progress state | Redis | 24 hours | Frontend polls for status |
| Upload progress | Redis | 4 hours | SSE streaming |
| DataFrames (Polars) | Redis (Parquet bytes) | 4 hours | Avoid re-parsing between stages |
| Prompt templates | Redis | 1 hour | Frequently used prompts |
| Cleaned data snapshot | S3 (Parquet) | Permanent | Versioned history |

## 6.3 Error Handling Strategy

| Error Type | Where | How Handled |
|-----------|-------|-------------|
| File too large | Upload | Reject with 400 error |
| Invalid file type | Upload | Reject with 400 error |
| CSV parsing fails | Stage 1 | Try alternative encodings, then fail |
| AI timeout | All stages | Retry up to 3 times with exponential backoff |
| AI returns invalid JSON | All stages | Retry, then use deterministic fallback |
| Low confidence (< 0.65) | Stage 3 | Filter out relationship |
| Derived column fails | Stage 4 | Skip column, log warning |
| Database connection fails | Any | Retry with exponential backoff |
| Redis unavailable | Any | Continue without caching (slower but works) |
| S3 unavailable | Any | Use local filesystem fallback |

---

# 7. API SPECIFICATION

## 7.1 Complete API Endpoint Reference

### System Endpoints

| Endpoint | Method | Auth | Description | Request | Response |
|----------|--------|------|-------------|---------|----------|
| `/` | GET | No | Root info | — | `{message, documentation, health_check, api_v1}` |
| `/health` | GET | No | System health | — | `{status, application, database, cache, llm_provider, pipeline, response_time_ms}` |
| `/health/ready` | GET | No | Readiness probe | — | `{status: "ready", timestamp}` |
| `/health/live` | GET | No | Liveness probe | — | `{status: "alive", timestamp}` |
| `/api/v1/system/info` | GET | No | System configuration | — | `{application, llm, pipeline}` |

### Authentication Endpoints

| Endpoint | Method | Auth | Description | Request | Response |
|----------|--------|------|-------------|---------|----------|
| `/api/v1/auth/register` | POST | No | Create user | `{email, password, name}` | `{id, email, name, role, created_at, is_active}` |
| `/api/v1/auth/login` | POST | No | Login | `{email, password}` | `{access_token, refresh_token, token_type, expires_in}` |
| `/api/v1/auth/refresh` | POST | No | Refresh token | `{refresh_token}` | `{access_token, refresh_token, token_type, expires_in}` |

### Upload Endpoints

| Endpoint | Method | Auth | Description | Request | Response |
|----------|--------|------|-------------|---------|----------|
| `/api/v1/upload/initiate` | POST | Yes | Start upload | `{filename, file_size, content_type}` | `{upload_id, staging_path, ...}` |
| `/api/v1/upload/chunk` | POST | Yes | Upload chunk | multipart: `{upload_id, chunk_index, is_final, file}` | `{bytes_received, progress, ...}` |
| `/api/v1/upload/progress/{id}` | GET | Yes | SSE progress | — | SSE stream: `upload_progress` events |
| `/api/v1/upload/complete/{id}` | POST | Yes | Finalize | — | `{file_hash, encoding, storage_key, ...}` |
| `/api/v1/upload/{id}` | DELETE | Yes | Cancel | — | `{upload_id, status: "cancelled"}` |

### Pipeline Endpoints

| Endpoint | Method | Auth | Description | Request | Response |
|----------|--------|------|-------------|---------|----------|
| `/api/v1/pipeline/run` | POST | Yes | Run pipeline | `{upload_id, llm_provider, skip_cleaning}` | `{pipeline_id, status: "queued", stages}` |
| `/api/v1/pipeline/status/{id}` | GET | Yes | Get status | — | `{pipeline_id, status, progress, stages}` |
| `/api/v1/pipeline/events/{id}` | GET | Yes | SSE events | — | SSE stream: `pipeline_progress` events |
| `/api/v1/pipeline/diff/{id}` | GET | Yes | Cleaning diff | — | `{original_rows, cleaned_rows, changes}` |
| `/api/v1/pipeline/cleaning/approve` | POST | Yes | Approve cleaning | `{pipeline_id, operations}` | `{approved_operations, message}` |

### Report Endpoints

| Endpoint | Method | Auth | Description | Request | Response |
|----------|--------|------|-------------|---------|----------|
| `/api/v1/reports/generate` | POST | Yes | Generate report | `{data_model_id, title}` | `{report_id, status: "queued"}` |
| `/api/v1/reports/{id}` | GET | Yes | Get report | — | `{report_id, sections, confidence, export_urls}` |
| `/api/v1/reports/{id}/export/{format}` | GET | Yes | Export report | format: html/md/pdf/xlsx | Redirect to file URL |

### Other Endpoints

| Endpoint | Method | Auth | Description | Request | Response |
|----------|--------|------|-------------|---------|----------|
| `/api/v1/nlq/query` | POST | Yes | Ask question | `{query, dataset_id, conversation_id}` | `{response, chart_config, results}` |
| `/api/v1/dashboard/{id}` | GET | Yes | Get dashboard | — | `{dashboard_id, title, charts, layout}` |
| `/api/v1/admin/users` | GET | Admin | List users | — | `{users, total}` |

## 7.2 API Response Format

All API responses follow a consistent format:

```json
{
  "status": "success",
  "data": { ... },
  "meta": {
    "timestamp": "2026-06-04T10:30:00Z",
    "request_id": "abc123-def456",
    "version": "1.0.0"
  },
  "errors": []
}
```

Error response:
```json
{
  "status": "error",
  "data": null,
  "meta": {
    "timestamp": "2026-06-04T10:30:00Z",
    "request_id": "abc123-def456",
    "version": "1.0.0"
  },
  "errors": ["Invalid email or password"]
}
```

## 7.3 Authentication Mechanism

### How JWT Works in This System

```
1. User logs in with email + password
2. Backend verifies password against bcrypt hash in database
3. Backend creates two tokens:
   
   ACCESS TOKEN (expires in 15 minutes):
   - Sent with every API request in Authorization header
   - Header: "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
   - Contains: user_id, email, role
   
   REFRESH TOKEN (expires in 7 days):
   - Stored in localStorage
   - Used to get a new access token without re-login
   - When access token expires, frontend sends refresh token to get new pair

4. Every API request:
   - Frontend attaches access token to request header
   - Backend verifies token signature
   - Backend checks user role for the endpoint
   - If valid → process request
   - If expired → return 401, frontend uses refresh token
   - If invalid → return 401, redirect to login
```

---

# 8. DATABASE DESIGN

## 8.1 Complete Database Schema

### 8.1.1 users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'analyst',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    CONSTRAINT valid_role CHECK (role IN ('admin', 'analyst', 'viewer'))
);
```

**Columns explained:**
- `id`: Unique identifier (UUID, auto-generated)
- `email`: User's email (must be unique)
- `password_hash`: Bcrypt hash of password (NEVER store plain text)
- `name`: User's display name
- `role`: Permission level (admin/analyst/viewer)
- `is_active`: Whether account is active (soft delete)
- `created_at`: When account was created
- `updated_at`: When account was last modified
- `last_login_at`: When user last logged in

**Indexes:**
- Primary key on `id`
- Unique index on `email`

**Sample data:**
```sql
INSERT INTO users (email, password_hash, name, role)
VALUES ('admin@autoinsight.com', '$2b$12$LJ3m4ys3Lk0K0Z0xLJ3m4y...', 'Admin User', 'admin');
```

### 8.1.2 pipelines Table
```sql
CREATE TABLE pipelines (
    pipeline_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'queued',
    file_name VARCHAR(255),
    file_size BIGINT,
    file_hash VARCHAR(64),
    llm_provider VARCHAR(50) DEFAULT 'groq',
    stages_completed JSONB DEFAULT '[]',
    total_processing_time_ms INTEGER,
    unified_data_model JSONB,
    error TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_pipeline_status CHECK (
        status IN ('queued', 'running', 'completed', 'failed', 'cancelled', 'paused')
    )
);
```

**Columns explained:**
- `pipeline_id`: Unique identifier for this pipeline run
- `user_id`: Who ran this pipeline (nullable if user deleted)
- `status`: Current status of the pipeline
- `file_name`: Original uploaded filename
- `file_size`: File size in bytes
- `file_hash`: MD5 hash for duplicate detection
- `llm_provider`: Which AI was used (groq/ollama)
- `stages_completed`: JSON array of completed stages: `["CSV → JSON", "Data Cleaning", ...]`
- `total_processing_time_ms`: Total time in milliseconds
- `unified_data_model`: The complete UDM as JSON
- `error`: Error message if pipeline failed
- `started_at`, `completed_at`: Timing
- `created_at`: When pipeline was created

**Indexes:**
- Primary key on `pipeline_id`
- Index on `user_id` (find all pipelines for a user)
- Index on `status` (find all running/failed pipelines)
- Index on `created_at DESC` (recent pipelines first)

**Sample data:**
```sql
INSERT INTO pipelines (user_id, status, file_name, stages_completed, total_processing_time_ms)
VALUES ('uuid-1', 'completed', 'sales_data.csv', '["CSV → JSON", "Data Cleaning", "LangGraph Agent", "Column Engineering"]', 45000);
```

### 8.1.3 data_models Table
```sql
CREATE TABLE data_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id UUID REFERENCES pipelines(pipeline_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    model_json JSONB NOT NULL,
    confidence_avg FLOAT,
    column_count INTEGER,
    row_count BIGINT,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Stores the UnifiedDataModel as JSON for quick retrieval without loading from S3.

### 8.1.4 reports Table
```sql
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_model_id UUID REFERENCES data_models(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    report_bundle JSONB,
    export_urls JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    overall_confidence FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_report_status CHECK (
        status IN ('pending', 'generating', 'completed', 'failed')
    )
);
```

**export_urls example:**
```json
{
  "html": "https://s3.amazonaws.com/bucket/reports/abc123/report.html",
  "pdf": "https://s3.amazonaws.com/bucket/reports/abc123/report.pdf",
  "md": "https://s3.amazonaws.com/bucket/reports/abc123/report.md",
  "xlsx": "https://s3.amazonaws.com/bucket/reports/abc123/report.xlsx"
}
```

### 8.1.5 conversations Table
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    dataset_id UUID,
    context JSONB,
    turn_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Stores NLQ conversation history so the AI remembers context between questions.

### 8.1.6 prompts Table
```sql
CREATE TABLE prompts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version INTEGER NOT NULL,
    template TEXT NOT NULL,
    description TEXT,
    stage INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, version)
);
```

**Purpose:** Versioned storage of AI prompt templates. Allows rollback to previous prompt versions.

**Sample data:**
```sql
INSERT INTO prompts (name, version, template, stage)
VALUES ('infer_schema', 1, 'You are a data schema expert...', 1);
```

### 8.1.7 audit_log Table
```sql
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Complete audit trail of every action in the system. Required for compliance.

### 8.1.8 files Table
```sql
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    file_hash VARCHAR(64),
    mime_type VARCHAR(255),
    s3_key VARCHAR(512),
    s3_bucket VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Index of all uploaded files and their S3 locations.

## 8.2 Migration Script

Run the migration script to create all tables:

```bash
cd source-code
export DATABASE_URL=postgresql://user:pass@host:5432/autoinsight
python scripts/migrate.py --seed
```

The `--seed` flag also inserts default prompt templates.

---

# 9. LLM INTEGRATION DESIGN

## 9.1 How LLM Integration Works (Simple Explanation)

The system uses AI in several places. Here's how it works:

### Step 1: Get an API Key
1. Go to https://console.groq.com/
2. Create an account (free)
3. Go to API Keys section
4. Click "Create API Key"
5. Copy the key (looks like: `gsk_xxxxxxxxxxxxxxxx`)

### Step 2: Set the Environment Variable

In your `.env` file:
```bash
GROQ_API_KEY=gsk_your_actual_key_here
```

### Step 3: How the System Uses the Key

```
Your Code (llm_factory.py)
    │
    │  Reads GROQ_API_KEY from .env
    │
    ▼
┌──────────────────────────────────────┐
│  LLMFactory(provider="groq")        │
│                                      │
│  Creates a ChatGroq instance:       │
│  - Model: qwen-2.5-72b              │
│  - Temperature: 0.1 (deterministic) │
│  - Max tokens: 4096                 │
│  - Timeout: 30 seconds              │
│  - Max retries: 3                   │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│  invoke_agent()                      │
│                                      │
│  For each AI call:                  │
│  1. Format the prompt with variables│
│  2. Send to Groq API               │
│  3. Get response                   │
│  4. Parse as JSON                  │
│  5. Validate with Pydantic model    │
│  6. Return validated object         │
│  7. If fails, retry (up to 3 times) │
│  8. If still fails, try Ollama      │
└──────────────────────────────────────┘
```

## 9.2 Where AI is Used in the System

| Where | What the AI Does | Model Used | Frequency |
|-------|-----------------|------------|-----------|
| **Stage 1: Schema Inference** | Tells us what type each column is | Qwen 2.5 72B | Once per file upload |
| **Stage 2: Cleaning Plan** | Recommends how to fix data quality issues | Qwen 2.5 72B | Once per file |
| **Stage 3: Relationship Validation** | Validates if relationships make sense | Qwen 2.5 72B | 1-3 retries per file |
| **Stage 5: Report Sections (×8)** | Writes each section of the report | Qwen 2.5 72B | 8 parallel calls per report |
| **Stage 6: NLQ Translation** | Translates questions to queries | Qwen 2.5 72B | Once per question |

### Estimated AI Costs (Groq Free Tier)
- **Free tier limits:** 30 requests/minute, 14,400 requests/day
- **Per pipeline:** ~5 AI calls (1 schema + 1 cleaning + 1-3 relationship + retry)
- **Per report:** 8 AI calls (8 sub-agents)
- **Per NLQ question:** 1 AI call
- **Cost:** $0 (free tier)
- **If you exceed free tier:** Groq charges ~$0.90 per million input tokens

## 9.3 Fallback Strategy (When AI is Unavailable)

```
Try Primary AI (Groq Qwen 2.5 72B)
    │
    ├─ Success → Return result
    │
    └─ Failed (timeout, rate limit, error)
        │
        │  Retry up to 3 times with exponential backoff:
        │  - Retry 1: wait 1 second
        │  - Retry 2: wait 2 seconds
        │  - Retry 3: wait 4 seconds
        │
        └─ All retries exhausted
            │
            ▼
        Try Fallback AI (Ollama Llama 3.1 8B — local)
            │
            ├─ Success → Return result
            │
            └─ Failed
                │
                ▼
            Use Deterministic Rules (code, no AI):
            - Stage 1: Rule-based type detection
            - Stage 2: Basic imputation (mean/median/mode)
            - Stage 3: Correlation-based relationships
            - Stage 5: Only Phase 1 (deterministic profiling)
```

## 9.4 AI Prompt Design

The system uses a **prompt registry** — all prompts are stored in the database and can be versioned.

### Example Prompt: Schema Inference

```python
{
    "name": "infer_schema",
    "version": 1,
    "stage": 1,
    "template": """You are a data schema expert. Analyze the following CSV sample and infer the schema for each column.

CSV Sample (first {sample_rows} rows):
{csv_sample}

For each column, determine:
1. column_name: The original column header
2. detected_type: One of [int, float, str, date, datetime, boolean, categorical, text, unknown]
3. format_spec: Format string if applicable (e.g., "%Y-%m-%d" for dates, "%H:%M:%S" for times)
4. confidence: A score from 0.0 to 1.0 indicating how confident you are
5. reasoning: A brief explanation of why you chose this type
6. nullable: Whether the column can contain null values
7. sample_values: Up to 5 sample values from the data

Return ONLY valid JSON matching this schema:
{{
  "columns": [
    {{
      "column_name": "string",
      "detected_type": "string",
      "format_spec": "string or null",
      "confidence": 0.0-1.0,
      "reasoning": "string",
      "nullable": true/false,
      "sample_values": ["value1", "value2"]
    }}
  ]
}}

Do NOT include any text before or after the JSON. Do NOT use markdown code blocks."""
}
```

### Prompt Variables

Prompts use template variables that get filled in at runtime:
- `{csv_sample}`: The actual CSV data (first 20 rows)
- `{sample_rows}`: Number of rows (20)
- `{quality_profile}`: Data quality report (for cleaning)
- `{relationships}`: Discovered relationships (for report)

---

# 10. AUTHENTICATION & SECURITY

## 10.1 How Authentication Works (Step-by-Step)

### Registration Flow
```
1. User fills registration form:
   - Email: john@example.com
   - Password: MySecure123!
   - Name: John Doe

2. Frontend sends POST to /api/v1/auth/register

3. Backend:
   a. Validates email format
   b. Validates password length (≥8 chars)
   c. Checks if email already exists
   d. Hashes password with bcrypt (12 rounds)
   e. Inserts into users table
   f. Returns user info (without password hash)

4. Frontend shows "Registration successful!" and redirects to login
```

### Login Flow
```
1. User fills login form:
   - Email: john@example.com
   - Password: MySecure123!

2. Frontend sends POST to /api/v1/auth/login

3. Backend:
   a. Looks up user by email in database
   b. If not found → return 401
   c. Verifies password hash with bcrypt
   d. If wrong password → return 401
   e. Creates access token (15 min expiry)
   f. Creates refresh token (7 days expiry)
   g. Returns tokens

4. Frontend stores tokens in localStorage:
   - localStorage.setItem("access_token", "eyJ...")
   - localStorage.setItem("refresh_token", "eyJ...")

5. Frontend redirects to dashboard
```

### Protected API Request Flow
```
1. User navigates to upload page

2. Frontend makes API call:
   GET /api/v1/pipeline/status/some-id
   Headers:
     Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

3. Backend:
   a. Extracts token from Authorization header
   b. Verifies token signature with JWT_SECRET
   c. Checks token expiration
   d. If valid → extracts user_id, email, role
   e. Checks if user role is allowed for this endpoint
   f. If authorized → process request
   g. If not authorized → return 403

4. If token is expired (401 response):
   a. Frontend catches 401 error
   b. Sends refresh token to POST /api/v1/auth/refresh
   c. Gets new access + refresh token pair
   d. Retries original request with new token
   e. If refresh also fails → redirect to login
```

## 10.2 Role-Based Access Control

| Endpoint | Admin | Analyst | Viewer |
|----------|-------|---------|--------|
| Login / Register | ✅ | ✅ | ✅ |
| Upload file | ✅ | ✅ | ❌ |
| Run pipeline | ✅ | ✅ | ❌ |
| Generate report | ✅ | ✅ | ❌ |
| View dashboard | ✅ | ✅ | ✅ |
| View reports | ✅ | ✅ | ✅ |
| Use NLQ | ✅ | ✅ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| System info | ✅ | ❌ | ❌ |

---

# 11. FRONTEND REQUIREMENTS

## 11.1 Page Structure

### Login Page (`/auth/login`)
- Email + Password form
- "Remember me" checkbox
- "Forgot password" link
- "Register" link

### Register Page (`/auth/register`)
- Email + Password + Name form
- Password strength indicator
- Terms of service checkbox

### Dashboard Page (`/dashboard`)
- Grid of widgets:
  - Recent pipelines
  - Data quality summary
  - Quick stats (total datasets, reports generated)
  - Charts from recent analyses

### Upload Page (`/upload`)
- Drag-and-drop file upload zone
- File validation (type, size)
- Progress bar during upload
- "Analyze" button after upload completes

### Pipeline Status Page (shown after upload)
- Real-time progress bars for each stage
- Stage-by-stage status updates via SSE
- "View Results" button when complete

### Report Page
- Report sections in scrollable view
- Confidence badges per section
- Export buttons (HTML, PDF, XLSX, Markdown)

### NLQ Page (`/nlq`)
- Chat interface
- Input box for questions
- Response with text + chart
- Conversation history

### Admin Page (`/admin`)
- User management table
- System health status
- Configuration settings

## 11.2 State Management (Zustand)

```typescript
// Store structure
interface AppState {
  // Auth
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email, password) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<void>;

  // Upload
  uploadSession: UploadSession | null;
  uploadProgress: number;
  initiateUpload: (file) => Promise<void>;
  uploadChunk: (chunk, index) => Promise<void>;
  completeUpload: () => Promise<void>;

  // Pipeline
  pipelineState: PipelineState | null;
  runPipeline: (uploadId) => Promise<void>;
  subscribeToEvents: (pipelineId) => void;

  // Reports
  reports: Report[];
  generateReport: (dataModelId) => Promise<void>;
  exportReport: (reportId, format) => Promise<void>;

  // NLQ
  conversation: ChatMessage[];
  sendQuery: (query) => Promise<void>;
}
```

## 11.3 API Client (Axios with Interceptors)

```typescript
// Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 30000,
});

// Request interceptor — attach JWT
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const newTokens = await refreshToken();
      if (newTokens) {
        // Retry original request
        error.config.headers.Authorization = `Bearer ${newTokens.access_token}`;
        return apiClient.request(error.config);
      }
      // Refresh failed → logout
      logout();
    }
    return Promise.reject(error);
  }
);
```

---

# 12. VISUALIZATION SYSTEM

## 12.1 Overview

The visualization system automatically generates charts and dashboards from the analyzed data. It has three layers:

```
Layer 1: AI Recommendations (Stage 3)
  → AI suggests chart types for each relationship
  
Layer 2: Vega-Lite Specifications (Stage 4)
  → System generates Vega-Lite JSON for each chart
  
Layer 3: Frontend Rendering (Next.js)
  → Plotly.js renders charts from Vega-Lite
```

## 12.2 Chart Types and When to Use Them

| Chart Type | When to Use | Example |
|-----------|-------------|---------|
| **Bar Chart** | Compare categories | Revenue by product, Sales by region |
| **Line Chart** | Show trends over time | Monthly sales trend, Temperature over year |
| **Scatter Plot** | Show relationship between two numbers | Age vs Income, Temperature vs Sales |
| **Heatmap** | Show matrix/correlation data | Correlation matrix, User activity by hour/day |
| **Box Plot** | Show distribution and outliers | Salary distribution by department |
| **Pie Chart** | Show proportions (max 6 categories) | Market share, Budget allocation |
| **Histogram** | Show frequency distribution | Age distribution, Order amounts |
| **Area Chart** | Show cumulative trends over time | Cumulative revenue, Growing user base |
| **Bubble Chart** | Show 3 dimensions | Revenue (size) by Region (x) and Category (y) |
| **Treemap** | Show hierarchy with sizes | Sales by category → subcategory |

## 12.3 How AI Chooses Chart Types

In Stage 3, the AI assigns a `chart_hint` to each relationship:

```json
{
  "source_column": "Temperature",
  "target_column": "Ice_Cream_Sales",
  "relationship_type": "one-to-many",
  "confidence": 0.92,
  "chart_hint": "scatter",
  "description": "Higher temperatures correlate with increased ice cream sales"
}
```

The AI uses these rules:
- **Number ↔ Number:** Scatter plot (relationship), Line chart (trend)
- **Category ↔ Number:** Bar chart (comparison), Box plot (distribution)
- **Category ↔ Category:** Heatmap (cross-tabulation), Pie chart (proportions)
- **Date ↔ Number:** Line chart (trend), Area chart (cumulative)
- **Date ↔ Category:** Heatmap (time series)

## 12.4 Vega-Lite Specification Generation

In Stage 4, the system generates Vega-Lite specifications:

### Bar Chart Example
```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "Revenue by Product Category",
  "data": {"values": [{"Category": "Electronics", "Revenue": 150000}, ...]},
  "mark": "bar",
  "encoding": {
    "x": {"field": "Category", "type": "nominal", "title": "Category"},
    "y": {"field": "Revenue", "type": "quantitative", "title": "Revenue ($)"},
    "color": {"field": "Category", "type": "nominal"},
    "tooltip": [
      {"field": "Category", "type": "nominal"},
      {"field": "Revenue", "type": "quantitative", "format": "$,.0f"}
    ]
  },
  "config": {"view": {"stroke": "transparent"}}
}
```

### Scatter Plot Example
```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "title": "Temperature vs Ice Cream Sales",
  "data": {"url": "/api/v1/data/scatter/rel-123"},
  "mark": "circle",
  "encoding": {
    "x": {"field": "Temperature", "type": "quantitative", "title": "Temperature (°F)"},
    "y": {"field": "Ice_Cream_Sales", "type": "quantitative", "title": "Sales ($)"},
    "size": {"field": "Population", "type": "quantitative", "title": "Population"},
    "color": {"field": "Region", "type": "nominal", "title": "Region"},
    "tooltip": [
      {"field": "Temperature", "type": "quantitative", "format": ".1f"},
      {"field": "Ice_Cream_Sales", "type": "quantitative", "format": "$,.0f"},
      {"field": "Region", "type": "nominal"}
    ]
  }
}
```

## 12.5 Dashboard Layout Generation

The AI generates a recommended layout:

```json
{
  "recommended_dashboard_layout": {
    "title": "Sales Analytics Dashboard",
    "columns": 2,
    "rows": [
      {
        "row_index": 0,
        "charts": [
          {
            "chart_id": "chart-1",
            "type": "bar",
            "title": "Revenue by Product",
            "relationship_id": "rel-001",
            "span": 1
          },
          {
            "chart_id": "chart-2",
            "type": "line",
            "title": "Monthly Sales Trend",
            "relationship_id": "rel-002",
            "span": 1
          }
        ]
      },
      {
        "row_index": 1,
        "charts": [
          {
            "chart_id": "chart-3",
            "type": "scatter",
            "title": "Price vs Demand",
            "relationship_id": "rel-003",
            "span": 2
          }
        ]
      }
    ]
  }
}
```

## 12.6 Frontend Chart Rendering (React Component)

```tsx
// components/ChartWidget.tsx
import { useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';

interface ChartWidgetProps {
  vegaLiteSpec: any;
  title: string;
  loading?: boolean;
}

export function ChartWidget({ vegaLiteSpec, title, loading }: ChartWidgetProps) {
  if (loading) {
    return <div className="animate-pulse h-64 bg-gray-200 rounded" />;
  }

  // Convert Vega-Lite to Plotly format
  const plotlyData = convertVegaLiteToPlotly(vegaLiteSpec);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <Plot
        data={plotlyData.data}
        layout={{
          ...plotlyData.layout,
          autosize: true,
          margin: { t: 30, b: 50, l: 50, r: 30 },
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
        }}
        style={{ width: '100%', height: 300 }}
      />
    </div>
  );
}
```

## 12.7 Interactive Filtering

Users can filter dashboard data:

```tsx
// components/FilterBar.tsx
interface FilterBarProps {
  filters: Filter[];
  onChange: (filters: Filter[]) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-4 mb-6">
      {filters.map(filter => (
        <div key={filter.id} className="flex flex-col">
          <label className="text-sm text-gray-600">{filter.label}</label>
          {filter.type === 'date_range' && (
            <DateRangePicker
              startDate={filter.value?.start}
              endDate={filter.value?.end}
              onChange={dates => onChangeFilter(filter.id, dates)}
            />
          )}
          {filter.type === 'dropdown' && (
            <select
              value={filter.value}
              onChange={e => onChangeFilter(filter.id, e.target.value)}
              className="border rounded px-3 py-2"
            >
              {filter.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}
        </div>
      ))}
    </div>
  );
}
```

## 12.8 Visualization Ideas for Different Data Types

### For Sales/E-commerce Data
1. **Revenue Trend** — Line chart showing monthly revenue over time
2. **Product Performance** — Bar chart comparing product revenues
3. **Customer Segments** — Pie chart showing customer distribution by segment
4. **Geographic Sales** — Heatmap of sales by region
5. **Price Elasticity** — Scatter plot of price vs demand
6. **Funnel Analysis** — Funnel chart (visitors → cart → purchase)

### For Healthcare Data
1. **Patient Demographics** — Bar chart of age groups, gender distribution
2. **Treatment Outcomes** — Box plot of recovery times by treatment
3. **Correlation Analysis** — Heatmap of symptoms vs diagnoses
4. **Trend Over Time** — Line chart of patient admissions per month
5. **Risk Factors** — Bubble chart of risk factor severity vs frequency

### For Financial Data
1. **Portfolio Performance** — Area chart of cumulative returns
2. **Asset Allocation** — Treemap of portfolio by asset class
3. **Risk-Return** — Scatter plot of risk vs return for each asset
4. **Market Trends** — Line chart of benchmark indices
5. **Distribution Analysis** — Histogram of daily returns

### For HR/Employee Data
1. **Headcount Trends** — Line chart of employee count over time
2. **Department Distribution** — Bar chart of employees by department
3. **Salary Analysis** — Box plot of salary by department/role
4. **Turnover Analysis** — Bar chart of departures by reason
5. **Performance Distribution** — Histogram of performance scores

---

# 13. DEPLOYMENT ARCHITECTURE

## 13.1 Docker Compose (Development)

```yaml
# docker-compose.yml
services:
  api:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - .:/app
    environment:
      DATABASE_URL: postgresql://autoinsight:changeme@postgres:5432/autoinsight
      REDIS_URL: redis://redis:6379/0
      GROQ_API_KEY: ${GROQ_API_KEY}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      minio:
        condition: service_healthy

  worker:
    build: .
    command: celery -A backend.tasks worker --loglevel=info --concurrency=4
    environment:
      DATABASE_URL: postgresql://autoinsight:changeme@postgres:5432/autoinsight
      REDIS_URL: redis://redis:6379/0
      CELERY_BROKER_URL: redis://redis:6379/1
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: autoinsight
      POSTGRES_USER: autoinsight
      POSTGRES_PASSWORD: changeme
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U autoinsight"]

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  minio:
    image: minio/minio:latest
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

## 13.2 Running the Application

```bash
# 1. Clone the repository
git clone https://github.com/vk9199kadam-hue/gen-ai.git
cd gen-ai/source-code

# 2. Create .env file
cp .env.template .env
# Edit .env and add your GROQ_API_KEY

# 3. Start all services
docker-compose up -d --build

# 4. Run database migrations
docker-compose exec api python scripts/migrate.py --seed

# 5. Access the application
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
# MinIO Console: http://localhost:9001 (minioadmin/minioadmin)
# PostgreSQL: localhost:5432 (autoinsight/changeme)

# 6. Start frontend (in another terminal)
cd autoinsight-ai/frontend
npm install
npm run dev
# Frontend: http://localhost:3000
```

## 13.3 Kubernetes Deployment (Production)

The `k8s/manifest.yaml` file includes:
- Namespace: `autoinsight`
- ConfigMap + Secret for environment variables
- API Deployment (2 replicas, autoscaling)
- Worker Deployment (2 replicas)
- PostgreSQL StatefulSet (persistent storage)
- Redis StatefulSet
- MinIO StatefulSet
- Frontend Deployment (Next.js)
- Nginx Ingress
- Horizontal Pod Autoscaler

Apply with:
```bash
kubectl apply -f k8s/manifest.yaml
```

---

# 14. TESTING STRATEGY

## 14.1 Test Types

| Test Type | What it Tests | Where | Tool |
|-----------|--------------|-------|------|
| **Unit Tests** | Individual functions | `tests/test_*.py` | pytest |
| **Integration Tests** | Pipeline end-to-end | `tests/test_pipeline_orchestrator.py` | pytest |
| **API Tests** | REST endpoints | `tests/` | pytest + httpx |
| **E2E Tests** | Full user workflows | `frontend/tests/e2e/` | Playwright |
| **Load Tests** | Performance under load | `tests/load/` | Locust |

## 14.2 Running Tests

```bash
# Backend unit + integration tests
cd source-code
pytest tests/ -v --cov=backend --cov-report=html

# Backend load testing
locust -f tests/load/locustfile.py --host=http://localhost:8000

# Frontend E2E tests
cd autoinsight-ai/frontend
npx playwright test

# Frontend type checking
npm run typecheck

# Frontend linting
npm run lint
```

## 14.3 Test Coverage Targets

| Module | Target | Current |
|--------|--------|---------|
| `auth.py` | 90% | ~90% |
| `schemas.py` | 100% | ~100% |
| `tools.py` | 90% | ~90% |
| `pipeline/orchestrator.py` | 80% | ~80% |
| `report/` | 80% | ~80% |
| `api.py` | 70% | ~60% |

---

# 15. PHASE 3 INTEGRATION PLAN

## 15.1 What's Left to Complete the Project

### Task 1: Connect the LLM (Priority: HIGH — 1 hour)

**Step 1:** Get Groq API Key
```
1. Go to https://console.groq.com/
2. Sign up (free)
3. Navigate to API Keys
4. Click "Create API Key"
5. Copy the key (gsk_xxxx...)
```

**Step 2:** Add to .env file
```bash
# Open source-code/.env
GROQ_API_KEY=gsk_your_actual_key_here
```

**Step 3:** (Optional) Install Ollama for fallback
```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Download from https://ollama.ai

# Pull the model
ollama pull llama3.1:8b
```

**Step 4:** Test the connection
```bash
# Start the backend
cd source-code
uvicorn backend.api:app --reload

# Go to http://localhost:8000/docs
# Try POST /api/v1/upload/initiate with a test CSV
# Then POST /api/v1/pipeline/run
# Watch the pipeline execute with AI!
```

### Task 2: Set Up the Database (Priority: HIGH — 2 hours)

**Option A: Local PostgreSQL with Docker (Recommended for Development)**
```bash
# Docker Compose already includes PostgreSQL
docker-compose up -d postgres

# Run migrations
docker-compose exec api python scripts/migrate.py --seed

# Verify
docker-compose exec postgres psql -U autoinsight -d autoinsight -c "\dt"
# Should show 9 tables
```

**Option B: Cloud PostgreSQL (Recommended for Production)**

1. **Using Supabase (Easiest):**
   ```
   1. Go to https://supabase.com/
   2. Create new project (free tier)
   3. Go to Settings → Database
   4. Copy connection string
   5. Update .env:
      DATABASE_URL=postgresql://postgres.XXXXX:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   6. Run migrations:
      python scripts/migrate.py --seed
   ```

2. **Using Neon (Serverless):**
   ```
   1. Go to https://neon.tech/
   2. Create new project (free tier)
   3. Copy connection string
   4. Update .env:
      DATABASE_URL=postgresql://autoinsight:PASSWORD@ep-XXXXX.us-east-2.aws.neon.tech/autoinsight?sslmode=require
   5. Run migrations
   ```

### Task 3: Fix Login & Registration (Priority: HIGH — 3 hours)

The login endpoint currently uses hardcoded password check. Fix it:

**Step 1:** Update `backend/api.py` login endpoint

```python
@api_v1.post("/auth/login", tags=["Authentication"])
async def login(request: LoginRequest):
    from backend.database import fetch_one
    from backend.auth import verify_password, create_tokens
    
    # Look up user in database
    user = await fetch_one("users", {"email": request.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create tokens
    tokens = create_tokens(
        user_id=str(user["id"]),
        email=user["email"],
        role=user["role"],
    )
    
    return {"status": "success", "data": tokens, ...}
```

**Step 2:** Update `backend/api.py` register endpoint

```python
@api_v1.post("/auth/register", tags=["Authentication"])
async def register(request: UserCreate):
    from backend.database import insert_one
    from backend.auth import hash_password
    
    # Check if email already exists
    existing = await fetch_one("users", {"email": request.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    password_hash = hash_password(request.password)
    
    # Insert into database
    user = await insert_one("users", {
        "email": request.email,
        "password_hash": password_hash,
        "name": request.name,
        "role": request.role.value,
    }, returning="*")
    
    return {"status": "success", "data": user, ...}
```

### Task 4: Implement NLQ (Priority: MEDIUM — 4 hours)

**Step 1:** Create NLQ prompt template in prompt registry

**Step 2:** Implement `backend/nlq/chat.py`

```python
async def process_nlq_query(
    query: str,
    unified_data_model: UnifiedDataModel,
    conversation_history: List[Dict] = None,
) -> NLQResponse:
    llm = LLMFactory(provider="groq")
    
    # AI translates NLQ to metrics
    response = await llm.invoke_agent(
        system_prompt="You are a data query expert. Translate natural language queries into data operations.",
        user_prompt=get_prompt_template("nlq_query"),
        output_model=NLQOperation,
        variables={
            "query": query,
            "schema": unified_data_model.model_dump_json(),
        },
    )
    
    # Execute the operation on the UDM
    results = execute_operation(response, unified_data_model)
    
    # Generate chart config
    chart_config = generate_chart_config(results)
    
    return NLQResponse(
        natural_language_response=response.explanation,
        chart_config=chart_config,
        results=results,
        confidence=response.confidence,
    )
```

### Task 5: Implement Dashboard (Priority: MEDIUM — 4 hours)

**Step 1:** Update `backend/nlq/dashboard.py` to generate actual dashboard

**Step 2:** Create `frontend/src/components/DashboardGrid.tsx` to render charts

**Step 3:** Wire up API endpoint `/api/v1/dashboard/{id}`

### Task 6: Add Visualization Enhancements (Priority: LOW — 6 hours)

See Section 12 for complete visualization design.

**Key enhancements:**
1. Add more chart types (funnel, waterfall, sankey)
2. Add interactive filtering (date range, category dropdown)
3. Add chart customization (colors, labels, axes)
4. Add export to PNG/SVG
5. Add real-time data updates

## 15.2 Implementation Timeline

| Week | Tasks | Deliverable |
|------|-------|-------------|
| **Week 1** | LLM setup, Database setup, Fix auth | System can run full pipeline with AI |
| **Week 2** | Implement NLQ, Fix dashboard | Users can ask questions and see dashboards |
| **Week 3** | Visualization enhancements, Testing | Production-ready system |
| **Week 4** | Documentation, Deployment | Deployed to production |

---

# 16. GLOSSARY

| Term | Simple Definition |
|------|------------------|
| **Agentic AI** | AI that acts autonomously — makes decisions, takes actions, retries on failure |
| **API** | Application Programming Interface — how different software systems talk to each other |
| **Async** | Asynchronous — doing multiple things at the same time without waiting |
| **Bcrypt** | A secure way to hash passwords so they can't be reversed |
| **Cache** | Temporary storage to speed up access to frequently used data |
| **Container** | A packaged unit of software that includes everything needed to run (code, libraries, settings) |
| **Correlation** | A statistical measure of how two things relate (e.g., temperature and ice cream sales) |
| **DataFrame** | A table of data with rows and columns (like an Excel spreadsheet in code) |
| **Docker** | A tool that packages applications in containers so they run the same everywhere |
| **Encoding** | How text characters are represented in bytes (UTF-8, Latin-1, etc.) |
| **Endpoint** | A specific URL that an API exposes (e.g., /api/v1/upload) |
| **Environment Variable** | A setting stored in the operating system that an application reads |
| **Hash** | A one-way transformation of data (used for passwords, file identification) |
| **JWT** | A secure way to pass user identity between frontend and backend |
| **LangGraph** | A framework for building AI workflows with multiple steps |
| **LLM** | Large Language Model — an AI that understands and generates text |
| **Middleware** | Code that runs between the request and the endpoint (for logging, auth, etc.) |
| **Migration** | A script that creates or modifies database tables |
| **NLQ** | Natural Language Query — asking data questions in plain English |
| **ORM** | Object-Relational Mapping — a way to interact with databases using code objects |
| **Parquet** | An efficient file format for storing tabular data |
| **Polars** | A fast data processing library for Python (like pandas but 10x faster) |
| **Pydantic** | A Python library that validates data against a defined schema |
| **RBAC** | Role-Based Access Control — different users get different permissions |
| **Redis** | A fast in-memory database used for caching and task queues |
| **S3** | Amazon's cloud file storage service |
| **SSE** | Server-Sent Events — a way for the server to push updates to the browser in real-time |
| **UDM** | Unified Data Model — the final enriched data structure after all pipeline stages |
| **Vega-Lite** | A grammar of interactive graphics — describes charts using JSON |

---

*END OF SRS DOCUMENT*

**Document Status:** Complete  
**Next Steps:** Follow Phase 3 Integration Plan (Section 15) to complete the project  
**Contact:** Refer to INFRASTRUCTURE_REPORT.md for deployment and infrastructure details
