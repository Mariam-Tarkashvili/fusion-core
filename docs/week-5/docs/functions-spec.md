# Functions Specification — Medsplain

**Module:** Medication Intelligence / Safety  
**Owner:** Fusion Core  
**Version:** 1.0  
**Date:** 2025-11-05

---

## Purpose

Define stable, well-typed function contracts for medication lookups, interaction checks, and safety logging.

---

## Function 1: `check_multiple_interactions`

### Purpose
Check for potential drug–drug interactions across 2–5 medications and return severities, descriptions, and recommendations.

### When to call
- "Can I take A with B?"
- "Are A, B, C safe together?"
- Before suggesting combined regimens in chat flows.

### Request (JSON Schema)

```json
{
  "type": "object",
  "properties": {
    "medications": {
      "type": "array",
      "description": "List of medication names (generic or brand).",
      "items": { "type": "string", "minLength": 1 },
      "minItems": 2,
      "maxItems": 5
    }
  },
  "required": ["medications"],
  "additionalProperties": false
}
```

### Success Response (JSON)

```json
{
  "status": "success",
  "data": {
    "medications": ["aspirin", "ibuprofen", "warfarin"],
    "pairs_evaluated": 3,
    "total_interactions": 2,
    "interactions": [
      {
        "drug1": "aspirin",
        "drug2": "warfarin",
        "severity": "major",
        "description": "Increases bleeding risk; overlapping antiplatelet/anticoagulant effects.",
        "recommendation": "Avoid combination or co-manage with INR monitoring and clinician oversight."
      },
      {
        "drug1": "ibuprofen",
        "drug2": "warfarin",
        "severity": "moderate",
        "description": "Potential displacement and GI bleeding risk.",
        "recommendation": "Prefer acetaminophen; if necessary, shortest course with monitoring."
      }
    ],
    "message": "Checked 3 medications across 3 pairs."
  }
}
```

### Error Response (JSON)

```json
{
  "status": "error",
  "message": "At least 2 and at most 5 medications are required."
}
```

### Notes & Constraints
- Validate names against a verified drug knowledge base (normalize brand→generic where applicable).
- De-duplicate inputs; ignore case/whitespace.
- Cap at 5 meds to keep O(n²) pair checks bounded.
- Rate limit: 20 calls/min/user.
- Observability: log result (see `log_interaction_query`).

---

## Function 2: `get_medication_info`

### Purpose
Retrieve canonical drug information: generic/brand names, class, uses, common dosage ranges, side effects, warnings; optionally common interactions.

### When to call
- "What is ibuprofen used for?"
- "Side effects of metformin?"
- Before building an interaction explanation.

### Request (JSON Schema)

```json
{
  "type": "object",
  "properties": {
    "medication_name": {
      "type": "string",
      "description": "Generic or brand name.",
      "minLength": 1
    },
    "include_interactions": {
      "type": "boolean",
      "description": "Include common interaction list.",
      "default": false
    },
    "include_side_effects": {
      "type": "boolean",
      "description": "Include common side effects.",
      "default": true
    }
  },
  "required": ["medication_name"],
  "additionalProperties": false
}
```

### Success Response (JSON)

```json
{
  "status": "success",
  "data": {
    "generic_name": "ibuprofen",
    "brand_names": ["Advil", "Motrin", "Nurofen"],
    "drug_class": "NSAID",
    "uses": ["Pain relief", "Fever reduction", "Inflammation reduction"],
    "common_dosage": "200–800 mg every 4–6 hours; max 3200 mg/day (adult).",
    "side_effects": ["Dyspepsia", "Nausea", "Dizziness"],
    "warnings": ["Avoid with other NSAIDs", "Increased bleeding risk"],
    "interactions": [
      {
        "with": "warfarin",
        "severity": "moderate",
        "note": "Bleeding risk; consider alternatives or monitor."
      }
    ]
  }
}
```

### Error Response (JSON)

```json
{
  "status": "error",
  "message": "Medication 'xyzabc' not found."
}
```

### Notes & Constraints
- Normalize and validate `medication_name`; prefer returning canonical generic.
- When `include_interactions=false`, omit `"interactions"` key to reduce payload.
- Rate limit: 30 calls/min/user.
- Observability: log searches for safety analytics.

---

## Function 3: `log_interaction_query`

### Purpose
Persist an audit trail of interaction checks (anonymized), for safety monitoring, analytics, and compliance.

### When to call
- After every interaction check (success or error with validated inputs).
- When warnings or advice are shown to a user.

### Request (JSON Schema)

```json
{
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "Anonymous, non-PII user identifier."
    },
    "medications": {
      "type": "array",
      "description": "Medications that were checked.",
      "items": { "type": "string", "minLength": 1 },
      "minItems": 1
    },
    "interactions_found": {
      "type": "integer",
      "minimum": 0
    },
    "severity_level": {
      "type": "string",
      "enum": ["none", "minor", "moderate", "major", "critical"],
      "default": "none"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601; defaults server-side to now."
    }
  },
  "required": ["user_id", "medications", "interactions_found"],
  "additionalProperties": false
}
```

### Success Response (JSON)

```json
{
  "status": "success",
  "log_id": "log_abc123xyz",
  "message": "Query logged successfully."
}
```

### Error Response (JSON)

```json
{
  "status": "error",
  "message": "Failed to log query: database connection error."
}
```

### Notes & Constraints
- No rate limiting: logging must not be dropped (use internal buffering/retry).
- Encrypt logs at rest and in transit; rotate keys.
- Retention aligned with healthcare regulatory policy.

---

## Common Error Codes

| Code | Meaning |
|------|---------|
| `bad_request` | Schema validation failed (missing/invalid) |
| `not_found` | Medication not in knowledge base |
| `rate_limited` | Per-user or global throttle exceeded |
| `server_error` | Unexpected internal error |
| `unavailable` | Upstream DB/API temporarily unavailable |

All error payloads follow:

```json
{
  "status": "error",
  "code": "bad_request",
  "message": "Human-readable detail."
}
```

---

## Security & Compliance

### PII
- Not accepted; `user_id` must be anonymized.

### Validation
- Sanitize strings; reject control characters and SQL/NoSQL meta-chars.

### RBAC
- Write access restricted; read access to logs limited to compliance roles.

### Observability
- Structured logs with correlation IDs.

### Regulatory
- Align with HIPAA/local equivalents; document data flows and retention.

---

✅ **End of Specification — Medsplain Functions v1.0**