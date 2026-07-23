#!/bin/bash
# Diagnostic Script for LiteLLM/OpenRouter Error
# Run this to diagnose and fix the issue

echo "=========================================="
echo "LiteLLM/OpenRouter Error Diagnostic"
echo "=========================================="
echo ""

echo "1. Checking Python environment..."
python3 --version
echo ""

echo "2. Checking litellm installation..."
python3 -c "import litellm; print(f'LiteLLM version: {litellm.__version__}')" 2>/dev/null || echo "LiteLLM not installed"
echo ""

echo "3. Checking environment variables..."
echo "LITELLM_DISABLE_RETRIES: ${LITELLM_DISABLE_RETRIES:-not set}"
echo "LITELLM_MAX_RETRIES: ${LITELLM_MAX_RETRIES:-not set}"
echo "LITELLM_LOG_LEVEL: ${LITELLM_LOG_LEVEL:-not set}"
echo ""

echo "4. Checking OpenRouter API key..."
if [ -z "$OPENROUTER_API_KEY" ]; then
    echo "⚠️  OPENROUTER_API_KEY not set"
else
    echo "✓ OPENROUTER_API_KEY is set"
fi
echo ""

echo "5. Testing Flask app..."
cd /Users/lakkireddyvenkatamadhavareddy/price\ alerter
python3 -c "
from app import app, init_db
init_db()
client = app.test_client()
resp = client.post('/get-price', json={'url': 'test://product'}, content_type='application/json')
print(f'Flask app test: {resp.status_code}')
print(f'Response: {resp.get_json()}')
"
echo ""

echo "=========================================="
echo "DIAGNOSTIC COMPLETE"
echo "=========================================="
