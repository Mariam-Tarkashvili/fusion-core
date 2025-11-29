# Grading Checklist - Week 6 & 7 Combined Homework

**Team Name:** Fusion Core  
**Project Title:** Medsplain 
**Submission Date:** 30/11/2025 
**Team Members:** Mariam Tarkashvili, Saba Samkharadze, Tekla Chapidze, Giorgi Ksovreli, Akaki Ghachava

## Part A: Week 6 - Function Calling (110 points)

### Functions Implementation (40 points)
- [ ] **Function 1:** get_medication_info - Located at: https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/src/backend/app/functions.py
- [ ] **Function 2:** check_multiple_interactions - Located at: https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/src/backend/app/functions.py
- [ ] **Function 3 (if applicable):** generate_explanation - Located at: https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/src/backend/app/functions.py
- [ ] Pydantic models defined at: https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/src/backend/app/models.py
- [ ] JSON schemas defined at: N/A yet

**Quick Navigation:**
- Functions code: https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/src/backend/app/functions.py
- Models code: https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/src/backend/app/models.py
- Agent/orchestration: N/A but here is rag_service: https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/src/backend/app/rag_service.py

### Tests & Demo (30 points)
- [ ] Test file located at: [path/to/test_functions.py]
- [ ] All tests pass (screenshot/evidence at: [path or link])
- [ ] Demo video link: [YouTube/Drive URL]
- [ ] Demo video shows: ✅ AI calling functions ✅ Multiple scenarios ✅ Error handling

### Documentation & Code Quality (20 points)
- [ ] README updated with Week 6 section: https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/README.md
- [ ] All functions have docstrings: ✅ Yes
- [ ] Type hints present: ✅ Yes 
- [ ] Error handling implemented: ✅ Yes
- [ ] No hard-coded API keys: ✅ Confirmed 

### GitHub (10 points)
- [ ] Descriptive commit messages used: ✅ Yes
- [ ] .env is NOT in repo: ✅ Confirmed
- [ ] .env.example exists: ✅ Yes
- [ ] All files pushed to main branch: ✅ Confirmed

### Evaluation & Safety Logs (10 points)
Located in: `course-pack/labs/lab-6/`
- [ ] `evaluation_notes.md`: https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/docs/week-6/evaluation-notes.md
- [ ] `safety_checklist.md`: https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/docs/week-6/safety-checklist.md
- [ ] `ai_use_log.md`: https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/docs/week-6/ai-use-log.md
- [ ] `capstone_link.md`: https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/docs/week-6/capstone-link.md

---

## Part B: Week 7 - Design Review (5 points)

### Main Documents
- [ ] Design Review Document: `docs/design-review-week7.md` - [Direct link]
- [ ] Event Schemas: `docs/event-schemas.md` - [Direct link]
- [ ] Updated Architecture Diagram: `docs/architecture-week7.[png/pdf]` - [Direct link]

### Design Review Sections Completed (check all 6)
- [ ] Section 1: Architecture Validation (1-2 pages)
- [ ] Section 2: Event Schema Documentation (2-3 pages)
- [ ] Section 3: Smoke Test Results (1-2 pages)
- [ ] Section 4: Performance Baseline (1 page)
- [ ] Section 5: Hypothesis Validation (1-2 pages)
- [ ] Section 6: Readiness Assessment (1 page)

### Evidence Folder
- [ ] Evidence folder exists at: `docs/evidence/`
- [ ] Contains: Logs, screenshots, performance data, validation results

### README Update
- [ ] README links to design review: [Direct link to README section]
- [ ] README notes architectural changes (if any): ✅ Yes / ❌ No changes

---

## Part A: Week 6 - Function Calling Implementation (110 points)

By the end of Week 6, your capstone must demonstrate working function calling with proper validation, error handling, and integration.

### 1. Function Implementations (40 points)

Create **2–3 functions** that are specific to your project and integrate them into your capstone. Each function must have clearly defined inputs and outputs, validated with Pydantic.

**Requirements:**
- ✅ Functions are specific to your project (not generic examples)
- ✅ Located in your capstone repository (not in lab folders)
- ✅ Pydantic models defined for all inputs and outputs
- ✅ JSON schemas correctly defined for the LLM
- ✅ Functions execute without errors (mock data OK for Week 6)
- ✅ AI successfully calls your functions in conversations

**Recommended File Structure:**
