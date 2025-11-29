# Medsplain Backend API (Flask + Gemini)

A Python Flask backend API for the Medsplain medication intelligence application. Provides drug interaction checking, medication information lookup, and AI-powered explanations via Google Gemini.

---

## Features

- **Drug Interaction Checking** - Check safety of 2-5 medications together
- **Medication Information** - Get detailed info on drugs (class, uses, side effects, warnings)
- **Safety Query Logging** - Audit trail for all interaction checks
- **AI-Powered Chat** - Gemini function calling for natural language queries
- **Pydantic Validation** - Type-safe request/response models

---

## Setup

### 1. Create a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

**Required packages:**
- `flask` - Web framework
- `pydantic` - Data validation
- `python-dotenv` - Environment variable management
- `requests` - HTTP client for Gemini API

### 3. Set Up Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# backend/.env
FLASK_ENV=development
PORT=5000
GEMINI_API_KEY=your-api-key
GEMINI_MODEL=gemini-2.5-flash

```

**Get your Gemini API key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy it to your `.env` file

⚠️ **IMPORTANT:** Never commit `.env` to Git! Verify it's in `.gitignore`.

### 4. Run the Server

```bash
cd src
python -m backend.app.api
```

The server will start on `http://127.0.0.1:5000`

You should see:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

---

## API Endpoints


### 1. Get Medication Information
```http
POST /api/medication-info
```

**Request Body:**
```json
{
  "medication_name": "ibuprofen",
  "include_interactions": true,
  "include_side_effects": true
}
```

**Response:**
```json
{
    "data": {
        "brand_names": [
            "Ibuprofen Dye Free"
        ],
        "common_dosage": "Directions do not take more than directed the smallest effective dose should be used adults and children 12 years and over: take 1 tablet every 4 to 6 hours while symptoms persist if pain or fever does not respond to 1 tablet, 2 tablets may be used do not exceed 6 tablets in 24 hours, unless directed by a doctor children under 12 years: ask a doctor",
        "drug_class": "Nonsteroidal Anti-inflammatory Drug [EPC]",
        "generic_name": "IBUPROFEN",
        "side_effects": [],
        "sources": [
            {
                "name": "OpenFDA Drug Labels",
                "type": "FDA",
                "url": "https://open.fda.gov/apis/drug/label/"
            }
        ],
        "uses": [
            "Uses temporarily relieves minor aches and pains due to: headache toothache backache menstrual cramps the common cold muscular aches minor pain of arthritis temporarily reduces fever"
        ],
        "warnings": [
            "Warnings Allergy alert: Ibuprofen may cause a severe allergic reaction, especially in people allergic to aspirin. Symptoms may include: rash facial swelling asthma (wheezing) hives skin reddening shock blisters If an allergic reaction occurs, stop use and seek medical help right away. Stomach bleeding warning: This product contains an NSAID, which may cause severe stomach bleeding. The chance is higher if you: take more or for a longer time than directed take a blood thinning (anticoagulant) or "
        ]
    },
    "status": "success"
}
```

---

### 2. Check Drug Interactions
```http
POST /api/check-interactions
```

**Request Body:**
```json
{
  "medications": ["aspirin", "warfarin", "ibuprofen"]
}
```

**Response:**
```json
{
    "data": {
        "interactions": [
            {
                "description": "No drug-drug interaction information found for warfarin + ababhudbvuwd in OpenFDA labels.",
                "drug1": "warfarin",
                "drug2": "ababhudbvuwd",
                "recommendation": "No specific interaction data available; consult a healthcare provider if concerned.",
                "severity": "unknown",
                "source": "OpenFDA"
            }
        ],
        "medications": [
            "warfarin",
            "ababhudbvuwd"
        ],
        "message": "No drug-drug interaction information found for the provided medications in OpenFDA labels.",
        "pairs_evaluated": 1,
        "sources": [
            {
                "name": "OpenFDA Drug Labels",
                "type": "FDA",
                "url": "https://open.fda.gov/apis/drug/label/"
            }
        ],
        "total_interactions": 0
    },
    "status": "success"
}
```

---

### 3. AI Chat (Gemini Function Calling)
```http
POST /api/chat
```

**Request Body:**
```json
{
  "prompt": "Can I take aspirin with warfarin?"
}
```

**Response (with function call):**
```json
{
  "status": "success",
  "via": "gemini:function_call",
  "function": "check_multiple_interactions",
  "result": {
    "status": "success",
    "data": { /* interaction results */ }
  }
}
```

**Response (text only):**
```json
{
  "status": "success",
  "via": "gemini:text",
  "text": "I can help you check medication interactions...",
  "raw_model_response": { /* full Gemini response */ }
}
```

