# MASTER PROJECT PLANNING REPORT
# AutoInsight AI — Agentic Data Analysis & Report Generation System
**Date:** June 1, 2026 | **Version:** 1.0 | **Status:** Design Complete - Ready for Implementation

---

## TABLE OF CONTENTS
1. [PROJECT OVERVIEW](#1-project-overview)
2. [COMPLETE PROJECT FILE STRUCTURE](#2-complete-project-file-structure)
3. [FIVE-LAYER SYSTEM ARCHITECTURE](#3-five-layer-system-architecture)
4. [COMPLETE AI AGENT FLOWS](#4-complete-ai-agent-flows)
5. [4-STAGE DATA PIPELINE WORKFLOW](#5-4-stage-data-pipeline-workflow)
6. [4-PHASE REPORT GENERATION ENGINE](#6-4-phase-report-generation-engine)
7. [NLQ CHAT & DASHBOARD INTERACTION FLOW](#7-nlq-chat--dashboard-interaction-flow)
8. [TOOL CALLING MECHANISM](#8-tool-calling-mechanism)
9. [SAFETY & VALIDATION ARCHITECTURE](#9-safety--validation-architecture)
10. [FAULT TOLERANCE & FALLBACK SYSTEM](#10-fault-tolerance--fallback-system)
11. [END-TO-END EXECUTION TIMELINE](#11-end-to-end-execution-timeline)
12. [TECHNICAL STACK DETAILS](#12-technical-stack-details)
13. [COMPLETE API REFERENCE](#13-complete-api-reference)
14. [DATABASE SCHEMA DESIGN](#14-database-schema-design)
15. [FRONTEND ARCHITECTURE](#15-frontend-architecture)
16. [DEPLOYMENT ARCHITECTURE](#16-deployment-architecture)
17. [PHASED IMPLEMENTATION PLAN](#17-phased-implementation-plan)
18. [DETAILED WEEK-BY-WEEK SCHEDULE](#18-detailed-week-by-week-schedule)
19. [DEVELOPMENT TEAM ROLES](#19-development-team-roles)
20. [TESTING STRATEGY](#20-testing-strategy)
21. [SECURITY & COMPLIANCE](#21-security--compliance)
22. [COST ANALYSIS & BUDGET](#22-cost-analysis--budget)
23. [RISK MANAGEMENT](#23-risk-management)
24. [QUALITY ASSURANCE PLAN](#24-quality-assurance-plan)
25. [SRS COMPLIANCE MATRIX](#25-srs-compliance-matrix)
26. [FUTURE ROADMAP](#26-future-roadmap)

---

## 1. PROJECT OVERVIEW

### 1.1 Project Identity
| Attribute | Value |
|-----------|-------|
| **Project Name** | AutoInsight AI |
| **Type** | Agentic AI-Powered Data Analysis & Report Generation Platform |
| **Architecture** | LangGraph + Structured LLM + Tool-Calling |
| **Base Location** | D:\mvk dataanalysis project\ai agent |
| **Primary LLM** | Qwen 2.5 72B (Groq Free Tier) |
| **Fallback LLM** | Llama 3.1 8B (Ollama Local) |
| **Data Stack** | Polars + DuckDB + DataPrep |
| **Validation** | Pydantic v2 Strict Mode |

### 1.2 Core Vision
Create an autonomous AI agent that ingests raw CSV data, automatically understands its structure, cleans it, discovers hidden relationships, engineers meaningful features, and generates professional analytical reports - all with minimal human intervention.

### 1.3 Key Differentiators
- **Zero-Cost LLM Operation:** Groq Free Tier + Ollama local = $0 LLM costs
- **Deterministic-First Design:** LLM only used where reasoning adds value
- **Agentic Orchestration:** LangGraph enables complex multi-step reasoning
- **Confidence Gating:** All AI outputs scored; low-confidence auto-rejected
- **Structured Output Safety:** Pydantic v2 enforces strict JSON schemas preventing hallucination
- **Parallel Processing:** 8 concurrent report sub-agents for fast generation

### 1.4 Target Users & Personas
| Persona | Role | Key Needs |
|---------|------|-----------|
| **Data Analyst** | Uploads data, runs pipelines, configures analysis | Speed, accuracy, customization |
| **Business User** | Views dashboards, asks NLQ questions | Simplicity, visual clarity, insights |
| **Administrator** | Manages users, roles, system config | Control, audit, security |
| **Executive** | Views summary reports and KPIs | High-level insights, export options |

---

## 2. COMPLETE PROJECT FILE STRUCTURE

```
D:\mvk dataanalysis project\
+--- ai agent\                                  # MAIN PROJECT
|   +--- 1. COMPLETE SYSTEM ARCHITECTURE.txt     # System architecture
|   +--- 2. 4-STAGE DATA PIPELINE WORKFLOW.txt  # Pipeline design
|   +--- 3. AGENTIC AI REPORT GENERATION.txt    # Report engine design
|   +--- 4. TECHNICAL STACK & IMPLEMENTATION.csv # Tech stack details
|   +--- 5. SRS v1.0 COMPLIANCE MAPPING.csv     # Requirements mapping
|   +--- 6. DEPLOYMENT & INTEGRATION GUIDE.sh   # Deployment instructions
|   +--- 7. FUTURE ROADMAP.csv                  # Future feature plan
|   +--- Frontend Integration .js               # Frontend API example
|   +--- Qwen__20260601_ij2vdkp6e.txt           # LLM architecture diagram
|   +--- [Unicode] Architecture Explanation.csv # Architecture deep-dive
|   +--- [Unicode] Report Engine Explanationf.csv # Report engine deep-dive
|   +--- [Unicode] Stage-by-Stage Breakdown.csv # Pipeline breakdown
|   |
|   +--- Aligned with SRS v1.0 Sections...\      # DETAILED SUB-SPECS
|       +--- high level ai agent arciteccher.txt      # Agent architecture
|       +--- 1CSV to JSON (AI Schema Inference).csv   # Stage 1 spec
|       +--- 2AI Data Cleaning.csv                    # Stage 2 spec
|       +--- 3CORE AGENTIC AGENT.txt                  # Core agent logic
|       +--- AI Agent Internal Logic (Reason).txt     # LLM reasoning
|       +--- AI Agent Safety & Validation.csv         # Safety architecture
|       +--- AITool AI Loop.txt                       # Tool calling loop
|       +--- CONTINUOUS AI NLQ CHAT.csv               # NLQ chat design
|       +--- EndtoEnd AI Agent Execution Timeline.txt # Execution timeline
|       +--- Fallback & Fault Tolerance.txt           # Fault tolerance
|       +--- Parallel Execution Flow.txt              # Parallel execution
|       +--- SRS Compliance Mapping Summary.csv       # Compliance summary
|       +--- STAGE 4 AUTOMATED REPORT ENGINE.csv      # Report engine spec
|       +--- Tool Calling Mechanism.xlsx              # Tool calling spec
|
+--- csv to jeson .txt                         # Polars library reference
+--- cleaning .txt                             # DataPrep library reference
+--- relationship and dataset.txt              # AI relationship logic
+--- MVK_AI_AGENT_SRS_v1.0.md                 # SRS Document (generated)
+--- MVK_AI_AGENT_DEVELOPMENT_REPORT.md       # Development Report (generated)
+--- PERFECT_PROJECT_PLANNING_REPORT.md       # THIS FILE (generated)
```

---

## 3. FIVE-LAYER SYSTEM ARCHITECTURE

### 3.1 Architecture Layers

**LAYER 1: PRESENTATION LAYER (SRS 3.2)**
- Technology: React/Next.js 14+ PWA + Plotly.js + Vega-Lite + Tailwind CSS
- Components: Upload UI, Dashboard View, AI Chat (NLQ), Reports Viewer, Admin Panel
- Communication: HTTPS/REST + SSE (real-time streaming)

**LAYER 2: API GATEWAY LAYER (SRS 3.3)**
- Technology: FastAPI (Python 3.11+) + JWT Auth + RBAC + Uvicorn
- Modules: Auth, Ingestion, Cleaning, Analysis, Dashboard, Report

**LAYER 3a: AI ORCHESTRATION**
- Technology: LangGraph + LangChain
- Agents: 4-Stage Pipeline Agent, 4-Phase Report Agent, Relationship & Column Agent
- Tool Calling: SQL queries, statistical analysis, code execution

**LAYER 3b: DATA PROCESSING ENGINE**
- Technology: Polars + DuckDB + DataPrep
- Capabilities: CSV parsing, JSON conversion, Parquet storage, ML (K-Means)

**LAYER 4a: LLM ENGINE (SRS 6.1.1)**
- Primary: Qwen 2.5 72B (Groq Free Tier)
- Fallback: Llama 3.1 8B (Ollama Local)
- Mode: Structured JSON, Temperature=0.1, Pydantic validation

**LAYER 4b: STORAGE LAYER**
- PostgreSQL 15+: Metadata, users, reports index
- Redis 7+: Cache, session storage, Celery queue
- AWS S3 / MinIO: File storage (CSV, Parquet, exports)
- Celery: Async job processing

### 3.2 Architecture Data Flow
```
User Browser -> Next.js PWA -> FastAPI API Gateway -> LangGraph AI Agents
                                                    |              |
                                                    v              v
                                             LLM Engine    Data Processing
                                             (Qwen/Llama)  (Polars/DuckDB)
                                                    |              |
                                                    v              v
                                             Storage Layer (PostgreSQL + Redis + S3)
```

---

## 4. COMPLETE AI AGENT FLOWS

### 4.1 HIGH-LEVEL AGENT FLOW
```
[User Uploads CSV]
       |
       v
[Stage 1: CSV -> JSON (AI Schema Inference)]
       |
[Stage 2: Data Cleaning (AI Plan + User Approval)]
       |
[Stage 3: Core Agentic Agent (LangGraph Workflow)]
       |--- profile_step (Deterministic, ~0.5s)
       |--- discover_step (Deterministic, ~1.2s)
       |--- reason_step (LLM-Powered, ~3.8s)
       |--- VALIDATION GATE (Pydantic + Confidence >= 0.65)
       |--- executor_step (Deterministic, ~1.1s)
       |
+------+------+
|             |
v             v
[Stage 4a: Report Engine]   [Stage 4b: NLQ Chat + Dashboard]
(8 Parallel Sub-Agents)      (AI -> SQL -> Chart)
|             |
+------+------+
       |
       v
[FINAL OUTPUTS: Enriched Dataset + Dashboard + Report + Exports]
```

### 4.2 STAGE 1: CSV -> JSON (AI Schema Inference)
- **Input:** Raw CSV file
- **Process:**
  1. chardet encoding detection
  2. Polars CSV parser reads first 100 rows
  3. LLM called with infer_schema_prompt
  4. LLM returns: {column, type, format, confidence, reasoning}
  5. Pydantic validates SchemaInferenceResponse
  6. Confidence < 0.70 flagged for manual review
- **Output:** Structured JSON + schema.json
- **Cache:** Redis
- **SRS:** 4.2.3-4.2.6, 6.2.1

### 4.3 STAGE 2: DATA CLEANING (AI Cleaning Plan)
- **Input:** Clean JSON from Stage 1
- **Process:**
  1. DataPrep computes quality profile (missing %, outliers, duplicates, type mismatches)
  2. Statistical engine: IQR, Z-score, Levenshtein distance
  3. LLM generates cleaning plan: imputation, outlier treatment, dedup, PII masking
  4. Each suggestion includes confidence score (0.0-1.0)
  5. User views diff preview (Accept/Reject/Modify)
  6. Transformations applied via Polars/DataPrep
  7. Parquet snapshot + version history
- **Output:** Cleaned Parquet + Audit Log
- **Storage:** S3 + PostgreSQL index
- **SRS:** 4.3.1-4.3.8, 5.2.1
- **Fallback:** LLM fails -> Rule-based imputation (mean/median/mode)

### 4.4 STAGE 3: CORE AGENTIC AGENT (Heart of System)

**NODE 1: profile_step (Deterministic - No LLM)**
- Extract schema metadata (column names, types)
- Compute cardinality, null rates, unique counts
- Detect data distributions
- Compute basic Pearson correlations
- Tools: Polars + SciPy + NumPy | Time: ~0.5s

**NODE 2: discover_step (Deterministic - No LLM)**
- Compute value overlap between column pairs
- Compute Pearson/Spearman correlation coefficients
- Filter candidates: overlap > 0.3 OR |r| > 0.5
- Generate candidate relationship pool
- Tools: Polars + SciPy | Time: ~1.2s

**NODE 3: reason_step (AI AGENT - LLM Powered)**
- LLM Prompt: 'You are an Expert Data Model Architect...'
- LLM validates & filters relationships (confidence >= 0.65)
- Assigns: relationship_type, ai_reasoning, analytical_purpose, chart_hint
- Generates 3-5 derived columns with exact Polars formulas
- Output: Structured JSON matching UnifiedDataModel Pydantic schema
- Time: ~3.8s (Qwen)

**VALIDATION GATE: Pydantic + Confidence Check**
- PASS: Validated + confidence >= 0.65 -> NODE 4
- RETRY: Max 3 attempts (exponential backoff 1s, 2s, 4s)
- FALLBACK: All exhausted -> Deterministic rule engine activates
- User banner: 'AI temporarily unavailable - using verified rule-based engine'

**NODE 4: executor_step (Deterministic)**
- Safely eval() Polars formulas from derived_columns
- Materialize new columns into DataFrame
- Validate output data types against schema
- Record transformation_audit trail
- Tools: Polars + Pydantic | Time: ~1.1s

**OUTPUT: UnifiedDataModel**
- relationships: [{source, target, type, confidence, chart_hint}]
- derived_columns: [{name, expression, type, description}]
- final_viz_schema: {charts, layouts}
- transformation_audit: [{step, timestamp, status}]

---

## 5. 4-STAGE DATA PIPELINE WORKFLOW

### 5.1 Pipeline Overview
[CSV Upload] -> [Stage 1: CSV to JSON] -> [Stage 2: Data Clean] -> [Stage 3: Core Agent] -> [Stage 4: Reports]

### 5.2 Stage Details
| Stage | Input | Process | Output | LLM? |
|-------|-------|---------|--------|------|
| 1: CSV->JSON | Raw CSV | Polars parse + LLM schema inference | Structured JSON + schema.json | Yes |
| 2: Data Clean | JSON | DataPrep profile + LLM cleaning plan | Cleaned Parquet + Audit Log | Yes |
| 3: Core Agent | Parquet | LangGraph workflow (4 nodes) | UnifiedDataModel | Yes (node 3) |
| 4: Reports | UnifiedDataModel | 8 parallel agents + validation + export | PDF/HTML/Excel/Dashboard | Yes |

---

## 6. 4-PHASE REPORT GENERATION ENGINE

### 6.1 Phase 1: Deterministic Profiling (Zero LLM - $0)
- extract_schema_metadata() -> Column names, types, stats
- compute_univariate_stats() -> Mean, median, std, IQR, skew
- compute_bivariate_matrix() -> Pairwise correlation matrix
- detect_trends_seasonality() -> Time series patterns
- infer_domain_context() -> Dataset domain classification
- Output: DataProfile object (pure computation, no LLM)

### 6.2 Phase 2: 8 Parallel Sub-Agents
| # | Sub-Agent | Focus |
|---|-----------|-------|
| 1 | Business Understanding | Domain inference, KPI mapping, stakeholder simulation |
| 2 | Data Collection | Source metadata, format specs, data dictionary |
| 3 | Cleaning & Analysis | Quality metrics, transformation impact |
| 4 | EDA | Univariate/bivariate/multivariate patterns |
| 5 | Statistical Analysis | Hypothesis testing, regression, significance |
| 6 | Dashboard & Visualization | KPI layout, chart specs, filter architecture |
| 7 | Insights | Pattern detection, anomaly flagging, business impact |
| 8 | Recommendations | Priority scoring, implementation roadmap |

ALL 8 RUN IN PARALLEL | Time: ~4.2s
Each returns: {report_type, sections[], overall_confidence, generation_timestamp}

### 6.3 Phase 3: Validation & Confidence Gating
| Confidence Range | Action | User Badge |
|-----------------|--------|------------|
| 0.90 - 1.00 | Auto-apply (if enabled) | Green - No friction |
| 0.70 - 0.89 | Manual approval required | Yellow - Explicit click |
| 0.50 - 0.69 | Review + override mandatory | Orange - Warning tooltip |
| < 0.50 | Advisory only, human review | Red - Hidden from auto-mode |

- Pydantic validation per report section
- Retry loop on validation failure (max 3 attempts)
- Fallback: Deterministic rule-based summary

### 6.4 Phase 4: Assembly & Export Hooks
- Merge 8 sub-agent reports into ReportBundle JSON
- Attach: audit_trail, export_metadata, viz_payload_ready
- Export Engines:
  - PDF: Puppeteer (HTML -> PDF conversion)
  - HTML: Jinja2 (Template -> HTML)
  - Markdown: Jinja2 (Template -> .md)
  - Excel: OpenPyXL (Data -> .xlsx workbook)
- Store in S3 + index in PostgreSQL reports table
- Return report URL + metadata to frontend

---

## 7. NLQ CHAT & DASHBOARD INTERACTION FLOW

### 7.1 NLQ Chat Flow
1. User types: 'Show revenue by region last quarter'
2. LLM parses intent -> extracts metrics, dimensions, filters
3. Guardrail: Validate against dataset schema
4. Tool Call: run_sql_query(sql) in DuckDB sandbox (read-only, parameterized, 5s timeout)
5. LLM formats result + generates insight + chart config (Vega-Lite/Plotly)
6. 20-turn conversation context maintained in Redis (compressed for efficiency)
7. 'Show Reasoning' toggle exposes full prompt/response log
8. Output: Rendered chart in UI + audit trail log

### 7.2 Dashboard Auto-Layout Flow
- Input: UnifiedDataModel.relationships + final_viz_schema
- For each relationship with chart_hint:
  1. Select chart type (bar, line, scatter, heatmap, etc.)
  2. Configure axes + color mapping + tooltips
  3. Auto-layout grid (optimal arrangement)
- Apply responsive breakpoints for screen sizes
- Tools: Plotly.js + Vega-Lite
- Supports drill-down + filtering + export to report

---

## 8. TOOL CALLING MECHANISM

### 8.1 AI Agent Tool Loop
User/Stage triggers agent -> Agent profiles data (deterministic) -> Agent computes correlations (deterministic) -> Agent sends to LLM -> LLM returns structured JSON -> Pydantic validates -> Confidence gate filters -> Executor materializes -> Returns to frontend

### 8.2 Available Tools
| Tool Function | Purpose | Type | Parameters |
|---------------|---------|------|------------|
| run_sql_query | Execute SQL against DuckDB | Data Access | sql: str, timeout: int=5 |
| get_column_statistics | Statistical analysis of columns | Analytics | col_name: str, stats: List[str] |
| execute_polars | Run Polars expressions | Computation | expression: str, safe: bool=True |
| generate_chart | Create visualization | Viz | chart_type: str, config: dict |
| profile_data | Generate data profile | Profiling | df: DataFrame |
| correlation_analysis | Compute correlations | Analytics | method: str, columns: List[str] |
| detect_outliers | Find statistical outliers | Analytics | column: str, method: str='iqr' |
| clean_column | Apply cleaning operation | Transformation | col: str, strategy: str, params: dict |

---

## 9. SAFETY & VALIDATION ARCHITECTURE

**LAYER 1: INPUT VALIDATION**
- File type validation (CSV only)
- File size limits (100MB free, configurable)
- Encoding detection (chardet)

**LAYER 2: LLM OUTPUT VALIDATION**
- Pydantic structured output (with_structured_output)
- Schema enforcement per data type
- JSON mode forces valid JSON structure

**LAYER 3: CONFIDENCE GATING**
- 4-level confidence matrix (0.90-1.00: Auto, 0.70-0.89: Manual, 0.50-0.69: Override, <0.50: Advisory)

**LAYER 4: HALLUCINATION PREVENTION**
- Never invent columns - derive ONLY from existing data
- Statistical evidence + business logic for confidence
- Output ONLY JSON matching Pydantic schema
- Sandboxed eval() for Polars expressions

**LAYER 5: AUDIT TRAIL**
- transformation_audit on all column operations
- Full prompt/response logging for LLM calls
- User action logging (accept/reject/modify)
- Version control for cleaning operations

---

## 10. FAULT TOLERANCE & FALLBACK SYSTEM

### 10.1 LLM Failure Handling
AI Call Fails -> Retry 1 (1s backoff) -> Retry 2 (2s backoff) -> Retry 3 (4s backoff) -> FALLBACK ACTIVATED

### 10.2 Fallback by Component
| Component | Primary | Fallback | Degradation |
|-----------|---------|----------|-------------|
| LLM Provider | Qwen 2.5 72B (Groq) | Llama 3.1 8B (Ollama) | Slight quality drop |
| Schema Inference | AI agent | Rule-based type detection | Less accurate types |
| Data Cleaning | AI cleaning plan | Mean/median/mode imputation | No smart imputation |
| Relationships | AI agent (LLM) | Pearson correlation only | No semantic relations |
| Report Generation | 8 parallel AI agents | Template-based static | No AI insights |
| NLQ Chat | LLM-powered | Keyword search | Limited interaction |

---

## 11. END-TO-END EXECUTION TIMELINE

### 11.1 Complete Timeline (500MB CSV Example)
0:00 - User uploads sales.csv (500MB)
0:05 - Stage 1: AI infers schema -> JSON + confidence scores
0:12 - Stage 2: AI generates cleaning plan -> User approves -> Parquet snapshot
0:20 - Stage 3: LangGraph Core Agent runs:
       - Profile schema: 0.5s (deterministic)
       - Discover candidates: 1.2s (deterministic)
       - LLM reasoning + structuring: 3.8s (Qwen)
       - Validation + confidence gate: 0.2s
       - Executor materialize 4 columns: 1.1s (Polars)
0:26 - UnifiedDataModel READY
0:30 - Stage 4: 8 Report Agents generate in parallel (~4.2s)
0:34 - Dashboard auto-layout renders (Plotly.js + Vega-Lite)
0:35 - NLQ Chat ready for conversational queries
0:40 - User exports PDF/HTML/Excel + schedules weekly refresh

### 11.2 Expected Processing Times
| File Size | Parse | Clean | Core Agent | Reports | Total |
|-----------|-------|-------|------------|---------|-------|
| 1 MB | <1s | <2s | ~6s | ~5s | ~14s |
| 10 MB | ~2s | ~5s | ~7s | ~5s | ~19s |
| 100 MB | ~10s | ~15s | ~8s | ~5s | ~38s |
| 500 MB | ~30s | ~45s | ~10s | ~5s | ~90s |

---

## 12. TECHNICAL STACK DETAILS

### 12.1 Complete Technology Stack
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Frontend | Next.js 14+ (App Router) | Latest | PWA, dashboards, NLQ, admin UI |
| Backend | FastAPI | Python 3.11+ | REST API, auth middleware, request validation |
| AI Orchestration | LangGraph + LangChain | >=0.2.0 / >=0.3.0 | Stateful agents, tool calling, prompt registry |
| LLM Primary | Qwen 2.5 72B | Groq Free Tier | Schema inference, cleaning, insights, NLQ, reports |
| LLM Fallback | Llama 3.1 8B | Ollama Local | Offline processing, local deployment |
| Data Processing | Polars + DuckDB + DataPrep | >=0.20 / >=0.10 | CSV parsing, JSON conversion, cleaning, queries |
| Metadata Store | PostgreSQL 15+ | asyncpg | Users, metadata, reports index |
| Cache | Redis 7+ | aioredis | Session cache, data cache, Celery backend |
| File Storage | AWS S3 / MinIO | boto3 | File storage (CSV, Parquet, exports) |
| Async Jobs | Celery + Redis | >=5.3.0 | Chunked processing, report generation, scheduling |
| Validation | Pydantic v2 | Latest | Strict JSON schema enforcement |
| Visualization | Plotly.js + Vega-Lite | Latest | Interactive charts, auto-layout dashboards |
| UI Framework | Tailwind CSS | Latest | Responsive design system |
| Container | Docker + Docker Compose | Latest | Development & production environments |

### 12.2 Python Dependencies (requirements.txt)
# Core
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
pydantic>=2.5.0
python-multipart>=0.0.6

# AI/ML
langgraph>=0.2.0
langchain-core>=0.3.0
langchain-groq>=0.1.0
langchain-ollama>=0.1.0

# Data Processing
polars>=0.20.0
duckdb>=0.10.0
dataprep>=0.4.0
scipy>=1.11.0
scikit-learn>=1.3.0

# Storage
asyncpg>=0.29.0
aioredis>=2.0.0
boto3>=1.34.0

# Async
celery>=5.3.0

# Export
Jinja2>=3.1.0
openpyxl>=3.1.0

# Auth
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4

---

## 13. COMPLETE API REFERENCE

### 13.1 REST Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/v1/auth/login | User login | No |
| POST | /api/v1/auth/refresh | Refresh JWT token | Yes |
| POST | /api/v1/pipeline/run | Execute full pipeline | Yes |
| GET | /api/v1/pipeline/status/{id} | Pipeline execution status | Yes |
| POST | /api/v1/reports/generate | Generate analytical report | Yes |
| GET | /api/v1/reports/{id} | Retrieve generated report | Yes |
| GET | /api/v1/reports/{id}/export/{format} | Export report (pdf/html/md/xlsx) | Yes |
| POST | /api/v1/nlq/query | Natural language query | Yes |
| GET | /api/v1/dashboard/{id} | Get dashboard configuration | Yes |
| GET | /api/v1/admin/users | List users (Admin only) | Admin |
| POST | /api/v1/admin/users | Create user (Admin only) | Admin |

### 13.2 Standard Response Format
{
  "status": "success|error",
  "data": {},
  "meta": {
    "timestamp": "2026-06-01T12:00:00Z",
    "request_id": "uuid"
  },
  "errors": []
}

---

## 14. DATABASE SCHEMA DESIGN

### 14.1 PostgreSQL Tables
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'analyst',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pipelines (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    status VARCHAR(50),
    file_name VARCHAR(255),
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE data_models (
    id UUID PRIMARY KEY,
    pipeline_id UUID REFERENCES pipelines(id),
    model_json JSONB,
    confidence_avg FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reports (
    id UUID PRIMARY KEY,
    data_model_id UUID REFERENCES data_models(id),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255),
    report_bundle JSONB,
    export_urls JSONB,
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    context JSONB,
    turn_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prompts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    version INTEGER,
    template TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(255),
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 15. FRONTEND ARCHITECTURE

### 15.1 Page Structure
/ (Home)
+--- /upload         -> Upload CSV page
+--- /dashboard/:id  -> Dashboard view with interactive charts
+--- /chat/:id       -> NLQ chat interface
+--- /reports/:id    -> Report viewer with sections
+--- /reports/:id/export -> Export options (PDF, HTML, MD, XLSX)
+--- /admin          -> Admin panel (protected)
    +--- /users      -> User management (CRUD)
    +--- /settings   -> System configuration

### 15.2 Frontend Integration Code
```javascript
// Upload CSV & get unified model
const formData = new FormData();
formData.append('file', csvFile);
formData.append('llm_provider', 'groq');

const res = await fetch('/api/v1/pipeline/run', {
  method: 'POST',
  body: formData
});
const model = await res.json();

// Use model.relationships for graph
// Use model.derived_columns for column builder
// Use model.final_viz_schema + recommended_dashboard_layout for auto-dashboard
```

---

## 16. DEPLOYMENT ARCHITECTURE

### 16.1 Deployment Stack
User Browser (Next.js PWA) -> Nginx Reverse Proxy (SSL + Rate Limiting) -> FastAPI Application (Container)
                                                                           |
                                                    Celery Workers <--- Redis Queue
                                                    |
                                                    PostgreSQL + MinIO/S3

### 16.2 Docker Compose Configuration
```yaml
services:
  api:
    build: ./backend
    ports: ['8000:8000']
    env_file: .env
    depends_on: [postgres, redis, minio]
  worker:
    build: ./backend
    command: celery -A tasks worker
    depends_on: [redis, postgres]
  postgres:
    image: postgres:15
  redis:
    image: redis:7
  minio:
    image: minio/minio
    command: server /data
```

### 16.3 Environment Variables
DATABASE_URL=postgresql://localhost:5432/autoinsight
REDIS_URL=redis://localhost:6379
S3_ENDPOINT=http://localhost:9000
GROQ_API_KEY=gsk_your_key_here
LLM_PROVIDER=groq
JWT_SECRET=your_jwt_secret_here
MAX_FILE_SIZE_MB=100

---

## 17. PHASED IMPLEMENTATION PLAN

### 17.1 Five Phase Overview
PHASE 1: Foundation (Weeks 1-2) -> Python backend core + infrastructure
PHASE 2: Core Pipeline (Weeks 3-4) -> 4-stage pipeline implementation
PHASE 3: Report Engine (Weeks 5-6) -> 4-phase report generation
PHASE 4: Frontend (Weeks 7-8) -> React/Next.js UI
PHASE 5: Integration (Weeks 9-10) -> Testing, deployment, polish

### 17.2 Phase Details

**PHASE 1: Foundation**
- Create project structure and configuration
- Implement schemas.py (all Pydantic models)
- Implement tools.py (deterministic tools)
- Set up Docker Compose (postgres, redis, minio)
- Database migrations (SQL DDL)
- FastAPI project structure
- Unit tests for models and tools

**PHASE 2: Core Pipeline**
- Stage 1: CSV -> JSON (encoding, parsing, LLM schema inference)
- Stage 2: Data Cleaning (profiling, LLM cleaning plan, execution)
- Stage 3: Core Agentic Agent (LangGraph workflow)
- Stage 4: Column Engineering (Polars eval, materialization)
- Celery async tasks
- Pipeline status tracking

**PHASE 3: Report Engine**
- Phase 1: Deterministic Profiling
- Phase 2: 8 Parallel Sub-Agents (LangChain chains)
- Phase 3: Validation & Confidence Gating
- Phase 4: Assembly & Export (PDF, HTML, MD, XLSX)
- Report caching

**PHASE 4: Frontend**
- Next.js 14+ project setup
- Upload page (drag-drop)
- Dashboard (Plotly charts)
- Report viewer
- NLQ chat interface
- Admin panel
- PWA support

**PHASE 5: Integration**
- Comprehensive testing (unit + integration + E2E)
- Performance optimization
- Security audit
- CI/CD pipeline
- Production deployment
- Documentation

---

## 18. DETAILED WEEK-BY-WEEK SCHEDULE

**WEEK 1:** Python Backend Core + Infrastructure
- Create project structure, schemas.py, tools.py
- Docker Compose setup, database migrations
- FastAPI skeleton with unit tests

**WEEK 2:** LLM Engine + Auth + API Foundation
- llm_factory.py (Groq + Ollama)
- prompt_registry.py (versioned prompts)
- JWT auth middleware + RBAC
- Core API endpoints (skeleton)
- Celery configuration

**WEEK 3:** Pipeline Stages 1-2
- Stage 1: CSV -> JSON (encoding, parsing, LLM schema inference, caching)
- Stage 2: Data Cleaning (profiling, cleaning plan, diff preview, execution)
- Celery tasks for async pipeline

**WEEK 4:** Pipeline Stages 3-4 (Core Agent)
- LangGraph workflow (profile, discover, reason, validate, execute)
- Column engineering (safe eval, materialization, audit trail)
- UnifiedDataModel assembly
- End-to-end pipeline testing

**WEEK 5:** Report Engine Phases 1-2
- Deterministic profiling (5 profiling functions)
- 8 parallel sub-agents (LangChain chains with dedicated prompts)
- Parallel execution (asyncio.gather)

**WEEK 6:** Report Engine Phases 3-4
- Validation & confidence gating (Pydantic, thresholds, retries)
- Assembly & export (Jinja2 templates, Puppeteer PDF, OpenPyXL Excel)
- S3 storage + PostgreSQL indexing

**WEEK 7:** Frontend Part 1 - Core Pages
- Next.js 14+ setup, Layout, Navbar
- Upload page (FileDropzone, ConfigPanel, ProgressIndicator)
- Dashboard page (DashboardGrid, ChartWidget, FilterBar)
- Authentication flow + Zustand stores

**WEEK 8:** Frontend Part 2 - Reports & NLQ
- Report viewer (ReportSection, navigation, export)
- NLQ chat (MessageList, QueryInput, ChartPreview)
- Admin panel (user management, settings)
- PWA support + responsive design

**WEEK 9:** Testing + Optimization
- Unit tests (target 80%+ coverage)
- Integration tests (E2E pipeline, NLQ, exports)
- Performance optimization (profiling, caching)
- Security audit + documentation

**WEEK 10:** Deployment + Handover
- Production Docker Compose
- CI/CD pipeline (GitHub Actions)
- Monitoring (Prometheus + Grafana)
- Admin runbook + UAT
- Production deployment

---

## 19. DEVELOPMENT TEAM ROLES

| Role | Count | Responsibility | Weeks |
|------|-------|---------------|-------|
| Backend Python Developer | 1-2 | FastAPI, LangGraph, pipelines, LLM | 1-6, 9-10 |
| Frontend Developer | 1 | React/Next.js, charts, UI | 7-8, 10 |
| Data/ML Engineer | 1 | Polars, DuckDB, ML models | 1-6 |
| DevOps Engineer | 0.5 | Docker, CI/CD, monitoring | 9-10 |
| QA Engineer | 0.5 | Testing, quality assurance | 9-10 |

---

## 20. TESTING STRATEGY

| Test Level | Focus | Tools | Target |
|------------|-------|-------|--------|
| Unit | Individual functions | pytest | 85%+ coverage |
| Integration | Module interactions | pytest + httpx | 70%+ coverage |
| E2E | Full pipeline | Playwright | Critical paths |
| Performance | Speed benchmarks | pytest-benchmark | < 30s for 10MB |
| Security | Vulnerability scan | Bandit, OWASP ZAP | All endpoints |

---

## 21. SECURITY & COMPLIANCE

| Category | Measure | Implementation |
|----------|---------|----------------|
| Authentication | JWT tokens | Access (15min) + Refresh (7d) tokens |
| Authorization | RBAC | Admin, Analyst, Viewer roles |
| Encryption | TLS 1.3 | All API communications |
| Data Protection | AES-256 | Stored files encryption |
| PII Protection | Auto-masking | During data cleaning phase |
| Input Validation | Pydantic v2 | All API inputs validated |
| Rate Limiting | 100 req/min | Per user endpoint limits |
| CORS | Whitelist | Only configured origins |
| SQL Injection | DuckDB sandbox | Read-only, parameterized, 5s timeout |
| Audit Trail | All actions logged | Transformation + access logs |

---

## 22. COST ANALYSIS & BUDGET

### 22.1 Development Cost (One-Time)
| Item | Cost |
|------|------|
| Backend Developers (2 x 8 weeks) | ~$16,000 |
| Frontend Developer (1 x 4 weeks) | ~$6,000 |
| DevOps (0.5 x 2 weeks) | ~$1,500 |
| QA (0.5 x 2 weeks) | ~$1,500 |
| **Total Development** | **~$25,000** |

### 22.2 Monthly Operating Cost
| Service | Cost |
|---------|------|
| Groq API (Qwen 2.5 72B) | $0 (Free Tier) |
| Ollama (Llama 3.1 8B) | $0 (Local) |
| VPS/Cloud Server | $10-50/month |
| MinIO Storage | $5-20/month |
| **Total Monthly** | **$15-80/month** |

---

## 23. RISK MANAGEMENT

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| R1 | Groq API rate limits | Medium | High | Request queuing, fallback to Ollama |
| R2 | LLM hallucination | Medium | High | Pydantic validation, confidence gating |
| R3 | Large CSV processing | Medium | Medium | Chunked Celery processing |
| R4 | Browser performance | Low | Medium | Lazy loading, virtual scrolling |
| R5 | DataPrep library issues | Low | Medium | Polars-based cleaning fallback |
| R6 | Concurrent user load | Low | Medium | Horizontal scaling via Docker |
| R7 | LLM service outage | Low | High | Dual-provider strategy (Ollama fallback) |
| R8 | Data loss | Low | Critical | All transformations audited |

---

## 24. QUALITY ASSURANCE PLAN

**Quality Gates:**
- Gate 1 (Code Review): PEP 8, ESLint, type annotations, unit tests
- Gate 2 (Integration): All integration tests pass, no regression
- Gate 3 (Performance): Pipeline < 30s, Reports < 3min, Dashboard < 2s
- Gate 4 (Release): All tests pass, security scan, load test, docs complete

**Quality Metrics:**
- Code Coverage: > 80%
- API Response Time: < 500ms p95
- Pipeline Success Rate: > 99%
- LLM Output Accuracy: > 90%
- Uptime: > 99.9%

---

## 25. SRS COMPLIANCE MATRIX

| SRS Section | Requirement | Status |
|-------------|-------------|--------|
| 6.1.1 | Single AI Engine (Qwen/Llama via llm_factory.py) | ✅ |
| 6.1.2 | Prompt Registry (versioned prompts in PostgreSQL) | ✅ |
| 6.1.3 | Tool Calling (LangGraph agents invoke tools) | ✅ |
| 6.2.1 | Schema Validation (with_structured_output + Pydantic) | ✅ |
| 6.2.2 | Confidence Gating (auto-filter < 0.65, retry, fallback) | ✅ |
| 4.5.2 | Correlation Analysis (Pearson/Spearman pre-LLM) | ✅ |
| 4.4.3 | Column Operations (Polars eval() sandbox) | ✅ |
| 4.9.2 | Data Lineage (transformation_audit logs) | ✅ |
| 5.2.1 | Fault Tolerance (fallback + Celery retries) | ✅ |
| 14.1 | Multi-Dataset Prep (entity relationship graph) | ✅ |
| 4.6.1 | Smart Chart Recs (chart_hint per relationship) | ✅ |
| 4.8.1-7 | Report Export (JSON -> PDF/HTML/Excel) | ✅ |

**Total: 12/12 Sections Compliant (100%)**

---

## 26. FUTURE ROADMAP

### 26.1 Planned Features
| Feature | Priority | Timeline |
|---------|----------|----------|
| Multi-Dataset Preparation (cross-entity joins) | High | Q2 |
| Advanced ML Integration (XGBoost, Random Forest) | Medium | Q3 |
| Real-Time Data Streaming (Kafka, WebSockets) | Low | Q3 |
| Collaborative Features (shared dashboards, teams) | Low | Q4 |
| Enterprise Features (SSO, advanced RBAC, compliance) | Low | Q4 |
| Mobile & Offline Support (PWA enhancements) | Low | Q1 Next |

### 26.2 Enhancement Ideas
- Multi-CSV upload + cross-dataset joins
- Automated ML model selection and training
- Export to Google Slides / PowerPoint
- Email report scheduling
- Custom chart builder (drag-drop)
- Natural language report editing
- White-label dashboards for clients
- Custom agent workflow builder
- AI-powered data storytelling

---

## APPENDIX A: PYDANTIC DATA MODELS

```python
class Relationship(BaseModel):
    source_column: str
    target_column: str
    relationship_type: str  # one-to-one, one-to-many, many-to-many
    confidence: float  # >= 0.65
    description: str
    chart_hint: str

class DerivedColumn(BaseModel):
    name: str
    expression: str  # Polars expression
    data_type: str
    description: str
    validation_rules: List[str]

class UnifiedDataModel(BaseModel):
    original_columns: List[str]
    cleaned_columns: List[str]
    derived_columns: List[DerivedColumn]
    relationships: List[Relationship]
    transformation_audit: List[dict]
    final_viz_schema: dict
    recommended_dashboard_layout: dict

class DataProfile(BaseModel):
    schema_metadata: dict
    univariate_stats: dict
    bivariate_matrix: dict
    trends: dict
    domain_context: str

class ReportBundle(BaseModel):
    sections: List[dict]
    overall_confidence: float
    audit_trail: List[dict]
    export_metadata: dict
    viz_payload: dict
    generated_at: datetime
```

---

## APPENDIX B: LLM PROMPT TEMPLATES

### Core Agent System Prompt
'You are an Expert Data Model Architect. Given schema, stats, and candidates: 
1. Validate & filter relationships (confidence >= 0.65 only) 
2. For each, provide: relationship_type, ai_reasoning, analytical_purpose, chart_hint 
3. Generate 3-5 derived columns (exact Polars formulas, business rationale, confidence) 
4. Assemble final unified schema for visualization. 
RULES: Never invent columns. Base confidence on statistical evidence. 
Output ONLY JSON matching UnifiedDataModel Pydantic schema.'

### Schema Inference Prompt
'You are a data schema expert. Given the first 100 rows of a CSV file: 
1. Detect data type for each column (int, float, str, date, datetime, boolean) 
2. Provide confidence level for each inference 
3. Note format specifications (date format, separators) 
4. Flag ambiguous types. Output ONLY valid JSON matching SchemaInferenceResponse.'

### Cleaning Plan Prompt
'You are a data cleaning expert. Given a DataPrep quality profile: 
1. Recommend imputation strategies for missing values 
2. Suggest outlier treatment methods 
3. Propose deduplication approach 
4. Identify PII columns and masking rules. 
Provide confidence scores. Output ONLY valid JSON matching CleaningPlan schema.'

---

*End of Master Project Planning Report*
*Generated for MVK Data Analysis Project - AI Agent*
*Total Documents Analyzed: 23 files*
*Implementation Timeline: 10 Weeks*