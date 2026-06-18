import { motion } from "framer-motion";

function FloatingStat({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center gap-1"
    >
      <span style={{ color: "#22d3ee", fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em", fontFamily: "system-ui" }}>
        {value}
      </span>
      <span style={{ color: "rgba(160,180,200,0.6)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </span>
    </motion.div>
  );
}

export default FloatingStat;