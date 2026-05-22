import { useThemeStore } from "@/store/themestore";
import { motion } from "framer-motion";

interface HeaderProps {
  investorName?: string;
  isStreaming?: boolean;
  isDashboard?: boolean;
  onToggleDashboard?: () => void;
}

export function Header({ investorName, isStreaming, isDashboard, onToggleDashboard }: HeaderProps) {
  const { theme, toggle } = useThemeStore();

  return (
    <header style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}
      className="flex items-center justify-between px-5 py-3 flex-shrink-0">

      <div className="flex items-center gap-3">
        {/* Toggle Dashboard */}
        <motion.button
          onClick={onToggleDashboard}
          whileTap={{ scale: 0.92 }}
          style={{
            background: isDashboard ? "var(--accent-glow)" : "var(--bg-elevated)",
            border: `1px solid ${isDashboard ? "var(--accent-dim)" : "var(--border)"}`,
            color: isDashboard ? "var(--accent)" : "var(--text-muted)",
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 hover:border-[var(--border-bright)]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="1" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="7" y="1" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="1" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="7" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          <span className="font-mono text-[10px] hidden sm:block">
            {isDashboard ? "CHAT" : "DASHBOARD"}
          </span>
        </motion.button>

        {isStreaming && (
          <span style={{ color: "var(--text-muted)" }} className="font-mono text-[10px] animate-pulse">
            digitando...
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {investorName && (
          <span style={{ color: "var(--text-muted)" }} className="font-body text-xs hidden sm:block">
            {investorName}
          </span>
        )}

        {/* Toggle tema */}
        <motion.button
          onClick={toggle}
          whileTap={{ scale: 0.92 }}
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:border-[var(--border-bright)]"
        >
          <span style={{ color: "var(--text-secondary)" }} className="text-xs">
            {theme === "dark" ? "☀" : "☾"}
          </span>
          <span style={{ color: "var(--text-muted)" }} className="font-mono text-[10px] hidden sm:block">
            {theme === "dark" ? "CLARO" : "ESCURO"}
          </span>
        </motion.button>
      </div>
    </header>
  );
}