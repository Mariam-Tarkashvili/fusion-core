import uuid
import os
from typing import List, Dict
from datetime import datetime
from .rag_service import RAGService

# Initialize RAG service
rag = RAGService()


def _normalize_name(name: str) -> str:
    return name.strip().lower()


def get_medication_info(medication_name: str, include_interactions: bool = False,
                        include_side_effects: bool = True) -> Dict:
    """
    Retrieve medication information using RAG from OpenFDA.
    """
    med_info = rag.extract_medication_info(medication_name)

    if not med_info.get("found"):
        return {
            "status": "error",
            "message": med_info.get("message", f"Medication '{medication_name}' not found.")
        }

    # Format interactions if requested
    interactions = None
    if include_interactions and med_info.get("interactions"):
        interactions = []
        for it in med_info["interactions"]:
            interactions.append({
                "description": it.get("description", ""),
                "source": it.get("source", "FDA")
            })

    data = {
        "generic_name": med_info.get("generic_name"),
        "brand_names": med_info.get("brand_names", []),
        "drug_class": med_info.get("drug_class"),
        "uses": med_info.get("uses", []),
        "common_dosage": med_info.get("dosage"),
        "side_effects": med_info.get("side_effects", []) if include_side_effects else None,
        "warnings": med_info.get("warnings", []),
        "sources": med_info.get("sources", [])
    }

    if interactions is not None:
        data["interactions"] = interactions

    return {"status": "success", "data": data}


def check_multiple_interactions(medications: List[str]) -> Dict:
    """
    Check drug-drug interactions using OpenFDA labels (non-deprecated).
    Returns clear messages if no info is found.
    """
    # Normalize & remove duplicates
    meds = list(dict.fromkeys([m.strip() for m in medications if m.strip()]))

    if len(meds) < 2:
        return {"status": "error", "message": "At least 2 medications are required."}

    if len(meds) > 5:
        meds = meds[:5]

    # Call RAG service (OpenFDA)
    result = rag.check_interactions(meds)

    return {
        "status": "success",
        "data": {
            "medications": meds,
            "pairs_evaluated": len(meds) * (len(meds) - 1) // 2,
            "total_interactions": result.get("total_interactions", 0),
            "interactions": result.get("interactions", []),
            "message": (
                f"Checked {len(meds)} medications across {len(meds)*(len(meds)-1)//2} pairs using OpenFDA."
                if result.get("total_interactions", 0) > 0
                else "No drug-drug interaction information found for the provided medications in OpenFDA labels."
            ),
            "sources": result.get("sources", [])
        }
    }


def generate_explanation(medication_name: str) -> Dict:
    """
    Generate a plain-language explanation using OpenFDA + Gemini.
    Includes readability score and source citations.
    """
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        return {
            "status": "error",
            "message": "GEMINI_API_KEY not configured"
        }

    result = rag.generate_plain_language_explanation(medication_name, gemini_api_key)

    if not result.get("success"):
        return {
            "status": "error",
            "message": result.get("message", "Failed to generate explanation")
        }

    return {
        "status": "success",
        "data": {
            "medication_name": medication_name,
            "explanation": result["explanation"],
            "reading_level": result["reading_level"],
            "reading_level_description": result["reading_level_description"],
            "sources": result["sources"],
            "retrieved_data": result["medication_info"]
        }
    }


# In-memory "log store" for minimal implementation
_LOG_STORE = {}
_FEEDBACK_STORE = {}


def log_interaction_query(medications: List[str], interactions_found: int,
                          severity_level: str = "none", timestamp=None) -> dict:
    """Log an interaction query for the current session (in-memory)."""
    log_id = f"log_{uuid.uuid4().hex[:12]}"
    entry = {
        "log_id": log_id,
        "medications": medications,
        "interactions_found": interactions_found,
        "severity_level": severity_level,
        "timestamp": timestamp or datetime.utcnow().isoformat() + "Z"
    }
    _LOG_STORE[log_id] = entry
    return {"status": "success", "log_id": log_id, "message": "Query logged successfully."}


def submit_feedback(explanation_id: str, user_id: str, feedback_type: str, comment: str = None) -> Dict:
    """
    Submit user feedback on an explanation.
    feedback_type: "helpful" or "unclear"
    """
    feedback_id = f"fb_{uuid.uuid4().hex[:12]}"
    entry = {
        "feedback_id": feedback_id,
        "explanation_id": explanation_id,
        "user_id": user_id,
        "feedback_type": feedback_type,
        "comment": comment,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    _FEEDBACK_STORE[feedback_id] = entry
    return {
        "status": "success",
        "feedback_id": feedback_id,
        "message": "Feedback submitted successfully."
    }
