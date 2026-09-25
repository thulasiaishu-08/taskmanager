import { useState } from "react";
import Button from "./ui/Button";
import { Field, Input, Select, Textarea } from "./ui/Field";
import { PRIORITIES, STATUSES, apiError } from "../lib/constants";

export default function TaskForm({ initialValue, defaultStatus = "TODO", onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialValue?.title || "");
  const [description, setDescription] = useState(initialValue?.description || "");
  const [status, setStatus] = useState(initialValue?.status || defaultStatus);
  const [priority, setPriority] = useState(initialValue?.priority || "MEDIUM");
  const [dueDate, setDueDate] = useState(initialValue?.due_date ? initialValue.due_date.slice(0, 10) : "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description,
        status,
        priority,
        due_date: dueDate ? `${dueDate}T00:00:00` : null,
      });
    } catch (err) {
      setError(apiError(err, "Could not save task"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Title" htmlFor="task-title">
        <Input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Design the homepage hero"
          required
          maxLength={255}
          autoFocus
        />
      </Field>
      <Field label="Description" htmlFor="task-description">
        <Textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details, links, or acceptance criteria"
          rows={3}
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Status" htmlFor="task-status">
          <Select id="task-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Priority" htmlFor="task-priority">
          <Select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Due date" htmlFor="task-due">
          <Input id="task-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </Field>
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initialValue ? "Save changes" : "Create task"}
        </Button>
      </div>
    </form>
  );
}
