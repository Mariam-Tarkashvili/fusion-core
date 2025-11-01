# Prioritized Backlog (Version 2)

**Project Name:** Medsplain – AI-Powered Medication Information Translator  
**Last Updated:** Week 4, October 30, 2025  
**Sprint:** Week 4 of 15

---

## 📋 Backlog Overview

**Total Issues:** 15  
**P1 (Must Have):** 9 issues  
**P2 (Should Have):** 4 issues  
**P3 (Nice to Have):** 2 issues  
**Completed:** 0 issues  

**Current Sprint Focus:** Core RAG pipeline implementation, backend API setup, and basic frontend interface

---

## 🔴 Priority 1: Critical Path (Must Have for MVP)

These features are non-negotiable for Week 15 demo. If we don't build these, we don't have a viable product.

### Issue #1: Core RAG Pipeline Implementation

**Status:** 🔵 To Do  
**Assigned:** Mariam Tarkashvili  
**Due:** Week 5  
**Effort:** Large (12+ hrs)

**User Story:**
> As a patient, I want accurate medication explanations grounded in verified medical sources so that I can trust the information provided.

**Why This Is P1:**
RAG pipeline is the core technical differentiator that ensures factual accuracy and prevents hallucinations in medical explanations.

**Acceptance Criteria:**
- [ ] Pinecone vector database configured with medical embeddings
- [ ] Semantic search returns top-3 relevant medical contexts in <400ms
- [ ] Retrieved context successfully injected into GPT-4 prompts
- [ ] Source citations displayed with each explanation
- [ ] Handles drug name variations and misspellings gracefully

**Technical Requirements:**
- Use LangChain for RAG orchestration
- Pinecone for vector storage and semantic search
- Embedding model: text-embedding-3-small
- Chunking strategy: 500 tokens with 50 token overlap
- Top-k retrieval: 3 most relevant chunks

**Definition of Done:**
- [ ] Code written and committed to `feature/rag-pipeline`
- [ ] Unit tests for retrieval functions (>80% coverage)
- [ ] Integration test: query → retrieve → generate → respond
- [ ] Latency benchmark: <400ms for vector search
- [ ] Code reviewed by Saba Samkharadze
- [ ] Documentation updated in `/docs/rag-architecture.md`
- [ ] Deployed to staging environment
- [ ] Tested with sample medication queries

**Dependencies:**
- **Blocks:** Issue #2 (API Integration), Issue #8 (Frontend Display)
- **Blocked By:** None (can start immediately)

**Resources:**
- LangChain RAG tutorial: https://python.langchain.com/docs/use_cases/question_answering/
- Pinecone documentation: https://docs.pinecone.io/
- Medical embedding research papers

---

### Issue #2: API Integration: OpenFDA & RxNorm Data Retrieval

**Status:** 🔵 To Do  
**Assigned:** Saba Samkharadze  
**Due:** Week 5  
**Effort:** Medium (8 hrs)

**User Story:**
> As a system, I need to retrieve verified medication data from authoritative sources so that explanations are medically accurate.

**Why This Is P1:**
External APIs provide the foundational verified data that makes our system trustworthy and compliant with medical standards.

**Acceptance Criteria:**
- [ ] OpenFDA API integration for drug labeling information
- [ ] RxNorm API integration for drug ontology and mappings
- [ ] Error handling for API rate limits and downtime
- [ ] Data validation and sanitization for medical content
- [ ] Response caching for frequently accessed drug data

**Technical Requirements:**
- Flask routes for external API calls
- Request retry logic with exponential backoff
- Response caching with TTL (1 hour)
- Data validation using Pydantic models
- Rate limiting compliance (OpenFDA: 1000 requests/hour)

**Definition of Done:**
- [ ] Code committed to `feature/external-apis`
- [ ] Unit tests for API clients (>80% coverage)
- [ ] Integration tests with mock API responses
- [ ] Error handling tested for common failure scenarios
- [ ] Code reviewed by Mariam Tarkashvili
- [ ] API documentation updated
- [ ] Deployed to staging
- [ ] Performance tested with concurrent requests

**Dependencies:**
- **Blocks:** Issue #1 (RAG Pipeline), Issue #5 (Backend API)
- **Blocked By:** None

