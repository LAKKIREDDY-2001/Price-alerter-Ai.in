# Critical Fixes Plan

## Issues Identified:

### 1. **app.py - Missing Database Table**
- `init_db()` doesn't create `pending_signups` table
- This causes signup failures when trying to store pending signup data

### 2. **firebase-entry.js - Import Error**
- Line tries to use `getApp()` without importing it from firebase/app
- This will cause a ReferenceError

### 3. **CORS Configuration**
- Currently too permissive with `origins="*"` in production
- Should be more restrictive

### 4. **Session Security**
- Missing proper session cleanup for expired tokens

---

## Fix Plan:

### Fix 1: Add pending_signups table to init_db()
**File:** `app.py`
- Add CREATE TABLE statement for `pending_signups` with all required columns

### Fix 2: Fix firebase-entry.js import error
**File:** `firebase-entry.js`
- Add `getApp` to the import statement from 'firebase/app'
- Improve error handling

### Fix 3: Improve CORS configuration
**File:** `app.py`
- Make CORS more restrictive for production
- Add proper origin validation

### Fix 4: Add database cleanup for expired entries
**File:** `app.py`
- Add cleanup function for expired password resets
- Add cleanup for expired pending signups

---

## Files to Modify:
1. `app.py` - Database init, CORS, cleanup
2. `firebase-entry.js` - Import fix

## Testing:
1. Start server and verify no import errors
2. Test signup flow - should create pending_signups table
3. Test login with valid credentials

