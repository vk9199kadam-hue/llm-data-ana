# AGILE FRAMEWORK & DEVELOPMENT REPORT
# AutoInsight AI — Agentic Data Analysis & Report Generation System
**Date:** June 1, 2026 | **Version:** 1.0 | **Software Model:** Agile/Scrum

---

## TABLE OF CONTENTS
1. EXECUTIVE SUMMARY
2. WHY AGILE IS BEST FOR THIS PROJECT
3. COMPLETE AGILE FRAMEWORK OVERVIEW
4. 5 SPRINTS DETAILED PLAN
5. SPRINT 1: FOUNDATION (Weeks 1-2)
6. SPRINT 2: CORE PIPELINE (Weeks 3-4)
7. SPRINT 3: REPORT ENGINE (Weeks 5-6)
8. SPRINT 4: FRONTEND (Weeks 7-8)
9. SPRINT 5: INTEGRATION & DEPLOYMENT (Weeks 9-10)
10. SCRUM CEREMONIES SCHEDULE
11. USER STORIES MAP
12. TASK BOARD STRUCTURE (Kanban)
13. DAILY STANDUP TEMPLATE
14. SPRINT REVIEW TEMPLATE
15. SPRINT RETROSPECTIVE TEMPLATE
16. PRODUCT BACKLOG (PRIORITIZED)
17. SPRINT BACKLOG TRACKER
18. VELOCITY TRACKING
19. BURNDOWN CHART GUIDE
20. DEFINITION OF DONE (DoD)
21. AGILE TEAM ROLES & RESPONSIBILITIES
22. AGILE ESTIMATION (Story Points)
23. QUALITY GATES PER SPRINT
24. AGILE ADAPTATIONS FOR AI PROJECTS
25. RISK MANAGEMENT IN AGILE
26. AGILE TOOLS RECOMMENDATION
27. APPENDICES

---

## 1. EXECUTIVE SUMMARY

This document defines the complete Agile/Scrum framework for developing AutoInsight AI.
The project uses a Hybrid Waterfall-Agile Model:
- Planning & Design: Waterfall (already 100% complete, 23 spec documents)
- Implementation: Scrum/Agile (5 Sprints over 10 Weeks)
- Validation: V-Model (each phase has test gates)

### Key Agile Metrics
- Total Sprints: 5 (2 weeks each)
- Sprint Duration: 2 Weeks (10 working days)
- Team Size: 4-5 members
- Total Duration: 10 Weeks
- Story Point Scale: Fibonacci (1, 2, 3, 5, 8, 13, 21)
- Estimated Total SP: 320-400 Story Points

---

## 2. WHY AGILE IS BEST FOR THIS PROJECT

| Factor | Why Agile Wins |
|--------|----------------|
| AI/LLM Integration | Allows experimentation with different LLM providers (Qwen, Llama) |
| Uncertain Requirements | LLM behavior needs iterative refinement through sprint feedback |
| Complex Pipeline | 4 stages + 4 phases broken into manageable increments |
| Fast Feedback | Working software every 2 weeks, stakeholder demos |
| Technology Risk | Early validation with new libraries (LangGraph, Polars) |
| Visibility | Sprint reviews demo real progress to stakeholders |

### Design is Frozen (Waterfall Portion)
- System Architecture (5-layer design)
- 4-Stage Data Pipeline Design
- 4-Phase Report Engine Design
- Pydantic Data Models (UnifiedDataModel, etc.)
- API Contract (11 endpoints defined)
- Database Schema (7 PostgreSQL tables)
- LLM Prompt Templates

### What Iterates in Agile
- Prompt engineering and LLM response formatting
- UI/UX refinements based on user testing
- Performance optimization and caching strategies
- Configuration and deployment tuning
- Bug fixes and edge case handling

---

## 3. COMPLETE AGILE FRAMEWORK OVERVIEW

### 3.1 Framework Structure
PRODUCT BACKLOG (320-400 Story Points)
  |
  |  Sprint Planning (Each 2 weeks)
  v
