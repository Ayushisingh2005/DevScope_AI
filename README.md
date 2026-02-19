## 🌌 DevScope AI
DevScope AI is a professional-grade, full-stack AI assistant designed for developers. It provides deep insights into code quality, security, and complexity. Featuring a high-end Glassmorphism "Space Theme" UI, it allows developers to query functions, upload files, and track their "Technical Debt" over time.

# ✨ Features

🔍 Intelligent Analysis: Get real-time feedback on Time Complexity (Big O), Maintainability scores, and Security vulnerabilities.
📁 Smart File Uploads: Attach code files and provide specific instructions for refactoring or debugging.
📈 Issue Trend Graph: A data-driven line chart that tracks code issues over time using a persistent SQLite database.
🎨 Cinematic UI: A responsive React dashboard featuring a moving starfield background, glassmorphism components, and a terminal-style interface.
⚡ Lightning Fast AI: Powered by the Groq Llama 3 engine for near-instantaneous responses.
 
 ## 🛠️ Tech Stack
Frontend: React.js, Vite, Tailwind CSS, Recharts (Data Viz), Framer Motion (Animations), Lucide React (Icons).
Backend: Python, FastAPI, SQLAlchemy (ORM), Uvicorn.
Database: SQLite (Lightweight, file-based persistence).
AI Engine: Groq SDK (Llama 3.3 70B Model).

```
📂 File Directory Structure
code
Text
devscope-ai/
├── backend/
│   ├── main.py             # FastAPI entry point & API routes
│   ├── analyzer.py         # AI Logic & Groq API integration
│   ├── database.py         # SQLite connection & SQLAlchemy models
│   ├── .env                # API Keys (Environment Variables)
│   └── devscope.db         # Generated SQLite database file
├── frontend/
│   ├── src/
│   │   ├── components/     # Modular UI Components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatBubble.jsx
│   │   │   ├── CodeWindow.jsx
│   │   │   ├── MetricsBar.jsx
│   │   │   ├── InputArea.jsx
│   │   │   ├── IssueGraph.jsx
│   │   │   └── Starfield.jsx
│   │   ├── App.jsx         # Main Logic & State
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Global styles & Tailwind
│   ├── tailwind.config.js
│   ├── package.json
│   └── vite.config.js
└── README.md
```

🚀 Installation & Setup
1. Prerequisites
Python 3.8+
Node.js (v16+) & npm
Groq API Key (Get it free at console.groq.com)

2. Backend Setup
code
```
# Navigate to backend folder
cd backend
```

# Create a virtual environment
```
python -m venv .venv

# Activate virtual environment
# On Windows:
.\.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate
```

# Install dependencies
```
pip install fastapi uvicorn sqlalchemy groq python-dotenv python-multipart
```
Configure Backend Environment Variables:
Create a .env file in the backend/ directory:
```
Text
GROQ_API_KEY=your_gsk_key_here
```
3. Frontend Setup
```
Bash
# Navigate to frontend folder
cd ../frontend
```
# Install dependencies
```
npm install --legacy-peer-deps
```

# Dependencies include: axios, recharts, lucide-react, react-syntax-highlighter, framer-motion
🏃 Running the Project
```
Start the Backend
cd backend
python main.py
The backend will start on http://localhost:8000
Start the Frontend

Bash
cd frontend
npm run dev
The frontend will start on http://localhost:5173
```
📊 Usage
Chat: Type a coding question like "Write an optimized quicksort in Python" and hit Send.
Analyze File: Click the Paperclip icon or the Upload icon in the sidebar to attach a .py, .js, or .cpp file. Type specific instructions (e.g., "Check this for SQL injection") and hit Send.
Analytics: Click the Bar Chart icon in the sidebar to scroll down and view your code issue trends.
Dashboard: Click the Grid icon to reset your current session.

