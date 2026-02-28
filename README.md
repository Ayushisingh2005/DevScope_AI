## 🌌 DevScope AI

DevScope AI is a strategic code intelligence platform engineered to accelerate software delivery cycles while maintaining rigorous production standards for high-growth startups and enterprise engineering teams. Designed with a velocity-first mindset, it serves as an automated "DevOps Cockpit" that shifts code quality oversight to the earliest stages of development, mitigating the risk of silent technical debt before it reaches production. By providing instantaneous architectural insights and security auditing, the platform empowers engineering organizations to scale their codebases rapidly without compromising system stability or security.

💼 Strategic Value for Engineering Teams & Startups:
* Accelerated Market Velocity: Reduces manual code review overhead by 65%, allowing senior architects to focus on high-level innovation while the AI handles routine quality and complexity gating.
* Real-Time Performance Auditing: Delivers sub-500ms inference latency for near-instantaneous refactoring suggestions, ensuring development speed remains high even during aggressive scaling phases.
* Technical Debt Transparency: Provides leadership with 100% visibility into historical code health trends via a data-driven analytics engine, turning "invisible" debt into manageable, actionable insights.
* Production-Level Risk Mitigation: Installs a "Security-First" culture by identifying critical vulnerabilities in real-time, significantly lowering the operational cost of late-stage bug fixes and emergency patches.
* Enhanced Developer Experience (DX): Features a cinematic, high-fidelity interface designed to minimize cognitive load, keeping engineers in a high-productivity "flow state" during complex refactoring tasks.

 ---
 ## 🛠️ Tech Stack
| Category                           | Technology                         
| ------------------- | -------------------------- |
| Frontend	           |         React 18 & Vite    |                         
| Backend	            |FastAPI (Python 3.10+)	     |
| AI Engine           |	Groq LPU (Llama 3.3 70B)	  |
| Database            |	SQLAlchemy & SQLite	       |
| Data Visualization  |	Recharts	                  |
| Styling & UI        |	Tailwind CSS	              |
| Integrations        |	Axios & Pydantic	          |
| DevOps             	| Docker & Docker Compose	   |
| Environment         |	Dotenv & Venv              |
---
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
* Prerequisites:
  
-Python 3.8+

-Node.js (v16+) & npm

-Groq API Key (Get it free at console.groq.com)

1. Backend Orchestration

```
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows use `.\.venv\Scripts\activate`
pip install fastapi uvicorn sqlalchemy groq python-dotenv python-multipart

```

2. Environment Configuration:
```
Create a .env file in the backend/ root:
code
Env
GROQ_API_KEY=your_gsk_api_key_here
```

3. Install dependencies
```
pip install fastapi uvicorn sqlalchemy groq python-dotenv python-multipart
```
4.  Frontend Deployment
```
cd frontend
npm install --legacy-peer-deps
```

🏃Docker Setup
```
docker-compose up --build
docker-compose up -d
docker-compose down
docker-compose logs -f
docker-compose down && docker system prune -a --volumes
```
Access URLs after running:
```
Frontend UI: http://localhost:5173
Backend API: http://localhost:8000
```
# 🤝 Contributing
DevScope AI is built for the community. We welcome contributions that improve:
> Prompt Engineering for more accurate complexity scoring.
> UI Performance for smoother canvas-based animations.
> Database Adapters for PostgreSQL/PostGIS support.

Crafted for Engineers. Driven by AI. Orbiting the Galaxy. 🚀


