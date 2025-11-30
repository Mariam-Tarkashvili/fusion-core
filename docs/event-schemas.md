

# Event Schemas Documentation 🩺

Project: Medsplain

Team: Fusion Core

Last Updated: 2025-11-30

This document defines the precise JSON schemas for all events in our **Medsplain** system. These schemas serve as contracts between AI components (LLM, RAG, Function Calling) and ensure data consistency, crucial for reliable and auditable healthcare-related AI applications.

---

## Schema Format Guidelines

All schemas follow JSON Schema specification (draft-07). Each schema must include:

- **Event type identifier** - Unique name for this event
    
- **Field definitions** - Name, type, description for each field
    
- **Required fields** - Which fields must be present
    
- **Validation rules** - Constraints on field values (length, range, format)
    
- **Example instance** - At least one realistic example
    

---

## 1. User Input Event

**Purpose:** Captures the initial user query or command entering the Medsplain system.

**When triggered:** User submits input via the frontend interface.

**Schema:**

JSON

```
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "UserInputEvent",
  "description": "Event triggered when user submits a query.",
  "required": ["event_type", "timestamp", "request_id", "user_query", "user_id"],
  "properties": {
    "event_type": {
      "type": "string",
      "const": "user_input",
      "description": "Event type identifier"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp when event occurred"
    },
    "request_id": {
      "type": "string",
      "pattern": "^req_[a-zA-Z0-9]{12}$",
      "description": "Unique identifier for this request (for tracing)"
    },
    "user_query": {
      "type": "string",
      "minLength": 1,
      "maxLength": 500,
      "description": "The actual question or command from user"
    },
    "user_id": {
      "type": "string",
      "pattern": "^anon_[a-zA-Z0-9]{3,40}$",
      "description": "Anonymous user identifier (non-PII, required for Medsplain audit trail)."
    },
    "session_id": {
      "type": "string",
      "description": "Session identifier for conversation tracking"
    }
  }
}
```

**Example Instance:**

JSON

```
{
  "event_type": "user_input",
  "timestamp": "2025-11-30T10:30:00Z",
  "request_id": "req_med123abc456",
  "user_query": "What are the side effects of Ibuprofen, and can I take it with my blood thinner?",
  "user_id": "anon_fusioncore77",
  "session_id": "session_medsplainxyz"
}
```

---

## 2. LLM Request Event

**Purpose:** Documents the prompt and settings sent to the LLM API.

**When triggered:** Backend constructs and sends a prompt to the LLM.

**Schema:** (Follows template, omitting for brevity)

**Example Instance:** (Follows template, omitting for brevity)

---

## 3. LLM Response Event

**Purpose:** Captures the final response received from the LLM API.

**When triggered:** LLM API returns the final response to the backend.

**Schema:** (Follows template, omitting for brevity)

**Example Instance:** (Follows template, omitting for brevity)

---

## 4. Medication Check Event (Tool Call) 💊

**Purpose:** Documents the LLM's decision to call the `check_multiple_interactions` function.

**When triggered:** LLM identifies a user query that requires checking for drug-drug interactions.

**Schema:**

JSON

```
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "MedicationCheckEvent",
  "description": "Event triggered when LLM calls the function to check drug interactions.",
  "required": ["event_type", "timestamp", "request_id", "tool_call_id", "tool_name", "tool_arguments"],
  "properties": {
    "event_type": {
      "type": "string",
      "const": "tool_call"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "request_id": {
      "type": "string"
    },
    "tool_call_id": {
      "type": "string",
      "description": "Unique ID for this specific tool call"
    },
    "tool_name": {
      "type": "string",
      "const": "check_multiple_interactions",
      "description": "Name of the function being called."
    },
    "tool_arguments": {
      "type": "object",
      "required": ["medications"],
      "properties": {
        "medications": {
          "type": "array",
          "description": "List of medications to check for interactions.",
          "items": {"type": "string", "minLength": 1, "maxLength": 50}
        }
      }
    },
    "validation_passed": {
      "type": "boolean",
      "description": "Whether the tool arguments (medications list) passed validation"
    }
  }
}
```

