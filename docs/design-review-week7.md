# Design Review: Week 7

**Team Name:** Fusion Core  
**Project Title:** Medsplain  
**Team Members:** Mariam Tarkashvili, Tekla Chaphidze, Giorgi Ksovreli, Saba Samkharadze, Akaki  
**Date:** November 30, 2025  
**Repository:** [GitHub URL - To be added]

---

## Executive Summary

Medsplain is a healthcare-focused AI application designed to provide reliable medication information and interaction checking capabilities. The system combines retrieval-augmented generation (RAG) with function calling to deliver accurate, contextual responses about medications while maintaining comprehensive audit trails for compliance.

**What we've built:**
We have implemented a Flask-based backend API with multiple endpoints for medication explanation, interaction checking, and chat functionality. The system integrates with Google's Gemini LLM for natural language processing and OpenFDA API for authoritative medication data retrieval. Core Pydantic models enforce data validation, and the architecture supports function calling for structured interaction checks.

**Current state:**
The backend server successfully starts and exposes all planned endpoints (`/api/explain`, `/api/check-interactions`, `/api/chat`, etc.). Request validation through Pydantic models is functional. However, end-to-end LLM integration has not been validated due to missing API key configuration during testing. Structured logging, request tracing, and cost tracking are not yet implemented. The system currently uses in-memory storage for logs and feedback rather than persistent databases.

**Week 8 readiness:** Conditionally Ready ⚠️

**Critical actions before Week 8:**

1. Configure `GEMINI_API_KEY` securely and validate end-to-end LLM request flow
2. Implement structured JSON logging with request ID tracing across all components
3. Add token usage and cost tracking middleware for budget monitoring

---

## 1. Architecture Validation

### 1.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│                    (Frontend - React/Next.js)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Flask Backend API                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ /api/explain │  │ /api/chat    │  │ /api/check-  │         │
│  │              │  │              │  │ interactions │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                  │                  │
│         └─────────────────┼──────────────────┘                  │
│                           ▼                                     │
│              ┌────────────────────────┐                         │
│              │   RAG Service          │                         │
│              │   - Document Retrieval │                         │
│              │   - Context Assembly   │                         │
│              └───────┬────────────────┘                         │
│                      │                                          │
│         ┌────────────┼────────────┐                            │
│         ▼            ▼            ▼                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐                  │
│  │ Function │ │ Pydantic │ │ In-Memory    │                  │
│  │ Service  │ │ Validator│ │ Stores       │                  │
│  └──────────┘ └──────────┘ └──────────────┘                  │
└────────┬─────────────────────────────┬───────────────────────┘
         │                             │
         ▼                             ▼
