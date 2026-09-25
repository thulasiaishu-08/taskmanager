# Requirements — Running Task Manager

## Easy way: Docker (recommended)

Only requirement: **Docker Desktop** (includes Docker Compose).

- macOS: `brew install --cask docker` (then open Docker.app once)
- Windows/Linux: https://www.docker.com/products/docker-desktop/

```bash
git clone https://github.com/thulasiaishu-08/taskmanager.git
cd taskmanager
cp .env.example .env
docker-compose up --build
```

Open `http://localhost:5173`. No Python/Node/Postgres install needed —
everything (backend, frontend, database) runs in containers. See
`docker-compose.yml` / root `.env.example` for the full list of environment
variables (`POSTGRES_*`, `SECRET_KEY`, `VITE_API_URL`, ports).

## Manual way (no Docker)

Needed if Docker isn't available on the machine.

| Tool | Version | Check |
| --- | --- | --- |
| Python | 3.10+ | `python3 --version` |
| Node.js | 18+ | `node --version` |
| npm | comes with Node | `npm --version` |
| PostgreSQL | 14+ | `psql --version` |

### Install on macOS (Homebrew)

```bash
brew install python@3.11 node postgresql@16
brew services start postgresql@16
```

### Install on Ubuntu/Debian

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip nodejs npm postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Install on Windows

- Python: https://www.python.org/downloads/ (3.10+)
- Node.js: https://nodejs.org/ (18+ LTS)
- PostgreSQL: https://www.postgresql.org/download/windows/

### Database setup (one-time)

```sql
CREATE USER taskmanager WITH PASSWORD 'taskmanager';
CREATE DATABASE taskmanager OWNER taskmanager;
```

### Run backend

Python packages are pinned in `backend/requirements.txt` (FastAPI,
SQLAlchemy, psycopg2, pydantic, python-jose, passlib, pytest...).

> `bcrypt` is pinned to `4.0.1` on purpose — `passlib` 1.7.4 breaks on
> `bcrypt` 4.1+/5.x (password hashing raises an error at runtime).

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # edit DATABASE_URL / SECRET_KEY
uvicorn app.main:app --reload
```

Backend runs on **port 8000**.

### Run frontend

Node packages are declared in `frontend/package.json` (React 18, React
Router 6, axios, Vite 5).

```bash
cd frontend
npm install
cp .env.example .env             # set VITE_API_URL if backend isn't on :8000
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
