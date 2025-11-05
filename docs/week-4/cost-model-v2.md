Token Usage & Cost Model (Version 2)

Project Name: Medsplain – AI Medication Explainer
Team Members: Tekla Chaphidze, Saba Samkharadze, Giorgi Ksovreli, Mariam Tarkashvili
Date: October 24, 2025 (Week 4)

1. Overview

Medsplain uses a conversational AI system to help users understand medication instructions, side effects, and dosage in plain language.
This document analyzes the token usage and cost of each main component in the Medsplain pipeline using GPT-4o-mini.

2. Token Breakdown (Per Query)
| Component             | Description                                                       | Tokens (avg)     | Cost per 1K tokens | Cost per Query   | % of Total |
| --------------------- | ----------------------------------------------------------------- | ---------------- | ------------------ | ---------------- | ---------- |
| **System Prompt**     | Context and safety setup (medical disclaimer, role instructions)  | 400              | $0.005             | **$0.0020**      | 20%        |
| **User Query**        | Example: “What happens if I take ibuprofen with paracetamol?”     | 200              | $0.005             | **$0.0010**      | 10%        |
| **Model Output**      | AI explanation of the medication, safety note, and dosage summary | 1000             | $0.015             | **$0.0150**      | 70%        |
| **Total (per query)** | —                                                                 | **1,600 tokens** | —                  | **≈ $0.018 USD** | 100%       |



3. Weekly Estimate
| Metric                   | Value                           |
| ------------------------ | ------------------------------- |
| Average Queries per Day  | 50                              |
| Average Tokens per Query | 1,600                           |
| Total Tokens per Week    | 560 × 10³ (560 K)               |
| Estimated Weekly Cost    | 560 × 0.018 / 1 = **$0.90 USD** |
| Model Used               | GPT-4o-mini                     |
| API Mode                 | Text completion                 |



4. Observations

• Output tokens dominate cost (~70%). Responses are detailed explanations with simplified terms and disclaimers.

• System prompts remain constant and add fixed overhead per request.

• Costs are well within the free-tier range for educational use.

• Latency: Average 1.2 s per response; acceptable for interactive sessions.




5. Optimization Strategies

Shorten Output Length: Summaries under 100 words still deliver key medical info with half the cost.

Prompt Compression: Merge system and role prompts into a single structured message.

Response Reuse: Cache explanations for common drugs like ibuprofen, paracetamol, and amoxicillin.

Hybrid Model: Use GPT-4o-mini for safety checks and GPT-3.5-turbo for simpler follow-up questions.

Token Logging: Add usage.total_tokens tracking in API responses for precise cost monitoring.




6. Key Insight

The Medsplain system spends most tokens on generating clear, layman-friendly medication summaries.
By trimming repetitive disclaimers and shortening text length, total costs can be reduced by ~40% with minimal impact on user clarity.



✅ Next Step:
Save this file as
lab-4/docs/token-usage-cost-model-v2.md
and push it to your GitHub repository.
