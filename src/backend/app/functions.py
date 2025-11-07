# src/backend/app/functions.py

import requests
from typing import Dict, Any, List, Optional


def get_medication_info(drug_name: str) -> Dict[str, Any]:
    """
    Retrieve comprehensive medication information from FDA API.

    Args:
        drug_name: Name of the medication (brand or generic)

    Returns:
        Dict with status, data/message, and optional error info
    """
    # Input validation
    if not drug_name or len(drug_name.strip()) == 0:
        return {"status": "error", "message": "Drug name cannot be empty"}

    if len(drug_name) > 100:
        return {"status": "error", "message": "Drug name too long (max 100 characters)"}

    # Sanitize input
    drug_name = drug_name.strip()

    base_url = "https://api.fda.gov/drug/label.json"
    params = {"search": f"openfda.brand_name:{drug_name}", "limit": 1}

    try:
        response = requests.get(base_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        if "results" not in data or len(data["results"]) == 0:
            return {
                "status": "error",
                "message": f"No data found for medication: {drug_name}",
                "suggestion": "Please check spelling or try the generic name"
            }

        result = data["results"][0]

        # Extract brand and generic names
        brand_name = result.get("openfda", {}).get("brand_name", [drug_name])[0]
        generic_name = result.get("openfda", {}).get("generic_name", ["Not available"])[0]

        return {
            "status": "success",
            "data": {
                "brand_name": brand_name,
                "generic_name": generic_name,
                "purpose": result.get("purpose", ["Not available"]),
                "indications_and_usage": result.get("indications_and_usage", ["Not available"]),
                "warnings": result.get("warnings", ["Not available"]),
                "warnings_and_cautions": result.get("warnings_and_cautions", ["Not available"]),
                "dosage_and_administration": result.get("dosage_and_administration", ["Not available"]),
                "adverse_reactions": result.get("adverse_reactions", ["Not available"]),
                "drug_interactions": result.get("drug_interactions", ["Not available"]),
                "how_supplied": result.get("how_supplied", ["Not available"]),
            },
        }

    except requests.Timeout:
        return {"status": "error", "message": "Request timed out. Please try again."}
    except requests.RequestException as e:
        return {"status": "error", "message": f"Request error: {str(e)}"}
    except Exception as e:
        return {"status": "error", "message": f"Unexpected error: {str(e)}"}


def check_drug_interactions(drug1: str, drug2: str) -> Dict[str, Any]:
    """
    Check for known interactions between two medications.

    Args:
        drug1: First medication name
        drug2: Second medication name

    Returns:
        Dict with interaction information or no interaction message
    """
    # Input validation
    if not drug1 or not drug2:
        return {"status": "error", "message": "Both drug names are required"}

    if len(drug1) > 100 or len(drug2) > 100:
        return {"status": "error", "message": "Drug name too long (max 100 characters)"}

    # Sanitize inputs
    drug1 = drug1.strip()
    drug2 = drug2.strip()

    # Known interactions database (expandable)
    known_interactions = {
        ("aspirin", "ibuprofen"): {
            "severity": "moderate",
            "description": "Increased risk of stomach bleeding and reduced effectiveness of aspirin for heart protection.",
            "recommendation": "Avoid taking together. Space doses at least 8 hours apart if both needed."
        },
        ("lisinopril", "ibuprofen"): {
            "severity": "moderate",
            "description": "NSAIDs like ibuprofen may reduce the effectiveness of blood pressure medications.",
            "recommendation": "Use acetaminophen instead for pain relief. Consult your doctor if you need NSAIDs regularly."
        },
        ("atorvastatin", "grapefruit"): {
            "severity": "serious",
            "description": "Grapefruit juice increases statin levels in your blood, raising risk of side effects like muscle damage.",
            "recommendation": "Avoid grapefruit and grapefruit juice while taking this medication."
        },
        ("warfarin", "aspirin"): {
            "severity": "serious",
            "description": "Both medications thin your blood. Taking together significantly increases bleeding risk.",
            "recommendation": "Only take together if specifically prescribed by your doctor. Requires close monitoring."
        },
        ("metformin", "alcohol"): {
            "severity": "moderate",
            "description": "Alcohol can increase risk of lactic acidosis, a serious side effect of metformin.",
            "recommendation": "Limit alcohol consumption. Avoid excessive drinking."
        },
    }

    # Check both orders (drug1+drug2 and drug2+drug1)
    interaction = known_interactions.get(
        (drug1.lower(), drug2.lower()),
        known_interactions.get((drug2.lower(), drug1.lower()))
    )

    if interaction:
        return {
            "status": "success",
            "data": {
                "drug1": drug1,
                "drug2": drug2,
                "interaction_found": True,
                "severity": interaction["severity"],
                "description": interaction["description"],
                "recommendation": interaction["recommendation"],
            },
        }
    else:
        return {
            "status": "success",
            "data": {
                "drug1": drug1,
                "drug2": drug2,
                "interaction_found": False,
                "message": "No known interactions found in our database.",
                "disclaimer": "This does not guarantee no interaction exists. Always inform your doctor and pharmacist of all medications you take."
            },
        }


def validate_medication_name(drug_name: str) -> Dict[str, Any]:
    """
    Validate if a medication name exists in FDA database and suggest corrections.

    Args:
        drug_name: Medication name to validate

    Returns:
        Dict with validation status and suggestions if needed
    """
    if not drug_name or len(drug_name.strip()) == 0:
        return {"status": "error", "message": "Drug name cannot be empty"}

    drug_name = drug_name.strip()

    base_url = "https://api.fda.gov/drug/label.json"
    params = {"search": f"openfda.brand_name:{drug_name}", "limit": 5}

    try:
        response = requests.get(base_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        if "results" in data and len(data["results"]) > 0:
            # Found exact or close matches
            suggestions = []
            for result in data["results"][:3]:  # Top 3 matches
                brand_names = result.get("openfda", {}).get("brand_name", [])
                generic_names = result.get("openfda", {}).get("generic_name", [])

                if brand_names:
                    suggestions.append({
                        "brand_name": brand_names[0],
                        "generic_name": generic_names[0] if generic_names else "N/A"
                    })

            return {
                "status": "success",
                "data": {
                    "valid": True,
                    "drug_name": drug_name,
                    "suggestions": suggestions
                }
            }
        else:
            return {
                "status": "success",
                "data": {
                    "valid": False,
                    "drug_name": drug_name,
                    "message": "Medication not found in FDA database",
                    "suggestions": []
                }
            }

    except requests.RequestException as e:
        return {"status": "error", "message": f"Validation error: {str(e)}"}


def check_multiple_interactions(medications: List[str]) -> Dict[str, Any]:
    """
    Check interactions across multiple medications (2-5 drugs).

    Args:
        medications: List of medication names

    Returns:
        Dict with all interaction pairs found
    """
    if not medications or len(medications) < 2:
        return {"status": "error", "message": "At least 2 medications required"}

    if len(medications) > 5:
        return {"status": "error", "message": "Maximum 5 medications allowed"}

    # Clean inputs
    medications = [med.strip() for med in medications if med.strip()]

    interactions_found = []

    # Check all pairs
    for i in range(len(medications)):
        for j in range(i + 1, len(medications)):
            result = check_drug_interactions(medications[i], medications[j])

            if result["status"] == "success" and result["data"].get("interaction_found"):
                interactions_found.append({
                    "drug1": medications[i],
                    "drug2": medications[j],
                    "severity": result["data"]["severity"],
                    "description": result["data"]["description"],
                    "recommendation": result["data"]["recommendation"]
                })

    return {
        "status": "success",
        "data": {
            "medications": medications,
            "total_interactions": len(interactions_found),
            "interactions": interactions_found,
            "message": f"Checked {len(medications)} medications across {len(medications) * (len(medications) - 1) // 2} possible pairs"
        }
    }