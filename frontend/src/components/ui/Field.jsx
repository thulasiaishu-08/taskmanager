import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

const control =
  "w-full rounded-lg bg-canvas/60 border border-line px-3 text-sm text-ink placeholder:text-ink-faint outline-none transition focus:border-brand/60 focus:ring-4 focus:ring-brand/15";

export function Label({ children, htmlFor, className }) {
  return (
    <label htmlFor={htmlFor} className={cn("text-xs font-medium text-ink-muted", className)}>
      {children}
    </label>
  );
}

export function Input({ className, icon: Icon, ...props }) {
  if (!Icon) return <input className={cn(control, "h-10", className)} {...props} />;
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
      <input className={cn(control, "h-10 pl-9", className)} {...props} />
    </div>
  );
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn(control, "py-2.5 resize-none", className)} {...props} />;
}

export function Select({ className, containerClassName, children, ...props }) {
  return (
    <div className={cn("relative", containerClassName)}>
      <select className={cn(control, "h-10 cursor-pointer appearance-none pr-8", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
    </div>
  );
}

export function Field({ label, htmlFor, children, className }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
    </div>
  );
}