SPRINT BACKLOG (60-80 SP per Sprint)
  |
  |  Daily Standup (15 min, every day)
  |  Development Work (Sprint Execution)
  |  CI/CD Pipeline (Continuous Integration)
  v
POTENTIALLY SHIPPABLE INCREMENT
  |
  |  Sprint Review (Demo to stakeholders)
  |  Sprint Retrospective (Team improvement)
  v
NEXT SPRINT PLANNING (Backlog refinement)

### 3.2 Sprint Timeline
Sprint 1: Foundation      [Weeks 1-2]   60-70 SP - Backend Core + Infra
Sprint 2: Core Pipeline   [Weeks 3-4]   70-85 SP - CSV to UnifiedDataModel
Sprint 3: Report Engine   [Weeks 5-6]   70-80 SP - Reports + Export
Sprint 4: Frontend        [Weeks 7-8]   65-75 SP - React/Next.js UI
Sprint 5: Integration     [Weeks 9-10]  55-70 SP - Testing + Deploy

---

## 4. 5 SPRINTS DETAILED PLAN

| Sprint | Name | Weeks | Focus | SP | Key Deliverable |
|--------|------|-------|-------|----|-----------------|
| 1 | Foundation | 1-2 | Backend Core + Infra | 60-70 | Working API + Docker |
| 2 | Core Pipeline | 3-4 | 4-Stage Pipeline | 70-85 | E2E CSV to UnifiedDataModel |
| 3 | Report Engine | 5-6 | 4-Phase Report | 70-80 | Generated reports with export |
| 4 | Frontend | 7-8 | React/Next.js UI | 65-75 | 5 pages working |
| 5 | Integration | 9-10 | Testing + Deploy | 55-70 | Production-ready system |

---

## 5. SPRINT 1: FOUNDATION (Weeks 1-2)

### Sprint Goal
Establish project foundation: core data models, deterministic tools, infrastructure, auth.

### User Stories
| ID | Story | Points | Priority |
|----|-------|--------|----------|
| US-001 | Pydantic models for all data types | 5 | P0 |
| US-002 | Polars/SciPy deterministic tools | 8 | P0 |
| US-003 | Docker Compose (postgres+redis+minio) | 5 | P0 |
| US-004 | FastAPI project with health check | 3 | P0 |
| US-005 | Database migrations (7 tables) | 5 | P1 |
| US-006 | LLM factory (Groq + Ollama) | 8 | P0 |
| US-007 | Prompt registry (versioned) | 5 | P1 |
| US-008 | JWT auth with login/refresh | 8 | P0 |
| US-009 | RBAC roles (Admin/Analyst/Viewer) | 5 | P1 |
| US-010 | Celery workers config | 5 | P1 |
| US-011 | Basic API endpoints skeleton | 3 | P0 |
| US-012 | Unit tests for models + auth | 5 | P1 |

Total: 65 SP

### Acceptance Criteria
1. POST /auth/login returns JWT for valid credentials
2. Protected routes reject unauthenticated with 401
3. Admin routes reject non-admin with 403
4. Docker stack: api + postgres + redis + minio all healthy
5. LLM calls return structured JSON from both providers
6. All Pydantic models validate correctly

---

## 6. SPRINT 2: CORE PIPELINE (Weeks 3-4)

### Sprint Goal
Complete 4-stage data pipeline: CSV upload to UnifiedDataModel output.

### User Stories
| ID | Story | Points | Priority |
|----|-------|--------|----------|
| US-013 | CSV file upload with validation | 8 | P0 |
| US-014 | Encoding detection (chardet) | 3 | P1 |
| US-015 | Stage 1: CSV->JSON with AI schema inference | 8 | P0 |
| US-016 | JSON schema validation + Redis cache | 5 | P1 |
| US-017 | Stage 2: DataPrep quality profiling | 8 | P0 |
| US-018 | AI cleaning plan via LLM | 8 | P0 |
| US-019 | User diff preview + approve/reject | 5 | P1 |
| US-020 | Cleaning execution + Parquet snapshot | 5 | P1 |
| US-021 | Stage 3: LangGraph workflow (4 nodes) | 13 | P0 |
| US-022 | Validation gate + confidence >= 0.65 | 5 | P0 |
| US-023 | Retry logic (max 3) + fallback | 5 | P1 |
| US-024 | Stage 4: Column engineering (safe eval) | 8 | P0 |
| US-025 | UnifiedDataModel + audit trail | 5 | P0 |
| US-026 | Celery tasks for async pipeline | 5 | P1 |

