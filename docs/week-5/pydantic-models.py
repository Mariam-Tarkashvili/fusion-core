"""
===============================================================================
 Pydantic Models — Medsplain Week 5
 Project: Medsplain
 Owner: Fusion Core
 Date: 2025-11-05
===============================================================================

Purpose:
Define strict Pydantic schemas for data validation, AI responses,
and function inputs/outputs (Week 5: Function Calling & RAG Integration).

These models mirror the JSON structures defined in:
→ docs/week-5/functions-spec.md

They provide:
 - Type safety & schema validation
 - Clear field descriptions for IDE/autocompletion
 - Auto-generated examples for AI-assisted development
===============================================================================
"""

from __future__ import annotations
from pydantic import BaseModel, Field, EmailStr, constr
from typing import List, Literal, Optional
from datetime import datetime


# ========================================
# CORE MEDICATION MODELS
# ========================================

class Interaction(BaseModel):
    """Represents a single drug-drug interaction record."""
    drug1: str = Field(..., description="Name of the first medication in the interaction pair.")
    drug2: str = Field(..., description="Name of the second medication in the interaction pair.")
    severity: Literal["minor", "moderate", "major", "critical"] = Field(
        ..., description="Clinical significance level of the interaction."
    )
    description: str = Field(..., description="Summary of how these drugs interact.")
    recommendation: str = Field(..., description="Suggested clinical action or monitoring steps.")

    class Config:
        json_schema_extra = {
            "example": {
                "drug1": "aspirin",
                "drug2": "warfarin",
                "severity": "major",
                "description": "Increases bleeding risk via antiplatelet and anticoagulant effects.",
                "recommendation": "Avoid combination or co-manage with INR monitoring."
            }
        }


class CheckMultipleInteractionsResponse(BaseModel):
    """Response schema for check_multiple_interactions function."""
    status: Literal["success", "error"] = Field(..., description="Overall status of the query.")
    medications: List[str] = Field(..., description="List of medications checked.")
    total_interactions: int = Field(ge=0, description="Total number of detected interactions.")
    interactions: List[Interaction] = Field(
        default_factory=list, description="List of detected interactions with details."
    )
    message: str = Field(..., description="Summary message of the operation.")

    class Config:
        json_schema_extra = {
            "example": {
                "status": "success",
                "medications": ["aspirin", "ibuprofen", "warfarin"],
                "total_interactions": 2,
                "interactions": [
                    {
                        "drug1": "aspirin",
                        "drug2": "warfarin",
                        "severity": "major",
                        "description": "Increased risk of bleeding.",
                        "recommendation": "Avoid or monitor INR closely."
                    }
                ],
                "message": "Checked 3 medications across 3 possible pairs."
            }
        }


class MedicationInfo(BaseModel):
    """Detailed information about a single medication."""
    generic_name: str = Field(..., description="Generic drug name.")
    brand_names: List[str] = Field(..., description="List of brand or trade names.")
    drug_class: str = Field(..., description="Pharmacological or therapeutic class.")
    uses: List[str] = Field(..., description="Approved or common uses.")
    common_dosage: Optional[str] = Field(None, description="Typical dosage or administration instructions.")
    side_effects: List[str] = Field(default_factory=list, description="Commonly reported side effects.")
    warnings: List[str] = Field(default_factory=list, description="Key warnings or precautions.")
    interactions: Optional[List[Interaction]] = Field(
        None, description="Optional common interactions if requested."
    )

    class Config:
        json_schema_extra = {
            "example": {
                "generic_name": "ibuprofen",
                "brand_names": ["Advil", "Motrin", "Nurofen"],
                "drug_class": "NSAID",
                "uses": ["Pain relief", "Fever reduction", "Inflammation"],
                "common_dosage": "200–800 mg every 4–6 hours, max 3200 mg/day",
                "side_effects": ["Nausea", "Dizziness", "Stomach upset"],
                "warnings": ["Avoid with other NSAIDs", "Increased bleeding risk"]
            }
        }


class GetMedicationInfoResponse(BaseModel):
    """Response wrapper for get_medication_info function."""
    status: Literal["success", "error"]
    data: Optional[MedicationInfo] = Field(None, description="Medication details if found.")
    message: Optional[str] = Field(None, description="Optional message, used for errors or summaries.")


# ========================================
# LOGGING AND AUDIT TRAIL MODELS
# ========================================

class InteractionLogEntry(BaseModel):
    """Schema for logging each interaction query (compliance/audit trail)."""
    user_id: constr(strip_whitespace=True, min_length=3, max_length=40) = Field(
        ..., description="Anonymous user identifier (non-PII)."
    )
    medications: List[str] = Field(..., description="Medications involved in the query.")
    interactions_found: int = Field(ge=0, description="Number of interactions detected.")
    severity_level: Literal["none", "minor", "moderate", "major", "critical"] = Field(
        "none", description="Highest severity level among interactions."
    )
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="Time of query in UTC (ISO 8601 format)."
    )

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "anon_789",
                "medications": ["warfarin", "aspirin"],
                "interactions_found": 1,
                "severity_level": "major",
                "timestamp": "2025-11-05T15:30:00Z"
            }
        }


class LogResponse(BaseModel):
    """Response schema for successful or failed logging events."""
    status: Literal["success", "error"]
    log_id: Optional[str] = Field(None, description="Generated log entry identifier.")
    message: str = Field(..., description="Human-readable status message.")

    class Config:
        json_schema_extra = {
            "example": {
                "status": "success",
                "log_id": "log_abc123xyz",
                "message": "Query logged successfully."
            }
        }


# ========================================
# COMMON ERROR MODEL
# ========================================

class ErrorResponse(BaseModel):
    """Standardized error response model."""
    status: Literal["error"] = "error"
    code: Literal["bad_request", "not_found", "server_error", "unavailable"] = "server_error"
    message: str = Field(..., description="Human-readable error message.")
    details: Optional[dict] = Field(None, description="Optional debug or validation context.")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "status": "error",
                "code": "not_found",
                "message": "Medication 'amoxicillin' not found in database.",
                "timestamp": "2025-11-05T14:00:00Z"
            }
        }


# ========================================
# VALIDATION DEMO (RUN EXAMPLES)
# ========================================

if __name__ == "__main__":
    # Example 1 — Successful interaction check
    result = CheckMultipleInteractionsResponse(
        status="success",
        medications=["aspirin", "warfarin"],
        total_interactions=1,
        interactions=[
            Interaction(
                drug1="aspirin",
                drug2="warfarin",
                severity="major",
                description="Increased bleeding risk.",
                recommendation="Avoid or monitor INR closely."
            )
        ],
        message="Checked 2 medications for potential interactions."
    )
    print(result.model_dump_json(indent=2))

    # Example 2 — Medication information parsing
    med = MedicationInfo(
        generic_name="metformin",
        brand_names=["Glucophage"],
        drug_class="Biguanide",
        uses=["Type 2 Diabetes"],
        common_dosage="500–2000 mg/day in divided doses",
        side_effects=["Nausea", "Diarrhea"],
        warnings=["Avoid in severe renal impairment"]
    )
    print(med.model_dump_json(indent=2))

    # Example 3 — Logging query
    log = InteractionLogEntry(
        user_id="anon_999",
        medications=["ibuprofen", "warfarin"],
        interactions_found=1,
        severity_level="moderate"
    )
    print(log.model_dump_json(indent=2))
