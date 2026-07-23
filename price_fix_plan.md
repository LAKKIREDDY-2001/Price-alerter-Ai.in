# Price Display Fix Plan

## Issues Identified

### 1. Amazon Price Bug (Critical)
**File**: `app.py`, `scrape_amazon_price` function
**Problem**: Line removes dots incorrectly: `price_str.replace(".", "")`
- This breaks prices like "1,299.00" → "129900" instead of "1299.00"

### 2. Flipkart MRP vs Selling Price
**File**: `app.py`, `scrape_flipkart_price` function
**Problem**: Sometimes picks MRP (higher price) instead of selling price

### 3. Price Format Parsing Issues
**File**: `app.py` - Multiple scrapers
**Problem**: Inconsistent handling of currency symbols, commas, and decimal points

### 4. Better Price Extraction Strategy
**Solution**: Use more robust selectors and fallback mechanisms

## Fixes to Implement

### Fix 1: Correct Amazon Price Parsing
```python
# Before (buggy):
price_str = whole.get_text().strip().replace(",", "").replace(".", "")

# After (fixed):
price_str = whole.get_text().strip().replace(",", "")
```

### Fix 2: Enhanced Flipkart Selling Price Detection
- Prioritize JSON-LD structured data (most reliable)
- Look for "lowPrice" field in structured data
- Skip MRP prices and focus on selling price elements
- Add better filtering for price context

### Fix 3: Unified Price Parsing Function
Create a helper function for consistent price extraction:
```python
def parse_price(price_str, currency_symbol):
    """Parse price string to float, handling various formats"""
    # Remove currency symbols and extra whitespace
    # Handle commas as thousand separators
    # Handle decimal points correctly
```

### Fix 4: Improved Selectors for All Sites
- Amazon: Add more selectors for modern layout
- Flipkart: Prioritize `div._30jeq3._16Jk6d` (selling price)
- Myntra: Better handling of discounted prices
- Ajio: Updated selectors for new layout
- Meesho: Better price element detection
- Snapdeal: Improved selectors
- Tata CLiQ: Updated price selectors
- Reliance Digital: Better selectors

### Fix 5: Better Debug Logging
Add detailed logging to help identify which selector found the price

## Implementation Order

1. Fix Amazon price parsing bug (highest impact)
2. Create unified `parse_price` helper function
3. Improve Flipkart selling price detection
4. Update all scrapers to use consistent parsing
5. Add better debug output

## Testing
- Test with sample product URLs from each site
- Verify prices match exactly what's shown on the product page
- Check that selling prices are correctly identified (not MRP)

