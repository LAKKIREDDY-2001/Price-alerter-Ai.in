# Error Fix Plan: "Failed to connect to server: The string did not match the expected pattern"

## Problem Analysis

The error occurs in `static/script.js` in the `handleFlow()` function when calling the `/get-price` endpoint. The error message "The string did not match the expected pattern" suggests a URL validation or pattern matching issue.

### Root Causes Identified:

1. **URL Pattern Matching in `get_site_info()` function** - The function uses string containment checks that could fail with malformed URLs
2. **URL encoding issues** - Special characters in URLs may not be properly encoded
3. **Input validation in `parse_price()`** - The regex pattern could fail on certain price formats
4. **Test mode URL handling** - The `test://` URL pattern may not be properly handled

### Files to be Modified:

1. `static/script.js` - Fix error handling and URL validation
2. `app.py` - Fix `get_site_info()`, `parse_price()`, and add better error messages

## Plan

### Step 1: Fix `app.py` - Improve URL validation and error handling

**Changes:**
1. Add proper URL validation in `get_price()` endpoint
2. Improve `get_site_info()` to handle edge cases
3. Fix `parse_price()` to handle more price formats
4. Add better error messages that don't reveal internal patterns

### Step 2: Fix `static/script.js` - Improve error handling

**Changes:**
1. Add better error handling for the fetch request
2. Add URL validation before sending
3. Improve the error message display
4. Add timeout handling

## Implementation Details

### 1. In `app.py`:

```python
# Add URL validation at the start of get_price()
@app.route('/get-price', methods=['POST'])
def get_price():
    data = request.json
    url = data.get('url')
    
    # Validate URL format
    if not url:
        return jsonify({"error": "URL is required"}), 400
    
    # Check URL format using simple validation
    if not isinstance(url, str):
        return jsonify({"error": "Invalid URL format"}), 400
    
    # Test mode - return mock price for testing
    if url.startswith('test://') or url.startswith('TEST://'):
        import random
        mock_price = round(random.uniform(10, 500), 2)
        return jsonify({
            "price": mock_price,
            "currency": "USD",
            "currency_symbol": "$",
            "productName": "Test Product",
            "isTestMode": True
        })
    
    # Validate URL structure
    if not (url.startswith('http://') or url.startswith('https://')):
        return jsonify({
            "error": "Invalid URL. URL must start with http:// or https://"
        }), 400
    
    # Rest of the existing code...
```

### 2. In `static/script.js`:

```javascript
async function handleFlow() {
    const urlInput = document.getElementById('urlInput');
    const priceStep = document.getElementById('priceStep');
    const mainBtn = document.getElementById('mainBtn');
    
    if (!urlInput) {
        showToast('error', 'URL input element not found');
        return;
    }
    
    let url = urlInput.value.trim();
    
    if (!url) {
        showToast('error', 'Please enter a URL');
        return;
    }
    
    // Validate URL format
    if (!url.startsWith('http://') && !url.startsWith('https://') && 
        !url.startsWith('test://') && !url.startsWith('TEST://')) {
        // Auto-fix common URL issues
        if (url.startsWith('www.')) {
            url = 'https://' + url;
        } else if (url.includes('.') && !url.includes(' ')) {
            url = 'https://' + url;
        } else {
            showToast('error', 'Invalid URL format. Please enter a valid URL');
            return;
        }
        urlInput.value = url;
    }
    
    // Rest of the existing code...
}
```

## Files to be edited:

1. `/Users/lakkireddyvenkatamadhavareddy/price alerter/app.py`
2. `/Users/lakkireddyvenkatamadhavareddy/price alerter/static/script.js`

## Testing:

After implementing the fixes, test with:
1. Valid product URLs (Amazon, Flipkart, Myntra, etc.)
2. Invalid URLs
3. Test mode URLs (test://product)
4. URLs with special characters

## Expected Outcome:

The error "Failed to connect to server: The string did not match the expected pattern" should be replaced with more descriptive error messages like:
- "Invalid URL format. Please enter a valid URL"
- "URL must start with http:// or https://"
- "Test mode activated"
- Proper error messages from the server

