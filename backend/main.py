import os
import json
import re  # Robust number parsing ke liye
from fastapi import FastAPI, Form, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database as db
import analyzer 

app = FastAPI(title="DevScope AI - Unified Kernel")

# 1. CONFIGURE CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    session = db.SessionLocal()
    try:
        yield session
    finally:
        session.close()

# 2. HEALTH CHECK
@app.get("/")
def home():
    return {"status": "DevScope AI Online", "kernel": "Llama-3.3-70B"}

# 3. MAIN ANALYSIS ENDPOINT
@app.post("/analyze")
async def analyze_code(
    query: str = Form(None), 
    file: UploadFile = File(None), 
    session: Session = Depends(get_db)
):
    code_content = ""
    if file:
        try:
            content = await file.read()
            code_content = content.decode("utf-8", errors="ignore")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid file encoding")

    # Fetch last 10 messages for short-term memory
    recent_msgs = session.query(db.ChatMessage).order_by(db.ChatMessage.timestamp.desc()).limit(10).all()
    
    # Role Mapping: Groq strictly requires 'assistant' instead of 'ai'
    history_context = []
    for m in reversed(recent_msgs):
        api_role = "assistant" if m.role == "ai" else "user"
        history_context.append({"role": api_role, "content": m.content})

    # Call AI Analyzer
    ai_res = await analyzer.analyze_code_with_ai(
        query=query or "Perform system check", 
        code=code_content, 
        history=history_context
    )

    # 4. PERSISTENCE: Save Chat
    session.add(db.ChatMessage(role="user", content=query or "Uploaded file for analysis"))
    session.add(db.ChatMessage(role="ai", content=ai_res.get("output", "")))
    
    # 5. SMART METRICS: Parsing and Safety Overrides
    is_code_analysis = ai_res.get("code") is not None or (ai_res.get("complexity") and ai_res.get("complexity") != "N/A")
    
    if is_code_analysis:
        try:
            raw_issues = ai_res.get("issue_count", 0)
            
            # Robust Extraction: find the first number in the string (handles "11 issues" or "11")
            num_match = re.search(r'\d+', str(raw_issues))
            clean_issues = int(num_match.group()) if num_match else 0
            
            # SAFETY OVERRIDE: If AI labels it dangerous but sends 0, force the graph up
            security_label = str(ai_res.get("security", "")).lower()
            if clean_issues == 0 and any(word in security_label for word in ["critical", "risky", "insecure"]):
                clean_issues = 7

            session.add(db.CodeMetric(
                issue_count=clean_issues,
                complexity=str(ai_res.get("complexity", "N/A")),
                security_score=str(ai_res.get("security", "N/A")),
                maintainability=str(ai_res.get("maintainability", "N/A"))
            ))
        except Exception as e:
            print(f"⚠️ Metric Save Warning: {e}")

    session.commit()
    return ai_res

# 6. CHAT HISTORY (For UI Restore)
@app.get("/chat-history")
async def get_chat_history(session: Session = Depends(get_db)):
    return session.query(db.ChatMessage).order_by(db.ChatMessage.timestamp.asc()).all()

# 7. GRAPH DATA (For Recharts)
@app.get("/history")
async def get_history(session: Session = Depends(get_db)):
    # Limit to 15 points for a cleaner visual look
    records = session.query(db.CodeMetric).order_by(db.CodeMetric.timestamp.desc()).limit(15).all()
    return [{"date": r.timestamp.strftime("%H:%M"), "issues": r.issue_count} for r in reversed(records)]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
