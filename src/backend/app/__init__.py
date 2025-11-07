"""FastAPI application entry point for Medsplain"""

from fastapi import FastAPI
from .functions import (
    get_medication_info,
    check_drug_interactions,
    validate_medication_name,
    check_multiple_interactions
)

app = FastAPI(
    title="Medsplain API",
    description="Fusion Core | Week 5 - AI-powered backend for medication info",
    version="1.0"
)

@app.get("/")
def root():
    return {"message": "Medsplain API is running 🚀"}

@app.post("/medication/info")
def api_get_medication_info(medication: str):
    """Get detailed info about a specific medication"""
    return get_medication_info(medication)

@app.post("/medication/validate")
def api_validate_medication_name(name: str):
    """Validate medication name"""
    return validate_medication_name(name)

@app.post("/interactions/check")
def api_check_drug_interactions(drug1: str, drug2: str):
    """Check interaction between two drugs"""
    return check_drug_interactions(drug1, drug2)

@app.post("/interactions/multiple")
def api_check_multiple_interactions(drugs: list[str]):
    """Check interactions among multiple medications"""
    return check_multiple_interactions(drugs)
