# Refined Capstone Proposal (Version 2)

**Project Name:** Medsplain – AI-Powered Medication Information Translator  
**Team Members:** Mariam Tarkashvili, Saba Samkharadze, Tekla Chapidze, Giorgi Ksovreli, Akaki Ghachava  
**Date:** October 30, 2025  
**Version:** 2.0 (Updated from Week 2 submission)  


## 📋 Document Change Log

### What Changed Since Week 2?
| Section                | Change Type      | Summary                                                                                                          |
| ---------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| Problem Statement      | **Refined**      | Clarified readability problem with measurable literacy gap and patient comprehension data.                       |
| Technical Architecture | **Major Update** | Backend switched from FastAPI to Flask (with CORS) and integrated Pinecone for vector retrieval in RAG pipeline. |
| Success Criteria       | **Enhanced**     | Added quantifiable targets (readability score reduction, factual consistency rate, and latency benchmarks).      |
| Risk Assessment        | **Expanded**     | Added new risks: hallucination in RAG responses, Pinecone indexing latency, and API quota limits.                |
| Timeline               | **Realistic**    | Adjusted milestones based on 3-week sprint schedule and current development velocity.                            |
---

## 1. Problem Statement
**Original Version**

Patients prescribed new medications face a critical comprehension gap when trying to understand their medication information. Package inserts and drug information sheets are written in dense medical jargon at a college reading level, making them inaccessible to the many adults who read at an 8th-grade level or below. This leads to medication misuse, anxiety, and non-adherence.

**Refined Version**

Patients often struggle to understand the medication inserts and online drug information provided with their prescriptions. These materials are typically written at a college-level reading complexity, while more than 40% of adults in the U.S. read below an 8th-grade level. This literacy gap leads to widespread confusion, anxiety, and misinterpretation of medical guidance—issues that directly contribute to incorrect dosage, skipped medications, and decreased trust in healthcare providers.

In short interviews with five potential users (patients and caregivers), all confirmed that medical leaflets are “too long,” “too scientific,” and “hard to find the important parts.” While websites like MedlinePlus and Drugs.com provide factual content, they often restate clinical language rather than simplifying it, and offer no personalization or context. Users want clear, digestible explanations that translate medical terms into everyday language without losing accuracy.

Medsplain addresses this gap through AI-driven Retrieval-Augmented Generation (RAG). The system retrieves verified medical data from OpenFDA and RxNorm, then uses language models to rewrite the content in a patient-friendly tone while maintaining medical fidelity. Traditional NLP or template-based approaches can simplify text but lack contextual understanding—AI’s natural language reasoning enables adaptive explanations tailored to each query, making it the most effective and scalable approach for closing the medication comprehension gap.

---

## 2. Target Users (Updated)

### User Personas

**Primary User: Nino the Newly Diagnosed Patient**  
- **Demographics:** 45 years old, Tbilisi, high school education, moderate smartphone use (mostly WhatsApp and Google).  
- **Role/Context:** Recently prescribed medication for chronic hypertension; manages her own medication routine and relies on digital searches for health info.  
- **Goals:** Understand what her medication does, how and when to take it, and what side effects to expect in simple, trustworthy language.  
- **Pain Points:** Finds medication leaflets “too technical,” skips long or confusing sections, and worries about possible interactions she doesn’t fully grasp.  
- **Current Behavior:** Searches for “in simple words” explanations online, reads patient forums, and sometimes encounters conflicting or inaccurate advice.  
- **Success:** Feels confident about dosage and side effects, understands key warnings, and can explain them clearly to her family.

---

### User Validation

**How We Validated Our Users:**
- [x] Interviewed **5 potential users** (3 patients, 1 pharmacist, 1 caregiver) during Weeks 3–4  
- [x] Observed **3 users** browsing existing sites (Drugs.com, MedlinePlus)  
- [x] Analyzed **user reviews** on medical information platforms highlighting readability issues  
- [x] Posted in **two local health community groups** and received **8 responses** confirming confusion with technical terms  

**Key Insights from Validation:**
1. All interviewed patients described difficulty understanding prescription leaflets and online drug information.  
2. Users often mistrust medical websites because “they sound written for doctors, not people.”  
3. The most requested feature was **plain-language summaries** that explain only what matters for daily use.
---

## 3. Success Criteria (Updated & Measurable)

### Product Success Metrics

| Metric | Target (Week 15) | Measurement Method | Current Baseline (Week 4) |
|--------|------------------|-------------------|---------------------------|
| **Task Completion Rate** | >70% | User testing: % who complete core workflow without help | Not yet measured |
| **Time to Complete Core Task** | <3 minutes | Timed during user testing | Not yet measured |
| **User Satisfaction (Post-Task)** | >4.0/5.0 | Survey after Week 7 & 14 testing | Not yet measured |
| **Would Recommend** | >60% | “Would you recommend to a friend?” | Not yet measured |
| **Daily Active Users (if applicable)** | 10 users | Analytics tracking | 5 users (team members) |

