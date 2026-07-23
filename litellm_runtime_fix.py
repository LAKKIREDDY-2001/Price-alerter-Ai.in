"""
LiteLLM Runtime Fix Module
===========================
Import this before using litellm to prevent tool ID errors.

Usage:
    from litellm_runtime_fix import fix_litellm
    fix_litellm()
"""

import litellm

def fix_litellm():
    """
    Apply fixes to prevent tool ID errors in LiteLLM.
    Call this before any litellm operations.
    """
    # Disable retries to prevent fallback chain issues
    try:
        litellm.disable_retries = True
        litellm.max_retries = 0
    except Exception:
        pass
    
    # Disable verbose logging
    try:
        litellm.set_verbose = False
    except Exception:
        pass
    
    # Disable caching
    try:
        litellm.cache = None
    except Exception:
        pass
    
    # Disable model groups to prevent mapping issues
    try:
        litellm.use_standard_model_group = False
    except Exception:
        pass
    
    print("✓ LiteLLM runtime fix applied")

# Apply fixes on import
fix_litellm()
