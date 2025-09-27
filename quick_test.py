#!/usr/bin/env python3
"""
Simple API test to verify security fixes
"""

import json
import urllib.request
import urllib.parse
import urllib.error

API_BASE_URL = 'http://127.0.0.1:8000'

def test_basic_api():
    """Test basic API functionality"""
    print("🔍 Testing Portfolio API...")
    
    try:
        # Test root endpoint
        with urllib.request.urlopen(f'{API_BASE_URL}/') as response:
            data = json.loads(response.read().decode())
            print("✅ Backend is running!")
            print(f"   Message: {data.get('message', 'N/A')}")
            print(f"   Version: {data.get('version', 'N/A')}")
        
        # Test portfolio data endpoint
        with urllib.request.urlopen(f'{API_BASE_URL}/api/portfolio-data/') as response:
            data = json.loads(response.read().decode())
            print("✅ Portfolio data endpoint working!")
            print(f"   Personal Info: {data.get('personalInfo', {}).get('name', 'N/A')}")
        
        # Test skills endpoint
        with urllib.request.urlopen(f'{API_BASE_URL}/api/skills/') as response:
            data = json.loads(response.read().decode())
            print("✅ Skills endpoint working!")
            print(f"   Skills count: {len(data)}")
        
        print("\n🎉 Basic API tests passed!")
        return True
        
    except urllib.error.URLError as e:
        print(f"❌ Connection failed: {e}")
        print("   Make sure the Django server is running on port 8000")
        return False
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def test_cors_headers():
    """Test CORS configuration"""
    print("\n🔒 Testing CORS Security...")
    
    try:
        req = urllib.request.Request(f'{API_BASE_URL}/api/portfolio-data/')
        req.add_header('Origin', 'http://malicious-site.com')
        
        with urllib.request.urlopen(req) as response:
            cors_header = response.headers.get('Access-Control-Allow-Origin')
            
            if cors_header == '*':
                print("❌ CORS wildcard detected - SECURITY RISK!")
                return False
            elif cors_header:
                print(f"✅ CORS properly configured: {cors_header}")
                return True
            else:
                print("✅ No CORS headers for unauthorized origin")
                return True
                
    except Exception as e:
        print(f"⚠️ CORS test error: {e}")
        return False

def test_rate_limiting():
    """Test rate limiting"""
    print("\n⏱️ Testing Rate Limiting...")
    
    contact_data = {
        'name': 'Test User',
        'email': 'test@example.com',
        'message': 'Rate limit test message'
    }
    
    success_count = 0
    
    for i in range(5):  # Try 5 requests
        try:
            data = urllib.parse.urlencode(contact_data).encode()
            req = urllib.request.Request(f'{API_BASE_URL}/api/contact-messages/', data=data)
            req.add_header('Content-Type', 'application/x-www-form-urlencoded')
            
            with urllib.request.urlopen(req) as response:
                if response.status == 201:
                    success_count += 1
                    
        except urllib.error.HTTPError as e:
            if e.code == 429:  # Too Many Requests
                print(f"✅ Rate limiting working! Blocked after {success_count} requests")
                return True
            elif e.code == 403:  # CSRF or other auth issue
                print(f"⚠️ Request blocked by CSRF protection (expected)")
                return True
        except Exception as e:
            break
    
    print(f"⚠️ No rate limiting detected after {success_count} requests")
    return False

if __name__ == "__main__":
    print("🛡️ Portfolio Security Quick Test")
    print("=" * 40)
    
    if test_basic_api():
        test_cors_headers()
        test_rate_limiting()
    else:
        print("\n❌ Server not accessible. Please start the Django server:")
        print("   cd backend && uv run python manage.py runserver")
