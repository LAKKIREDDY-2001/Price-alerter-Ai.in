# LiteLLM/MCP Error Fix Guide

## Error
```
400 litellm.BadRequestError: OpenrouterException - {"error":{"message":"Provider returned error","code":400,"metadata":{"raw":"{\"type\":\"error\",\"error\":{\"type\":\"bad_request_error\",\"message\":\"invalid params, tool result's tool id(call_function_cb1ovh93rd7p_3) not found (2013)\",\"http_code\":\"400\"},\"request_id\":\"05b1c7492158389462309a814ca3fd48\"}","provider_name":"Minimax"}},"user_id":"user_2dvySw1JqTZzABYD4OncxXptEmq"}
No fallback model group found for original model_group=openrouter/minimax-m2.
```

## Root Cause
The VSCode/BlackboxAI MCP configuration is using `openrouter/minimax-m2` which is:
1. Not available or has invalid parameters
2. The tool result's tool ID is not found (state synchronization issue)
3. No proper fallback is configured

## Solution

### Step 1: Delete the Problematic Item
The `openrouter/minimax-m2` model is causing errors. Delete it from your MCP configuration.

### Step 2: Update VSCode Settings
Add this to your VSCode settings (`Cmd+,` then search for "MCP"):

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
        "OPENROUTER_API_KEY": "${env:OPENROUTER_API_KEY}"
      }
    }
  }
}
```

### Step 3: Restart VSCode
After updating settings, restart VSCode completely (Cmd+Q, then reopen).

## Fixed Configuration Files
- **MCP Config**: `/Users/lakkireddyvenkatamadhavareddy/price alerter/mcp_config_fixed.json`
- **LiteLLM Config**: `/Users/lakkireddyvenkatamadhavareddy/price alerter/litellm_config.yaml`

## Host Link for Configuration
To apply the fix, use this configuration file path:

```
file:///Users/lakkireddyvenkatamadhavareddy/price%20alerter/mcp_config_fixed.json
```

Or copy the content directly from:
```
/Users/lakkireddyvenkatamadhavareddy/price alerter/mcp_config_fixed.json
```

## Environment Variables
Make sure these are set in your `.env` or shell profile:
```bash
export OPENROUTER_API_KEY="your-api-key-here"
export LITELLM_LOG_LEVEL="ERROR"
export LITELLM_DISABLE_RETRIES="true"
export LITELLM_MAX_RETRIES="0"
```

## Your Flask App Status
✅ Your Flask price alerter app (`/Users/lakkireddyvenkatamadhavareddy/price alerter/app.py`) is working correctly!
- The error is from VSCode MCP system, NOT your Flask app
- All routes (/get-price, /dashboard, /login, etc.) are functional
- Database and authentication are properly configured

