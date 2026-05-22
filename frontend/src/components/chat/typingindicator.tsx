import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-2">
      <div
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
      >
        <span style={{ color: "var(--accent)" }} className="font-mono text-xs font-bold">E</span>
      </div>
      <div
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            style={{ background: "var(--accent)" }}
            className="block w-1.5 h-1.5 rounded-full"
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}