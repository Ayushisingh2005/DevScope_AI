import os
import json
from fastapi import FastAPI, Form, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database as db
import analyzer 

app = FastAPI(title="DevScope AI - Separate Kernel")

# 1. CONFIGURE CORS
# Crucial for Port 5173 (Frontend) to communicate with Port 8000 (Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. DATABASE DEPENDENCY
def get_db():
    session = db.SessionLocal()
    try:
        yield session
    finally:
        session.close()

# 3. HEALTH CHECK
@app.get("/")
def home():
    return {"status": "DevScope AI Backend is Online", "kernel": "Llama-3.3-70B"}

# 4. MAIN ANALYSIS ENDPOINT
@app.post("/analyze")
async def analyze_code(
    query: str = Form(None), 
    file: UploadFile = File(None), 
    session: Session = Depends(get_db)
):
    code_content = ""
    
    # Handle File Upload
    if file:
        try:
            content = await file.read()
            # errors="ignore" prevents crash on binary or non-utf8 files
            code_content = content.decode("utf-8", errors="ignore")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid file encoding")

    # --- BRAIN CONTEXT: Fetch memory from Database ---
    # Fetch last 10 messages for short-term memory
    recent_msgs = session.query(db.ChatMessage).order_by(db.ChatMessage.timestamp.desc()).limit(10).all()
    
    # Role Mapping: Convert our DB role 'ai' to Groq's required 'assistant'
    history_context = []
    for m in reversed(recent_msgs):
        api_role = "assistant" if m.role == "ai" else "user"
        history_context.append({"role": api_role, "content": m.content})

    # Call AI Analyzer (Groq Llama 3.3)
    ai_res = await analyzer.analyze_code_with_ai(
        query=query or "Perform system check", 
        code=code_content, 
        history=history_context
    )

    # --- 5. PERSISTENCE LOGIC ---
    
    # Always save the User Query
    session.add(db.ChatMessage(role="user", content=query or "Uploaded file for analysis"))
    
    # Always save the AI Response
    session.add(db.ChatMessage(role="ai", content=ai_res.get("output", "")))
    
    # SMART METRICS: Only save to Graph if actual code logic was processed
    # This prevents '0' value clutter when you are just saying 'Hi' or asking questions
    is_code_analysis = ai_res.get("code") is not None or (ai_res.get("complexity") and ai_res.get("complexity") != "N/A")
    
    if is_code_analysis:
        try:
            raw_issues = ai_res.get("issue_count", 0)
            # Validation to ensure issue_count is an integer for Recharts
            clean_issues = int(raw_issues) if str(raw_issues).isdigit() else 0
            
            session.add(db.CodeMetric(
                issue_count=clean_issues,
                complexity=str(ai_res.get("complexity", "N/A")),
                security_score=str(ai_res.get("security", "N/A")),
                maintainability=str(ai_res.get("maintainability", "N/A"))
            ))
        except Exception as e:
            print(f"⚠️ Metric Save Warning: {e}")

    # Final commit for all changes
    session.commit()
    return ai_res

# 5. CHAT HISTORY: Used by the sidebar 'History' button
@app.get("/chat-history")
async def get_chat_history(session: Session = Depends(get_db)):
    # Returns messages in chronological order (Oldest -> Newest)
    return session.query(db.ChatMessage).order_by(db.ChatMessage.timestamp.asc()).all()

# 6. GRAPH DATA: Used by Recharts component
@app.get("/history")
async def get_history(session: Session = Depends(get_db)):
    # Fetch last 15 points to show the trend
    records = session.query(db.CodeMetric).order_by(db.CodeMetric.timestamp.desc()).limit(15).all()
    # Reverse so that time moves from left to right on the graph
    return [
        {"date": r.timestamp.strftime("%H:%M"), "issues": r.issue_count} 
        for r in reversed(records)
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)