Total: 84 SP

### Acceptance Criteria
1. Upload CSV -> pipeline task ID returned
2. Status endpoint shows progress per stage
3. Completion returns full UnifiedDataModel JSON
4. UDM contains: relationships, derived_columns, audit
5. Pipeline completes < 60s for 100MB CSV
6. Fallback activates when LLM is unavailable

---

## 7. SPRINT 3: REPORT ENGINE (Weeks 5-6)

### Sprint Goal
Complete 4-phase report generation with multi-format export.

### User Stories
| ID | Story | Points | Priority |
|----|-------|--------|----------|
| US-027 | Phase 1: Deterministic profiling (5 funcs) | 8 | P0 |
| US-028 | Phase 2: 8 parallel sub-agents | 13 | P0 |
| US-029 | Parallel execution via asyncio.gather | 5 | P1 |
| US-030 | Phase 3: Pydantic validation per section | 5 | P0 |
| US-031 | Confidence badge system (green/yellow/orange/red) | 3 | P1 |
| US-032 | Retry on validation failure (max 3) | 5 | P1 |
| US-033 | Phase 4: ReportBundle JSON assembly | 5 | P0 |
| US-034 | PDF export (Puppeteer) | 8 | P0 |
| US-035 | HTML export (Jinja2) | 5 | P1 |
| US-036 | Markdown export | 3 | P1 |
| US-037 | Excel export (OpenPyXL) | 5 | P1 |
| US-038 | S3 storage + PostgreSQL indexing | 5 | P1 |
| US-039 | Report caching | 5 | P1 |

Total: 75 SP

### Acceptance Criteria
1. POST /reports/generate -> returns report ID
2. GET /reports/{id} -> full ReportBundle JSON
3. GET /reports/{id}/export/pdf -> downloadable PDF
4. 8 sub-agents produce sections with confidence scores
5. Low confidence shows yellow/orange badges
6. PDF renders with proper formatting (headings, tables)

---

## 8. SPRINT 4: FRONTEND (Weeks 7-8)

### Sprint Goal
Complete React/Next.js UI with all 5 pages and PWA support.

### User Stories
| ID | Story | Points | Priority |
|----|-------|--------|----------|
| US-040 | Login page with JWT auth | 5 | P0 |
| US-041 | Upload page with drag-drop | 8 | P0 |
| US-042 | Pipeline progress indicator (SSE) | 5 | P1 |
| US-043 | Auto-generated dashboard (Plotly charts) | 13 | P0 |
| US-044 | Chart interactivity (hover, zoom, filter) | 5 | P1 |
| US-045 | Report viewer with section navigation | 8 | P0 |
| US-046 | Export menu (PDF/HTML/MD/XLSX) | 5 | P1 |
| US-047 | NLQ chat interface | 8 | P0 |
| US-048 | Chart preview in chat responses | 5 | P1 |
| US-049 | "Show Reasoning" toggle | 3 | P2 |
| US-050 | Admin panel with user management | 5 | P1 |
| US-051 | PWA support (offline-capable) | 5 | P2 |
| US-052 | Responsive design (mobile + tablet) | 3 | P1 |

Total: 78 SP

### Acceptance Criteria
1. Upload CSV -> see pipeline progress -> auto-dashboard
2. Dashboard renders 3-5 charts based on data
3. Report viewer shows all 8 sections with badges
4. Export buttons download all 4 format files
5. Chat accepts NLQ and returns chart + explanation
6. Admin can create/edit/delete users
7. App works on mobile browser

---

## 9. SPRINT 5: INTEGRATION & DEPLOYMENT (Weeks 9-10)

### Sprint Goal
Final testing, optimization, security, CI/CD, and production deployment.

### User Stories
| ID | Story | Points | Priority |
|----|-------|--------|----------|
| US-053 | Unit tests (80%+ coverage) | 13 | P0 |
| US-054 | Integration tests for all APIs | 8 | P0 |
| US-055 | E2E tests for critical paths | 8 | P1 |
| US-056 | Performance benchmarks | 5 | P1 |
| US-057 | Performance optimization | 8 | P1 |
| US-058 | Security audit (OWASP, SQL injection) | 5 | P0 |
| US-059 | CI/CD pipeline (GitHub Actions) | 5 | P0 |
| US-060 | Production Docker Compose | 3 | P0 |
| US-061 | Monitoring (Prometheus + Grafana) | 5 | P2 |
| US-062 | Log aggregation (Loki/ELK) | 5 | P2 |
| US-063 | Admin runbook | 3 | P1 |
| US-064 | User acceptance testing (UAT) | 5 | P0 |
| US-065 | Production deployment | 5 | P0 |

Total: 78 SP

### Acceptance Criteria
1. pytest --cov=80% passes
2. E2E: Upload CSV -> Dashboard -> Report -> PDF download
3. Security: No critical vulnerabilities
4. CI/CD: Push to main -> tests -> build -> deploy
5. Production: HTTPS, health checks, auto-restart
6. UAT signed off by stakeholders

---

## 10. SCRUM CEREMONIES SCHEDULE

| Ceremony | When | Duration | Participants |
|----------|------|----------|-------------|
| Daily Standup | Every day, 9:30 AM | 15 min | Dev team + SM |
| Sprint Planning | Day 1 of Sprint | 2-4 hours | Full team |
| Sprint Review | Last day, 3 PM | 1 hour | + Stakeholders |
| Sprint Retro | Last day, 4 PM | 1 hour | Dev team + SM |
| Backlog Refinement | Mid-Sprint, 2 PM | 1 hour | PO + Dev team |

---

## 11. USER STORIES MAP (65 Stories, 5 Epics)

EPIC 1: Foundation Infrastructure (US-001 to US-012)
  Theme: Project Setup (US-001, US-002, US-004)
  Theme: Infrastructure (US-003, US-005, US-010)
  Theme: AI Integration (US-006, US-007)
  Theme: Authentication (US-008, US-009)
  Theme: Testing (US-011, US-012)

EPIC 2: Data Pipeline (US-013 to US-026)
  Theme: File Upload (US-013, US-014)
  Theme: Stage 1 Schema (US-015, US-016)
  Theme: Stage 2 Clean (US-017, US-018, US-019, US-020)
  Theme: Stage 3 Core (US-021, US-022, US-023)
  Theme: Stage 4 Columns (US-024, US-025)
  Theme: Async (US-026)

EPIC 3: Report Engine (US-027 to US-039)
  Theme: Phase 1 (US-027)
  Theme: Phase 2 (US-028, US-029)
  Theme: Phase 3 (US-030, US-031, US-032)
  Theme: Phase 4 (US-033)
  Theme: Export (US-034, US-035, US-036, US-037)
  Theme: Storage (US-038, US-039)

EPIC 4: Frontend (US-040 to US-052)
  Theme: Auth UI (US-040)
  Theme: Upload (US-041, US-042)
  Theme: Dashboard (US-043, US-044)
  Theme: Reports (US-045, US-046)
  Theme: NLQ Chat (US-047, US-048, US-049)
  Theme: Admin (US-050)
  Theme: PWA (US-051, US-052)

EPIC 5: Integration (US-053 to US-065)
  Theme: Testing (US-053, US-054, US-055)
  Theme: Performance (US-056, US-057)
  Theme: Security (US-058)
  Theme: CI/CD (US-059, US-060, US-063, US-064, US-065)
  Theme: Monitoring (US-061, US-062)

---

## 12. TASK BOARD STRUCTURE (Kanban)

### Board Columns
BACKLOG | SPRINT BACKLOG | IN PROGRESS | REVIEW | DONE

### WIP Limits
- IN PROGRESS: Max 2 per developer (1 P0 + 1 P1)
- REVIEW: Max 3 total across team
- No work starts without being in SPRINT BACKLOG

