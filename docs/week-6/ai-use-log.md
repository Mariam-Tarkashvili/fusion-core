# Lab 6 AI Use Log - Medsplain

**Project:** Medsplain - Medication Intelligence Assistant  
**Date:** November 14, 2025

---

## Purpose
This log documents all AI tools used during Lab 6 implementation, including what they helped with and how the output was reviewed/modified.

---

## AI Tools Used

### 1. **Claude (Anthropic)**
**When:** Throughout Lab 6 implementation  
**What it helped with:**
- Reviewing Pydantic model definitions for proper validation
- Suggesting error handling patterns for Flask endpoints
- Generating test cases for `evaluation_notes.md`
- Writing documentation templates (this file, safety checklist)
- Debugging Gemini API request/response format issues

**How output was reviewed:**
- All generated code was tested in Postman before acceptance
- Pydantic validation rules were manually verified against function spec
- Error handling was tested with invalid inputs to ensure it works

**Modifications made:**
- Adjusted Pydantic field constraints (e.g., `constr` min/max lengths)
- Simplified error responses to match project style
- Added medical disclaimer language

---

### 4. **Gemini API (Google)** *(Your LLM provider)*
**When:** Used as the core LLM for function calling in `/api/chat` endpoint  
**What it does:**
- Parses user medication queries
- Determines which function to call (`check_multiple_interactions`, `get_medication_info`, etc.)
- Returns structured function call arguments

**How output is validated:**
- Gemini's function call arguments are validated by Pydantic models before execution
- If Gemini returns unexpected format, error is caught and logged
- Temperature set to 0.0 for deterministic responses

**Human oversight:**
- All function execution results are reviewed by backend logic
- Medical advice disclaimer added to all user-facing responses

---

## Key Principles Followed

1. **Never Trust AI Output Blindly**
   - All AI-generated code was tested before committing
   - Function logic was manually verified against specification

2. **AI as Assistant, Not Author**
   - Used AI to accelerate boilerplate writing (Pydantic models, docs)
   - Core business logic (interaction checks) written/reviewed manually

3. **Security & Privacy First**
   - Did NOT use AI to generate API keys or secrets
   - Reviewed all AI suggestions for security risks (e.g., input validation)

4. **Documentation & Learning**
   - Used AI to explain unfamiliar patterns (e.g., Gemini function calling format)
   - Documented understanding in comments and this log

---

## Reflection

**What AI helped with most:**
- Speeding up documentation writing (evaluation notes, checklists)
- Generating test case tables
- Suggesting error handling patterns

**What I did manually:**
- Core medication interaction logic
- API endpoint structure and routing
- Testing and validation of all functions
- Security review and input sanitization

**Lessons Learned:**
- AI is excellent for generating templates and boilerplate
- Always verify AI-generated code with real tests
- AI explanations are useful for learning new APIs (e.g., Gemini function calling)

---

## Compliance Statement

I confirm that:
- All AI-generated content was reviewed and tested by me
- All sources (AI tools, documentation) are cited in this log


