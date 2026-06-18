import { motion } from "framer-motion";
import DashboardPreview from "@/components/hero/DashboardPreview";

export function DashboardSection() {
  return (
    <section id="dashboard" className="relative px-6 py-24" style={{ background: "#07090d" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
            Dashboard em tempo real
          </p>
          <h2
            style={{
              color: "#f0f4f8",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Visão completa das suas finanças
          </h2>
        </motion.div>

        <DashboardPreview />
      </div>
    </section>
  );
}