import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize the Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def analyze_code_with_ai(query: str, code: str = ""):
    try:
        # We use llama-3.3-70b-versatile (very smart and fast)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are DevScope AI. You only respond in valid JSON format."
                },
                {
                    "role": "user",
                    "content": f"""
                    Analyze this:
                    Query: {query}
                    Code: {code}

                    Return ONLY JSON with these keys: 
                    "output", "code", "complexity", "maintainability", "security", "issue_count"
                    """
                }
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"} # Forces the AI to give us JSON
        )

        # Parse the response
        return json.loads(chat_completion.choices[0].message.content)

    except Exception as e:
        print(f"❌ GROQ ERROR: {e}")
        return {
            "output": "The AI engine is temporarily busy. Please try again.",
            "code": code if code else "print('System Ready')",
            "complexity": "O(1)",
            "maintainability": "N/A",
            "security": "N/A",
            "issue_count": 0
        }