import os
import json
from fastapi import FastAPI, Form, File, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database as db
import analyzer 

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def get_db():
    session = db.SessionLocal()
    try: yield session
    finally: session.close()

@app.post("/analyze")
async def analyze_code(query: str = Form(None), file: UploadFile = File(None), context_json: str = Form("[]"), session: Session = Depends(get_db)):
    code_content = ""
    if file:
        content = await file.read()
        code_content = content.decode("utf-8", errors="ignore")

    try:
        context = json.loads(context_json)
    except:
        context = []

    ai_res = await analyzer.analyze_code_with_ai(query or "Hello", code_content, context)

    # Save to Permanent DB
    session.add(db.ChatMessage(role="user", content=query or "System Request"))
    session.add(db.ChatMessage(role="ai", content=ai_res.get("output", "")))
    
    # Commit Graph Data
    try:
        val = ai_res.get("issue_count", 0)
        session.add(db.CodeMetric(
            issue_count=int(val) if str(val).isdigit() else 0,
            complexity=str(ai_res.get("complexity", "N/A")),
            security_score=str(ai_res.get("security", "N/A")),
            maintainability=str(ai_res.get("maintainability", "N/A"))
        ))
    except: pass

    session.commit()
    return ai_res

@app.get("/chat-history")
async def get_chat_history(session: Session = Depends(get_db)):
    return session.query(db.ChatMessage).order_by(db.ChatMessage.timestamp.desc()).limit(30).all()

@app.get("/history")
async def get_history(session: Session = Depends(get_db)):
    records = session.query(db.CodeMetric).order_by(db.CodeMetric.timestamp.desc()).limit(15).all()
    return [{"date": r.timestamp.strftime("%H:%M"), "issues": r.issue_count} for r in reversed(records)]