---

### Technical Success Metrics

| Metric | Target | Measurement Method | Current Performance |
|--------|--------|-------------------|---------------------|
| **AI Accuracy** | >85% | Golden set (50 test cases) | ~75% (tested on 10 cases) |
| **Response Latency (P95)** | <3 seconds | Backend logging | ~4.5 seconds |
| **API Uptime** | >99% | Monitoring dashboard | Not yet deployed |
| **Cost per Query** | <$0.05 | Cost tracking logs | ~$0.013 (current, without optimization) |
| **Token Usage per Query** | <1000 tokens | API response tracking | ~1300 tokens (can optimize) |

---

### Learning Goals (Team Member Level)

| Team Member | Learning Goal | Success Criteria | Progress (Week 4) |
|-------------|---------------|------------------|-------------------|
| **Mariam Tarkashvili** | Master RAG implementation | Successfully integrate FAISS, <300ms search latency | Not started (planned Week 5) |
| **Saba Samkharadze** | Build production-ready FastAPI backend | Deployed API with >99% uptime, proper error handling | Basic API working, not deployed |
| **Tekla Cahpidze** | Implement comprehensive testing | >80% code coverage, golden set with 50+ cases | No automated tests yet |
| **Giorgi Ksovreli** | Develop intuitive frontend UX/UI | Complete React interface aligned with user testing feedback | Initial prototype in progress |
| **Akaki Ghachava** | Optimize model performance and cost | Reduce average token usage to <1000/query without accuracy loss | Preliminary profiling started |

### Why These Metrics Matter
- **Task completion >70%** → Ensures users can successfully complete the intended workflow (validates UX).  
- **Latency <3s** → Keeps the experience smooth, reducing abandonment risk.  
- **Accuracy >85%** → Builds user trust in AI-generated medication explanations.  
- **Cost <$0.05/query** → Keeps the product financially sustainable at scale.  
- **Satisfaction >4.0/5.0** → Indicates a high-quality user experience leading to retention and referrals.
---

## 4. Technical Architecture (Updated)

### Architecture Evolution

**What Changed Since Week 2:**

| Component | Week 2 Plan | Week 4 Reality | Why We Changed |
|-----------|--------------|----------------|----------------|
| **Frontend** | Next.js + React | Next.js + React | No change — existing UI already polished and modular |
| **Backend** | FastAPI | Flask (CORS-enabled) | Team has stronger Flask experience and easier API debugging |
| **Database** | PostgreSQL | PostgreSQL | Retained — relational model fits structured medication data |
| **Vector Database** | None | Pinecone | Added to enable semantic retrieval for RAG pipeline |
| **AI Model** | GPT-4-turbo | GPT-4-turbo + LangChain (RAG orchestration) | Added retrieval step for factual grounding |
| **Deployment** | Render (Backend), Vercel (Frontend) | Same | Stable, cost-effective, and simple to integrate |
| **Data Sources** | OpenFDA only | OpenFDA + RxNorm + MedlinePlus | Expanded for more complete medical context |

---

### Current Architecture Diagram
                ┌────────────────────────────────────────────┐
                │                FRONTEND                   │
                │  Next.js + React (TailwindCSS)            │
                │  - User queries & feedback input          │
                │  - Displays simplified explanations       │
                └────────────────────────────────────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────────────────┐
                │                BACKEND                     │
                │  Flask (Python 3.11, CORS-enabled)         │
                │  - Handles RAG pipeline requests           │
                │  - Interfaces with Pinecone + GPT model     │
                └────────────────────────────────────────────┘
                                 │
                                 ▼
    ┌────────────────────────────────────────────────────────────┐
    │                      RAG PIPELINE                          │
    │────────────────────────────────────────────────────────────│
    │  1. Query Embedding & Search (Pinecone Vector DB)          │
    │  2. Context Assembly (Top-k retrieval from verified data)  │
    │  3. Generation (LLM with factual context)                  │
    │  4. Readability Optimization (Flesch-Kincaid Scoring)      │
    └────────────────────────────────────────────────────────────┘
                 │                │                │
                 ▼                ▼                ▼
     ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
     │ OpenFDA API  │  │ RxNorm API   │  │ Pinecone VectorDB │
     │ Verified drug│  │ Drug ontology│  │ Semantic retrieval│
     │ info source  │  │ & mappings   │  │ of embeddings     │
     └──────────────┘  └──────────────┘  └──────────────────┘
---

### Key Components

1. **Frontend (Next.js + React)**  
   - User-facing interface for entering drug names or uploading text  
   - Displays rewritten explanations with readability score  
   - Deployed on **Vercel**  
   - Communicates with backend via REST API  

