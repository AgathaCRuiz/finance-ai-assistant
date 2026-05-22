import { motion } from "framer-motion";
import type { MetaDados, ReservaDados } from "@/types/api";

interface GoalsProgressProps { metas: MetaDados[]; reserva: ReservaDados; }

const COLORS = ["#22d3ee", "#a78bfa", "#34d399", "#f59e0b"];

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 }).format(v);
}

export function GoalsProgress({ metas, reserva }: GoalsProgressProps) {
  return (
    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      className="rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 rounded-full" style={{ background: "#34d399" }} />
        <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase tracking-widest">
          Progresso das metas
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {metas.map((m, i) => {
          const pct = m.progresso ?? Math.min((reserva.atual / m.necessario) * 100, 100);
          const color = COLORS[i % COLORS.length];
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ color: "var(--text-secondary)" }} className="font-body text-xs">{m.meta}</span>
                <div className="flex items-center gap-2">
                  <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px]">{fmt(m.necessario)}</span>
                  <span style={{ color }} className="font-mono text-[10px] font-semibold">{pct.toFixed(0)}%</span>
                </div>
              </div>
              <div style={{ background: "var(--bg-elevated)" }} className="h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: color, boxShadow: `0 0 8px ${color}55` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px]">Prazo: {m.prazo}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}