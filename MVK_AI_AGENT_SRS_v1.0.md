# SOFTWARE REQUIREMENTS SPECIFICATION (SRS) v1.0
## Project: AutoInsight AI — Agentic Data Analysis & Report Generation System
**Document Version:** 1.0  
**Date:** June 1, 2026  
**Prepared For:** MVK Data Analysis Project — AI Agent

---

## TABLE OF CONTENTS
1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Architecture](#3-architecture)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [AI Engine Requirements](#6-ai-engine-requirements)
7. [Data Pipeline Requirements](#7-data-pipeline-requirements)
8. [Report Generation Requirements](#8-report-generation-requirements)
9. [Frontend Requirements](#9-frontend-requirements)
10. [API Requirements](#10-api-requirements)
11. [Security Requirements](#11-security-requirements)
12. [Deployment Requirements](#12-deployment-requirements)
13. [Integration Requirements](#13-integration-requirements)
14. [Future Roadmap](#14-future-roadmap)

---

## 1. INTRODUCTION

### 1.1 Purpose
The AutoInsight AI system is an agentic AI-powered data analysis platform that ingests CSV data, automatically infers schemas, cleans data, discovers relationships, engineers features, and generates comprehensive analytical reports with minimal human intervention.

### 1.2 Scope
The system covers the complete data analysis lifecycle:
- CSV file ingestion and schema inference
- Automated data cleaning and preprocessing
- AI-driven relationship discovery between data columns
- Feature/column engineering with validation
- Multi-phase report generation with parallel AI agents
- Interactive chat (Natural Language Query) interface
- Dashboard visualization with auto-layout
- Multi-format report export (PDF, HTML, Markdown, Excel)

### 1.3 Definitions & Acronyms
| Term | Definition |
|------|------------|
| LLM | Large Language Model (Qwen 2.5 72B / Llama 3.1 8B) |
| LangGraph | Framework for building stateful, multi-actor AI agents |
| NLQ | Natural Language Query |
| PWA | Progressive Web Application |
| RBAC | Role-Based Access Control |
| SRS | Software Requirements Specification |
| EDA | Exploratory Data Analysis |
| SSE | Server-Sent Events |

---

## 2. SYSTEM OVERVIEW

### 2.1 System Context
AutoInsight AI operates as a cloud-native, agentic AI system that processes tabular data through a **4-stage pipeline** orchestrated by **LangGraph**, producing enriched datasets and comprehensive analytical reports.

### 2.2 User Roles
| Role | Description |
|------|-------------|
| Data Analyst | Uploads data, configures pipelines, views reports |
| Business User | Views dashboards, asks NLQ questions |
| Administrator | Manages users, roles, system configuration |

### 2.3 System Constraints
- **LLM Dependency:** Core AI functions require connectivity to Groq API (Qwen) or local Ollama instance (Llama)
- **Processing Limits:** CSV files up to 100MB for free tier, configurable for enterprise
- **Browser Support:** Modern browsers (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)

---

## 3. ARCHITECTURE

### 3.1 High-Level Architecture (5-Layer)
```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER (SRS 3.2)                    │
│                  React/Next.js PWA + Plotly.js + Vega-Lite              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Upload  │  │Dashboard │  │ AI Chat  │  │  Reports │  │   Admin  │ │
│  │   UI     │  │   View   │  │  (NLQ)   │  │  Viewer  │  │  Panel   │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │ HTTPS/REST + SSE
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY LAYER (SRS 3.3)                     │
│                    FastAPI (Python 3.11+) + JWT + RBAC                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│  │  Auth  │ │Ingestion│ │Cleaning │ │Analysis │ │Dashboard │ │Report  │ │
│  │Module  │ │ Module  │ │ Module  │ │ Module  │ │ Module   │ │Module  │ │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘    │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                ┌─────────────────┴─────────────────┐
                │                                   │
                ▼                                   ▼
┌──────────────────────────┐          ┌──────────────────────────────────┐
│   AI ORCHESTRATION       │          │    DATA PROCESSING ENGINE        │
│   (LangGraph Agents)     │          │    (Polars + DuckDB + DataPrep)  │
│                          │          │                                  │
│  ┌────────────────────┐  │          │  ┌──────────┐  ──────────────┐ │
│  │ 4-Stage Pipeline   │  │          │  │ CSV      │  │ Statistical  │ │
│  │ Agent              │  │          │  │ Parser   │  │ Analysis     │ │
│  └────────────────────┘  │          │  └──────────┘  └──────────────┘ │
│  ┌────────────────────┐  │          │  ┌──────────┐  ┌──────────────┐ │
│  │ 4-Phase Report     │  │          │  │ JSON     │  │ Correlation  │ │
│  │ Generation Agent   │  │          │  │ Converter│  │ & Forecasting│ │
│  └────────────────────┘  │          │  └──────────┘  └──────────────┘ │
│                          │          │  ┌──────────┐  ┌──────────────┐ │
│  ┌────────────────────┐  │          │  │ Parquet  │  │ ML Models    │ │
│  │ Relationship &     │  │          │  │ Storage  │  │ (K-Means)    │ │
│  │ Column Agent       │  │          │  └──────────┘  └──────────────┘ │
│  └────────────────────┘  │          └─────────┬───────────────────────┘
└──────────┬───────────────┘                     │
           │ Tool Calls (SQL, Stats, Code)       │ Query Execution
           ▼                                     ▼
┌──────────────────────────┐          ┌──────────────────────────────────┐
│   LLM ENGINE (SRS 6.1.1) │          │    STORAGE LAYER (SRS 3.6)       │
│   Free/Base Tier         │          │                                  │
│   • Qwen 2.5 72B (Groq)  │          │  ┌──────────┐  ┌──────────────┐ │
│   • Llama 3.1 8B (Ollama)│          │  │PostgreSQL│  │ AWS S3/MinIO │ │
│   • Structured JSON Mode │          │  │(Metadata)│  │ (Files)      │ │
│   • Pydantic Validation  │          │  └──────────┘  ──────────────┘ │
└──────────────────────────┘          │  ┌──────────┐                    │
                                      │  │ Redis    │                    │
                                      │  │(Cache)   │                    │
                                      └──┴──────────┴────────────────────┘
```

### 3.2 Presentation Layer
- **Technology:** React/Next.js 14+ (App Router)
- **State Management:** Zustand + React Query
- **Visualization:** Plotly.js + Vega-Lite
- **UI Framework:** Tailwind CSS
- **Features:** PWA support, responsive design, real-time updates via SSE

### 3.3 API Gateway Layer
- **Technology:** FastAPI (Python 3.11+)
- **Middleware:** JWT authentication, RBAC authorization
- **Async Support:** Uvicorn ASGI server
- **Modules:** Auth, Ingestion, Cleaning, Analysis, Dashboard, Report

### 3.4 AI Orchestration Layer
- **Framework:** LangGraph + LangChain
- **Agent Types:**
  - 4-Stage Pipeline Agent (CSV→JSON→Clean→Relationships→Columns)
  - 4-Phase Report Generation Agent (Profile→Sub-Agents→Validate→Export)
  - Relationship & Column Agent (AI-powered discovery & engineering)
- **Tool Calling:** SQL queries, statistical analysis, code execution

### 3.5 Data Processing Engine
| Component | Technology | Purpose |
|-----------|-----------|---------|
| CSV Parser | Polars | Fast CSV parsing with type inference |
| JSON Converter | Polars + Pydantic | Schema-aware JSON conversion |
| Data Cleaning | DataPrep | Missing values, outliers, PII masking |
| Analytics | DuckDB | SQL-based analytical queries |
| Statistics | SciPy/NumPy | Correlation, statistical tests |
| ML Models | Scikit-learn | K-Means clustering, feature analysis |

### 3.6 Storage Layer
| Store | Technology | Purpose |
|-------|-----------|---------|
| Metadata | PostgreSQL 15+ | Schema metadata, user data, reports index |
| Files | AWS S3 / MinIO | CSV/Parquet file storage |
| Cache | Redis 7+ | Session cache, processed data cache |
| Task Queue | Redis + Celery | Async job processing |

### 3.7 LLM Engine
- **Primary:** Qwen 2.5 72B (via Groq Free Tier)
- **Fallback:** Llama 3.1 8B (via local Ollama)
- **Mode:** Structured JSON mode (temperature=0.1, max_tokens=4096)
- **Validation:** Pydantic v2 schema enforcement

---

## 4. FUNCTIONAL REQUIREMENTS

### 4.1 Data Ingestion
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | System shall accept CSV file uploads | High |
| FR-1.2 | System shall auto-detect file encoding (chardet) | High |
| FR-1.3 | System shall infer CSV schema and convert to JSON | High |
| FR-1.4 | System shall validate JSON against inferred schema | High |
| FR-1.5 | System shall cache cleaned JSON in Redis | Medium |

### 4.2 Data Cleaning
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | System shall detect and handle missing values | High |
| FR-2.2 | System shall mask PII data | High |
| FR-2.3 | System shall detect and flag outliers | Medium |
| FR-2.4 | System shall perform fuzzy matching for duplicates | Medium |
| FR-2.5 | System shall maintain version control of cleaning operations | Medium |
| FR-2.6 | System shall store cleaned data as Parquet | High |

### 4.3 AI Relationship Discovery
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | System shall use LangGraph agent to discover column relationships | High |
| FR-3.2 | System shall use LLM (Qwen/Llama) for relationship inference | High |
| FR-3.3 | System shall enforce confidence gating (threshold ≥ 0.65) | High |
| FR-3.4 | System shall generate join hints between entities | Medium |
| FR-3.5 | System shall output a unified data model with relationships | High |

### 4.4 Column Engineering
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | System shall derive new columns via Polars expressions | High |
| FR-4.2 | System shall validate derived columns with Pydantic | High |
| FR-4.3 | System shall execute column operations in a sandbox (eval()) | High |
| FR-4.4 | System shall materialize the enriched dataset for visualization | High |
| FR-4.5 | System shall audit all column transformations | Medium |

### 4.5 Analysis & Profiling
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | System shall compute univariate statistics per column | High |
| FR-5.2 | System shall compute bivariate correlation matrix | High |
| FR-5.3 | System shall perform Pearson/Spearman correlation analysis | High |
| FR-5.4 | System shall detect trends and seasonality | Medium |
| FR-5.5 | System shall infer domain context from data | Medium |

### 4.6 Visualization & Dashboards
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | System shall generate smart chart recommendations per relationship | High |
| FR-6.2 | System shall auto-layout dashboards using Plotly/Vega-Lite | High |
| FR-6.3 | System shall support interactive dashboard customization | Medium |
| FR-6.4 | System shall enable drill-down on chart elements | Low |

### 4.7 NLQ Chat Interface
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-7.1 | System shall accept natural language queries about data | High |
| FR-7.2 | System shall convert NLQ to SQL/analysis operations | High |
| FR-7.3 | System shall return visual and textual responses | High |
| FR-7.4 | System shall maintain conversation context | Medium |

### 4.8 Report Generation
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-8.1 | Generate business understanding section | High |
| FR-8.2 | Generate data collection methodology section | High |
| FR-8.3 | Generate cleaning and analysis section | High |
| FR-8.4 | Generate EDA section | High |
| FR-8.5 | Generate statistical analysis section | High |
| FR-8.6 | Generate dashboard/visualization recommendations | High |
| FR-8.7 | Generate insights and recommendations | High |
| FR-8.8 | Export to PDF, HTML, and Markdown | High |
| FR-8.9 | Support Excel export of report data | Medium |

### 4.9 Report Engine — Detailed Phases
| Phase | Description | Components | LLM Required |
|-------|-------------|------------|-------------|
| Phase 1 | Deterministic Profiling | Schema metadata, univariate stats, bivariate matrix, trend detection, domain inference | No |
| Phase 2 | 8 Parallel Sub-Agents | Business Understanding, Data Collection, Cleaning/Analysis, EDA, Statistical Analysis, Dashboard/Viz, Insights, Recommendations | Yes (8 concurrent calls) |
| Phase 3 | Validation & Confidence Gating | Pydantic validation, confidence ≥ 0.70, retry loop (max 3), fallback engine | Conditional |
| Phase 4 | Assembly & Export Hooks | ReportBundle JSON, audit trail, viz payload, Puppeteer/Jinja2 export | No |

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### 5.1 Performance
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1.1 | CSV processing time for 10MB file | < 30 seconds |
| NFR-1.2 | Report generation time | < 3 minutes |
| NFR-1.3 | Dashboard load time | < 2 seconds |
| NFR-1.4 | NLQ response time | < 5 seconds |
| NFR-1.5 | Concurrent users supported | 50+ |

### 5.2 Reliability & Fault Tolerance
| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-2.1 | Handle LLM failures gracefully | Deterministic fallback on LLM failure |
| NFR-2.2 | Retry failed operations | Celery retries with exponential backoff |
| NFR-2.3 | Maintain data integrity | Transactional operations + audit logs |
| NFR-2.4 | Auto-recover from crashes | Docker health checks + auto-restart |
| NFR-2.5 | Log all errors centrally | Structured logging to stdout + log aggregator |

### 5.3 Security
| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-3.1 | Authentication | JWT tokens with refresh flow |
| NFR-3.2 | Authorization | Role-Based Access Control (RBAC) |
| NFR-3.3 | Data Encryption | TLS for transit, AES-256 for data at rest |
| NFR-3.4 | PII Protection | Automatic PII masking during cleaning |
| NFR-3.5 | API Security | Rate limiting, input validation, CORS |

### 5.4 Scalability
| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-4.1 | Horizontal scaling | Stateless API + shared Redis/PostgreSQL |
| NFR-4.2 | Async processing | Celery workers for jobs |
| NFR-4.3 | File storage scaling | S3/MinIO with CDN support |

### 5.5 Maintainability
| ID | Requirement |
|----|-------------|
| NFR-5.1 | Unit test coverage > 80% |
| NFR-5.2 | OpenAPI documentation for all endpoints |
| NFR-5.3 | PEP 8 (Python) and ESLint (JS/TS) compliance |
| NFR-5.4 | Infrastructure-as-Code (Docker Compose) |

---

## 6. AI ENGINE REQUIREMENTS

### 6.1 LLM Integration

#### 6.1.1 Single AI Engine
- Configurable provider via `llm_factory.py`
- Supports Qwen 2.5 72B (Groq) and Llama 3.1 8B (Ollama)
- JSON structured output mode
- Temperature: 0.1 (for consistency)

#### 6.1.2 Prompt Registry
- Versioned prompts stored in PostgreSQL
- Fetched at runtime with caching
- Prompt templates for each agent type

#### 6.1.3 Tool Calling Mechanism
LangGraph agents invoke the following tools:
| Tool Function | Purpose |
|---------------|---------|
| `run_sql_query` | Execute SQL against DuckDB |
| `get_column_statistics` | Statistical analysis of columns |
| `execute_polars` | Run Polars expressions |
| `generate_chart` | Create Plotly/Vega-Lite charts |

### 6.2 Validation & Safety

#### 6.2.1 Schema Validation
- `with_structured_output(UnifiedDataModel)` + Pydantic
- Strict JSON schema enforcement
- Type validation on all outputs

#### 6.2.2 Confidence Gating
- Auto-filter relationships with confidence < 0.65
- Retry loop on validation failure (max 3 attempts)
- Fallback: deterministic rule-based summary

#### 6.2.3 Hallucination Prevention
- Structured JSON mode constrains LLM output
- Pydantic v2 validation layer
- Confidence scoring for all AI-generated content

---

## 7. DATA PIPELINE REQUIREMENTS

### 7.1 Stage 1: CSV → JSON Conversion
```
┌──────────────┐
│ Polars CSV   │
│ Parser       │
│ chardet      │──→ Clean JSON → Redis Cache
│ Schema Inf.  │
│ JSON Schema  │
│ Validation   │
└──────────────┘
```

### 7.2 Stage 2: Data Cleaning
```
┌──────────────┐
│ DataPrep +   │
│ Rule Engine  │──→ Cleaned Parquet → S3 + Audit Log
│ PII Masking  │
│ Imputation   │
│ Outlier/Fuzz │
│ Version Ctrl │
└──────────────┘
```

### 7.3 Stage 3: AI Relationship Discovery
```
┌──────────────┐
│ LangGraph    │
│ Agent        │──→ Unified Data Model
│ (Qwen/Llama) │    (Relationships + Join Hints)
│ Confidence   │
│ Gating ≥0.65 │
└──────────────┘
```

### 7.4 Stage 4: Column Engineering
```
┌──────────────┐
│ Polars +     │
│ DuckDB       │──→ Enriched Viz-Ready Dataset
│ Pydantic     │    (Final Schema + Chart Schemas)
│ Validation   │
│ Materialize  │
└──────────────┘
```

---

## 8. REPORT GENERATION REQUIREMENTS

### 8.1 Phase 1: Deterministic Profiling (Zero LLM)
```
• extract_schema_metadata()
• compute_univariate_stats()
• compute_bivariate_matrix()
• detect_trends_seasonality()
• infer_domain_context()
Output: DataProfile object
```

### 8.2 Phase 2: 8 Parallel Sub-Agents
Each agent returns: `{report_type, sections[], overall_confidence, timestamp}`

| # | Sub-Agent | Responsibility | Output |
|---|-----------|---------------|--------|
| 1 | Business Understanding | Context and business relevance | Business context narrative |
| 2 | Data Collection | Methodology and sources | Data provenance report |
| 3 | Cleaning/Analysis | Data quality assessment | Quality metrics report |
| 4 | EDA | Exploratory analysis | Distribution analysis |
| 5 | Statistical Analysis | Statistical findings | Hypothesis test results |
| 6 | Dashboard/Viz | Visualization recommendations | Chart layout specs |
| 7 | Insights | Key findings | Insight summary |
| 8 | Recommendations | Actionable suggestions | Recommendation list |

### 8.3 Phase 3: Validation & Confidence Gating
- Pydantic schema validation per report section
- Confidence < 0.70 → flag for manual review
- Max 3 retry attempts on validation failure
- Fallback: deterministic rule-based summary

### 8.4 Phase 4: Assembly & Export Hooks
- Merge into `ReportBundle` JSON
- Attach audit trail + export metadata + viz payload
- Export engines: Puppeteer (PDF), Jinja2 (HTML/Markdown)
- Store in S3 + index in PostgreSQL `reports` table

---

## 9. FRONTEND REQUIREMENTS

### 9.1 Pages/Views
| Page | Description | Key Features |
|------|-------------|-------------|
| Upload UI | Drag-and-drop CSV upload | File validation, progress indicator, config options |
| Dashboard View | Auto-generated dashboard | Plotly charts, Vega-Lite, auto-layout |
| AI Chat (NLQ) | Natural language queries | Conversational UI, query history |
| Reports Viewer | View/export reports | PDF/HTML/Markdown preview |
| Admin Panel | User & system management | User CRUD, role assignment |

### 9.2 Frontend Integration API
```javascript
// Upload CSV & get unified model
const formData = new FormData();
formData.append('file', csvFile);
formData.append('llm_provider', 'groq');

const res = await fetch('/api/v1/pipeline/run', { method: 'POST', body: formData });
const model = await res.json();

// Use model.relationships for graph
// Use model.derived_columns for builder
// Use model.final_viz_schema + model.recommended_dashboard_layout for auto-dashboard
```

---

## 10. API REQUIREMENTS

### 10.1 REST Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/login` | User authentication | No |
| POST | `/api/v1/auth/refresh` | Refresh JWT token | Yes |
| POST | `/api/v1/pipeline/run` | Execute full pipeline | Yes |
| GET | `/api/v1/pipeline/status/{id}` | Pipeline execution status | Yes |
| POST | `/api/v1/reports/generate` | Generate analytical report | Yes |
| GET | `/api/v1/reports/{id}` | Retrieve generated report | Yes |
| POST | `/api/v1/nlq/query` | Natural language query | Yes |
| GET | `/api/v1/dashboard/{id}` | Get dashboard configuration | Yes |
| GET | `/api/v1/admin/users` | List users (Admin only) | Yes (Admin) |
| DELETE | `/api/v1/admin/users/{id}` | Delete user (Admin only) | Yes (Admin) |

### 10.2 Standard Response Format
```json
{
  "status": "success|error",
  "data": {},
  "meta": {
    "timestamp": "2026-06-01T12:00:00Z",
    "request_id": "550e8400-e29b-41d4-a716-446655440000"
  },
  "errors": []
}
```

---

## 11. SECURITY REQUIREMENTS

### 11.1 Authentication
- JWT-based authentication (access + refresh tokens)
- Access token expiry: 15 minutes
- Refresh token expiry: 7 days
- Secure HTTP-only cookies for refresh tokens

### 11.2 Authorization (RBAC)
| Role | Permissions |
|------|-------------|
| Admin | Full access: manage users, system config, all data |
| Analyst | Upload data, run pipelines, generate reports, NLQ |
| Viewer | View dashboards, reports, read-only queries |

### 11.3 Data Protection
- TLS 1.3 for all communications
- AES-256 encryption for stored files
- PII detection and automatic masking
- Audit logging for all data access

---

## 12. DEPLOYMENT REQUIREMENTS

### 12.1 Infrastructure Stack
```yaml
Services:
  - FastAPI application (Python 3.11+)
  - PostgreSQL 15+ (metadata storage)
  - Redis 7+ (cache + task queue)
  - MinIO / AWS S3 (file storage)
  - Celery workers (async processing)
  - Nginx reverse proxy
```

### 12.2 Deployment Commands
```bash
# Clone repository
git clone https://github.com/your-org/autoinsight-ai.git
cd autoinsight-ai
pip install -r requirements.txt

# Configure LLM (Choose one)
export GROQ_API_KEY=gsk_...          # For Qwen 2.5 72B
# OR
ollama pull llama3.1:8b              # For local Llama
export LLM_PROVIDER=ollama

# Start infrastructure
docker-compose up -d postgres redis minio

# Start application
uvicorn backend.api:app --reload --port 8000
```

### 12.3 Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://localhost:5432/autoinsight` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `S3_ENDPOINT` | S3/MinIO endpoint | `http://localhost:9000` |
| `GROQ_API_KEY` | Groq API key | — |
| `LLM_PROVIDER` | LLM provider selection | `groq` |
| `JWT_SECRET` | JWT signing secret | — |

---

## 13. INTEGRATION REQUIREMENTS

### 13.1 External Integrations
| Service | Purpose | Integration Type | Auth Method |
|---------|---------|-----------------|-------------|
| Groq API | Qwen 2.5 72B LLM | REST API | API Key |
| Ollama | Local Llama 3.1 8B | Local HTTP API | None (localhost) |
| AWS S3/MinIO | File storage | S3-compatible API | Access Key/Secret |
| PostgreSQL | Metadata storage | SQL (asyncpg) | Password |

### 13.2 Internal Integration Points
| From | To | Method |
|------|----|--------|
| Frontend | Backend API | HTTPS/REST + SSE |
| API Gateway | AI Agents | Python function calls |
| AI Agents | LLM Engine | LangChain API |
| AI Agents | Data Engine | Tool calls (SQL, Stats, Code) |

---

## 14. FUTURE ROADMAP

### 14.1 Multi-Dataset Preparation
- Entity relationship graph between multiple datasets
- Suggested joins across CSV files
- Cross-dataset analysis

### 14.2 Advanced ML Integration
- Automated ML model selection
- Feature importance analysis
- Predictive modeling capabilities

### 14.3 Real-Time Data Streaming
- Support for streaming data sources (Kafka, WebSockets)
- Real-time dashboard updates
- Event-driven pipeline triggers

### 14.4 Collaborative Features
- Shared dashboards and reports
- Comment and annotation system
- Team workspaces

### 14.5 Enterprise Features
- SSO/SAML integration
- Advanced RBAC with custom roles
- Audit compliance reports
- SLA monitoring

### 14.6 Mobile & Offline Support
- Mobile-optimized dashboards
- Offline data processing
- PWA with service workers

---

## APPENDIX A: SRS v1.0 COMPLIANCE MATRIX

| SRS Section | Implementation | Status |
|-------------|---------------|--------|
| **6.1.1 Single AI Engine** | Configurable Qwen/Llama via `llm_factory.py` | ✅ |
| **6.1.2 Prompt Registry** | Versioned prompts in PostgreSQL, runtime fetch | ✅ |
| **6.1.3 Tool Calling** | LangGraph agents invoke SQL/stats/code tools | ✅ |
| **6.2.1 Schema Validation** | `with_structured_output(UnifiedDataModel)` + Pydantic | ✅ |
| **6.2.2 Confidence Gating** | Auto-filter < 0.65, retry loop, fallback engine | ✅ |
| **4.5.2 Correlation Analysis** | Pearson/Spearman pre-LLM, cited in reports | ✅ |
| **4.4.3 Column Operations** | Polars eval() sandbox, exact formula execution | ✅ |
| **4.9.2 Data Lineage** | `transformation_audit` + `audit_trail` logs | ✅ |
| **5.2.1 Fault Tolerance** | Deterministic fallback on LLM failure, Celery retries | ✅ |
| **14.1 Multi-Dataset Prep** | `entity_relationship_graph` + `suggested_join` | ✅ |
| **4.6.1 Smart Chart Recs** | `chart_hint` per relationship, Plotly/Vega-Lite | ✅ |
| **4.8.1–4.8.7 Report Export** | JSON bundle → Puppeteer/Jinja2 → PDF/HTML/Excel | ✅ |

---

## APPENDIX B: DATA MODELS (Pydantic Schemas)

### UnifiedDataModel
```python
class UnifiedDataModel(BaseModel):
    original_columns: List[str]
    cleaned_columns: List[str]
    derived_columns: List[DerivedColumn]
    relationships: List[Relationship]
    transformation_audit: List[dict]
    final_viz_schema: dict
    recommended_dashboard_layout: dict
```

### Relationship
```python
class Relationship(BaseModel):
    source_column: str
    target_column: str
    relationship_type: str  # one-to-one, one-to-many, many-to-many
    confidence: float       # ≥ 0.65
    description: str
    chart_hint: str         # recommended chart type
```

### DerivedColumn
```python
class DerivedColumn(BaseModel):
    name: str
    expression: str         # Polars expression
    data_type: str
    description: str
    validation_rules: List[str]
```

---

## APPENDIX C: TECHNICAL STACK SUMMARY

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Frontend | Next.js 14+ (App Router) | Latest | PWA, dashboards, NLQ chat, admin UI |
| Backend | FastAPI | Python 3.11+ | REST API, auth middleware, validation |
| AI Orchestration | LangGraph + LangChain | ≥0.2.0 / ≥0.3.0 | Stateful agents, tool calling |
| LLM (Primary) | Qwen 2.5 72B | Groq Free | Schema inference, cleaning, insights |
| LLM (Fallback) | Llama 3.1 8B | Ollama Local | Local offline processing |
| Data Processing | Polars + DuckDB + DataPrep | ≥0.20.0 / ≥0.10.0 | CSV parsing, cleaning, querying |
| Storage (Meta) | PostgreSQL 15+ | asyncpg | Metadata, users, reports index |
| Storage (Cache) | Redis 7+ | aioredis | Session cache, data cache |
| Storage (Files) | AWS S3 / MinIO | boto3 | File storage (CSV, Parquet) |
| Async Jobs | Celery + Redis | ≥5.3.0 | Chunked processing, reports |
| Validation | Pydantic v2 | Latest | Schema enforcement, hallucination prevention |

---

*End of Software Requirements Specification v1.0*  
*Generated for MVK Data Analysis Project — AI Agent*
