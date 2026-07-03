import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ChevronRight
} from "lucide-react";

import FloatingStat from "@/components/hero/FloatingStat";
import AestheticDashboard from "./AestheticDashboard";

export function HeroSection() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -40]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex flex-col items-center justify-center overflow-hidden min-h-screen pt-20 md:pt-24 pb-16 px-6 lg:px-12 z-10"
    >
      {/* Container for centered layout like Antigravity */}
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center text-center relative z-10">
        
        {/* Top Content Row */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="w-full flex flex-col items-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 px-2.5 py-1 rounded-full mb-4 bg-white/[0.03] border border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
          >
            <span className="text-zinc-400 text-[10px] font-light tracking-wide px-1">
              Edu Finance Premium 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tight leading-[1.15] mb-4 font-display max-w-2xl mx-auto"
          >
            Suas finanças, seu mundo inteligente.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-lg mb-6 font-sans font-light mx-auto"
          >
            A Edu Finance funciona como sua fortaleza, salvaguardando seu patrimônio com a mais avançada inteligência artificial do mercado.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-6"
          >
            <motion.button
              onClick={() => navigate("/app")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden font-semibold text-xs px-6 py-3 rounded-full cursor-pointer text-black flex items-center gap-1.5 transition-all duration-300 group"
              style={{
                background: "linear-gradient(135deg, #00f5d4 0%, #00E5FF 50%, #2563eb 100%)",
                boxShadow: "0 0 20px rgba(0, 245, 212, 0.4), 0 0 40px rgba(0, 229, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)"
              }}
            >
              {/* Highlight flare overlay on hover */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              <span className="relative z-10 flex items-center gap-1.5 font-bold tracking-wide">
                Começar agora <ChevronRight className="w-3.5 h-3.5 text-black stroke-[3px]" />
              </span>
            </motion.button>
            
            <motion.button
              onClick={() => navigate("/app")}
              whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(0, 245, 212, 0.2)" }}
              whileTap={{ scale: 0.97 }}
              className="bg-zinc-950/40 text-zinc-100 border border-[#00f5d4]/30 hover:border-[#00f5d4]/80 font-medium text-xs px-6 py-3 rounded-full cursor-pointer hover:bg-[#00f5d4]/5 transition-all duration-300"
            >
              Ver demo
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pb-6 border-b border-white/[0.04] w-full max-w-lg mx-auto mb-6"
          >
            <FloatingStat value="270+" label="transações analisadas" />
            <div className="hidden sm:block w-px h-4 bg-white/[0.06]" />
            <FloatingStat value="100%" label="dados seus, seguros" />
            <div className="hidden sm:block w-px h-4 bg-white/[0.06]" />
            <FloatingStat value="IA" label="respostas em tempo real" />
          </motion.div>
        </motion.div>

        {/* Center-aligned Aesthetic Dashboard Showcase Component underneath */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-full max-w-5xl mt-6 md:mt-8 z-20 overflow-visible"
        >
          <div className="w-full relative">
            {/* VIBRANT BACKGROUND COLOR GLOWS (LIKE THE REFERENCE SCREENSHOT) */}
            <div className="absolute inset-x-[-10%] -top-[20%] -bottom-[20%] -z-10 pointer-events-none overflow-visible">
              {/* Left Side: Rich Violet / Indigo Aura */}
              <div 
                className="absolute top-1/4 left-0 w-[500px] h-[450px] rounded-full opacity-70 mix-blend-screen filter blur-[90px] animate-pulse"
                style={{
                  background: "radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, rgba(79, 70, 229, 0.1) 60%, transparent 100%)",
                  animationDuration: "8s"
                }}
              />
              {/* Right Side: Bright Electric Royal Blue Aura */}
              <div 
                className="absolute top-1/4 right-0 w-[550px] h-[480px] rounded-full opacity-75 mix-blend-screen filter blur-[90px] animate-pulse"
                style={{
                  background: "radial-gradient(circle, rgba(37, 99, 235, 0.5) 0%, rgba(0, 229, 255, 0.15) 60%, transparent 100%)",
                  animationDuration: "11s"
                }}
              />
              {/* Center Background Horizon glow */}
              <div 
                className="absolute bottom-10 left-[15%] right-[15%] h-[200px] rounded-full opacity-40 mix-blend-screen filter blur-[70px]"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(147, 51, 234, 0.25) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)"
                }}
              />
            </div>

            <AestheticDashboard />

            {/* SUPER VISIBLE HIGH-QUALITY PAGE-LEVEL BLUR & TRANSITION OVERLAY */}
            {/* It sits on the page, passing over the bottom portion of the dashboard and perfectly erasing its bottom border */}
            <div className="absolute -left-6 -right-6 md:-left-12 md:-right-12 bottom-[-48px] h-80 pointer-events-none z-30">
              {/* Layer 1: Glassy Backdrop Blur Overlay */}
              <div className="absolute inset-0 bg-[#020408]/40 backdrop-blur-[12px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_100%)] -webkit-[mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_100%)]" />
              
              {/* Layer 2: Deeper, higher density Matte Black Backdrop Blur for ultra visibility */}
              <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-b from-transparent via-[#020408]/95 to-[#020408] backdrop-blur-[24px]" />
              
              {/* Layer 3: Solid background mask to completely swallow any remnants of the bottom borders */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-[#020408]" />

              {/* Centered content header on top of the blurred glass overlay */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-2 text-center">
                {/* Elegant separator line */}
                <div className="w-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#00f5d4]/40 to-transparent mb-5" />

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.05] bg-black/90 backdrop-blur-md mb-3 shadow-[0_8px_32px_rgba(0,0,0,0.9)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-pulse" />
                  <span className="text-[10px] text-zinc-300 font-mono uppercase tracking-[0.2em]">Painel de Controle de Alto Rendimento</span>
                </div>
                
                <h3 className="font-display text-lg sm:text-xl md:text-2xl font-light text-zinc-100 tracking-tight leading-tight">
                  Explore Nosso Ecossistema Completo Abaixo
                </h3>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-lg mx-auto font-sans font-light">
                  Rolagem suave para acessar ferramentas financeiras, análise estatística e simulação de ativos.
                </p>

                {/* Unified, non-overlapping Animated Scroll Indicator */}
                <motion.div 
                  className="flex flex-col items-center gap-1.5 mt-5"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-zinc-600 text-[9px] tracking-[0.3em] font-mono uppercase">Rolar</span>
                  <div className="w-[1.5px] h-8 bg-gradient-to-b from-[#00f5d4]/50 to-transparent" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
