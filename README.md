<div align="center">

  <br/>

  [![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=34&pause=1000&color=38BDF8&center=true&vCenter=true&width=700&lines=🌌+DevScope+AI;AI+Assistant+for+Developers;Real-time+Code+Intelligence;Ship+Clean.+Ship+Secure.)](https://git.io/typing-svg)

  <br/>

  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=15&pause=2000&color=888888&center=true&vCenter=true&width=700&lines=A+professional-grade+AI+for+code+quality%2C+security%2C+and+complexity+insights." alt="Subtitle"/>

  <br/><br/>

  [![React](https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
  [![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
  [![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-38bdf8?style=for-the-badge&logo=meta&logoColor=white)](https://groq.com)
  [![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
  [![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

  <br/>

</div>

---

## 🚩 The Problem: Code Quality Flies Blind

Most developers write code, push it, and *hope* for the best. Security vulnerabilities, creeping complexity, and silent technical debt only surface during expensive late-stage reviews — or worse, in production.

DevScope AI installs a **real-time intelligence layer** directly into your development workflow:

1. Ask it anything about your code — Big O, maintainability, security gaps
2. Upload any file and get targeted refactoring or debugging analysis
3. Track your technical debt as a *measurable trend* over time — not a gut feeling

**No more flying blind. Your AI co-pilot is always watching.**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Intelligent Analysis** | Real-time feedback on Time Complexity (Big O), Maintainability scores, and Security vulnerabilities |
| 📁 **Smart File Uploads** | Attach `.py`, `.js`, or `.cpp` files with specific refactoring or debugging instructions |
| 📈 **Issue Trend Graph** | Data-driven line chart tracking code issues over time via persistent SQLite |
| 🎨 **Cinematic UI** | Glassmorphism Space Theme with a live starfield, terminal-style interface, and smooth animations |
| ⚡ **Lightning-Fast AI** | Groq LPU inference with Llama 3.3 70B for near-instantaneous responses |

---

## 🏗️ Architecture

```mermaid
graph TD
    subgraph Frontend["🖥️ React Frontend"]
        A[👨‍💻 Developer] -->|Code / File Upload| B[💬 Chat Interface]
        B -->|HTTP POST via Axios| C[⚡ FastAPI Backend]
    end

    subgraph Backend["🧠 Backend Engine"]
        C -->|Prompt Engineering| D[🤖 Groq — Llama 3.3 70B]
        D -->|Analysis Result| E[📊 Issue Scorer]
        E -->|Write Record| F[(SQLite via SQLAlchemy)]
    end

    subgraph Dashboard["📈 Analytics Layer"]
        F -->|Historical Data| G[Recharts Issue Trend Graph]
        D -->|Live Response| H[Terminal Chat Bubbles]
    end

    style D fill:#38bdf8,stroke:#fff,stroke-width:1px,color:#000
    style G fill:#38bdf8,stroke:#fff,stroke-width:1px,color:#000
    style C fill:#009688,stroke:#fff,stroke-width:1px,color:#fff
    style F fill:#003B57,stroke:#aaa,stroke-width:1px,color:#fff
    style A fill:#1e1b4b,stroke:#a5b4fc,stroke-width:1px,color:#fff
    style B fill:#1e293b,stroke:#38bdf8,stroke-width:1px,color:#fff
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React |
| **Backend** | Python 3.8+, FastAPI, Uvicorn |
| **AI Engine** | Groq SDK — Llama 3.3 70B |
| **Database** | SQLite, SQLAlchemy ORM |
| **File Handling** | python-multipart |
| **HTTP Client** | Axios |

---

## 📂 Project Structure

```
devscope-ai/
├── backend/
│   ├── main.py             # FastAPI entry point & API routes
│   ├── analyzer.py         # AI logic & Groq API integration
│   ├── database.py         # SQLite connection & SQLAlchemy models
│   ├── .env                # API keys (environment variables)
│   └── devscope.db         # Auto-generated SQLite database
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatBubble.jsx
│   │   │   ├── CodeWindow.jsx
│   │   │   ├── MetricsBar.jsx
│   │   │   ├── InputArea.jsx
│   │   │   ├── IssueGraph.jsx
│   │   │   └── Starfield.jsx
│   │   ├── App.jsx         # Main logic & state
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Global styles & Tailwind
│   ├── tailwind.config.js
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js v16+ & npm
- A [Groq API key](https://console.groq.com) (free)

---

### 1. Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Create and activate a virtual environment
python -m venv .venv

# Windows
.\.venv\Scripts\activate
# Mac / Linux
source .venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy groq python-dotenv python-multipart
```

**Configure environment variables** — create a `.env` file in `backend/`:

```env
GROQ_API_KEY=your_gsk_key_here
```

**Start the backend:**

```bash
python main.py
# Running at http://localhost:8000
```

---

### 2. Frontend Setup

```bash
# Navigate to the frontend folder
cd ../frontend

# Install dependencies
# (includes axios, recharts, lucide-react, react-syntax-highlighter, framer-motion)
npm install --legacy-peer-deps

# Start the dev server
npm run dev
# Running at http://localhost:5173
```

| Service | URL |
|---|---|
| Frontend UI | `http://localhost:5173` |
| Backend API | `http://localhost:8000` |
| API Docs (Swagger) | `http://localhost:8000/docs` |

---

## 📊 Usage Guide

**💬 Chat** — Type any coding question (e.g. *"Write an optimized quicksort in Python"*) and hit Send. The AI responds with code, complexity analysis, and suggestions.

**📁 Analyze a File** — Click the **Paperclip** icon or the **Upload** icon in the sidebar to attach a `.py`, `.js`, or `.cpp` file. Add specific instructions (e.g. *"Check this for SQL injection"*) and hit Send.

**📈 Analytics** — Click the **Bar Chart** icon in the sidebar to view your issue trend graph — a persistent record of code health over time.

**🔄 Dashboard** — Click the **Grid** icon to reset your current session and start a fresh analysis.

---

## 🤝 Contributing

Contributions that improve the following are especially welcome:

- **Prompt Engineering** — more accurate Big O and security scoring prompts
- **New File Type Support** — extending uploads to `.ts`, `.go`, `.rs`, `.java`
- **Database Adapters** — PostgreSQL support via SQLAlchemy
- **UI Themes** — additional Glassmorphism or terminal-dark variants

Please open an issue before submitting a large PR so we can align on direction.

---

## 📄 License

This project is open source. See [LICENSE](LICENSE) for details.

---

<div align="center">
  <p>Built for developers who care about code quality. ⚡</p>
  <p><i>DevScope AI — Real-time intelligence. Zero compromise.</i></p>
</div>
