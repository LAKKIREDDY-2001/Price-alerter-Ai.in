# AdSense Site Verification Plan

## Objective
Add AdSense verification code to all HTML templates for pricealerter.in site verification.

## Current Status
- ✅ AdSense Publisher ID configured: `pub-1181608933401999`
- ✅ Ad script exists in `static/ads.js`
- ✅ Ad containers added to templates
- ❌ Direct AdSense verification code NOT in HTML templates

## Required Changes

### Files to Modify:
1. `templates/index.html` - Add AdSense meta tag in head
2. `templates/login.html` - Add AdSense meta tag in head
3. `templates/signup.html` - Add AdSense meta tag in head
4. `templates/forgot-password.html` - Add AdSense meta tag in head
5. `templates/reset-password.html` - Add AdSense meta tag in head
6. `templates/error.html` - Add AdSense meta tag in head

### Code to Add:
```html
<!-- AdSense Site Verification -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1181608933401999"
     crossorigin="anonymous"></script>
```

### Placement:
- Add immediately after the existing `<head>` metadata
- Place before other script tags (except charset/viewport meta)

## Implementation Steps

### Step 1: Create TODO.md
- [x] Create this plan file

### Step 2: Update templates/index.html
- [x] Add AdSense script tag in head section

### Step 3: Update templates/login.html
- [x] Add AdSense script tag in head section

### Step 4: Update templates/signup.html
- [x] Add AdSense script tag in head section

### Step 5: Update templates/forgot-password.html
- [x] Add AdSense script tag in head section

### Step 6: Update templates/reset-password.html
- [x] Add AdSense script tag in head section

### Step 7: Update templates/error.html
- [x] Add AdSense script tag in head section

## ✅ All Tasks Completed
AdSense verification code has been added to all 6 HTML templates:
1. ✅ templates/index.html
2. ✅ templates/login.html
3. ✅ templates/signup.html
4. ✅ templates/forgot-password.html
5. ✅ templates/reset-password.html
6. ✅ templates/error.html

## Verification
After adding the code:
1. Deploy the changes to pricealerter.in
2. Go to AdSense dashboard
3. Click "Request Review"
4. Google will verify the code is present
5. Approval typically takes 24-48 hours

## Alternative Verification Methods
If the script tag doesn't work, AdSense also supports:
- **HTML file upload**: Upload google-site-verification.html to root
- **DNS TXT record**: Add TXT record to domain DNS
- **Google Analytics**: Link AdSense to existing Analytics property

## Notes
- The existing `static/ads.js` file handles ad loading logic
- This verification code is separate and ensures Google can verify ownership
- Both can coexist without conflict