**Resources:**
- OpenFDA API documentation: https://open.fda.gov/apis/
- RxNorm API documentation: https://www.nlm.nih.gov/research/umls/rxnorm/
- Flask RESTful patterns

---

### Issue #3: Prompt Engineering: Medical Explanation Templates

**Status:** 🔵 To Do  
**Assigned:** Akaki Ghachava  
**Due:** Week 5  
**Effort:** Medium (6 hrs)

**User Story:**
> As a user, I want medication explanations written in simple, clear language at an 8th-grade reading level so that I can easily understand the information.

**Why This Is P1:**
Prompt engineering directly impacts readability, accuracy, and user trust - the core value proposition of our product.

**Acceptance Criteria:**
- [ ] System prompt ensures 8th-grade reading level output
- [ ] Prompt includes instructions to cite only from retrieved context
- [ ] Template handles different medication query types (purpose, side effects, interactions)
- [ ] Output includes structured format with key sections
- [ ] Readability scoring integrated (Flesch-Kincaid)

**Technical Requirements:**
- LangChain prompt templates
- GPT-4o-mini as primary model (cost optimization)
- Temperature: 0.3 for consistency
- Max tokens: 1000 per response
- Structured output using JSON format

**Definition of Done:**
- [ ] Prompt templates committed to `feature/prompt-engineering`
- [ ] A/B testing framework for prompt variations
- [ ] Readability scoring implemented and validated
- [ ] Golden set of 20 test cases with expected outputs
- [ ] Code reviewed by Tekla Chapidze
- [ ] Performance benchmarks: <2.5s generation time
- [ ] Cost tracking: <$0.05 per query

**Dependencies:**
- **Blocks:** Issue #1 (RAG Pipeline)
- **Blocked By:** None

**Resources:**
- OpenAI prompt engineering guide
- CDC Plain Language Guidelines
- Flesch-Kincaid research papers

---

### Issue #4: Database Schema Design & Setup

**Status:** 🔵 To Do  
**Assigned:** Tekla Chapidze  
**Due:** Week 5  
**Effort:** Medium (6 hrs)

**User Story:**
> As a system, I need to store user queries, explanations, and feedback so that we can improve accuracy and track usage metrics.

**Why This Is P1:**
Database is essential for storing conversation history, user feedback, and enabling the continuous improvement feedback loop.

**Acceptance Criteria:**
- [ ] PostgreSQL database configured with proper schema
- [ ] User queries table with session tracking
- [ ] Explanations table with source citations and readability scores
- [ ] Feedback table for user ratings and comments
- [ ] Proper indexes for performance optimization

**Technical Requirements:**
- PostgreSQL 15 with SSL encryption
- SQLAlchemy ORM for database operations
- JSONB columns for flexible data storage
- Indexes on drug_name, created_at, and user_session
- Connection pooling for scalability

**Definition of Done:**
- [ ] Database schema committed to `feature/database-setup`
- [ ] Migration scripts for schema creation and updates
- [ ] Unit tests for database models and operations
- [ ] Performance benchmarks: <100ms query response
- [ ] Code reviewed by Mariam Tarkashvili
- [ ] Backup and recovery procedures documented
- [ ] Deployed to production environment

**Dependencies:**
- **Blocks:** Issue #5 (Backend API), Issue #14 (Evaluation Framework)
- **Blocked By:** None

**Resources:**
- PostgreSQL documentation
- SQLAlchemy best practices
- Database design patterns

---

### Issue #5: Backend API: Core Endpoints Implementation

**Status:** 🔵 To Do  
**Assigned:** Saba Samkharadze  
**Due:** Week 6  
**Effort:** Large (10 hrs)

**User Story:**
> As a frontend application, I need RESTful API endpoints to submit medication queries and receive simplified explanations.

**Why This Is P1:**
Backend API is the bridge between frontend and our core AI services - without it, the system cannot function.

**Acceptance Criteria:**
- [ ] POST /api/explain endpoint for medication queries
- [ ] GET /api/sources/{drug_id} for source information
- [ ] POST /api/feedback for user ratings
- [ ] GET /api/health for system monitoring
- [ ] Proper error handling and status codes
- [ ] CORS configured for frontend domain

