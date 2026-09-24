# Requirements — Running Task Manager on a New System

Everything needed to run this project on another machine (no Docker yet — see
README.md's note on that).

## System prerequisites

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

## Database setup (one-time)

Create the DB user and database (adjust password as needed):

```sql
CREATE USER taskmanager WITH PASSWORD 'taskmanager';
CREATE DATABASE taskmanager OWNER taskmanager;
```

## Backend requirements

Python packages are pinned in `backend/requirements.txt`:

```
fastapi==0.115.0
uvicorn[standard]==0.30.6
sqlalchemy==2.0.35
psycopg2-binary==2.9.9
pydantic==2.9.2
pydantic-settings==2.5.2
email-validator==2.2.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
bcrypt==4.0.1
python-multipart==0.0.9
```

> `bcrypt` is pinned to `4.0.1` on purpose — `passlib` 1.7.4 breaks on
> `bcrypt` 4.1+/5.x (password hashing raises an error at runtime).

Setup:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # edit DATABASE_URL / SECRET_KEY
uvicorn app.main:app --reload
```

Backend runs on **port 8000**.

## Frontend requirements

Node packages are declared in `frontend/package.json` (React 18, React Router
6, axios, Vite 5). Setup:

```bash
cd frontend
npm install
cp .env.example .env             # set VITE_API_URL if backend isn't on :8000
npm run dev
```

Frontend runs on **port 5173**.

## Environment variables

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

## Ports summary

| Service | Port |
| --- | --- |
| Backend (FastAPI) | 8000 |
| Frontend (Vite) | 5173 |
| PostgreSQL | 5432 |
