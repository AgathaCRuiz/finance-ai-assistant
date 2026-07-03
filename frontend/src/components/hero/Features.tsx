import React from "react";
import { motion } from "framer-motion";
import FeatureCard from "@/components/hero/FeatureCard";
import { BrainCircuit, BarChart3, Target, Bell, ShieldCheck, TrendingUp } from "lucide-react";

const FEATURES = [
  {
    delay: 0,
    icon: <BrainCircuit className="w-5 h-5 text-white" strokeWidth={1.5} />,
    color: "#00f5d4",
    title: "IA Financeira",
    desc: "Converse com o Edu, sua assessora de IA. Pergunte sobre gastos, receba análises e gráficos gerados automaticamente.",
  },
  {
    delay: 0.08,
    icon: <BarChart3 className="w-5 h-5 text-white" strokeWidth={1.5} />,
    color: "#00E5FF",
    title: "Dashboard Analítico",
    desc: "Visualize evolução patrimonial, distribuição de gastos e metas com gráficos interativos em tempo real.",
  },
  {
    delay: 0.16,
    icon: <Target className="w-5 h-5 text-white" strokeWidth={1.5} />,
    color: "#0df2bc",
    title: "Gestão de Metas",
    desc: "Defina e acompanhe suas metas financeiras com barras de progresso e alertas automáticos de vencimento.",
  },
  {
    delay: 0.24,
    icon: <Bell className="w-5 h-5 text-white" strokeWidth={1.5} />,
    color: "#0cf2b4",
    title: "Alertas Inteligentes",
    desc: "Receba avisos proativos quando algo importante acontece — saldo negativo, meta prestes a vencer, gastos elevados.",
  },
  {
    delay: 0.32,
    icon: <ShieldCheck className="w-5 h-5 text-white" strokeWidth={1.5} />,
    color: "#00f5e4",
    title: "Dados Seguros",
    desc: "Seus dados financeiros ficam no seu próprio banco de dados. Sem compartilhamento, sem anúncios.",
  },
  {
    delay: 0.4,
    icon: <TrendingUp className="w-5 h-5 text-white" strokeWidth={1.5} />,
    color: "#00f5d4",
    title: "Índices de Mercado",
    desc: "SELIC, CDI, IPCA, Dólar e Ibovespa atualizados automaticamente para contextualizar seus investimentos.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative px-6 py-24"
      style={{ background: "linear-gradient(180deg, #07090d 0%, #05080c 100%)" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header da seção */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p
            style={{
              color: "rgba(148, 163, 184, 0.55)",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Funcionalidades
          </p>
          <h2
            style={{
              color: "#f0f4f8",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Tudo que você precisa
          </h2>
          <p style={{ color: "rgba(160,180,200,0.6)", fontSize: 18, maxWidth: 480, margin: "0 auto" }}>
            Uma plataforma completa para organizar e entender suas finanças
          </p>
        </motion.div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

      </div>
    </section>
  );
}