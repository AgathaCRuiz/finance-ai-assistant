"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Shared helpers ──────────────────────────────────────────────────────────
const fmtCompact = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL",
    notation: "compact", maximumFractionDigits: 1,
  }).format(v);

const fmtFull = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

function SectionLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-3.5 w-0.5 rounded-full" style={{ background: color }} />
      <span style={{ color: "var(--text-muted)", fontSize: 9, letterSpacing: "0.12em",
        textTransform: "uppercase" }} className="font-mono">
        {children}
      </span>
    </div>
  );
}

// ─── CARD wrapper shared ─────────────────────────────────────────────────────
function GlowCard({
  children, glow = "rgba(34,211,238,0.06)", className = "", style = {},
}: {
  children: React.ReactNode;
  glow?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 ${className}`}
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        boxShadow: `0 0 40px ${glow}`,
        ...style,
      }}
    >
      {/* top shimmer line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(34,211,238,0.2),transparent)" }}
      />
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 1.  PATRIMONY CHART PREVIEW
// ════════════════════════════════════════════════════════════════════════════
const PAT_DATA = [
  { mes: "Jul", patrimonio: 31200, saldo: 800,  receita: 5000, gastos: 4200 },
  { mes: "Ago", patrimonio: 32800, saldo: 1200, receita: 5000, gastos: 3800 },
  { mes: "Set", patrimonio: 31500, saldo: -400, receita: 4800, gastos: 5200 },
  { mes: "Out", patrimonio: 34100, saldo: 1300, receita: 5200, gastos: 3900 },
  { mes: "Nov", patrimonio: 33600, saldo: 900,  receita: 5100, gastos: 4200 },
  { mes: "Dez", patrimonio: 36200, saldo: 1500, receita: 5300, gastos: 3800 },
  { mes: "Jan", patrimonio: 38000, saldo: 1100, receita: 5000, gastos: 3900 },
  { mes: "Fev", patrimonio: 37400, saldo: 700,  receita: 5100, gastos: 4400 },
  { mes: "Mar", patrimonio: 40100, saldo: 1800, receita: 5500, gastos: 3700 },
  { mes: "Abr", patrimonio: 43500, saldo: 2100, receita: 5600, gastos: 3500 },
  { mes: "Mai", patrimonio: 45200, saldo: 1900, receita: 5400, gastos: 3500 },
  { mes: "Jun", patrimonio: 48000, saldo: 1400, receita: 5200, gastos: 3800 },
];

type PatView = "patrimonio" | "saldo" | "receita_gastos";

const VIEWS: { key: PatView; label: string; color: string }[] = [
  { key: "patrimonio",     label: "Patrimônio",      color: "#22d3ee" },
  { key: "saldo",          label: "Saldo Mensal",    color: "#34d399" },
  { key: "receita_gastos", label: "Receita × Gasto", color: "#a78bfa" },
];

function PatCustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-bright)",
      borderRadius: 12, padding: "10px 14px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(34,211,238,0.08)",
    }}>
      <p style={{ color: "var(--accent)", fontSize: 9, letterSpacing: "0.1em",
        marginBottom: 6, textTransform: "uppercase" }} className="font-mono">
        {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--text-muted)", fontSize: 10 }} className="font-body">{p.name}:</span>
          <span style={{ color: "var(--text-primary)", fontSize: 11, fontWeight: 600 }} className="font-mono">
            {fmtFull(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PatrimonyChartPreview() {
  const [view, setView] = useState<PatView>("patrimonio");
  const activeColor = VIEWS.find(v => v.key === view)?.color ?? "#22d3ee";
  const last = PAT_DATA[PAT_DATA.length - 1];
  const first = PAT_DATA[0];
  const variacao = ((last.patrimonio - first.patrimonio) / first.patrimonio) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <GlowCard glow="rgba(34,211,238,0.07)">
        {/* ambient orb */}
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-64"
          style={{ background: "radial-gradient(circle,rgba(34,211,238,0.05),transparent 70%)", filter: "blur(16px)" }} />

        <div className="relative flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }} />
              <span style={{ color: "var(--text-muted)", fontSize: 9, letterSpacing: "0.12em" }}
                className="font-mono uppercase">Evolução Patrimonial · 12 meses</span>
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span style={{ color: "var(--text-primary)", fontSize: 26, fontWeight: 700,
                letterSpacing: "-0.03em" }} className="font-display">
                {fmtCompact(last.patrimonio)}
              </span>
              <span style={{ color: variacao >= 0 ? "#34d399" : "#f87171", fontSize: 12,
                fontWeight: 600 }} className="font-mono">
                {variacao >= 0 ? "↑" : "↓"} {Math.abs(variacao).toFixed(1)}%
              </span>
            </div>
          </div>
          {/* stat pills */}
          <div className="hidden lg:flex items-center gap-2">
            {[
              { label: "Receita média", val: 5180, color: "#34d399" },
              { label: "Gasto médio",   val: 4050, color: "#f87171" },
              { label: "Melhor saldo",  val: 2100, color: "#22d3ee" },
            ].map(s => (
              <div key={s.label} className="rounded-xl px-3 py-2"
                style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
                <p style={{ color: "var(--text-muted)", fontSize: 9, letterSpacing: "0.1em" }}
                  className="font-mono uppercase mb-0.5">{s.label}</p>
                <p style={{ color: s.color, fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em" }}
                  className="font-display">{fmtCompact(s.val)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1 mb-4">
          {VIEWS.map(v => (
            <button key={v.key} onClick={() => setView(v.key)}
              className="rounded-lg px-3 py-1.5 font-mono transition-all duration-200"
              style={{
                fontSize: 10,
                background: view === v.key ? `${v.color}18` : "var(--bg-elevated)",
                border: `1px solid ${view === v.key ? `${v.color}40` : "var(--border)"}`,
                color: view === v.key ? v.color : "var(--text-muted)",
              }}>
              {v.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={200}>
          <AnimatePresence mode="wait">
            {view === "receita_gastos" ? (
              <AreaChart key="rg" data={PAT_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.28} />
                    <stop offset="90%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f87171" stopOpacity={0.22} />
                    <stop offset="90%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtCompact} tick={{ fill: "var(--text-muted)", fontSize: 9 }} axisLine={false} tickLine={false} width={56} />
                <Tooltip content={<PatCustomTooltip />} />
                <Area type="monotone" dataKey="receita" name="Receita" stroke="#34d399" strokeWidth={2}
                  fill="url(#recGrad)" dot={{ fill: "#34d399", strokeWidth: 0, r: 2 }}
                  activeDot={{ r: 5, fill: "#34d399", strokeWidth: 0 }} />
                <Area type="monotone" dataKey="gastos" name="Gastos" stroke="#f87171" strokeWidth={2}
                  fill="url(#gasGrad)" dot={{ fill: "#f87171", strokeWidth: 0, r: 2 }}
                  activeDot={{ r: 5, fill: "#f87171", strokeWidth: 0 }} />
              </AreaChart>
            ) : (
              <AreaChart key={view} data={PAT_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={activeColor} stopOpacity={0.3} />
                    <stop offset="85%" stopColor={activeColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtCompact} tick={{ fill: "var(--text-muted)", fontSize: 9 }} axisLine={false} tickLine={false} width={56} />
                <Tooltip content={<PatCustomTooltip />} />
                <Area type="monotone" dataKey={view}
                  name={view === "patrimonio" ? "Patrimônio" : "Saldo"}
                  stroke={activeColor} strokeWidth={2.5}
                  fill="url(#mainGrad)"
                  dot={{ fill: activeColor, strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: activeColor,
                    style: { filter: `drop-shadow(0 0 8px ${activeColor})` } }}
                  style={{ filter: `drop-shadow(0 0 4px ${activeColor}44)` }}
                />
              </AreaChart>
            )}
          </AnimatePresence>
        </ResponsiveContainer>
      </GlowCard>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2.  ALLOCATION DONUT PREVIEW
// ════════════════════════════════════════════════════════════════════════════
const DONUT_DATA = [
  { cat: "Moradia",     valor: 1800 },
  { cat: "Alimentação", valor: 680  },
  { cat: "Transporte",  valor: 420  },
  { cat: "Lazer",       valor: 340  },
  { cat: "Saúde",       valor: 280  },
  { cat: "Outros",      valor: 280  },
];

const DONUT_COLORS = ["#22d3ee","#38bdf8","#818cf8","#a78bfa","#34d399","#6ee7b7"];

const R = 38, STROKE = 9;
const CIRC = 2 * Math.PI * R;
const CX = 55, CY = 55;

export function AllocationDonutPreview() {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = DONUT_DATA.reduce((s, g) => s + g.valor, 0);

  let offset = 0;
  const segs = DONUT_DATA.map((g, i) => {
    const pct  = g.valor / total;
    const dash = pct * CIRC;
    const gap  = 2;
    const s = { ...g, pct, dash: Math.max(dash - gap, 0), offset: offset + gap / 2, color: DONUT_COLORS[i] };
    offset += dash;
    return s;
  });

  const active = hovered !== null ? segs[hovered] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
    >
      <GlowCard glow="rgba(167,139,250,0.07)">
        <SectionLabel color="#a78bfa">Alocação por categoria</SectionLabel>
        <div className="flex items-center gap-4">
          {/* SVG donut */}
          <div className="relative flex-shrink-0" style={{ width: 110, height: 110 }}>
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx={CX} cy={CY} r={R} fill="none"
                stroke="var(--bg-elevated)" strokeWidth={STROKE} />
              {segs.map((s, i) => (
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
                  initial={{ strokeDasharray: `0 ${CIRC}` }}
                  animate={{ strokeDasharray: `${s.dash} ${CIRC - s.dash}` }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                  style={{
                    cursor: "pointer",
                    filter: hovered === i ? `drop-shadow(0 0 8px ${s.color}99)` : "none",
                    transition: "stroke-width 0.2s, filter 0.2s",
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              ))}
              <AnimatePresence mode="wait">
                {active ? (
                  <motion.g key={active.cat}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}>
                    <text x={CX} y={CY - 8} textAnchor="middle" fontSize="8"
                      fill="var(--text-muted)" fontFamily="monospace" letterSpacing="0.05em">
                      {active.cat.toUpperCase().slice(0, 10)}
                    </text>
                    <text x={CX} y={CY + 6} textAnchor="middle" fontSize="15"
                      fill={active.color} fontWeight="700" fontFamily="system-ui">
                      {(active.pct * 100).toFixed(0)}%
                    </text>
                    <text x={CX} y={CY + 20} textAnchor="middle" fontSize="9"
                      fill="var(--text-secondary)" fontFamily="system-ui">
                      {fmtCompact(active.valor)}
                    </text>
                  </motion.g>
                ) : (
                  <motion.g key="total"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}>
                    <text x={CX} y={CY - 4} textAnchor="middle" fontSize="8"
                      fill="var(--text-muted)" fontFamily="monospace" letterSpacing="0.05em">
                      TOTAL
                    </text>
                    <text x={CX} y={CY + 12} textAnchor="middle" fontSize="13"
                      fill="var(--text-primary)" fontWeight="700" fontFamily="system-ui">
                      {fmtCompact(total)}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {segs.map((s, i) => (
              <motion.div key={s.cat}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 mx-px transition-all duration-150"
                style={{
                  background: hovered === i ? `${s.color}12` : "transparent",
                  border: `1px solid ${hovered === i ? s.color + "30" : "transparent"}`,
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex-shrink-0 rounded-full transition-all duration-150"
                  style={{
                    background: s.color, width: hovered === i ? 9 : 7, height: hovered === i ? 9 : 7,
                    boxShadow: hovered === i ? `0 0 6px ${s.color}` : "none",
                  }} />
                <span style={{ color: hovered === i ? "var(--text-primary)" : "var(--text-secondary)" }}
                  className="flex-1 truncate text-xs font-body transition-colors">{s.cat}</span>
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
                        className="overflow-hidden whitespace-nowrap font-mono text-[9px]">
                        · {fmtCompact(s.valor)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3.  SPENDING CHART PREVIEW
// ════════════════════════════════════════════════════════════════════════════
const SPENDING_DATA = [
  { label: "Jan", valor: 3100, receita: 5000 },
  { label: "Fev", valor: 3600, receita: 5100 },
  { label: "Mar", valor: 3200, receita: 5500 },
  { label: "Abr", valor: 3900, receita: 5600 },
  { label: "Mai", valor: 3500, receita: 5400 },
  { label: "Jun", valor: 3800, receita: 5200 },
];

export function SpendingChartPreview() {
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const maxVal = Math.max(...SPENDING_DATA.map(i => i.valor));

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 },
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    barRefs.current.forEach((el, i) => {
      if (!el) return;
      const pct = (SPENDING_DATA[i].valor / maxVal) * 100;
      setTimeout(() => { el.style.height = `${pct}%`; }, i * 80);
    });
  }, [visible, maxVal]);

  const total = SPENDING_DATA.reduce((s, i) => s + i.valor, 0);
  const totalReceita = SPENDING_DATA.reduce((s, i) => s + i.receita, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      ref={containerRef}
    >
      <GlowCard glow="rgba(34,211,238,0.05)">
        <SectionLabel color="#22d3ee">Gastos últimos 6 meses</SectionLabel>

        <div className="relative" style={{ height: 140 }}>
          <div className="absolute inset-0 flex items-end gap-2 pb-6">
            {SPENDING_DATA.map((item, i) => {
              const isLast = i === SPENDING_DATA.length - 1;
              const isHov  = hovered === i;

              return (
                <div key={item.label}
                  className="relative flex h-full flex-1 flex-col items-center justify-end"
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
                        className="pointer-events-none absolute bottom-full z-50 mb-1 whitespace-nowrap rounded-xl"
                        style={{
                          background: "var(--bg-elevated)",
                          border: "1px solid var(--border-bright)",
                          padding: "8px 10px", minWidth: 110,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 0 16px rgba(34,211,238,0.08)",
                          left: "50%", transform: "translateX(-50%)",
                        }}
                      >
                        <p style={{ color: "var(--text-muted)", fontSize: 9,
                          letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}
                          className="font-mono">{item.label}</p>
                        <p style={{ color: "#22d3ee", fontSize: 13, fontWeight: 700 }}
                          className="font-mono">{fmtFull(item.valor)}</p>
                        <div style={{ borderTop: "1px solid var(--border)", marginTop: 5, paddingTop: 4 }}>
                          <p style={{ color: "var(--text-muted)", fontSize: 9 }} className="font-mono">
                            Receita: {fmtCompact(item.receita)}
                          </p>
                          <p style={{ color: item.receita > item.valor ? "#34d399" : "#f87171", fontSize: 9 }}
                            className="font-mono">
                            Saldo: {fmtCompact(item.receita - item.valor)}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bar */}
                  <div
                    ref={el => { barRefs.current[i] = el; }}
                    className="w-full rounded-t-md"
                    style={{
                      height: "0%",
                      minHeight: 4,
                      background: isHov
                        ? "linear-gradient(180deg,#67e8f9,#22d3ee)"
                        : isLast
                          ? "linear-gradient(180deg,#22d3ee,#0e7490)"
                          : `linear-gradient(180deg,rgba(34,211,238,${0.5 - i * 0.06}),rgba(14,116,144,${0.3 - i * 0.03}))`,
                      boxShadow: isHov
                        ? "0 0 18px rgba(34,211,238,0.5)"
                        : isLast ? "0 0 14px rgba(34,211,238,0.35)" : "none",
                      cursor: "pointer",
                      transition: "height 0.7s cubic-bezier(0.4,0,0.2,1), background 0.2s, box-shadow 0.2s",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* X labels */}
          <div className="absolute bottom-0 left-0 right-0 flex gap-2" style={{ height: 20 }}>
            {SPENDING_DATA.map((item, i) => (
              <div key={item.label} className="flex flex-1 items-center justify-center">
                <span style={{
                  color: hovered === i ? "var(--text-primary)" : "var(--text-muted)",
                  fontSize: 9,
                }} className="truncate text-center font-mono transition-colors">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 flex justify-between border-t pt-2" style={{ borderColor: "var(--border)" }}>
          <span style={{ color: "var(--text-muted)", fontSize: 9 }} className="font-mono">
            Receita: {fmtCompact(totalReceita / SPENDING_DATA.length)}/mês
          </span>
          <span style={{ color: "#34d399", fontSize: 9 }} className="font-mono">
            Saldo médio: {fmtCompact((totalReceita - total) / SPENDING_DATA.length)}
          </span>
        </div>
      </GlowCard>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4.  INSIGHTS PANEL PREVIEW
// ════════════════════════════════════════════════════════════════════════════
const DEMO_INSIGHTS = [
  {
    icon: "↑", title: "Saldo positivo este mês",
    desc: "Você poupou 27% da renda.",
    detail: "Receita: R$5.200 · Gastos: R$3.800 · Sobra: R$1.400",
    bg: "#0d2518", color: "#34d399",
  },
  {
    icon: "!", title: "Moradia acima do ideal",
    desc: "42% dos gastos em moradia.",
    detail: "Recomendado pela regra 50/30/20: até 30% da renda para necessidades.",
    bg: "#2d1515", color: "#f87171",
  },
  {
    icon: "★", title: "Reserva em andamento",
    desc: "Faltam R$5.000 para completar.",
    detail: "67% concluída · R$10.000 / R$15.000 · Cobre 4,2 meses.",
    bg: "#1a1035", color: "#a78bfa",
  },
];

export function InsightsPanelPreview() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
    >
      <GlowCard glow="rgba(245,158,11,0.06)">
        <SectionLabel color="#f59e0b">Insights da IA</SectionLabel>

        <div className="flex flex-col">
          {DEMO_INSIGHTS.map((ins, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="py-3 first:pt-0 last:pb-0"
              style={{ borderBottom: i < DEMO_INSIGHTS.length - 1 ? "1px solid var(--border)" : "none" }}
            >
              <button
                className="group flex w-full cursor-pointer items-start gap-3 text-left"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all duration-200 group-hover:scale-110"
                  style={{ background: ins.bg, color: ins.color,
                    boxShadow: expanded === i ? `0 0 12px ${ins.color}44` : "none" }}>
                  {ins.icon}
                </div>
                <div className="flex-1">
                  <p style={{ color: "var(--text-primary)" }} className="mb-0.5 text-xs font-medium font-body">
                    {ins.title}
                  </p>
                  <p style={{ color: "var(--text-muted)" }} className="text-xs font-body leading-relaxed">
                    {ins.desc}
                  </p>
                  <AnimatePresence>
                    {expanded === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 6 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ color: ins.color, fontSize: 10, borderLeft: `2px solid ${ins.color}40`,
                          paddingLeft: 8, overflow: "hidden" }}
                        className="font-mono leading-relaxed">
                        {ins.detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: 10, marginTop: 1, flexShrink: 0,
                  transform: expanded === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  ▾
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </GlowCard>
    </motion.div>
  );
}