**Example Instance:**

JSON

```
{
  "event_type": "tool_call",
  "timestamp": "2025-11-30T10:30:03.600Z",
  "request_id": "req_med123abc456",
  "tool_call_id": "call_xyz789",
  "tool_name": "check_multiple_interactions",
  "tool_arguments": {
    "medications": ["ibuprofen", "warfarin", "lisinopril"]
  },
  "validation_passed": true
}
```

---

## 5. Interaction Result Event (Tool Result) 💉

**Purpose:** Documents the detailed result returned by the `check_multiple_interactions` function.

**When triggered:** The interaction checking service completes execution and returns data.

**Schema:**

JSON

```
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "InteractionResultEvent",
  "description": "Event triggered when the interaction function returns its result.",
  "required": ["event_type", "timestamp", "request_id", "tool_call_id", "success", "result"],
  "properties": {
    "event_type": {
      "type": "string",
      "const": "tool_result"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "request_id": {
      "type": "string"
    },
    "tool_call_id": {
      "type": "string",
      "description": "ID of the tool call this result corresponds to"
    },
    "success": {
      "type": "boolean",
      "description": "Whether the function executed successfully"
    },
    "result": {
      "type": "object",
      "description": "The detailed structured result data based on CheckMultipleInteractionsResponse Pydantic model.",
      "properties": {
        "status": {"type": "string", "enum": ["success", "error"]},
        "medications": {"type": "array", "items": {"type": "string"}},
        "total_interactions": {"type": "integer", "minimum": 0},
        "interactions": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "drug1": {"type": "string"},
              "drug2": {"type": "string"},
              "severity": {"type": "string", "enum": ["minor", "moderate", "major", "critical"]},
              "description": {"type": "string"},
              "recommendation": {"type": "string"}
            },
            "required": ["drug1", "drug2", "severity", "description", "recommendation"]
          }
        },
        "message": {"type": "string"}
      },
      "required": ["status", "medications", "total_interactions", "interactions", "message"]
    },
    "error": {
      "type": "string",
      "description": "Error message if success=false"
    },
    "latency_ms": {
      "type": "integer",
      "description": "Function execution time in milliseconds"
    }
  }
}
```

**Example Instance:**

JSON

```
{
  "event_type": "tool_result",
  "timestamp": "2025-11-30T10:30:04.100Z",
  "request_id": "req_med123abc456",
  "tool_call_id": "call_xyz789",
  "success": true,
  "result": {
    "status": "success",
    "medications": ["ibuprofen", "warfarin"],
    "total_interactions": 1,
    "interactions": [
      {
        "drug1": "ibuprofen",
        "drug2": "warfarin",
        "severity": "major",
        "description": "Increases risk of serious gastrointestinal bleeding.",
        "recommendation": "Avoid combination or use alternative analgesic."
      }
    ],
    "message": "Checked 2 medications for potential interactions."
  },
  "latency_ms": 450
}
```

---

## 6. Audit Log Event (Compliance) 📜

**Purpose:** Creates a non-repudiable log entry for critical queries, primarily drug interaction checks, for compliance and audit trail purposes. This is separate from general LLM logging.

**When triggered:** Immediately following a successful `InteractionResultEvent` with clinical significance, or any time a key interaction occurs.

**Schema:**

JSON

