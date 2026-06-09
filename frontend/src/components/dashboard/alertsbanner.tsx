import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DadosResponse } from "@/types/api";

interface Alert {
  id: string;
  type: "warning" | "danger" | "success" | "info";
  icon: string;
  title: string;
  desc: string;
}

const COLORS = {
  danger:  { bg: "#f871711a", border: "#f8717140", icon: "#f87171", dot: "#f87171" },
  warning: { bg: "#f59e0b1a", border: "#f59e0b40", icon: "#f59e0b", dot: "#f59e0b" },
  success: { bg: "#34d3991a", border: "#34d39940", icon: "#34d399", dot: "#34d399" },
  info:    { bg: "#22d3ee1a", border: "#22d3ee40", icon: "#22d3ee", dot: "#22d3ee" },
};

function generateAlerts(data: DadosResponse): Alert[] {
  const alerts: Alert[] = [];
  const { metricas, reserva, metas, gastos_categoria } = data;

  // Saldo negativo
  if (metricas.saldo_mes < 0) {
    alerts.push({
      id: "saldo_neg",
      type: "danger",
      icon: "↓",
      title: "Saldo negativo este mês",
      desc: `Deficit de R$ ${Math.abs(metricas.saldo_mes).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}. Revise seus gastos.`,
    });
  }

  // Taxa de poupança baixa
  if (metricas.saldo_mes >= 0 && metricas.taxa_poupanca < 10 && metricas.taxa_poupanca > 0) {
    alerts.push({
      id: "poupanca_baixa",
      type: "warning",
      icon: "⚠",
      title: "Taxa de poupança abaixo do ideal",
      desc: `Você está poupando apenas ${metricas.taxa_poupanca}% da renda. O recomendado é pelo menos 20%.`,
    });
  }

  // Boa poupança
  if (metricas.taxa_poupanca >= 20) {
    alerts.push({
      id: "poupanca_boa",
      type: "success",
      icon: "✓",
      title: "Excelente taxa de poupança!",
      desc: `Você poupou ${metricas.taxa_poupanca}% da renda este mês. Continue assim!`,
    });
  }

  // Moradia acima do ideal
  const moradia = gastos_categoria.find(g => g.cat.toLowerCase().includes("moradia"));
  if (moradia && metricas.total_gastos > 0) {
    const pct = (moradia.valor / metricas.total_gastos) * 100;
    if (pct > 40) {
      alerts.push({
        id: "moradia_alta",
        type: "warning",
        icon: "⌂",
        title: "Gastos com moradia elevados",
        desc: `${pct.toFixed(0)}% dos gastos em moradia. Pela regra 50/30/20, o ideal é até 30% da renda.`,
      });
    }
  }

  // Reserva crítica
  if (reserva.percentual < 30) {
    alerts.push({
      id: "reserva_critica",
      type: "danger",
      icon: "!",
      title: "Reserva de emergência crítica",
      desc: `Sua reserva cobre apenas ${reserva.meses_cobertos} mês(es). Priorize construí-la antes de outros investimentos.`,
    });
  } else if (reserva.percentual >= 100) {
    alerts.push({
      id: "reserva_ok",
      type: "success",
      icon: "★",
      title: "Reserva de emergência completa!",
      desc: `Parabéns! Você tem ${reserva.meses_cobertos} meses cobertos. Agora foque em investir o excedente.`,
    });
  }

  // Metas vencendo em breve (dentro de 3 meses)
  const hoje = new Date();
  metas.forEach(meta => {
    if (!meta.prazo) return;
    const [ano, mes] = meta.prazo.split("-").map(Number);
    const vencimento = new Date(ano, mes - 1, 1);
    const mesesRestantes = (vencimento.getFullYear() - hoje.getFullYear()) * 12 +
      (vencimento.getMonth() - hoje.getMonth());
    const progresso = meta.progresso ?? 0;

    if (mesesRestantes <= 3 && mesesRestantes >= 0 && progresso < 100) {
      alerts.push({
        id: `meta_${meta.meta}`,
        type: mesesRestantes <= 1 ? "danger" : "warning",
        icon: "◎",
        title: `Meta "${meta.meta}" vence em breve`,
        desc: `Faltam ${mesesRestantes === 0 ? "menos de 1 mês" : `${mesesRestantes} meses`} e você está em ${progresso.toFixed(0)}%.`,
      });
    }
  });

  return alerts;
}

interface AlertsBannerProps { data: DadosResponse }

export function AlertsBanner({ data }: AlertsBannerProps) {
  const alerts = useMemo(() => generateAlerts(data), [data]);

  if (alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {alerts.map((alert, i) => {
          const c = COLORS[alert.type];
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -12, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 12, height: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
              className="relative overflow-hidden rounded-xl flex items-start gap-3 px-4 py-3"
              style={{ background: c.bg, border: `1px solid ${c.border}` }}
            >
              {/* Linha lateral */}
              <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                style={{ background: c.dot }} />

              {/* Ícone */}
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
                style={{ background: `${c.dot}20`, color: c.icon }}>
                {alert.icon}
              </div>

              {/* Texto */}
              <div className="flex-1 min-w-0">
                <p style={{ color: "var(--text-primary)" }} className="font-body text-sm font-medium">
                  {alert.title}
                </p>
                <p style={{ color: "var(--text-muted)" }} className="font-body text-xs mt-0.5 leading-relaxed">
                  {alert.desc}
                </p>
              </div>

              {/* Pulse dot */}
              {(alert.type === "danger" || alert.type === "warning") && (
                <div className="flex-shrink-0 mt-1.5">
                  <div className="w-2 h-2 rounded-full relative" style={{ background: c.dot }}>
                    <div className="absolute inset-0 rounded-full animate-ping opacity-60"
                      style={{ background: c.dot }} />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}