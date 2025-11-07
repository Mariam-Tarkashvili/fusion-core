from pydantic import BaseModel, Field, field_validator
from typing import List, Literal, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class MedicationInfoRequest(BaseModel):
    medication: str = Field(
        min_length=1,
        max_length=100,
        description="Name of medication (brand or generic)"
    )

    @field_validator('medication')
    @classmethod
    def sanitize_medication(cls, v: str) -> str:
        return v.strip()

    class Config:
        json_schema_extra = {
            "example": {
                "medication": "Lipitor"
            }
        }


class MedicationInfoData(BaseModel):
    brand_name: str = Field(description="Brand name of medication")
    generic_name: str = Field(description="Generic/chemical name")
    purpose: List[str] = Field(description="What the medication treats")
    indications_and_usage: List[str] = Field(description="When to use this medication")
    warnings: List[str] = Field(description="Important warnings")
    warnings_and_cautions: List[str] = Field(description="Additional cautions")
    dosage_and_administration: List[str] = Field(description="How to take it")
    adverse_reactions: List[str] = Field(description="Possible side effects")
    drug_interactions: List[str] = Field(description="Known drug interactions")
    how_supplied: List[str] = Field(description="Available forms and strengths")

    class Config:
        json_schema_extra = {
            "example": {
                "brand_name": "Lipitor",
                "generic_name": "Atorvastatin",
                "purpose": ["Lowers cholesterol and triglycerides in the blood"],
                "indications_and_usage": ["Used to lower cholesterol levels..."],
                "warnings": ["May cause muscle problems..."],
                "warnings_and_cautions": ["Tell your doctor if you have liver disease..."],
                "dosage_and_administration": ["Take once daily, with or without food..."],
                "adverse_reactions": ["Common: headache (3%), muscle pain (5%)..."],
                "drug_interactions": ["May interact with grapefruit juice..."],
                "how_supplied": ["Available as 10mg, 20mg, 40mg, 80mg tablets"]
            }
        }


class MedicationInfoResponse(BaseModel):
    status: Literal["success", "error"] = Field(description="Request status")
    data: Optional[MedicationInfoData] = Field(None, description="Medication data if successful")
    message: Optional[str] = Field(None, description="Error message if failed")
    suggestion: Optional[str] = Field(None, description="Suggestion if medication not found")

    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "status": "success",
                    "data": {
                        "brand_name": "Lipitor",
                        "generic_name": "Atorvastatin",
                        "purpose": ["Lowers cholesterol"]
                    }
                },
                {
                    "status": "error",
                    "message": "No data found for medication: XYZ",
                    "suggestion": "Please check spelling or try the generic name"
                }
            ]
        }


class InteractionSeverity(str, Enum):
    MODERATE = "moderate"
    SERIOUS = "serious"


class InteractionCheckRequest(BaseModel):
    drug1: str = Field(
        min_length=1,
        max_length=100,
        description="First medication name"
    )
    drug2: str = Field(
        min_length=1,
        max_length=100,
        description="Second medication name"
    )

    @field_validator('drug1', 'drug2')
    @classmethod
    def sanitize_drugs(cls, v: str) -> str:
        return v.strip()

    class Config:
        json_schema_extra = {
            "example": {
                "drug1": "aspirin",
                "drug2": "ibuprofen"
            }
        }


class InteractionData(BaseModel):
    drug1: str = Field(description="First medication")
    drug2: str = Field(description="Second medication")
    interaction_found: bool = Field(description="Whether an interaction was found")
    severity: Optional[InteractionSeverity] = Field(None, description="Severity level if interaction found")
    description: Optional[str] = Field(None, description="Description of the interaction")
    recommendation: Optional[str] = Field(None, description="What to do about it")
    message: Optional[str] = Field(None, description="Message if no interaction found")
    disclaimer: Optional[str] = Field(None, description="Disclaimer about database limitations")

    class Config:
        json_schema_extra = {
            "example": {
                "drug1": "aspirin",
                "drug2": "ibuprofen",
                "interaction_found": True,
                "severity": "moderate",
                "description": "Increased risk of stomach bleeding",
                "recommendation": "Avoid taking together. Space doses 8+ hours apart."
            }
        }


class InteractionCheckResponse(BaseModel):
    status: Literal["success", "error"]
    data: Optional[InteractionData] = None
    message: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "status": "success",
                "data": {
                    "drug1": "aspirin",
                    "drug2": "ibuprofen",
                    "interaction_found": True,
                    "severity": "moderate"
                }
            }
        }


class MedicationSuggestion(BaseModel):
    brand_name: str = Field(description="Brand name of medication")
    generic_name: str = Field(description="Generic name")

    class Config:
        json_schema_extra = {
            "example": {
                "brand_name": "Lipitor",
                "generic_name": "Atorvastatin"
            }
        }


class ValidationData(BaseModel):
    valid: bool = Field(description="Whether medication name is valid")
    drug_name: str = Field(description="The drug name that was validated")
    message: Optional[str] = Field(None, description="Message if invalid")
    suggestions: List[MedicationSuggestion] = Field(
        default_factory=list,
        description="Suggested corrections if available"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "valid": False,
                "drug_name": "Liptor",
                "message": "Medication not found in FDA database",
                "suggestions": [
                    {"brand_name": "Lipitor", "generic_name": "Atorvastatin"}
                ]
            }
        }