**Technical Requirements:**
- Flask with CORS support
- JWT-like session management
- Rate limiting (100 requests/hour per session)
- Input validation and sanitization
- Comprehensive error handling

**Definition of Done:**
- [ ] Code committed to `feature/backend-api`
- [ ] API documentation with OpenAPI/Swagger
- [ ] Unit tests for all endpoints (>80% coverage)
- [ ] Integration tests with frontend
- [ ] Code reviewed by Tekla Chapidze
- [ ] Security audit completed
- [ ] Deployed to production
- [ ] Performance tested with load testing

**Dependencies:**
- **Blocks:** Issue #7 (Frontend Search), Issue #8 (Frontend Display)
- **Blocked By:** Issue #1 (RAG Pipeline), Issue #2 (API Integration), Issue #4 (Database)

**Resources:**
- Flask REST API tutorial
- OpenAPI specification
- API security best practices

---

### Issue #6: Safety Guardrails: Prompt Injection & Content Filtering

**Status:** 🔵 To Do  
**Assigned:** Mariam Tarkashvili  
**Due:** Week 6  
**Effort:** Medium (8 hrs)

**User Story:**
> As a healthcare application, I need to ensure all medical information is accurate and safe, preventing harmful or misleading content.

**Why This Is P1:**
Safety is non-negotiable in medical applications. Guardrails prevent hallucinations and ensure compliance with medical standards.

**Acceptance Criteria:**
- [ ] Input sanitization for medication queries
- [ ] Prompt injection detection and prevention
- [ ] Medical fact verification against retrieved sources
- [ ] Confidence scoring for generated explanations
- [ ] Fallback mechanisms for low-confidence responses

**Technical Requirements:**
- Regex-based input validation
- LangChain guardrails implementation
- Confidence threshold: 0.8 for high-risk medications
- Source verification logic
- Emergency fallback to source snippets only

**Definition of Done:**
- [ ] Code committed to `feature/safety-guardrails`
- [ ] Unit tests for safety filters (>90% coverage)
- [ ] Red team testing for prompt injection attempts
- [ ] Integration tests with RAG pipeline
- [ ] Code reviewed by Akaki Ghachava
- [ ] Security audit completed
- [ ] Documentation: `/docs/safety-protocols.md`
- [ ] Deployed to production

**Dependencies:**
- **Blocks:** Issue #11 (Monitoring), Issue #14 (Evaluation)
- **Blocked By:** Issue #1 (RAG Pipeline), Issue #3 (Prompt Engineering)

**Resources:**
- OWASP LLM Security Top 10
- Medical AI safety guidelines
- Prompt injection research papers

---

### Issue #7: Frontend: Medication Search & Input UI

**Status:** 🔵 To Do  
**Assigned:** Giorgi Ksovreli  
**Due:** Week 6  
**Effort:** Medium (8 hrs)

**User Story:**
> As a patient, I want a simple, intuitive interface to search for medication information so that I can quickly get the answers I need.

**Why This Is P1:**
Frontend is the user-facing component that determines accessibility and usability - critical for our target audience.

**Acceptance Criteria:**
- [ ] Clean, accessible search interface
- [ ] Auto-suggest for medication names
- [ ] Mobile-responsive design
- [ ] Loading states and progress indicators
- [ ] Error handling for invalid inputs

**Technical Requirements:**
- Next.js 14 with React 18
- TailwindCSS for styling
- Accessibility compliance (WCAG 2.1 AA)
- Mobile-first responsive design
- Client-side validation

**Definition of Done:**
- [ ] Code committed to `feature/search-ui`
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified
- [ ] Accessibility audit passed
- [ ] Code reviewed by Tekla Chapidze
- [ ] Performance optimized (Lighthouse score >90)
- [ ] Deployed to Vercel
- [ ] User testing ready

**Dependencies:**
- **Blocks:** Issue #8 (Frontend Display), Issue #10 (User Research)
- **Blocked By:** Issue #5 (Backend API)

**Resources:**
- Next.js documentation
- TailwindCSS components
- Accessibility guidelines

---

### Issue #8: Frontend: Explanation Display & Source Citations

