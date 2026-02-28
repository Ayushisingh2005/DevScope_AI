import os
import json
from fastapi import FastAPI, Form, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import database as db
import analyzer 

app = FastAPI(title="DevScope AI - Unified Intelligence")

# CORS (Local development ke liye zaroori hai)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

# --- API ENDPOINTS ---

@app.post("/analyze")
async def analyze_code(query: str = Form(None), file: UploadFile = File(None), session: Session = Depends(get_db)):
    code_content = ""
    if file:
        try:
            content = await file.read()
            code_content = content.decode("utf-8", errors="ignore")
        except:
            raise HTTPException(status_code=400, detail="Invalid file encoding")

    recent_msgs = session.query(db.ChatMessage).order_by(db.ChatMessage.timestamp.desc()).limit(10).all()
    history_context = []
    for m in reversed(recent_msgs):
        api_role = "assistant" if m.role == "ai" else "user"
        history_context.append({"role": api_role, "content": m.content})

    user_msg = db.ChatMessage(role="user", content=query or "Uploaded file for analysis")
    session.add(user_msg)

    ai_res = await analyzer.analyze_code_with_ai(
        query=query or "Perform system check", 
        code=code_content, 
        history=history_context
    )

    session.add(db.ChatMessage(role="ai", content=ai_res.get("output", "")))
    
    try:
        raw_issues = ai_res.get("issue_count", 0)
        clean_issues = int(raw_issues) if str(raw_issues).isdigit() else 0
        session.add(db.CodeMetric(
            issue_count=clean_issues,
            complexity=str(ai_res.get("complexity", "N/A")),
            security_score=str(ai_res.get("security", "N/A")),
            maintainability=str(ai_res.get("maintainability", "N/A"))
        ))
    except: pass

    session.commit()
    return ai_res

@app.get("/chat-history")
async def get_chat_history(session: Session = Depends(get_db)):
    return session.query(db.ChatMessage).order_by(db.ChatMessage.timestamp.asc()).all()

@app.get("/history")
async def get_history(session: Session = Depends(get_db)):
    records = session.query(db.CodeMetric).order_by(db.CodeMetric.timestamp.desc()).limit(15).all()
    return [{"date": r.timestamp.strftime("%H:%M"), "issues": r.issue_count} for r in reversed(records)]

# --- FRONTEND SERVING ---
# Check if 'dist' folder exists (Build ke baad yahan frontend aayega)
frontend_path = os.path.join(os.getcwd(), "dist")

if os.path.exists(frontend_path):
    # Assets (CSS/JS) serve karne ke liye
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_path, "assets")), name="assets")

    # Kisi bhi aur route par index.html return karega (React Router compatibility)
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        return FileResponse(os.path.join(frontend_path, "index.html"))
else:
    @app.get("/")
    def home():
        return {"status": "Backend Live, Frontend build not found. Run npm run build first."}

if __name__ == "__main__":
    import uvicorn
    # Railway assigns a $PORT variable
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)