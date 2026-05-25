import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GastoCategoria } from "@/types/api";

interface AllocationDonutProps { gastos: GastoCategoria[]; }

const COLORS = [
  "#22d3ee", "#38bdf8", "#818cf8", "#a78bfa",
  "#34d399", "#6ee7b7", "#fbbf24", "#fb923c",
];

const R       = 54;
const STROKE  = 10;
const CIRC    = 2 * Math.PI * R;
const CX = 80;
const CY = 80;

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1,
  }).format(v);
}
function fmtFull(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export function AllocationDonut({ gastos }: AllocationDonutProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = gastos.reduce((s, g) => s + g.valor, 0);

  let offset = 0;
  const segments = gastos.map((g, i) => {
    const pct  = g.valor / total;
    const dash = pct * CIRC;
    const gap  = 2; // gap entre segmentos
    const seg  = {
      cat: g.cat, valor: g.valor, pct,
      dash: Math.max(dash - gap, 0),
      offset: offset + gap / 2,
      color: COLORS[i % COLORS.length],
    };
    offset += dash;
    return seg;
  });

  const active = hovered !== null ? segments[hovered] : null;

  return (
    <div
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      className="rounded-xl p-4 flex flex-col"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 rounded-full" style={{ background: "#a78bfa" }} />
        <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase tracking-widest">
          Alocação por categoria
        </span>
      </div>

      <div className="flex flex-1 items-center gap-5">
        {/* Donut SVG */}
        <div className="flex-shrink-0 relative" style={{ width: 160, height: 160 }}>
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Trilha */}
            <circle cx={CX} cy={CY} r={R} fill="none"
              stroke="var(--bg-elevated)" strokeWidth={STROKE} />

            {/* Segmentos */}
            {segments.map((s, i) => (
              <motion.circle
                key={s.cat}
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={hovered === i ? STROKE + 4 : STROKE}
                strokeDasharray={`${s.dash} ${CIRC - s.dash}`}
                strokeDashoffset={-s.offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${CX} ${CY})`}
                style={{
                  cursor: "pointer",
                  filter: hovered === i ? `drop-shadow(0 0 8px ${s.color}88)` : "none",
                  transition: "stroke-width 0.2s, filter 0.2s",
                }}
                initial={{ strokeDasharray: `0 ${CIRC}` }}
                animate={{ strokeDasharray: `${s.dash} ${CIRC - s.dash}` }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}

            {/* Centro — muda ao hover */}
            <AnimatePresence mode="wait">
              {active ? (
                <motion.g key={active.cat}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}>
                  <text x={CX} y={CY - 10} textAnchor="middle" fontSize="9"
                    fill="var(--text-muted)" fontFamily="monospace" letterSpacing="0.05em">
                    {active.cat.toUpperCase().slice(0, 10)}
                  </text>
                  <text x={CX} y={CY + 6} textAnchor="middle" fontSize="15"
                    fill={active.color} fontWeight="700" fontFamily="system-ui">
                    {(active.pct * 100).toFixed(0)}%
                  </text>
                  <text x={CX} y={CY + 22} textAnchor="middle" fontSize="9"
                    fill="var(--text-secondary)" fontFamily="system-ui">
                    {fmt(active.valor)}
                  </text>
                </motion.g>
              ) : (
                <motion.g key="total"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}>
                  <text x={CX} y={CY - 6} textAnchor="middle" fontSize="9"
                    fill="var(--text-muted)" fontFamily="monospace" letterSpacing="0.05em">
                    TOTAL
                  </text>
                  <text x={CX} y={CY + 12} textAnchor="middle" fontSize="13"
                    fill="var(--text-primary)" fontWeight="700" fontFamily="system-ui">
                    {fmt(total)}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        </div>

        {/* Legenda */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {segments.map((s, i) => (
            <motion.div
              key={s.cat}
              className="flex items-center gap-2 rounded-lg px-2 py-1 cursor-pointer transition-all duration-150 mx-px"
              style={{
                background: hovered === i ? `${s.color}12` : "transparent",
                border: `1px solid ${hovered === i ? s.color + "30" : "transparent"}`,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{ scale: 1.01 }}
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-150"
                style={{
                  background: s.color,
                  boxShadow: hovered === i ? `0 0 6px ${s.color}` : "none",
                  width: hovered === i ? 10 : 8,
                  height: hovered === i ? 10 : 8,
                }} />
              <span
                style={{ color: hovered === i ? "var(--text-primary)" : "var(--text-secondary)" }}
                className="font-body text-xs flex-1 truncate transition-colors"
              >
                {s.cat}
              </span>
              <div className="flex items-center gap-1.5">
                <span style={{ color: hovered === i ? s.color : "var(--text-muted)" }}
                  className="font-mono text-[9px] transition-colors">
                  {(s.pct * 100).toFixed(0)}%
                </span>
                <AnimatePresence>
                  {hovered === i && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      style={{ color: s.color }}
                      className="font-mono text-[9px] overflow-hidden whitespace-nowrap"
                    >
                      · {fmt(s.valor)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}