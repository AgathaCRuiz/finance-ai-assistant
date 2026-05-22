import { useState, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ children, content, side = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const positions = {
    top:    "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left:   "right-full top-1/2 -translate-y-1/2 mr-2",
    right:  "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div ref={ref} className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: side === "top" ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 pointer-events-none w-max max-w-[220px] ${positions[side]}`}
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-bright)",
              borderRadius: "10px",
              padding: "10px 12px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(34,211,238,0.08)",
            }}
          >
            {/* Linha de destaque no topo */}
            <div className="absolute top-0 left-3 right-3 h-[1px] rounded-full"
              style={{ background: "linear-gradient(90deg,transparent,var(--accent),transparent)", opacity: 0.4 }} />
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Conteúdo padrão de tooltip para KPIs
interface KpiTooltipContentProps {
  label: string;
  value: string;
  detail?: string;
  trend?: string;
  trendColor?: string;
}

export function KpiTooltipContent({ label, value, detail, trend, trendColor = "#22d3ee" }: KpiTooltipContentProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase tracking-widest">
        {label}
      </span>
      <span style={{ color: "var(--text-primary)" }} className="font-display text-lg font-bold tracking-tight">
        {value}
      </span>
      {trend && (
        <span style={{ color: trendColor }} className="font-mono text-[10px]">{trend}</span>
      )}
      {detail && (
        <span style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}
          className="font-body text-[10px] pt-1.5 mt-0.5 leading-relaxed">
          {detail}
        </span>
      )}
    </div>
  );
}