class ValidationResponse(BaseModel):
    status: Literal["success", "error"]
    data: Optional[ValidationData] = None
    message: Optional[str] = None


class MultipleInteractionsRequest(BaseModel):
    medications: List[str] = Field(
        min_length=2,
        max_length=5,
        description="List of medication names (2-5 drugs)"
    )

    @field_validator('medications')
    @classmethod
    def sanitize_medications(cls, v: List[str]) -> List[str]:
        return [med.strip() for med in v if med.strip()]

    class Config:
        json_schema_extra = {
            "example": {
                "medications": ["aspirin", "ibuprofen", "lisinopril"]
            }
        }


class InteractionPair(BaseModel):
    drug1: str
    drug2: str
    severity: InteractionSeverity
    description: str
    recommendation: str

    class Config:
        json_schema_extra = {
            "example": {
                "drug1": "aspirin",
                "drug2": "ibuprofen",
                "severity": "moderate",
                "description": "Increased bleeding risk",
                "recommendation": "Avoid taking together"
            }
        }


class MultipleInteractionsData(BaseModel):
    medications: List[str] = Field(description="List of medications checked")
    total_interactions: int = Field(ge=0, description="Number of interactions found")
    interactions: List[InteractionPair] = Field(description="List of interaction pairs")
    message: str = Field(description="Summary message")

    class Config:
        json_schema_extra = {
            "example": {
                "medications": ["aspirin", "ibuprofen", "lisinopril"],
                "total_interactions": 2,
                "interactions": [
                    {
                        "drug1": "aspirin",
                        "drug2": "ibuprofen",
                        "severity": "moderate",
                        "description": "Increased bleeding risk",
                        "recommendation": "Avoid together"
                    }
                ],
                "message": "Checked 3 medications across 3 possible pairs"
            }
        }


class MultipleInteractionsResponse(BaseModel):
    status: Literal["success", "error"]
    data: Optional[MultipleInteractionsData] = None
    message: Optional[str] = None


class ErrorResponse(BaseModel):
    status: Literal["error"] = "error"
    error_code: str = Field(description="Machine-readable error code")
    error_message: str = Field(description="Human-readable error message")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")
    timestamp: datetime = Field(default_factory=datetime.now)

    class Config:
        json_schema_extra = {
            "example": {
                "status": "error",
                "error_code": "MEDICATION_NOT_FOUND",
                "error_message": "No medication found with that name",
                "details": {"provided": "Liptor", "suggestion": "Did you mean Lipitor?"},
                "timestamp": "2025-11-07T10:30:00Z"
            }
        }


if __name__ == "__main__":
    print("=" * 60)
    print("MEDSPLAIN PYDANTIC MODELS - USAGE EXAMPLES")
    print("=" * 60)

    print("\n1. Medication Info Request:")
    request = MedicationInfoRequest(medication="Lipitor")
    print(request.model_dump_json(indent=2))

    print("\n2. Medication Info Response:")
    response_data = {
        "status": "success",
        "data": {
            "brand_name": "Lipitor",
            "generic_name": "Atorvastatin",
            "purpose": ["Lowers cholesterol"],
            "indications_and_usage": ["Used for high cholesterol"],
            "warnings": ["May cause muscle pain"],
            "warnings_and_cautions": ["Contact doctor if severe muscle pain"],
            "dosage_and_administration": ["Take once daily"],
            "adverse_reactions": ["Headache (3%), muscle pain (5%)"],
            "drug_interactions": ["Grapefruit juice"],
            "how_supplied": ["10mg, 20mg, 40mg tablets"]
        }
    }
    med_response = MedicationInfoResponse(**response_data)
    print(f"✅ Medication: {med_response.data.brand_name}")
    print(f"   Generic: {med_response.data.generic_name}")

    print("\n3. Interaction Check Request:")
    interaction_req = InteractionCheckRequest(drug1="aspirin", drug2="ibuprofen")
    print(interaction_req.model_dump_json(indent=2))

    print("\n4. Interaction Check Response:")
    interaction_data = {
        "status": "success",
        "data": {
            "drug1": "aspirin",
            "drug2": "ibuprofen",
            "interaction_found": True,
            "severity": "moderate",
            "description": "Increased risk of stomach bleeding",
            "recommendation": "Avoid taking together"
        }
    }
    interaction_response = InteractionCheckResponse(**interaction_data)
    if interaction_response.data.interaction_found:
        print(f"⚠️  Interaction found: {interaction_response.data.severity}")
        print(f"   {interaction_response.data.description}")

    print("\n5. Multiple Interactions Request:")
    multi_req = MultipleInteractionsRequest(
        medications=["aspirin", "ibuprofen", "lisinopril"]
    )
    print(f"Checking {len(multi_req.medications)} medications")

    print("\n6. Validation Error Example:")
    try:
        bad_request = MedicationInfoRequest(medication="")
    except Exception as e:
        print(f"❌ Validation failed (as expected): {str(e)[:80]}...")

    print("\n7. JSON Schema for OpenAI Function Calling:")
    schema = InteractionCheckRequest.model_json_schema()
    print(f"Schema has {len(schema['properties'])} properties")
    print(f"Required fields: {schema.get('required', [])}")

    print("\n" + "=" * 60)
    print("✅ All examples completed successfully!")
    print("=" * 60)