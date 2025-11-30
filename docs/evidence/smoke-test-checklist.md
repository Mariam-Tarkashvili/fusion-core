# Smoke Test Checklist

Project: fusion-core
Team: Mariam Tarkashvili, Tekla Chaphidze, Giorgi Ksovreli, Saba Samkharadze, Akaki
Test Date: 2025-11-30
Tested By: Mariam Tarkashvili, Tekla Chaphidze, Giorgi Ksovreli, Saba Samkharadze, Akaki

Smoke testing executed by: Mariam Tarkashvili

This document records a smoke-test pass/fail assessment for Week 8 readiness. Evidence gathered from inspecting the codebase and running a small live check (starting backend server). Where live network calls or LLM calls were required, tests are marked as NOT FULLY EXECUTED and have mitigation plans.

---

## Core Functionality Tests

**Test 1: End-to-End Request Flow**

- What we're testing: User input → System processing → LLM → Response back to user
- How it was tested: Started backend and inspected endpoints. A full end-to-end LLM response could not be completed without a configured Gemini API key.
- Success criteria: Request completes, response relevant
- Result: ❌ FAIL (PARTIAL)

Evidence:

- Server started (Flask dev server output captured):

```
* Serving Flask app 'api'
* Debug mode: on
* Running on http://127.0.0.1:5000
```

(See terminal run when starting backend)

- The backend exposes endpoints: `/api/explain`, `/api/feedback`, `/api/medication-info`, `/api/check-interactions`, `/api/log-query`, `/api/chat` (see `src/backend/app/api.py`).

If FAIL, why?

- The LLM (Gemini) requires `GEMINI_API_KEY` which is not set in the environment during the test. The `generate_explanation` and `chat` flows depend on external API responses (OpenFDA + Gemini) and could not be validated end-to-end.

Mitigation plan:

- Configure `GEMINI_API_KEY` in the environment securely (CI/secret manager). Owner: Backend dev. Due: within 2 days.
- Re-run the exact test with a small known prompt and capture request/response.

---

**Test 2: Error Handling - API Failure**

- What we're testing: System gracefully handles LLM API errors
- How to test: (Not fully executed)
- Result: ❌ FAIL (NOT EXECUTED)

Evidence / Notes:

- `functions.generate_explanation` explicitly returns an error when `GEMINI_API_KEY` is missing: `{"status": "error", "message": "GEMINI_API_KEY not configured"}` (see `src/backend/app/functions.py`). This indicates a predictable failure mode for missing keys.
- The `/api/chat` route wraps Gemini HTTP calls in a try/except and returns a 500 with `{"status": "error", "message": "Gemini request failed"}` and details on exception.

Mitigation plan:

- Add tests to simulate request exceptions (mock `requests.post`) and verify user-facing messages and logs.
- Ensure error messages are user-friendly and not leaking secrets. Owner: Backend dev. Due: next sprint.

---

**Test 3: Error Handling - Invalid Input**

- What we're testing: System validates and rejects invalid user input
- How it was tested: Code inspection
- Success criteria: Invalid inputs rejected before reaching LLM
- Result: ✅ PASS (code-level)

Evidence:

- Pydantic request models in `src/backend/app/models.py` enforce constraints (e.g., `GetMedicationInfoRequest.medication_name` requires non-empty string). The route handlers build models and return `ErrorResponse` with 400 when validation fails.
- Example: `/api/explain` checks for empty `medication_name` and returns a 400 with error payload.

If FAIL, why? N/A

Mitigation plan:

- Add unit tests for invalid inputs to ensure API returns the expected 4xx responses.

---

## Performance Tests

**Test 4: Response Latency - Single Request**

- What we're testing: Acceptable response times
- How it was tested: Not executed (server started but external calls not performed)
- Success criteria: p50 < 5s, p95 < 10s
- Result: ❌ FAIL (NOT EXECUTED)

Evidence:

- No timing measurements captured. The RAG flow calls external OpenFDA and Gemini APIs which will dominate latency.

Mitigation plan:

- Add a small load harness (e.g., a Python script using `requests` to run 5 queries and measure latencies) and execute with a configured API key. Owner: QA. Due: next test run.

---

**Test 5: Cost Tracking**

- What we're testing: Tracks token usage and cost
- Result: ❌ FAIL

Evidence:

- No code paths appear to capture token counts or cost per request. `rag_service.py` invokes external LLM endpoints via `requests` but does not parse or log token usage or cost.

Mitigation plan:

- Implement middleware that records model response metadata (tokens) where the provider returns them, or estimate tokens client-side. Owner: Backend dev. Due: 1 week.

---

## Integration Tests

**Test 6: Database Integration (if applicable)**

- What we're testing: DB reads/writes
- Result: N/A

Evidence:

- The current implementation uses in-memory stores (`_LOG_STORE`, `_FEEDBACK_STORE`) in `src/backend/app/functions.py` and does not connect to an external DB. Marked N/A.

**Test 7: RAG Retrieval (if applicable)**

- What we're testing: Document retrieval works and returns relevant results
- How it was tested: Code inspection; no live OpenFDA calls captured
- Result: ⚠️ PARTIAL

Evidence:

- `RAGService._search_openfda_drug_label` calls OpenFDA: `https://api.fda.gov/drug/label.json` (see `src/backend/app/rag_service.py`).
- `extract_medication_info` and `check_interactions` implement extraction and pairwise checks.

If FAIL, why? N/A (not fully exercised)

Mitigation plan:

