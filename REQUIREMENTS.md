# Requirements — Running Task Manager

## Easy way: Docker (recommended)

Only requirement: **Docker Desktop** (includes Docker Compose).

Install: https://www.docker.com/products/docker-desktop/ (or
`winget install Docker.DockerDesktop`), then open Docker Desktop once so it
finishes starting.

Clone the repository:

```powershell
git clone https://github.com/thulasiaishu-08/taskmanager.git
```

Move into the project folder:

```powershell
cd taskmanager
```

Copy the example environment file (edit `.env` if you want different ports
or secrets):

```powershell
copy .env.example .env
```

Build the images and start the database, backend, and frontend containers:

```powershell
docker compose up --build
```

> Use `docker compose` (space) — current Docker Desktop ships this as a CLI
> plugin. Older standalone installs use `docker-compose` (hyphen) instead —
> same effect.

Open `http://localhost:5173`. No Python/Node/Postgres install needed —
everything (backend, frontend, database) runs in containers. See
`docker-compose.yml` / root `.env.example` for the full list of environment
variables (`POSTGRES_*`, `SECRET_KEY`, `VITE_API_URL`, ports).

## Manual way (no Docker)

Needed if Docker isn't available on the machine.

| Tool | Version | Check |
| --- | --- | --- |
| Python | 3.10+ | `python --version` |
| Node.js | 18+ | `node --version` |
| npm | comes with Node | `npm --version` |
| PostgreSQL | 14+ | `psql --version` |

### Install prerequisites

- Python: https://www.python.org/downloads/ (3.10+, tick "Add python.exe to PATH")
- Node.js: https://nodejs.org/ (18+ LTS)
- PostgreSQL: https://www.postgresql.org/download/windows/ (the installer
  adds `psql`/`createuser`/`createdb` under
  `C:\Program Files\PostgreSQL\<version>\bin`)

### Database setup

If the commands below aren't found, add PostgreSQL's `bin` folder to PATH
first.

Create the `taskmanager` database role as a superuser — needed so it can
own and access everything `schema.sql` creates (see note below):

```powershell
createuser -s taskmanager
```

Set its password:

```powershell
psql -d postgres -c "ALTER USER taskmanager WITH PASSWORD 'taskmanager';"
```

Create the `taskmanager` database, owned by that role:

```powershell
createdb -O taskmanager taskmanager
```

Apply the schema (tables, types, indexes) to it:

```powershell
psql -d taskmanager -f database\schema.sql
```

> `-s` makes `taskmanager` a superuser — needed because `schema.sql` runs as
> whichever role invokes `psql`, not necessarily `taskmanager` itself;
> without it the app hits "permission denied for table users" at runtime.
> This mirrors how the official `postgres` Docker image's `POSTGRES_USER` is
> a superuser too.

### Run backend

Python packages are pinned in `backend/requirements.txt` (FastAPI,
SQLAlchemy, psycopg2, pydantic, python-jose, passlib, pytest...).

> `bcrypt` is pinned to `4.0.1` on purpose — `passlib` 1.7.4 breaks on
> `bcrypt` 4.1+/5.x (password hashing raises an error at runtime).

Move into the backend folder:

```powershell
cd backend
```

Create a Python virtual environment (see note on `py -3.11` below):

```powershell
py -3.11 -m venv venv
```

Activate it:

```powershell
venv\Scripts\activate
```

Install every backend library/tool from `requirements.txt`:

```powershell
pip install -r requirements.txt
```

Copy the environment template (edit `DATABASE_URL` / `SECRET_KEY` if
needed):

```powershell
copy .env.example .env
```

Start the backend API:

```powershell
uvicorn app.main:app --reload
```

> Use `py -3.11` (Python 3.10+ works too). Make sure "Add python.exe to
> PATH" was checked during the Python installer, otherwise use the full
> path to `python.exe`.

Backend runs on **port 8000**.

### Run frontend

Node packages are declared in `frontend/package.json` (React 18, React
Router 6, axios, Vite 5).

Move into the frontend folder:

```powershell
cd frontend
```

Install every frontend dependency:

```powershell
npm install
```

Copy the environment template:

```powershell
copy .env.example .env
```

Start the frontend dev server:

```powershell
npm run dev
```

Frontend runs on **port 5173**.

### Environment variables

**backend/.env**

| Variable | Example |
| --- | --- |
| `DATABASE_URL` | `postgresql://taskmanager:taskmanager@localhost:5432/taskmanager` |
| `SECRET_KEY` | any random string |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` |

**frontend/.env**

| Variable | Example |
| --- | --- |
| `VITE_API_URL` | `http://localhost:8000` |

### Ports summary

| Service | Port |
| --- | --- |
| Backend (FastAPI) | 8000 |
| Frontend (Vite) | 5173 |
| PostgreSQL | 5432 |
