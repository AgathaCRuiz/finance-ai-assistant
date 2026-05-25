import { useThemeStore } from "@/store/themestore";
import { motion } from "framer-motion";

interface HeaderProps {
  investorName?: string;
  isStreaming?: boolean;
  isDashboard?: boolean;
  onToggleDashboard?: () => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  // Mobile
  mobileDrawerOpen?: boolean;
  onToggleMobileDrawer?: () => void;
}

export function Header({
  investorName, isStreaming, isDashboard, onToggleDashboard,
  sidebarOpen, onToggleSidebar,
  mobileDrawerOpen, onToggleMobileDrawer,
}: HeaderProps) {
  const { theme, toggle } = useThemeStore();

  return (
    <header
      style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}
      className="flex items-center justify-between px-5 py-3 flex-shrink-0"
    >
      <div className="flex items-center gap-3">

        {/* Hamburguer — só mobile */}
        <motion.button
          onClick={onToggleMobileDrawer}
          whileTap={{ scale: 0.92 }}
          title="Menu"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 rounded-lg transition-all hover:border-[var(--border-bright)]"
        >
          <motion.span
            animate={mobileDrawerOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            className="block w-4 h-[1.5px] rounded-full"
            style={{ background: "var(--text-secondary)", originX: "center" }}
          />
          <motion.span
            animate={mobileDrawerOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            className="block w-4 h-[1.5px] rounded-full"
            style={{ background: "var(--text-secondary)" }}
          />
          <motion.span
            animate={mobileDrawerOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            className="block w-4 h-[1.5px] rounded-full"
            style={{ background: "var(--text-secondary)", originX: "center" }}
          />
        </motion.button>

        {/* Toggle sidebar — só desktop */}
        <motion.button
          onClick={onToggleSidebar}
          whileTap={{ scale: 0.92 }}
          title={sidebarOpen ? "Ocultar sidebar" : "Mostrar sidebar"}
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:border-[var(--border-bright)] hover:text-[var(--text-secondary)]"
        >
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
            <motion.rect
              x="1" y="1" width="4" height="10" rx="1"
              stroke="currentColor" strokeWidth="1.2"
              animate={{ opacity: sidebarOpen ? 1 : 0.3 }}
              transition={{ duration: 0.2 }}
            />
            <rect x="7" y="1" width="6" height="2.5" rx="0.6" fill="currentColor" opacity="0.5" />
            <rect x="7" y="4.75" width="6" height="2.5" rx="0.6" fill="currentColor" opacity="0.5" />
            <rect x="7" y="8.5" width="6" height="2.5" rx="0.6" fill="currentColor" opacity="0.5" />
          </svg>
        </motion.button>

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