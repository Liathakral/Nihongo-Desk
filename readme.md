# 🇯🇵 Nihongo Desk

> An AI-powered Japanese language learning platform that tracks study sessions, generates personalized insights, and adapts your daily plan using GPT-4.

###  Analytics
![Alt text](https://i.ibb.co/XrmMPdf4/Screenshot-2026-03-11-at-11-24-25-AM.png)
### Dashboard
![Alt text](https://ibb.co/hRdkrwgh)
### chatbot
![Alt text](https://ibb.co/fY6VY0F2)
### AI Planner
![Alt text](https://ibb.co/tpLmbVHH)



![Python](https://img.shields.io/badge/Python-3.11-blue?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-RQ-DC382D?style=flat-square&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![Railway](https://img.shields.io/badge/Deployed-Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)

---

## 📸 Pages

### 1. Dashboard
The home view — shows your study streak, today's targets, recent session summary, and quick-access navigation. Gives an immediate snapshot of where you stand.

### 2. Analytics
Data-driven breakdown of your learning history. Includes:
- **Accuracy Trend** — line chart of session accuracy over time
- **Mistake Distribution** — radial chart of error categories (grammar, vocab, kanji, etc.)
- **Insights** — an asynchronous processing pipeline using Redis Queue, offloading heavy AI insight generation and data aggregation to background workers

### 3. Study Session
Log a new study session. logs performance. On submit, enqueues an RQ background job that generates AI insights without blocking the UI.

### 4. Talk To AI
Conversational AI chat interface powered by GPT-4 chat completions.

### 5. AI Planner
Your daily study plan, auto-generated based on your profile goals and past performance. Shows today's targets across all skill areas with progress tracking. Marks completion and feeds data back for the next day's plan generation.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | FastAPI, Python 3.11, SQLAlchemy ORM, Alembic |
| **Database** | PostgreSQL |
| **Cache / Queue** | Redis + RQ (Redis Queue) |
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS |
| **Charts** | Recharts |
| **AI** | OpenAI GPT-4 chat completions, dynamic prompt engineering |
| **Real-time** | Server-Sent Events (SSE) for live worker status |
| **DevOps** | Docker Compose, Railway |

---

## 🏗 Architecture

```
React (Vite + TypeScript + Tailwind)
            │
            │  REST + SSE
            ▼
     FastAPI Backend
      (15+ endpoints)
            │
     ┌──────┴──────┐
     ▼             ▼
PostgreSQL       Redis
(SQLAlchemy)       │
                   ▼
              RQ Workers
                   │
                   ▼
            OpenAI GPT-4
```

---

## 📁 Project Structure

```
nihongo-desk/
├── backend/
│   ├── main.py
│   ├── seed_data.py
│   ├── alembic.ini
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── start.sh
│   ├── alembic/
│   ├── app/
│   │   ├── config.py
│   │   ├── logging_config.py
│   │   ├── openai_client.py
│   │   ├── queue.py
│   │   ├── redis.py
│   │   └── security.py
│   ├── models/
│   │   ├── db.py
│   │   ├── daily_targets.py
│   │   ├── insights.py
│   │   ├── next_action.py
│   │   ├── performance.py
│   │   ├── study_profile.py
│   │   ├── study_session.py
│   │   └── users.py
│   ├── routers/
│   │   ├── AI_tutor.py
│   │   ├── auth.py
│   │   ├── daily_target.py
│   │   ├── next_action.py
│   │   ├── performance.py
│   │   ├── sessions.py
│   │   ├── study_profile.py
│   │   └── timeline.py
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── dailyplan.py
│   │   ├── insights.py
│   │   ├── performance.py
│   │   ├── sessions.py
│   │   ├── study_profile.py
│   │   └── timeline.py
│   ├── services/
│   │   ├── auth.py
│   │   ├── daily_plan.py
│   │   ├── dependencies.py
│   │   ├── insights.py
│   │   ├── learning_progress.py
│   │   ├── nextday_planner.py
│   │   ├── performance.py
│   │   ├── plan_completion.py
│   │   ├── session_service.py
│   │   ├── study_profile.py
│   │   ├── timeline.py
│   │   └── users.py
│   ├── utils/
│   │   ├── days_remaining.py
│   │   └── velocity.py
│   └── workers/
│       ├── cleanup_worker.py
│       ├── daily_plan.py
│       ├── insight_worker.py
│       └── scheduler.py
│
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx
│       ├── App.css
│       ├── main.tsx
│       ├── index.css
│       ├── theme.css
│       ├── api/
│       │   └── client.ts
│       ├── assets/
│       │   ├── chatbot.svg
│       │   ├── logo.svg
│       │   ├── nihongoDesk.svg
│       │   ├── react.svg
│       │   └── user_profile.svg
│       ├── components/
│       │   ├── Analytics.tsx
│       │   ├── ChatBot.tsx
│       │   ├── DailyPlanner.tsx
│       │   ├── Dashboard.tsx
│       │   ├── InsightCard.tsx
│       │   ├── Login.tsx
│       │   ├── NextActionCard.tsx
│       │   ├── PerformanceForm.tsx
│       │   ├── ProtectedRoute.tsx
│       │   ├── Signup.tsx
│       │   ├── StudyProfile.tsx
│       │   ├── StudySessionForm.tsx
│       │   ├── TimelineList.tsx
│       │   └── UI/
│       │       ├── AIPlanner.tsx
│       │       └── Loader.tsx
│       ├── layouts/
│       │   └── MainLayout.tsx
│       ├── providers/
│       │   ├── session-provider.tsx
│       │   └── theme-provider.tsx
│       ├── stores/
│       │   ├── authStore.ts
│       │   └── dashboardStore.ts
│       ├── types/
│       │   └── dashboard.ts
│       └── utils/
│
├── docker-compose.yml
├── .env.example
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- Docker + Docker Compose
- OpenAI API key

### Setup

```bash
git clone https://github.com/yourusername/nihongo-desk
cd nihongo-desk

# Copy env template and fill in your keys
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://postgres:password@db:5432/nihongo
REDIS_URL=redis://redis:6379
OPENAI_API_KEY=your_openai_key_here
SECRET_KEY=your_jwt_secret
```

```bash
# Start all services
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register user |
| `POST` | `/auth/login` | Login, returns JWT |
| `POST` | `/sessions/` | Log a study session |
| `GET` | `/sessions/` | List user sessions |
| `GET` | `/analytics/dashboard` | Full dashboard data |
| `GET` | `/analytics/timeline` | Accuracy trend + insights |
| `GET` | `/daily-plan/today` | Get today's plan |
| `PATCH` | `/daily-plan/:id` | Update plan completion |
| `POST` | `/chat/` | Send message to AI |
| `GET` | `/study-profile/` | Get user study profile |
| `GET` | `/jobs/stream` | SSE stream for worker status |

---

## ⚙️ How Background Jobs Work

```
1. User logs a study session (POST /sessions/)
2. FastAPI enqueues an RQ job → JobLog row created (status: queued)
3. RQ Worker picks up the job:
   - Fetches session data from PostgreSQL
   - Calls OpenAI with dynamic prompt built from user's mistake history
   - Stores generated insights in DB
   - Pushes status updates (queued → started → success/failed)
4. Frontend receives updates via SSE stream in real time
5. Analytics page displays new insights immediately
```

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `OPENAI_API_KEY` | OpenAI API key |
| `SECRET_KEY` | JWT signing secret |
| `VITE_API_URL` | Backend URL for frontend |
| `VITE_WS_URL` | SSE base URL |

---

## 🧪 Running Tests

```bash
# Backend
cd backend
pytest

# Frontend type check
cd frontend
npx tsc --noEmit
```

---

## 📖 What I Learned

- Designing async background job pipelines with RQ and Redis
- Real-time frontend updates using Server-Sent Events (SSE) without WebSocket complexity
- Prompt engineering with dynamic context — building system prompts from user data
- Database schema design for a multi-entity learning tracker
- TypeScript strict typing across a full React app (no `any`)
- Docker Compose orchestration of 4 services (API, DB, Redis, Worker)

---

## 🌸 About the Name

**Nihongo** (日本語) means "Japanese language" in Japanese. **Desk** — because learning is best done at a desk, consistently, every day.

---

## 📄 License

MIT
