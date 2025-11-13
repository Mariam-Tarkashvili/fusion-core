#!/usr/bin/env python3
"""
Test script for the medication API
Run with: python test_api.py
"""

import requests
import json
import sys

BASE_URL = "http://localhost:5000"

def test_health():
    """Test health check endpoint"""
    print("\n🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_search(medication="Lisinopril"):
    """Test medication search endpoint"""
    print(f"\n🔍 Testing search for {medication}...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/search",
            json={"query": medication},
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            print(f"Medication: {data.get('medicationName')}")
            print(f"Readability: {data.get('readabilityScore')}")
            print(f"Key Points: {len(data.get('keyPoints', []))}")
            print(f"Explanation length: {len(data.get('explanation', ''))}")
        else:
            print(f"Error: {data.get('error')}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_feedback():
    """Test feedback endpoint"""
    print("\n🔍 Testing feedback submission...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/feedback",
            json={
                "medicationName": "Test Medication",
                "type": "helpful",
                "searchId": 1
            },
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_stats():
    """Test stats endpoint"""
    print("\n🔍 Testing stats endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/stats")
        print(f"Status: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            print(f"Total Searches: {data.get('totalSearches')}")
            print(f"Total Feedback: {data.get('totalFeedback')}")
            print(f"Popular Medications: {len(data.get('popularMedications', []))}")
        else:
            print(f"Error: {data.get('error')}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_history():
    """Test history endpoint"""
    print("\n🔍 Testing history endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/history?limit=10")
        print(f"Status: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            print(f"History items: {len(data.get('history', []))}")
        else:
            print(f"Error: {data.get('error')}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_invalid_input():
    """Test input validation"""
    print("\n🔍 Testing input validation...")
    test_cases = [
        {"query": ""},
        {"query": "A"},
        {"query": "A" * 101},
        {"query": "Test<script>alert('xss')</script>"},
    ]
    
    passed = 0
    for test_case in test_cases:
        try:
            response = requests.post(
                f"{BASE_URL}/api/search",
                json=test_case,
                headers={"Content-Type": "application/json"}
            )
            if response.status_code == 400:
                passed += 1
                print(f"✅ Correctly rejected: {test_case}")
            else:
                print(f"❌ Should have rejected: {test_case}")
        except Exception as e:
            print(f"❌ Error testing {test_case}: {e}")
    
    return passed == len(test_cases)

def main():
    """Run all tests"""
    print("=" * 60)
    print("🧪 API Test Suite")
    print("=" * 60)
    
    tests = [
        ("Health Check", test_health),
        ("Search", test_search),
        ("Feedback", test_feedback),
        ("Stats", test_stats),
        ("History", test_history),
        ("Input Validation", test_invalid_input),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            passed = test_func()
            results.append((name, passed))
        except Exception as e:
            print(f"\n❌ Test '{name}' crashed: {e}")
            results.append((name, False))
    
    print("\n" + "=" * 60)
    print("📊 Test Results")
    print("=" * 60)
    
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {name}")
    
    total = len(results)
    passed_count = sum(1 for _, passed in results if passed)
    
    print(f"\n{passed_count}/{total} tests passed")
    
    if passed_count == total:
        print("🎉 All tests passed!")
        sys.exit(0)
    else:
        print("⚠️  Some tests failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
