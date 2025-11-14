# backend/app/functions.py
import uuid
from typing import List, Dict
from datetime import datetime
from .models import (
    CheckMultipleInteractionsResponseData,
    InteractionItem,
    MedicationInfoData,
    MedicationInteractionShort,
)

# Mock knowledge base (tiny)
_MED_DB = {
    "ibuprofen": {
        "generic": "ibuprofen",
        "brand_names": ["Advil", "Motrin"],
        "drug_class": "NSAID",
        "uses": ["Pain relief", "Fever reduction", "Inflammation reduction"],
        "common_dosage": "200–800 mg every 4–6 hours; max 3200 mg/day (adult).",
        "side_effects": ["Dyspepsia", "Nausea", "Dizziness"],
        "warnings": ["Avoid with other NSAIDs", "Increased bleeding risk"],
        "interactions": [{"with": "warfarin", "severity": "moderate", "note": "Bleeding risk; consider alternatives or monitor."}],
    },
    "warfarin": {
        "generic": "warfarin",
        "brand_names": ["Coumadin"],
        "drug_class": "Anticoagulant",
        "uses": ["Prevention/treatment of thromboembolic events"],
        "common_dosage": "Dose individualized; monitor INR.",
        "side_effects": ["Bleeding", "Bruising"],
        "warnings": ["Many drug interactions", "Requires INR monitoring"],
        "interactions": [{"with": "ibuprofen", "severity": "moderate", "note": "NSAIDs increase bleeding risk."}],
    },
    "aspirin": {
        "generic": "aspirin",
        "brand_names": ["Bayer"],
        "drug_class": "Antiplatelet/NSAID",
        "uses": ["Pain", "Fever", "Antiplatelet in low-dose"],
        "common_dosage": "75–325 mg for antiplatelet uses; pain dosing higher.",
        "side_effects": ["GI upset", "Bleeding"],
        "warnings": ["Avoid with anticoagulants when possible"],
        "interactions": [{"with": "warfarin", "severity": "major", "note": "Significant bleeding risk."}],
    },
}

def _normalize_name(name: str) -> str:
    return name.strip().lower()

def get_medication_info(medication_name: str, include_interactions: bool = False, include_side_effects: bool = True) -> Dict:
    key = _normalize_name(medication_name)
    if key not in _MED_DB:
        return {"status": "error", "message": f"Medication '{medication_name}' not found."}
    rec = _MED_DB[key]
    interactions = None
    if include_interactions:
        interactions = []
        for it in rec.get("interactions", []):
            interactions.append({
                "with": it["with"],
                "severity": it["severity"],
                "note": it["note"]
            })
    data = {
        "generic_name": rec["generic"],
        "brand_names": rec["brand_names"],
        "drug_class": rec["drug_class"],
        "uses": rec["uses"],
        "common_dosage": rec.get("common_dosage"),
        "side_effects": rec["side_effects"] if include_side_effects else None,
        "warnings": rec["warnings"],
    }
    if interactions is not None:
        data["interactions"] = interactions
    return {"status": "success", "data": data}

def check_multiple_interactions(medications: List[str]) -> Dict:
    # Validate length constraints caller-side should enforce; we still handle gracefully
    meds = []
    seen = set()
    for m in medications:
        n = _normalize_name(m)
        if n and n not in seen:
            seen.add(n)
            meds.append(n)
    if len(meds) < 2:
        return {"status": "error", "message": "At least 2 and at most 5 medications are required."}
    if len(meds) > 5:
        meds = meds[:5]

    # evaluate pairs
    interactions = []
    # simple O(n^2) pairwise check using the small mock DB
    for i in range(len(meds)):
        for j in range(i + 1, len(meds)):
            a = meds[i]
            b = meds[j]
            # check if either record lists an interaction with the other
            rec_a = _MED_DB.get(a)
            rec_b = _MED_DB.get(b)
            found = None
            if rec_a:
                for it in rec_a.get("interactions", []):
                    if _normalize_name(it["with"]) == b:
                        found = {
                            "drug1": a,
                            "drug2": b,
                            "severity": it["severity"],
                            "description": it["note"],
                            "recommendation": "Avoid or monitor closely; consult clinician."
                        }
                        break
            if not found and rec_b:
                for it in rec_b.get("interactions", []):
                    if _normalize_name(it["with"]) == a:
                        found = {
                            "drug1": b,
                            "drug2": a,
                            "severity": it["severity"],
                            "description": it["note"],
                            "recommendation": "Avoid or monitor closely; consult clinician."
                        }
                        break
            if found:
                interactions.append(found)

    data = {
        "medications": meds,
        "pairs_evaluated": len(meds) * (len(meds) - 1) // 2,
        "total_interactions": len(interactions),
        "interactions": interactions,
        "message": f"Checked {len(meds)} medications across {len(meds) * (len(meds) - 1) // 2} pairs."
    }
    return {"status": "success", "data": data}

# In-memory "log store" for minimal implementation
_LOG_STORE = {}

def log_interaction_query(user_id: str, medications: List[str], interactions_found: int, severity_level: str = "none", timestamp=None) -> Dict:
    log_id = f"log_{uuid.uuid4().hex[:12]}"
    entry = {
        "log_id": log_id,
        "user_id": user_id,
        "medications": medications,
        "interactions_found": interactions_found,
        "severity_level": severity_level,
        "timestamp": timestamp or datetime.utcnow().isoformat() + "Z"
    }
    _LOG_STORE[log_id] = entry
    return {"status": "success", "log_id": log_id, "message": "Query logged successfully."}
