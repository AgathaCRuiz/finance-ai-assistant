import { motion } from "framer-motion";
import FeatureCard from "@/components/hero/FeatureCard";

const FEATURES = [
  {
    delay: 0,
    icon: "🤖",
    color: "#22d3ee",
    title: "IA Financeira",
    desc: "Converse com o Edu, sua assessora de IA. Pergunte sobre gastos, receba análises e gráficos gerados automaticamente.",
  },
  {
    delay: 0.08,
    icon: "📊",
    color: "#6366f1",
    title: "Dashboard Analítico",
    desc: "Visualize evolução patrimonial, distribuição de gastos e metas com gráficos interativos em tempo real.",
  },
  {
    delay: 0.16,
    icon: "🎯",
    color: "#34d399",
    title: "Gestão de Metas",
    desc: "Defina e acompanhe suas metas financeiras com barras de progresso e alertas automáticos de vencimento.",
  },
  {
    delay: 0.24,
    icon: "⚡",
    color: "#f59e0b",
    title: "Alertas Inteligentes",
    desc: "Receba avisos proativos quando algo importante acontece — saldo negativo, meta prestes a vencer, gastos elevados.",
  },
  {
    delay: 0.32,
    icon: "🔒",
    color: "#a78bfa",
    title: "Dados Seguros",
    desc: "Seus dados financeiros ficam no seu próprio banco de dados. Sem compartilhamento, sem anúncios.",
  },
  {
    delay: 0.4,
    icon: "📈",
    color: "#22d3ee",
    title: "Índices de Mercado",
    desc: "SELIC, CDI, IPCA, Dólar e Ibovespa atualizados automaticamente para contextualizar seus investimentos.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative px-6 py-24"
      style={{ background: "linear-gradient(180deg, #07090d 0%, #080c12 100%)" }}
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
              color: "#22d3ee",
              fontSize: 12,
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