import { useState } from "react";
import { AnimatePresence, LayoutGroup } from "motion/react";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import { STATUSES } from "../lib/constants";
import { cn } from "../lib/cn";

export default function TaskBoard({ tasks, onMove, onEdit, onDelete, onAdd }) {
  const [draggingId, setDraggingId] = useState(null);
  const [overColumn, setOverColumn] = useState(null);

  function handleDrop(e, status) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggingId;
    setOverColumn(null);
    setDraggingId(null);
    const task = tasks.find((t) => t.id === id);
    if (task && task.status !== status) onMove(task, status);
  }

  return (
    <LayoutGroup>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {STATUSES.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.value);
          const isOver = overColumn === column.value;
          return (
            <section
              key={column.value}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (overColumn !== column.value) setOverColumn(column.value);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setOverColumn(null);
              }}
              onDrop={(e) => handleDrop(e, column.value)}
              className={cn(
                "flex min-h-72 flex-col rounded-2xl border bg-surface/40 p-3 transition-colors",
                isOver ? "border-brand/50 bg-brand-soft" : "border-line"
              )}
            >
              <header className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ backgroundColor: column.color }} />
                  <h3 className="text-sm font-semibold">{column.label}</h3>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-ink-muted">
                    {columnTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => onAdd(column.value)}
                  className="rounded-md p-1 text-ink-faint transition hover:bg-white/5 hover:text-ink cursor-pointer"
                  aria-label={`Add task to ${column.label}`}
                >
                  <Plus className="size-4" />
                </button>
              </header>
              <div className="flex flex-1 flex-col gap-2.5">
                <AnimatePresence mode="popLayout">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      dragging={draggingId === task.id}
                      onDragStart={setDraggingId}
                      onDragEnd={() => {
                        setDraggingId(null);
                        setOverColumn(null);
                      }}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </AnimatePresence>
                {columnTasks.length === 0 && (
                  <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-line py-8 text-xs text-ink-faint">
                    {isOver ? "Drop here" : "No tasks"}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
