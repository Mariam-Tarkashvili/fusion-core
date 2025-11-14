# backend/app/models.py
from __future__ import annotations
from pydantic import BaseModel, Field, constr
from typing import List, Optional, Literal
from datetime import datetime

# -----------------------
# Request models
# -----------------------

class CheckInteractionsRequest(BaseModel):
    medications: List[constr(strip_whitespace=True, min_length=1)] = Field(
        ..., description="List of medication names (generic or brand). 2-5 items."
    )

    class Config:
        schema_extra = {
            "example": {"medications": ["aspirin", "ibuprofen", "warfarin"]}
        }

class GetMedicationInfoRequest(BaseModel):
    medication_name: constr(strip_whitespace=True, min_length=1) = Field(..., description="Generic or brand name.")
    include_interactions: bool = Field(False, description="Include common interaction list.")
    include_side_effects: bool = Field(True, description="Include common side effects.")

    class Config:
        schema_extra = {"example": {"medication_name": "ibuprofen", "include_interactions": True}}

class LogInteractionQueryRequest(BaseModel):
    user_id: constr(strip_whitespace=True, min_length=3, max_length=40) = Field(..., description="Anonymous, non-PII user identifier.")
    medications: List[constr(strip_whitespace=True, min_length=1)] = Field(..., description="Medications that were checked.")
    interactions_found: int = Field(..., ge=0)
    severity_level: Literal["none", "minor", "moderate", "major", "critical"] = Field("none")
    timestamp: Optional[datetime] = Field(None, description="ISO 8601; server will default to now if omitted.")

    class Config:
        schema_extra = {
            "example": {
                "user_id": "anon_123",
                "medications": ["warfarin", "aspirin"],
                "interactions_found": 1,
                "severity_level": "major"
            }
        }

# -----------------------
# Response models
# -----------------------

class InteractionItem(BaseModel):
    drug1: str
    drug2: str
    severity: Literal["minor", "moderate", "major", "critical"]
    description: str
    recommendation: str

class CheckMultipleInteractionsResponseData(BaseModel):
    medications: List[str]
    pairs_evaluated: int
    total_interactions: int
    interactions: List[InteractionItem]
    message: Optional[str]

class GenericSuccessResponse(BaseModel):
    status: Literal["success"]
    data: Optional[dict] = None
    message: Optional[str] = None

class CheckMultipleInteractionsResponse(BaseModel):
    status: Literal["success", "error"]
    data: Optional[CheckMultipleInteractionsResponseData] = None
    message: Optional[str] = None

class MedicationInteractionShort(BaseModel):
    with_: str = Field(..., alias="with")
    severity: Literal["minor", "moderate", "major", "critical"]
    note: str

class MedicationInfoData(BaseModel):
    generic_name: str
    brand_names: List[str]
    drug_class: str
    uses: List[str]
    common_dosage: Optional[str]
    side_effects: Optional[List[str]]
    warnings: Optional[List[str]]
    interactions: Optional[List[MedicationInteractionShort]]

class GetMedicationInfoResponse(BaseModel):
    status: Literal["success", "error"]
    data: Optional[MedicationInfoData] = None
    message: Optional[str] = None

class LogInteractionQueryResponse(BaseModel):
    status: Literal["success", "error"]
    log_id: Optional[str] = None
    message: Optional[str] = None

class ErrorResponse(BaseModel):
    status: Literal["error"] = "error"
    code: Literal["bad_request", "not_found", "server_error", "unavailable"] = "server_error"
    message: str
    details: Optional[dict] = None
