import type { MetaDados } from "@/types/api";

interface GoalsListProps { metas: MetaDados[]; }

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 }).format(v);
}

export function GoalsList({ metas }: GoalsListProps) {
  if (!metas.length) return null;

  return (
    <div className="px-4 py-4">
      <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] tracking-widest uppercase">Metas</span>
      <div className="flex flex-col gap-3 mt-2">
        {metas.map((m, i) => (
          <div key={i}>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span style={{ color: "var(--text-secondary)" }} className="font-body text-xs leading-tight flex-1">{m.meta}</span>
              <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] flex-shrink-0">{m.prazo}</span>
            </div>
            {m.progresso !== null ? (
              <>
                <div style={{ background: "var(--bg-elevated)" }} className="h-1.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(m.progresso, 100)}%`, background: "var(--accent)", boxShadow: "0 0 6px var(--accent-glow)" }}
                    className="h-full rounded-full transition-all duration-700"
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span style={{ color: "var(--accent)" }} className="font-mono text-[9px]">{m.progresso}%</span>
                  <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px]">{fmt(m.necessario)}</span>
                </div>
              </>
            ) : (
              <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px]">Meta: {fmt(m.necessario)}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}