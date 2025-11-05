Project Overview: Medsplain – AI-Powered Medication Translator

1. Project Goal & Core Problem
   Patients often struggle to understand medication information because package inserts and online drug guides are written in complex medical language. More than 40% of adults read at an 8th-grade level or below, creating a literacy gap that leads to misuse, anxiety, and non-adherence. Medsplain aims to bridge this gap by using AI-driven RAG (Retrieval-Augmented Generation) to convert verified drug data into clear, concise explanations at a middle-school reading level, ensuring patients can easily grasp dosages, side effects, and key warnings.
2. MVP Scope & Key Features
   In-Scope (MVP Features):
   Medication Query Input – Users can enter a drug name or paste medication text via the web interface.
   AI Explanation Generation – A Flask API invokes a RAG pipeline (OpenFDA/RxNorm retrieval + GPT-4) to produce a plain-language summary.
   Source Citations – The system displays relevant source snippets or citations alongside each explanation for transparency.
   Readability Scoring – Each response includes a Flesch-Kincaid readability grade to ensure it meets the target level.
   Feedback Mechanism – Users can provide simple feedback (e.g., “helpful” or “unclear”) on each explanation.
   Out-of-Scope (Deferred for MVP):
   Advanced User Accounts – No login or profile management in MVP (single-session use only).
   Batch Upload – Users cannot process multiple documents or prescriptions at once.
   Multi-language Support – Only English is supported initially.
   Data Analytics Dashboard – No admin analytics or usage metrics dashboard in MVP.
   Mobile App – Only a responsive web interface is provided (no native mobile app).
   Integration with EHR/Pharmacy Systems – Direct EMR or pharmacy system integration is deferred.
3. Target Audience
   The primary users are adult patients and caregivers with limited medical literacy who need simple explanations of prescription information. For example, Nino (45, high-school educated, newly prescribed a hypertension drug) represents the typical user: she uses digital tools (Google, WhatsApp) but finds leaflets “too technical.” By contrast, pharmacists and healthcare providers are secondary users who may recommend Medsplain to improve patient understanding. In all cases, users expect trustworthy, easy-to-read guidance tailored to their situation.
4. Technology Stack (Specific Versions Recommended)
   Category Technology Version Notes
   Languages Python 3.11.4 Backend development
   JavaScript (React/Next.js) ES2022 Frontend development
   Backend Framework Flask (with flask-cors) 2.3.2 Simple REST API server
   Frontend Framework Next.js (React) Next.js 13.x, React 18.2.0 Hybrid SSR/CSR for UI
   UI Library Tailwind CSS 3.3.2 Utility-first styling
   Database PostgreSQL 15.3 Managed DB (e.g., Railway, AWS RDS)
   Testing (Unit) pytest (Python) 7.4.0 Backend unit testing
   Testing (E2E) Cypress 12.17.0 End-to-end UI testing
   Deployment Netlify (frontend), Render/Railway (backend) N/A Managed hosting (auto-deploy via GitHub)
   Version Control Git (GitHub) N/A Repository on GitHub
5. High-Level Architecture
   We use a three-tier client-server architecture. The React/Next.js frontend (UI) communicates via REST API calls with a Flask backend. The backend orchestrates the RAG pipeline, interacting with a vector database (Pinecone) and external data sources (OpenFDA, RxNorm) to assemble context. It then calls the GPT-4 model (via LangChain) to generate the simplified explanation. The diagram below shows the main components and interactions:
   graph TD
   U[User (Browser)] -->|Query| F(Frontend: Next.js/React)
   F -->|API Call| B(Backend: Flask API)
   B --> DB[(PostgreSQL)]
   B --> PC[(Pinecone Vector DB)]
   B --> GPT[GPT-4 Model (OpenAI)]
   B --> FDA[OpenFDA API]
   B --> RX[RxNorm API]
   GPT -->|Generated Text| B
   B -->|Response| F
6. Core Components/Modules
   Frontend (Next.js/React): Handles user input forms and displays the AI-generated medication explanations with readability scores. It provides a responsive UI for both desktop and mobile browsers.
   Backend API (Flask): Receives user queries, coordinates the retrieval and generation pipeline, and returns JSON responses. It also handles logging, rate limiting, and error responses.
   Retrieval Engine (Pinecone): Performs semantic search over embedded medical documents to find relevant context for a given query.
   Context Builder: Calls external services (OpenFDA, RxNorm) to fetch factual drug information, then merges this data with the retrieved documents into a single context.
   LLM Generation (GPT-4 via LangChain): Takes the assembled context and user query to produce a patient-friendly explanation. LangChain manages prompt construction and chaining.
   Database (PostgreSQL): Stores user queries, generated answers, readability scores, and feedback for auditing and future model improvement.