**Status:** 🔵 To Do  
**Assigned:** Giorgi Ksovreli  
**Due:** Week 7  
**Effort:** Medium (8 hrs)

**User Story:**
> As a user, I want to see clear medication explanations with visible source citations so that I can trust the information provided.

**Why This Is P1:**
Explanation display directly impacts user trust and comprehension - core to our value proposition.

**Acceptance Criteria:**
- [ ] Readable explanation display with proper typography
- [ ] Expandable source citations section
- [ ] Readability score display
- [ ] Confidence indicator for explanations
- [ ] Feedback mechanism (thumbs up/down)

**Technical Requirements:**
- React components for explanation display
- Collapsible sections for detailed information
- Typography scale for readability
- Responsive design patterns
- State management for user interactions

**Definition of Done:**
- [ ] Code committed to `feature/explanation-ui`
- [ ] User testing with 5 participants
- [ ] Accessibility testing completed
- [ ] Performance optimized
- [ ] Code reviewed by Akaki Ghachava
- [ ] A/B testing framework implemented
- [ ] Deployed to production
- [ ] Analytics tracking implemented

**Dependencies:**
- **Blocks:** Issue #10 (User Research)
- **Blocked By:** Issue #5 (Backend API), Issue #7 (Frontend Search)

**Resources:**
- Medical UI design patterns
- Trust and credibility research
- User testing protocols

---

### Issue #9: RAG Pipeline: Context Building & Retrieval Logic

**Status:** 🔵 To Do  
**Assigned:** Mariam Tarkashvili  
**Due:** Week 7  
**Effort:** Large (10 hrs)

**User Story:**
> As a system, I need optimized retrieval of relevant medical context so that explanations are both accurate and comprehensive.

**Why This Is P1:**
Retrieval optimization directly impacts response quality and latency - critical for user experience.

**Acceptance Criteria:**
- [ ] Hybrid retrieval (semantic + keyword search)
- [ ] Query expansion for medication synonyms
- [ ] Chunking optimization for medical documents
- [ ] Relevance scoring and ranking
- [ ] Cross-source evidence aggregation

**Technical Requirements:**
- Advanced Pinecone query strategies
- Query expansion using RxNorm synonyms
- Dynamic chunk sizing based on content type
- Multi-source evidence synthesis
- Cache warming for common medications

**Definition of Done:**
- [ ] Code committed to `feature/retrieval-optimization`
- [ ] Retrieval accuracy >90% on test set
- [ ] Latency benchmarks: <500ms end-to-end retrieval
- [ ] A/B testing framework for retrieval strategies
- [ ] Code reviewed by Saba Samkharadze
- [ ] Performance monitoring implemented
- [ ] Documentation updated
- [ ] Deployed to production

**Dependencies:**
- **Blocks:** Issue #12 (Cost Optimization), Issue #14 (Evaluation)
- **Blocked By:** Issue #1 (RAG Pipeline), Issue #2 (API Integration)

**Resources:**
- Information retrieval research
- Medical NLP papers
- Vector search optimization guides

---

## 🟡 Priority 2: Enhanced Features (Should Have)

Features we'll build if time permits, in priority order. If we finish P1 early, we start on these.

### Issue #10: User Research: Interview Protocol & Participant Recruitment

**Status:** 🔵 To Do  
**Assigned:** Tekla Chapidze  
**Due:** Week 8  
**Effort:** Medium (6 hrs)

**User Story:**
> As a product team, we need to conduct user research to validate our solution and identify improvement opportunities.

**Why This Is P2:**
User research is critical for product-market fit but can be conducted in parallel with technical development.

**Acceptance Criteria:**
- [ ] Research protocol with consent forms
- [ ] 5 participants recruited (patients/caregivers)
- [ ] Structured interview guide
- [ ] Data analysis framework
- [ ] Insights report with actionable recommendations

**Technical Requirements:**
- IRB-compliant research protocol
- Remote testing setup (Zoom, recording)
- Qualitative data analysis tools
- Anonymized data storage
- Research ethics compliance

**Definition of Done:**
- [ ] Research plan approved by team
- [ ] 5 user testing sessions completed
- [ ] Data analyzed and insights synthesized
- [ ] Report delivered to team
- [ ] Action items prioritized in backlog
- [ ] Ethical compliance verified

