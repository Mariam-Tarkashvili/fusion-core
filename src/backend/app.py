from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def calculate_readability_score(text):
    """Calculate Flesch reading ease score"""
    words = len(text.split())
    sentences = text.count('.') + text.count('!') + text.count('?')
    syllables = sum([len([c for c in word if c in 'aeiouAEIOU']) for word in text.split()])
    
    if sentences == 0 or words == 0:
        return {"grade": "N/A", "level": "Unknown"}
    
    score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
    
    if score >= 90:
        return {"grade": "5th", "level": "Very Easy"}
    elif score >= 80:
        return {"grade": "6th", "level": "Easy"}
    elif score >= 70:
        return {"grade": "7th", "level": "Fairly Easy"}
    elif score >= 60:
        return {"grade": "8th-9th", "level": "Standard"}
    elif score >= 50:
        return {"grade": "10th-12th", "level": "Fairly Difficult"}
    else:
        return {"grade": "College", "level": "Difficult"}

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Flask backend is running"})

@app.route('/api/search', methods=['POST'])
def search_medication():
    """Search for medication and generate explanation"""
    try:
        data = request.get_json()
        medication_name = data.get('query', '').strip()
        
        if not medication_name:
            return jsonify({"error": "Medication name is required"}), 400
        
        # Generate explanation using OpenAI
        prompt = f"""Explain the medication {medication_name} in simple, easy-to-understand language.
        
Please provide:
1. A clear explanation of what this medication is used for and how it works (2-3 paragraphs)
2. Three key points about this medication (benefits, usage, or important information)

Format your response as JSON with this structure:
{{
  "explanation": "detailed explanation here",
  "keyPoints": ["point 1", "point 2", "point 3"]
}}"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a medical information assistant that explains medications in simple, accessible language for patients. Always provide accurate, helpful information."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        result = response.choices[0].message.content
        import json
        parsed_result = json.loads(result)
        
        explanation = parsed_result.get('explanation', '')
        key_points = parsed_result.get('keyPoints', [])
        
        # Calculate readability score
        readability = calculate_readability_score(explanation)
        
        # Mock sources (in production, fetch from real medical databases)
        sources = [
            {
                "name": "FDA Drug Information",
                "snippet": f"Official information about {medication_name} from the FDA database.",
                "url": f"https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=BasicSearch.process"
            },
            {
                "name": "MedlinePlus",
                "snippet": f"Comprehensive patient information about {medication_name}.",
                "url": "https://medlineplus.gov/"
            },
            {
                "name": "Mayo Clinic",
                "snippet": f"Medical reference information for {medication_name}.",
                "url": "https://www.mayoclinic.org/drugs-supplements"
            }
        ]
        
        return jsonify({
            "medicationName": medication_name,
            "explanation": explanation,
            "keyPoints": key_points,
            "readabilityScore": readability,
            "sources": sources
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    """Submit user feedback"""
    try:
        data = request.get_json()
        medication_name = data.get('medicationName')
        feedback_type = data.get('type')  # 'helpful' or 'unclear'
        
        # In production, store this in a database
        print(f"Feedback received: {medication_name} - {feedback_type}")
        
        return jsonify({"message": "Feedback received", "success": True})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
