"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import DashboardPreview from "@/components/hero/DashboardPreview";
import {
  PatrimonyChartPreview,
  AllocationDonutPreview,
  SpendingChartPreview,
  InsightsPanelPreview,
} from "@/components/hero/DashboardChartsPreview";

// ─── Floating particles ───────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left:    `${Math.random() * 100}%`,
    size:    Math.random() * 2.5 + 1,
    delay:   Math.random() * 6,
    dur:     Math.random() * 8 + 6,
    opacity: Math.random() * 0.35 + 0.1,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left, bottom: 0,
            width: p.size, height: p.size,
            background: `rgba(34,211,238,${p.opacity})`,
          }}
          animate={{ y: [-120, 0], opacity: [0, p.opacity * 1.5, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// ─── Scan shimmer (varre o card ao entrar) ───────────────────────────────────
function ScanShimmer({ trigger }: { trigger: boolean }) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    const t1 = setTimeout(() => setRun(true),  300);
    const t2 = setTimeout(() => setRun(false), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [trigger]);

  return (
    <AnimatePresence>
      {run && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          initial={{ y: "-100%" }}
          animate={{ y: "100%" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          style={{
            background:
              "linear-gradient(180deg,transparent 0%,rgba(34,211,238,0.07) 50%,transparent 100%)",
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ─── Animated divider ─────────────────────────────────────────────────────────
function AnimatedDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="my-16 flex items-center gap-4">
      <motion.div
        className="h-px flex-1"
        style={{ background: "linear-gradient(90deg,transparent,rgba(34,211,238,0.15))" }}
        initial={{ scaleX: 0, transformOrigin: "left center" }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.p
        style={{
          color: "rgba(34,211,238,0.4)", fontSize: 9,
          letterSpacing: "0.14em", textTransform: "uppercase",
        }}
        className="font-mono"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        gráficos analíticos
      </motion.p>
      <motion.div
        className="h-px flex-1"
        style={{ background: "linear-gradient(90deg,rgba(34,211,238,0.15),transparent)" }}
        initial={{ scaleX: 0, transformOrigin: "right center" }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

// ─── Heading word-by-word com blur ────────────────────────────────────────────
const WORDS = ["Visão", "completa", "das", "suas", "finanças"];

function AnimatedHeading() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="mb-16 text-center">
      <motion.p
        style={{
          color: "#22d3ee", fontSize: 12,
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12,
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Dashboard em tempo real
      </motion.p>

      <h2
        style={{
          fontSize: "clamp(28px,4vw,48px)", fontWeight: 700,
          letterSpacing: "-0.02em", color: "#f0f4f8", lineHeight: 1.15,
        }}
      >
        {WORDS.map((word, i) => {
          const isLast = i === WORDS.length - 1;
          return (
            <motion.span
              key={word}
              style={isLast ? {
                color: "#22d3ee",
                textShadow:
                  "0 0 30px rgba(34,211,238,0.45), 0 0 60px rgba(34,211,238,0.2)",
              } : { color: "#f0f4f8" }}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: "easeOut" }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </h2>
    </div>
  );
}

// ─── Browser mock com lift + scan ────────────────────────────────────────────
function AnimatedBrowserMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden"
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* glow externo que aparece junto */}
      <motion.div
        className="pointer-events-none absolute -inset-8 rounded-3xl"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 1.2 }}
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(34,211,238,0.08), transparent)",
          filter: "blur(20px)",
        }}
      />
      <ScanShimmer trigger={inView} />
      <DashboardPreview />
    </motion.div>
  );
}

// ─── Patrimony card ───────────────────────────────────────────────────────────
function AnimatedPatrimonyCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden rounded-2xl"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <ScanShimmer trigger={inView} />
      <PatrimonyChartPreview />
    </motion.div>
  );
}

// ─── Mini card com stagger + rotateX + glow ───────────────────────────────────
function AnimatedMiniCard({
  children,
  delay = 0,
  glowColor = "rgba(34,211,238,0.06)",
}: {
  children: React.ReactNode;
  delay?: number;
  glowColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden rounded-2xl"
      initial={{ opacity: 0, y: 35, rotateX: 8 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 600 }}
    >
      {/* flash de glow ao aparecer */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: [0, 1, 0] } : {}}
        transition={{ delay: delay + 0.3, duration: 0.8 }}
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${glowColor}, transparent 70%)`,
        }}
      />
      <ScanShimmer trigger={inView} />
      {children}
    </motion.div>
  );
}

// ─── DashboardSection ─────────────────────────────────────────────────────────
export function DashboardSection() {
  return (
    <section
      id="dashboard"
      className="relative px-6 py-24"
      style={{ background: "#07090d" }}
    >
      {/* ── Ambient ────────────────────────────────────────────── */}
      <Particles />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg,transparent,rgba(34,211,238,0.15),transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-32 h-[500px] w-[500px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(circle,rgba(34,211,238,0.04),transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">

        {/* ── Heading ──────────────────────────────────────────── */}
        <AnimatedHeading />

        {/* ── Browser mock ─────────────────────────────────────── */}
        <AnimatedBrowserMock />

        {/* ── Divider ──────────────────────────────────────────── */}
        <AnimatedDivider />

        {/* ── Patrimony chart ──────────────────────────────────── */}
        <AnimatedPatrimonyCard />

        {/* ── 3-col grid staggered ─────────────────────────────── */}
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <AnimatedMiniCard delay={0}    glowColor="rgba(167,139,250,0.09)">
            <AllocationDonutPreview />
          </AnimatedMiniCard>

          <AnimatedMiniCard delay={0.12} glowColor="rgba(34,211,238,0.07)">
            <SpendingChartPreview />
          </AnimatedMiniCard>

          <AnimatedMiniCard delay={0.24} glowColor="rgba(245,158,11,0.07)">
            <InsightsPanelPreview />
          </AnimatedMiniCard>
        </div>

      </div>
    </section>
  );
}