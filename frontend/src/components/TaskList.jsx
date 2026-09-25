import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import Badge from "./ui/Badge";
import { Select } from "./ui/Field";
import { STATUSES, priorityMeta } from "../lib/constants";
import { formatDue, isOverdue } from "./TaskCard";
import { cn } from "../lib/cn";

export default function TaskList({ tasks, onMove, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface/40">
      <div className="hidden grid-cols-[1fr_150px_110px_110px_72px] gap-4 border-b border-line px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-ink-faint md:grid">
        <span>Task</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Due</span>
        <span />
      </div>
      <ul>
        <AnimatePresence initial={false}>
          {tasks.map((task) => {
            const priority = priorityMeta(task.priority);
            const overdue = isOverdue(task);
            return (
              <motion.li
                key={task.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="group grid grid-cols-1 gap-3 border-b border-line px-5 py-4 last:border-b-0 transition-colors hover:bg-white/[0.02] md:grid-cols-[1fr_150px_110px_110px_72px] md:items-center md:gap-4"
              >
                <div className="min-w-0">
                  <p
                    className={cn(
                      "truncate text-sm font-medium",
                      task.status === "COMPLETED" && "text-ink-muted line-through decoration-ink-faint"
                    )}
                  >
                    {task.title}
                  </p>
                  {task.description && <p className="mt-0.5 truncate text-xs text-ink-muted">{task.description}</p>}
                </div>
                <Select
                  value={task.status}
                  onChange={(e) => onMove(task, e.target.value)}
                  className="h-8 text-xs"
                  aria-label="Change status"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
                <div>
                  <Badge color={priority.color}>{priority.label}</Badge>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs",
                    overdue ? "text-rose-400" : "text-ink-muted"
                  )}
                >
                  {task.due_date ? (
                    <>
                      <CalendarDays className="size-3" />
                      {formatDue(task.due_date)}
                    </>
                  ) : (
                    <span className="text-ink-faint">—</span>
                  )}
                </span>
                <div className="flex gap-1 md:justify-end">
                  <button
                    onClick={() => onEdit(task)}
                    className="rounded-md p-1.5 text-ink-faint hover:bg-white/5 hover:text-ink cursor-pointer"
                    aria-label="Edit task"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(task)}
                    className="rounded-md p-1.5 text-ink-faint hover:bg-rose-500/10 hover:text-rose-300 cursor-pointer"
                    aria-label="Delete task"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
