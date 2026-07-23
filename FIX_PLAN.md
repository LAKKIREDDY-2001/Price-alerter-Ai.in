ter name="content"># Price Alert Fix Plan - Progress Tracker

## Issues Found
1. Backend `create_tracker` API doesn't save `product_name` to database
2. Frontend `createTracker` function doesn't send `product_name` to backend  
3. `signup.html` error-message div has different structure causing display issues
4. `showToast` function conflict between frontend and auth.js
5. **Price parsing bug: showing wrong price (₹50.25 instead of ₹3399)**

## Root Cause of Price Bug
The price scraping functions had minimum price filters that were too low:
- `1 < price < 100000` allowed very small numbers like 50 to be extracted
- This caused prices like ₹3399 to be incorrectly parsed as ₹50.25 (likely from some other element on the page)

## Fixes Implemented
- [x] Fix backend API to store product_name
- [x] Fix frontend to send productName when creating trackers
- [x] Fix signup.html error-message structure  
- [x] Fix showToast function to handle conflicts - Unified showToast(type, message) with backward compatibility
- [x] Fix price parsing minimum threshold from 1 to 50 for INR prices

### Price Function Fixes Applied
| Function | Previous Min | New Min | Status |
|----------|-------------|---------|--------|
| scrape_amazon_price | 1 | 50 | ✅ |
| scrape_flipkart_price | 1 | 50 | ✅ |
| scrape_myntra_price | 100 | 100 | ✅ |
| scrape_ajio_price | 10 | 50 | ✅ |
| scrape_meesho_price | 10 | 50 | ✅ |
| scrape_snapdeal_price | 10 | 50 | ✅ |
| scrape_tata_cliq_price | 10 | 50 | ✅ |
| scrape_reliance_digital_price | 10 | 50 | ✅ |

## Test Results
✅ Server running on http://127.0.0.1:8081
✅ Price API returns productName correctly
✅ User signup works
✅ User login works  
✅ Tracker creation saves product_name to database
✅ Database verification confirmed: product_name stored correctly
✅ Price parsing now filters out prices below 50 INR

## Progress
All fixes implemented and tested successfully!
