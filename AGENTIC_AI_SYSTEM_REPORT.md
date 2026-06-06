# AutoInsight AI — Agentic AI System Report
**Document Version:** 1.0  
**Date:** June 6, 2026  
**Subject:** Detailed Code Analysis of the 7 Agentic AI Files

---

## 1. Introduction

The core value of **AutoInsight AI** lies in its **Agentic AI Architecture**. While deterministic code (like Polars and SciPy) performs calculations, the Agentic layer makes decisions, reasons about column meanings, and generates insights.

This report analyzes the **7 key files** that compose the Agentic AI system, detailing their code responsibilities, key methods, and data inputs/outputs.

---

## 2. Core Agentic Files Analysis

```
                                  ┌────────────────────────┐
                                  │   prompt_registry.py   │
                                  └───────────┬────────────┘
                                              │ Loads Prompts
                                              ▼
┌────────────────────────┐        ┌────────────────────────┐
│     llm_factory.py     │ ◄────► │   LangGraph Agents     │
│   (Groq / Pydantic)    │        │  (stage3_langgraph,    │
└────────────────────────┘        │   phase2_sub_agents)   │
                                  └───────────┬────────────┘
                                              │ Orchestrates
                                              ▼
                                  ┌────────────────────────┐
                                  │     Orchestrators      │
                                  │   (pipeline, report)   │
                                  └───────────┬────────────┘
                                              │ Queries
                                              ▼
                                  ┌────────────────────────┐
                                  │      nlq/chat.py       │
                                  │    (User Chat Agent)   │
                                  └────────────────────────┘
```

---

