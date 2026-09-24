# Task Manager

Full-stack task management app: create projects, add tasks to them, and track
progress by status and priority.

Stack: FastAPI + SQLAlchemy + PostgreSQL (backend), React + Vite (frontend).

> Docker/deployment setup is not included yet — this is the local dev version.
> Docker Compose, Dockerfiles, and env-based container config will be added
> in a follow-up pass.

## Project structure

```
taskmanager/
  backend/       FastAPI app (auth, projects, tasks)
  frontend/      React app (Vite)
  database/      Reference SQL schema
```

## Backend setup

Requires Python 3.10+ and a running PostgreSQL instance.

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# edit .env with your DATABASE_URL and a real SECRET_KEY

uvicorn app.main:app --reload
```

The API is served at `http://localhost:8000`. Tables are created
automatically on startup. Swagger docs: `http://localhost:8000/docs`.

Create the database first, e.g.:

```sql
CREATE USER taskmanager WITH PASSWORD 'taskmanager';
CREATE DATABASE taskmanager OWNER taskmanager;
```

### Environment variables (backend/.env)

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing secret |
| `ALGORITHM` | JWT algorithm (default `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime in minutes |

## Frontend setup

Requires Node.js 18+.

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if the API isn't on http://localhost:8000

npm run dev
```

App runs at `http://localhost:5173`.

## API overview

| Method | Path | Description |
| --- | --- | --- |
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Log in, get JWT |
| GET | `/auth/me` | Current user profile |
| GET | `/projects` | List own projects |
| POST | `/projects` | Create a project |
| PUT | `/projects/{id}` | Update a project |
| DELETE | `/projects/{id}` | Delete a project (cascades to tasks) |
| GET | `/projects/{id}/tasks` | List tasks (`?status_filter=&priority=`) |
| POST | `/projects/{id}/tasks` | Create a task |
| PUT | `/tasks/{id}` | Update a task |
| DELETE | `/tasks/{id}` | Delete a task |
| GET | `/health` | Health check |

Full interactive docs at `/docs` (Swagger) once the backend is running.

## Database schema

See `database/schema.sql` for the reference PostgreSQL schema (users,
projects, tasks, with FK constraints, cascade deletes, and indexes).
