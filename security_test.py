#!/usr/bin/env python3
"""
Comprehensive security test suite for Portfolio API
"""

import requests
import json
import time
from datetime import datetime

# Configuration
API_BASE_URL = 'http://127.0.0.1:8000/api'
USERNAME = 'admin'
PASSWORD = 'admin123'

class SecurityTester:
    def __init__(self):
        self.token = None
        self.session = requests.Session()
        self.test_results = []
    
    def log_test(self, test_name, passed, message=""):
        """Log test results"""
        status = "✅ PASS" if passed else "❌ FAIL"
        self.test_results.append({
            'test': test_name,
            'passed': passed,
            'message': message,
            'timestamp': datetime.now().isoformat()
        })
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
    
    def test_backend_health(self):
        """Test if backend is running"""
        try:
            response = requests.get('http://127.0.0.1:8000/', timeout=5)
            if response.status_code == 200:
                self.log_test("Backend Health Check", True, "Backend is running")
                return True
            else:
                self.log_test("Backend Health Check", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Backend Health Check", False, f"Connection failed: {e}")
            return False
    
    def test_authentication(self):
        """Test authentication system"""
        # Test login
        try:
            login_data = {'username': USERNAME, 'password': PASSWORD}
            response = requests.post(f'{API_BASE_URL}/auth/login/', json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('token')
                self.log_test("Authentication Login", True, f"Token received: {self.token[:20]}...")
                return True
            else:
                self.log_test("Authentication Login", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Authentication Login", False, f"Error: {e}")
            return False
    
    def test_rate_limiting(self):
        """Test rate limiting on contact form"""
        contact_data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'message': 'Test message for rate limiting'
        }
        
        success_count = 0
        rate_limited = False
        
        # Try to send multiple messages quickly
        for i in range(15):  # Try 15 requests
            try:
                response = requests.post(f'{API_BASE_URL}/contact-messages/', json=contact_data)
                if response.status_code == 201:
                    success_count += 1
                elif response.status_code == 429:  # Too Many Requests
                    rate_limited = True
                    break
                time.sleep(0.1)  # Small delay between requests
            except Exception as e:
                break
        
        if rate_limited:
            self.log_test("Rate Limiting", True, f"Rate limiting triggered after {success_count} requests")
        else:
            self.log_test("Rate Limiting", False, f"No rate limiting detected after {success_count} requests")
    
    def test_cors_security(self):
        """Test CORS configuration"""
        headers = {'Origin': 'http://malicious-site.com'}
        try:
            response = requests.get(f'{API_BASE_URL}/portfolio-data/', headers=headers)
            cors_header = response.headers.get('Access-Control-Allow-Origin')
            
            if cors_header == '*':
                self.log_test("CORS Security", False, "Wildcard CORS detected - security risk")
            elif cors_header:
                self.log_test("CORS Security", True, f"CORS properly configured: {cors_header}")
            else:
                self.log_test("CORS Security", True, "No CORS headers for unauthorized origin")
        except Exception as e:
            self.log_test("CORS Security", False, f"Error: {e}")
    
    def test_sql_injection(self):
        """Test for SQL injection vulnerabilities"""
        malicious_payloads = [
            "'; DROP TABLE portfolio_skill; --",
            "' OR '1'='1",
            "1' UNION SELECT password FROM auth_user--",
        ]
        
        for payload in malicious_payloads:
            try:
                # Test on skills endpoint with malicious category parameter
                response = requests.get(f'{API_BASE_URL}/skills/?category={payload}')
                
                if response.status_code == 500:
                    self.log_test("SQL Injection Protection", False, f"Server error with payload: {payload}")
                    return
                elif response.status_code == 400:
                    self.log_test("SQL Injection Protection", True, "Malicious input properly handled")
                else:
                    # Check if response contains sensitive data
                    response_text = response.text.lower()
                    if 'password' in response_text or 'error' in response_text:
                        self.log_test("SQL Injection Protection", False, "Potential data leakage")
                        return
            except Exception as e:
                continue
        
        self.log_test("SQL Injection Protection", True, "No SQL injection vulnerabilities detected")
    
    def test_xss_protection(self):
        """Test XSS protection in contact form"""
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "javascript:alert('XSS')",
            "<img src=x onerror=alert('XSS')>",
            "';alert('XSS');//"
        ]
        
        for payload in xss_payloads:
            contact_data = {
                'name': payload,
                'email': 'test@example.com',
                'message': f'Test message with XSS: {payload}'
            }
            
            try:
                response = requests.post(f'{API_BASE_URL}/contact-messages/', json=contact_data)
                
                if response.status_code == 400:
                    self.log_test("XSS Protection", True, "Malicious input rejected")
                    return
                elif response.status_code == 201:
                    # Check if the payload was sanitized
                    if payload in response.text:
                        self.log_test("XSS Protection", False, "XSS payload not sanitized")
                        return
            except Exception as e:
                continue
        
        self.log_test("XSS Protection", True, "XSS protection working correctly")
    
    def test_admin_permissions(self):
        """Test admin-only endpoints"""
        if not self.token:
            self.log_test("Admin Permissions", False, "No authentication token available")
            return
        
        # Test accessing admin-only endpoint without token
        response = requests.get(f'{API_BASE_URL}/skills/')
        if response.status_code == 200:
            # Try to POST without authentication
            skill_data = {'name': 'Test Skill', 'category': 'tools'}
            response = requests.post(f'{API_BASE_URL}/skills/', json=skill_data)
            
            if response.status_code in [401, 403]:
                self.log_test("Admin Permissions", True, "Unauthorized access properly blocked")
            else:
                self.log_test("Admin Permissions", False, f"Unauthorized POST allowed: {response.status_code}")
        else:
            self.log_test("Admin Permissions", False, "Cannot access public endpoints")
    
    def test_https_headers(self):
        """Test security headers"""
        try:
            response = requests.get(f'{API_BASE_URL}/portfolio-data/')
            headers = response.headers
            
            security_headers = {
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'Referrer-Policy': 'strict-origin-when-cross-origin'
            }
            
            missing_headers = []
            for header, expected_value in security_headers.items():
                if header not in headers:
                    missing_headers.append(header)
                elif headers[header] != expected_value:
                    missing_headers.append(f"{header} (incorrect value)")
            
            if missing_headers:
                self.log_test("Security Headers", False, f"Missing headers: {', '.join(missing_headers)}")
            else:
                self.log_test("Security Headers", True, "All security headers present")
        except Exception as e:
            self.log_test("Security Headers", False, f"Error: {e}")
    
    def run_all_tests(self):
        """Run complete security test suite"""
        print("🔒 Portfolio Security Test Suite")
        print("=" * 50)
        print(f"Testing API: {API_BASE_URL}")
        print(f"Timestamp: {datetime.now()}")
        print()
        
        # Run tests in order
        if not self.test_backend_health():
            print("\n❌ Backend not accessible. Stopping tests.")
            return
        
        self.test_authentication()
        self.test_rate_limiting()
        self.test_cors_security()
        self.test_sql_injection()
        self.test_xss_protection()
        self.test_admin_permissions()
        self.test_https_headers()
        
        # Summary
        print("\n" + "=" * 50)
        print("📊 Test Summary")
        
        passed = sum(1 for result in self.test_results if result['passed'])
        total = len(self.test_results)
        
        print(f"Tests Passed: {passed}/{total}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if passed == total:
            print("🎉 All security tests passed!")
        else:
            print("⚠️ Some security issues detected. Please review failed tests.")
        
        return self.test_results

if __name__ == "__main__":
    tester = SecurityTester()
    results = tester.run_all_tests()
