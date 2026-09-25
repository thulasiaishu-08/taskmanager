import { motion } from "motion/react";
import { GripVertical, Search, ShieldCheck } from "lucide-react";
import Logo from "./Logo";

const features = [
  { icon: GripVertical, text: "Drag tasks across a live Kanban board" },
  { icon: Search, text: "Filter and search by status, priority, or title" },
  { icon: ShieldCheck, text: "Private workspaces secured with JWT auth" },
];

const previewCards = [
  { title: "Design landing page", tag: "In progress", color: "var(--color-progress)", rotate: -4, x: 0, y: 0 },
  { title: "Set up CI pipeline", tag: "Completed", color: "var(--color-done)", rotate: 3, x: 56, y: 88 },
  { title: "Write API docs", tag: "To do", color: "var(--color-todo)", rotate: -2, x: 16, y: 176 },
];

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden border-r border-line lg:flex lg:flex-col lg:justify-between p-12">
        <div className="absolute inset-0 bg-[radial-gradient(40rem_28rem_at_20%_30%,rgb(124_108_255/0.22),transparent_70%)]" />
        <Logo className="relative" />

        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gradient max-w-md text-4xl font-semibold leading-tight tracking-tight"
          >
            Plan projects. Ship tasks. Stay in flow.
          </motion.h1>
          <ul className="mt-8 space-y-4">
            {features.map(({ icon: Icon, text }, i) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 text-sm text-ink-muted"
              >
                <span className="grid size-8 place-items-center rounded-lg border border-line bg-surface">
                  <Icon className="size-4 text-brand" />
                </span>
                {text}
              </motion.li>
            ))}
          </ul>

          <div className="relative mt-14 h-64">
            {previewCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30, rotate: 0 }}
                animate={{ opacity: 1, y: [card.y, card.y - 8, card.y], rotate: card.rotate }}
                transition={{
                  opacity: { delay: 0.4 + i * 0.12 },
                  rotate: { delay: 0.4 + i * 0.12, type: "spring" },
                  y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 },
                }}
                style={{ left: card.x }}
                className="glass absolute w-64 rounded-xl p-4 shadow-2xl shadow-black/40"
              >
                <p className="text-sm font-medium">{card.title}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[11px]" style={{ color: card.color }}>
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: card.color }} />
                  {card.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-ink-faint">FastAPI · PostgreSQL · React</p>
      </aside>

      <main className="flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="w-full max-w-sm"
        >
          <Logo className="mb-10 lg:hidden" />
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-1.5 mb-8 text-sm text-ink-muted">{subtitle}</p>
          {children}
        </motion.div>
      </main>
    </div>
  );
}
