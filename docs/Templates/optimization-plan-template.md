# Optimization Plan: Medication Safety & Explanation API
 
**Date:** 20 Dec 2025  

**Your Name:** Giorgi Ksovreli
 
---
 
## 1. Which model(s) should I use?
 
### Current Model Usage

- **Model(s) currently using:** `gemini-2.0-flash-exp`

- **Why I chose this model originally:**  

  It provided a good balance between speed and reasoning quality for natural-language medication explanations during initial development.
 
### Task Complexity Analysis

My capstone's queries are:

- [ ] Simple classification (→ Fast model like Haiku)

- [x] Moderate complexity (→ Mid-tier like GPT-4o-mini)

- [ ] Complex reasoning (→ Frontier like GPT-4o)

- [x] **Mixed complexity** (→ Consider cascading)
 
### Error Cost

If my system makes a mistake:

- [ ] Low cost (suggestions, non-critical)

- [x] Medium cost (user annoyance)

- [ ] High cost (medical, legal, financial)
 
**Decision:**  

I should use **multiple Gemini models with cascading (cheap → higher quality)** because chat routing and intent detection are simple, while medication explanations require higher-quality language generation.
 
---
 
## 2. Where should I cache?
 
### Query Patterns

- **Do users ask similar questions?** Yes  

- **Do I have repeated queries in logs?** Yes  

- **Is my context/prompt reused often?** Yes  
 
### Cache Hit Rate Estimate

- **Expected cache hit rate:** ~60–80%  

- **How I estimated this:**  

  Based on repeated `/api/explain` requests for common medications and identical OpenFDA lookups observed during testing.
 
### Cache Strategy

- [ ] Prompt caching  

- [x] **Result caching**  

- [x] **Semantic caching**  

- [ ] No caching needed  
 
**Decision:**  

I should cache **LLM explanations and OpenFDA responses** because medication data and explanations are frequently repeated and change infrequently.
 
---
 
## 3. What's my cost budget?
 
### Current Costs

- **Cost per query:** ~$0.0015  

- **Expected queries per day:** ~270  

- **Monthly projection:** ~$12  

- **Is this sustainable?** Yes (but not at scale)
 
### Cost Breakdown

- Input tokens: 45%  

- Output tokens: 40%  

- Model choice: 10%  

- Other (embeddings, tools): 5%  
 
**Most expensive part:** LLM generation for explanations
 
**Decision:**  

My target monthly cost is **<$5**
 
---
 
## 4. What's acceptable latency?
 
### Current Latency

- **Average response time:** ~1.2 seconds  

- **p95 latency:** ~2.5 seconds  

- **User feedback on speed:** Generally acceptable, but repeated requests were slower.
 
### Use Case Requirements

- [x] **Real-time chat** (<2s required)

- [ ] **Analysis/research** (5–10s OK)

- [ ] **Background processing** (30s+ OK)
 
### Latency Targets

- **Target average:** <1.0 second  

- **Target p95:** <2.0 seconds  

- **Maximum acceptable:** 3.0 seconds  
 
**Decision:**  

I can accept up to **2.5 seconds** latency to save costs: **Yes**
 
---
 
## 5. What will I measure?
 
### Baseline Metrics (BEFORE optimization)
 
| Metric | Value |

|------|------|

| Cost per query | ~$0.0015 |

| Average latency | ~1.2 s |

| p95 latency | ~2.5 s |

| Error rate | <1% |

| Cache hit rate | 0% |

| Model distribution | 100% Gemini Flash |
 
### Success Criteria (AFTER optimization)
 
- **Cost reduction target:** >50%  

- **Latency change acceptable:** <0.5 seconds increase  

- **Quality maintained:** <5% accuracy drop  

- **Cache hit rate:** >60%  
 
**How I'll measure quality:**

- [x] Manual review of responses  

- [x] User feedback  

- [x] Comparison to baseline outputs  

- [x] Golden set evaluation (Week 11)  
 
---
 
## 6. When will I optimize?
 
### Priority Analysis (Week 10 Slide 19 Framework)
 
**🔥 High Priority**

- [x] Costs burning budget (at scale)
 
**⚠️ Medium Priority**

- [x] Preparing for scale  

- [x] Obvious inefficiencies  
 
**My optimization priority:** **Medium**
 
**Justification:**  

Costs are currently low but expected to grow significantly with increased user adoption.
 
---
 
## My Optimization Choice
 
### Chosen Optimization

- [x] **Model Cascading**  

- [x] **Result Caching**  

- [x] **Semantic Caching**  

- [ ] Batching  

- [ ] Other  
 
### Why This Choice?

- High repetition in medication explanations  

- FDA data is mostly static  

- Many queries do not require a high-quality model  

- Low implementation risk with high savings  
 
### Expected Impact

- **Cost reduction:** ~60%  

- **Latency change:** −1.5 seconds  

- **Quality impact:** No change  
 
### Implementation Plan

**Step 1:** Add prompt & response caching for `/api/explain`  

**Step 2:** Cache OpenFDA responses using `lru_cache`  

**Step 3:** Introduce model downgrading for short/simple prompts  
 
### Risks & Mitigation

**Risk 1:** Stale FDA data  

**Mitigation:** TTL-based cache invalidation  
 
**Risk 2:** Reduced explanation quality  

**Mitigation:** Fallback to higher-quality model  
 
---
 
## Next Steps After This Optimization
 
**Second optimization:** Shared Redis cache for multi-instance deployments  

**Third optimization:** Batch LLM calls and async OpenFDA requests  
 
**Path to target cost:**  

$12 current → $5 after optimization 1 → $3 after optimization 2 → $2 target
 
---
 
## Approval Checkpoint
 
**Instructor signature/approval:** giorgi ksovreli  

**Date:** 12.20.2025
 
**Feedback/suggestions:** _____________________

 