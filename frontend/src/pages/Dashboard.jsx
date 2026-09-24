import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import ProjectForm from "../components/ProjectForm";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function loadProjects() {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      const res = await apiClient.get("/projects", { params });
      setProjects(res.data);
    } catch {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, [search]);

  async function handleCreate(values) {
    await apiClient.post("/projects", values);
    setShowForm(false);
    loadProjects();
  }

  async function handleUpdate(values) {
    await apiClient.put(`/projects/${editingProject.id}`, values);
    setEditingProject(null);
    loadProjects();
  }

  async function handleDelete(project) {
    if (!confirm(`Delete project "${project.title}" and all its tasks?`)) return;
    await apiClient.delete(`/projects/${project.id}`);
    loadProjects();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Projects</h1>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Close" : "New Project"}
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="filter-bar">
        <label>
          Search
          <input
            type="text"
            placeholder="Search projects by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      {showForm && (
        <ProjectForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p>No projects yet. Create your first one.</p>
      ) : (
        <div className="card-grid">
          {projects.map((project) =>
            editingProject?.id === project.id ? (
              <div className="card" key={project.id}>
                <ProjectForm
                  initialValue={project}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditingProject(null)}
                />
              </div>
            ) : (
              <div className="card" key={project.id}>
                <h3>
                  <Link to={`/projects/${project.id}`}>{project.title}</Link>
                </h3>
                <p>{project.description}</p>
                <div className="card-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditingProject(project)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(project)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
