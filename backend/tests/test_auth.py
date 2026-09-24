def test_register_and_login(client):
    res = client.post(
        "/auth/register", json={"email": "a@example.com", "password": "password123"}
    )
    assert res.status_code == 201
    body = res.json()
    assert body["email"] == "a@example.com"
    assert "id" in body

    res = client.post(
        "/auth/login", json={"email": "a@example.com", "password": "password123"}
    )
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_register_duplicate_email_rejected(client):
    payload = {"email": "dup@example.com", "password": "password123"}
    client.post("/auth/register", json=payload)
    res = client.post("/auth/register", json=payload)
    assert res.status_code == 400


def test_login_wrong_password_rejected(client):
    client.post(
        "/auth/register", json={"email": "b@example.com", "password": "password123"}
    )
    res = client.post(
        "/auth/login", json={"email": "b@example.com", "password": "wrongpass"}
    )
    assert res.status_code == 401


def test_me_requires_auth(client):
    res = client.get("/auth/me")
    assert res.status_code == 401


def test_me_with_valid_token(client, register_and_login):
    headers = register_and_login("c@example.com")
    res = client.get("/auth/me", headers=headers)
    assert res.status_code == 200
    assert res.json()["email"] == "c@example.com"
