import { useEffect, useRef } from "react";
import type { MetricasDados, ReservaDados } from "@/types/api";
import { Tooltip, KpiTooltipContent } from "./ToolTip";

interface KpiCardsProps {
  patrimonio: number;
  metricas: MetricasDados;
  reserva: ReservaDados;
}

function useCountUp(target: number, duration = 900) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * ease).toLocaleString("pt-BR");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return ref;
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

interface KpiProps {
  label: string;
  change: string;
  changeColor: string;
  accentColor: string;
  barWidth: number;
  animTarget: number;
  prefix?: string;
  suffix?: string;
  tooltipContent: React.ReactNode;
}

function KpiCard({ label, change, changeColor, accentColor, barWidth, animTarget, prefix = "R$", suffix = "", tooltipContent }: KpiProps) {
  const ref = useCountUp(animTarget);

  return (
    <Tooltip content={tooltipContent} side="bottom">
      <div
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", width: "100%" }}
        className="relative rounded-xl p-4 overflow-hidden group hover:border-[var(--border-bright)] transition-all duration-300 cursor-default"
      >
        {/* Accent top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
          style={{ background: `linear-gradient(90deg,${accentColor},transparent)` }} />

        {/* Glow */}
        <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100"
          style={{ background: accentColor, filter: "blur(30px)", opacity: 0.08 }} />

        <div style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase tracking-widest mb-2">
          {label}
        </div>
        <div style={{ color: "var(--text-primary)" }} className="font-display text-2xl font-bold tracking-tight mb-1">
          {prefix}<span ref={ref}>0</span>{suffix}
        </div>
        <div className="font-mono text-[10px]" style={{ color: changeColor }}>{change}</div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "var(--border)" }}>
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${barWidth}%`, background: accentColor + "55" }} />
        </div>
      </div>
    </Tooltip>
  );
}

export function KpiCards({ patrimonio, metricas, reserva }: KpiCardsProps) {
  const saldoPositivo = metricas.saldo_mes >= 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard
        label="Patrimônio" accentColor="#22d3ee" changeColor="#22d3ee"
        change="↑ +2.4% este mês" barWidth={72}
        animTarget={Math.round(patrimonio / 1000)} suffix="k"
        tooltipContent={
          <KpiTooltipContent
            label="Patrimônio Total"
            value={fmtFull(patrimonio)}
            trend="↑ +2.4% vs mês anterior"
            trendColor="#22d3ee"
            detail="Soma de todos os seus ativos: investimentos, reserva e saldo disponível."
          />
        }
      />
      <KpiCard
        label="Saldo do mês" accentColor="#34d399"
        changeColor={saldoPositivo ? "#34d399" : "#f87171"}
        change={`Taxa de poupança ${metricas.taxa_poupanca}%`}
        barWidth={Math.min(Math.max(metricas.taxa_poupanca, 0), 100)}
        animTarget={metricas.saldo_mes}
        tooltipContent={
          <KpiTooltipContent
            label="Saldo do Mês"
            value={fmtFull(metricas.saldo_mes)}
            trend={`${saldoPositivo ? "✓" : "!"} Taxa de poupança: ${metricas.taxa_poupanca}%`}
            trendColor={saldoPositivo ? "#34d399" : "#f87171"}
            detail={saldoPositivo
              ? `Você guardou ${fmtFull(metricas.saldo_mes)} este mês. Receita: ${fmtFull(metricas.total_receita)}.`
              : `Gastos superaram a receita em ${fmtFull(Math.abs(metricas.saldo_mes))}.`
            }
          />
        }
      />
      <KpiCard
        label="Gastos" accentColor="#f87171" changeColor="var(--text-muted)"
        change={`de ${fmtFull(metricas.total_receita)} de receita`}
        barWidth={metricas.total_receita > 0 ? Math.min((metricas.total_gastos / metricas.total_receita) * 100, 100) : 0}
        animTarget={metricas.total_gastos}
        tooltipContent={
          <KpiTooltipContent
            label="Total de Gastos"
            value={fmtFull(metricas.total_gastos)}
            trend={`${((metricas.total_gastos / metricas.total_receita) * 100).toFixed(0)}% da receita comprometida`}
            trendColor="#f87171"
            detail="Soma de todas as saídas do mês de referência por categoria."
          />
        }
      />
      <KpiCard
        label="Reserva" accentColor="#a78bfa" changeColor="#a78bfa"
        change={`${fmt(reserva.atual)} / ${fmt(reserva.necessaria)}`}
        barWidth={reserva.percentual} animTarget={reserva.percentual} prefix="" suffix="%"
        tooltipContent={
          <KpiTooltipContent
            label="Reserva de Emergência"
            value={`${reserva.percentual}%`}
            trend={`Cobre ${reserva.meses_cobertos} meses de despesas`}
            trendColor="#a78bfa"
            detail={`Meta: ${fmtFull(reserva.necessaria)}. Atual: ${fmtFull(reserva.atual)}. Faltam ${fmtFull(reserva.necessaria - reserva.atual)}.`}
          />
        }
      />
    </div>
  );
}