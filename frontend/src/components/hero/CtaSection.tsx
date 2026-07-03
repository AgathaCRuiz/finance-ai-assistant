import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Orbs from "@/components/hero/Orbs";

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section id="sobre" className="relative px-6 py-32 text-center overflow-hidden bg-[#020408]">

      {/* Background layers — mesma ordem da Hero */}
      <div className="absolute inset-0 bg-[#020408] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,212,0.04),transparent_65%)] pointer-events-none z-[1]" />
      <div className="absolute inset-0 z-[3]">
        <Orbs />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            color: "#f0f4f8",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 20,
          }}
        >
          Pronto para começar?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          style={{ color: "rgba(160,180,200,0.6)", fontSize: 18, marginBottom: 40 }}
        >
          Acesse agora e tenha sua assessora financeira IA em minutos.
        </motion.p>

        <motion.button
          onClick={() => navigate("/app")}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: "#00f5d4",
            color: "#000",
            fontWeight: 700,
            fontSize: 18,
            border: "none",
            borderRadius: 16,
            padding: "18px 48px",
            cursor: "pointer",
            boxShadow: "0 0 60px rgba(0,245,212,0.4), 0 16px 40px rgba(0,0,0,0.4)",
          }}
        >
          Acessar o Edu Finance →
        </motion.button>
      </div>
    </section>
  );
}