### File 1: LLM Factory Bridge
* **File Link:** [llm_factory.py](file:///d:/mvk%20data%20analyasis/source%20code/backend/llm_factory.py)
* **Agentic Role:** **The Brain Connection** — Handles HTTP connections to the Groq API and formats output as structured Pydantic models.
* **Key Class:** `LLMFactory`
* **Key Methods:**
  * `__init__(provider, temperature, max_tokens, max_retries, timeout)`: Instantiates the LLM client. Since we locked it, it defaults to `groq` and configures `ChatGroq`.
  * `with_structured_output(pydantic_model)`: Wraps the LLM chain using LangChain's JSON mode to force the model to output valid JSON matching a target Pydantic class.
  * `invoke_agent(system_prompt, user_prompt, output_model, variables)`: The main caller. Formats inputs, calls `ChatGroq.ainvoke()`, and parses the result into `output_model` with exponential backoff on failure.
* **Inputs/Outputs:**
  * **Input:** Prompt strings, variables dict, and a Pydantic class target `Type[T]`.
  * **Output:** Validated Pydantic model instance (`T`).

---

### File 2: Prompt Registry
* **File Link:** [prompt_registry.py](file:///d:/mvk%20data%20analyasis/source%20code/backend/prompt_registry.py)
* **Agentic Role:** **The Instructions** — Manages and stores the text templates (system & user prompts) that direct the AI.
* **Key Class:** `PromptRegistry`
* **Key Methods:**
  * `get_prompt(name, version)`: Fetches a prompt template. In production, this checks the PostgreSQL (now Convex) `prompts` table with a Redis cache fallback. If not found, it falls back to hardcoded defaults in the file.
* **Inputs/Outputs:**
  * **Input:** Prompt name string (`name`) and version number (`version`).
  * **Output:** Prompt template text string.

---

### File 3: LangGraph Core Agent (Relationship Discovery)
* **File Link:** [stage3_langgraph_agent.py](file:///d:/mvk%20data%20analyasis/source%20code/backend/pipeline/stage3_langgraph_agent.py)
* **Agentic Role:** **The Primary Analyst Agent** — Runs a 4-node LangGraph workflow to discover relationships and generate derived column formulas.
* **Key Classes:** 
  * `AgentState`: Tracks DataFrame, statistical profile, candidates, relationships, and execution times.
  * `Stage3_LangGraphAgent`: The runner class.
* **Key Methods:**
  * `run(df)`: Sequential execution of the 4 nodes: `profile_step` ➔ `discover_step` ➔ `_reason_step_with_gate` ➔ `executor_step`.
  * `reason_step(state)`: Formats data statistics and candidates, fetches `core_agent_system` prompt, and queries the LLM for relationship classifications.
  * `_validate_gate(state)`: Verifies confidence scores ($\ge 0.65$), prevents duplicate pairs, and checks syntax.
  * `_fallback_reason_step(state)`: Deterministic fallback using math correlations when the LLM fails.
* **Inputs/Outputs:**
  * **Input:** Cleaned Polars DataFrame.
  * **Output:** Pydantic `UnifiedDataModel` containing confirmed relationships and derived columns.

---

### File 4: Report Sub-Agents
* **File Link:** [phase2_sub_agents.py](file:///d:/mvk%20data%20analyasis/source%20code/backend/report/phase2_sub_agents.py)
* **Agentic Role:** **The Writing Staff** — A group of 8 parallel sub-agents that concurrently generate different sections of the analytical report.
* **Key Class:** `Phase2_SubAgents`
* **Key Methods:**
  * `run(data_profile, udm)`: Prepares 8 asyncio tasks and runs them in parallel using `asyncio.gather()`. If any sub-agent throws an error, it intercepts it and generates a deterministic fallback section.
  * `_run_single_agent(section_type, variables)`: Queries Groq using a specific prompt template mapped to the section type (e.g. `report_insights`), returning a `SubAgentOutput`.
  * `_generate_fallback_section(section_type, data_profile)`: Generates rule-based markdown text if the AI fails.
* **Inputs/Outputs:**
  * **Input:** Pydantic `DataProfile` (statistical summary) and `UnifiedDataModel`.
  * **Output:** A list of `ReportSection` Pydantic models containing markdown content, title, and confidence.

---

### File 5: Report Engine Orchestrator
* **File Link:** [orchestrator.py](file:///d:/mvk%20data%20analyasis/source%20code/backend/report/orchestrator.py)
* **Agentic Role:** **The Managing Editor** — Coordinates the 4-phase report generation engine.
* **Key Class:** `ReportOrchestrator`
* **Key Methods:**
  * `generate_report(unified_data_model, title, report_id)`: Manages the 4 report generation phases:
    1. *Phase 1:* Deterministic Profiling (`Phase1_Profiling`).
    2. *Phase 2:* Concurrently invokes the 8 sub-agents (`Phase2_SubAgents`).
    3. *Phase 3:* Section Validation & Confidence Gating (`Phase3_Validation`).
    4. *Phase 4:* Merging, formatting exports (HTML/PDF), and saving to Convex (`Phase4_Export`).
* **Inputs/Outputs:**
  * **Input:** Pydantic `UnifiedDataModel`.
  * **Output:** Pydantic `ReportBundle` (saved to database).

---

### File 6: Pipeline Orchestrator
* **File Link:** [orchestrator.py](file:///d:/mvk%20data%20analyasis/source%20code/backend/pipeline/orchestrator.py)
* **Agentic Role:** **The Pipeline Director** — Coordinates the overall 4-stage data processing pipeline and broadcasts progress events.
* **Key Class:** `PipelineOrchestrator`
* **Key Methods:**
  * `run_pipeline(file_path, pipeline_id, skip_cleaning)`: Moves data sequentially through:
    * *Stage 1:* CSV Parsing & Schema Inference.
    * *Stage 2:* Data Cleaning (missing values, PII masking).
    * *Stage 3:* LangGraph Agent (Relationship discovery).
    * *Stage 4:* Column Engineering (Executing formulas).
  * It logs status updates and progress increments directly to the cache so the frontend can display a real-time progress bar.
* **Inputs/Outputs:**
  * **Input:** Staged file path and a unique `pipeline_id`.
  * **Output:** Saves the finalized `UnifiedDataModel` to Convex and returns a status summary.

---

### File 7: NLQ Chat Engine
* **File Link:** [chat.py](file:///d:/mvk%20data%20analyasis/source%20code/backend/nlq/chat.py)
* **Agentic Role:** **The User Conversationalist** — A conversational interface that converts natural language queries into executable SQL code.
* **Key Class:** `NLQChatEngine` (stub/foundation)
* **Expected Methods:**
  * `parse_intent(query, schema)`: Parses user questions to identify target metrics, dimensions, and filter boundaries.
  * `generate_sql(intent, schema)`: Generates read-only SQL statements to run against the DuckDB database sandbox.
  * `execute_query(sql)`: Runs the query safely with a timeout, returning structured results.
  * `generate_response(results, query)`: Summarizes the query output in natural language and generates dashboard chart specifications.
* **Inputs/Outputs:**
  * **Input:** User query text, dataset ID, and active conversation thread history.
  * **Output:** `NLQResponse` Pydantic model (text explanation, SQL code, Vega-Lite chart schema, and raw result rows).

---

*End of Report*  
*Prepared for MVK Data Analysis — Agentic AI Component Blueprint.*
