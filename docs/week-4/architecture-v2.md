# Architecture Design Document

**Project Name:** Medsplain – AI-Powered Medication Information Translator  
**Version:** 1.0  
**Date:** October 30, 2025

---

## 📐 Architecture Diagram

```
                ┌────────────────────────────────────────────┐
                │                FRONTEND                   │
                │ React (TailwindCSS)            │
                │  - User queries & feedback input          │
                │  - Displays simplified explanations       │
                │  Deployment: Vercel                       │
                └────────────────────────────────────────────┘
                                 │ HTTPS
                                 ▼
                ┌────────────────────────────────────────────┐
                │                BACKEND                     │
                │  Flask (Python 3.11, CORS-enabled)         │
                │  - Handles RAG pipeline requests           │
                │  - Interfaces with Pinecone + GPT model    │
                │  Deployment: Railway                       │
                └────────────────────────────────────────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
                 ▼               ▼               ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
    │ OpenFDA API  │  │ RxNorm API   │  │ Pinecone VectorDB │
    │ Verified drug│  │ Drug ontology│  │ Semantic retrieval│
    │ info source  │  │ & mappings   │  │ of embeddings     │
    └──────────────┘  └──────────────┘  └──────────────────┘
                 │               │               │
                 └───────────────┼───────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────────────────┐
                │           POSTGRESQL DATABASE             │
                │  - User queries & feedback                 │
                │  - Readability scores                      │
                │  - Session data                            │
                └────────────────────────────────────────────┘

Data Flow: User Request → Frontend → Backend → RAG Pipeline → External APIs → Response
Latency Target: <3 seconds end-to-end
```

---

## 🏗️ Component Descriptions

### 1. Frontend

**Technology:**  React 18, TailwindCSS  
**Deployment:** Vercel  
**Purpose:** User-facing interface for medication information queries and simplified explanation display

**Key Responsibilities:**
- [x] User interface rendering for medication queries
- [x] Form validation and drug name input handling
- [x] State management (React Context)
- [x] API communication with Flask backend
- [x] Error handling and loading states
- [x] Display of source citations and readability scores

**Notable Implementation Details:**
- Uses TailwindCSS for responsive design and medical-grade accessibility
- Implements progressive disclosure for source citations
- Responsive design optimized for mobile health information access

**Key Files/Components:**
```
src/
├── components/
│   ├── QueryForm.jsx        # Handles medication queries
│   ├── ExplanationDisplay.jsx # Shows simplified explanations
│   ├── SourceCitations.jsx  # Displays verified sources
│   └── ErrorBoundary.jsx    # Error handling
├── hooks/
│   └── useMedicationApi.js  # Custom hook for API calls
├── contexts/
│   └── AppContext.js        # Global state management
└── pages/
    ├── index.js             # Main query page
    └── about.js             # About and disclaimer page
```

---

### 2. Backend

**Technology:** Flask 2.3 + Python 3.11, CORS-enabled  
**Deployment:** Railway / render 
**Purpose:** Orchestrates RAG pipeline and serves medication information API

**Key Responsibilities:**
- [x] API endpoints for medication queries and explanations
- [x] RAG pipeline orchestration (retrieval + generation)
- [x] External API integration (OpenFDA, RxNorm, MedlinePlus)
- [x] Database operations for query history and feedback
- [x] Rate limiting and security
- [x] Readability scoring and validation

**API Endpoints:**

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/api/explain` | Get simplified medication explanation | No |
| GET | `/api/sources/{drug_id}` | Retrieve source information | No |
| POST | `/api/feedback` | Submit user feedback on explanations | No |
| GET | `/api/health` | Health check | No |
| GET | `/api/metrics` | System metrics and performance | No |

**Notable Implementation Details:**
- Uses LangChain for RAG pipeline orchestration
- Implements hybrid retrieval (semantic + keyword search)
- Includes factuality verification against multiple sources

**Key Files/Modules:**
```
app/
├── app.py                   # Flask app initialization
├── routes/
│   ├── explanation.py       # Medication explanation endpoints
│   └── feedback.py          # User feedback endpoints
├── services/
│   ├── rag_service.py       # RAG pipeline orchestration
│   ├── retrieval_service.py # Pinecone and external API calls
│   └── safety_service.py    # Content validation
├── models/
│   └── schemas.py           # Data models and validation
└── database/
    └── db.py                # Database connection and operations