**Dependencies:**
- **Blocks:** Issue #15 (Documentation)
- **Blocked By:** Issue #7 (Frontend Search), Issue #8 (Frontend Display)

---

### Issue #11: Monitoring & Logging: Telemetry Implementation

**Status:** 🔵 To Do  
**Assigned:** Akaki Ghachava  
**Due:** Week 9  
**Effort:** Medium (6 hrs)

**User Story:**
> As a development team, we need comprehensive monitoring to track system performance, errors, and usage patterns.

**Why This Is P2:**
Monitoring is essential for production reliability but can be implemented after core features are stable.

**Acceptance Criteria:**
- [ ] Application performance monitoring
- [ ] Error tracking and alerting
- [ ] Usage analytics and metrics
- [ ] Cost tracking for AI services
- [ ] Health check endpoints

**Technical Requirements:**
- Sentry for error tracking
- Custom metrics for business KPIs
- Log aggregation and analysis
- Alerting rules for critical issues
- Dashboard for key metrics

**Definition of Done:**
- [ ] Monitoring infrastructure deployed
- [ ] Key metrics dashboard operational
- [ ] Alerting configured for critical issues
- [ ] Documentation: `/docs/monitoring-guide.md`
- [ ] Team trained on monitoring tools

**Dependencies:**
- **Blocks:** None
- **Blocked By:** Issue #5 (Backend API), Issue #6 (Safety Guardrails)

---

### Issue #12: Cost Optimization: Caching & Token Management

**Status:** 🔵 To Do  
**Assigned:** Akaki Ghachava  
**Due:** Week 10  
**Effort:** Medium (8 hrs)

**User Story:**
> As a business, we need to optimize AI service costs while maintaining response quality to ensure financial sustainability.

**Why This Is P2:**
Cost optimization is important for scalability but can be addressed after the core system is functional.

**Acceptance Criteria:**
- [ ] Response caching for repeated queries
- [ ] Token usage optimization in prompts
- [ ] Model selection based on query complexity
- [ ] Cost tracking and alerting
- [ ] Budget enforcement mechanisms

**Technical Requirements:**
- Redis for response caching
- Prompt compression techniques
- Dynamic model selection logic
- Cost monitoring dashboard
- Rate limiting based on cost

**Definition of Done:**
- [ ] Caching layer implemented and tested
- [ ] Cost reduction by >40% achieved
- [ ] Cost monitoring dashboard operational
- [ ] Budget alerts configured
- [ ] Performance impact measured and acceptable

**Dependencies:**
- **Blocks:** None
- **Blocked By:** Issue #1 (RAG Pipeline), Issue #9 (Retrieval Optimization)

---

### Issue #13: Testing: Unit Tests & Integration Tests

**Status:** 🔵 To Do  
**Assigned:** Tekla Chapidze  
**Due:** Week 11  
**Effort:** Large (12 hrs)

**User Story:**
> As a development team, we need comprehensive test coverage to ensure system reliability and prevent regressions.

**Why This Is P2:**
Testing is crucial for quality but can be implemented iteratively after core features are built.

**Acceptance Criteria:**
- [ ] >80% unit test coverage for backend
- [ ] Integration tests for critical user flows
- [ ] End-to-end testing for main scenarios
- [ ] Performance testing for latency targets
- [ ] Security testing for safety features

**Technical Requirements:**
- pytest for Python backend tests
- Jest and React Testing Library for frontend
- Playwright for end-to-end testing
- Performance benchmarking suite
- Security testing tools

**Definition of Done:**
- [ ] Test suite passing in CI/CD pipeline
- [ ] Coverage reports generated
- [ ] Critical path integration tests implemented
- [ ] Performance benchmarks established
- [ ] Security testing completed

**Dependencies:**
- **Blocks:** None
- **Blocked By:** Issue #5 (Backend API), Issue #7 (Frontend Search)

---

## 🟢 Priority 3: Nice-to-Have (Could Have)

Features deferred to post-course or only if we're significantly ahead of schedule.

### Issue #14: Evaluation Framework: Comprehension Quiz & Metrics

