# Complete Feature Fix Plan

## Issues Identified:

### 1. Forgot Password Form
- **Problem:** Form has `id="forgot-form"` but JavaScript references `forgot-password-form`

### 2. Reset Password Token
- **Problem:** Template uses `{{ token }}` variable but Flask template syntax is `{{ token }}` correctly

### 3. Signup Flow
- **Issue:** Multi-step OTP verification can be simplified

### 4. Login Flow
- **Issue:** 2FA handling needs improvement

### 5. Dashboard
- **Issue:** LocalStorage-based tracking vs API-based tracking

## Fixes to Implement:

1. Fix forgot-password.html form ID
2. Fix signup.html JavaScript initialization
3. Fix reset-password.html token handling
4. Add proper error handling throughout
5. Simplify auth flows for better UX
6. Ensure all API endpoints are properly connected
7. Add loading states and better feedback