┌─────────────────┐          ┌─────────────────┐
│  Gemini API     │          │  OpenFDA API    │
│  (Google)       │          │  (gov)          │
│  - LLM          │          │  - Drug Labels  │
│  - Function Call│          │  - Interaction  │
│    Handling     │          │    Data         │
└─────────────────┘          └─────────────────┘
```

### 1.2 Component Descriptions

#### Frontend

- **Technology:** React/Next.js (planned)
- **Purpose:** User interface for medication queries and interaction checks
- **Implementation status:** Planned
- **Key features:** Query input, response display, feedback submission

#### Backend API

- **Technology:** Flask (Python), running on development server
- **Purpose:** REST API endpoints for all medication-related operations
- **Implementation status:** Working (core endpoints implemented)
- **Key features:**
  - `/api/explain` - Medication information with RAG
  - `/api/chat` - Conversational interface with function calling
  - `/api/check-interactions` - Drug-drug interaction checking
  - `/api/medication-info` - Direct OpenFDA lookup
  - `/api/log-query` and `/api/feedback` - Audit and feedback collection

#### RAG Service

- **Technology:** Custom Python service with OpenFDA integration
- **Purpose:** Retrieve authoritative medication information to ground LLM responses
- **Implementation status:** Partial (code exists, not fully tested with live API)
- **Key capabilities:**
  - OpenFDA drug label search and parsing
  - Medication information extraction
  - Drug interaction detection from labels

#### Function Service

- **Technology:** Python functions with Pydantic models
- **Purpose:** Structured data operations for medication checks
- **Implementation status:** Working (code-level, untested end-to-end)
- **Key functions:** `check_multiple_interactions`, `generate_explanation`

#### Data Storage

- **Technology:** In-memory Python dictionaries (`_LOG_STORE`, `_FEEDBACK_STORE`)
- **Purpose:** Temporary storage for query logs and user feedback
- **Implementation status:** Working (in-memory only)
- **Schema:** Pydantic models define structure (see event schemas document)

#### AI/LLM Integration

- **Models used:** Google Gemini (gemini-1.5-pro-002)
- **Purpose:** Natural language understanding, response generation, function calling orchestration
- **Implementation status:** Partial (integration code exists, requires API key for testing)
- **Key capabilities:**
  - Text generation for medication explanations
  - Function calling for structured interaction checks
  - Multi-turn conversation support

### 1.3 Data Flow Description

**Primary Flow: Medication Interaction Check**

1. User submits query via web interface (e.g., "Can I take ibuprofen with warfarin?")
2. Frontend sends POST request to `/api/chat` endpoint
3. Backend validates request using Pydantic models (`ChatRequest`)
4. Backend constructs prompt with system instructions and function declarations
5. Backend sends request to Gemini API with available tools
6. Gemini analyzes query and decides to call `check_multiple_interactions` function
7. Backend receives function call request from Gemini
8. Backend executes local function:
   - Calls RAG service to retrieve OpenFDA data for each medication
   - Analyzes drug labels for interaction warnings
   - Structures results using Pydantic models
9. Backend sends function result back to Gemini
10. Gemini synthesizes final user-friendly response
11. Backend logs interaction (creates audit log entry for compliance)
12. Response sent to frontend with structured data and natural language explanation
13. Frontend displays results to user

**Alternative Flow: Simple Medication Query (RAG without function calling)**

1. User query sent to `/api/explain`
2. Backend extracts medication name
3. RAG service queries OpenFDA directly
4. LLM generates explanation using retrieved context
5. Response returned with citations

### 1.4 Changes from Week 2 Proposal

| Aspect       | Week 2 Proposal           | Week 7 Reality         | Reason for Change                                                        |
| ------------ | ------------------------- | ---------------------- | ------------------------------------------------------------------------ |
| Database     | PostgreSQL for audit logs | In-memory dictionaries | Simplified MVP implementation; plan to add persistence before production |
| LLM Provider | (Not specified)           | Google Gemini          | Selected for function calling capabilities and cost-effectiveness        |
| Hosting      | Cloud deployment planned  | Local Flask dev server | Focus on core functionality before deployment infrastructure             |
| Frontend     | Full React app            | Minimal/planned        | Backend-first development approach                                       |

**Lessons Learned:**

- Starting with in-memory storage accelerated development but creates Week 8 risks for audit trail persistence
- Function calling proved more complex than anticipated; required careful prompt engineering and error handling
- OpenFDA API rate limits and response formats required robust error handling
- Validation through Pydantic models prevented many potential bugs early

**What we would do differently:**

- Set up structured logging from day one rather than using print statements
- Implement request ID tracing earlier to simplify debugging
- Create automated tests alongside features rather than retrofitting

---

## 2. Event Schema Documentation

**Note:** Complete schemas are documented in `event-schemas.md`. This section provides a summary and validation approach.

### 2.1 Core Event Schemas

Our system defines six critical event types that flow through the Medsplain architecture:

#### 1. User Input Event

Captures initial user query with anonymous user tracking for compliance.

**Key Fields:** `event_type`, `timestamp`, `request_id`, `user_query`, `user_id`, `session_id`

**Validation:** User ID must match pattern `^anon_[a-zA-Z0-9]{3,40}$`, query limited to 500 characters

#### 2. LLM Request Event

Documents prompt sent to Gemini including model settings and context.

**Key Fields:** `event_type`, `request_id`, `model`, `messages`, `tools`, `temperature`

#### 3. LLM Response Event

Captures complete LLM response with token counts and latency.

**Key Fields:** `event_type`, `request_id`, `response_text`, `function_calls`, `tokens_used`, `latency_ms`

#### 4. Medication Check Event (Tool Call)

Records when LLM invokes the interaction checking function.

**Key Fields:** `tool_call_id`, `tool_name` (const: "check_multiple_interactions"), `tool_arguments.medications`

**Example:**

```json
{
  "event_type": "tool_call",
  "timestamp": "2025-11-30T10:30:03.600Z",
  "request_id": "req_med123abc456",
  "tool_call_id": "call_xyz789",
  "tool_name": "check_multiple_interactions",
  "tool_arguments": {
    "medications": ["ibuprofen", "warfarin", "lisinopril"]
  },
  "validation_passed": true
}
```

#### 5. Interaction Result Event (Tool Result)

Documents the detailed structured output from interaction checking.

**Key Fields:** `tool_call_id`, `success`, `result.interactions[]`, `result.severity`, `latency_ms`

**Example:**

```json
{
  "event_type": "tool_result",
  "timestamp": "2025-11-30T10:30:04.100Z",
  "request_id": "req_med123abc456",
  "tool_call_id": "call_xyz789",
  "success": true,
  "result": {
    "status": "success",
    "medications": ["ibuprofen", "warfarin"],
    "total_interactions": 1,
    "interactions": [
      {
        "drug1": "ibuprofen",
        "drug2": "warfarin",
        "severity": "major",
        "description": "Increases risk of serious gastrointestinal bleeding.",
        "recommendation": "Avoid combination or use alternative analgesic."
      }
    ],
    "message": "Checked 2 medications for potential interactions."
  },
  "latency_ms": 450
}
```

#### 6. Audit Log Event

Creates compliance-focused log entry for significant clinical queries.

**Key Fields:** `user_id`, `medications`, `interactions_found`, `severity_level`, `log_id`

**Compliance Note:** This event is generated for all major/critical interactions and stored for audit trail purposes per healthcare data retention requirements.

### 2.2 Schema Validation Rules

**Implementation:** Pydantic models in `src/backend/app/models.py`

**Validation Approach:**

- All requests validated on entry to API endpoints
- Type checking enforced (string, integer, datetime, enums)
- String length constraints applied (e.g., medication names max 50 chars)
- Pattern matching for IDs (user_id, request_id)
- Enum validation for severity levels: `["none", "minor", "moderate", "major", "critical"]`

**Error Handling:**

- Invalid requests return 400 status with `ErrorResponse` model
- Validation errors include field name and constraint violated
- No sensitive data exposed in error messages

---

## 3. Smoke Test Results

**Full checklist available in:** `smoke-test-checklist.md`

### 3.1 Test Summary

- **Total tests:** 14
- **Passed:** 3 ✅
- **Failed:** 5 ❌ (some marked NOT EXECUTED or PARTIAL)
- **Partial/Not Applicable:** 6 ⚠️
- **Test date:** November 30, 2025
- **Tested by:** Mariam Tarkashvili

### 3.2 Detailed Results

#### ✅ PASS: Input Validation (Test 3)

**Test:** System validates and rejects invalid user input

**Evidence:**

- Pydantic models enforce constraints in `src/backend/app/models.py`
- Empty medication names rejected with 400 response
- Type mismatches caught before reaching business logic

**Code Reference:**

```python
class GetMedicationInfoRequest(BaseModel):
    medication_name: str = Field(..., min_length=1)
