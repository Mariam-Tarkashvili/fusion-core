#!/bin/bash

# Setup script for the Flask backend

echo "🚀 Setting up Medication Explanation Backend..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python 3 found"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔄 Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your OpenAI API key!"
else
    echo "✅ .env file already exists"
fi

# Check if OpenAI API key is set
if grep -q "your_openai_api_key_here" .env; then
    echo ""
    echo "⚠️  WARNING: OpenAI API key not configured!"
    echo "   Please edit .env and add your OpenAI API key"
    echo "   Get your key from: https://platform.openai.com/api-keys"
    echo ""
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  1. Activate the virtual environment:"
echo "     source venv/bin/activate  (Linux/Mac)"
echo "     venv\\Scripts\\activate     (Windows)"
echo "  2. Run the server:"
echo "     python app.py"
echo ""
echo "Server will be available at http://localhost:5000"
echo ""
