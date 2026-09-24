const STATUSES = ["TODO", "IN_PROGRESS", "COMPLETED"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

export default function TaskFilterBar({ statusFilter, priorityFilter, onChange }) {
  return (
    <div className="filter-bar">
      <label>
        Status
        <select
          value={statusFilter}
          onChange={(e) => onChange({ status: e.target.value, priority: priorityFilter })}
        >
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label>
        Priority
        <select
          value={priorityFilter}
          onChange={(e) => onChange({ status: statusFilter, priority: e.target.value })}
        >
          <option value="">All</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
