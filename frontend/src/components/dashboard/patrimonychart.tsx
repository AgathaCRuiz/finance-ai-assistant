import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { useEvolucao } from "@/hooks/useevolucao";

type View = "patrimonio" | "saldo" | "receita_gastos";

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL",
    notation: "compact", maximumFractionDigits: 1,
  }).format(v);
}
function fmtFull(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-bright)",
      borderRadius: 12,
      padding: "10px 14px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    }}>
      <p style={{ color: "var(--accent)", fontSize: 9, letterSpacing: "0.1em", marginBottom: 6 }}
        className="font-mono uppercase">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--text-muted)", fontSize: 10 }} className="font-body">{p.name}:</span>
          <span style={{ color: "var(--text-primary)", fontSize: 11, fontWeight: 600 }} className="font-mono">
            {fmtFull(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

const VIEWS: { key: View; label: string; color: string }[] = [
  { key: "patrimonio",     label: "Patrimônio",      color: "#22d3ee" },
  { key: "saldo",          label: "Saldo Mensal",    color: "#34d399" },
  { key: "receita_gastos", label: "Receita × Gasto", color: "#a78bfa" },
];

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}
      className="rounded-xl px-3 py-2">
      <p style={{ color: "var(--text-muted)", fontSize: 9 }} className="font-mono uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <p style={{ color, fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em" }} className="font-display">
        {fmt(value)}
      </p>
    </div>
  );
}

export function PatrimonyChart() {
  const { data, status } = useEvolucao();
  const [view, setView] = useState<View>("patrimonio");

  const ultimo   = data?.[data.length - 1];
  const primeiro = data?.[0];
  const variacao = ultimo && primeiro
    ? ((ultimo.patrimonio - primeiro.patrimonio) / primeiro.patrimonio) * 100
    : 0;

  const activeColor = VIEWS.find(v => v.key === view)?.color ?? "#22d3ee";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 0 40px var(--accent-glow)",
      }}
    >
      {/* Linha de brilho no topo */}
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: "linear-gradient(90deg,transparent,var(--accent),transparent)", opacity: 0.3 }} />

      {/* Orb */}
      <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
        style={{ background: "radial-gradient(circle,var(--accent-glow),transparent 70%)", filter: "blur(20px)" }} />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }} />
              <span style={{ color: "var(--text-muted)", fontSize: 9, letterSpacing: "0.12em" }}
                className="font-mono uppercase">Evolução Patrimonial · 12 meses</span>
            </div>
            {ultimo && (
              <div className="flex items-baseline gap-3 mt-1">
                <span style={{ color: "var(--text-primary)", fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em" }}
                  className="font-display">
                  {fmt(ultimo.patrimonio)}
                </span>
                <span style={{ color: variacao >= 0 ? "#34d399" : "#f87171", fontSize: 12, fontWeight: 600 }}
                  className="font-mono">
                  {variacao >= 0 ? "↑" : "↓"} {Math.abs(variacao).toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {data && (
            <div className="hidden lg:flex items-center gap-2">
              <StatPill label="Receita média" color="#34d399"
                value={data.reduce((s, d) => s + d.receita, 0) / data.length} />
              <StatPill label="Gasto médio" color="#f87171"
                value={data.reduce((s, d) => s + d.gastos, 0) / data.length} />
              <StatPill label="Melhor saldo" color="var(--accent)"
                value={Math.max(...data.map(d => d.saldo))} />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4 flex-wrap">
          {VIEWS.map(v => (
            <button key={v.key} onClick={() => setView(v.key)}
              className="px-3 py-1.5 rounded-lg font-mono text-[10px] transition-all duration-200"
              style={{
                background: view === v.key ? `${v.color}18` : "var(--bg-elevated)",
                border: `1px solid ${view === v.key ? `${v.color}40` : "var(--border)"}`,
                color: view === v.key ? v.color : "var(--text-muted)",
              }}>
              {v.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="h-48 flex items-center justify-center">
            <div className="flex gap-1.5">
              {[0,1,2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--accent)" }}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
              ))}
            </div>
          </div>
        )}

        {/* Gráfico */}
        {status === "success" && data && (
          <ResponsiveContainer width="100%" height={220}>
            {view === "receita_gastos" ? (
              <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="receitaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="90%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gastosGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f87171" stopOpacity={0.25} />
                    <stop offset="90%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmt} tick={{ fill: "var(--text-muted)", fontSize: 9 }} axisLine={false} tickLine={false} width={58} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="receita" name="Receita" stroke="#34d399" strokeWidth={2}
                  fill="url(#receitaGrad)" dot={{ fill: "#34d399", strokeWidth: 0, r: 2 }}
                  activeDot={{ r: 5, fill: "#34d399", strokeWidth: 0 }} />
                <Area type="monotone" dataKey="gastos" name="Gastos" stroke="#f87171" strokeWidth={2}
                  fill="url(#gastosGrad)" dot={{ fill: "#f87171", strokeWidth: 0, r: 2 }}
                  activeDot={{ r: 5, fill: "#f87171", strokeWidth: 0 }} />
              </AreaChart>
            ) : (
              <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={activeColor} stopOpacity={0.3} />
                    <stop offset="85%" stopColor={activeColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmt} tick={{ fill: "var(--text-muted)", fontSize: 9 }} axisLine={false} tickLine={false} width={58} />
                <Tooltip content={<CustomTooltip />} />
                {view === "saldo" && <ReferenceLine y={0} stroke="var(--border-bright)" strokeDasharray="4 4" />}
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
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}