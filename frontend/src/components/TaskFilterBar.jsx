const STATUSES = ["TODO", "IN_PROGRESS", "COMPLETED"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

export default function TaskFilterBar({ statusFilter, priorityFilter, search, onChange }) {
  return (
    <div className="filter-bar">
      <label>
        Search
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) =>
            onChange({ status: statusFilter, priority: priorityFilter, search: e.target.value })
          }
        />
      </label>
      <label>
        Status
        <select
          value={statusFilter}
          onChange={(e) =>
            onChange({ status: e.target.value, priority: priorityFilter, search })
          }
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
          onChange={(e) =>
            onChange({ status: statusFilter, priority: e.target.value, search })
          }
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
