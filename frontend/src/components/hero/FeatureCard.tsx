import {useState } from "react";
import { motion } from "framer-motion";

function FeatureCard({
  icon, title, desc, color = "#22d3ee", delay = 0
}: {
  icon: string; title: string; desc: string; color?: string; delay?: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl p-6 cursor-default overflow-hidden"
      style={{
        background: hovered ? "rgba(34,211,238,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? "rgba(34,211,238,0.25)" : "rgba(255,255,255,0.06)"}`,
        transition: "all 0.3s ease",
        boxShadow: hovered ? "0 0 40px rgba(34,211,238,0.06)" : "none",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: hovered ? 0.6 : 0.2,
          transition: "opacity 0.3s",
        }} />
      <div className="text-3xl mb-4">{icon}</div>
      <h3 style={{ color: "#f0f4f8", fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: "rgba(160,180,200,0.8)", fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
    </motion.div>
  );
}

export default FeatureCard;