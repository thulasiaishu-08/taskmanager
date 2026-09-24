import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../api/client";
import TaskForm from "../components/TaskForm";
import TaskFilterBar from "../components/TaskFilterBar";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [error, setError] = useState("");

  async function loadProject() {
    const res = await apiClient.get(`/projects/${projectId}`);
    setProject(res.data);
  }

  async function loadTasks() {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status_filter = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const res = await apiClient.get(`/projects/${projectId}/tasks`, { params });
      setTasks(res.data);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProject();
  }, [projectId]);

  useEffect(() => {
    loadTasks();
  }, [projectId, statusFilter, priorityFilter]);

  async function handleCreate(values) {
    await apiClient.post(`/projects/${projectId}/tasks`, values);
    setShowForm(false);
    loadTasks();
  }

  async function handleUpdate(values) {
    await apiClient.put(`/tasks/${editingTask.id}`, values);
    setEditingTask(null);
    loadTasks();
  }

  async function handleStatusChange(task, status) {
    await apiClient.put(`/tasks/${task.id}`, { status });
    loadTasks();
  }

  async function handleDelete(task) {
    if (!confirm(`Delete task "${task.title}"?`)) return;
    await apiClient.delete(`/tasks/${task.id}`);
    loadTasks();
  }

  return (
    <div className="page">
      <p>
        <Link to="/">&larr; Back to projects</Link>
      </p>
      <div className="page-header">
        <h1>{project?.title || "Project"}</h1>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Close" : "New Task"}
        </button>
      </div>
      {project?.description && <p>{project.description}</p>}

      {error && <p className="form-error">{error}</p>}

      {showForm && (
        <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      <TaskFilterBar
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onChange={({ status, priority }) => {
          setStatusFilter(status);
          setPriorityFilter(priority);
        }}
      />

      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks match the current filters.</p>
      ) : (
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) =>
              editingTask?.id === task.id ? (
                <tr key={task.id}>
                  <td colSpan={5}>
                    <TaskForm
                      initialValue={task}
                      onSubmit={handleUpdate}
                      onCancel={() => setEditingTask(null)}
                    />
                  </td>
                </tr>
              ) : (
                <tr key={task.id}>
                  <td>
                    <strong>{task.title}</strong>
                    {task.description && <div className="task-desc">{task.description}</div>}
                  </td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>
                  <td>
                    <span className={`badge badge-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>{task.due_date ? task.due_date.slice(0, 10) : "-"}</td>
                  <td className="card-actions">
                    <button className="btn btn-secondary" onClick={() => setEditingTask(task)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(task)}>
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
