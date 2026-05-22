import type { GastoCategoria } from "@/types/api";

interface PortfolioSummaryProps { gastos: GastoCategoria[]; }

const COLORS = ["#22d3ee","#67e8f9","#a5f3fc","#0e7490","#164e63","#cffafe"];

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 }).format(v);
}

export function PortfolioSummary({ gastos }: PortfolioSummaryProps) {
  if (!gastos.length) return null;
  const total = gastos.reduce((s, g) => s + g.valor, 0);

  return (
    <div style={{ borderBottom: "1px solid var(--border)" }} className="px-4 py-4">
      <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] tracking-widest uppercase">Gastos por categoria</span>

      {/* Barra segmentada */}
      <div className="flex rounded-full overflow-hidden h-1.5 mt-2 mb-3 gap-px">
        {gastos.map((g, i) => (
          <div key={g.cat} style={{ width: `${(g.valor / total) * 100}%`, background: COLORS[i % COLORS.length] }} />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {gastos.map((g, i) => (
          <div key={g.cat} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span style={{ color: "var(--text-secondary)" }} className="font-body text-xs">{g.cat}</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px]">{((g.valor / total) * 100).toFixed(0)}%</span>
              <span style={{ color: "var(--text-secondary)" }} className="font-mono text-xs">{fmt(g.valor)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}