7. Key UI/UX Considerations
   Plain Language: All text should be clear, concise, and free of medical jargon. Use short sentences and common terms to aid comprehension.
   Clarity & Emphasis: Highlight essential information (dosage, purpose, side effects) prominently. Use headings or bold text for key points.
   Transparency & Trust: Provide source citations or expandable references so users see where information comes from, building credibility without cluttering the main explanation.
   Responsive Design: Ensure the interface works well on both desktop and mobile devices. Prioritize legible fonts, ample white space, and easily tappable controls.
   Feedback Channels: Include a simple mechanism (buttons or emojis) for users to rate an explanation’s helpfulness, enabling quick iteration on UI/UX.
8. Coding Standards & Quality Criteria
   Style Guide: Follow PEP 8 for Python code and the Airbnb JavaScript Style Guide for React/JS code.
   Formatting: Use Black for Python (with default settings) and Prettier (configured via .prettierrc) for JavaScript/React to ensure consistent formatting.
   Linters: Use Flake8 or Ruff for Python linting and ESLint (with Airbnb rules) for JavaScript to catch code issues early.
   Naming Conventions: Python files and variables in snake_case.py; React components and files in PascalCase.jsx; CSS classes in kebab-case.
   Design Principles: Apply DRY (Don’t Repeat Yourself) and modular design. Use repository/service patterns for data access and keep React components self-contained.
   Top Quality Criteria: Emphasize Reliability (robust error handling), Accuracy (correct medical content), Maintainability (clean, well-documented code), Testability (extensive automated tests), and Performance (optimized response times).
   Other Standards: All functions and classes should have docstrings. Write clear commit messages (e.g., Conventional Commits). Conduct regular code reviews before merging changes.
9. Testing Strategy
   Test Types: Implement unit tests (pytest) for individual functions and modules, integration tests for API endpoints and the RAG pipeline, and end-to-end (E2E) tests (Cypress) to simulate user interactions.
   Frameworks: Use pytest 7.x for backend testing, Jest 29.x + React Testing Library for frontend component tests, and Cypress 12.x for full-stack E2E tests.
   Coverage: Aim for at least 80% code coverage on backend Python code. Use coverage tools to identify gaps.
   Conventions: Follow the Arrange-Act-Assert (AAA) pattern in tests. Place test files in a tests/ directory mirroring the source file structure. Name tests clearly (e.g., test_backend_api.py).
   CI/CD Integration: Configure GitHub Actions to run all tests on each pull request. Builds must pass tests before merging to main. Include linting checks in the pipeline.
