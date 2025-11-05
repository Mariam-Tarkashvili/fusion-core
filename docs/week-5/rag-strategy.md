# RAG Strategy Design — Week 5  
**Project:** Medsplain
**Owner:** Fusion Core 
**Date:** 2025-11-05  

---

## What is RAG?

Retrieval-Augmented Generation (RAG) solves the problem of LLMs lacking specific knowledge about **your data** — in this case, medical and regulatory sources.  
Instead of relying solely on the model’s internal memory, RAG retrieves verified documents (FDA labels, guidelines, databases) and injects them into the prompt so the model can produce accurate, **source-backed**, and **traceable** explanations.

For a medication assistant, this approach minimizes hallucinations and allows every claim to be tied to an authoritative source (e.g., *FDA drug label, section X*).

---

## 1. Knowledge Sources

What data will your AI access?

### Primary Knowledge Sources

1. **FDA Structured Drug Labels** (XML, daily/weekly updates)  
   - Location: `/data/fda/spl/`  
   - Format: XML / parsed text (indications, dosage, contraindications, interactions)  
   - Update frequency: Daily ingest job (or weekly deltas)  
   - Use: Authoritative source for indications, dosing, warnings, and interactions  

2. **MedlinePlus / NIH Patient Leaflets** (HTML, weekly updates)  
   - Location: `/data/medlineplus/`  
   - Format: HTML / plain text summaries  
   - Use: Generate patient-friendly phrasing and summaries  

3. **Clinical Practice Guidelines (NICE, WHO)** (PDF/HTML, monthly)  
   - Location: `/data/guidelines/`  
   - Format: PDF, HTML  
   - Use: Contextualize treatment guidance and comparative recommendations  

4. **Drug Interaction Databases (DrugBank, OpenFDA)**  
   - Location: `/data/interactions/` or API snapshots  
   - Format: JSON / CSV  
   - Use: Populate “Interactions” section and compute severity/rationale  

5. **Local Formulary Data (Pharmacy DB)**  
   - Source: PostgreSQL `formulary` schema  
   - Fields: drug_id, brand_names, strengths, routes, formulary_status  
   - Update frequency: Nightly sync  
   - Use: Display availability and local dosing variants  

6. **Adverse Event Reports (VAERS / FAERS)**  
   - Location: `/data/adverse_events/`  
   - Use: Supplement safety summaries with low-trust, exploratory evidence  

### Secondary / Derived Sources
- Precomputed embeddings, metadata, and reranker indexes for fast retrieval  

---

## 2. RAG Architecture Choice

### Option A: Traditional RAG
User Query → Embed Query → Vector Search → Retrieve Top K → Augment Prompt → LLM → Response  

### Option B: Hybrid Search ✅ *(Recommended)*  
User Query → [Vector Search + Keyword Search] → Rerank → Retrieve Top K → Augment Prompt → LLM → Response  

### Option C: No RAG (Hardcoded Context)
User Query → Predefined Context → LLM → Response  

**Chosen Approach: Option B — Hybrid Search**

**Justification:**  
- Medical text includes both semantic content and critical keyword matches (e.g., drug names, sections like *“Black Box Warning”*).  
- Hybrid search ensures both semantic recall (via embeddings) and exact-match retrieval (via keyword search).  
- Cross-encoder reranker improves factual precision and balances recall vs. safety-critical accuracy.  

---

## 3. Technical Implementation

### Embedding Model
- **Model:** `text-embedding-3-small`  
- **Dimensions:** 1536  
- **Cost:** ~$0.02 per 1M tokens  
- **Why:** Strong semantic quality for moderate cost; optimized for healthcare-scale data  

### Vector Database
- **Service:** Pinecone (Serverless)  
- **Index name:** `medical-knowledge-base`  
- **Metric:** Cosine similarity  
- **Why:** Fully managed, auto-scaling service ideal for read-heavy workloads  

### Chunking Strategy
- **Method:** Recursive text splitter (preserves section boundaries)  
- **Chunk size:** 1000 tokens  
- **Overlap:** 200 tokens  
- **Why:** Keeps regulatory sections (e.g., “Warnings”) intact for accurate citation  

### Retrieval Parameters
- **Top K (pre-rerank):** 15 documents  
- **Top K (final):** 5  
- **Similarity threshold:** 0.7  
- **Reranking:** Yes — cross-encoder or instruction-tuned LLM reranker  

### Prompting & Output
- Include canonical drug ID + retrieved chunks with metadata (source, section, date).  
- Output structured JSON mapping to frontend sections:  
  - `what_it_is_for`  
  - `how_to_take`  
  - `side_effects`  
  - `warnings`  
  - `interactions`  
  - `sources`  
  - `confidence_score`  

---

## 4. Citation Strategy

How will you show sources?

### Citation Format
> “Warfarin increases bleeding risk and requires INR monitoring.”  
> [Source: FDA Drug Label — *Warfarin_spl.xml*, Section: Warnings & Precautions]

### Citation Policies
- Always show the **source name**, **section**, and **date**.  
- Prefer primary sources (FDA, EMA) over secondary ones.  
- Include confidence level (`High | Medium | Low`) with rationale (e.g., “direct label match”).  
- In the UI, inline citations link to expanded citation blocks with full details and ingest timestamps.  

---

## 5. RAG Alternatives (If Not Using RAG)

We use RAG

---

