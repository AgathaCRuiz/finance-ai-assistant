import { motion } from "framer-motion";
import type { ChatSuggestion } from "@/types";

const suggestions: ChatSuggestion[] = [
  { id: "1", label: "Como está minha carteira?", prompt: "Faça um resumo da minha carteira de investimentos atual.", icon: "↗" },
  { id: "2", label: "Minhas metas financeiras", prompt: "Quais são minhas metas financeiras e como estou progredindo?", icon: "↗" },
  { id: "3", label: "Sugestões de investimento", prompt: "Com base no meu perfil, quais investimentos você recomenda agora?", icon: "↗" },
  { id: "4", label: "Análise de gastos", prompt: "Analise meus gastos recentes e identifique oportunidades de economia.", icon: "↗" },
];

interface WelcomeScreenProps {
  onSuggestionClick: (prompt: string) => void;
  investorName?: string;
}

export function WelcomeScreen({ onSuggestionClick, investorName }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 select-none">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-3 mb-10"
      >
        {/* Logo com glow */}
        <div className="relative mb-2">
          <div
            style={{ background: "var(--accent-glow)", filter: "blur(20px)" }}
            className="absolute inset-0 rounded-2xl scale-150"
          />
          <div
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-bright)" }}
            className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
          >
            <span style={{ color: "var(--accent)" }} className="font-display text-2xl font-bold">E</span>
          </div>
        </div>

        <h1 style={{ color: "var(--text-primary)" }} className="font-display text-2xl font-semibold">
          {investorName ? `Olá, ${investorName.split(" ")[0]}` : "Olá"}
        </h1>
        <p style={{ color: "var(--text-muted)" }} className="font-mono text-xs tracking-widest uppercase">
          Edu Finance · Assessora IA
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ color: "var(--text-secondary)" }}
        className="font-body text-sm text-center max-w-sm mb-10 leading-relaxed"
      >
        Como posso ajudar com suas finanças hoje?
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg"
      >
        {suggestions.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.07 }}
            onClick={() => onSuggestionClick(s.prompt)}
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
            className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:border-[var(--border-bright)] hover:bg-[var(--bg-hover)] transition-all duration-200 text-left"
          >
            <span className="font-body text-sm">{s.label}</span>
            <span style={{ color: "var(--accent)" }} className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              {s.icon}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}