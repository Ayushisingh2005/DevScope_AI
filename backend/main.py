import os
import json
from fastapi import FastAPI, Form, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database as db
import analyzer 

app = FastAPI(title="DevScope AI - Advanced Logic Kernel")

# Configure CORS for Frontend Communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Dependency
def get_db():
    session = db.SessionLocal()
    try:
        yield session
    finally:
        session.close()

# 1. HEALTH CHECK (Prevents 404 in logs)
@app.get("/")
def home():
    return {
        "status": "DevScope AI Online",
        "kernel": "Llama-3.3-70B",
        "latency_target": "480ms",
        "state": "nominal"
    }

# 2. FAVICON HANDLER (Prevents 404 in logs)
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return None

# 3. MAIN ANALYSIS ENDPOINT
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
            code_content = content.decode("utf-8", errors="ignore")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid file encoding")

    # --- BRAIN CONTEXT: Fetch memory from Database ---
    # We fetch last 10 messages to give the AI context of what you just talked about
    recent_msgs = session.query(db.ChatMessage).order_by(db.ChatMessage.timestamp.desc()).limit(10).all()
    
    # Map roles: Groq strictly requires 'assistant' instead of 'ai'
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

    # 4. PERSISTENCE: Save to database
    # Save user message
    session.add(db.ChatMessage(role="user", content=query or "Uploaded file for analysis"))
    
    # Save AI response text
    session.add(db.ChatMessage(role="ai", content=ai_res.get("output", "")))
    
    # Save Graph Metrics
    try:
        # Ensure issue_count is an integer
        raw_issues = ai_res.get("issue_count", 0)
        clean_issues = int(raw_issues) if str(raw_issues).isdigit() else 0
        
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

# 5. CHAT HISTORY (For the 'Restore History' feature)
@app.get("/chat-history")
async def get_chat_history(session: Session = Depends(get_db)):
    # Returns last 30 messages for the frontend to render
    messages = session.query(db.ChatMessage).order_by(db.ChatMessage.timestamp.asc()).all()
    return messages

# 6. GRAPH DATA (For the Recharts Trend)
@app.get("/history")
async def get_history(session: Session = Depends(get_db)):
    # Get last 15 entries to show in the graph
    records = session.query(db.CodeMetric).order_by(db.CodeMetric.timestamp.desc()).limit(15).all()
    return [
        {"date": r.timestamp.strftime("%H:%M"), "issues": r.issue_count} 
        for r in reversed(records)
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)