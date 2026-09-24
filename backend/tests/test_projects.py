def test_create_and_list_projects(client, register_and_login):
    headers = register_and_login("proj@example.com")
    res = client.post(
        "/projects", json={"title": "P1", "description": "d"}, headers=headers
    )
    assert res.status_code == 201

    res = client.get("/projects", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) == 1
    assert res.headers["x-total-count"] == "1"


def test_projects_isolated_between_users(client, register_and_login):
    headers_a = register_and_login("a@example.com")
    headers_b = register_and_login("b@example.com")
    client.post("/projects", json={"title": "A's project"}, headers=headers_a)

    res = client.get("/projects", headers=headers_b)
    assert res.json() == []


def test_update_and_delete_project(client, register_and_login):
    headers = register_and_login("update@example.com")
    res = client.post("/projects", json={"title": "Old"}, headers=headers)
    project_id = res.json()["id"]

    res = client.put(
        f"/projects/{project_id}", json={"title": "New"}, headers=headers
    )
    assert res.status_code == 200
    assert res.json()["title"] == "New"

    res = client.delete(f"/projects/{project_id}", headers=headers)
    assert res.status_code == 204

    res = client.get(f"/projects/{project_id}", headers=headers)
    assert res.status_code == 404


def test_cannot_access_other_users_project(client, register_and_login):
    headers_a = register_and_login("owner@example.com")
    headers_b = register_and_login("intruder@example.com")
    res = client.post("/projects", json={"title": "Secret"}, headers=headers_a)
    project_id = res.json()["id"]

    res = client.get(f"/projects/{project_id}", headers=headers_b)
    assert res.status_code == 404


def test_project_search_by_title(client, register_and_login):
    headers = register_and_login("search@example.com")
    client.post("/projects", json={"title": "Website Launch"}, headers=headers)
    client.post("/projects", json={"title": "Mobile App"}, headers=headers)

    res = client.get("/projects", params={"search": "website"}, headers=headers)
    assert len(res.json()) == 1
    assert res.json()[0]["title"] == "Website Launch"
