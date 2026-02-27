import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def analyze_code_with_ai(query: str, code: str = "", history: list = None):
    # 1. IMMEDIATE BYPASS FOR GREETINGS (Guaranteed No Error)
    q = query.lower().strip()
    if not code and q in ["hi", "hello", "hey", "hello?", "hi there", "sup"]:
        return {
            "title": "Neural Greeting",
            "output": "### 👋 Hello! \nI am DevScope AI. I noticed you haven't provided any code yet. Paste a snippet or upload a file to begin a deep architectural audit.",
            "code": None, "issue_count": 0, "complexity": "N/A", "maintainability": "N/A", "security": "N/A"
        }

    try:
        # 2. STRIP HISTORY (Only keep minimal context to avoid overload)
        clean_history = []
        if history:
            for m in history[-2:]: # Only last 2 messages
                content = str(m.get("content", ""))[:200]
                clean_history.append({"role": m["role"], "content": content})

        messages = [{
            "role": "system",
            "content": "You are a Senior Architect. Return ONLY a JSON object. Do not talk outside JSON. "
                       "Fields: title (3 words), output (Markdown, no ticks), code (raw string), "
                       "issue_count (int), complexity, maintainability, security."
        }]
        messages.extend(clean_history)
        messages.append({"role": "user", "content": f"Task: {query}\nCode: {code}"})

        completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
            temperature=0, # Maximum stability
        )
        
        raw_content = completion.choices[0].message.content
        return json.loads(raw_content)

    except Exception as e:
        print(f"System Error: {e}")
        return {
            "title": "System Recovery",
            "output": "### ❌ Neural Sync Error\nThe request was too large for the current buffer. Please use the Dashboard button to clear context.",
            "code": None, "issue_count": 0, "complexity": "N/A", "maintainability": "N/A", "security": "N/A"
        }