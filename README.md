# Task Manager

Full-stack task management app: create projects, add tasks to them, and track
progress by status and priority.

Stack: FastAPI + SQLAlchemy + PostgreSQL (backend), React + Vite (frontend).

## Run it (clone → run, 4 steps)

Only requirement: **Docker Desktop** installed and running.

```powershell
git clone https://github.com/thulasiaishu-08/taskmanager.git
cd taskmanager
copy .env.example .env
docker compose up --build
```

Then open **http://localhost:5173**, register an account, and start creating
projects/tasks.

> Use `docker compose` (space) — current Docker Desktop ships this as a CLI
> plugin. If your Docker install only has the older standalone binary, use
> `docker-compose up --build` (hyphen) instead; both do the same thing.

- Frontend: `http://localhost:5173`
- Backend API / Swagger docs: `http://localhost:8000/docs`
- Postgres: `localhost:5432`

That's it — no Python/Node/Postgres install needed, everything runs inside
containers. See `REQUIREMENTS.md` if Docker isn't available and you need to
run it manually instead.

## Project structure

```
taskmanager/
  backend/       FastAPI app (auth, projects, tasks) + Dockerfile
  frontend/      React app (Vite) + Dockerfile (nginx multi-stage)
  database/      Reference SQL schema (also used as init script)
  docker-compose.yml
```

## API overview

| Method | Path | Description |
| --- | --- | --- |
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Log in, get JWT |
| GET | `/auth/me` | Current user profile |
| GET | `/projects` | List own projects (`?search=&skip=&limit=`) |
| POST | `/projects` | Create a project |
| PUT | `/projects/{id}` | Update a project |
| DELETE | `/projects/{id}` | Delete a project (cascades to tasks) |
| GET | `/projects/{id}/tasks` | List tasks (`?status_filter=&priority=&search=`) |
| POST | `/projects/{id}/tasks` | Create a task |
| PUT | `/tasks/{id}` | Update a task |
| DELETE | `/tasks/{id}` | Delete a task |
| GET | `/health` | Health check |

Full interactive docs at `/docs` (Swagger) once the backend is running. A
ready-to-import Postman collection is at `postman_collection.json` (set the
`baseUrl` variable, run Login, and it auto-captures the JWT for the rest of
the requests).

`GET /projects` and `GET /projects/{id}/tasks` return the total matching row
count in the `X-Total-Count` response header.

## Database schema

See `database/schema.sql` for the reference PostgreSQL schema (users,
projects, tasks, with FK constraints, cascade deletes, and indexes). It runs
automatically on first container startup; the backend also runs
`Base.metadata.create_all()` on startup (both idempotent, no conflict).

## Tests

Backend has a pytest suite (17 tests) covering auth, project/task CRUD,
ownership isolation, filtering, search, and cascade delete — run against a
real PostgreSQL database (no mocking).

```powershell
cd backend
venv\Scripts\activate
createdb taskmanager_test
pytest -v
```

Set `TEST_DATABASE_URL` to point elsewhere if needed. CI
(`.github/workflows/ci.yml`) runs this suite against a Postgres service
container on every push/PR, and also builds the frontend.

## Manual setup (without Docker)

See `REQUIREMENTS.md` for full system prerequisites and PostgreSQL install
steps. Below assumes PostgreSQL is already installed and running.

### 1. Database

Run the PostgreSQL bin folder's `psql`/`createuser`/`createdb`, e.g.
`C:\Program Files\PostgreSQL\16\bin`, if they're not already on PATH:

```powershell
createuser -s taskmanager
psql -d postgres -c "ALTER USER taskmanager WITH PASSWORD 'taskmanager';"
createdb -O taskmanager taskmanager
psql -d taskmanager -f database\schema.sql
```

> `-s` makes `taskmanager` a superuser — needed because `schema.sql` runs as
> whichever role invokes `psql`, not necessarily `taskmanager` itself;
> without it the app hits "permission denied for table users" at runtime.
> This mirrors how the official `postgres` Docker image's `POSTGRES_USER` is
> a superuser too.

### 2. Backend — installs every library/tool

```powershell
cd backend
py -3.11 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

> Use `py -3.11` (Python 3.10+ works too). Make sure "Add python.exe to
> PATH" was checked during the Python installer, otherwise use the full
> path to `python.exe`.

### 3. Frontend — one command (separate terminal)

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```
