#!/usr/bin/env python3
"""
Quick authentication test script for the Portfolio API
"""

import requests
import json

# Configuration
API_BASE_URL = 'http://127.0.0.1:8000/api'
USERNAME = 'admin'
PASSWORD = 'admin123'

def test_authentication():
    print("🔐 Testing Portfolio API Authentication")
    print("=" * 50)
    
    # Test 1: Backend Health Check
    try:
        response = requests.get('http://127.0.0.1:8000/')
        if response.status_code == 200:
            print("✅ Backend is running and responding")
            data = response.json()
            print(f"   Message: {data.get('message', 'N/A')}")
            print(f"   Version: {data.get('version', 'N/A')}")
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend connection failed: {e}")
        return False
    
    # Test 2: Login
    print("\n🔑 Testing Login...")
    try:
        login_data = {
            'username': USERNAME,
            'password': PASSWORD
        }
        
        response = requests.post(f'{API_BASE_URL}/auth/login/', json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            user_info = data.get('user', {})
            
            print("✅ Login successful!")
            print(f"   Token: {token[:20]}...")
            print(f"   User: {user_info.get('username')}")
            print(f"   Admin: {user_info.get('is_staff', False)}")
            
            return token
        else:
            print(f"❌ Login failed: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data}")
            except:
                print(f"   Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Login request failed: {e}")
        return None

def test_api_access(token):
    if not token:
        print("\n⚠️  Skipping API tests - no valid token")
        return
    
    print("\n📊 Testing API Access...")
    
    headers = {
        'Authorization': f'Token {token}',
        'Content-Type': 'application/json'
    }
    
    # Test read access (should work for everyone)
    read_endpoints = [
        '/health/',
        '/portfolio-data/',
        '/personal-info/',
        '/skills/',
        '/experience/',
        '/projects/',
        '/certifications/'
    ]
    
    print("\n📖 Testing Read Access (Public):")
    for endpoint in read_endpoints:
        try:
            response = requests.get(f'{API_BASE_URL}{endpoint}')
            status = "✅" if response.status_code == 200 else "❌"
            print(f"   {status} GET {endpoint} - {response.status_code}")
        except Exception as e:
            print(f"   ❌ GET {endpoint} - Error: {e}")
    
    # Test write access (requires authentication)
    print("\n✏️  Testing Write Access (Admin Only):")
    
    # Test creating a skill
    try:
        test_skill = {
            'name': 'Test Authentication Skill',
            'category': 'tools',
            'proficiency': 3  # Integer from 1-5 representing skill level
        }
        
        response = requests.post(f'{API_BASE_URL}/skills/', json=test_skill, headers=headers)
        
        if response.status_code == 201:
            print("   ✅ POST /skills/ - Successfully created test skill")
            
            # Clean up - delete the test skill
            created_skill = response.json()
            skill_id = created_skill.get('id')
            
            if skill_id:
                delete_response = requests.delete(f'{API_BASE_URL}/skills/{skill_id}/', headers=headers)
                if delete_response.status_code == 204:
                    print("   ✅ DELETE /skills/ - Successfully cleaned up test skill")
                else:
                    print(f"   ⚠️  DELETE /skills/ - Cleanup failed: {delete_response.status_code}")
        else:
            print(f"   ❌ POST /skills/ - Failed: {response.status_code}")
            try:
                error_data = response.json()
                print(f"      Error: {error_data}")
            except:
                print(f"      Response: {response.text}")
                
    except Exception as e:
        print(f"   ❌ Write access test failed: {e}")

def test_unauthorized_access():
    print("\n🚫 Testing Unauthorized Access:")
    
    # Try to create without token
    try:
        test_skill = {
            'name': 'Unauthorized Skill',
            'category': 'tools',
            'proficiency': 2  # Integer from 1-5 representing skill level
        }
        
        response = requests.post(f'{API_BASE_URL}/skills/', json=test_skill)
        
        if response.status_code in [401, 403]:
            print("   ✅ POST /skills/ without auth - Correctly rejected")
        else:
            print(f"   ❌ POST /skills/ without auth - Unexpected: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Unauthorized test failed: {e}")

if __name__ == "__main__":
    # Run the tests
    token = test_authentication()
    test_api_access(token)
    test_unauthorized_access()
    
    print("\n" + "=" * 50)
    print("🎉 Authentication testing complete!")
    print("\n💡 Tips:")
    print("   • Use the admin test page: http://localhost:3000/admin-test.html")
    print("   • Frontend portfolio: http://localhost:3000")
    print("   • Backend API docs: http://127.0.0.1:8000/")
    print(f"   • Login credentials: {USERNAME} / {PASSWORD}")
