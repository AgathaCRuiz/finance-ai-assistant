import { motion } from "framer-motion";

export type Period = "1m" | "3m" | "6m" | "12m";

interface PeriodFilterProps {
  value: Period;
  onChange: (p: Period) => void;
}

const OPTIONS: { value: Period; label: string }[] = [
  { value: "1m",  label: "1 mês"   },
  { value: "3m",  label: "3 meses" },
  { value: "6m",  label: "6 meses" },
  { value: "12m", label: "12 meses" },
];

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
      {OPTIONS.map(opt => (
        <motion.button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          whileTap={{ scale: 0.95 }}
          className="relative px-3 py-1.5 rounded-lg font-mono text-[10px] transition-colors duration-150"
          style={{ color: value === opt.value ? "var(--text-primary)" : "var(--text-muted)" }}
        >
          {value === opt.value && (
            <motion.div
              layoutId="period-pill"
              className="absolute inset-0 rounded-lg"
              style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-dim)" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            />
          )}
          <span className="relative z-10">{opt.label}</span>
        </motion.button>
      ))}
    </div>
  );
}