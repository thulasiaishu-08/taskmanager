import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ListTodo, Loader2, Plus } from "lucide-react";
import apiClient from "../api/client";
import TaskForm from "../components/TaskForm";
import TaskFilterBar from "../components/TaskFilterBar";
import TaskBoard from "../components/TaskBoard";
import TaskList from "../components/TaskList";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import { useToast } from "../components/ui/Toast";
import { STATUSES, statusMeta } from "../lib/constants";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", priority: "", search: "" });
  const [view, setView] = useState(() => localStorage.getItem("task_view") || "board");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [newStatus, setNewStatus] = useState("TODO");
  const [deleting, setDeleting] = useState(null);
  const toast = useToast();

  async function loadTasks(current = filters) {
    try {
      const params = {};
      if (current.status) params.status_filter = current.status;
      if (current.priority) params.priority = current.priority;
      if (current.search) params.search = current.search;
      const res = await apiClient.get(`/projects/${projectId}/tasks`, { params });
      setTasks(res.data);
      setTotal(Number(res.headers["x-total-count"] ?? res.data.length));
    } catch {
      toast("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    apiClient
      .get(`/projects/${projectId}`)
      .then((res) => setProject(res.data))
      .catch(() => toast("Project not found", "error"));
  }, [projectId]);

  useEffect(() => {
    const t = setTimeout(() => loadTasks(filters), filters.search ? 250 : 0);
    return () => clearTimeout(t);
  }, [projectId, filters]);

  useEffect(() => {
    localStorage.setItem("task_view", view);
  }, [view]);

  const counts = useMemo(() => {
    const c = { TODO: 0, IN_PROGRESS: 0, COMPLETED: 0 };
    tasks.forEach((t) => (c[t.status] += 1));
    return c;
  }, [tasks]);
  const progress = tasks.length ? Math.round((counts.COMPLETED / tasks.length) * 100) : 0;

  function openCreate(status = "TODO") {
    setEditing(null);
    setNewStatus(status);
    setFormOpen(true);
  }

  async function handleSave(values) {
    if (editing) {
      await apiClient.put(`/tasks/${editing.id}`, values);
      toast("Task updated");
    } else {
      await apiClient.post(`/projects/${projectId}/tasks`, values);
      toast("Task created");
    }
    setFormOpen(false);
    loadTasks();
  }

  async function handleMove(task, status) {
    const previous = tasks;
    setTasks((ts) => ts.map((t) => (t.id === task.id ? { ...t, status } : t)));
    try {
      await apiClient.put(`/tasks/${task.id}`, { status });
      toast(`Moved to ${statusMeta(status).label}`);
      if (filters.status) loadTasks();
    } catch {
      setTasks(previous);
      toast("Could not update task", "error");
    }
  }

  async function handleDelete() {
    await apiClient.delete(`/tasks/${deleting.id}`);
    toast("Task deleted");
    loadTasks();
  }

  const hasFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        All projects
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-semibold tracking-tight">{project?.title ?? " "}</h1>
          {project?.description && <p className="mt-2 max-w-2xl text-sm text-ink-muted">{project.description}</p>}
        </div>
        <Button onClick={() => openCreate()}>
          <Plus className="size-4" />
          New task
        </Button>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATUSES.map((s, i) => (
          <motion.div
            key={s.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.05 * i } }}
            className="rounded-2xl border border-line bg-surface/60 p-4"
          >
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{counts[s.value]}</p>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
          className="rounded-2xl border border-line bg-surface/60 p-4"
        >
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <span>Progress</span>
            <span className="tabular-nums text-ink">{progress}%</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-brand to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
          <p className="mt-2 text-[11px] text-ink-faint">
            {total} {total === 1 ? "task" : "tasks"}
            {hasFilters ? " matching filters" : ""}
          </p>
        </motion.div>
      </div>

      <div className="mt-8">
        <TaskFilterBar filters={filters} onChange={setFilters} view={view} onViewChange={setView} />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="size-6 animate-spin text-brand" />
          </div>
        ) : view === "board" ? (
          <TaskBoard
            tasks={tasks}
            onMove={handleMove}
            onEdit={(task) => {
              setEditing(task);
              setFormOpen(true);
            }}
            onDelete={setDeleting}
            onAdd={openCreate}
          />
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title={hasFilters ? "No tasks match these filters" : "No tasks yet"}
            description={hasFilters ? "Try clearing a filter or changing your search." : "Add your first task to get going."}
            action={
              !hasFilters && (
                <Button onClick={() => openCreate()}>
                  <Plus className="size-4" />
                  Add task
                </Button>
              )
            }
          />
        ) : (
          <TaskList
            tasks={tasks}
            onMove={handleMove}
            onEdit={(task) => {
              setEditing(task);
              setFormOpen(true);
            }}
            onDelete={setDeleting}
          />
        )}
      </div>

      {view === "board" && !loading && (
        <p className="mt-4 text-center text-xs text-ink-faint">Tip: drag cards between columns to change their status.</p>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit task" : "New task"}
        description={editing ? "Update the task details." : `Add a task to ${project?.title ?? "this project"}.`}
      >
        <TaskForm
          key={editing?.id ?? `new-${newStatus}`}
          initialValue={editing}
          defaultStatus={newStatus}
          onSubmit={handleSave}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete task?"
        description={deleting ? `"${deleting.title}" will be permanently deleted.` : ""}
      />
    </div>
  );
}
