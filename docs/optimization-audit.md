# Optimization Audit Report
**Project:** Medication Safety & Explanation API  
**Lab:** Lab 8 

---

## Part 1: Cost Audit & Baseline  
### Objective
Understand the current operational cost, latency, and API usage patterns of the capstone backend before optimization.

---

## 1. Current State Analysis

### 1.1 API Call Inventory

The backend is implemented using Flask and integrates **Gemini (LLM)** and **OpenFDA** via a RAG-style service.

| Endpoint | LLM Model | External APIs | Description |
|--------|----------|---------------|-------------|
| `/api/explain` | `gemini-2.0-flash-exp` | OpenFDA | Generates plain-language medication explanations |
| `/api/chat` | `gemini-2.0-flash-exp` | OpenFDA (via functions) | Chat endpoint with function calling |
| `/api/medication-info` | None | OpenFDA | Retrieves medication data via RAG |
| `/api/check-interactions` | None | OpenFDA | Checks drug–drug interactions |
| `/api/log-query` | None | None | In-memory logging |
| `/api/feedback` | None | None | In-memory feedback storage |

**LLM Usage Summary**
- LLM calls occur in:
  - `/api/explain`
  - `/api/chat`
- No batching
- No caching
- Single model used for all LLM tasks
- No cost or latency instrumentation

---

### 1.2 Baseline Cost Calculation (Monthly Projection)

**Assumptions**
- `/api/explain`: 6,000 requests/month  
- `/api/chat`: 2,000 requests/month  
- Avg input tokens per LLM call: 500  
- Avg output tokens per LLM call: 300  

**Gemini 2.0 Flash Estimated Cost**
- Estimated cost per request: ~$0.0015  
- Total monthly LLM requests: 8,000  

**Estimated Monthly Cost**
8,000 × $0.0015 ≈ $12.00 / month


> This cost is expected to grow rapidly with user adoption and increased explanation requests.

---

### 1.3 Latency Measurements (Estimated)

| Endpoint | p50 | p95 | p99 |
|--------|-----|-----|-----|
| `/api/explain` | ~1.2s | ~2.5s | ~4.0s |
| `/api/chat` | ~900ms | ~2.0s | ~3.5s |
| RAG (OpenFDA only) | ~300ms | ~600ms | ~1.0s |

*Note: Latency is dominated by LLM generation time.*

---

### 1.4 Current Cache Status

- ❌ No prompt caching
- ❌ No response caching
- ❌ No OpenFDA response caching
- ❌ No TTL or invalidation strategy

---

## Part 2: Caching Opportunities

### Objective
Reduce repeated LLM and OpenFDA calls through prompt and response caching.

---

### Identified Cacheable Patterns

1. Repeated medication explanations (`/api/explain`)
2. Repeated OpenFDA lookups for common medications
3. Static system prompts sent to Gemini
4. Identical chat prompts triggering function calls

---

## Part 3: Model Selection Strategy

### Objective
Reduce cost by matching model complexity to task complexity.

---

### Use Case Categorization

| Task | Complexity | Current Model |
|----|-----------|---------------|
| Medication explanation | Medium | Gemini 2.0 Flash |
| Chat routing / intent | Simple | Gemini 2.0 Flash |
| FDA data retrieval | Simple | No LLM |
| Interaction lookup | Simple | No LLM |

---

### Model Optimization Opportunities

- Use cheaper Gemini variants for:
  - Chat routing
  - Function selection
- Reserve higher-quality models only for:
  - Plain-language explanations
- Add fallback logic (cheap → expensive model)

---

## Part 4: Optimization Opportunities

### Identified Opportunities

| # | Optimization | Projected Savings | Effort | Notes |
|--|-------------|------------------|--------|------|
| 1 | Prompt caching for explanations | 60–80% | Low | High repetition |
| 2 | OpenFDA response caching | 30–50% | Low | FDA data rarely changes |
| 3 | Model downgrading for chat | 40–60% | Medium | Needs validation |
| 4 | Cost tracking instrumentation | Indirect | Low | Required for visibility |
| 5 | Rate limiting + deduplication | 10–20% | Medium | Prevents abuse |

---

### Prioritization Justification

Optimizations were prioritized based on:
- Cost impact
- Ease of implementation
- Low risk to output quality

---

## Implementation Plan

### Top 3 Selected Optimizations

1. **Prompt & Response Caching**
2. **Model Selection & Downgrading**
3. **Cost Tracking Instrumentation**

---

### Team Assignments

| Task | Owner |
|----|------|
| Caching implementation | Mariam Tarkashvili |
| Model selection & testing | Tekla Chapidze |
| Cost tracking & logging | Saba Samkharadze |

---

### Timeline

| Date | Task |
|----|-----|
| Week 10 Lab | Audit + planning |
| Week 10 HW | Implement caching |
| Week 10 HW | Add cost tracking |
| Week 10 HW | Model optimization |

---

### Success Metrics

| Metric | Baseline | Target |
|-----|---------|--------|
| Monthly LLM cost | ~$12 | <$5 |
| Avg `/api/explain` latency | ~1.2s | <900ms |
| Cache hit rate | 0% | >60% |

---

### Risk Mitigation

- TTL-based cache invalidation
- Model fallback for degraded quality
- Manual QA on explanation outputs

---

## Cost Calculator

A spreadsheet-based cost calculator was created to compare:
- Current state vs optimized state
- Token usage
- Model pricing
- Request volume

**Link:** `docs/cost-calculator.xlsx`  
*(or screenshot included below)*

---