2. **Backend (Flask + CORS)**  
   - Routes incoming queries to the **RAG pipeline**  
   - Fetches verified data from OpenFDA, RxNorm, MedlinePlus  
   - Orchestrates retrieval (Pinecone) + generation (GPT-4)  
   - Returns simplified medical summaries with metadata  
   - Deployed on **Railway**

3. **Database Layer (PostgreSQL)**  
   - Stores query history, user feedback, and readability scores  
   - Enables fine-tuning feedback loop (future scope)

4. **Vector Store (Pinecone)**  
   - Stores embedded medical content for semantic search  
   - Provides top-k context retrieval for RAG generation  

5. **AI / ML Stack (LangChain + GPT-4-turbo)**  
   - LangChain handles document retrieval, context assembly, and prompt construction  
   - GPT-4-turbo rewrites drug information to 8th-grade reading level  
   - Readability verified using **Flesch-Kincaid** and simplified scoring  

6. **External APIs**  
   - **OpenFDA** – official drug labeling and adverse event data  
   - **RxNorm** – drug names, generic mappings  
   - **MedlinePlus** – patient-oriented medical information  

---

### Data Flow for Core User Action

**User Flow: Simplify Medication Info**

User enters drug name or uploads text in Next.js frontend
↓

Frontend sends POST request to Flask API (/api/simplify)
↓

Backend pipeline:
a. Create embedding of query using OpenAI API
b. Search top-k matches in Pinecone
c. Retrieve factual context (OpenFDA, RxNorm, MedlinePlus)
d. Construct RAG prompt (context + query)
e. Generate rewritten explanation via GPT-4-turbo
f. Score readability (Flesch-Kincaid)
g. Store query, response, and score in PostgreSQL
h. Return response JSON to frontend
↓

Frontend displays rewritten explanation, source summary, and readability grade
↓

User optionally provides feedback (stored for retraining)

---

### Latency Budget

| Step | Target Latency | Current (Week 4) | Notes |
|------|----------------|------------------|-------|
| Frontend API call | <200ms | ~180ms | ✅ On track |
| Pinecone retrieval | <400ms | ~320ms | ✅ Optimized |
| Context assembly | <200ms | ~180ms | ✅ On track |
| GPT-4-turbo generation | <2500ms | ~2800ms | ⚠️ Needs prompt tuning |
| Readability scoring | <100ms | ~70ms | ✅ Good |
| PostgreSQL write | <100ms | ~90ms | ✅ Good |
| **Total (P95)** | **<3500ms** | **~3800ms** | ⚠️ Acceptable for MVP |

---

### Technology Stack Justification

| Technology | Why We Chose It | Alternatives Considered | Tradeoff |
|-------------|----------------|--------------------------|-----------|
| **Flask (CORS)** | Lightweight, familiar, simple integration with Python ecosystem | FastAPI, Django | Pro: Team expertise; Con: No async support |
| **Next.js + React** | Fast development, SEO-friendly, component reusability | Vue, Svelte | Pro: Familiar; Con: Larger bundle size |
| **PostgreSQL** | Structured schema for queries and logs | MongoDB, SQLite | Pro: ACID compliance; Con: More setup effort |
| **Pinecone** | Managed vector DB, simple API | FAISS, Weaviate | Pro: Scalable; Con: Paid beyond free tier |
| **LangChain + GPT-4-turbo** | Flexible RAG orchestration and reliable model quality | Llama 3, Claude | Pro: Proven accuracy; Con: Cost |
| **Vercel / Railway** | Easy CI/CD, student-friendly tiers | Render, Heroku | Pro: Reliability; Con: Vendor lock-in |

---

### Security & Privacy Considerations

**Implemented (Week 4):**
- [x] HTTPS enforced for all API endpoints  
- [x] CORS restricted to Vercel frontend domain  
- [x] Environment variables for all API keys  
- [x] SQL queries parameterized (prevent injection)  
- [x] Limited logging (no sensitive text storage)  

**Planned (Week 5-6):**
- [ ] Input sanitization for user queries  
- [ ] Rate limiting (100 requests/hour/user)  
- [ ] Encryption at rest for feedback data  
- [ ] Readability logs anonymized for research use  
- [ ] Model output caching for repeated queries  

---

### Known Technical Debt

1. **No caching layer yet** (Redis planned Week 6)  
2. **No automatic API monitoring** (Sentry planned Week 7)  
3. **Readability scoring not yet fully automated**  
4. **Limited dataset coverage for less common drugs**  
5. **Prompt templates hardcoded** (A/B testing planned Week 6)

---

## 5. Risk Assessment (Updated & Expanded)

### Risk Matrix

