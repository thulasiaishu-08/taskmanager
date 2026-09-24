import os

os.environ["DATABASE_URL"] = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql://taskmanager:taskmanager@localhost:5432/taskmanager_test",
)
os.environ["SECRET_KEY"] = "test-secret-key"

import pytest
from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app


@pytest.fixture(autouse=True)
def _reset_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def register_and_login(client):
    def _do(email="user@example.com", password="password123"):
        client.post("/auth/register", json={"email": email, "password": password})
        res = client.post("/auth/login", json={"email": email, "password": password})
        token = res.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}

    return _do
