import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

const variants = {
  primary:
    "bg-linear-to-b from-brand to-brand-strong text-white shadow-[0_8px_24px_-8px_rgb(124_108_255/0.7)] hover:brightness-110",
  secondary: "bg-surface-2 text-ink border border-line hover:border-line-strong hover:bg-white/[0.06]",
  ghost: "text-ink-muted hover:text-ink hover:bg-white/[0.06]",
  danger: "bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20",
};

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  icon: "h-8 w-8 justify-center",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center rounded-lg font-medium transition-[background,border,filter,color] duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-brand/60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </motion.button>
  );
}
