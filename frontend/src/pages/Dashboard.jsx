import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, FolderKanban, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import apiClient from "../api/client";
import ProjectForm from "../components/ProjectForm";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import { Input } from "../components/ui/Field";
import { useToast } from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";

const accents = [
  "from-violet-500 to-indigo-500",
  "from-sky-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-pink-500 to-rose-500",
];

function accentFor(id) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return accents[hash % accents.length];
}

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  async function loadProjects(query = search) {
    try {
      const params = query ? { search: query } : {};
      const res = await apiClient.get("/projects", { params });
      setProjects(res.data);
      setTotal(Number(res.headers["x-total-count"] ?? res.data.length));
    } catch {
      toast("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => loadProjects(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  async function handleSave(values) {
    if (editing) {
      await apiClient.put(`/projects/${editing.id}`, values);
      toast("Project updated");
    } else {
      await apiClient.post("/projects", values);
      toast("Project created");
    }
    setFormOpen(false);
    loadProjects();
  }

  async function handleDelete() {
    await apiClient.delete(`/projects/${deleting.id}`);
    toast("Project deleted");
    loadProjects();
  }

  const name = user?.email?.split("@")[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-sm text-ink-muted">Welcome back{name ? `, ${name}` : ""}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Your projects</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {total} {total === 1 ? "project" : "projects"} in your workspace
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          New project
        </Button>
      </motion.div>

      <div className="mt-8 max-w-sm">
        <Input
          icon={Search}
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="size-6 animate-spin text-brand" />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title={search ? "No matching projects" : "No projects yet"}
            description={
              search
                ? "Try a different search term."
                : "Create your first project to start organizing tasks on a board."
            }
            action={
              !search && (
                <Button onClick={openCreate}>
                  <Plus className="size-4" />
                  Create project
                </Button>
              )
            }
          />
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {projects.map((project, i) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-line bg-surface/70 p-5 transition-colors hover:border-line-strong"
                >
                  <div
                    className={`pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-linear-to-br ${accentFor(project.id)} opacity-10 blur-2xl transition-opacity group-hover:opacity-25`}
                  />
                  <div className="relative flex items-start justify-between">
                    <span
                      className={`grid size-10 place-items-center rounded-xl bg-linear-to-br ${accentFor(project.id)} text-sm font-semibold uppercase text-white shadow-lg shadow-black/30`}
                    >
                      {project.title[0]}
                    </span>
                    <div className="flex gap-0.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditing(project);
                          setFormOpen(true);
                        }}
                        className="rounded-md p-1.5 text-ink-faint hover:bg-white/5 hover:text-ink cursor-pointer"
                        aria-label="Edit project"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleting(project);
                        }}
                        className="rounded-md p-1.5 text-ink-faint hover:bg-rose-500/10 hover:text-rose-300 cursor-pointer"
                        aria-label="Delete project"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="relative mt-4 truncate font-semibold">{project.title}</h3>
                  <p className="relative mt-1 line-clamp-2 min-h-10 text-sm text-ink-muted">
                    {project.description || "No description"}
                  </p>
                  <div className="relative mt-5 flex items-center justify-between border-t border-line pt-4 text-xs text-ink-faint">
                    <span>
                      Created{" "}
                      {new Date(project.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-ink-muted transition-colors group-hover:text-brand">
                      Open board <ArrowUpRight className="size-3.5" />
                    </span>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit project" : "New project"}
        description={editing ? "Update the project details." : "Give your project a name and a short description."}
      >
        <ProjectForm
          key={editing?.id ?? "new"}
          initialValue={editing}
          onSubmit={handleSave}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete project?"
        description={deleting ? `"${deleting.title}" and all of its tasks will be permanently deleted.` : ""}
      />
    </div>
  );
}
