import asyncio
import analyzer
from dotenv import load_dotenv
import os

load_dotenv()

async def test():
    print("--- Starting AI Integration Test ---")
    print(f"API Key found: {'Yes' if os.getenv('OPENAI_API_KEY') else 'No'}")
    
    query = "Write a hello world function in Python"
    
    print(f"\nSending Query: {query}")
    try:
        result = await analyzer.analyze_code_with_ai(query, "")
        print("\n✅ AI RESPONSE RECEIVED:")
        print(f"Output: {result.get('output')}")
        print(f"Complexity: {result.get('complexity')}")
        print(f"Security: {result.get('security')}")
    except Exception as e:
        print(f"\n❌ AI INTEGRATION FAILED:")
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test())