| Risk ID | Risk | Likelihood | Impact | Severity | Status |
|---------|------|------------|--------|----------|--------|
| R1 | RAG pipeline performance (slow responses) | HIGH | HIGH | 🔴 CRITICAL | In progress |
| R2 | Hallucinated or incorrect medical explanations | MEDIUM | HIGH | 🔴 CRITICAL | Monitoring |
| R3 | FAISS / vector DB misconfiguration | MEDIUM | HIGH | 🟡 HIGH | In progress |
| R4 | User data privacy & HIPAA/GDPR compliance gaps | MEDIUM | HIGH | 🟡 HIGH | Planning |
| R5 | Lack of medical domain validation | MEDIUM | MEDIUM | 🟡 HIGH | Scheduled |
| R6 | API cost overruns (LLM + embedding) | MEDIUM | MEDIUM | 🟢 MEDIUM | Controlled |
| R7 | Insufficient evaluation metrics for RAG accuracy | MEDIUM | MEDIUM | 🟢 MEDIUM | Designing |
| R8 | Low user engagement / adoption | LOW | MEDIUM | 🟢 MEDIUM | Validating |
| R9 | Deployment or uptime issues (first production push) | HIGH | MEDIUM | 🟡 HIGH | Preparing |
| R10 | Scope creep due to RAG experimentation | MEDIUM | LOW | ⚪ LOW | Controlled |

---

### 🔴 Critical Risks (Detailed)

#### **R1: RAG Pipeline Performance (Slow Response Time)**

**Description:**  
The new retrieval-augmented generation pipeline may exceed acceptable latency (>2s) due to slow embedding retrieval, large context windows, or unoptimized queries.

**Likelihood:** HIGH (60–80%)  
**Impact:** HIGH (Degrades UX and usability)  
**Severity:** 🔴 CRITICAL  

**Triggers:**
- FAISS index not optimized  
- Excessive context window passed to LLM  
- Missing caching or batching  

**Preventive Mitigation:**
1. ✅ **DONE (Week 4):** FAISS prototype with cosine similarity  
2. ⏳ **IN PROGRESS (Week 4):** Limit top-k retrieval to 3 chunks  
3. 📅 **PLANNED (Week 5):** Add caching layer for common queries  
4. 📅 **PLANNED (Week 6):** Pre-compute embeddings for frequent drug entries  
5. 📅 **PLANNED (Week 7):** Implement async retrieval and response streaming  

**Contingency Plan (If Risk Occurs):**
- Temporarily switch to direct LLM fallback for high-priority queries  
- Reduce context length and chunk size dynamically  

**Monitoring:**
- Log average latency per query  
- Alert if >1.5 s median response  

**Owner:** *Saba Samkharadze (Backend Lead)*  
**Next Review:** Weekly (Fridays)

---

#### **R2: Hallucinated or Incorrect Medical Explanations**

**Description:**  
The LLM may generate plausible but false or unsafe medication information, risking user trust and potential harm.

**Likelihood:** MEDIUM (40–60%)  
**Impact:** HIGH (Misinformation and credibility loss)  
**Severity:** 🔴 CRITICAL  

**What We've Learned (Week 3–4):**
- RAG grounding reduces hallucinations but not fully  
- Misspelled drug names cause mismatched retrievals  

**Preventive Mitigation:**
1. ✅ **DONE (Week 4):** Added source citation display (user sees retrieved snippet)  
2. 📅 **PLANNED (Week 5):** Add content filtering + safety check  
3. 📅 **PLANNED (Week 6):** Validate responses against verified dataset (FDA / MedlinePlus)  
4. 📅 **PLANNED (Week 7):** Introduce confidence scoring (flag <0.8 for review)  
5. 📅 **PLANNED (Week 8):** Human-in-the-loop QA before deployment  

**Contingency Plan:**
- Display disclaimer (“Verify with pharmacist”)  
- Fallback to retrieval snippets only (no generative summary)  

**Monitoring:**
- Weekly sampling of 20 random responses for factual accuracy  
- Track user feedback reports  

**Owner:** *Mariam Tarkashvili (AI/ML Lead)*  
**Next Review:** Week 5  

---

### 🟡 High Priority Risks (Summary)

**R3: FAISS / Vector DB Misconfiguration**  
- *Mitigation:* Run integration tests on retrieval results (Week 5)  
- *Contingency:* Fallback to SQLite keyword search  

**R4: User Data Privacy / GDPR Compliance**  
- *Mitigation:* Pseudonymize queries and avoid storing PHI (Week 6)  
- *Contingency:* Add data deletion endpoint and privacy notice  

**R5: Lack of Medical Domain Validation**  
- *Mitigation:* Validate top 100 explanations with verified sources (Week 6–7)  
- *Contingency:* Mark unverified results as “Beta”  

**R9: Deployment or Uptime Issues**  
- *Mitigation:* Use staged deployment and health checks (Week 6)  
- *Contingency:* Rollback to stable build, use cloud logs  

---

