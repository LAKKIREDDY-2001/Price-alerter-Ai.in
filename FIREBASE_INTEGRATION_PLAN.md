# Firebase Integration Plan for Price Alert App

## Objective
Add Firebase Authentication to replace or supplement the existing Flask-based authentication system.

## Information Gathered

### Current Project Structure
- **Backend**: Flask app (`app.py`) with SQLite database, running on port 8080
- **Frontend Templates**: 
  - `templates/login.html` - Modern login page with social login buttons
  - `templates/signup.html` - Modern signup page
  - `templates/index.html` - Dashboard with price tracking features
- **Static Assets**: CSS and JS files in `/static/` folder
- **Client-side JS**: `script.js` for dashboard functionality

### Firebase Project Details (Provided)
- **Project ID**: `tahcchat-147ed`
- **Web App ID**: `1:99674078177:web:9f1909955b8be2fe15f0a0`
- **Configuration**: API Key, Auth Domain, Storage Bucket, Messaging Sender ID, App ID, Measurement ID

## Plan

### Phase 1: Frontend Firebase Integration
1. **Update `templates/login.html`**:
   - Add Firebase SDK scripts (CDN)
   - Initialize Firebase with provided config
   - Add Firebase Auth integration
   - Implement Google Sign-In button
   - Update form submission to use Firebase Auth

2. **Update `templates/signup.html`**:
   - Add Firebase SDK scripts
   - Implement email/password signup with Firebase Auth
   - Add Google Sign-In option

3. **Create Firebase utility module**:
   - Create `static/firebase-config.js` with Firebase initialization
   - Create `static/firebase-auth.js` with auth helper functions

### Phase 2: Backend Firebase Token Verification
1. **Update `app.py`**:
   - Add Firebase Admin SDK for token verification
   - Create endpoint to verify Firebase ID tokens
   - Create user session based on Firebase UID
   - Add CORS support for Firebase auth requests

2. **Add Firebase Admin dependency**:
   - Add `firebase-admin` to `requirements.txt`

### Phase 3: Database Migration (Optional)
- Create users in Firebase Auth
- Sync user data with local SQLite database
- Map Firebase UID to local user records

### Phase 4: Testing & Validation
- Test Google Sign-In flow
- Test email/password signup/login
- Verify token verification on backend
- Test dashboard access with Firebase session

## Files to Modify/Create

### New Files:
- `static/firebase-config.js` - Firebase initialization
- `static/firebase-auth.js` - Authentication helpers
- `requirements.txt` - Add firebase-admin

### Modified Files:
- `templates/login.html` - Add Firebase Auth UI
- `templates/signup.html` - Add Firebase Auth UI
- `app.py` - Add Firebase token verification endpoint
- `static/auth.js` - Update to use Firebase Auth

## Follow-up Steps

1. Install Firebase Admin SDK: `pip install firebase-admin`
2. Download Firebase service account key from Firebase Console
3. Test authentication flows
4. Deploy and verify

## Implementation Order
1. Create Firebase config file
2. Update signup.html with Firebase Auth
3. Update login.html with Firebase Auth
4. Add token verification to backend
5. Test complete flow

---
**Note**: This plan keeps the existing Flask API for price tracking while using Firebase for authentication. The Flask backend will verify Firebase ID tokens to establish user sessions.

