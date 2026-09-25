import { useState } from "react";
import Button from "./ui/Button";
import { Field, Input, Textarea } from "./ui/Field";
import { apiError } from "../lib/constants";

export default function ProjectForm({ initialValue, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialValue?.title || "");
  const [description, setDescription] = useState(initialValue?.description || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), description });
    } catch (err) {
      setError(apiError(err, "Could not save project"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Title" htmlFor="project-title">
        <Input
          id="project-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Website relaunch"
          required
          maxLength={255}
          autoFocus
        />
      </Field>
      <Field label="Description" htmlFor="project-description">
        <Textarea
          id="project-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this project about?"
          rows={3}
        />
      </Field>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initialValue ? "Save changes" : "Create project"}
        </Button>
      </div>
    </form>
  );
}
