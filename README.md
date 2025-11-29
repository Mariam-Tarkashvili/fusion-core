# 🚀 Fusion Core

**Built for Building AI‑Powered Applications course**

## 👥 Team Members
- Mariam Tarkashvili
- Tekla Chapidze
- Saba Samkharadze
- Akaki Ghachava
- Giorgi Ksovreli
  

---

## 📘 Project Overview

**Fusion Core** is an AI-driven platform designed to bridge innovation and intelligence — combining data, automation, and user-centric design to solve real-world problems through advanced AI models and intuitive interfaces.

This repository serves as the central workspace for our capstone project, containing all documentation, source code, research, and collaborative artifacts.

---

## 🧩 Repository Structure
```bash
FusionCore/
│
├── docs/              # Research, proposal, and documentation
├── src/               # Application source code
│   ├── backend/       # APIs, AI models, and services
│   └── frontend/      # Web or mobile UI components
│
├── data/              # Datasets and preprocessing scripts
│
├── notebooks/         # Jupyter notebooks for experiments and analysis
│
├── tests/             # Unit and integration tests
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🎯 Week 2 Deliverable: Capstone Proposal

### Contents
- **Problem Statement:** What problem we aim to solve and why it matters
- **Target Users:** Who benefits and their core pain points
- **Success Criteria:** How we'll measure impact and effectiveness
- **Technical Architecture:** Preliminary system design and components
- **Risk Assessment:** Anticipated challenges and mitigation strategies
- **Research Plan:** Key learning goals and experimental directions
- **User Study Plan:** Approach to collecting and analyzing user feedback
- **Team Contract:** Roles, responsibilities, and collaboration norms
- **IRB Light Checklist:** Compliance for user research

---

## ⚙️ Team Workflow

- **Version Control:** GitHub (feature branches + pull requests)
- **Communication:** GitHub Issues, Discussions, and weekly meetings
- **Task Management:** Milestones and GitHub Projects
- **Conflict Resolution:** Consensus-based, escalating to instructor if needed

---

## 🧠 Vision Statement

Our goal is to create a meaningful, scalable AI solution that enhances real-world decision-making and delivers measurable value to users through intelligent automation, human-centered design, and transparent AI practices.

---

## 📅 Timeline

- **Week 2:** Team formation & Capstone Proposal submission
- **Future Weeks:** Iterative development, model training, user testing, and final demo

---

## 📄 License

This project is part of an academic course and follows the institution's collaboration and academic honesty guidelines.

---

## 📅 Week 6: Function Calling Implementation

This week implements the RAG-powered medication intelligence backend with function calling support for Gemini. Below is the required documentation of all backend functions, their inputs, outputs, and use cases.

---

## 🧩 Implemented Functions (Backend: `functions.py`)

### 1. `get_medication_info`

**Input:**
- `medication_name: str`
- `include_interactions: bool` (optional)
- `include_side_effects: bool` (optional)

**Output:**
```json
{
  "status": "success" | "error",
  "data": { ... } // medication details
}
```

**Use Case:** Retrieves medication data using RAG (OpenFDA) — drug class, uses, dosage, warnings, side effects, interactions (optional).

---

### 2. `check_multiple_interactions`

**Input:**
- `medications: List[str]` (2–5 items)

**Output:**
```json
{
  "status": "success",
  "data": {
    "medications": [...],
    "total_interactions": number,
    "interactions": [...],
    "sources": [...]
  }
}
```

**Use Case:** Evaluates drug-drug interactions using OpenFDA labels. Handles invalid inputs and missing data with clear messages.

---

### 3. `generate_explanation`

**Input:**
- `medication_name: str`

**Output:**
```json
{
  "status": "success" | "error",
  "data": {
    "explanation": str,
    "reading_level": float,
    "sources": [...],
    "retrieved_data": {...}
  }
}
```

**Use Case:** Produces a plain-language explanation using OpenFDA + Gemini. Includes readability scoring and citations.

**Error Handling:** Returns error if `GEMINI_API_KEY` is missing (preventing hard-coded secrets).

---

### 4. `log_interaction_query`

**Input:**
- `medications: List[str]`
- `interactions_found: int`
- `severity_level: str`
- `timestamp` (optional)

**Output:**
```json
{
  "status": "success",
  "log_id": "log_xxx",
  "message": "Query logged successfully."
}
```

**Use Case:** Minimal in-memory interaction logging used for analytics and later database expansion.

---

### 5. `submit_feedback`

**Input:**
- `explanation_id: str`
- `user_id: str`
- `feedback_type: str` (helpful or unclear)
- `comment: str` (optional)

**Output:**
```json
{
  "status": "success",
  "feedback_id": "fb_xxx"
}
```

**Use Case:** Captures user feedback on explanations to improve future model outputs.

---

## 🧪 Code Quality & Documentation Checklist

| Requirement | Status |
|------------|--------|
| README updated with Week 6 section | ✅ Done |
| Docstrings on all functions | ✔️ Yes (all functions documented) |
| Type hints present | ✔️ Yes |
| Error handling | ✔️ Implemented (no API key, not found, invalid input) |
| No hard-coded API keys | ✔️ Uses environment variables (`GEMINI_API_KEY`) |

---

## 📘 Notes for Graders

- The upadte of this README.md hasn't been requested until now, so the previous part was created in week 1-2
- The backend uses **RAG via OpenFDA** + **AI reasoning via Gemini function calling**.
- All functions return **structured, predictable JSON** for reliability.
- Validation is enforced using **Pydantic models** (in `models.py`).
- All secrets are managed via `.env` and **never committed to Git**.
