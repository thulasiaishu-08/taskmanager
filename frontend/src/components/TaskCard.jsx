import { motion } from "motion/react";
import { CalendarDays, GripVertical, Pencil, Trash2 } from "lucide-react";
import Badge from "./ui/Badge";
import { priorityMeta } from "../lib/constants";
import { cn } from "../lib/cn";

export function formatDue(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr.slice(0, 10) + "T00:00:00");
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function isOverdue(task) {
  if (!task.due_date || task.status === "COMPLETED") return false;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return task.due_date.slice(0, 10) < today;
}

export default function TaskCard({ task, onEdit, onDelete, onDragStart, onDragEnd, dragging }) {
  const priority = priorityMeta(task.priority);
  const overdue = isOverdue(task);

  return (
    <motion.div
      layout
      layoutId={task.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: dragging ? 0.4 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
    >
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", task.id);
          e.dataTransfer.effectAllowed = "move";
          onDragStart(task.id);
        }}
        onDragEnd={onDragEnd}
        className={cn(
          "group rounded-xl border border-line bg-surface p-3.5 shadow-sm transition cursor-grab active:cursor-grabbing",
          "hover:border-line-strong hover:bg-surface-2 hover:shadow-lg hover:shadow-black/30",
          task.status === "COMPLETED" && "opacity-75"
        )}
      >
        <div className="flex items-start gap-2">
          <GripVertical className="mt-0.5 size-4 shrink-0 text-ink-faint opacity-40 transition group-hover:opacity-100" />
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "text-sm font-medium leading-snug break-words",
                task.status === "COMPLETED" && "line-through decoration-ink-faint"
              )}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{task.description}</p>
            )}
          </div>
          <div className="flex shrink-0 gap-0.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            <button
              onClick={() => onEdit(task)}
              className="rounded-md p-1 text-ink-faint hover:bg-white/5 hover:text-ink cursor-pointer"
              aria-label="Edit task"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="rounded-md p-1 text-ink-faint hover:bg-rose-500/10 hover:text-rose-300 cursor-pointer"
              aria-label="Delete task"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 pl-6">
          <Badge color={priority.color}>{priority.label}</Badge>
          {task.due_date && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[11px]",
                overdue ? "text-rose-400" : "text-ink-faint"
              )}
            >
              <CalendarDays className="size-3" />
              {overdue ? "Overdue · " : ""}
              {formatDue(task.due_date)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