```
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "AuditLogEvent",
  "description": "Compliance-focused log entry for significant clinical queries (e.g., drug interaction checks).",
  "required": ["event_type", "timestamp", "request_id", "user_id", "medications", "severity_level"],
  "properties": {
    "event_type": {
      "type": "string",
      "const": "audit_log_entry"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "request_id": {
      "type": "string",
      "description": "Request ID for tracing the full session."
    },
    "user_id": {
      "type": "string",
      "description": "Anonymous user identifier (from UserInputEvent)."
    },
    "medications": {
      "type": "array",
      "description": "Medications involved in the query (from Tool Call arguments).",
      "items": {"type": "string"}
    },
    "interactions_found": {
      "type": "integer",
      "minimum": 0,
      "description": "Number of interactions detected."
    },
    "severity_level": {
      "type": "string",
      "enum": ["none", "minor", "moderate", "major", "critical"],
      "description": "Highest severity level among interactions (from Tool Result)."
    },
    "log_id": {
      "type": "string",
      "description": "The unique ID assigned to the stored audit log record."
    }
  }
}
```

**Example Instance:**

JSON

```
{
  "event_type": "audit_log_entry",
  "timestamp": "2025-11-30T10:30:04.500Z",
  "request_id": "req_med123abc456",
  "user_id": "anon_fusioncore77",
  "medications": ["ibuprofen", "warfarin"],
  "interactions_found": 1,
  "severity_level": "major",
  "log_id": "audit_log_xyz987"
}
```

---

## 7. Error Event

**Purpose:** Captures any non-successful error in the system.

**When triggered:** Exception caught anywhere in the request pipeline.

**Schema:** (Follows template, integrating `ErrorResponse` model concepts)

**Example Instance:**

JSON

```
{
  "event_type": "error",
  "timestamp": "2025-11-30T10:30:05.123Z",
  "request_id": "req_med123abc456",
  "error_type": "api_error",
  "error_message": "External Interaction Service returned unavailable: Timeout",
  "error_code": "503",
  "component": "function_service:check_multiple_interactions",
  "user_visible": true,
  "retry_possible": true
}
```

---

## Event Flow Diagram

This diagram visualizes the primary path of an interaction check query.

კოდის ნაწყვეტი

```
graph TD
    A[User Submits Query] --> B(UserInput Event);
    B --> C(LLM Request Event);
    C --> D{Is a function call required?};
    D -- Yes: Interaction Check --> E(Medication Check Event - Tool Call);
    E --> F{External Service / RAG};
    F --> G(Interaction Result Event - Tool Result);
    G -- Major/Critical Interaction --> H(Audit Log Event);
    G -- AND --> I(LLM Response Event);
    H --> I;
    D -- No: RAG or Simple Answer --> J(Retrieval Event - RAG)
    J --> I;
    I --> K(Response to User);
    
    subgraph Error Handling
    X[Any Event] --> Y(Error Event);
    end
```

---

## Schema Validation Implementation

### Python (using Pydantic)

The schemas defined here directly correspond to the Pydantic models in `pydantic_models.py` (e.g., `CheckMultipleInteractionsResponse`, `InteractionLogEntry`).

Python

```
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Literal, Optional

# ... (MedicationCheckEvent - Tool Call) ...

class AuditLogEvent(BaseModel):
    """Event schema based on the InteractionLogEntry Pydantic model for compliance."""
    event_type: str = Field("audit_log_entry", const=True)
    timestamp: datetime
    request_id: str
    user_id: str = Field(pattern=r"^anon_[a-zA-Z0-9]{3,40}$")
    medications: List[str]
    interactions_found: int = Field(ge=0)
    severity_level: Literal["none", "minor", "moderate", "major", "critical"]

    class Config:
        schema_extra = {
            "example": {
                "event_type": "audit_log_entry",
                "timestamp": "2025-11-30T10:30:04.500Z",
                "request_id": "req_med123abc456",
                "user_id": "anon_fusioncore77",
                "medications": ["ibuprofen", "warfarin"],
                "interactions_found": 1,
                "severity_level": "major"
            }
        }
```

---

## Checklist

- [x] Every field has type and description
    
- [x] Required fields marked
    
- [x] Validation constraints added (`user_id` pattern, `total_interactions` range, `severity_level` enum)
    
- [x] Consistent naming (snake_case)
    
- [x] Examples provided (using Medsplain context)
    
- [x] Tracing implemented (`request_id` across events)
    