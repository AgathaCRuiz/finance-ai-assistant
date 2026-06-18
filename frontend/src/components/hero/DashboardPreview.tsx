import { motion } from "framer-motion";

function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative mx-auto"
      style={{ maxWidth: 800 }}
    >
      {/* Glow atrás */}
      <div className="absolute -inset-8 rounded-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.08), transparent 70%)", filter: "blur(20px)" }} />
 
      {/* Frame do browser */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(34,211,238,0.15)", background: "#080c10", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>
 
        {/* Barra do browser */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(34,211,238,0.08)", background: "#0a0f15" }}>
          <div className="flex gap-1.5">
            {["#f87171","#fbbf24","#34d399"].map((c,i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
            ))}
          </div>
          <div className="flex-1 mx-4 px-3 py-1 rounded-md text-xs font-mono"
            style={{ background: "rgba(255,255,255,0.04)", color: "rgba(160,180,200,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}>
            app.edufinance.io/dashboard
          </div>
        </div>
 
        {/* Conteúdo do dashboard */}
        <div className="p-4" style={{ background: "#07090d" }}>
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { label: "Patrimônio", value: "R$48k", color: "#22d3ee", change: "+2.4%" },
              { label: "Saldo",      value: "R$1,2k", color: "#34d399", change: "+8%" },
              { label: "Gastos",     value: "R$3,8k", color: "#f87171", change: "este mês" },
              { label: "Reserva",    value: "67%",    color: "#a78bfa", change: "R$10k/15k" },
            ].map((kpi, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.08 }}
                className="rounded-xl p-3 relative overflow-hidden"
                style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                  style={{ background: `linear-gradient(90deg,${kpi.color},transparent)` }} />
                <div style={{ color: "rgba(160,180,200,0.5)", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                  {kpi.label}
                </div>
                <div style={{ color: "#f0f4f8", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>
                  {kpi.value}
                </div>
                <div style={{ color: kpi.color, fontSize: 10, marginTop: 2 }}>{kpi.change}</div>
              </motion.div>
            ))}
          </div>
 
          {/* Gráfico de área simulado */}
          <div className="rounded-xl p-3 mb-3" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ color: "rgba(34,211,238,0.7)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
              Evolução patrimonial · 12 meses
            </div>
            <svg width="100%" height="60" viewBox="0 0 400 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d="M0,50 C30,45 60,42 90,38 C120,34 150,36 180,30 C210,24 240,28 270,20 C300,12 330,18 360,10 C380,6 400,8 400,8 L400,60 L0,60 Z"
                fill="url(#areaGrad)"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 1 }}
              />
              <motion.path
                d="M0,50 C30,45 60,42 90,38 C120,34 150,36 180,30 C210,24 240,28 270,20 C300,12 330,18 360,10 C380,6 400,8 400,8"
                fill="none" stroke="#22d3ee" strokeWidth="2"
                strokeDasharray="600" strokeDashoffset="600"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
          </div>
 
          {/* Chat preview */}
          <div className="rounded-xl p-3" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded" style={{ background: "#22d3ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: "#000" }}>E</span>
              </div>
              <span style={{ color: "rgba(34,211,238,0.7)", fontSize: 9, letterSpacing: "0.1em" }}>EDU FINANCE · IA</span>
            </div>
            <motion.div
              initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5 }}
              style={{ overflow: "hidden", whiteSpace: "nowrap" }}
            >
              <p style={{ color: "rgba(160,180,200,0.8)", fontSize: 11, lineHeight: 1.6 }}>
                Seus gastos com moradia representam <span style={{ color: "#f59e0b" }}>42%</span> do total este mês. Considerando seu perfil <span style={{ color: "#22d3ee" }}>moderado</span>, recomendo...
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardPreview;