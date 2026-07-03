import { motion } from "framer-motion";

function FloatingStat({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center gap-0.5"
    >
      <span style={{ color: "rgba(248, 250, 252, 0.9)", fontSize: 20, fontWeight: 300, letterSpacing: "-0.01em", fontFamily: "var(--font-display)" }}>
        {value}
      </span>
      <span style={{ color: "rgba(148, 163, 184, 0.5)", fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </span>
    </motion.div>
  );
}

export default FloatingStat;