```

---

### 3. Database

**Technology:** PostgreSQL 17  
**Deployment:** Render
**Purpose:** Stores user queries, feedback, readability scores, and system metrics

**Schema:**

**User Queries Table:**
```sql
CREATE TABLE user_queries (
    id UUID PRIMARY KEY,
    drug_name VARCHAR(255) NOT NULL,
    original_query TEXT,
    session_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Explanations Table:**
```sql
CREATE TABLE explanations (
    id UUID PRIMARY KEY,
    query_id UUID REFERENCES user_queries(id),
    simplified_explanation TEXT NOT NULL,
    readability_score FLOAT,
    source_citations JSONB,
    confidence_score FLOAT,
    model_used VARCHAR(100),
    tokens_used INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**User Feedback Table:**
```sql
CREATE TABLE feedback (
    id UUID PRIMARY KEY,
    explanation_id UUID REFERENCES explanations(id),
    clarity_rating INTEGER,
    trust_rating INTEGER,
    factual_correctness BOOLEAN,
    comments TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Relationships:**
- One user query → One explanation
- One explanation → Many feedback entries

**Indexes:**
- `drug_name` (for query analysis)
- `created_at` (for time-based analytics)
- `readability_score` (for quality monitoring)

**Notable Implementation Details:**
- Using JSONB for flexible source citation storage
- Partitioning strategy based on creation date for large-scale data
- Automated cleanup of old session data

---

### 4. AI Services

**Primary AI Service:** OpenAI GPT-4o-mini + GPT-4o hybrid / claude sonnet 3.5

**API Configuration:**
- **Primary Model:** GPT-4o-mini (80% of queries)
- **Fallback Model:** claude sonnet 3.5
- **Max Tokens:** 1000
- **Temperature:** 0.3 for consistency
- **Structured Output:** JSON format for medication explanations

**Prompt Structure:**
```
System Prompt: "You are a medical translator that explains medication information in simple, patient-friendly language at an 8th-grade reading level. Only use information from the provided verified sources. Do not add any information not present in the sources."

User Input: Medication query + retrieved context from verified sources
Expected Output: JSON with simplified_explanation, key_points, warnings, readability_estimate
```

**Model Selection Logic:**
```python
def choose_model(complexity_score, confidence_threshold):
    if complexity_score < 0.7 and confidence_threshold > 0.8:
        return "gpt-4o-mini"  # Simple query, high confidence
    else:
        return "gpt-4o"       # Complex query or low confidence
```

**Fallback Strategy:**
- Primary: OpenAI GPT-4o-mini
- Fallback 1: claude sonnet 3.5 for complex cases
- Fallback 2: Return retrieved source snippets only if AI services unavailable

**Notable Implementation Details:**
- Caching strategy: Redis for repeated medication queries
- Rate limiting: 100 requests/hour per session
- Cost tracking: Real-time monitoring of token usage and costs

---

### 5. External Services

#### Vector Database

**Service:** Pinecone  
**Purpose:** Semantic search and retrieval of medical information  
**Configuration:**
- Embedding model: text-embedding-3-small
- Index type: Starter index
- Similarity metric: Cosine similarity
- Top-k retrieval: 3 most relevant chunks

#### Medical Data APIs

**OpenFDA API:** Official drug labeling and adverse event data  
**RxNorm API:** Drug names, generic mappings, and ontology  
**MedlinePlus API:** Patient-oriented medical information

#### Image Storage

**Service:** Cloudinary  
**Purpose:** Store medication images (future feature)  
**Configuration:**
- Max file size: 5MB
- Allowed formats: JPG, PNG
- Retention policy: 30 days

#### Monitoring Services

**Service:** Sentry for error tracking  
**Purpose:** Real-time error monitoring and performance tracking  
**Why Chosen:** Comprehensive error tracking with good free tier

---

## 🔄 Data Flow Diagrams

### Primary User Flow: Medication Explanation Request

```
┌────────────┐         ┌──────────┐         ┌─────────┐         ┌───────────┐
│   User     │         │ Frontend │         │ Backend │         │ RAG       │
│  Browser   │         │ (React)│         │ (Flask) │         │ Pipeline  │
└─────┬──────┘         └────┬─────┘         └────┬────┘         └─────┬─────┘
      │                     │                    │                   │
      │ 1. Enter drug query │                    │                   │
      │────────────────────>│                    │                   │
      │                     │ 2. POST /api/explain│                   │
      │                     │ (drug_name)        │                   │
      │                     │───────────────────>│                   │
      │                     │                    │ 3. Query embedding│
      │                     │                    │ & Pinecone search │
      │                     │                    │──────────────────>│
      │                     │                    │                   │
      │                     │                    │ 4. Retrieve context│
      │                     │                    │ from OpenFDA/RxNorm│
      │                     │                    │──────────────────>│
      │                     │                    │                   │
      │                     │                    │ 5. Generate explanation│
      │                     │                    │ with GPT model    │
      │                     │                    │──────────────────>│
      │                     │                    │                   │
      │                     │                    │ 6. Score readability│
      │                     │                    │ & store in DB     │
      │                     │                    │                   │
      │                     │ 7. Return response │                   │
      │                     │<───────────────────│                   │
      │ 8. Display simplified│                    │                   │
      │ explanation & sources│                    │                   │
      │<────────────────────│                    │                   │

Total Time: ~3 seconds
- Frontend processing: 100ms
- Network latency: 300ms
- Retrieval & context assembly: 800ms
- AI generation: 1500ms
- Readability scoring: 100ms
- Database write: 100ms
```

**Error Scenarios:**

**Scenario 1: OpenAI API is down**
```
Backend receives 503 from OpenAI
↓
Backend attempts fallback to source snippets only
↓
Returns 503 with message: "AI service temporarily unavailable. Showing verified source information instead."
↓
Frontend displays source information with disclaimer
```

**Scenario 2: Drug not found in databases**
```
Pinecone and external APIs return no results
↓
Backend returns 404 with message: "Medication information not found in verified sources. Please check the spelling or consult your healthcare provider."
↓
Frontend displays error with spelling suggestions
```

---

### Secondary Flow: User Feedback Submission

```
User provides feedback on explanation quality
↓
Frontend sends POST /api/feedback
↓
Backend validates and stores feedback in PostgreSQL
↓
System updates quality metrics for model improvement
↓
Frontend confirms feedback receipt
```

---

## ⚡ Performance & Latency

### Latency Budget

| Component | Target (P95) | Current | Status | Optimization Plan |
|-----------|--------------|---------|--------|-------------------|
| Frontend load | <1s | 800ms | ✅ Good | None needed |
| API response time | <3s | 3.8s | ⚠️ Needs work | Optimize prompt, add caching |
| Vector retrieval | <400ms | 320ms | ✅ Good | Maintain current performance |
| External API calls | <500ms | 450ms | ✅ Good | Parallelize where possible |
| AI generation | <2s | 2.5s | ⚠️ Needs work | Reduce prompt tokens, model tuning |
| Database query | <100ms | 90ms | ✅ Good | Add index on drug_name |

**Overall User Experience Target:** <5 seconds from query to results display  
**Current Performance:** ~4.5 seconds  
**Gap:** 0.5 seconds to optimize

---

### Scalability Considerations

**Current Capacity:**
- Expected users: 10-50 during course
- Expected requests: 100-500/day
- Database size: <1GB
- Vector storage: <100MB

**Scaling Bottlenecks:**
- [ ] Database connections (limited on free tier)
- [ ] OpenAI API rate limits (TPM/RPM limits)
- [ ] Pinecone free tier document limits
- [ ] Backend memory on Railway free tier

**Scaling Strategy (If Needed Post-Course):**
- Add Redis caching for common medication queries
- Implement database connection pooling
- Upgrade to paid tiers for higher limits
- Add CDN for static assets

---

## 🔒 Security Architecture

### Security Layers

**Layer 1: Frontend**
- Input validation (drug name sanitization)
- HTTPS only
- Content Security Policy (CSP)
- No API keys exposed in client code

**Layer 2: Backend**
- CORS configured for frontend domain only
- Rate limiting (100 requests/hour per session)
- Input sanitization for all user inputs
- SQL injection protection (using parameterized queries)
- Environment variables for all secrets

**Layer 3: Database**
- Encrypted at rest (provider default)
- Encrypted in transit (SSL)
- Limited access (only backend can connect)
- Regular backups (if implemented)

**Layer 4: External Services**
- API keys stored in environment variables
- Never committed to Git
- Least privilege access (read-only for data APIs)

### Threat Model

**Threats Considered:**
1. **Unauthorized access to medical data**
   - Mitigation: No PII stored, session-based tracking only
   - Status: ✅ Implemented

2. **API key exposure**
   - Mitigation: Keys only in backend, environment variables
   - Status: ✅ Implemented

3. **Prompt injection for medical misinformation**
   - Mitigation: Input sanitization, system prompt guardrails
   - Status: ⏳ Planned for Week 6

4. **DoS attack**
   - Mitigation: Rate limiting, query cost limits
   - Status: ✅ Implemented

5. **Data integrity**
   - Mitigation: Multiple source verification, fact-checking
   - Status: ✅ Implemented

---

## 💰 Cost Architecture

### Cost Breakdown (Monthly Estimate)

| Service | Free Tier | Current Usage | Paid Tier Cost | Notes |
|---------|-----------|---------------|----------------|-------|
| Vercel (Frontend) | ✅ Unlimited | ~50 deploys | $0 | Within free tier |
| Railway (Backend + DB) | ✅ $5 credit | ~$4/month | $0 | Using free tier |
| OpenAI API | ❌ Pay-per-use | ~$8/month | $8 | 1000 queries @ $0.008 each |
| Pinecone (Vector DB) | ✅ Starter tier | ~$0/month | $0 | Within free tier |
| Cloudinary (Images) | ✅ 25GB/month | ~0.1GB/month | $0 | Within free tier |
| **TOTAL** | - | - | **~$8/month** | Well within budget |

**Cost Optimizations:**
- Using GPT-4o-mini for 80% of queries (saves ~90% vs GPT-4o)
- Implementing caching for repeated medication queries
- Efficient prompt design to minimize token usage
- Free tiers for all infrastructure services

---

## 🔄 Architecture Evolution

### Changes from Initial Proposal

| Component | Initial Plan | Current Architecture | Reason for Change |
|-----------|--------------|---------------------|-------------------|
| Backend | FastAPI | Flask | Team familiarity, simpler debugging |
| Vector DB | None | Pinecone | Needed for semantic search in RAG pipeline |
| AI Model | GPT-4 only | GPT-4o-mini + GPT-4o hybrid | Cost optimization without quality loss |
| Data Sources | OpenFDA only | OpenFDA + RxNorm + MedlinePlus | Comprehensive medical context |
| Caching | None | Redis (planned) | Reduce API costs on repeated queries |

### Future Improvements (Post-Course)

**Short-term (Weeks 5-8):**
- [ ] Add Redis caching layer
- [ ] Implement comprehensive testing (pytest + Jest)
- [ ] Add monitoring/logging (Sentry)

**Medium-term (Weeks 9-12):**
- [ ] Add database backups (automated)
- [ ] Implement proper error handling across all endpoints
- [ ] Add health check endpoints for monitoring

**Long-term (Post-Course):**
- [ ] Performance optimization (code profiling, query optimization)
- [ ] Security hardening (penetration testing, medical compliance)
- [ ] Documentation updates (API docs, deployment guide)

---

## 🛠️ Development & Deployment

### Local Development Setup

**Requirements:**
- Node.js 18+
- Python 3.11+
- PostgreSQL 17 
- Git

**Setup Steps:**
```bash
# 1. Clone repository
git clone [repo-url]
cd medsplain

# 2. Install frontend dependencies
cd frontend
npm install

# 3. Install backend dependencies
cd ../backend
pip install -r requirements.txt

# 4. Configure environment variables
cp .env.example .env
# Edit .env with your API keys

# 5. Start backend
flask run --reload

# 6. Start frontend (in new terminal)
cd ../frontend
npm run dev
```

**Environment Variables:**

```bash
# Backend (.env)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
OPENFDA_API_KEY=...

# Frontend (.env.local)
VITE_API_URL=http://localhost:5000
```

---

### Deployment Pipeline

**Current Deployment:**
- Frontend: Push to main → Vercel auto-deploys
- Backend: Push to main → Render auto-deploys
- Database: Managed by Render
- Vector DB: Managed by Pinecone

**CI/CD Pipeline:**
```
1. Push to GitHub
   ↓
2. Automated deployment:
   - Frontend deploys to Vercel
   - Backend deploys to Render
   ↓
3. Health checks:
   - Backend health endpoint verification
   - Frontend build verification
```

---

## 🧪 Testing Strategy

### Testing Layers

**Frontend Tests:**
- Unit tests: Component behavior (Jest + React Testing Library)
- Integration tests: User flows (Playwright)
- Accessibility tests: WCAG compliance

**Backend Tests:**
- Unit tests: Business logic (pytest)
- Integration tests: API endpoints (pytest)
- Database tests: CRUD operations
- AI tests: Mock OpenAI responses

**End-to-End Tests:**
- Happy path: Medication query to explanation
- Error scenarios: Drug not found, API failures
- Performance: Latency within targets

---

## 📊 Monitoring & Observability

### Logging Strategy

**What We Log:**
- All medication queries (anonymized)
- API response times and errors
- AI API usage (tokens, cost, latency)
- User feedback and quality metrics

**Where Logs Go:**
- Development: Console
- Production: Railway logs + Sentry

**Log Format:**
```json
{
  "timestamp": "2025-10-30T10:30:00Z",
  "level": "INFO",
  "endpoint": "/api/explain",
  "drug_name": "amlodipine",
  "latency_ms": 3800,
  "tokens_used": 850,
  "readability_score": 7.2
}
```

---

## 🔧 Architecture Decisions

### Key Decisions & Tradeoffs

**Decision 1: Flask vs. FastAPI**
- **Chose:** Flask
- **Pro:** Team expertise, simpler debugging, adequate for current needs
- **Con:** Less built-in async support, fewer automatic features
- **Tradeoff:** Accepted fewer built-in features for faster development

**Decision 2: Pinecone vs. FAISS**
- **Chose:** Pinecone
- **Pro:** Managed service, simpler deployment, good free tier
- **Con:** Vendor lock-in, potential future costs
- **Tradeoff:** Accepted vendor dependency for development speed

**Decision 3: GPT-4o-mini vs. GPT-4o hybrid**
- **Chose:** Hybrid approach
- **Pro:** 90% cost savings while maintaining quality
- **Con:** More complex routing logic
- **Tradeoff:** Added complexity for significant cost savings

**Decision 4: Multiple medical data sources**
- **Chose:** OpenFDA + RxNorm + MedlinePlus
- **Pro:** Comprehensive coverage, redundancy
- **Con:** More integration points, potential inconsistencies
- **Tradeoff:** Accepted integration complexity for data completeness

---

## ✅ Architecture Review Checklist

Before finalizing, verify:

- [x] All components documented
- [x] Data flows clearly shown
- [x] Technology choices justified
- [x] Security considerations addressed
- [x] Performance targets defined
- [x] Cost breakdown provided
- [x] Scalability considerations noted
- [x] Error handling strategy defined
- [x] Testing strategy outlined
- [x] Deployment process documented
- [x] Future improvements planned

---

**Version:** 1.0  
**Last Updated:** October 30, 2025  
**Next Review:** Week 10 (before final optimization push)