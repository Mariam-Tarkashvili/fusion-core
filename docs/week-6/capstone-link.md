# Lab 6 Capstone Project Link - Medsplain

**Project:** Medsplain - Medication Intelligence Assistant    
**Date:** November 14, 2025

---

## How Lab 6 Functions Connect to Capstone

### Capstone Project Overview
**Medsplain** is an AI-powered medication explanation tool that helps users understand drug interactions, side effects, and usage in plain language. The MVP focuses on providing clear, cited explanations of medication safety.

**Target Users:** Patients, caregivers, and anyone taking multiple medications who want to understand potential interactions.

---

## Lab 6 Functions That Will Be Used in Capstone

### 1. ✅ `check_multiple_interactions` - **CORE CAPSTONE FEATURE**

**Why this function is critical:**
- This is the **primary value proposition** of Medsplain
- Users will input 2-5 medications and get instant interaction warnings
- Severity levels (`minor`, `moderate`, `major`, `critical`) guide user action

**How it fits into MVP workflow:**
1. User enters medication names in web interface
2. Backend calls `check_multiple_interactions` via `/api/chat` endpoint
3. Gemini LLM parses query and invokes function
4. Results displayed with severity badges and recommendations
5. Query logged for safety analytics

**Next improvement:**
- Replace mock drug database with **OpenFDA API** for real-time drug data
- Add caching layer (Redis) for frequently checked medication pairs
- Implement batch checking for prescription lists (future feature)

---

### 2. ✅ `get_medication_info` - **SUPPORTING FEATURE**

**Why this function matters:**
- Provides context for interaction warnings
- Helps users understand *why* certain combinations are risky
- Enables "Tell me more about [drug]" follow-up queries

**How it fits into MVP workflow:**
1. After interaction check, user clicks "Learn more" on a medication
2. Backend calls `get_medication_info` with `include_interactions=True`
3. Displays drug class, uses, side effects, and warnings
4. Linked to RAG pipeline (Week 7+) for generating plain-language summaries

**Next improvement:**
- Add **readability scoring** to explanations (Flesch-Kincaid grade)
- Include visual severity indicators (color-coded badges)
- Add "Similar medications" suggestions for safer alternatives

---

### 3. ✅ `log_interaction_query` - **SAFETY & COMPLIANCE**

**Why this function is essential:**
- Healthcare applications require **audit trails** for liability protection
- Enables safety analytics: "Which drug pairs are most commonly queried?"
- Future feature: Alert system if dangerous combination is repeatedly searched

**How it fits into MVP workflow:**
1. Every interaction check is automatically logged (anonymous)
2. Logs include: medications, severity, timestamp, user_id (anonymized)
3. Stored in-memory for MVP; will move to **encrypted database** (PostgreSQL) in production

**Next improvement:**
- Add persistent storage with encryption at rest
- Build admin dashboard to monitor high-risk queries
- Implement alerting for critical-severity searches (potential safety issue)

---

## MVP Feature Implementation Status

| Feature | Lab 6 Status | Capstone Integration | Next Sprint |
|---------|-------------|---------------------|-------------|
| Multi-drug interaction check | ✅ Working (mock data) | Core feature | Connect to OpenFDA API |
| Medication info lookup | ✅ Working (mock data) | Supporting feature | Add readability scoring |
| Safety query logging | ✅ Working (in-memory) | Compliance feature | Add persistent storage |
| RAG-based explanations | ❌ Not started | Core feature | Week 7 implementation |
| Source citations | ❌ Not started | Transparency feature | Week 8 implementation |
| User feedback mechanism | ❌ Not started | Improvement loop | Week 9 implementation |

---

## Next Steps for Capstone Development

### Week 7 (Current Priority):
1. **Integrate OpenFDA API** for real drug data
   - Replace `_MED_DB` mock with live API calls
   - Add error handling for API downtime (fallback to cache)
   - Test with real medication names users will search

2. **Build RAG Pipeline** for plain-language explanations
   - Retrieve drug monographs from OpenFDA/RxNorm
   - Use Gemini to generate 8th-grade reading level summaries
   - Add Flesch-Kincaid readability scoring

3. **Add Source Citations** to explanations
   - Display "Source: FDA Drug Label, 2024" with each fact
   - Link to original sources (e.g., DailyMed)

### Week 8-9 (Secondary Features):
4. **Frontend Development**
   - Build React interface for medication input
   - Display interaction results with severity badges
   - Add "Was this helpful?" feedback buttons

5. **Persistent Storage**
   - Migrate logs to PostgreSQL with encryption
   - Add user session management (optional login)

6. **Testing & Iteration**
   - User testing with 5-10 patients/caregivers
   - Collect feedback on explanation clarity
   - Iterate on prompt engineering for better summaries

---

## Why This Lab Was Important

**Before Lab 6:**
- Had a concept (medication safety assistant)
- No working functions or AI integration

**After Lab 6:**
- 3 core functions fully implemented and tested
- Gemini function calling integrated
- Clear path to MVP completion

**Key Insight:**
Function calling transforms an AI chatbot from "text in, text out" to a **real application** that can query databases, perform calculations, and take actions. This is the foundation for everything else in Medsplain.

---

## Conclusion

Lab 6's three functions (`check_multiple_interactions`, `get_medication_info`, `log_interaction_query`) form the **backend core** of the Medsplain capstone project. All three will be used in the MVP, with `check_multiple_interactions` being the primary user-facing feature.

**Next milestone:** Connect functions to real drug databases (OpenFDA) and add RAG-based explanation generation.

**Goal:** Have a working demo by Week 8 where users can check real medications and get plain-language safety warnings.

---

**Ready to build the future of medication safety! 💊🤖**