---

### 4. Log Interaction Query
```http
POST /api/log-query
```

**Request Body:**
```json
{
  "medications": ["warfarin", "aspirin"],
  "interactions_found": 1,
  "severity_level": "major"
}
```

**Response:**
```json
{
  "log_id": "log_78fa7852e0a0",
  "message": "Query logged successfully.",
  "status": "success"
}
```

---

### 5. Explain in Simple Words
```http
POST /api/explain
```

**Request Body:**
```json
{
    "medication_name": "ibuprofen"
}
```

**Response:**
```json
{
    "data": {
        "explanation": "Ibuprofen, sometimes sold as Ibuprofen Dye Free, is a type of medicine called a nonsteroidal anti-inflammatory drug, or NSAID for short. It's used to temporarily relieve minor aches and pains. Think of it as a pain reliever and fever reducer. It can help with things like headaches, toothaches, backaches, menstrual cramps, muscle aches, and even the pain you might get from a cold or minor arthritis.\n\nTo take ibuprofen safely, it's important to follow the directions on the label. Don't take more than you need, and use the lowest dose that works for you. For adults and kids 12 and older, you can take 1 tablet every 4 to 6 hours as long as you still have symptoms. If one tablet isn't enough, you can take two, but don't take more than 6 tablets in a 24-hour period unless your doctor tells you to. For children under 12, it's best to ask a doctor before giving them ibuprofen.\n\nLike all medicines, ibuprofen can have side effects and warnings. Some people might have an allergic reaction, especially if they're allergic to aspirin. Signs of an allergic reaction include rash, facial swelling, wheezing, hives, skin redness, blisters, or even shock. If you have any of these symptoms, stop taking ibuprofen and get medical help right away.\n\nAnother important warning is about stomach bleeding. Ibuprofen can cause serious stomach bleeding, especially if you take too much, take it for too long, or if you're also taking a blood thinner. If you have any concerns about these risks, talk to your doctor or pharmacist before taking ibuprofen.\n",
        "medication_name": "ibuprofen",
        "reading_level": 7.3,
        "reading_level_description": "Easy to read (middle school)",
        "retrieved_data": {
            "brand_names": [
                "Ibuprofen Dye Free"
            ],
            "dosage": "Directions do not take more than directed the smallest effective dose should be used adults and children 12 years and over: take 1 tablet every 4 to 6 hours while symptoms persist if pain or fever does not respond to 1 tablet, 2 tablets may be used do not exceed 6 tablets in 24 hours, unless directed by a doctor children under 12 years: ask a doctor",
            "drug_class": "Nonsteroidal Anti-inflammatory Drug [EPC]",
            "found": true,
            "generic_name": "IBUPROFEN",
            "interactions": [],
            "side_effects": [],
            "sources": [
                {
                    "name": "OpenFDA Drug Labels",
                    "type": "FDA",
                    "url": "https://open.fda.gov/apis/drug/label/"
                }
            ],
            "uses": [
                "Uses temporarily relieves minor aches and pains due to: headache toothache backache menstrual cramps the common cold muscular aches minor pain of arthritis temporarily reduces fever"
            ],
            "warnings": [
                "Warnings Allergy alert: Ibuprofen may cause a severe allergic reaction, especially in people allergic to aspirin. Symptoms may include: rash facial swelling asthma (wheezing) hives skin reddening shock blisters If an allergic reaction occurs, stop use and seek medical help right away. Stomach bleeding warning: This product contains an NSAID, which may cause severe stomach bleeding. The chance is higher if you: take more or for a longer time than directed take a blood thinning (anticoagulant) or "
            ]
        },
        "sources": [
            {
                "name": "OpenFDA Drug Labels",
                "type": "FDA",
                "url": "https://open.fda.gov/apis/drug/label/"
            }
        ]
    },
    "status": "success"
}
```

---


### 6. Feedback 
```http
POST /api/feedback
```

**Request Body:**
```json
{
    "explanation_id" : "5",
    "feedback_type" : "helpful", (აქ მარტო "unclear" ან "helpful" მოსულა თორე 400-ს დაარტყამს)
    "comment" : "good"
}
```

**Response:**
```json
{
    "feedback_id": "fb_aa84912bccf0",
    "message": "Feedback submitted successfully.",
    "status": "success"
}
```

---


## Testing with Postman / cURL

### Example 1: Check Interactions
```bash
curl -X POST http://localhost:5000/api/check-interactions \
  -H "Content-Type: application/json" \
  -d '{
    "medications": ["aspirin", "warfarin"]
  }'
```

