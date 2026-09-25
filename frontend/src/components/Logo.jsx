import { CheckCheck } from "lucide-react";

export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="grid size-8 place-items-center rounded-lg bg-linear-to-br from-brand to-sky-400 shadow-lg shadow-brand/30">
        <CheckCheck className="size-4 text-white" strokeWidth={2.5} />
      </span>
      <span className="text-[15px] font-semibold tracking-tight">Taskflow</span>
    </span>
  );
}