**Status:** 🔵 To Do  
**Assigned:** Tekla Chapidze  
**Due:** Week 12  
**Effort:** Medium (8 hrs)

**User Story:**
> As a research team, we need to measure user comprehension and system effectiveness to validate our educational impact.

**Why This Is P3:**
Evaluation framework is valuable for research but not essential for MVP functionality.

**Acceptance Criteria:**
- [ ] Pre/post comprehension quizzes
- [ ] Knowledge retention measurement
- [ ] Educational effectiveness metrics
- [ ] Longitudinal study framework
- [ ] Research paper preparation

---

### Issue #15: Documentation: User Guide & Developer Docs

**Status:** 🔵 To Do  
**Assigned:** Giorgi Ksovreli  
**Due:** Week 13  
**Effort:** Medium (6 hrs)

**User Story:**
> As a user or developer, I need comprehensive documentation to understand how to use and contribute to the system.

**Why This Is P3:**
Documentation is important for usability and maintenance but can be completed after core system is stable.

**Acceptance Criteria:**
- [ ] User guide with examples
- [ ] API documentation
- [ ] Developer setup guide
- [ ] Architecture documentation
- [ ] Deployment instructions

---

## ⏸️ Backlog (Not Prioritized Yet)

Features and ideas that need more discussion before prioritizing.

- [ ] **Multi-language Support:** Extend to languages beyond English
- [ ] **Medication Interaction Checker:** Identify potential drug interactions
- [ ] **Personalized Dosing Information:** Tailor explanations to specific patient factors
- [ ] **Voice Interface:** Support voice queries and responses
- [ ] **Offline Mode:** Cache common medications for offline access

---

## 🚫 Rejected / Cut Features

Features we decided not to build, with rationale.

- **Batch Medication Upload:** Cut because single-query interface meets MVP needs and reduces complexity
- **Advanced Analytics Dashboard:** Cut because basic metrics suffice for initial launch and reduce scope
- **Prescription Image OCR:** Cut because text-based queries are sufficient for MVP and reduce technical risk

---

## 📅 Sprint Timeline

### Week 4 (Current)
- [ ] Finalize architecture and backlog (All)
- [ ] Begin Issue #1: RAG Pipeline (Mariam)
- [ ] Begin Issue #2: API Integration (Saba)

### Week 5
- [ ] Complete Issue #1: RAG Pipeline (Mariam)
- [ ] Complete Issue #2: API Integration (Saba)
- [ ] Complete Issue #3: Prompt Engineering (Akaki)
- [ ] Complete Issue #4: Database Setup (Tekla)

### Week 6
- [ ] Complete Issue #5: Backend API (Saba)
- [ ] Complete Issue #6: Safety Guardrails (Mariam)
- [ ] Complete Issue #7: Frontend Search (Giorgi)

### Week 7
- [ ] Complete Issue #8: Frontend Display (Giorgi)
- [ ] Complete Issue #9: Retrieval Optimization (Mariam)
- [ ] Begin Issue #10: User Research (Tekla)

### Week 8
- [ ] Complete Issue #10: User Research (Tekla)
- [ ] Begin Issue #11: Monitoring (Akaki)

### Week 9
- [ ] Complete Issue #11: Monitoring (Akaki)
- [ ] Begin Issue #12: Cost Optimization (Akaki)

### Week 10
- [ ] Complete Issue #12: Cost Optimization (Akaki)
- [ ] Begin Issue #13: Testing (Tekla)

### Week 11
- [ ] Complete Issue #13: Testing (Tekla)
- [ ] Safety & Evaluation Audit (All)

### Week 12
- [ ] Begin Issue #14: Evaluation Framework (Tekla) - if time permits

### Week 13
- [ ] Begin Issue #15: Documentation (Giorgi) - if time permits
- [ ] Production Polish & Bug Fixes (All)

### Week 14
- [ ] User Testing Round 2 (All)
- [ ] Final Optimization (All)

### Week 15
- [ ] Final Demo Preparation (All)
- [ ] Project Delivery (All)

---

**Backlog Version:** 2.0  
**Last Updated:** October 30, 2025  
**Next Review:** Week 5 (adjust based on progress)