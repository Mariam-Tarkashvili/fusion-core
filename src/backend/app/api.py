# backend/app/api.py
import os
import json
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()  # reads .env (if present)

from .models import (
    CheckInteractionsRequest,
    GetMedicationInfoRequest,
    LogInteractionQueryRequest,
    CheckMultipleInteractionsResponse,
    GetMedicationInfoResponse,
    LogInteractionQueryResponse,
    ErrorResponse,
)
from . import functions as funcs

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:8080"], supports_credentials=True)

# Config from env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
# Default URL for REST generateContent (adjust if Google updates endpoint)
GEMINI_API_URL = os.getenv("GEMINI_API_URL",
                           f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent")


# -----------------------
# Helper: return Pydantic models as proper JSON
# -----------------------
def ok_json(obj):
    # obj may be dict or Pydantic model
    if hasattr(obj, "model_dump"):
        return jsonify(obj.model_dump(by_alias=True))
    return jsonify(obj)


# -----------------------
# Endpoint: get medication info
# -----------------------
@app.route("/api/medication-info", methods=["POST"])
def route_get_medication_info():
    try:
        payload = request.get_json(force=True)
        req = GetMedicationInfoRequest(**payload)
    except Exception as e:
        return jsonify(ErrorResponse(message="Invalid request", details={"error": str(e)}).model_dump()), 400

    res = funcs.get_medication_info(req.medication_name, req.include_interactions, req.include_side_effects)
    if res.get("status") == "error":
        return jsonify({"status": "error", "message": res.get("message")}), 404
    return jsonify({"status": "success", "data": res["data"]})

# -----------------------
# Endpoint: check interactions
# -----------------------
@app.route("/api/check-interactions", methods=["POST"])
def route_check_interactions():
    try:
        payload = request.get_json(force=True)
        req = CheckInteractionsRequest(**payload)
    except Exception as e:
        return jsonify(ErrorResponse(message="Invalid request", details={"error": str(e)}).model_dump()), 400

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
        return jsonify(ErrorResponse(message="Invalid request", details={"error": str(e)}).model_dump()), 400

    res = funcs.log_interaction_query(req.user_id, req.medications, req.interactions_found, req.severity_level, req.timestamp)
    return jsonify(res)

# -----------------------
# Endpoint: chat (LLM function-calling)
# Minimal: send prompt to Gemini; if Gemini suggests a function call, execute locally
# -----------------------


@app.route("/api/chat", methods=["POST"])
def route_chat():
    body = request.get_json(force=True)
    prompt = body.get("prompt", "")
    if not prompt:
        return jsonify({"status": "error", "message": "Missing prompt"}), 400

    # ----- 1. Build request for Gemini -----
    tools = [
        {
            "function_declarations": [
                {
                    "name": "check_multiple_interactions",
                    "description": "Check interactions among multiple medications.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "medications": {
                                "type": "array",
                                "items": {"type": "string"}
                            }
                        },
                        "required": ["medications"]
                    }
                },
                {
                    "name": "get_medication_info",
                    "description": "Return information about a medication.",
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
                    "name": "log_interaction_query",
                    "description": "Log a completed medication interaction query.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "string"},
                            "medications": {"type": "array", "items": {"type": "string"}},
                            "interactions_found": {"type": "number"},
                            "severity_level": {"type": "string"}
                        },
                        "required": ["user_id", "medications"]
                    }
                }
            ]
        }
    ]

    request_payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ],
        "tools": tools,
        "generation_config": {
            "temperature": 0.0
        }
    }

    headers = {"Content-Type": "application/json"}
    if GEMINI_API_KEY:
        headers["x-goog-api-key"] = GEMINI_API_KEY

    # ----- 2. Call Gemini -----
    try:
        resp = requests.post(GEMINI_API_URL, headers=headers, json=request_payload, timeout=30)
        resp.raise_for_status()
        model_response = resp.json()
    except Exception as e:
        return jsonify({"status": "error", "message": "Gemini request failed", "details": str(e)}), 500

    # ----- 3. Parse function call -----
    function_call = None
    args = {}

    candidates = model_response.get("candidates", [])
    for cand in candidates:
        content = cand.get("content", [])

        # Normalize content to list
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

    # ----- 4. Execute function -----
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
            elif name == "log_interaction_query":
                result = funcs.log_interaction_query(
                    args.get("user_id"),
                    args.get("medications", []),
                    args.get("interactions_found", 0),
                    args.get("severity_level", "none")
                )
            else:
                return jsonify({"status": "error", "message": f"Unknown function `{name}`"}), 400

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

    # ----- 5. No function call → return text safely -----
    text = "(No text returned)"

    if candidates:
        first = candidates[0]
        content = first.get("content", [])

        # Normalize to list
        if isinstance(content, dict):
            content = [content]

        if isinstance(content, list) and len(content) > 0:
            item = content[0]

            # If string
            if isinstance(item, str):
                text = item

            # If dict with parts
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
        "text": text,
        "raw_model_response": model_response
    })



if __name__ == "__main__":
    app.run(debug=True, port=int(os.getenv("PORT", 5000)))
