from openai import OpenAI, APIError, RateLimitError
import time

def validate_api_key(api_key: str) -> str:
    try:
        client = OpenAI(api_key=api_key)
        # Make a minimal API call to test the key
        time.sleep(1)  # Rate limiting protection
        response = client.models.list()
        if response:
            return "valid"
    except RateLimitError:
        return "rate_limited"
    except APIError as e:
        if "invalid api key" in str(e).lower():
            return "invalid"
        return "error"
    except Exception:
        return "error"
