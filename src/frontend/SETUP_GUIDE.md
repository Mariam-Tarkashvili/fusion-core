# Complete Setup Guide - Medication Explanation App

This guide walks you through setting up both the Flask backend and React frontend.

## 📋 Prerequisites

- **Python 3.8+** installed
- **Node.js 18+** installed
- **OpenAI API Key** (get from https://platform.openai.com/api-keys)

## 🔧 Backend Setup (Flask + OpenAI)

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Automated Setup (Recommended)
```bash
# Make setup script executable
chmod +x setup.sh

# Run setup
./setup.sh
```

### 3. Manual Setup (Alternative)
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

### 4. Configure OpenAI API Key
Edit `backend/.env` and add your key:
```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
FLASK_ENV=development
PORT=5000
```

### 5. Start Backend Server
```bash
# Development mode
python app.py

# Production mode (with Gunicorn)
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

Backend will run at: **http://localhost:5000**

### 6. Test Backend (Optional)
```bash
# Run test suite
pip install requests  # if not already installed
python test_api.py
```

## 🎨 Frontend Setup (React)

### 1. Navigate to project root
```bash
cd ..  # if you're in backend directory
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend will run at: **http://localhost:8080** (or the port shown in terminal)

## 🔗 Connecting Frontend to Backend

The frontend is already configured to connect to `http://localhost:5000`. Make sure:

1. ✅ Backend is running on port 5000
2. ✅ Frontend can make requests to localhost:5000
3. ✅ CORS is enabled (already configured in Flask)

## 🧪 Testing the Complete Setup

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Flask backend is running",
  "database": "connected",
  "openai_configured": true
}
```

### 2. Test Search
```bash
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "Lisinopril"}'
```

### 3. Test in Browser
1. Open http://localhost:8080
2. Click "Get Started"
3. Search for "Lisinopril" or "Metformin"
4. Verify you get AI-generated explanation

## 📊 API Endpoints Reference

### Health Check
```bash
GET /api/health
```

### Search Medication
```bash
POST /api/search
Body: {"query": "medication name"}
```

### Submit Feedback
```bash
POST /api/feedback
Body: {"medicationName": "name", "type": "helpful|unclear", "searchId": 1}
```

### Get Statistics
```bash
GET /api/stats
```

### Get History
```bash
GET /api/history?limit=50
```

## 🗄️ Database

The backend uses **SQLite** by default:
- Database file: `backend/medication_data.db`
- Created automatically on first run
- Stores: searches, feedback, API logs

### View Database (Optional)
```bash
# Install SQLite browser
# macOS: brew install sqlite
# Linux: apt-get install sqlite3

# Open database
cd backend
sqlite3 medication_data.db

# View tables
.tables

# Query searches
SELECT * FROM searches LIMIT 10;

# Exit
.quit
```

## 🚀 Production Deployment

### Backend Deployment

**Option 1: Heroku**
```bash
cd backend
heroku create your-app-name
heroku config:set OPENAI_API_KEY=your_key_here
git push heroku main
```

**Option 2: Railway**
1. Connect your GitHub repo
2. Add `OPENAI_API_KEY` environment variable
3. Deploy automatically

**Option 3: DigitalOcean/AWS/GCP**
```bash
# Use Gunicorn
gunicorn -w 4 -b 0.0.0.0:$PORT app:app
```

### Frontend Deployment

**Lovable Built-in Deployment**
1. Push changes
2. Deploy from Lovable dashboard

**Manual Deployment (Netlify/Vercel)**
```bash
# Build
npm run build

# Deploy dist/ folder
```

### Update Frontend URL
In production, update API URL in `src/pages/Index.jsx`:
```javascript
const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:5000';
```

Add to `.env`:
```
VITE_BACKEND_URL=https://your-backend.herokuapp.com
```

## 🐛 Troubleshooting

### Backend Issues

**OpenAI API Errors**
```bash
# Check if key is set
echo $OPENAI_API_KEY

# Test key manually
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**Database Errors**
```bash
# Delete and recreate database
rm medication_data.db
python app.py  # Creates new database
```

**Port Already in Use**
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process or use different port
PORT=5001 python app.py
```

### Frontend Issues

**Cannot Connect to Backend**
1. Verify backend is running: `curl http://localhost:5000/api/health`
2. Check browser console for CORS errors
3. Verify URL in frontend code matches backend port

**CORS Errors**
- Already handled in Flask backend
- If still occurring, check browser console for exact error
- Verify `flask-cors` is installed

## 📈 Monitoring & Analytics

### View API Logs
```bash
# In backend directory
sqlite3 medication_data.db

# Get recent API calls
SELECT * FROM api_logs ORDER BY created_at DESC LIMIT 20;

# Count by endpoint
SELECT endpoint, COUNT(*) as count 
FROM api_logs 
GROUP BY endpoint 
ORDER BY count DESC;
```

### Usage Statistics
Access via API:
```bash
curl http://localhost:5000/api/stats
```

Or in your browser:
- http://localhost:5000/api/stats
- http://localhost:5000/api/history

## 🔒 Security Best Practices

1. **Never commit `.env` file**
   - Already in `.gitignore`
   - Use environment variables in production

2. **Use HTTPS in production**
   - Most platforms (Heroku, Railway) provide this automatically

3. **Rotate API keys regularly**
   - Update in `.env` or hosting platform

4. **Monitor API usage**
   - Check OpenAI usage dashboard
   - Set up billing alerts

5. **Rate limiting**
   - Consider adding Flask-Limiter for production

## 📚 Additional Resources

- **OpenAI API Docs**: https://platform.openai.com/docs
- **Flask Documentation**: https://flask.palletsprojects.com/
- **React Documentation**: https://react.dev/
- **Deployment Guides**: 
  - Heroku: https://devcenter.heroku.com/articles/getting-started-with-python
  - Railway: https://docs.railway.app/
  - DigitalOcean: https://www.digitalocean.com/community/tutorials/how-to-deploy-a-flask-application-on-an-ubuntu-vps

## 💡 Tips

- **Development**: Keep both servers running in separate terminals
- **Testing**: Use the included `test_api.py` script
- **Database**: SQLite is fine for development, use PostgreSQL for production
- **Caching**: Search results are cached to reduce API costs
- **Monitoring**: Check `api_logs` table regularly

## 🆘 Need Help?

1. Check the `backend/README.md` for detailed backend docs
2. Run `python test_api.py` to diagnose backend issues
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

---

**Happy coding! 🎉**
