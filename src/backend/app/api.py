# backend/app/api.py
import os
import json
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
from .utils.cost_tracking import log_llm_usage, Timer
from datetime import datetime, timedelta
from . import functions as funcs
import logging

_MED_INFO_CACHE = funcs._MED_INFO_CACHE
_INTERACTION_CACHE = funcs._INTERACTION_CACHE
_MED_INFO_CACHE_TIMES = funcs._MED_INFO_CACHE_TIMES
_INTERACTION_CACHE_TIMES = funcs._INTERACTION_CACHE_TIMES

# TTL for in-memory caches (seconds)
CACHE_TTL_SECONDS = 3600  # 1 hour

load_dotenv()

from .models import (
    CheckInteractionsRequest,
    GetMedicationInfoRequest,
    LogInteractionQueryRequest,
    ErrorResponse,
)
from . import functions as funcs

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Initialize rate limiter
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
    strategy="fixed-window"
)

# Config from env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-exp")
GEMINI_API_URL = os.getenv("GEMINI_API_URL",
                           f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent")

# Fallback responses
FALLBACK_RESPONSES = {
    "explain": {
        "status": "success",
        "data": {
            "explanation": "We're currently experiencing technical difficulties with our AI service. Please try again in a few moments, or consult your healthcare provider for medication information.",
            "reading_level": 8.0,
            "reading_level_description": "Easy to read (middle school)",
            "sources": [],
            "is_fallback": True
        }
    },
    "chat": {
        "status": "success",
        "via": "fallback",
        "text": "I apologize, but I'm currently unable to process your request due to technical issues. Please try again shortly or contact support if the problem persists."
    }
}


# -----------------------
# Helper: return Pydantic models as proper JSON
# -----------------------
def ok_json(obj):
    if hasattr(obj, "model_dump"):
        return jsonify(obj.model_dump(by_alias=True))
    return jsonify(obj)


def _expire_cache(cache: dict, times: dict):
    now = datetime.utcnow()
    keys_to_delete = []
    for key, ts in times.items():
        if now - ts > timedelta(seconds=CACHE_TTL_SECONDS):
            keys_to_delete.append(key)
    for key in keys_to_delete:
        cache.pop(key, None)
        times.pop(key, None)


# -----------------------
# Error handler for rate limit exceeded
# -----------------------
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify(ErrorResponse(
        message="Rate limit exceeded. Please try again later.",
        code="unavailable",
        details={"retry_after": e.description}
    ).model_dump()), 429


# -----------------------
# NEW ENDPOINT: Generate plain-language explanation
# -----------------------
@app.route("/api/explain", methods=["POST"])
@limiter.limit("10 per minute")
def route_explain_medication():
    """
    Generate a plain-language explanation for a medication.
    Includes readability score and source citations.
    Rate limit: 10 requests per minute
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
        logger.error(f"Error parsing explain request: {str(e)}")
        return jsonify(ErrorResponse(
            message="Invalid request",
            code="bad_request",
            details={"error": str(e)}
        ).model_dump()), 400

    try:
        result = funcs.generate_explanation(medication_name)

        if result.get("status") == "error":
            # Log the query attempt even on error
            funcs.log_interaction_query(
                medications=[medication_name],
                interactions_found=0,
                severity_level="none"
            )
            return jsonify(result), 404

        # Log successful explanation generation
        funcs.log_interaction_query(
            medications=[medication_name],
            interactions_found=0,
            severity_level="none"
        )

        return jsonify(result)

    except Exception as e:
        logger.error(f"Unexpected error in explain endpoint: {str(e)}")
        # Return fallback response
        return jsonify(FALLBACK_RESPONSES["explain"]), 200


# -----------------------
# NEW ENDPOINT: Submit feedback
# -----------------------
@app.route("/api/feedback", methods=["POST"])
@limiter.limit("20 per minute")
def route_submit_feedback():
    """
    Submit user feedback on an explanation.
    Expects: explanation_id, feedback_type ("helpful" or "unclear"), optional comment
    Rate limit: 20 requests per minute
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
        logger.error(f"Error parsing feedback request: {str(e)}")
        return jsonify(ErrorResponse(
            message="Invalid request",
            code="bad_request",
            details={"error": str(e)}
        ).model_dump()), 400

    try:
        result = funcs.submit_feedback(explanation_id, feedback_type, comment)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error submitting feedback: {str(e)}")
        return jsonify(ErrorResponse(
            message="Failed to submit feedback",
            code="server_error"
        ).model_dump()), 500


# -----------------------
# Endpoint: get medication info (now using RAG)
# -----------------------
@app.route("/api/medication-info", methods=["POST"])
@limiter.limit("30 per minute")
def route_get_medication_info():
    """
    Get medication information from FDA databases.
    Rate limit: 30 requests per minute
    """
    try:
        payload = request.get_json(force=True)
        req = GetMedicationInfoRequest(**payload)
    except Exception as e:
        logger.error(f"Error parsing medication-info request: {str(e)}")
        return jsonify(ErrorResponse(
            message="Invalid request",
            code="bad_request",
            details={"error": str(e)}
        ).model_dump()), 400

    try:
        res = funcs.get_medication_info(
            req.medication_name,
            req.include_interactions,
            req.include_side_effects
        )

        # Log the query
        funcs.log_interaction_query(
            medications=[req.medication_name],
            interactions_found=0,
            severity_level="none"
        )

        if res.get("status") == "error":
            return jsonify(res), 404

        return jsonify(res)

    except Exception as e:
        logger.error(f"Unexpected error in medication-info endpoint: {str(e)}")
        return jsonify(ErrorResponse(
            message="Failed to retrieve medication information",
            code="server_error",
            details={"error": str(e)}
        ).model_dump()), 500


# -----------------------
# Endpoint: check interactions (now using RAG)
# -----------------------
@app.route("/api/check-interactions", methods=["POST"])
@limiter.limit("20 per minute")
def route_check_interactions():
    """
    Check drug-drug interactions for multiple medications.
    Rate limit: 20 requests per minute
    """
    try:
        payload = request.get_json(force=True)
        req = CheckInteractionsRequest(**payload)
    except Exception as e:
        logger.error(f"Error parsing check-interactions request: {str(e)}")
        return jsonify(ErrorResponse(
            message="Invalid request",
            code="bad_request",
            details={"error": str(e)}
        ).model_dump()), 400

    try:
        res = funcs.check_multiple_interactions(req.medications)

        # Log the interaction check
        interactions_found = res.get("data", {}).get("total_interactions", 0)
        severity = "major" if interactions_found > 0 else "none"
        funcs.log_interaction_query(
            medications=req.medications,
            interactions_found=interactions_found,
            severity_level=severity
        )

        if res.get("status") == "error":
            return jsonify(res), 400

        return jsonify(res)

    except Exception as e:
        logger.error(f"Unexpected error in check-interactions endpoint: {str(e)}")
        return jsonify(ErrorResponse(
            message="Failed to check interactions",
            code="server_error",
            details={"error": str(e)}
        ).model_dump()), 500


# -----------------------
# Endpoint: log interaction query
# -----------------------
@app.route("/api/log-query", methods=["POST"])
@limiter.limit("100 per minute")
def route_log_query():
    """
    Log an interaction query for analytics.
    Rate limit: 100 requests per minute
    """
    try:
        payload = request.get_json(force=True)
        req = LogInteractionQueryRequest(**payload)
    except Exception as e:
        logger.error(f"Error parsing log-query request: {str(e)}")
        return jsonify(ErrorResponse(
            message="Invalid request",
            code="bad_request",
            details={"error": str(e)}
        ).model_dump()), 400

    try:
        res = funcs.log_interaction_query(
            medications=req.medications,
            interactions_found=req.interactions_found,
            severity_level=req.severity_level,
            timestamp=req.timestamp
        )
        return jsonify(res)
    except Exception as e:
        logger.error(f"Error logging query: {str(e)}")
        return jsonify(ErrorResponse(
            message="Failed to log query",
            code="server_error"
        ).model_dump()), 500


# -----------------------
# Endpoint: chat (LLM function-calling)
# -----------------------
@app.route("/api/chat", methods=["POST"])
@limiter.limit("15 per minute")
def route_chat():
    """
    Chat endpoint with function calling capabilities.
    Rate limit: 15 requests per minute
    """
    try:
        body = request.get_json(force=True)
        prompt = body.get("prompt", "")

        if not prompt:
            return jsonify({"status": "error", "message": "Missing prompt"}), 400

    except Exception as e:
        logger.error(f"Error parsing chat request: {str(e)}")
        return jsonify({"status": "error", "message": "Invalid request"}), 400

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

    # Call Gemini with retry logic
    max_retries = 2
    retry_delay = 1  # seconds

    for attempt in range(max_retries + 1):
        try:
            with Timer() as t:
                resp = requests.post(GEMINI_API_URL, headers=headers, json=request_payload, timeout=30)

            resp.raise_for_status()
            model_response = resp.json()

            usage = model_response.get("usageMetadata", {})
            tokens_input = usage.get("promptTokenCount", 0)
            tokens_output = usage.get("candidatesTokenCount", 0)

            log_llm_usage(
                endpoint="/api/chat",
                model=GEMINI_MODEL,
                tokens_input=tokens_input,
                tokens_output=tokens_output,
                latency_ms=t.elapsed_ms,
                cache_hit=False
            )

            break  # Success, exit retry loop

        except requests.exceptions.Timeout:
            logger.warning(f"Gemini API timeout (attempt {attempt + 1}/{max_retries + 1})")
            if attempt == max_retries:
                return jsonify(FALLBACK_RESPONSES["chat"]), 200
            import time
            time.sleep(retry_delay)

        except requests.exceptions.HTTPError as e:
            logger.error(f"Gemini API HTTP error: {e}")
            if attempt == max_retries:
                return jsonify(FALLBACK_RESPONSES["chat"]), 200
            import time
            time.sleep(retry_delay)

        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            if attempt == max_retries:
                return jsonify(FALLBACK_RESPONSES["chat"]), 200
            import time
            time.sleep(retry_delay)

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

    # Execute function with error handling
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
                logger.warning(f"Unknown function called: {name}")
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
            logger.error(f"Function execution error for {name}: {str(e)}")
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


@app.route("/api/cache/flush", methods=["POST"])
@limiter.limit("5 per minute")
def route_flush_cache():
    """
    Flush all in-memory caches.
    Rate limit: 5 requests per minute
    """
    try:
        _MED_INFO_CACHE.clear()
        _INTERACTION_CACHE.clear()
        _MED_INFO_CACHE_TIMES.clear()
        _INTERACTION_CACHE_TIMES.clear()
        logger.info("All caches flushed")
        return jsonify({"status": "success", "message": "All caches cleared."})
    except Exception as e:
        logger.error(f"Error flushing cache: {str(e)}")
        return jsonify(ErrorResponse(
            message="Failed to flush cache",
            code="server_error"
        ).model_dump()), 500


@app.route("/api/cache/expire", methods=["POST"])
@limiter.limit("10 per minute")
def route_expire_cache():
    """
    Expire old cache entries based on TTL.
    Rate limit: 10 requests per minute
    """
    try:
        _expire_cache(_MED_INFO_CACHE, _MED_INFO_CACHE_TIMES)
        _expire_cache(_INTERACTION_CACHE, _INTERACTION_CACHE_TIMES)
        logger.info("Expired old cache entries")
        return jsonify({"status": "success", "message": "Expired old cache entries."})
    except Exception as e:
        logger.error(f"Error expiring cache: {str(e)}")
        return jsonify(ErrorResponse(
            message="Failed to expire cache",
            code="server_error"
        ).model_dump()), 500


@app.route("/api/logs", methods=["GET"])
@limiter.limit("30 per minute")
def route_get_logs():
    """
    Retrieve interaction query logs.
    Rate limit: 30 requests per minute
    """
    try:
        logs = list(funcs._LOG_STORE.values())
        return jsonify({
            "status": "success",
            "count": len(logs),
            "logs": logs
        })
    except Exception as e:
        logger.error(f"Error retrieving logs: {str(e)}")
        return jsonify(ErrorResponse(
            message="Failed to retrieve logs",
            code="server_error"
        ).model_dump()), 500


@app.route("/api/health", methods=["GET"])
@limiter.exempt
def route_health():
    """Health check endpoint (no rate limit)"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "services": {
            "openfda": "operational",
            "gemini": "operational" if GEMINI_API_KEY else "not_configured"
        }
    })


if __name__ == "__main__":
    app.run(debug=True, port=int(os.getenv("PORT", 5000)))
