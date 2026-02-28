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

                STRICT AUDIT & SCORING RULES:
                1. EVALUATION TARGET (CRITICAL): You must evaluate the USER'S ORIGINAL CODE for the 'issue_count', 'complexity', 'maintainability', and 'security' fields. 
                2. METRIC CONSISTENCY:
                   - If issue_count > 5: Security MUST be 'Critical'. Never say 'Secure'.
                   - If issue_count > 5: Maintainability MUST be '3/10' or lower. 
                   - The JSON metrics MUST reflect the POOR QUALITY of the original input code.
                3. REFACTORING: Even though you are scoring the "bad" code, you MUST still provide the improved/fixed version in the 'code' field.
                4. SCORING SCALE:
                   - +5 for Major Security Risks (SQL Injection, Hardcoded Secrets, etc).
                   - +2 for lack of Error Handling (try/except).
                   - +1 for every logic flaw or naming issue.
                5. NO CODE IN OUTPUT: Never use triple backticks (```) in the 'output' field. Use Markdown headers and bullets only.

                RESPONSE FORMAT:
                {
                  "output": "Markdown explanation of why the original code is dangerous/inefficient.",
                  "code": "The fully optimized and refactored version",
                  "language": "python/java/etc",
                  "complexity": "O(n) / N/A",
                  "maintainability": "Score/10 (Must be low if issues are high)",
                  "security": "Critical / Risky / Secure",
                  "issue_count": 12
                }"""
            }
        ]

        if history:
            messages.extend(history[-8:])

        user_payload = f"User Request: {query}"
        if code:
            user_payload += f"\n\nAttached Code for Audit:\n{code}"
        
        messages.append({"role": "user", "content": user_payload})

        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
            temperature=0.2 
        )
        
        return json.loads(chat_completion.choices[0].message.content)

    except Exception as e:
        print(f"❌ ANALYZER ERROR: {e}")
        return {
            "output": "Neural link unstable. Please retry.",
            "code": None, "language": "N/A", "issue_count": 0, "complexity": "N/A", "maintainability": "N/A", "security": "N/A"
        }