### Swimlanes
P0 (Must Have) - Red - Critical for sprint goal
P1 (Should Have) - Yellow - Important but workaround exists
P2 (Nice to Have) - Green - Only if capacity allows
Bugs - Blue - Defects found during sprint
Tech Debt - Gray - Refactoring/optimization

---

## 13. DAILY STANDUP TEMPLATE

Format: 15 min max, 9:30 AM

1. What did I complete yesterday?
2. What will I work on today?
3. What blockers do I have?
4. Any dependencies needed?

---

## 14. SPRINT REVIEW TEMPLATE

Format: 1 hour, Last day of Sprint

SPRINT GOAL: [Goal Statement]

DEMO (30 min): Story by story demo of completed work

METRICS:
- Committed: [N] SP
- Completed: [N] SP
- Velocity: [N] SP/Sprint
- Tests Added: [N]
- Bugs Found: [N]

STAKEHOLDER FEEDBACK:
ADJUSTMENTS FOR NEXT SPRINT:

---

## 15. SPRINT RETROSPECTIVE TEMPLATE

Format: 1 hour - Start/Stop/Continue Method

START DOING (Things to start):
- [Action 1]

STOP DOING (Things to stop):
- [Action 1]

CONTINUE DOING (Things working well):
- [Action 1]

ACTION ITEMS: | Action | Owner | Due |
SPRINT HEALTH: [1-5 Stars]
TEAM MOOD: [Happy/Neutral/Concerned]

---

## 16. PRODUCT BACKLOG (PRIORITIZED)

### Top Priority Stories (P0)
| ID | Description | SP | Sprint |
|----|-------------|----|--------|
| US-001 | Pydantic models | 5 | 1 |
| US-004 | FastAPI project structure | 3 | 1 |
| US-006 | LLM factory (Groq + Ollama) | 8 | 1 |
| US-008 | JWT auth middleware | 8 | 1 |
| US-013 | CSV file upload | 8 | 2 |
| US-015 | Stage 1: CSV->JSON | 8 | 2 |
| US-017 | Stage 2: DataPrep profiling | 8 | 2 |
| US-018 | AI cleaning plan | 8 | 2 |
| US-021 | LangGraph workflow (4 nodes) | 13 | 2 |
| US-022 | Validation gate | 5 | 2 |
| US-024 | Stage 4: Column engineering | 8 | 2 |
| US-027 | Phase 1: Deterministic profiling | 8 | 3 |
| US-028 | Phase 2: 8 parallel sub-agents | 13 | 3 |
| US-030 | Phase 3: Pydantic validation | 5 | 3 |
| US-033 | Phase 4: ReportBundle assembly | 5 | 3 |
| US-034 | PDF export (Puppeteer) | 8 | 3 |
| US-040 | Login page | 5 | 4 |
| US-041 | Upload page with drag-drop | 8 | 4 |
| US-043 | Auto-generated dashboard | 13 | 4 |
| US-045 | Report viewer | 8 | 4 |
| US-047 | NLQ chat interface | 8 | 4 |
| US-053 | Unit tests (80%+) | 13 | 5 |
| US-054 | Integration tests | 8 | 5 |
| US-058 | Security audit | 5 | 5 |
| US-059 | CI/CD pipeline | 5 | 5 |
| US-064 | UAT | 5 | 5 |
| US-065 | Production deployment | 5 | 5 |

Total P0: 196 SP across all 5 Sprints

---

## 17. SPRINT BACKLOG TRACKER (Template)

Sprint [N] Backlog
| ID | Story | SP | Owner | Status | Notes |
|----|-------|----|-------|--------|-------|
| US-xxx | Story name | N | Name | In Progress | Notes |
|-------|-------|----|-------|--------|-------|
| TOTAL | | N | | | |

Status options: Done, In Progress, In Review, Not Started

---

## 18. VELOCITY TRACKING

| Sprint | Committed | Completed | Velocity | Cumulative |
|--------|-----------|-----------|----------|------------|
| 1 | 65 | 55 | 55 | 55 |
| 2 | 84 | 78 | 78 | 133 |
| 3 | 75 | 72 | 72 | 205 |
| 4 | 78 | 74 | 74 | 279 |
| 5 | 78 | 78 | 78 | 357 |
| TOTAL | 380 | 357 | 71.4 avg | 357 |

