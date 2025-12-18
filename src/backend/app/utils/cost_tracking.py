# backend/app/utils/cost_tracking.py

import json
import time
from datetime import datetime

# Gemini Flash estimated pricing (adjust if needed)
COST_PER_1K_INPUT_TOKENS = 0.00035
COST_PER_1K_OUTPUT_TOKENS = 0.00070

LOG_FILE = "cost_logs.jsonl"


def estimate_cost(tokens_input: int, tokens_output: int) -> float:
    input_cost = (tokens_input / 1000) * COST_PER_1K_INPUT_TOKENS
    output_cost = (tokens_output / 1000) * COST_PER_1K_OUTPUT_TOKENS
    return round(input_cost + output_cost, 6)


def log_llm_usage(
    *,
    endpoint: str,
    model: str,
    tokens_input: int,
    tokens_output: int,
    latency_ms: int,
    cache_hit: bool
):
    record = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "endpoint": endpoint,
        "model": model,
        "tokens_input": tokens_input,
        "tokens_output": tokens_output,
        "cost_usd": estimate_cost(tokens_input, tokens_output),
        "latency_ms": latency_ms,
        "cache_hit": cache_hit
    }

    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(record) + "\n")


class Timer:
    def __enter__(self):
        self.start = time.time()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.elapsed_ms = int((time.time() - self.start) * 1000)
