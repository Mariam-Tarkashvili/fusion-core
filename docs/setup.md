# 🧰 Setup Guide — Medsplain  
**Course:** Building AI-Powered Applications  
**Team:** Fusion Core  
**Date:** October 17, 2025  

---

## 1. Overview

This document describes how to set up the **development environment** for **Medsplain**, an AI-powered web app that explains prescription medications in plain language using FDA-approved data and large language models (LLMs).  

All team members must complete this setup before beginning development to ensure consistent environments and working builds.

---

## 2. Prerequisites

Before cloning the repository, make sure the following are installed on your system:

| Tool | Version | Notes |
|------|----------|-------|
| **Git** | ≥ 2.40 | For version control |
| **Node.js** | ≥ 20.x | For frontend (Next.js) |
| **npm** | ≥ 10.x | Installed with Node.js |
| **Python** | 3.11.x | For backend (FastAPI) |
| **PostgreSQL** | ≥ 15 | For local database |
| **VS Code** *(recommended)* | Latest | IDE with integrated terminal |
| **Draw.io / Excalidraw** | Optional | For architecture diagrams |
| **Render / Railway account** | Optional | For cloud deployment |

---

## 3. Repository Structure
```bash
/medsplain/
│
├── frontend/
│ ├── package.json
│ ├── src/
│ └── ...
│
├── backend/ 
│ ├── main.py
│ ├── requirements.txt
│ └── app/
│
├── docs/ 
│ ├── team-contract.md
│ ├── capstone-proposal.md
│ └── setup.md
│
├── .env.example 
└── README.md
```

## 4. Environment Setup Steps

### Step 1: Clone the Repository
```bash
git clone https://github.com/<your-org-or-username>/medsplain.git
cd medsplain

```
### Step 2: Backend Setup (FastAPI + Python)
Navigate to the backend folder

```bash
cd backend
```
Create and activate a virtual environment
```bash
python -m venv .venv
source .venv/bin/activate       # macOS/Linux
.venv\Scripts\activate          # Windows
```
Install dependencies
```bash
pip install -r requirements.txt
```
Copy environment variables
 ```bash
cp .env.example .env
 ```

Then, open .env and fill in your own keys:
 ```bash
OPENAI_API_KEY=your_openai_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/medsplain
 ```
Run the backend    
```bash
uvicorn main:app --reload
```
Visit: http://127.0.0.1:8000/docs to view FastAPI documentation.

### Step 3: Frontend Setup (Next.js + React)
Open new terminal tab/window

 ```bash
cd frontend
```
Install dependencies
```bash
npm install
```
Run local dev server
 ```bash
npm run dev
```
Visit: http://localhost:3000

 Environment variables
 ```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_APP_NAME=Medsplain
```
### Step 4: Database Setup (PostgreSQL)
Create a local database
```bash
psql -U postgres
CREATE DATABASE medsplain;
```
Apply schema (if provided later)
Migrations will be handled via Alembic in later weeks.

### Step 5: Test the Connection (Hello World)
Backend test

Go to http://127.0.0.1:8000/health
You should see:

json
Copy code
{"status":"ok","service":"backend"}
Frontend test

Visit http://localhost:3000

You should see “Hello from Medsplain!” or a sample medication input box.

✅ If both are working, your setup is complete!

## 5. Common Issues & Fixes
Issue	Possible Cause	Fix
uvicorn not found	Virtual environment not activated	Run source .venv/bin/activate
ModuleNotFoundError	Missing dependency	Run pip install -r requirements.txt
API call fails from frontend	Wrong backend URL	Check .env in frontend/ folder
Port already in use	Previous run not stopped	Kill process using port 8000 or 3000

## 6. Setup Checklist

- [ ] Repo cloned successfully  
- [ ] Backend runs locally (`uvicorn main:app --reload`)  
- [ ] Frontend runs locally (`npm run dev`)  
- [ ] “Hello World” verified  
- [ ] `.env` configured and not committed  
- [ ] PostgreSQL running locally  
- [ ] All dependencies installed without errors  

## 7. Future Environment Notes
Cloud Hosting:

Frontend → Vercel (auto-deploy on main branch)

Backend → Render or Railway (auto-deploy via GitHub)

Monitoring:
Sentry (free tier) integration for error tracking in Week 5

Testing:

Backend → pytest

Frontend → Jest + Playwright
