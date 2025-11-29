import os
import requests
from typing import List, Dict, Optional
import time
from functools import lru_cache
import textstat

class RAGService:
    def __init__(self):
        self.openfda_base = "https://api.fda.gov/drug"
        self.cache_ttl = 3600  # 1 hour cache

    @lru_cache(maxsize=100)
    def _search_openfda_drug_label(self, medication_name: str) -> Optional[Dict]:
        url = f"{self.openfda_base}/label.json"
        params = {
            "search": f'openfda.brand_name:"{medication_name}" OR openfda.generic_name:"{medication_name}"',
            "limit": 1
        }
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            if data.get("results"):
                return data["results"][0]
            return None
        except requests.exceptions.RequestException as e:
            print(f"OpenFDA API error: {e}")
            return None

    def extract_medication_info(self, medication_name: str) -> Dict:
        """
        Extract comprehensive medication information from OpenFDA.
        """
        fda_data = self._search_openfda_drug_label(medication_name)

        if not fda_data:
            return {"found": False, "message": f"No information found for '{medication_name}'"}

        info = {
            "found": True,
            "generic_name": None,
            "brand_names": [],
            "drug_class": None,
            "uses": [],
            "dosage": None,
            "side_effects": [],
            "warnings": [],
            "interactions": [],
            "sources": []
        }

        openfda = fda_data.get("openfda", {})

        # Generic and brand names
        info["generic_name"] = openfda.get("generic_name", [None])[0]
        info["brand_names"] = openfda.get("brand_name", [])

        # Drug class
        info["drug_class"] = openfda.get("pharm_class_epc", [None])[0]

        # Uses
        if fda_data.get("indications_and_usage"):
            uses_text = fda_data["indications_and_usage"][0]
            info["uses"] = [uses_text[:500]]

        # Dosage
        if fda_data.get("dosage_and_administration"):
            info["dosage"] = fda_data["dosage_and_administration"][0][:500]

        # Side effects
        if fda_data.get("adverse_reactions"):
            info["side_effects"] = [fda_data["adverse_reactions"][0][:500]]

        # Warnings
        if fda_data.get("warnings"):
            info["warnings"] = [fda_data["warnings"][0][:500]]
        elif fda_data.get("boxed_warning"):
            info["warnings"] = [fda_data["boxed_warning"][0][:500]]

        # Drug interactions
        if fda_data.get("drug_interactions"):
            info["interactions"] = [{"description": fda_data["drug_interactions"][0][:500], "source": "FDA"}]

        info["sources"].append({
            "name": "OpenFDA Drug Labels",
            "url": "https://open.fda.gov/apis/drug/label/",
            "type": "FDA"
        })

        return info

    def _check_fda_interactions(self, medications: List[str]) -> List[Dict]:
        """
        Check drug interactions using OpenFDA labels.
        """
        interactions = []

        # Get FDA info for all drugs
        med_info_map = {med: self._search_openfda_drug_label(med) for med in medications}

        for i in range(len(medications)):
            for j in range(i + 1, len(medications)):
                med1, med2 = medications[i], medications[j]
                fda1, fda2 = med_info_map.get(med1), med_info_map.get(med2)

                found = False
                for fda_data, other_med in [(fda1, med2), (fda2, med1)]:
                    if fda_data and fda_data.get("drug_interactions"):
                        text = fda_data["drug_interactions"][0]
                        if other_med.lower() in text.lower():
                            interactions.append({
                                "drug1": med1,
                                "drug2": med2,
                                "severity": "major",
                                "description": text[:500],
                                "recommendation": "Consult with a healthcare provider before combining these medications.",
                                "source": "OpenFDA"
                            })
                            found = True
                            break

                if not found:
                    interactions.append({
                        "drug1": med1,
                        "drug2": med2,
                        "severity": "unknown",
                        "description": f"No drug-drug interaction information found for {med1} + {med2} in OpenFDA labels.",
                        "recommendation": "No specific interaction data available; consult a healthcare provider if concerned.",
                        "source": "OpenFDA"
                    })

        return interactions

    def check_interactions(self, medications: List[str]) -> Dict:
        """
        Check drug-drug interactions using OpenFDA labels (non-deprecated).
        """
        if len(medications) < 2:
            return {"found": False, "message": "At least 2 medications are required."}

        interactions = self._check_fda_interactions(medications)

        return {
            "found": True,
            "medications": medications,
            "pairs_evaluated": len(medications) * (len(medications) - 1) // 2,
            "total_interactions": len([i for i in interactions if i["severity"] != "unknown"]),
            "interactions": interactions,
            "sources": [{
                "name": "OpenFDA Drug Labels",
                "url": "https://open.fda.gov/apis/drug/label/",
                "type": "FDA"
            }]
        }

    def generate_plain_language_explanation(self, medication_name: str, gemini_api_key: str) -> Dict:
        """
        Generate plain-language explanation using FDA data + LLM.
        """
        med_info = self.extract_medication_info(medication_name)

        if not med_info.get("found"):
            return {"success": False, "message": med_info.get("message")}

        context = f"""
Medication: {med_info.get('generic_name') or medication_name}
Brand Names: {', '.join(med_info.get('brand_names', []))}
Drug Class: {med_info.get('drug_class') or 'Not specified'}

Uses: {' '.join(med_info.get('uses', ['Not specified']))}

Common Dosage: {med_info.get('dosage') or 'Consult prescribing information'}

Side Effects: {' '.join(med_info.get('side_effects', ['Not specified']))}

Warnings: {' '.join(med_info.get('warnings', ['Not specified']))}
"""

        prompt = f"""Based on the following FDA-approved medication information, create a clear, plain-language explanation suitable for a general audience (8th-10th grade reading level).

{context}

Write a concise 3-4 paragraph explanation that covers:
1. What this medication is and what it treats
2. How to take it safely
3. Important side effects and warnings

Use simple language, short sentences, and avoid medical jargon where possible."""

        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"
            headers = {"Content-Type": "application/json", "x-goog-api-key": gemini_api_key}
            payload = {
                "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                "generation_config": {"temperature": 0.3}
            }

            response = requests.post(url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            result = response.json()

            explanation = result["candidates"][0]["content"]["parts"][0]["text"]
            reading_level = textstat.flesch_kincaid_grade(explanation)

            return {
                "success": True,
                "explanation": explanation,
                "reading_level": round(reading_level, 1),
                "reading_level_description": self._get_reading_level_description(reading_level),
                "sources": med_info.get("sources", []),
                "medication_info": med_info
            }

        except Exception as e:
            return {"success": False, "message": f"Failed to generate explanation: {str(e)}"}

    def _get_reading_level_description(self, grade_level: float) -> str:
        if grade_level < 6:
            return "Very easy to read (elementary school)"
        elif grade_level < 9:
            return "Easy to read (middle school)"
        elif grade_level < 13:
            return "Fairly easy to read (high school)"
        elif grade_level < 16:
            return "Moderately difficult (college level)"
        else:
            return "Difficult to read (graduate level)"
