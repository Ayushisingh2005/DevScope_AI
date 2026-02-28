import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def analyze_code_with_ai(query: str, code: str = "", history: list = None):
    try:
        messages = [
            {
                "role": "system",
                "content": """You are 'Dev', an elite Technical Mentor and Senior Software Architect. 

                CORE BEHAVIOR:
                1. LAYERED DEPTH: When asked a technical question (e.g., 'What is AI SEO?'), you must provide a LONG, deep, and structured response. 
                   - Use '### 🚀 Section Title' for headers.
                   - Use '**Bold**' for emphasis.
                   - Break down the answer into at least 3 sections: [Overview], [Key Technical Pillars], and [Strategic Impact].
                
                2. NO HALLUCINATED CODE: Do NOT invent code. 
                   - If the user DID NOT provide code and DID NOT ask for a snippet, set the 'code' field to null. 
                   - Do not provide 'example' code unless specifically asked (e.g., 'give me an example').
                
                3. METRICS LOGIC: 
                   - If chatting: Complexity/Maintainability/Security = "N/A", issue_count = 0.
                   - If auditing code: Provide real technical metrics.

                4. JSON ONLY: Always respond in valid JSON.
                {
                  "output": "Long-form Markdown content with headers and lists. (NO triple backticks here)",
                  "code": "Source code or null",
                  "language": "python/java/etc or N/A",
                  "complexity": "O(n) / N/A",
                  "maintainability": "8/10 / N/A",
                  "security": "Secure / N/A",
                  "issue_count": 0
                }"""
            }
        ]

        if history:
            # We take more history now for better context
            messages.extend(history[-8:])

        user_payload = f"User Request: {query}"
        if code:
            user_payload += f"\n\nAttached Code for Audit:\n{code}"
        
        messages.append({"role": "user", "content": user_payload})

        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
            temperature=0.6 # <--- INCREASED for detailed, layered writing
        )
        
        return json.loads(chat_completion.choices[0].message.content)

    except Exception as e:
        print(f"❌ ANALYZER ERROR: {e}")
        return {
            "output": "My neural link is currently unstable. Please try again.",
            "code": None, "language": "N/A", "issue_count": 0, "complexity": "N/A", "maintainability": "N/A", "security": "N/A"
        }