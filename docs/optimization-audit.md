# Optimization Audit Report

## Project Overview

This capstone is AI powered medical explanation instrument with a Flask-based backend API that provides:
- Plain-language medication explanations
- Medication information retrieval via OpenFDA (RAG)
- Drug–drug interaction checking
- LLM-powered chat with function calling

The system integrates:
- Google Gemini (Flash model) for language generation
- OpenFDA via a custom RAG service
- In-memory Python data structures for logging and feedback

---

## 1. Current State Analysis

### 1.1 API Call Inventory

| Endpoint | Purpose | External Dependencies | Notes |
|--------|--------|----------------------|------|
| `/api/explain` | Generate plain-language medication explanation | OpenFDA + Gemini | Most expensive endpoint |
| `/api/medication-info` | Retrieve medication info | OpenFDA | RAG-based |
| `/api/check-interactions` | Check drug–drug interactions | OpenFDA | Pairwise checks |
| `/api/chat` | Natural language chat + function calling | Gemini | Can trigger other endpoints |
| `/api/log-query` | Log interaction query | None | In-memory |
| `/api/feedback` | Submit user feedback | None | In-memory |

---

### 1.2 LLM Usage

- **Model used:** `gemini-2.0-flash-exp`
- **Invocation pattern:**
  - Direct Gemini calls in `/api/chat`
  - Indirect Gemini calls via `rag.generate_plain_language_explanation()` in `/api/explain`
- **No model switching or fallback logic**
- **No response caching**

---

### 1.3 RAG & External API Usage

- OpenFDA data is retrieved via `RAGService`
- Used for:
  - Medication facts
  - Warnings
  - Side effects
  - Drug–drug interactions
- Repeated OpenFDA calls occur for the same medications
- No batching across requests
- No TTL-based invalidation

---

### 1.4 Baseline Cost Estimation (Pre-Optimization)

Assumptions (based on usage patterns):
- `/api/explain`: ~6,000 requests/month
- `/api/chat`: ~2,000 requests/month
- Average Gemini tokens per explanation: ~600 total
- Gemini Flash pricing (approx.): $0.35 / 1M tokens

Estimated Monthly Cost:
- Explanation generation: ~$12–15
- Chat usage: ~$4–6
- **Total estimated LLM cost:** ~$20/month

While current cost is modest, it scales linearly with usage and lacks safeguards.

---

### 1.5 Latency Baseline

| Endpoint | Avg Latency | Main Contributors |
|-------|------------|------------------|
| `/api/explain` | ~3–4 seconds | OpenFDA + Gemini |
| `/api/chat` | ~3–6 seconds | Gemini |
| `/api/check-interactions` | ~1–2 seconds | OpenFDA |
| `/api/medication-info` | ~1–2 seconds | OpenFDA |

---

### 1.6 Current Caching & Instrumentation

- ❌ No response caching
- ❌ No LLM prompt caching
- ❌ No OpenFDA TTL cache
- ❌ No cost tracking
- ❌ No latency logging
- ✔ In-memory logs for interactions & feedback (non-persistent)

---

## 2. Optimization Opportunities

| # | Opportunity | Description | Projected Impact | Effort |
|--|------------|------------|-----------------|--------|
| 1 | Explanation caching | Cache Gemini explanations per medication | 60–80% LLM reduction | Low |
| 2 | OpenFDA result caching | Cache medication & interaction lookups | 40–60% fewer API calls | Low |
| 3 | Function-level caching | Cache interaction results for same med sets | 30–50% | Medium |
| 4 | Cost instrumentation | Log tokens, latency, cache hits | Observability | Low |
| 5 | Gemini request deduplication | Prevent repeated explanation generation | 20–30% | Low |

---

## 3. Selected Top 3 Optimizations

### 1️⃣ Explanation Response Caching
- Cache output of `generate_explanation(medication_name)`
- Keyed by normalized medication name
- TTL-based invalidation (24–48 hours)

### 2️⃣ OpenFDA RAG Caching
- Cache results of:
  - `extract_medication_info`
  - `check_interactions`
- Prevent repeated external API calls

### 3️⃣ Cost & Latency Instrumentation
- Log:
  - Endpoint
  - Gemini usage
  - Cache hit/miss
  - Response latency

---

## 4. Implementation Plan

### Timeline

| Task | Target |
|----|-------|
| Implement caching | Week 10 |
| Add cost tracking | Week 10 |
| Measure impact | Week 10 |

---

### Success Metrics

- ≥70% reduction in Gemini calls for `/api/explain`
- `/api/explain` cache-hit latency < 300ms
- No degradation in explanation clarity or accuracy

---

### Risk Mitigation

- TTL-based cache expiration
- Conservative cache scope (read-only data)
- Manual validation of cached explanations

---

## 5. Cost Calculator

A spreadsheet-based calculator estimates:
- Request volume
- Average token usage
- Gemini pricing
- Projected savings after caching

**Projected optimized cost:** ~$5–7/month  
**Estimated reduction:** ~65–75%

(Calculator screenshot or link included)
