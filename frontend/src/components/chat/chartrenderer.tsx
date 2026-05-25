import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { motion } from "framer-motion";

export type ChartData =
  | { type: "bar";   title: string; data: { name: string; value: number }[]; color?: string }
  | { type: "line";  title: string; data: { name: string; value: number }[]; color?: string }
  | { type: "pie";   title: string; data: { name: string; value: number }[]; colors?: string[] }
  | { type: "table"; title: string; columns: string[]; rows: string[][] };

const MARGIN = { top: 8, right: 8, left: 0, bottom: 0 };

const PIE_COLORS = [
  "#22d3ee", "#0e7490", "#6366f1",
  "#8b5cf6", "#38bdf8", "#4f46e5",
];

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL",
    notation: "compact", maximumFractionDigits: 1,
  }).format(v);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tooltipFormatter = (value: any): [string, string] => [fmt(Number(value ?? 0)), "Valor"];

// Tooltip usa variáveis CSS — funciona em claro e escuro
const tooltipProps = {
  formatter: tooltipFormatter as never,
  contentStyle: {
    background: "var(--bg-elevated)",
    border: "1px solid var(--border-bright)",
    borderRadius: 10,
    fontSize: 11,
    color: "var(--text-primary)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  },
  cursor: { fill: "var(--accent-glow)" },
};

function BarViz({ data }: { data: Extract<ChartData, { type: "bar" }> }) {
  const color = data.color ?? "#22d3ee";
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data.data} margin={MARGIN}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.15} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(v: number) => fmt(v)} tick={{ fill: "var(--text-muted)", fontSize: 9 }} axisLine={false} tickLine={false} width={58} />
        <Tooltip {...tooltipProps} />
        <Bar dataKey="value" fill="url(#barGrad)" radius={6}
          style={{ filter: `drop-shadow(0 0 6px ${color}55)` }} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function LineViz({ data }: { data: Extract<ChartData, { type: "line" }> }) {
  const color = data.color ?? "#22d3ee";
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data.data} margin={MARGIN}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="85%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(v: number) => fmt(v)} tick={{ fill: "var(--text-muted)", fontSize: 9 }} axisLine={false} tickLine={false} width={58} />
        <Tooltip {...tooltipProps} />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5}
          fill="url(#lineGrad)"
          dot={{ fill: color, strokeWidth: 0, r: 3, style: { filter: `drop-shadow(0 0 4px ${color})` } }}
          activeDot={{ r: 6, fill: color, strokeWidth: 0, style: { filter: `drop-shadow(0 0 8px ${color})` } }}
          style={{ filter: `drop-shadow(0 0 4px ${color}44)` }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function PieViz({ data }: { data: Extract<ChartData, { type: "pie" }> }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <defs>
          {PIE_COLORS.map((color, i) => (
            <linearGradient key={i} id={`pieGrad${i}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="100%" stopColor={color} stopOpacity={0.6} />
            </linearGradient>
          ))}
        </defs>
        <Pie data={data.data} cx="50%" cy="44%" innerRadius={55} outerRadius={80}
          dataKey="value" paddingAngle={3} strokeWidth={0}>
          {data.data.map((_, i) => (
            <Cell key={i} fill={`url(#pieGrad${i % PIE_COLORS.length})`}
              style={{ filter: `drop-shadow(0 0 6px ${PIE_COLORS[i % PIE_COLORS.length]}66)` }} />
          ))}
        </Pie>
        <Tooltip {...tooltipProps} />
        <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10, paddingTop: 6 }}
          formatter={(value: string) => (
            <span style={{ color: "var(--text-secondary)" }}>{value}</span>
          )} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function TableViz({ data }: { data: Extract<ChartData, { type: "table" }> }) {
  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border)" }}>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr style={{
            background: "var(--accent-glow)",
            borderBottom: "1px solid var(--border)",
          }}>
            {data.columns.map((col, i) => (
              <th key={i} className="text-left px-3 py-2.5 font-mono font-medium tracking-wide"
                style={{ color: "var(--accent)" }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i}
              style={{
                background: i % 2 === 0 ? "transparent" : "var(--bg-hover)",
                borderBottom: "1px solid var(--border)",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-glow)")}
              onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "var(--bg-hover)")}
            >
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2"
                  style={{ color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: j === 0 ? 500 : 400 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ChartRendererProps { chart: ChartData }

export function ChartRenderer({ chart }: ChartRendererProps) {
  const typeLabel: Record<string, string> = {
    bar: "■ barras", line: "∿ área", pie: "◉ pizza", table: "⊞ tabela",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-3 rounded-2xl overflow-hidden relative"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 0 40px var(--accent-glow)",
      }}
    >
      {/* Linha de brilho */}
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: "linear-gradient(90deg,transparent,var(--accent),transparent)", opacity: 0.3 }} />


      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }} />
        <span className="font-mono text-[9px] uppercase tracking-widest"
          style={{ color: "var(--accent)" }}>
          {chart.title}
        </span>
        <span className="font-mono text-[9px] ml-auto" style={{ color: "var(--text-muted)" }}>
          {typeLabel[chart.type] ?? chart.type}
        </span>
      </div>

      <div className="px-3 py-3">
        {chart.type === "bar"   && <BarViz   data={chart} />}
        {chart.type === "line"  && <LineViz  data={chart} />}
        {chart.type === "pie"   && <PieViz   data={chart} />}
        {chart.type === "table" && <TableViz data={chart} />}
      </div>
    </motion.div>
  );
}

export function parseChartFromContent(content: string): { text: string; chart: ChartData | null } {
  const match = content.match(/```chart\n([\s\S]*?)\n```/);
  if (!match) return { text: content, chart: null };
  try {
    const chart = JSON.parse(match[1]) as ChartData;
    const text  = content.replace(/```chart\n[\s\S]*?\n```/, "").trim();
    return { text, chart };
  } catch {
    return { text: content, chart: null };
  }
}

export function stripChartBlock(content: string): string {
  if (content.includes("```chart")) {
    return content.replace(/```chart[\s\S]*?```/g, "").trim();
  }
  return content;
}