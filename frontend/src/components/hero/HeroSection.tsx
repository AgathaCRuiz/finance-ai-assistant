import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

import GridBackground from "@/components/hero/GridBackground";
import Particles from "@/components/hero/Particles";
import Orbs from "@/components/hero/Orbs";
import FloatingStat from "@/components/hero/FloatingStat";

export function HeroSection() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ minHeight: "100vh", padding: "120px 24px 80px" }}
    >

      {/* Background */}
      <div className="absolute inset-0 z-[1]">
        <GridBackground />
      </div>

      <div className="absolute inset-0 z-[2]">
        <Particles />
      </div>

      <div className="absolute inset-0 z-[3]">
        <Orbs />
      </div>

      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse" />
          <span style={{ color: "#22d3ee", fontSize: 12, letterSpacing: "0.08em" }}>
            Assessora financeira com IA · Powered by Groq
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontSize: "clamp(42px, 7vw, 84px)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#f0f4f8",
            maxWidth: 800,
            marginBottom: 24,
          }}
        >
          Suas finanças,{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #22d3ee, #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            inteligentes
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            color: "rgba(160,180,200,0.7)",
            fontSize: 20,
            lineHeight: 1.6,
            maxWidth: 540,
            marginBottom: 48,
          }}
        >
          Analise gastos, acompanhe metas e receba insights personalizados de uma IA que entende suas finanças de verdade.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center gap-4 flex-wrap justify-center"
        >
          <motion.button
            onClick={() => navigate("/app")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "#22d3ee",
              color: "#000",
              fontWeight: 700,
              fontSize: 16,
              border: "none",
              borderRadius: 14,
              padding: "16px 36px",
              cursor: "pointer",
              boxShadow: "0 0 40px rgba(34,211,238,0.35), 0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            Começar grátis →
          </motion.button>
          <motion.button
            onClick={() => navigate("/app")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#f0f4f8",
              fontWeight: 500,
              fontSize: 16,
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14,
              padding: "16px 36px",
              cursor: "pointer",
            }}
          >
            Ver demo
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center gap-12 mt-20"
        >
          <FloatingStat value="270+" label="transações analisadas" />
          <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.08)" }} />
          <FloatingStat value="100%" label="dados seus, seguros" />
          <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.08)" }} />
          <FloatingStat value="IA" label="respostas em tempo real" />
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span style={{ color: "rgba(160,180,200,0.3)", fontSize: 11, letterSpacing: "0.1em" }}>SCROLL</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(34,211,238,0.3), transparent)" }} />
      </motion.div>
    </section>
  );
}