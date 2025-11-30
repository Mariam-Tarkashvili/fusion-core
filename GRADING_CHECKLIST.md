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

- [x] Test file located at:
      1. https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/src/frontend/src/pages/Index.test.jsx
      2. https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/src/frontend/src/stores/MedicationStore.test.js
      3. https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/src/frontend/src/components/ExplanationDisplay.test.jsx
- [x] All tests pass: https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/docs/evidence/Medsplain%20Demo.mp4
- [x] Demo video link: https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/docs/evidence/Medsplain%20Demo.mp4
- [x] Demo video shows: ✅ AI calling functions ✅ Multiple scenarios ✅ Error handling

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

- [x] Design Review Document: `docs/design-review-week7.md` - [[Direct link](https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/docs/design-review-week7.md)]
- [x] Event Schemas: `docs/event-schemas.md` - [[Direct link](https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/docs/event-schemas.md)]
- [x] Updated Architecture Diagram: `docs/architecture-week7.[png/pdf]` - https://github.com/Mariam-Tarkashvili/fusion-core/blob/main/docs/architecture-week7.png

### Design Review Sections Completed (check all 6)

- [x] Section 1: Architecture Validation (1-2 pages)
- [x] Section 2: Event Schema Documentation (2-3 pages)
- [x] Section 3: Smoke Test Results (1-2 pages)
- [x] Section 4: Performance Baseline (1 page)
- [x] Section 5: Hypothesis Validation (1-2 pages)
- [x] Section 6: Readiness Assessment (1 page)

### Evidence Folder

- [ ] Evidence folder exists at: `docs/evidence/`
- [ ] Contains: Logs, screenshots, performance data, validation results

### README Update

- [ ] README links to design review: [Direct link to README section] !!!აქ თქვენ უნდა მიუთითოთ design review ლინკი და Root დირექტორიაში მთავარი რიდმი რომ არის, იმას მიამატეთ design review ს აღწერა. (ეს ქართული ტექსტი წაშალეთ დდდ)
- [ ] README notes architectural changes (if any): ✅ Yes

---
