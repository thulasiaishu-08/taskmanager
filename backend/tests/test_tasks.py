def _create_project(client, headers, title="Project"):
    res = client.post("/projects", json={"title": title}, headers=headers)
    return res.json()["id"]


def test_create_and_list_tasks(client, register_and_login):
    headers = register_and_login("task@example.com")
    project_id = _create_project(client, headers)

    res = client.post(
        f"/projects/{project_id}/tasks",
        json={"title": "Task 1", "priority": "HIGH", "status": "TODO"},
        headers=headers,
    )
    assert res.status_code == 201

    res = client.get(f"/projects/{project_id}/tasks", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) == 1
    assert res.headers["x-total-count"] == "1"


def test_filter_tasks_by_status_and_priority(client, register_and_login):
    headers = register_and_login("filter@example.com")
    project_id = _create_project(client, headers)
    client.post(
        f"/projects/{project_id}/tasks",
        json={"title": "A", "status": "TODO", "priority": "LOW"},
        headers=headers,
    )
    client.post(
        f"/projects/{project_id}/tasks",
        json={"title": "B", "status": "IN_PROGRESS", "priority": "HIGH"},
        headers=headers,
    )

    res = client.get(
        f"/projects/{project_id}/tasks", params={"priority": "HIGH"}, headers=headers
    )
    assert len(res.json()) == 1
    assert res.json()[0]["title"] == "B"

    res = client.get(
        f"/projects/{project_id}/tasks",
        params={"status_filter": "TODO"},
        headers=headers,
    )
    assert len(res.json()) == 1
    assert res.json()[0]["title"] == "A"


def test_task_search_by_title(client, register_and_login):
    headers = register_and_login("tsearch@example.com")
    project_id = _create_project(client, headers)
    client.post(
        f"/projects/{project_id}/tasks",
        json={"title": "Design homepage"},
        headers=headers,
    )
    client.post(
        f"/projects/{project_id}/tasks", json={"title": "Write copy"}, headers=headers
    )

    res = client.get(
        f"/projects/{project_id}/tasks", params={"search": "design"}, headers=headers
    )
    assert len(res.json()) == 1
    assert res.json()[0]["title"] == "Design homepage"


def test_update_task_status(client, register_and_login):
    headers = register_and_login("updatetask@example.com")
    project_id = _create_project(client, headers)
    res = client.post(
        f"/projects/{project_id}/tasks", json={"title": "T"}, headers=headers
    )
    task_id = res.json()["id"]

    res = client.put(
        f"/tasks/{task_id}", json={"status": "COMPLETED"}, headers=headers
    )
    assert res.status_code == 200
    assert res.json()["status"] == "COMPLETED"


def test_delete_task(client, register_and_login):
    headers = register_and_login("deletetask@example.com")
    project_id = _create_project(client, headers)
    res = client.post(
        f"/projects/{project_id}/tasks", json={"title": "T"}, headers=headers
    )
    task_id = res.json()["id"]

    res = client.delete(f"/tasks/{task_id}", headers=headers)
    assert res.status_code == 204

    res = client.put(f"/tasks/{task_id}", json={"status": "TODO"}, headers=headers)
    assert res.status_code == 404


def test_cascade_delete_project_removes_tasks(client, register_and_login):
    headers = register_and_login("cascade@example.com")
    project_id = _create_project(client, headers)
    res = client.post(
        f"/projects/{project_id}/tasks", json={"title": "T"}, headers=headers
    )
    task_id = res.json()["id"]

    client.delete(f"/projects/{project_id}", headers=headers)

    res = client.put(f"/tasks/{task_id}", json={"status": "TODO"}, headers=headers)
    assert res.status_code == 404


def test_cannot_create_task_under_other_users_project(client, register_and_login):
    headers_a = register_and_login("powner@example.com")
    headers_b = register_and_login("pintruder@example.com")
    project_id = _create_project(client, headers_a)

    res = client.post(
        f"/projects/{project_id}/tasks", json={"title": "T"}, headers=headers_b
    )
    assert res.status_code == 404
