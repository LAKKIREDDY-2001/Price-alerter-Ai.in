#!/usr/bin/env python3
"""
AI Price Alert - Feature Test Script
Tests all features: Signup, Login, Forgot Password, Price Tracking
"""

import requests
import json
import time
import sys

BASE_URL = "http://localhost:8081"

def print_header(text):
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}")

def print_success(text):
    print(f"✓ {text}")

def print_error(text):
    print(f"✗ {text}")

def print_info(text):
    print(f"  → {text}")

# Test 1: Check if server is running
def test_server():
    print_header("Test 1: Server Status")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        print_success(f"Server is running (Status: {response.status_code})")
        return True
    except requests.exceptions.ConnectionError:
        print_error("Server is not running! Start it with: ./start-server.sh")
        return False

# Test 2: Signup Page
def test_signup_page():
    print_header("Test 2: Signup Page")
    try:
        response = requests.get(f"{BASE_URL}/signup", timeout=5)
        if response.status_code == 200 and "Sign Up" in response.text:
            print_success("Signup page loads correctly")
            return True
        else:
            print_error("Signup page failed to load")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

# Test 3: Login Page
def test_login_page():
    print_header("Test 3: Login Page")
    try:
        response = requests.get(f"{BASE_URL}/login", timeout=5)
        if response.status_code == 200 and "Sign In" in response.text:
            print_success("Login page loads correctly")
            return True
        else:
            print_error("Login page failed to load")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

# Test 4: Forgot Password Page
def test_forgot_password_page():
    print_header("Test 4: Forgot Password Page")
    try:
        response = requests.get(f"{BASE_URL}/forgot-password", timeout=5)
        if response.status_code == 200 and "Forgot Password" in response.text:
            print_success("Forgot password page loads correctly")
            return True
        else:
            print_error("Forgot password page failed to load")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

# Test 5: User Signup
def test_user_signup():
    print_header("Test 5: User Signup")
    test_email = f"test_{int(time.time())}@example.com"
    
    try:
        response = requests.post(
            f"{BASE_URL}/signup",
            json={
                "username": "testuser",
                "email": test_email,
                "password": "testpass123",
                "phone": "+1234567890"
            },
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            if "signupToken" in data:
                print_success(f"Signup initiated! Token received: {data['signupToken'][:20]}...")
                return data['signupToken'], test_email
            else:
                print_error("No signup token in response")
                return None, test_email
        else:
            print_error(f"Signup failed: {response.text}")
            return None, test_email
    except Exception as e:
        print_error(f"Error: {e}")
        return None, test_email

# Test 6: Send Email OTP
def test_send_email_otp(email, signup_token=None):
    print_header("Test 6: Send Email OTP")
    try:
        response = requests.post(
            f"{BASE_URL}/api/send-email-otp",
            json={
                "email": email,
                "purpose": "verification",
                "signupToken": signup_token or ""
            },
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"OTP sent: {data.get('message', 'Success')}")
            if data.get('demo_mode'):
                print_info("Running in DEMO mode - OTP printed to console")
            return True
        else:
            print_error(f"Failed to send OTP: {response.text}")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

# Test 7: Forgot Password API
def test_forgot_password_api():
    print_header("Test 7: Forgot Password API")
    try:
        response = requests.post(
            f"{BASE_URL}/api/forgot-password",
            json={"email": "test@example.com"},
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Forgot password request processed")
            if data.get('demo_token'):
                print_info(f"Demo reset token: {data['demo_token'][:30]}...")
            return True
        else:
            print_error(f"API call failed: {response.text}")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

# Test 8: Get Price (Test Mode)
def test_get_price():
    print_header("Test 8: Get Price (Test Mode)")
    try:
        response = requests.post(
            f"{BASE_URL}/get-price",
            json={"url": "test://product"},
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Price fetched: {data.get('currency_symbol', '$')}{data.get('price', 0)}")
            print_info(f"Product: {data.get('productName', 'Unknown')}")
            print_info(f"Test Mode: {data.get('isTestMode', False)}")
            return True
        else:
            print_error(f"Failed to fetch price: {response.text}")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

# Test 9: Create Tracker (Requires Auth)
def test_create_tracker_unauthorized():
    print_header("Test 9: Create Tracker (Unauthorized)")
    try:
        response = requests.post(
            f"{BASE_URL}/api/trackers",
            json={
                "url": "test://product",
                "currentPrice": 100,
                "targetPrice": 80,
                "currency": "USD",
                "currencySymbol": "$",
                "productName": "Test Product"
            },
            timeout=5
        )
        
        if response.status_code == 401:
            print_success("Correctly rejected unauthorized request (401)")
            return True
        else:
            print_error(f"Unexpected response: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

# Test 10: API Endpoints
def test_api_endpoints():
    print_header("Test 10: API Endpoints")
    
    endpoints = [
        ("/api/user", "GET", None, 401, "Get User (Unauth)"),
        ("/api/trackers", "GET", None, 401, "Get Trackers (Unauth)"),
        ("/api/trackers", "POST", {"url": "test"}, 401, "Create Tracker (Unauth)"),
    ]
    
    all_passed = True
    for endpoint, method, data, expected_status, name in endpoints:
        try:
            if method == "GET":
                response = requests.get(f"{BASE_URL}{endpoint}", timeout=5)
            else:
                response = requests.post(f"{BASE_URL}{endpoint}", json=data, timeout=5)
            
            if response.status_code == expected_status:
                print_success(f"{name}: Correct ({response.status_code})")
            else:
                print_error(f"{name}: Expected {expected_status}, got {response.status_code}")
                all_passed = False
        except Exception as e:
            print_error(f"{name}: Error - {e}")
            all_passed = False
    
    return all_passed

# Run all tests
def run_all_tests():
    print("\n" + "="*60)
    print("  AI PRICE ALERT - COMPREHENSIVE FEATURE TEST")
    print("="*60)
    
    results = {}
    
    results["server"] = test_server()
    if not results["server"]:
        print_error("\nServer is not running. Please start it first:")
        print("  cd /Users/lakkireddyvenkatamadhavareddy/price\\ alerter")
        print("  ./start-server.sh")
        return
    
    results["signup_page"] = test_signup_page()
    results["login_page"] = test_login_page()
    results["forgot_password_page"] = test_forgot_password_page()
    results["forgot_password_api"] = test_forgot_password_api()
    results["get_price"] = test_get_price()
    results["tracker_unauthorized"] = test_create_tracker_unauthorized()
    results["api_endpoints"] = test_api_endpoints()
    
    # Test signup flow
    token, email = test_user_signup()
    if token:
        results["signup"] = True
        results["send_otp"] = test_send_email_otp(email, token)
    else:
        results["signup"] = False
        results["send_otp"] = False
    
    # Print summary
    print_header("TEST SUMMARY")
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, passed_test in results.items():
        status = "✓ PASS" if passed_test else "✗ FAIL"
        test_name_formatted = test_name.replace("_", " ").title()
        print(f"  {status}: {test_name_formatted}")
    
    print(f"\n  Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! All features are working correctly.")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please review the issues above.")

if __name__ == "__main__":
    run_all_tests()

