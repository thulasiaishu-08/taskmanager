import { motion } from "motion/react";
import { KanbanSquare, List, Search } from "lucide-react";
import { Input, Select } from "./ui/Field";
import { PRIORITIES, STATUSES } from "../lib/constants";
import { cn } from "../lib/cn";

const statusTabs = [{ value: "", label: "All" }, ...STATUSES];

function Segmented({ options, value, onChange, layoutId }) {
  return (
    <div className="flex rounded-lg border border-line bg-canvas/60 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            title={opt.label}
            className={cn(
              "relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              active ? "text-ink" : "text-ink-faint hover:text-ink-muted"
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-md bg-surface-2 ring-1 ring-line-strong"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {Icon && <Icon className="size-3.5" />}
              {opt.showLabel !== false && opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function TaskFilterBar({ filters, onChange, view, onViewChange }) {
  const update = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="lg:w-64">
        <Input
          icon={Search}
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
        />
      </div>
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <div className="max-w-full overflow-x-auto">
          <Segmented
            options={statusTabs}
            value={filters.status}
            onChange={(status) => update({ status })}
            layoutId="status-tab"
          />
        </div>
        <Select
          value={filters.priority}
          onChange={(e) => update({ priority: e.target.value })}
          className="h-9 text-xs"
          containerClassName="w-44"
          aria-label="Filter by priority"
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label} priority
            </option>
          ))}
        </Select>
      </div>
      <div className="self-start lg:self-auto">
        <Segmented
          options={[
            { value: "board", label: "Board", icon: KanbanSquare },
            { value: "list", label: "List", icon: List },
          ]}
          value={view}
          onChange={onViewChange}
          layoutId="view-tab"
        />
      </div>
    </div>
  );
}