```

**Conclusion:** Input validation layer is robust and prevents malformed requests from reaching LLM or external APIs.

---

#### ✅ PASS: Schema Validation (Test 11)

**Test:** Data matches documented event schemas

**Evidence:**

- All API endpoints use Pydantic models for request/response
- Models match schemas documented in `event-schemas.md`
- Validation errors return structured `ErrorResponse`

**Conclusion:** Data consistency enforced through type system.

---

#### ✅ PASS: API Key Protection (Test 13)

**Test:** API keys not exposed in logs or responses

**Evidence:**

- `GEMINI_API_KEY` loaded from environment variables only
- `.gitignore` includes `.env` file
- No hardcoded secrets found in codebase

**Security Check Passed:** Secrets management follows best practices.

---

#### ❌ FAIL: End-to-End Request Flow (Test 1) - CRITICAL

**Test:** User input → System processing → LLM response

**Evidence:**

```
* Serving Flask app 'api'
* Debug mode: on
* Running on http://127.0.0.1:5000
```

Server starts successfully, but LLM calls fail without API key:

```python
{"status": "error", "message": "GEMINI_API_KEY not configured"}
```

**Why it failed:**

- `GEMINI_API_KEY` not set in test environment
- Could not validate full request/response cycle
- OpenFDA integration untested with live network calls

**Mitigation Plan:**

- **Task:** Configure `GEMINI_API_KEY` in secure environment (CI secrets or .env template)
- **Owner:** Backend dev team
- **Deadline:** Within 2 days (before Week 8 lab)
- **Validation:** Run end-to-end test with known query and capture logs showing successful LLM response

---

#### ❌ FAIL: Error Handling - API Failure (Test 2)

**Test:** System gracefully handles LLM API errors

**Evidence:**

- Error handling code exists in `/api/chat`:

```python
try:
    # Gemini API call