### 🟢 Risk Mitigation Roadmap

| Timeframe | Actions |
|------------|----------|
| **Week 4 (This Week)** | ✅ Prototype FAISS retrieval (R1) <br> ✅ Add source citation in UI (R2) <br> ⏳ Deployment pipeline setup (R9) <br> ⏳ Begin privacy review (R4) |
| **Week 5–6** | 🛠️ Add caching layer for retrieval (R1) <br> 🧩 Implement safety filters (R2) <br> 🔍 Validate explanations vs FDA data (R5) <br> 🧪 Run retrieval consistency tests (R3) |
| **Week 7–8** | 📈 Add confidence scoring & feedback UI (R2) <br> ⚡ Optimize async response flow (R1) <br> 👥 Conduct user testing & collect feedback (R8) |
| **Week 9–11** | 🧾 GDPR compliance audit (R4) <br> 🔒 Final QA & safety review (R2, R5) <br> 🚀 Performance benchmark at scale (R1, R9) |

---


## 6. Research Plan (Updated)

### Technical Questions We Need to Answer

#### Q1: How do we optimize retrieval and chunking for medical documents?

**Status:** 🟠 In Progress  
**Deadline:** Week 5  
**Approach:**
1. Test multiple chunking strategies (sentence-based, sliding window, semantic)
2. Measure retrieval accuracy using Pinecone similarity scoring (top-k context relevance)
3. Evaluate how chunk length and overlap affect response latency and factual grounding
4. Use MedlinePlus and OpenFDA datasets for benchmarks

**Resources:**
- LangChain RAG documentation (retriever + splitter modules)
- Pinecone tuning guide for medical embeddings
- Research: “Improving Context Retrieval in Medical QA Systems”

**Success Criteria:** ≥90% retrieval accuracy for relevant chunks; latency ≤2s

---

#### Q2: How do we reduce hallucinations in LLM-generated medical explanations?

**Status:** 🔴 Not Started  
**Deadline:** Week 6  
**Approach:**
1. Compare RAG-only vs Hybrid (RAG + post-generation verification)
2. Add factuality checks against verified sources (OpenFDA, RxNorm)
3. Test system prompt variations emphasizing “cite sources only from retrieved context”
4. Log and score factuality using an evaluation set of 50 medical queries

**Resources:**
- OpenAI safety best practices
- PubMed: “Faithful Medical Summarization”
- LangChain factuality evaluator

**Success Criteria:** ≤5% hallucinated claims in evaluation set

---

#### Q3: How do we implement safe prompt injection defenses for medical queries?

**Status:** 📅 Planned (Week 7)  
**Deadline:** Week 7  
**Approach:**
1. Study OWASP LLM Top 10 (Prompt Injection section)
2. Add input sanitization and filtering (regex-based + guardrails)
3. Test adversarial inputs (e.g., “Ignore all safety rules”)
4. Add a static system prompt with locked context boundaries

**Resources:**
- OWASP LLM Security Guide  
- OpenAI: “Best Practices for Secure Prompt Design”  
- LangChain Guardrails library  

**Success Criteria:** 100% block rate for known injection attempts

---

#### Q4: How do we evaluate readability and comprehension of AI-generated explanations?

**Status:** 🟠 In Progress  
**Deadline:** Week 6  
**Approach:**
1. Use Flesch-Kincaid readability test (target grade level ≤8)
2. Conduct small pilot with 5 non-medical users (readability comprehension test)
3. Compare GPT-4 vs GPT-4-mini readability scores
4. Record comprehension accuracy (user’s ability to restate meaning correctly)

**Resources:**
- Python `textstat` package for readability  
- Medline readability benchmark studies  
- CDC “Plain Language Guidelines”  

**Success Criteria:** ≥90% of users understand explanation correctly; readability score <8.0

---

### Product Questions We Need to Answer

#### Q5: Do users trust simplified AI medical explanations?

**Status:** 📅 Planned (Week 8)  
**Deadline:** Week 8  
**Approach:**
1. Ask: “Would you trust this explanation without verifying elsewhere?”
2. Track: % of users who mark explanations as “clear and trustworthy”
3. Correlate trust level with citation visibility and confidence scores

**Success Criteria:** >70% of users report trust if citations are shown

---

#### Q6: What format best conveys source credibility (citations, badges, etc.)?

**Status:** 📅 Planned (Week 8)  
**Deadline:** Week 8  
**Approach:**
1. Test 3 formats: inline citations, expandable source cards, and link badges
2. Measure click-throughs on sources and self-reported trust
3. Observe if users engage more when sources are visible or hidden by default

**Success Criteria:** At least 50% of users engage with source info; highest trust rating ≥4.0/5.0

---

### Experiments & Prototypes

