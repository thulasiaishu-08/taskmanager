export const STATUSES = [
  { value: "TODO", label: "To do", color: "var(--color-todo)" },
  { value: "IN_PROGRESS", label: "In progress", color: "var(--color-progress)" },
  { value: "COMPLETED", label: "Completed", color: "var(--color-done)" },
];

export const PRIORITIES = [
  { value: "LOW", label: "Low", color: "var(--color-low)" },
  { value: "MEDIUM", label: "Medium", color: "var(--color-medium)" },
  { value: "HIGH", label: "High", color: "var(--color-high)" },
];

export const statusMeta = (value) => STATUSES.find((s) => s.value === value);
export const priorityMeta = (value) => PRIORITIES.find((p) => p.value === value);

export function apiError(err, fallback) {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  return fallback;
}