### Example 2: AI Chat
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What is ibuprofen used for?"
  }'
```

---

## Project Structure

```
backend/
├── app/
│   ├── api.py           # Flask routes & Gemini integration
│   ├── models.py        # Pydantic request/response models
│   └── functions.py     # Core business logic (interactions, lookups)
│
├── .env                 # Environment variables (NOT in Git!)
├── .env.example         # Template for .env
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "message": "Human-readable error description",
  "details": { /* optional error context */ }
}
```

**Common HTTP Status Codes:**
- `200 OK` - Successful request
- `400 Bad Request` - Invalid input (Pydantic validation failed)
- `404 Not Found` - Medication not in database
- `500 Internal Server Error` - Server/API error

---

## Current Limitations (MVP)

- **Mock Drug Database**: Uses small in-memory dict (`_MED_DB` in `functions.py`)
  - Only supports: ibuprofen, warfarin, aspirin
  - **Next step:** Replace with OpenFDA API or RxNorm

- **In-Memory Logging**: Query logs stored in `_LOG_STORE` dict (not persistent)
  - **Next step:** Add PostgreSQL database with encryption

- **No Rate Limiting**: Currently unlimited requests per user
  - **Next step:** Add Flask-Limiter middleware

- **No Authentication**: All endpoints are public
  - **Next step:** Add JWT tokens if needed

---

## Connecting to Frontend

Update your React frontend to call these endpoints:

```javascript
// Example: Check drug interactions from frontend
const checkInteractions = async (medications) => {
  const response = await fetch('http://localhost:5000/api/check-interactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ medications })
  });
  
  if (!response.ok) {
    throw new Error('Failed to check interactions');
  }
  
  return await response.json();
};
```

---

## Production Deployment

### Heroku (Recommended for MVP)

1. **Add Procfile** (already in repo):
   ```
   web: gunicorn backend.app.api:app
   ```

2. **Install Gunicorn**:
   ```bash
   pip install gunicorn
   pip freeze > requirements.txt
   ```

3. **Deploy**:
   ```bash
   heroku create medsplain-api
   heroku config:set GEMINI_API_KEY=your_key_here
   git push heroku main
   ```

### Production Checklist
- [ ] Use Gunicorn instead of Flask dev server
- [ ] Set `debug=False` in production
- [ ] Enable CORS properly (use `flask-cors`)
- [ ] Add rate limiting (Flask-Limiter)
- [ ] Replace in-memory logging with PostgreSQL
- [ ] Add monitoring (Sentry, Datadog, etc.)
- [ ] Enable HTTPS (via Heroku or reverse proxy)
- [ ] Add health check endpoint for load balancer

---

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'backend'"
**Solution:** Run from project root, not from `backend/` directory:
```bash
cd ai-powered-apps  # Go to project root
python -m backend.app.api
```

### Issue: "Gemini API key not found"
**Solution:** Verify `.env` file exists in `backend/` directory:
```bash
cat backend/.env  # Should show GEMINI_API_KEY=...
```

### Issue: "Port 5000 already in use"
**Solution:** Change port in `.env`:
```bash
PORT=5001
```
Or kill the process using port 5000:
```bash
lsof -ti:5000 | xargs kill -9  # macOS/Linux
```

### Issue: Gemini returns "invalid function call format"
**Solution:** Check that function schemas in `api.py` match Pydantic models in `models.py`

---

## Development Workflow

1. **Make changes** to `api.py`, `models.py`, or `functions.py`
2. **Restart server** (Flask auto-reloads in debug mode)
3. **Test in Postman** or with cURL
4. **Commit changes**:
   ```bash
   git add backend/
   git commit -m "Add new endpoint for X"
   git push origin main
   ```

---

## Next Steps (Post-MVP)

### Week 7:
- [ ] Integrate OpenFDA API for real drug data
- [ ] Build RAG pipeline for plain-language explanations
- [ ] Add readability scoring (Flesch-Kincaid)

### Week 8-9:
- [ ] Replace in-memory logging with PostgreSQL
- [ ] Add rate limiting and CAPTCHA
- [ ] Build admin dashboard for safety analytics
- [ ] Add caching layer (Redis) for frequent queries

### Week 10-11:
- [ ] User testing and feedback integration
- [ ] Performance optimization (query batching)
- [ ] Security audit (penetration testing)
- [ ] Prepare for production launch

---

## Contributing

1. Create a feature branch: `git checkout -b feature/new-endpoint`
2. Make your changes
3. Test thoroughly with Postman
4. Update this README if adding new endpoints
5. Commit and push: `git push origin feature/new-endpoint`
6. Create pull request

---