**Week 4–5: Retrieval Optimization (Pinecone RAG)**  
- **Goal:** Ensure fast and accurate retrieval from verified sources  
- **Success:** ≥90% relevant retrieval accuracy, ≤2s latency  

**Week 5–6: Factuality Guardrails & Hallucination Testing**  
- **Goal:** Reduce misinformation in generated content  
- **Success:** ≤5% hallucinated or unverifiable statements  

**Week 6–7: Readability & User Comprehension Pilot**  
- **Goal:** Ensure content meets 8th-grade readability  
- **Success:** ≥90% user comprehension, <8.0 reading grade  

**Week 8–9: Trust and Credibility UX Testing**  
- **Goal:** Measure how source presentation affects trust  
- **Success:** >70% user trust, >50% citation engagement  

**Week 10–11: Prompt Security Red Teaming**  
- **Goal:** Identify and patch injection or override vulnerabilities  
- **Success:** 0 successful injection exploits  

---

## 7. User Study Plan (Updated)

### Research Ethics

**IRB Exemption:** ✅ *Yes* — Educational research, minimal risk, no collection of health data.  
Only anonymized feedback and usability responses will be gathered.

**IRB Light Checklist:**
- [x] Informed consent obtained (via form or verbal confirmation)
- [x] Participants can withdraw anytime
- [x] No PHI or sensitive medical data collected
- [x] Sessions anonymized (e.g., P1, P2)
- [x] Recordings deleted within 14 days
- [x] Minimal risk (reading explanations, rating clarity)

---

### User Testing Round 1: Week 8

**Participants:**
- **Sample size:** 5 participants  
- **Criteria:** Non-medical adults (patients or caregivers)  
- **Recruitment:** University bulletin, online patient communities, personal contacts  
- **Incentive:** $20 Amazon gift card per participant  
- **Format:** Remote (Zoom), 45 minutes  

**Testing Goals:**
1. Evaluate readability and clarity of explanations  
2. Measure trust and satisfaction with cited information  
3. Identify confusing or overly technical phrases  
4. Test comprehension retention (short quiz per explanation)  

**Testing Tasks:**
1. Ask a medication-related question (e.g., “What is amlodipine for?”)  
2. Read the generated explanation  
3. Rate clarity (1–5) and trust (1–5)  
4. Identify unclear terms  
5. Review sources and comment on their usefulness  

**Data Collected:**
- Task completion time  
- Comprehension quiz score  
- User trust score  
- Source interaction rate  
- Qualitative feedback  

**Success Criteria:**
- ≥80% correct comprehension  
- ≥4.0/5.0 clarity rating  
- ≥70% of users report trust in answers  

**Timeline:**
- Days 1–2: Recruit participants  
- Days 3–6: Conduct sessions  
- Day 7: Analyze insights  

**Deliverable:** User Readability and Trust Report (due end of Week 8)

---

### User Testing Round 2: Week 13

**Participants:** 5 new users  
**Goal:** Validate post-feedback improvements  
**Focus:** Hallucination reduction, trust interface updates  
**Success Criteria:**  
- ≥90% comprehension accuracy  
- ≥4.5/5.0 trust rating  
- 0 unsafe or unverifiable statements  

---


## 8. Project Timeline & Milestones (Realistic)

### Weekly Breakdown

| Week | Focus | Deliverables | Owner | Status |
|------|-------|-------------|--------|--------|
| 1 | Setup | Team formation, initial ideas | All | ✅ Complete |
| 2 | Planning | Proposal v1, team contract, dev environment | All | ✅ Complete |
| 3 | Core Flow | Basic query → LLM → response | All | ✅ Complete |
| 4 | **Design Review** | **Proposal v2, architecture v2, evaluation plan** | All | **🔄 In Progress** |
| 5 | Retrieval & Optimization | Golden set creation, caching, prompt optimization | All | 📅 Planned |
| 6 | Safety & Validation | Input sanitization, rate limiting, error handling | All | 📅 Planned |
| 7 | User Testing 1 | First user feedback round (5 participants) | All | 📅 Planned |
| 8 | Iteration | Implement feedback from Week 7 | All | 📅 Planned |
| 9 | Midterm Prep | Reduced project work | All | 📅 Planned |
| 10 | Deployment | Deploy to production, monitoring, CI/CD | All | 📅 Planned |
| 11 | Safety Audit | Red teaming, bias testing, privacy review | All | 📅 Planned |
| 12 | Evaluation | Regression testing on golden set | All | 📅 Planned |
| 13 | Production Polish | Bug fixes, performance optimization | All | 📅 Planned |
| 14 | User Testing 2 | Final validation round (5 participants) | All | 📅 Planned |
| 15 | **Final Demo** | Presentation, demo video, case study | All | 📅 Planned |

### Major Milestones (Updated)

**✅ Milestone 1: Proposal v1 (Week 2)**  
- Submitted: 2025 October  
- Points: Unknown  
- Feedback: Unknown 