except Exception as e:
    return jsonify({"status": "error", "message": "Gemini request failed"}), 500
```

- Generic error messages returned
- No specific test cases executed

**Why it failed:**
Not fully executed due to missing API key. Error paths not validated with real failures.

**Mitigation Plan:**

- **Task:** Add unit tests mocking API exceptions (timeout, rate limit, invalid response)
- **Owner:** Backend dev team
- **Deadline:** Next sprint
- **Validation:** Verify user-friendly error messages and proper logging

---

#### ❌ FAIL: Response Latency (Test 4) - CRITICAL

**Test:** Measure p50, p95, p99 latencies

**Success Criteria:** p50 < 5s, p95 < 10s

**Evidence:** No timing measurements captured

**Why it failed:**

- Could not execute without live API calls
- OpenFDA + Gemini latency dominate response time but unmeasured

**Mitigation Plan:**

- **Task:** Create load test script (5-10 queries) measuring end-to-end latency
- **Owner:** QA/Backend team
- **Deadline:** Before Week 8 lab
- **Measurement approach:**
  - Use `time.time()` or `timeit` to capture request duration
  - Log latency for each component (RAG retrieval, LLM call, total)
  - Calculate percentiles from sample

---

#### ❌ FAIL: Cost Tracking (Test 5) - CRITICAL

**Test:** System tracks token usage and calculates costs

**Evidence:** No token counting or cost calculation found in codebase

**Why it failed:**

- Gemini API returns token counts in response metadata but not parsed
- No middleware to accumulate costs per request
- Critical for Week 8 budget monitoring with agent loops

**Mitigation Plan:**

- **Task:** Implement cost tracking middleware
  1. Parse `usage_metadata` from Gemini responses
  2. Calculate cost: `(input_tokens * $0.00125 + output_tokens * $0.005) / 1000`
  3. Log costs per request and accumulate daily totals
- **Owner:** Backend dev team
- **Deadline:** 1 week
- **Validation:** Confirm logs include `tokens_used` and `cost_usd` fields

---

#### ❌ FAIL: Structured Logging (Test 9) - CRITICAL

**Test:** JSON structured logs for all events

**Evidence:**
Current logging uses `print` statements:

```python
print(f"OpenFDA API error: {e}")
```

No structured logger configured.

**Why it failed:**

- Relies on print debugging rather than proper logging framework
- Logs not machine-readable
- Missing critical fields: `timestamp`, `request_id`, `event_type`

**Mitigation Plan:**

- **Task:** Replace all `print` with `logging` module using JSON formatter
- **Implementation:**

```python
import logging
from pythonjsonlogger import jsonlogger

logger = logging.getLogger()
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)

