import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GastoCategoria, MetricasDados, HistoricoMensal } from "@/types/api";

interface SpendingChartProps {
  gastos: GastoCategoria[];
  metricas: MetricasDados;
  historico?: HistoricoMensal[];
}

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL",
    notation: "compact", maximumFractionDigits: 1,
  }).format(v);
}
function fmtFull(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export function SpendingChart({ gastos, metricas, historico }: SpendingChartProps) {
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  const usandoHistorico = historico && historico.length > 0;
  const items = usandoHistorico
    ? historico!.map(h => ({ label: h.mes, valor: h.gastos, receita: h.receita }))
    : gastos.map(g => ({ label: g.cat.slice(0, 8), valor: g.valor, receita: 0 }));

  const maxVal = Math.max(...items.map(i => i.valor), 1);

  useEffect(() => {
    barRefs.current.forEach((el, i) => {
      if (!el) return;
      const pct = (items[i].valor / maxVal) * 100;
      setTimeout(() => { el.style.height = `${pct}%`; }, i * 80);
    });
  }, [items, maxVal]);

  return (
    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      className="rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full" style={{ background: "#22d3ee" }} />
          <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase tracking-widest">
            {usandoHistorico ? "Gastos últimos 6 meses" : "Gastos por categoria"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {metricas.mes_referencia && (
            <span style={{ color: "var(--accent)" }} className="font-mono text-[9px]">
              Ref: {metricas.mes_referencia}
            </span>
          )}
          <span style={{ color: "var(--text-secondary)" }} className="font-mono text-[10px]">
            Total: {fmt(metricas.total_gastos)}
          </span>
        </div>
      </div>

      <div className="flex items-end gap-2 h-32 relative">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const isHov  = hovered === i;
          return (
            <div key={item.label}
              className="flex flex-col items-center gap-1.5 flex-1 h-full justify-end relative"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              <AnimatePresence>
                {isHov && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full mb-2 z-50 pointer-events-none"
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border-bright)",
                      borderRadius: 10,
                      padding: "8px 10px",
                      minWidth: 120,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div className="absolute top-0 left-3 right-3 h-[1px] rounded-full"
                      style={{ background: "linear-gradient(90deg,transparent,#22d3ee,transparent)", opacity: 0.4 }} />
                    <p style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase tracking-widest mb-1">
                      {item.label}
                    </p>
                    <p style={{ color: "#22d3ee" }} className="font-mono text-sm font-bold">
                      {fmtFull(item.valor)}
                    </p>
                    {item.receita > 0 && (
                      <>
                        <p style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}
                          className="font-mono text-[9px] mt-1.5 pt-1.5">
                          Receita: {fmt(item.receita)}
                        </p>
                        <p style={{ color: item.receita > item.valor ? "#34d399" : "#f87171" }}
                          className="font-mono text-[9px]">
                          Saldo: {fmt(item.receita - item.valor)}
                        </p>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative w-full flex items-end" style={{ height: "80%" }}>
                <div
                  ref={el => { barRefs.current[i] = el; }}
                  className="w-full rounded-t-md transition-all duration-700"
                  style={{
                    height: "0%",
                    background: isHov
                      ? "linear-gradient(180deg,#67e8f9,#22d3ee)"
                      : isLast
                        ? "linear-gradient(180deg,#22d3ee,#0e7490)"
                        : `linear-gradient(180deg,rgba(34,211,238,${0.5 - i * 0.06}),rgba(14,116,144,${0.3 - i * 0.03}))`,
                    boxShadow: isHov ? "0 0 16px rgba(34,211,238,0.4)" : isLast ? "0 0 12px rgba(34,211,238,0.3)" : "none",
                    cursor: "pointer",
                  }}
                />
              </div>
              <span style={{ color: isHov ? "var(--text-primary)" : "var(--text-muted)" }}
                className="font-mono text-[9px] truncate max-w-full text-center transition-colors">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex justify-between">
          <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px]">
            Receita: {fmt(metricas.total_receita)}
          </span>
          <span style={{ color: metricas.saldo_mes >= 0 ? "#34d399" : "#f87171" }}
            className="font-mono text-[9px]">
            Saldo: {fmt(metricas.saldo_mes)}
          </span>
        </div>
      </div>
    </div>
  );
}