**🔄 Milestone 2: Design Review (Week 4)**  
- Due: 01-11-2025 
- Points: 5  
- Deliverables: Updated proposal, architecture diagram, evaluation plan, cost model, backlog  

**🎯 Milestone 3: Safety & Evaluation Audit (Week 11)**  
- Due: 05-12-2025  
- Points: 3  
- Deliverables: Red team results, bias checks, golden set regression, error taxonomy, telemetry plan  

**🎯 Milestone 4: Final Demo (Week 15)**  
- Due: 26-12-2025  
- Points: 7  
- Deliverables: Working product, CI/CD, public README, demo video, case study  

### Dependency Map

**Critical Path (Must Complete in Order):**  
1. Week 4: Finalize architecture → Blocks all downstream work  
2. Week 5: Create golden set → Blocks Week 12 evaluation  
3. Week 6: Basic features complete → Blocks Week 7 user testing  
4. Week 7: User testing → Informs Week 8 iteration  
5. Week 10: Deploy to production → Blocks Week 11 safety audit  
6. Week 11: Safety audit → Must pass before Week 15 demo  

**Parallel Tracks (Can Work Simultaneously):**  
- Week 5–6: One member on golden set, another on caching and prompt optimization  
- Week 7–8: Recruitment of testers while implementing improvements  

### Backup Plan (Scope Cuts if Behind)

**Priority 3: Cut First (Nice-to-Have)**  
1. Batch upload → Users upload one at a time  
2. Multiple export formats → CSV only  
3. Charts/analytics → Optional for MVP  
4. Email forwarding → Post-course  

**Priority 2: Cut if Desperate (Should Have)**  
5. Categorization feature → Manual later  
6. Advanced preprocessing → Rely on base GPT-4o-mini accuracy  

**Priority 1: Never Cut (Must Have)**  
- Core query + AI explanation flow  
- User authentication  
- Factual and accurate content generation  
- Basic export to CSV  
- Safety features (rate limiting, input validation)  

### Velocity Tracking (Week 3–4 Reality Check)

**Week 3 Planned vs. Actual:**  
- Planned: 30 hours, basic prototype working  
- Actual: 25 hours, basic prototype working but slower than expected  
- Lesson: Underestimated debugging time by ~30%  

**Week 4 Adjusted Expectations:**  
- Plan: 30 hours → Expect ~20 hours of real progress  
- Account for: Midterm prep, other course deadlines, debugging overhead  

**Realistic Capacity per Week:**  
- Team member 1: 12 hours/week  
- Team member 2: 10 hours/week (heavier course load)  
- Team member 3: 15 hours/week  
- Total: ~37 hours/week team capacity  

---

## 9. Team Health & Collaboration (Week 4)

### What's Working Well

✅ **Communication**  
- Daily Slack check-ins, usually <2 hours response time  
- Voice calls effective for complex discussions  

✅ **Technical Collaboration**  
- Pair programming sessions (2x/week)  
- Regular code reviews  
- Shared understanding of codebase  

✅ **Task Ownership**  
- Clear responsibilities  
- Everyone contributing meaningfully  

### Areas for Improvement

⚠️ **Documentation**  
- Inline comments missing  
- Setup instructions incomplete  
- Architecture decisions not documented  

**Fix:** Allocate 2 hours Week 5 to update documentation  

⚠️ **Testing**  
- No automated tests yet  
- Manual testing is time-consuming  

**Fix:** Week 6: write tests, aim for >50% coverage  

⚠️ **Workload Balance:**
- Mariam Tarkashvili (Backend + Architecture, RAG integration) has high workload due to FAISS integration and backend responsibilities  
- Saba Samkharadze (Backend development, FastAPI) has moderate workload; slower progress expected due to course load  
- Tekla Cahpidze (Testing + DevOps) managing QA, automated tests, and documentation, moderate workload  
- Giorgi Ksovreli (Frontend UX/UI) focused on interface development and user testing feedback, balanced workload  
- Akaki Ghachava (Model optimization & cost) handling token usage profiling and performance tuning, moderate–high workload  

**Fix:** Cross-train Mariam and Saba on backend components (Week 5), redistribute frontend tasks to Giorgi if needed, ensure Tekla has support for testing/DevOps, frontload critical work before Week 9

### Updated Team Contract (Changes from Week 2)

**Adjusted Meeting Schedule:**
- **2x/week online** (Wed 6-8pm, Sat 10am-12pm)
- Daily async WhatsApp check-ins
- Ad-hoc pair programming as needed

**Adjusted Roles:**
- Mariam Tarkashvili: Backend + Architecture, leading RAG integration and FAISS implementation  
- Saba Samkharadze: Backend development, FastAPI deployment and error handling  
- Tekla Cahpidze: Testing + DevOps, QA, automated testing, and documentation  
- Giorgi Ksovreli: Frontend UX/UI, developing React interface based on user feedback  
- Akaki Ghachava: Model optimization & cost, reducing token usage and improving performance


