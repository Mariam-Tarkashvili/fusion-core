# backend/app/api.py
import os
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from .models import (
    CheckInteractionsRequest,
    GetMedicationInfoRequest,
    LogInteractionQueryRequest,
    ErrorResponse,
)
from . import functions as funcs

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Config from env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-exp")
GEMINI_API_URL = os.getenv("GEMINI_API_URL",
                           f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent")


# -----------------------
# Helper: return Pydantic models as proper JSON
# -----------------------
def ok_json(obj):
    if hasattr(obj, "model_dump"):
        return jsonify(obj.model_dump(by_alias=True))
    return jsonify(obj)


# -----------------------
# NEW ENDPOINT: Generate plain-language explanation
# -----------------------
@app.route("/api/explain", methods=["POST"])
def route_explain_medication():
    """
    Generate a plain-language explanation for a medication.
    Includes readability score and source citations.
    """
    try:
        payload = request.get_json(force=True)
        medication_name = payload.get("medication_name", "").strip()

        if not medication_name:
            return jsonify(ErrorResponse(
                message="medication_name is required",
                code="bad_request"
            ).model_dump()), 400

    except Exception as e:
        return jsonify(ErrorResponse(
            message="Invalid request",
            code="bad_request",
            details={"error": str(e)}
        ).model_dump()), 400

    result = funcs.generate_explanation(medication_name)

    if result.get("status") == "error":
        return jsonify(result), 404

    return jsonify(result)


# -----------------------
# NEW ENDPOINT: Submit feedback
# -----------------------
@app.route("/api/feedback", methods=["POST"])
def route_submit_feedback():
    """
    Submit user feedback on an explanation.
    Expects: explanation_id, feedback_type ("helpful" or "unclear"), optional comment
    """
    try:
        payload = request.get_json(force=True)
        explanation_id = payload.get("explanation_id", "").strip()

        feedback_type = payload.get("feedback_type", "").strip().lower()
        comment = payload.get("comment", "")

        if not explanation_id:
            return jsonify(ErrorResponse(
                message="explanation_id is required",
                code="bad_request"
            ).model_dump()), 400

        if feedback_type not in ["helpful", "unclear"]:
            return jsonify(ErrorResponse(
                message="feedback_type must be 'helpful' or 'unclear'",
                code="bad_request"
            ).model_dump()), 400

    except Exception as e:
        return jsonify(ErrorResponse(
            message="Invalid request",
            code="bad_request",
            details={"error": str(e)}
        ).model_dump()), 400

    result = funcs.submit_feedback(explanation_id, feedback_type, comment)
    return jsonify(result)


# -----------------------
# Endpoint: get medication info (now using RAG)
# -----------------------
@app.route("/api/medication-info", methods=["POST"])
def route_get_medication_info():
    try:
        payload = request.get_json(force=True)
        req = GetMedicationInfoRequest(**payload)
    except Exception as e:
        return jsonify(ErrorResponse(
            message="Invalid request",
            code="bad_request",
            details={"error": str(e)}
        ).model_dump()), 400

    res = funcs.get_medication_info(
        req.medication_name,
        req.include_interactions,
        req.include_side_effects
    )

    if res.get("status") == "error":
        return jsonify(res), 404

    return jsonify(res)


# -----------------------
# Endpoint: check interactions (now using RAG)
# -----------------------
@app.route("/api/check-interactions", methods=["POST"])
def route_check_interactions():
    try:
        payload = request.get_json(force=True)
        req = CheckInteractionsRequest(**payload)
    except Exception as e:
        return jsonify(ErrorResponse(
            message="Invalid request",
            code="bad_request",
            details={"error": str(e)}
        ).model_dump()), 400

    res = funcs.check_multiple_interactions(req.medications)

    if res.get("status") == "error":
        return jsonify(res), 400

    return jsonify(res)


# -----------------------
# Endpoint: log interaction query
# -----------------------
@app.route("/api/log-query", methods=["POST"])
def route_log_query():
    try:
        payload = request.get_json(force=True)
        req = LogInteractionQueryRequest(**payload)
    except Exception as e:
        return jsonify(ErrorResponse(
            message="Invalid request",
            code="bad_request",
            details={"error": str(e)}
        ).model_dump()), 400

    res = funcs.log_interaction_query(
        medications=req.medications,
        interactions_found=req.interactions_found,
        severity_level=req.severity_level,
        timestamp=req.timestamp
    )

    return jsonify(res)


# -----------------------
# Endpoint: chat (LLM function-calling)
# -----------------------
@app.route("/api/chat", methods=["POST"])
def route_chat():
    body = request.get_json(force=True)
    prompt = body.get("prompt", "")

    if not prompt:
        return jsonify({"status": "error", "message": "Missing prompt"}), 400

    # Build request for Gemini with function declarations
    tools = [
        {
            "function_declarations": [
                {
                    "name": "check_multiple_interactions",
                    "description": "Check drug-drug interactions among multiple medications using FDA and RxNorm data.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "medications": {
                                "type": "array",
                                "items": {"type": "string"},
                                "description": "List of medication names to check"
                            }
                        },
                        "required": ["medications"]
                    }
                },
                {
                    "name": "get_medication_info",
                    "description": "Get detailed information about a specific medication from FDA databases.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "medication_name": {"type": "string"},
                            "include_interactions": {"type": "boolean"},
                            "include_side_effects": {"type": "boolean"}
                        },
                        "required": ["medication_name"]
                    }
                },
                {
                    "name": "generate_explanation",
                    "description": "Generate a plain-language explanation of a medication with readability score.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "medication_name": {"type": "string"}
                        },
                        "required": ["medication_name"]
                    }
                }
            ]
        }
    ]

    request_payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "tools": tools,
        "generation_config": {"temperature": 0.0}
    }

    headers = {"Content-Type": "application/json"}
    if GEMINI_API_KEY:
        headers["x-goog-api-key"] = GEMINI_API_KEY

    # Call Gemini
    try:
        resp = requests.post(GEMINI_API_URL, headers=headers, json=request_payload, timeout=30)
        resp.raise_for_status()
        model_response = resp.json()
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Gemini request failed",
            "details": str(e)
        }), 500

    # Parse function call
    function_call = None
    args = {}

    candidates = model_response.get("candidates", [])
    for cand in candidates:
        content = cand.get("content", [])

        if isinstance(content, dict):
            content = [content]
        if not isinstance(content, list):
            continue

        for msg in content:
            if isinstance(msg, str):
                continue

            if isinstance(msg, dict):
                parts = msg.get("parts", [])
                if isinstance(parts, dict):
                    parts = [parts]
                if not isinstance(parts, list):
                    continue

                for part in parts:
                    if isinstance(part, dict) and "functionCall" in part:
                        function_call = part["functionCall"]
                        args = function_call.get("args", {})
                        break

        if function_call:
            break

    # Execute function
    if function_call:
        name = function_call.get("name")

        try:
            if name == "check_multiple_interactions":
                result = funcs.check_multiple_interactions(args.get("medications", []))
            elif name == "get_medication_info":
                result = funcs.get_medication_info(
                    args.get("medication_name"),
                    args.get("include_interactions", False),
                    args.get("include_side_effects", True)
                )
            elif name == "generate_explanation":
                result = funcs.generate_explanation(args.get("medication_name"))
            else:
                return jsonify({
                    "status": "error",
                    "message": f"Unknown function `{name}`"
                }), 400

            return jsonify({
                "status": "success",
                "via": "gemini:function_call",
                "function": name,
                "result": result
            })

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": f"Function `{name}` failed",
                "details": str(e)
            }), 500

    # No function call - return text
    text = "(No text returned)"

    if candidates:
        first = candidates[0]
        content = first.get("content", [])

        if isinstance(content, dict):
            content = [content]

        if isinstance(content, list) and len(content) > 0:
            item = content[0]

            if isinstance(item, str):
                text = item
            elif isinstance(item, dict):
                parts = item.get("parts", [])
                if isinstance(parts, dict):
                    parts = [parts]
                if isinstance(parts, list):
                    for p in parts:
                        if isinstance(p, dict) and "text" in p:
                            text = p["text"]
                            break

    return jsonify({
        "status": "success",
        "via": "gemini:text",
        "text": text
    })


if __name__ == "__main__":
    app.run(debug=True, port=int(os.getenv("PORT", 5000)))
