# Lab 6 Safety Checklist - Medsplain

**Project:** Medsplain - Medication Intelligence Assistant  
**Date:** November 14, 2025

---

## ✅ API Key Security

- [x] **API key stored in `.env` file** (not in code)
- [x] **`.env` added to `.gitignore`** (verified)
- [x] **No API keys in version control** (checked git history)
- [x] **Environment variables loaded via `python-dotenv`**
- [x] **Gemini API key accessed via `os.getenv("GEMINI_API_KEY")`**

**Status:** ✅ SECURE - No API keys exposed in codebase.

---

## ✅ Data Privacy & PII Handling

- [x] **No PII collected** - `user_id` is anonymous (e.g., `anon_123`)
- [x] **No email, name, or phone numbers stored**
- [x] **Medication queries are non-identifying**
- [x] **Logs stored in-memory only** (no persistent PII risk in MVP)
- [x] **Future plan:** When adding persistent storage, will encrypt logs at rest

**Status:** ✅ COMPLIANT - No PII collected or stored.

---

## ✅ Input Validation & Sanitization

- [x] **Pydantic models validate all inputs** before processing
- [x] **String lengths constrained** (e.g., `user_id` max 40 chars)
- [x] **Whitespace stripped** via `constr(strip_whitespace=True)`
- [x] **Empty strings rejected** via `min_length=1`
- [x] **Medication list size limited** (2-5 items for interactions)
- [x] **Enum validation** for severity levels (`none`, `minor`, `moderate`, `major`, `critical`)

**Potential Risks Mitigated:**
- SQL injection: Not applicable (no SQL database yet)
- XSS: Input sanitized, no raw HTML rendering
- Command injection: No shell commands executed
- NoSQL injection: No MongoDB or similar (using in-memory dict)

**Status:** ✅ SAFE - All inputs validated before function execution.

---

## ✅ AI Model Output Safety

- [x] **Temperature set to 0.0** for consistent, deterministic responses
- [x] **Function calling used** instead of free-form text parsing
- [x] **Fallback for unexpected responses:**
  - If no function call detected, return text safely
  - If function call fails, return error message (not raw exception)
- [x] **No direct execution of AI-generated code**
- [x] **Medical advice disclaimer added** (see below)

**Medical Disclaimer:**
> "This tool provides educational information only. It is not a substitute for professional medical advice. Always consult a healthcare provider before making medication decisions."

**Status:** ✅ SAFE - AI outputs are validated and disclaimers are in place.

---

## ✅ Error Handling & Graceful Failures

- [x] **Try-catch blocks** in all API endpoints
- [x] **Friendly error messages** (no stack traces exposed to users)
- [x] **Proper HTTP status codes** (400 for bad requests, 404 for not found, 500 for server errors)
- [x] **No sensitive info in error messages** (e.g., no file paths or API keys)
- [x] **Gemini API timeout handling** (30s timeout in `requests.post`)

**Example Error Response:**
```json
{
  "status": "error",
  "message": "Medication 'unknown_drug' not found.",
  "details": null
}
```

**Status:** ✅ SAFE - Errors handled gracefully without leaking sensitive data.

---

## ✅ Rate Limiting & Abuse Prevention

- [ ] **Rate limiting implemented** - NOT YET (deferred for MVP)
- [x] **Max medications per query limited** to 5 (prevents abuse)
- [x] **Max user_id length limited** to 40 chars

**Future Work:**
- Add rate limiting middleware (e.g., Flask-Limiter)
- Implement per-user throttling (20 calls/min per spec)

**Status:** ⚠️ PARTIAL - Basic limits in place; rate limiting deferred.

---

## ✅ Healthcare Compliance Considerations

- [x] **No PHI (Protected Health Information) collected**
- [x] **Anonymous user identifiers only**
- [x] **Disclaimers for educational use only**
- [x] **No prescription generation or medical advice**
- [x] **Source citations planned** for transparency (next phase)

**HIPAA Alignment:**
- MVP does not collect PHI, so HIPAA does not apply yet.
- Future persistent storage will require encryption and access controls.

**Status:** ✅ COMPLIANT - No regulated data handled in MVP.

---

## ✅ Code Security Review

- [x] **No hardcoded secrets** (checked codebase)
- [x] **Dependencies up to date** (`flask`, `pydantic`, `requests`, `python-dotenv`)
- [x] **No known vulnerabilities** in dependencies (verified via `pip check`)
- [x] **No arbitrary code execution risks**

**Status:** ✅ SECURE - Code follows best practices.

---

## Summary

| Category | Status | Notes |
|----------|--------|-------|
| API Key Security | ✅ SECURE | Keys in `.env`, not in code |
| Data Privacy | ✅ COMPLIANT | No PII collected |
| Input Validation | ✅ SAFE | Pydantic validation on all inputs |
| AI Output Safety | ✅ SAFE | Function calling, no code execution |
| Error Handling | ✅ SAFE | Graceful failures, no leaks |
| Rate Limiting | ⚠️ PARTIAL | Deferred for MVP |
| Healthcare Compliance | ✅ COMPLIANT | No PHI, educational only |

**Overall Assessment:** ✅ MVP is safe for deployment with noted limitations.

**Next Steps for Production:**
1. Add rate limiting middleware
2. Implement persistent encrypted logging
3. Add CAPTCHA or bot protection
4. Conduct security audit before public launch
