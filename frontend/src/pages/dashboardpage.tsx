import { useState } from "react";
import { useInvestorProfile } from "@/hooks/useInvestorProfile";
import { KpiCards } from "@/components/dashboard/Kpicards";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { AllocationDonut } from "@/components/dashboard/AllocationDonut";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { GoalsProgress } from "@/components/dashboard/GoalsProgress";
import { PatrimonyChart } from "@/components/dashboard/PatrimonyChart";
import { AlertsBanner } from "@/components/dashboard/AlertsBanner";
import { PeriodFilter, type Period } from "@/components/dashboard/PeriodFilter";
import { motion, AnimatePresence } from "framer-motion";

export function DashboardPage() {
  const [period, setPeriod] = useState<Period>("1m");
  const { data, status, error } = useInvestorProfile(period);

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100%" }}
      className="relative flex flex-col">

      {/* Grid de fundo */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        backgroundImage: "linear-gradient(rgba(34,211,238,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.025) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Orbs */}
      <div className="pointer-events-none fixed top-0 right-0 w-64 h-64 rounded-full z-0"
        style={{ background: "radial-gradient(circle,rgba(34,211,238,.06),transparent 70%)", filter: "blur(40px)" }} />
      <div className="pointer-events-none fixed bottom-0 left-0 w-48 h-48 rounded-full z-0"
        style={{ background: "radial-gradient(circle,rgba(139,92,246,.05),transparent 70%)", filter: "blur(40px)" }} />

      <div className="relative z-10 p-6 flex flex-col gap-5 max-w-7xl mx-auto w-full">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 style={{ color: "var(--text-primary)" }} className="font-display text-xl font-semibold tracking-tight">
              Dashboard Financeiro
            </h1>
            <p style={{ color: "var(--text-muted)" }} className="font-mono text-xs mt-0.5">
              {data?.perfil.nome ?? "—"} · {data?.metricas.mes_referencia ?? "carregando..."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Filtro de período */}
            <PeriodFilter value={period} onChange={setPeriod} />
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full">
              <AnimatePresence mode="wait">
                {status === "loading" ? (
                  <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
                ) : (
                  <motion.span key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse" />
                )}
              </AnimatePresence>
              <span style={{ color: "#22d3ee" }} className="font-mono text-[10px] tracking-widest">
                {status === "loading" ? "..." : "LIVE"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Loading skeleton */}
        {status === "loading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                className="h-24 rounded-xl animate-pulse" />
            ))}
          </motion.div>
        )}

        {/* Erro */}
        {status === "error" && (
          <div style={{ color: "var(--negative)" }} className="font-mono text-sm p-4">
            Erro: {error}
          </div>
        )}

        {/* Conteúdo */}
        {status === "success" && data && (
          <>
            {/* Alertas inteligentes */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <AlertsBanner data={data} />
            </motion.div>

            {/* KPIs */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <KpiCards metricas={data.metricas} reserva={data.reserva} patrimonio={data.perfil.patrimonio_total} />
            </motion.div>

            {/* Evolução Patrimonial */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <PatrimonyChart />
            </motion.div>

            {/* Gastos + Alocação */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
              <div className="lg:col-span-3">
                <SpendingChart
                  gastos={data.gastos_categoria}
                  metricas={data.metricas}
                  historico={data.historico_mensal}
                />
              </div>
              <div className="lg:col-span-2">
                <AllocationDonut gastos={data.gastos_categoria} />
              </div>
            </motion.div>

            {/* Insights + Metas */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <InsightsPanel data={data} />
              <GoalsProgress metas={data.metas} reserva={data.reserva} />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}