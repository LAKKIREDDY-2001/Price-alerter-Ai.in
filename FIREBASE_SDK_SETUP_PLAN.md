# Firebase SDK Setup Plan

## Objective
Add Firebase SDK using npm with script tag integration for the Price Alert web app.

## Information Gathered

### Current Project State
- **Backend**: Flask app (`app.py`) on port 8080
- **Frontend**: Static HTML templates in `/templates/`
- **Static Assets**: JavaScript/CSS in `/static/`
- **Existing Firebase**: `static/firebase-auth.js` uses older namespaced API
- **Configuration**: Firebase project `tahcchat-147ed` credentials provided

### Firebase Requirements (from task)
- Use npm: `npm install firebase`
- Use script tag for inclusion
- Modular SDK syntax (v7.20.0+)
- Initialize with provided config
- Use Analytics

## Implementation Plan

### Step 1: Install Firebase SDK via npm
```bash
cd /Users/lakkireddyvenkatamadhavareddy/price alerter
npm install firebase
```

### Step 2: Create Firebase bundle using esbuild
Since the project doesn't use a module bundler, we'll create a bundled version:
```bash
npx esbuild node_modules/firebase/app.js node_modules/firebase/analytics.js --bundle --outfile=static/firebase-bundle.js --format=iife --global-name=firebase
```

### Step 3: Create Firebase initialization module
Create `static/firebase-init.js` with:
- Firebase configuration (from task)
- Initialize Firebase App
- Initialize Analytics
- Export for use in other scripts

### Step 4: Update HTML templates to include Firebase
Add to all templates:
```html
<script src="/static/firebase-bundle.js"></script>
<script src="/static/firebase-init.js"></script>
```

### Step 5: Update existing firebase-auth.js
Modify to use modular API and the bundled Firebase

### Step 6: Test integration

## Files to Create
1. `package.json` - npm configuration
2. `static/firebase-init.js` - Firebase initialization
3. `static/firebase-bundle.js` - Bundled Firebase SDK

## Files to Modify
1. `templates/index.html` - Add Firebase script tags
2. `templates/login.html` - Add Firebase script tags
3. `templates/signup.html` - Add Firebase script tags
4. `static/firebase-auth.js` - Update to use modular API

## Follow-up Steps
1. Run `npm install firebase`
2. Create bundle with esbuild
3. Test Firebase initialization in browser console
4. Verify analytics works

## Technical Notes
- Using IIFE format for browser compatibility
- Global `firebase` object will be available
- Modular imports converted to global namespace access
- Analytics initialized for all pages