logger.info("OpenFDA API call", extra={
    "request_id": request_id,
    "event_type": "external_api_call",
    "service": "openfda",
    "latency_ms": latency
})
```

- **Owner:** Backend dev team
- **Deadline:** 1-2 sprints
- **Validation:** All logs parseable as JSON with required fields

---

#### ❌ FAIL: Request Tracing (Test 10) - CRITICAL

**Test:** Trace single request through entire system

**Evidence:** No `request_id` generation or propagation

**Why it failed:**

- Pydantic models don't include request_id
- No middleware to inject trace IDs
- Cannot correlate logs across components

**Mitigation Plan:**

- **Task:** Add request ID middleware

```python
import uuid

@app.before_request
def add_request_id():
    g.request_id = str(uuid.uuid4())
    logger.info("Request started", extra={"request_id": g.request_id})

# Include in all downstream calls and logs
```

- **Owner:** Backend dev team
- **Deadline:** Next sprint
- **Validation:** All logs for a single request share same request_id

---

#### ⚠️ PARTIAL: RAG Retrieval (Test 7)

**Test:** Document retrieval returns relevant results

**Evidence:**

- Code exists in `rag_service.py` for OpenFDA queries
- Not tested with live API calls

**Status:** Implementation complete, requires network testing

**Mitigation:** Execute integration test with real OpenFDA calls and verify retrieved documents contain expected medication information.

---

#### ⚠️ PARTIAL: Function Calling (Test 8)

**Test:** LLM successfully invokes defined functions

**Evidence:**

- `/api/chat` builds function declarations for Gemini
- Function dispatch logic implemented
- Not tested with real Gemini function calling response

**Status:** Code complete, requires end-to-end validation

**Mitigation:** Mock Gemini response with `functionCall` payload and verify local function execution.

---

### 3.3 Evidence Files

**Stored in:** `docs/evidence/` (to be created)

Planned evidence artifacts:

- `server_start_log.txt` - Flask startup output
- `api_key_error.log` - Missing API key error message
- `pydantic_validation_test.py` - Input validation unit tests
- `end_to_end_test_results.json` - After API key configuration

---

## 4. Performance Baseline

### 4.1 Test Methodology

**Status:** NOT COMPLETED - Tests blocked by missing API key configuration

**Planned Approach:**

- **Test date:** To be executed within 2 days
- **Sample size:** 25 requests minimum for statistical validity
- **Test environment:**
  - Local development machine (specs: to be documented)
  - Network: WiFi connection to OpenFDA and Gemini APIs
- **Test inputs:** Mix of query types:
  - Simple medication lookups (5 queries)
  - Drug interaction checks with 2 medications (10 queries)
  - Complex interaction checks with 3+ medications (10 queries)
- **Measurement tools:** Python `time.perf_counter()` for latency, Gemini response metadata for tokens

### 4.2 Latency Analysis

**Status:** PENDING - Awaiting API key configuration

**Target Metrics:**

| Metric       | Target | Rationale                         |
| ------------ | ------ | --------------------------------- |
| p50 (median) | < 3s   | Acceptable for medical queries    |
| p95          | < 5s   | Most requests complete reasonably |
| p99          | < 10s  | Edge cases don't timeout          |
| Average      | < 4s   | Overall user experience           |

**Projected Bottlenecks:**

1. **OpenFDA API latency** - External service, network-dependent (estimated 200-800ms)
2. **Gemini API latency** - LLM inference time (estimated 1-3s for typical responses)
3. **Drug interaction analysis** - Multiple OpenFDA calls for multi-drug queries (scales with number of medications)

**Optimization Strategies (for implementation):**

- Cache OpenFDA responses for common medications (TTL: 24 hours)
- Parallelize OpenFDA queries for multiple medications
- Implement request timeout (10s) with clear error message
- Add Redis or in-memory cache for repeated queries

### 4.3 Token Usage Analysis

**Status:** NOT IMPLEMENTED - Token tracking required

**Projected Usage (based on prompt engineering):**

| Query Type          | Est. Input Tokens | Est. Output Tokens | Total   |
| ------------------- | ----------------- | ------------------ | ------- |
| Simple lookup       | 100-150           | 150-250            | 250-400 |
| 2-drug interaction  | 150-200           | 200-300            | 350-500 |
| 3+ drug interaction | 200-300           | 250-400            | 450-700 |

**Variability Factors:**

- System prompt length (constant ~80 tokens)
- Retrieved OpenFDA context (variable 50-150 tokens per medication)
- User query length (average ~15 tokens, max 125 tokens for 500 char limit)
- Function calling overhead (~50 tokens for tool definitions)

**Optimization Opportunities:**

- Compress system prompt without losing critical instructions
- Truncate OpenFDA context to most relevant sections only
- Use stop sequences to prevent overly verbose responses
- Implement streaming for long responses (future enhancement)

### 4.4 Cost Analysis

**Status:** PROJECTED - Based on Gemini pricing

**Gemini Pricing (gemini-1.5-pro-002):**

- Input: $1.25 / 1M tokens
- Output: $5.00 / 1M tokens

**Projected Cost per Request:**

| Component                   | Cost Calculation | Est. Cost   |
| --------------------------- | ---------------- | ----------- |
| LLM Input (avg 200 tokens)  | 200 × $1.25 / 1M | $0.00025    |
| LLM Output (avg 250 tokens) | 250 × $5.00 / 1M | $0.00125    |
| OpenFDA API                 | Free tier        | $0.00       |
| **Total per request**       |                  | **$0.0015** |

**Usage Extrapolation:**

| Daily Users | Queries/User | Daily Requests | Daily Cost | Monthly Cost |
| ----------- | ------------ | -------------- | ---------- | ------------ |
| 100         | 10           | 1,000          | $1.50      | $45          |
| 1,000       | 10           | 10,000         | $15.00     | $450         |
| 10,000      | 10           | 100,000        | $150.00    | $4,500       |

**Week 8 Agent Loop Impact:**

- Current: 1 LLM call per user request
- Agent loop: 5-15 LLM calls per user request (iterative planning, execution, reflection)
- **Projected cost multiplier:** 10x
- **1,000 users/day with agents:** $150/day = **$4,500/month**

**Budget Assessment:**

- **Current usage:** Sustainable for MVP/testing
- **Agent orchestration:** Concerning - requires cost controls
- **Mitigation required:** Yes

**Cost Optimization Strategies:**

1. **Caching:** Store responses for identical queries (reduce repeated LLM calls by ~30%)
2. **Tiered models:** Use cheaper model (Gemini Flash) for simple queries, Pro for complex interactions
3. **Early termination:** Stop agent loops when confidence threshold met
4. **Rate limiting:** Cap queries per user to prevent abuse
5. **Batch processing:** Combine multiple medication checks in single LLM call where possible

### 4.5 Comparison to Week 2 Projections

**Status:** Week 2 estimates not documented - cannot compare

**Post-implementation analysis (after testing):**

- Document actual vs. expected performance
- Identify largest estimation errors
- Lessons learned for future capacity planning

---

## 5. Hypothesis Validation

### 5.1 Hypothesis Statement

**Hypothesis:** Implementing RAG (retrieval-augmented generation) with OpenFDA data will improve medication information accuracy by at least 20% compared to baseline LLM responses without external data, while maintaining acceptable latency (< 5s p95).

**Rationale:**

- LLMs trained on general corpora may have outdated or incomplete medication information
- OpenFDA provides authoritative, up-to-date drug labeling directly from manufacturers
- Grounding LLM responses in retrieved facts should reduce hallucinations and improve clinical accuracy

### 5.2 Test Methodology

**Status:** NOT EXECUTED - Blocked by missing API key

**Planned Test Design:**

**Sample size:** 50 medication queries (25 for accuracy, 25 for interaction checks)

**Control group:** Baseline Gemini responses without RAG

- Query LLM directly with medication question
- No OpenFDA context provided
- Record response and evaluate accuracy

**Treatment group:** Gemini with RAG

- Retrieve OpenFDA drug label
- Include relevant sections in LLM context
- Record response and evaluate accuracy

**Evaluation method:**

1. **Accuracy scoring:** Compare responses to FDA-approved drug labels (ground truth)

   - Correct indication/usage: 1 point
   - Correct dosage information: 1 point
   - Correct side effects mentioned: 1 point
   - No hallucinated information: 1 point
   - **Total: 4 points per query**

2. **Interaction accuracy:** Compare to known drug interaction databases
   - Correct identification of interaction: 1 point
   - Correct severity classification: 1 point
   - Actionable recommendation: 1 point
   - **Total: 3 points per interaction check**

**Blind evaluation:** Yes - responses randomized and labeled A/B, evaluated without knowing which is RAG-enhanced

**Test Data Selection:**

- 25 common medications across therapeutic categories
- 25 medication pairs with known interactions (10 major, 10 moderate, 5 minor)
- Selected to represent realistic user queries

### 5.3 Results

**Status:** PENDING EXECUTION

**Projected Results (based on preliminary observations):**

| Condition          | Expected Accuracy | Expected Latency | Expected Cost |
| ------------------ | ----------------- | ---------------- | ------------- |
| Baseline (no RAG)  | 60-70%            | 1.5-2.5s         | $0.0010       |
| With RAG           | 85-95%            | 3-4s             | $0.0020       |
| **Expected Delta** | **+20-30%**       | **+1.5s**        | **+$0.0010**  |

**Qualitative Predictions:**

- RAG should eliminate medication name hallucinations
- Interaction warnings should match FDA labels exactly
- Dosage information should cite specific label sections
- Side effects should be comprehensive (not just common ones)

**Expected Patterns:**

- Greatest improvement for rare/recently approved medications
- Minimal improvement for well-known drugs (aspirin, ibuprofen) where LLM knowledge is already accurate
- Interaction checks should show dramatic improvement (baseline LLM has limited interaction data)

### 5.4 Analysis & Conclusions

**Status:** TO BE COMPLETED AFTER TESTING

**Planned Analysis:**

1. Calculate accuracy improvement percentage
2. Statistical significance testing (t-test on accuracy scores)
3. Latency vs. accuracy tradeoff analysis
4. Cost-benefit assessment
5. Error pattern analysis (what types of errors does RAG eliminate?)

**Hypothesis Validation Criteria:**

- **Supported:** Accuracy improvement ≥ 20%, p < 0.05, latency acceptable
- **Partially Supported:** Accuracy improvement 10-19% OR latency > 5s
- **Not Supported:** Accuracy improvement < 10% OR unacceptable latency/cost

**Implications for Week 8:**

- If supported: RAG is core to architecture, optimize retrieval for agent loops
- If partial: Consider hybrid approach (RAG only for complex queries)
- If not supported: Pivot to alternative approaches (fine-tuning, knowledge graphs)

### 5.5 Supporting Data

**To be collected:**

- `accuracy_results.csv` - Scores for each test query
- `latency_measurements.json` - Timing breakdown by component
- `example_outputs/` - Sample responses showing RAG improvements
- `error_analysis.md` - Classification of remaining errors

---

## 6. Readiness Assessment

### 6.1 Week 8 Agent Orchestration Readiness

**Overall Status:** YELLOW ⚠️ (Conditionally Ready)

**Definition:** Ready with specific critical fixes completed before Week 8 lab. Core architecture is sound, but observability and validation gaps must be addressed.

### 6.2 Detailed Assessment

#### Can your system handle 5-20x more API calls?

**Current state:**

- Single-threaded Flask dev server
- No connection pooling for external APIs
- No request queuing or rate limiting
- In-memory storage (not designed for high throughput)

**Agent loop implications:**
Agent orchestration will generate 5-15 LLM calls per user request instead of 1. For 100 concurrent users, this means 500-1500 simultaneous API requests.

**Assessment:** ❌ NO (with current infrastructure)

**Reasoning:**

- Flask dev server not production-ready (single-threaded, no WSGI server)
- No concurrent request handling implemented
- Will likely timeout or crash under 20x load
- OpenFDA and Gemini APIs may rate-limit us
