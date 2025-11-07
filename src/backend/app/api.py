# src/backend/app/api.py
# ============================================================
# Medsplain FastAPI Backend
# Team: Fusion Core | Week 5
# ============================================================

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# Import core logic functions
from backend.app.functions import (
    get_medication_info,
    check_drug_interactions,
    validate_medication_name,
    check_multiple_interactions
)

# ------------------------------------------------------------
# Create FastAPI app
# ------------------------------------------------------------
app = FastAPI(title="Medsplain API", version="1.0")

# Allow frontend access from any origin (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# ------------------------------------------------------------
# Request Models
# ------------------------------------------------------------
class MedicationRequest(BaseModel):
    medication: str

class InteractionRequest(BaseModel):
    drug1: str
    drug2: str

class ValidationRequest(BaseModel):
    medication: str

class MultipleInteractionsRequest(BaseModel):
    medications: List[str]

# ------------------------------------------------------------
# Routes
# ------------------------------------------------------------

@app.get("/")
async def root():
    return {"message": "✅ Medsplain API is running!"}

@app.post("/api/medication/info")
async def medication_info(request: MedicationRequest):
    result = get_medication_info(request.medication)
    if not result:
        raise HTTPException(status_code=500, detail="No response from medication info service.")
    return result


@app.post("/api/interaction/check")
async def interaction_check(request: InteractionRequest):
    result = check_drug_interactions(request.drug1, request.drug2)
    if not result:
        raise HTTPException(status_code=500, detail="No response from drug interaction service.")
    return result


@app.post("/api/validation")
async def validate_medication(request: ValidationRequest):
    result = validate_medication_name(request.medication)
    if not result:
        raise HTTPException(status_code=500, detail="No response from validation service.")
    return result


@app.post("/api/multiple/interactions")
async def multiple_interactions(request: MultipleInteractionsRequest):
    result = check_multiple_interactions(request.medications)
    if not result:
        raise HTTPException(status_code=500, detail="No response from multiple interactions service.")
    return result