10. Initial Setup Steps
    git clone https://github.com/<your-org>/medsplain.git (clone the repository)
    cd medsplain/backend (navigate to backend folder)
    python3.11 -m venv venv (create Python virtual environment)
    source venv/bin/activate (activate the environment)
    pip install -r requirements.txt (install Python dependencies)
    Copy .env.example to .env and fill in required keys (e.g., OPENAI_API_KEY, PINECONE_API_KEY).
    Initialize the database (if using migrations): flask db upgrade.
    flask run (start the backend server on http://localhost:5000).
    In a new terminal: cd ../frontend (go to frontend folder)
    npm install (install JavaScript dependencies)
    Copy .env.local.example to .env.local and set NEXT_PUBLIC_API_URL=http://localhost:5000/api (or the correct backend URL).
    npm run dev (start the Next.js development server on http://localhost:3000).
11. Key Architectural Decisions
    Flask vs. FastAPI: We chose Flask (with CORS) for the backend due to team familiarity and its simplicity, trading off FastAPI’s async features which are not critical for MVP.
    Vector DB (Pinecone): Selected Pinecone as a managed vector database for semantic search to simplify development and ensure scalability, accepting higher cost compared to a self-hosted solution like FAISS.
    REST API Style: We use a RESTful JSON API for ease of integration with the Next.js frontend, rather than a more complex GraphQL approach, keeping the data flow straightforward.
    GPT-4 Model: Chose OpenAI’s GPT-4-turbo for generation because of its high-quality output, with the trade-off of token cost; smaller models (e.g., GPT-4o-mini) will be used when acceptable to reduce cost.
12. Project Documentation
    Project Overview: docs/project-overview.md (this document)
    API Documentation: docs/api.md (lists endpoints, request/response formats)
    User Guide: docs/user-guide.md (instructions for end-users on querying medication info)
    Developer Guide: docs/development.md (setup instructions, architecture notes, coding standards)
    README: README.md (root project summary, quickstart, repo link)
13. Repository Link
    GitHub Repository: https://github.com/your-org/medsplain (to be created/provided).
14. Dependencies & Third-Party Services
    OpenAI API (GPT-4): Used for language generation; requires an API key and is billed per token.
    Pinecone Vector DB: Cloud vector database for semantic search; requires an API key (free tier available up to ~1M vectors).
    OpenFDA API: Provides official drug labeling data; no auth needed for basic use (API key optionally for higher limits).
    RxNorm API: National drug name/ontology service; used to normalize drug names (no key required).
    Frontend Hosting: Netlify (or Vercel) for deploying the React app; connects to GitHub for auto-deploy on commits.
    Backend Hosting: Render or Railway to host the Flask API and PostgreSQL database (free/student tiers available).
    Authentication Provider: (Optional) e.g., Auth0 or Firebase Auth if user accounts are implemented later.
    Required Credentials: Store OPENAI_API_KEY, PINECONE_API_KEY, and any hosting DB URLs in environment variables (never in source).
    Rate Limits/Quotas: Monitor API usage (e.g., OpenAI rate limits 50 req/min, Pinecone free tier vector limits, OpenFDA daily caps) to avoid service interruptions.
15. Security Considerations
    Authentication: No sign-in for MVP (public access). If added later, use JWT tokens over HTTPS for session management.
    Authorization: Use role-based rules if admin functions are implemented; otherwise all users see general content.
    Data Protection: Enforce HTTPS/TLS on all endpoints. Keep API keys and credentials in secure environment variables. Encrypt database backups.
    Input Sanitization: Rigorously validate and sanitize all user inputs to prevent malicious content. In React, use built-in escaping; in Flask, use parameterized queries via an ORM.
    Threats & Mitigations: Protect against XSS/CSRF (use CSRF tokens or same-site cookies, sanitize output), SQL Injection (use SQLAlchemy ORM), and LLM Prompt Injection (strict prompt templates, reject suspicious queries).
    Data Privacy: Do not store personal health information (PHI). Allow users to delete their query history (GDPR right to erasure). Collect only anonymized usage data.
    Compliance: Although no PHI is stored, follow GDPR principles (minimal data retention, clear privacy notice). If expanded, consider HIPAA guidelines for any health data storage.
16. Performance Requirements
    Load Capacity: Support ~100 concurrent users and ~1000 API requests per day during MVP.
    Response Time: P95 API latency under 3 seconds per query (target <2.5s) to ensure a smooth experience. Individual components: front-end calls <200ms, Pinecone queries <400ms, GPT-4 generation <2500ms.
    Scalability: Design the backend to scale horizontally (stateless Flask containers); plan to add a Redis cache for frequent queries.
    Caching: Implement caching of common queries and results (in-memory or Redis) to reduce repeated LLM calls.
    Cost Constraints: Optimize for low resource usage: use GPT-4o-mini when possible, and keep per-query cost under ~$0.05. Target overall hosting cost < $50/month on free/low-tier plans.
17. Monitoring & Observability
    Logging: Use structured logging in JSON format. Log critical events with levels (INFO, WARNING, ERROR). Do not log sensitive data from user queries.
    Error Tracking: Integrate Sentry (free tier) to capture exceptions and runtime errors from both frontend and backend.
    Metrics: Track key metrics such as API request count, latency distributions, error rates, and daily active users. Monitor LLM usage (tokens consumed per day) for cost control.
    Alerts: Configure alerts (email/Slack) if error rate exceeds 5% or if API latency spikes above 3 seconds. Set usage alerts for OpenAI/Pinecone quotas.
    Health Checks: Provide a /health endpoint on the backend. Use Render/Railway uptime monitoring or a third-party service (e.g., UptimeRobot) to ping the service.
18. Deployment & DevOps
    Deployment Strategy: Use GitHub Actions for CI/CD. On push to main, run tests and then automatically deploy the frontend to Netlify (or Vercel) and the backend to Render/Railway.
    Environments: Three environments: local development, staging (via preview deployments on feature branches), and production (deployed from main branch).
    CI/CD Pipeline: Set up Actions to lint and test code on pull requests. On merge, trigger deployment: build the Next.js app, deploy to frontend host; build the Flask app (Docker or directly), deploy to backend host.
    Infrastructure as Code: Not used for MVP; infrastructure managed via the hosting platform dashboards.
    Backups & Recovery: Enable daily automated backups of the PostgreSQL database (many PaaS providers include this). Keep the code in Git (so version history provides code backup).
    Rollback Plan: Tag release versions in Git. If a deployment fails or has critical bugs, revert to the last stable tag and redeploy.
    Additional Tools: Use Docker Compose for local development to mimic production services if needed. Store all secrets in GitHub Secrets for use in CI/CD.
