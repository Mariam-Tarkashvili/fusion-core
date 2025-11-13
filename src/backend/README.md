# Medication Explanation Backend (Flask)

A Python Flask backend API for the medication explanation application.

## Setup

1. **Create a virtual environment:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

4. **Run the server:**
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status

### Search Medication
- **POST** `/api/search`
- Body: `{ "query": "medication name" }`
- Returns medication explanation, key points, readability score, and sources

### Submit Feedback
- **POST** `/api/feedback`
- Body: `{ "medicationName": "name", "type": "helpful|unclear" }`
- Stores user feedback

## Connecting to Frontend

Update your frontend API calls to point to `http://localhost:5000/api/search` instead of the mock implementation.

In `src/pages/Index.jsx`, replace the `handleSearch` function with:

```javascript
const handleSearch = async (query) => {
  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:5000/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch medication data');
    }
    
    const data = await response.json();
    setExplanation(data);
  } catch (error) {
    console.error('Error fetching medication data:', error);
    toast.error('Failed to fetch medication information');
  } finally {
    setIsLoading(false);
  }
};
```

## Production Deployment

For production, consider:
- Using a production WSGI server like Gunicorn
- Adding rate limiting
- Implementing proper error handling and logging
- Storing feedback in a database (PostgreSQL, MongoDB, etc.)
- Adding authentication if needed
- Caching frequently requested medications
