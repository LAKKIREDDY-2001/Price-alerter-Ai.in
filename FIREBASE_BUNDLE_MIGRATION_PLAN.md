# Firebase Bundle Migration Plan

## Objective
Migrate from Firebase CDN usage to npm-bundled Firebase using esbuild for better performance and reduced external dependencies.

## Current State
- Firebase installed via npm: `firebase` v12.7.0
- esbuild configured for bundling
- HTML files currently using Firebase via CDN URLs
- Multiple Firebase configurations across files (some outdated)

## Target State
- Single bundled Firebase bundle at `static/firebase-bundle.js`
- All HTML files importing from local bundle
- Consistent Firebase configuration across all files
- Updated Firebase config to match the provided configuration

## Firebase Configuration (to use)
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCNmtIZice9l2M-sk-lJ82m0BWYC2Ypl08",
  authDomain: "ai-price-alert.firebaseapp.com",
  projectId: "ai-price-alert",
  storageBucket: "ai-price-alert.firebasestorage.app",
  messagingSenderId: "150142041812",
  appId: "1:150142041812:web:c645b3d9d6f1fea4b6c541",
  measurementId: "G-0WZN54TWR0"
};
```

## Files to Update

### 1. firebase-entry.js (Rebuild bundle)
- Update Firebase config to the new one
- Export all necessary Firebase modules
- Include App Check configuration

### 2. templates/index.html
- Replace CDN script imports with `<script src="/static/firebase-bundle.js"></script>`
- Remove module script with CDN imports
- Update to use window.firebaseApp, window.firebaseAnalytics, window.firebaseAuth

### 3. templates/login.html
- Same changes as index.html
- Update auth configuration

### 4. templates/signup.html
- Same changes as login.html

### 5. templates/forgot-password.html
- Check if Firebase is needed, if not remove CDN

### 6. templates/reset-password.html
- Check if Firebase is needed, if not remove CDN

### 7. static/firebase-init.js
- Update config to new one
- Ensure compatibility with bundled version

### 8. static/firebase-auth.js
- Update config to new one
- Ensure compatibility with bundled version

## Implementation Steps

### Step 1: Build Firebase Bundle
```bash
npm run build:firebase
```

### Step 2: Update firebase-entry.js
- Update Firebase config
- Export all necessary functions

### Step 3: Update All HTML Templates
- Replace CDN with local bundle
- Update script loading order

### Step 4: Verify and Test
- Check bundle loads correctly
- Verify Firebase services work
- Test authentication flow

## Rollback Plan
- Keep CDN URLs as backup in comments
- Can easily revert by uncommenting CDN scripts

## Success Criteria
- [ ] Firebase bundle builds successfully
- [ ] All pages load without errors
- [ ] Authentication works correctly
- [ ] Analytics tracks properly
- [ ] No console errors related to Firebase