Velocity Guidelines:
- Initial estimate: 60-80 SP per Sprint
- After Sprint 1: Use actual velocity for Sprint 2
- Adjustment: Re-estimate after every 2 Sprints
- Buffer: Add 15% for unplanned work

---

## 19. BURNDOWN CHART GUIDE

How to create:
- Day 1: Start with total SP for sprint
- Each day: Subtract completed SP
- Plot: X = Days, Y = Remaining SP
- Ideal: Straight line from (Day 1, Total) to (Last Day, 0)

Example (Sprint 1 with 65 SP):
Day  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
Actual|65|58|50|42|35|28|20|15|8 | 0 |
Ideal |65|58|52|46|38|32|26|20|13| 6 |

Interpretation:
- Above ideal line = Behind schedule
- Below ideal line = Ahead of schedule
- Flat section = Blocked (needs intervention)
- Steep drop = High productivity day

---

## 20. DEFINITION OF DONE (DoD)

### Standard DoD (All Stories)
[ ] Code written and follows style guide
[ ] Code runs without errors
[ ] Unit tests written and passing
[ ] Code reviewed by 1+ team member
[ ] PR approved and merged to main
[ ] No new critical/high vulnerabilities
[ ] Acceptance criteria met
[ ] Works in local Docker environment

### Sprint DoD
[ ] All P0 stories completed
[ ] At least 80% of P1 stories completed
[ ] Demo-ready working software
[ ] No P0/P1 bugs open
[ ] CI/CD pipeline green

### Release DoD (Sprint 5)
[ ] All 5 Sprints completed
[ ] Total test coverage >= 80%
[ ] Performance targets met
[ ] Security audit passed
[ ] UAT signed off
[ ] Production deployment complete
[ ] Monitoring configured
[ ] Documentation complete
[ ] Rollback plan documented

---

## 21. AGILE TEAM ROLES & RESPONSIBILITIES

| Role | Person | Key Responsibilities | Full-time? |
|------|--------|---------------------|------------|
| Product Owner | Stakeholder/Manager | Prioritize backlog, define AC | Part-time |
| Scrum Master | Team Lead | Ceremonies, remove blockers | Part-time |
| Backend Dev 1 | Developer | FastAPI, LangGraph, LLM, pipeline | Yes |
| Backend Dev 2 | Developer | Auth, DB, Celery, exports | Yes |
| Frontend Dev | Developer | React/Next.js, Plotly, NLQ chat | Yes |

### RACI Matrix
| Activity | PO | SM | Backend1 | Backend2 | Frontend |
|----------|----|----|----------|----------|---------|
| Backlog Prioritization | A | C | C | C | C |
| Sprint Planning | P | A | P | P | P |
| Development | I | C | P | P | P |
| Code Review | I | C | P | P | P |
| Sprint Review | P | A | P | P | P |
| Retrospective | C | A | P | P | P |
| Testing | I | C | P | P | P |

A=Accountable, P=Participant, C=Consulted, I=Informed

---

## 22. AGILE ESTIMATION (Story Points)

| Points | Effort | Complexity | Example |
|--------|--------|------------|---------|
| 1 | < 1 hour | Trivial | Fix a typo |
| 2 | 2-4 hours | Simple | Add a config value |
| 3 | 4-8 hours | Moderate | Add an API field |
| 5 | 1-2 days | Medium | New API endpoint |
| 8 | 2-3 days | Complex | LangGraph node |
| 13 | 3-5 days | Very Complex | Full LangGraph workflow |
| 21 | > 1 week | Epic | Split into smaller stories |

Estimation: Planning Poker
1. PO presents story
2. Team discusses
3. Each member privately selects points
4. Cards revealed simultaneously
5. Discuss if range > 5, re-vote

---

## 23. QUALITY GATES PER SPRINT

