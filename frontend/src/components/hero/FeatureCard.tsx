import React from "react";
import { motion } from "framer-motion";
import BorderGlow from "./BorderGlow";

function FeatureCard({
  icon, title, desc, delay = 0
}: {
  icon: React.ReactNode; title: string; desc: string; color?: string; delay?: number;
}) {
  // Gracefully clone the icon to inject fine strokes and use the custom SVG gradient path
  const clonedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, {
        className: "w-6 h-6",
        stroke: "url(#feature-icon-grad)",
        strokeWidth: 1.0,
      })
    : icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="w-full h-full"
    >
      {/* Hidden SVG Gradient defs for the stroke styling */}
      <svg className="absolute w-0 h-0 pointer-events-none" width="0" height="0">
        <defs>
          <linearGradient id="feature-icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#52525b" />
          </linearGradient>
        </defs>
      </svg>

      <BorderGlow
        edgeSensitivity={35}
        glowColor="0 0 100" // Gentle neutral light glow
        backgroundColor="rgba(3, 4, 7, 0.75)" // Extremely dark semi-transparent black interior
        borderRadius={20}
        glowRadius={32}
        glowIntensity={0.02} // Super subtle and refined soft glow
        fillOpacity={0.005} // Faint ambient inner highlight
        coneSpread={20}
        animated={false}
        colors={[
          "rgba(255, 255, 255, 0.12)", 
          "rgba(255, 255, 255, 0.03)", 
          "rgba(255, 255, 255, 0.002)"
        ]} // Super delicate silver border gradient
        className="w-full h-full cursor-default"
      >
        <div className="p-7 flex flex-col h-full text-left">
          {/* Metallic gradient border wrapper for the icon */}
          <div className="mb-5 relative w-12 h-12 rounded-full p-[1px] bg-gradient-to-b from-white/25 to-white/[0.02]">
            <div className="flex items-center justify-center w-full h-full bg-black rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              {clonedIcon}
            </div>
          </div>

          <h3 className="text-white text-[16px] font-normal tracking-tight mb-2 font-sans">{title}</h3>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light font-sans flex-grow">{desc}</p>
        </div>
      </BorderGlow>
    </motion.div>
  );
}

export default FeatureCard;