- Run live queries with network access and capture retrieved docs and scores. Add unit tests mocking OpenFDA responses. Owner: Backend dev. Due: next sprint.

**Test 8: Function Calling (if applicable)**

- What we're testing: LLM can call defined functions
- Result: ⚠️ PARTIAL

Evidence:

- `/api/chat` builds `tools`/`function_declarations` and parses `functionCall` from Gemini responses to dispatch to local functions (see `src/backend/app/api.py`). Works in principle, but untested against a real Gemini function-calling response.

Mitigation plan:

- Add an integration test that mocks a Gemini response with `functionCall` payload and verifies that the corresponding local function runs and returns expected structured output. Owner: Backend dev. Due: next sprint.

---

## Logging & Observability Tests

**Test 9: Structured Logging**

- What we're testing: JSON structured logs
- Result: ❌ FAIL

Evidence:

- Code uses `print` for OpenFDA API errors and lacks a structured logging library configured (no `logging` with JSON formatter found). See `rag_service.py` where `print(f"OpenFDA API error: {e}")` is used.

Mitigation plan:

- Replace prints with `logging` and add structured JSON formatter (e.g., python-json-logger). Ensure logs include `timestamp`, `request_id`, `event_type`, `latency_ms`, `tokens_used`, `cost_usd` where applicable. Owner: Backend dev. Due: 1-2 sprints.

**Test 10: Request Tracing**

- What we're testing: Trace single request through system
- Result: ❌ FAIL (not implemented)

Evidence:

- No per-request `request_id` is injected/logged. Routes do not generate or propagate trace IDs. (Pydantic models don't include request_id.)

Mitigation plan:

- Add middleware to generate `request_id` and include it in all logs, responses, and downstream requests (OpenFDA/Gemini). Owner: Backend dev. Due: next sprint.

---

## Data Quality Tests

**Test 11: Schema Validation**

- What we're testing: Data matches documented event schemas
- Result: ✅ PASS

Evidence:

- Pydantic models exist and are used in request validation (see `src/backend/app/models.py`). Missing/invalid fields cause 400 responses constructed as `ErrorResponse`.

**Test 12: Data Consistency**

- What we're testing: Data remains consistent across components
- Result: ⚠️ PARTIAL

Evidence:

- In-memory logging exists (`_LOG_STORE`) but there is no cross-checking or durable store. Token counts/costs are not recorded so consistency across logs cannot be validated.

Mitigation plan:

- Add centralized persistence for logs/events and ensure token/cost counters are recorded atomically. Owner: Backend dev. Due: 2 sprints.

---

## Security Tests

**Test 13: API Key Protection**

- What we're testing: Keys not exposed in logs or responses
- Result: ✅ PASS (code-level)

Evidence:

- `GEMINI_API_KEY` is loaded from environment (`os.getenv`) in `src/backend/app/api.py` and `functions.py`.
- `src/backend/.gitignore` contains `.env` so secrets aren't committed.

Check: `src/backend/.gitignore` contains `.env` entry.

**Test 14: Input Sanitization**

- What we're testing: User input sanitized before use
- Result: ⚠️ PARTIAL

Evidence:

- Pydantic constraints strip whitespace and enforce types but there is no explicit HTML escaping or XSS sanitation before returning text to front-end or sending LLM prompts.

Mitigation plan:

- Sanitize or escape user-provided strings before inserting them into HTML contexts. Validate and sanitize any input used in DB queries (not applicable currently). Owner: Backend dev. Due: next sprint.

---

## Summary

- Total Tests: 14
- Passed: 3 ✅ (Test 3, Test 11, Test 13)
- Failed: 5 ❌ (Test 1, Test 2, Test 4, Test 5, Test 9, Test 10) — note some are NOT EXECUTED or PARTIAL
- Not Applicable / Partial: remainder ⚠️
- Pass Rate (strict pass): 3/14 ≈ 21%

**Critical Failures**

- Test 1 (End-to-end LLM flow) - Critical to Week 8 orchestration. Fix: configure API key and run integration tests. Due: ASAP.
- Test 9 (Structured logging) - Critical for observability. Implement structured logging. Due: 1 sprint.

**Action Items**

- Critical: Add secure GEMINI_API_KEY configuration and run E2E test — Owner: Backend dev — Deadline: 2 days — Status: [ ]
- Important: Implement structured JSON logging and `request_id` tracing — Owner: Backend dev — Deadline: 2 sprints — Status: [ ]
- Nice-to-have: Add token/cost accounting middleware — Owner: Backend dev — Deadline: 3 sprints — Status: [ ]

**Week 8 Readiness Assessment**

- Overall Status: [ ] GREEN ✅ [x] YELLOW ⚠️ [ ] RED ❌
- Justification: Core endpoints exist and Pydantic validation is in place, but E2E LLM integration, structured logging, tracing, and cost tracking are not fully validated or implemented. These are necessary for reliable agent orchestration in Week 8.

**Notes**

- Issues Encountered: Could not perform full LLM or OpenFDA retrievals in this run because the environment did not have `GEMINI_API_KEY` set and live API calls were not captured.
- Workarounds Implemented: None — tests that require external APIs are left as partial and include mitigation steps.

**Sign-off**
Completed by: Mariam Tarkashvili, Tekla Chaphidze, Giorgi Ksovreli, Saba Samkharadze, Akaki
Reviewed by Instructor: [Signature/Date]

Ready for Week 8: [ ] YES [x] NO [ ] CONDITIONAL (specify: **\*\***\_**\*\***)