| Gate | When | Who | Pass Criteria |
|------|------|-----|--------------|
| Code Review | Every PR | Any dev | PEP 8, type hints, tests |
| Sprint Review | End of Sprint | PO + Stakeholders | AC met, demo passes |
| Retro | End of Sprint | Team | Action items identified |
| Performance | Weekly | Dev team | Pipeline < 30s/10MB |
| Security | Bi-weekly | Dev team | No critical findings |
| Release | Sprint 5 end | PO + SM | All DoD checked |

---

## 24. AGILE ADAPTATIONS FOR AI PROJECTS

| Challenge | Adaptation |
|-----------|-------------|
| LLM non-determinism | Pin model versions, temperature=0.1 |
| Prompt engineering | Treat prompts as code, version control |
| LLM cost tracking | Add LLM calls as agile metric |
| Model accuracy | Automated accuracy tests on known data |
| Fallback testing | Test with LLM unavailable |
| Groq API changes | Ollama as instant fallback |

AI-specific acceptance criteria format:
Given known dataset with expected relationships
When LangGraph agent runs
Then discovered relationships match expected with >= 0.80 precision

---

## 25. RISK MANAGEMENT IN AGILE

| Risk | Prob | Impact | Mitigation | Sprint |
|------|------|--------|------------|--------|
| Groq API rate limits | Med | High | Request queuing | Sprint 1 |
| LLM hallucination | Med | High | Pydantic + confidence gating | Sprint 2 |
| Performance issues | Med | Med | Profile early, iterate | Sprint 2-3 |
| Team unavailable | Low | High | Cross-train | Sprint 1 |
| E2E issues | Med | Med | CI from Sprint 1 | All |
| Scope creep | Med | Med | Strict backlog, PO accountability | All |

---

## 26. AGILE TOOLS RECOMMENDATION

| Tool | Purpose | Free Tier? |
|------|---------|------------|
| Jira | Sprint planning, velocity | Yes (10 users) |
| GitHub Projects | Kanban board | Yes |
| Slack | Team communication | Yes |
| Confluence | Documentation | Yes (10 users) |
| GitHub Actions | CI/CD pipeline | Yes (2000 min/month) |
| pytest-cov | Test coverage | Free |
| SonarQube | Code quality + security | Yes (Community) |

---

## 27. APPENDICES

### A. Sprint Planning Checklist
Before:
- [ ] Backlog refined and prioritized
- [ ] Stories have acceptance criteria
- [ ] Story points estimated
- [ ] Capacity calculated

During:
- [ ] Sprint goal defined
- [ ] Stories moved to Sprint Backlog
- [ ] Owners assigned
- [ ] Team commits

After:
- [ ] Backlog visible on board
- [ ] Goal communicated to stakeholders
- [ ] Ceremony invites sent

### B. Agile Metrics
| Metric | Formula | Target |
|--------|---------|--------|
| Velocity | Avg SP completed per sprint | 60-80 |
| Sprint Accuracy | (Completed/Committed) x 100 | > 80% |
| Cycle Time | Avg days story from start to done | < 5 days |
| Test Coverage | Lines tested / Total | > 80% |
| Defect Rate | Bugs / Total SP | < 5% |

### C. Sprint 1 Quick-Start Plan

Sprint Goal: Core infrastructure, data models, auth, Docker
Capacity: 3 devs x 10 days = 30 person-days

Day 1: Sprint Planning (2h) -> US-001: Pydantic models
Day 2: US-001 (cont) -> US-003: Docker Compose
Day 3: US-002: Tools -> US-004: FastAPI skeleton
Day 4: US-004 (cont) -> US-005: DB migrations
Day 5: US-006: LLM factory -> US-006 (cont)
Day 6: US-007: Prompt registry -> US-008: JWT auth
Day 7: US-008 (cont) -> US-009: RBAC
Day 8: US-010: Celery -> US-011: API skeleton
Day 9: US-012: Unit tests -> US-012 (cont)
Day 10: Sprint Review + Retro (2h) -> Buffer

---

*End of Agile Framework & Development Report*
*Framework: Hybrid Waterfall-Agile (Waterfall Design + Scrum Implementation)*
*Total User Stories: 65 | Total Sprints: 5 | Total Duration: 10 Weeks*