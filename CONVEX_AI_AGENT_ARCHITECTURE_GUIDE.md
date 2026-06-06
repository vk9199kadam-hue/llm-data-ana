# AutoInsight AI — Core AI Agent Architecture Guide

This guide explains how the AI Agents in this project work in terms of actual code. It breaks down the system into two core agent workflows:
1. **The 4-Node LangGraph Agent** (Relationship discovery & calculations).
2. **The 8 Parallel Sub-Agents** (Concurrently writing sections of the report).

---

## 1. The Core Agent Workflow (LangGraph)

The primary agent lives in [stage3_langgraph_agent.py](file:///d:/mvk%20data%20analyasis/source%20code/backend/pipeline/stage3_langgraph_agent.py). It operates as a stateful graph built using **LangGraph**. The agent moves your data through **4 steps (Nodes)**:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     Node 1      │       │     Node 2      │       │     Node 3      │       │     Node 4      │
│  profile_step   │ ➔ ➔ ➔ │  discover_step  │ ➔ ➔ ➔ │   reason_step   │ ➔ ➔ ➔ │  executor_step  │
│ (Deterministic) │       │ (Deterministic) │       │ (LLM Gated reasoning)   │ (Deterministic) │
└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
                                                             │
                                                             ▼ (Gate Fails?)
                                                             ├── Retry loop (Max 3)
                                                             └── Fallback Engine
```

### Node 1: `profile_step` (Deterministic Python)
* **What it does:** Uses standard Python libraries (**Polars** and **SciPy**) to analyze the columns in the uploaded CSV.
* **Why it's deterministic:** We do not call the LLM here. Sending raw data to the LLM is slow, expensive, and risks hallucination. Instead, Python computes the math (means, standard deviations, column cardinality, null percentages).

### Node 2: `discover_step` (Deterministic Python)
* **What it does:** Finds potential correlation or key overlap candidates.
* **How it works:** It computes Pearson (linear correlation) and Spearman (rank correlation) matrices. It also looks for overlap in column values (e.g. if column A has values `[1, 2, 3]` and column B has `[1, 2, 3]`, they might have a Relationship). It outputs a list of "relationship candidates".

### Node 3: `reason_step` (The AI Agent - LLM Required)
* **What it does:** This is the only step that invokes the LLM. It takes the candidate relationships and schema stats, and asks **Groq (Qwen 2.5 72B)** to make a logical business decision.
* **The Code Interaction:**
  The Python code passes the schema, candidates, and statistical data to the LLM and demands a structured JSON response matching a Pydantic model (`relationships` and `derived_columns`):
  ```python
  response = await self.llm_factory.invoke_agent(
      system_prompt=system_prompt,
      user_prompt=f"Analyze these candidates and validate them...\nSchema: {schema_metadata}",
      output_model=self._create_output_model()
  )
  ```
* **The Validation Gate:**
  Before accepting the LLM's answer, Python runs a strict validation gate (`_validate_gate`). The gate checks:
  1. Did the LLM output at least 1 relationship?
  2. Is the confidence score for every relationship $\ge 0.65$?
  3. Are all column references real columns in the dataset?
* **Retry & Fallback:**
  If the gate fails, Python automatically waits (exponential backoff) and retries (up to 3 times). If it still fails, it launches a **Deterministic Fallback Engine** (`_fallback_reason_step`) that extracts relationships using pure correlation math without the LLM, ensuring the system never crashes.

### Node 4: `executor_step` (Deterministic Python)
* **What it does:** The LLM might recommend creating new calculated columns (e.g. `pl.col("revenue") - pl.col("cost")`).
* **How it works:** Python reads the recommended formula string, checks it against an AST (Abstract Syntax Tree) sandbox to ensure it has no malicious commands (like trying to delete files on your computer), executes the Polars expression on the DataFrame, and adds the new column to the dataset.

---

## 2. The 8 Parallel Sub-Agents (Report Engine)

When writing the business report in [phase2_sub_agents.py](file:///d:/mvk%20data%20analyasis/source%20code/backend/report/phase2_sub_agents.py), we want to write 8 distinct sections. To do this quickly, we launch **8 separate sub-agents at the exact same time (concurrently)**.

### How Concurrency Works in Python:
Instead of running Agent 1, waiting 5 seconds, running Agent 2, waiting 5 seconds, etc. (which would take 40 seconds), we use `asyncio.gather`:

```python
# 1. Prepare tasks for all 8 agents
tasks = []
for section_type in ALL_SECTION_TYPES:
    task = self._run_agent_with_retry(
        section_type=section_type,
        data_profile=data_profile,
        udm=udm,
    )
    tasks.append(task)

# 2. Run all 8 concurrently
results = await asyncio.gather(*tasks, return_exceptions=True)
```
* **Result:** All 8 queries are sent to Groq simultaneously. Groq processes them in parallel, returning the entire 8-section report in **under 5 seconds** instead of 40.
* **Error Isolation:** If one agent fails or returns bad JSON, Python catches the error for *that agent only* and generates a deterministic rule-based fallback section for that specific part, while keeping the other 7 successfully generated AI sections.

---

## 3. How Python Code Interacts with the LLM

There are three key layers that govern the interaction between your local Python code and the LLM API:

```
┌──────────────────────────┐      HTTP REST      ┌──────────────────────────┐
│   FastAPI Python Code    │ ➔ ➔ ➔ ➔ ➔ ➔ ➔ ➔ ➔  │   Groq API (Cloud) /     │
│   (Formats Prompt &      │                     │   Ollama (Local)         │
│    Structured Model)     │ 🔌 🔌 🔌 🔌 🔌 🔌   │                          │
│                          │ 💳 💳 💳 💳 💳 💳   │                          │
│   (Validates response    │ 📋 📋 📋 📋 📋 📋   │   (Generates structured  │
│    against Pydantic)     │ 🔓 🔓 🔓 🔓 🔓 🔓   │    JSON response text)   │
└──────────────────────────┘      HTTP REST      └──────────────────────────┘
```

### Layer 1: Prompt Templating
The prompts are not hard-coded string templates. They are loaded dynamically from a versioned database/registry in [prompt_registry.py](file:///d:/mvk%20data%20analyasis/source%20code/backend/prompt_registry.py). Python formats variables (like statistical JSON tables) directly into these templates before invoking the LLM.

### Layer 2: Structured JSON Mode (`with_structured_output`)
To prevent the LLM from outputting conversational filler (like *"Here is the analysis you requested..."*), we force it to output structured JSON matching a Pydantic blueprint:
```python
class SubAgentOutput(BaseModel):
    section_type: str
    title: str
    content: str
    confidence: float
    key_findings: List[str]
    chart_hints: List[Dict[str, Any]]
```
We tell the LangChain/Groq driver to use `json_mode` with this model. Under the hood, the API uses a mechanism (often called tool-calling / function-calling) that constrains the LLM to output key-value JSON matching the fields in our Pydantic class.

### Layer 3: Pydantic Validation & Exception Handling
Once the JSON text returns, Python runs it through the Pydantic parser:
```python
parsed = output_model.model_validate_json(cleaned_json_string)
```
If the LLM forgot a field or returned a string where a number was expected, Pydantic raises a `ValidationError`. The Python code catches this error, prints a warning, and executes a retry with exponential backoff.

---

## 4. Key Takeaways for a Beginner

1. **Deterministic-First:** Never use an LLM for math. Let Python (Polars/SciPy) do the math, and send only the mathematical *results* to the LLM to write the business summary.
2. **Gating & Safeties:** Always validate AI outputs. Never trust that the LLM will return valid JSON or correct column references; write validation code to check its work.
3. **Concurrency is King:** When dealing with multiple independent tasks (like generating different report sections), use Python's `asyncio.gather` to run them in parallel to save time.
4. **Sandboxed Code Execution:** If the LLM generates code or formulas to be executed locally, sanitize them (e.g. check for imports, file writes, or system commands) before running them.
