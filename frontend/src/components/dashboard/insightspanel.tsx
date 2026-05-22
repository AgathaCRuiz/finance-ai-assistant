import { motion } from "framer-motion";
import type { DadosResponse } from "@/types/api";
import { Tooltip } from "./tooltip";

interface InsightsPanelProps { data: DadosResponse; }

interface Insight {
  icon: string;
  title: string;
  desc: string;
  bg: string;
  color: string;
  detail: string;
}

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function generateInsights(data: DadosResponse): Insight[] {
  const insights: Insight[] = [];
  const { metricas, reserva, gastos_categoria } = data;

  if (metricas.saldo_mes > 0) {
    insights.push({
      icon: "↑", title: "Saldo positivo este mês", bg: "#0d2518", color: "#34d399",
      desc: `Você poupou ${metricas.taxa_poupanca}% da renda.`,
      detail: `Receita: ${fmt(metricas.total_receita)} | Gastos: ${fmt(metricas.total_gastos)} | Sobra: ${fmt(metricas.saldo_mes)}. Continue assim para atingir suas metas mais rápido.`,
    });
  } else {
    insights.push({
      icon: "!", title: "Saldo negativo este mês", bg: "#2d1515", color: "#f87171",
      desc: "Seus gastos superaram a receita. Revise as despesas.",
      detail: `Deficit de ${fmt(Math.abs(metricas.saldo_mes))}. Receita: ${fmt(metricas.total_receita)} | Gastos: ${fmt(metricas.total_gastos)}. Revise as categorias com maior gasto.`,
    });
  }

  const moradia = gastos_categoria.find(g => g.cat.toLowerCase().includes("moradia"));
  if (moradia && metricas.total_gastos > 0) {
    const pct = (moradia.valor / metricas.total_gastos) * 100;
    if (pct > 30) {
      insights.push({
        icon: "!", title: "Moradia acima do ideal", bg: "#2d1515", color: "#f87171",
        desc: `${pct.toFixed(0)}% dos gastos em moradia.`,
        detail: `Você gastou ${fmt(moradia.valor)} em moradia (${pct.toFixed(0)}% do total). O recomendado pela regra 50/30/20 é até 30% da renda para necessidades.`,
      });
    }
  }

  if (reserva.percentual < 100) {
    const faltam = reserva.necessaria - reserva.atual;
    insights.push({
      icon: "★", title: "Reserva em andamento", bg: "#1a1035", color: "#a78bfa",
      desc: `Faltam ${fmt(faltam)} para completar sua reserva.`,
      detail: `Sua reserva cobre ${reserva.meses_cobertos} meses de despesas. O ideal é 6 meses. Progresso: ${reserva.percentual}% (${fmt(reserva.atual)} / ${fmt(reserva.necessaria)}).`,
    });
  } else {
    insights.push({
      icon: "✓", title: "Reserva completa!", bg: "#0d2518", color: "#34d399",
      desc: "Sua reserva de emergência está 100% constituída.",
      detail: `Parabéns! Você tem ${fmt(reserva.atual)} reservados, cobrindo ${reserva.meses_cobertos} meses de despesas. Agora foque nos demais investimentos.`,
    });
  }

  return insights;
}

export function InsightsPanel({ data }: InsightsPanelProps) {
  const insights = generateInsights(data);

  return (
    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      className="rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 rounded-full" style={{ background: "#f59e0b" }} />
        <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase tracking-widest">
          Insights da IA
        </span>
      </div>

      <div className="flex flex-col">
        {insights.map((ins, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="py-3 first:pt-0 last:pb-0"
            style={{ borderBottom: i < insights.length - 1 ? "1px solid var(--border)" : "none" }}
          >
            <Tooltip side="right" content={
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: ins.bg, color: ins.color }}>{ins.icon}</div>
                  <span style={{ color: "var(--text-primary)" }} className="font-body text-xs font-medium">{ins.title}</span>
                </div>
                <p style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}
                  className="font-body text-[10px] pt-1.5 leading-relaxed">{ins.detail}</p>
              </div>
            }>
              <div className="flex items-start gap-3 cursor-default w-full group">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all duration-200 group-hover:scale-110"
                  style={{ background: ins.bg, color: ins.color }}>
                  {ins.icon}
                </div>
                <div>
                  <p style={{ color: "var(--text-primary)" }} className="font-body text-xs font-medium mb-0.5">{ins.title}</p>
                  <p style={{ color: "var(--text-muted)" }} className="font-body text-xs leading-relaxed">{ins.desc}</p>
                </div>
              </div>
            </Tooltip>
          </motion.div>
        ))}
      </div>
    </div>
  );
}