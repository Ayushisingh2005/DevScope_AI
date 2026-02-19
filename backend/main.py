import os
from fastapi import FastAPI, Form, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database as db
import analyzer  # Import the module we created for OpenAI logic

# Initialize FastAPI app
app = FastAPI(title="DevScope AI Backend")

# 1. Configure CORS (Cross-Origin Resource Sharing)
# This allows your React frontend (usually on port 5173) to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Database Dependency
# This ensures every request gets a fresh database connection
def get_db():
    session = db.SessionLocal()
    try:
        yield session
    finally:
        session.close()

# 3. ANALYSIS ENDPOINT
# Handles both text queries and file uploads
@app.post("/analyze")
async def analyze_code(
    query: str = Form(None), 
    file: UploadFile = File(None), 
    session: Session = Depends(get_db)
):
    code_content = ""
    
    # If a file was uploaded, read its content
    if file:
        try:
            content = await file.read()
            code_content = content.decode("utf-8")
        except Exception as e:
            raise HTTPException(status_code=400, detail="Could not read file content")
    
    # Ensure there is something to analyze
    if not query and not code_content:
        raise HTTPException(status_code=400, detail="No query or code provided")

    # CALL THE AI ANALYZER (analyzer.py)
    # This sends the data to OpenAI and returns structured JSON
    try:
        ai_response = await analyzer.analyze_code_with_ai(
            query=query or "Analyze this code for quality and security.",
            code=code_content
        )

        # SAVE THE RESULTS TO SQLITE
        # This data powers the "Issue Trend" graph on the frontend
        new_record = db.CodeMetric(
            issue_count=ai_response.get("issue_count", 0),
            complexity=ai_response.get("complexity", "N/A"),
            security_score=ai_response.get("security", "N/A"),
            maintainability=ai_response.get("maintainability", "N/A")
        )
        session.add(new_record)
        session.commit()

        return ai_response

    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail="Internal AI Analysis Error")

# 4. HISTORY ENDPOINT
# Used by Recharts to display the graph
@app.get("/history")
async def get_history(session: Session = Depends(get_db)):
    try:
        # Fetch the last 15 analysis records to show the trend
        records = session.query(db.CodeMetric).order_by(db.CodeMetric.timestamp.desc()).limit(15).all()
        
        # Format for Recharts: { date: "12:30", issues: 5 }
        data = [
            {
                "date": r.timestamp.strftime("%H:%M"), 
                "issues": r.issue_count
            } for r in reversed(records)
        ]
        return data
    except Exception as e:
        return []

# 5. HEALTH CHECK
@app.get("/")
def home():
    return {"status": "DevScope AI Backend is Online"}

# To run: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)