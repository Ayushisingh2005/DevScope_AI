import os
import re
from fastapi import FastAPI, Form, File, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database as db
import analyzer

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def get_db():
    session = db.SessionLocal()
    try:
        yield session
    finally:
        session.close()

@app.get("/")
def home():
    key_exists = "Found" if os.getenv("GROQ_API_KEY_1") else "MISSING"
    return {"status": "Online", "api_key": key_exists}

@app.post("/analyze")
async def analyze_code(query: str = Form(None), file: UploadFile = File(None), session: Session = Depends(get_db)):
    code_content = ""
    if file:
        content = await file.read()
        code_content = content.decode("utf-8", errors="ignore")

    recent_msgs = session.query(db.ChatMessage).order_by(db.ChatMessage.timestamp.desc()).limit(5).all()
    history_context = []
    for m in reversed(recent_msgs):
        role = "assistant" if m.role == "ai" else "user"
        history_context.append({"role": role, "content": m.content})

    ai_res = await analyzer.analyze_code_with_ai(query or "Analyze", code_content, history_context)

    session.add(db.ChatMessage(role="user", content=query or "Analysis Request"))
    session.add(db.ChatMessage(role="ai", content=ai_res.get("output", "")))

    if ai_res.get("code") or ai_res.get("complexity") != "N/A":
        try:
            num_match = re.search(r'\d+', str(ai_res.get("issue_count", 0)))
            clean_issues = int(num_match.group()) if num_match else 0
            session.add(db.CodeMetric(
                issue_count=clean_issues,
                complexity=str(ai_res.get("complexity", "N/A")),
                security_score=str(ai_res.get("security", "N/A")),
                maintainability=str(ai_res.get("maintainability", "N/A"))
            ))
        except:
            pass

    session.commit()
    return ai_res

@app.get("/chat-history")
async def get_chat_history(session: Session = Depends(get_db)):
    return session.query(db.ChatMessage).order_by(db.ChatMessage.timestamp.asc()).all()

@app.get("/history")
async def get_history(session: Session = Depends(get_db)):
    records = session.query(db.CodeMetric).order_by(db.CodeMetric.timestamp.desc()).limit(15).all()
    return [{"date": r.timestamp.strftime("%H:%M"), "issues": r.issue_count} for r in reversed(records)]