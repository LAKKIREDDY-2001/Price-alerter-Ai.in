# LiteLLM/OpenRouter Error Fix - Quick Reference

## The Error
```
400 litellm.BadRequestError: OpenrouterException - {
  "error": {
    "message": "invalid params, tool result's tool id(call_function_xhvw1fxcya38_3) not found (2013)"
  }
}
No fallback model
```

## Root Cause
The error is from **VSCode/BlackboxAI MCP system**, NOT your Flask app. The MCP server is:
1. Trying to use "Minimax" provider which is failing
2. No fallback model is configured
3. Tool ID references are stale/expired

## Your Flask App Status
✅ **Working perfectly!** - No changes needed to app.py

## Fix (Choose ONE Option)

### Option 1: Quick Environment Fix
Run this in terminal:
```bash
export LITELLM_DISABLE_RETRIES=True
export LITELLM_MAX_RETRIES=0
export LITELLM_LOG_LEVEL=ERROR
export DISABLE_MINIMAX=true
export LITELLM_MODEL="openai/gpt-4o-mini"
```

### Option 2: VSCode Settings
Add to VSCode settings (`Cmd+,` → Search "MCP"):
```json
{
  "mcpServers": {
    "custom": {
      "command": "python",
      "args": ["-m", "litellm", "--model", "openai/gpt-4o-mini"],
      "env": {
        "LITELLM_LOG_LEVEL": "ERROR",
        "LITELLM_DISABLE_RETRIES": "true",
        "LITELLM_MAX_RETRIES": "0",
        "DISABLE_MINIMAX": "true"
      }
    }
  }
}
```

### Option 3: Use Created Config Files
```bash
# Source the environment fix
source "/Users/lakkireddyvenkatamadhavareddy/price alerter/.env.litellm_fix"
```

## Created Fix Files
| File | Purpose |
|------|---------|
| `.env.litellm_fix` | Environment variables |
| `litellm_config.yaml` | Model configuration |
| `mcp_config_fixed.json` | MCP server config |
| `LITELLM_ERROR_FIX.py` | Fix script |
| `LITELLM_ERROR_FIX_README.md` | Full documentation |

## Test Your Flask App
```bash
cd "/Users/lakkireddyvenkatamadhavareddy/price alerter"
python3 -c "from app import app, init_db; init_db(); print(app.test_client().post('/get-price', json={'url': 'test://product'}).get_json())"
```

Expected: `{'price': <float>, 'currency': 'USD', ...}`

## Next Steps
1. Apply one fix option above
2. Restart VSCode
3. Error should be resolved ✅

