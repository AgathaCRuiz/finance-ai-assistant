import type { PerfilDados, MetricasDados, ReservaDados } from "@/types/api";

interface InvestorCardProps {
  perfil: PerfilDados;
  metricas: MetricasDados;
  reserva: ReservaDados;
}

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 }).format(v);
}

export function InvestorCard({ perfil, metricas, reserva }: InvestorCardProps) {
  const initials = perfil.nome.split(" ").slice(0, 2).map((n) => n[0]).join("");
  const saldoPos = metricas.saldo_mes >= 0;

  return (
    <div style={{ borderBottom: "1px solid var(--border)" }} className="px-4 py-4">

      {/* Avatar + nome */}
      <div className="flex items-center gap-3 mb-4">
        <div
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-bright)", boxShadow: "0 0 12px var(--accent-glow)" }}
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        >
          <span style={{ color: "var(--accent)" }} className="font-display text-sm font-bold">{initials}</span>
        </div>
        <div>
          <p style={{ color: "var(--text-primary)" }} className="font-display text-sm font-semibold leading-tight">{perfil.nome}</p>
          <span style={{ color: "var(--accent)", background: "var(--accent-glow)", border: "1px solid var(--accent-dim)" }}
            className="font-mono text-[9px] rounded px-1.5 py-0.5 inline-block mt-0.5">
            {perfil.perfil_investidor.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Patrimônio */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} className="rounded-xl p-3 mb-3">
        <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] tracking-widest uppercase">Patrimônio</span>
        <p style={{ color: "var(--text-primary)" }} className="font-display text-xl font-bold tracking-tight mt-0.5">
          {fmt(perfil.patrimonio_total)}
        </p>
        <p style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] mt-1">
          Renda: <span style={{ color: "var(--text-secondary)" }}>{fmt(perfil.renda_mensal)}</span>
        </p>
      </div>

      {/* Métricas — sem cores marcantes, só texto */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { label: "Gastos", value: fmt(metricas.total_gastos) },
          { label: "Saldo", value: fmt(metricas.saldo_mes), accent: saldoPos },
        ].map((m) => (
          <div key={m.label} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} className="rounded-lg p-2">
            <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase tracking-wider">{m.label}</span>
            <p
              style={{ color: m.accent === undefined ? "var(--text-primary)" : m.accent ? "var(--positive)" : "var(--negative)" }}
              className="font-mono text-sm font-semibold mt-0.5"
            >
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Reserva */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} className="rounded-lg p-2">
        <div className="flex justify-between mb-1.5">
          <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase tracking-wider">Reserva</span>
          <span style={{ color: "var(--accent)" }} className="font-mono text-[9px] font-semibold">{reserva.percentual}%</span>
        </div>
        <div style={{ background: "var(--bg-base)" }} className="h-1.5 rounded-full overflow-hidden">
          <div
            style={{ width: `${Math.min(reserva.percentual, 100)}%`, background: "var(--accent)", boxShadow: "0 0 8px var(--accent-glow)" }}
            className="h-full rounded-full transition-all duration-700"
          />
        </div>
        <p style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] mt-1.5">
          {fmt(reserva.atual)} / {fmt(reserva.necessaria)} · {reserva.meses_cobertos}m
        </p>
      </div>
    </div>
  );
}