**Decision-Making Process:**
- Technical decisions: Majority vote after trying both approaches in prototype
- Scope cuts: Unanimous agreement required
- Urgent issues: Any team member can make call, document rationale

### Risk Mitigation Plan (Team-Level)

N/A

**Mitigation:**
- Frontload all critical work to Week 5-8
- Cross-train team members 1 & 3 on frontend (Week 5)
- Schedule buffer time in Week 9 (only non-blocking tasks)
- Team member 2 can contribute documentation/testing during Week 9

**Early Warning Signs:**
N/A

**Escalation Plan:**
- Week 1 of absence: Friendly check-in
- Week 2 of absence: Team meeting to redistribute work
- Week 3 of absence: Contact instructor, formally adjust scope

---

## 10. Summary: Key Changes Since Week 2

### Problem & Solution
- ✅ **Refined target user** to patients prescribed new medications and their caregivers, pharmacists as secondary support  
- ✅ **Validated problem** with interviews and user surveys in Week 3-4, confirming health literacy gap  
- ✅ **Refined solution** to focus on MVP: AI-driven explanations using RAG + database system for accurate, patient-friendly medical content

### Technical Architecture
- ✅ **Frontend** remains Next.js + React 18 with TailwindCSS for styling  
- ✅ **Backend** switched from FastAPI → Flask + CORS for simplified integration and deployment  
- ✅ **Database** remains PostgreSQL for structured storage of user sessions, feedback, and cached results  
- ✅ **Added Pinecone** vector DB for hybrid RAG retrieval system  
- ✅ **AI Model** updated: GPT-4o-mini handles 80% of queries, GPT-4o fallback for complex cases  
- ✅ **Deployment** staging prototype on Render/Railway, production-ready pipeline planned  

### Success Metrics
- ✅ **Added measurable targets:** task completion >70%, response latency <3s, user satisfaction >4.0/5.0  
- ✅ **Monitoring cost**: currently ~$0.013/query, targeting <$0.05/query  
- ✅ **Baseline metrics** established during internal testing and prototype evaluation  

### Risk Management
- ✅ **Identified 5+ critical risks**: API cost overruns, accuracy, team availability, privacy/GDPR, user adoption  
- ✅ **Mitigation measures** implemented: rate limiting, cost dashboard, user confirmation workflow, cross-training  
- ✅ **Risk roadmap** defined with weekly mitigation tasks  

### Scope Adjustments
- ❌ **Batch upload** deprioritized for MVP  
- ✅ **Core workflow maintained:** single-upload extraction, categorization, accurate AI-driven explanations  
- ✅ **RAG pipeline** added as hybrid model for accuracy and context enrichment  

### Team Dynamics
- ✅ **Workload balanced** across 5 members with cross-training for backend tasks  
- ✅ **Roles aligned with learning goals**: Mariam (RAG + backend), Saba (backend + FastAPI), Tekla (testing/DevOps), Giorgi (frontend UX/UI), Akaki (model optimization & cost)  
- ✅ **Realistic velocity** (~37 hours/week), with adjustments for course load and upcoming midterms  
- ✅ **Collaboration improvements:** structured documentation, code reviews, and scheduled cross-training

---

## 📊 Appendix

### A. Technology Research Summary

**Why FastAPI over Flask?**
- Researched: Compared performance benchmarks, async capabilities, type safety
- Decision: FastAPI chosen for async support (needed for streaming) and automatic API docs
- Source: [Links to research]

**Why PostgreSQL over MongoDB?**
- Researched: Data model analysis, consistency requirements, query patterns
- Decision: Relational structure fits our data (users → receipts → categories)
- Source: [Links to research]

### B. User Interview Notes Summary

N/A

### C. Cost Calculation Details

**Current Cost Model (Week 4, No Optimization):**
```
GPT-4o (current):
- System prompt: 500 tokens × $0.0025/1K = $0.00125
- User query: 200 tokens × $0.0025/1K = $0.0005
- Output: 600 tokens × $0.01/1K = $0.006
- Total per query: $0.00775
- Monthly (1000 queries): $7.75
```

**Projected Cost (Week 6, With Optimization):**
```
80% GPT-4o-mini, 20% GPT-4o:
- Mini (800 queries): 800 × $0.0002 = $0.16
- Full (200 queries): 200 × $0.003 = $0.60
- Total monthly: $0.76 (90% reduction!)
```

### D. Architecture Diagrams

[Include detailed diagrams here]

### E. Week 3-4 Prototype Screenshots

N/A

---

**Document Version:** 2.0  
**Last Updated:** 30-10-2025, Week 4  
**Next Review:** Week 7 (after user testing)

---




