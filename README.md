# Task Manager

Full-stack task management app: create projects, add tasks to them, and track
progress by status and priority.

Stack: FastAPI + SQLAlchemy + PostgreSQL (backend), React + Vite (frontend).

## Quick start (Docker)

Requires Docker and Docker Compose.

```bash
cp .env.example .env
# edit .env — at minimum set a real SECRET_KEY

docker-compose up --build
```

- Frontend: `http://localhost:5173`
- Backend API / Swagger docs: `http://localhost:8000/docs`
- Postgres: `localhost:5432`

The database schema is created two ways (both idempotent, so no conflict):
`database/schema.sql` runs automatically on first container startup via
Postgres's `docker-entrypoint-initdb.d`, and the backend also runs
`Base.metadata.create_all()` on startup. See `REQUIREMENTS.md` for the full
list of environment variables used by `docker-compose.yml`.

## Project structure

```
taskmanager/
  backend/       FastAPI app (auth, projects, tasks) + Dockerfile
  frontend/      React app (Vite) + Dockerfile (nginx multi-stage)
  database/      Reference SQL schema (also used as init script)
  docker-compose.yml
```

## Manual setup (without Docker)

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
| GET | `/projects/{id}/tasks` | List tasks (`?status_filter=&priority=&search=`) |
| POST | `/projects/{id}/tasks` | Create a task |
| PUT | `/tasks/{id}` | Update a task |
| DELETE | `/tasks/{id}` | Delete a task |
| GET | `/health` | Health check |

Full interactive docs at `/docs` (Swagger) once the backend is running. A
ready-to-import Postman collection is at `postman_collection.json` (set the
`baseUrl` variable, run Login, and it auto-captures the JWT for the rest of
the requests).

`GET /projects` and `GET /projects/{id}/tasks` support `skip`/`limit`
pagination, a `search` param (matches on title), and return the total
matching row count in the `X-Total-Count` response header.

## Database schema

See `database/schema.sql` for the reference PostgreSQL schema (users,
projects, tasks, with FK constraints, cascade deletes, and indexes).

## Tests

Backend has a pytest suite (17 tests) covering auth, project/task CRUD,
ownership isolation, filtering, search, and cascade delete — run against a
real PostgreSQL database (no mocking).

```bash
cd backend
source venv/bin/activate
createdb taskmanager_test   # one-time, owned by the same DB user
pytest -v
```

Set `TEST_DATABASE_URL` to point elsewhere if needed. CI (`.github/workflows/ci.yml`)
runs this suite against a Postgres service container on every push/PR, and
also builds the frontend.
