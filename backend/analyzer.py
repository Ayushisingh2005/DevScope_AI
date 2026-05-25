import os
import json
import re
import random
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# --- FALLBACK CHAIN SETUP ---
_API_KEYS = [
    os.getenv("GROQ_API_KEY_1"),
    os.getenv("GROQ_API_KEY_2"),
    os.getenv("GROQ_API_KEY_3"),
    os.getenv("GROQ_API_KEY_4"),
    os.getenv("GROQ_API_KEY_5"),
]
API_KEYS = [k for k in _API_KEYS if k]

if not API_KEYS:
    raise RuntimeError("No Groq API keys found. Set GROQ_API_KEY_1 in your .env")

random.shuffle(API_KEYS)
print(f"[DevScope] Loaded {len(API_KEYS)} Groq API key(s).")

def call_groq(messages: list) -> dict:
    last_error = None
    for i, key in enumerate(API_KEYS):
        try:
            client = Groq(api_key=key)
            completion = client.chat.completions.create(
                messages=messages,
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"},
                temperature=0.2
            )
            return json.loads(completion.choices[0].message.content)
        except Exception as e:
            print(f"[DevScope] Key {i+1} failed: {type(e).__name__}: {e}")
            last_error = e
            continue
    raise Exception(f"All {len(API_KEYS)} API keys exhausted. Last error: {last_error}")


async def analyze_code_with_ai(query: str, code: str = "", history: list = None):
    # Greeting bypass
    q_clean = re.sub(r'[^\w\s]', '', query.lower().strip())
    greetings = ["hi", "hello", "hey", "sup", "who are you", "hey dev", "hello dev"]

    if not code and (q_clean in greetings or len(q_clean) < 3):
        return {
            "output": "### 👋 Hi, I'm Dev!\nLogic link is stable. I'm your AI Technical Mentor. How can I help you level up today?",
            "code": None,
            "language": "N/A",
            "issue_count": 0,
            "complexity": "N/A",
            "maintainability": "N/A",
            "security": "N/A"
        }

    try:
        messages = [
            {"role": "system", "content": "You are Dev, a Senior Architect. You MUST respond in JSON. Fields: output, code, language, complexity, maintainability, security, issue_count."}
        ]

        if history:
            messages.extend(history)

        messages.append({"role": "user", "content": f"Query: {query}\nCode: {code}"})

        return call_groq(messages)

    except Exception as e:
        print(f"❌ ALL GROQ KEYS FAILED: {str(e)}")
        return {
            "output": f"### ❌ Neural Sync Failed\n**Error:** `{str(e)}`",
            "code": None,
            "language": "N/A",
            "issue_count": 0,
            "complexity": "N/A",
            "maintainability": "N/A",
            "security": "N/A"
        }