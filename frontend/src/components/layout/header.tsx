import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/store/themestore";
import { useAuthStore } from "@/store/authStore";

interface HeaderProps {
  investorName?: string;
  isStreaming?: boolean;
  isDashboard?: boolean;
  isProfile?: boolean;
  onToggleDashboard?: () => void;
  onToggleProfile?: () => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  mobileDrawerOpen?: boolean;
  onToggleMobileDrawer?: () => void;
}

export function Header({
  investorName, isStreaming, isDashboard, isProfile,
  onToggleDashboard, onToggleProfile,
  sidebarOpen, onToggleSidebar,
  mobileDrawerOpen, onToggleMobileDrawer,
}: HeaderProps) {
  const { theme, toggle } = useThemeStore();
  const signOut = useAuthStore(s => s.signOut);
  const [confirmLogout, setConfirmLogout] = useState(false);

  async function handleLogout() {
    await signOut();
    window.location.href = "/";
  }

  return (
    <header
      style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}
      className="flex items-center justify-between px-5 py-3 flex-shrink-0"
    >
      <div className="flex items-center gap-2">

        {/* Hamburguer mobile */}
        <motion.button onClick={onToggleMobileDrawer} whileTap={{ scale: 0.92 }}
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 rounded-lg">
          <motion.span animate={mobileDrawerOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            className="block w-4 h-[1.5px] rounded-full" style={{ background: "var(--text-secondary)", originX: "center" }} />
          <motion.span animate={mobileDrawerOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-4 h-[1.5px] rounded-full" style={{ background: "var(--text-secondary)" }} />
          <motion.span animate={mobileDrawerOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            className="block w-4 h-[1.5px] rounded-full" style={{ background: "var(--text-secondary)", originX: "center" }} />
        </motion.button>

        {/* Toggle sidebar desktop */}
        <motion.button onClick={onToggleSidebar} whileTap={{ scale: 0.92 }}
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:border-[var(--border-bright)] transition-all">
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
            <motion.rect x="1" y="1" width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"
              animate={{ opacity: sidebarOpen ? 1 : 0.3 }} transition={{ duration: 0.2 }} />
            <rect x="7" y="1" width="6" height="2.5" rx="0.6" fill="currentColor" opacity="0.5" />
            <rect x="7" y="4.75" width="6" height="2.5" rx="0.6" fill="currentColor" opacity="0.5" />
            <rect x="7" y="8.5" width="6" height="2.5" rx="0.6" fill="currentColor" opacity="0.5" />
          </svg>
        </motion.button>

        {/* Toggle Dashboard */}
        <motion.button onClick={onToggleDashboard} whileTap={{ scale: 0.92 }}
          style={{
            background: isDashboard ? "var(--accent-glow)" : "var(--bg-elevated)",
            border: `1px solid ${isDashboard ? "var(--accent-dim)" : "var(--border)"}`,
            color: isDashboard ? "var(--accent)" : "var(--text-muted)",
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:border-[var(--border-bright)]">
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

        {/* Toggle Perfil */}
        <motion.button onClick={onToggleProfile} whileTap={{ scale: 0.92 }}
          style={{
            background: isProfile ? "var(--accent-glow)" : "var(--bg-elevated)",
            border: `1px solid ${isProfile ? "var(--accent-dim)" : "var(--border)"}`,
            color: isProfile ? "var(--accent)" : "var(--text-muted)",
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:border-[var(--border-bright)]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M1.5 11c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="font-mono text-[10px] hidden sm:block">
            {isProfile ? "VOLTAR" : "PERFIL"}
          </span>
        </motion.button>

        {isStreaming && (
          <span style={{ color: "var(--text-muted)" }} className="font-mono text-[10px] animate-pulse hidden sm:block">
            digitando...
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {investorName && (
          <span style={{ color: "var(--text-muted)" }} className="font-body text-xs hidden sm:block truncate max-w-32">
            {investorName}
          </span>
        )}

        {/* Toggle tema */}
        <motion.button onClick={toggle} whileTap={{ scale: 0.92 }}
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all hover:border-[var(--border-bright)]">
          <span style={{ color: "var(--text-secondary)" }} className="text-xs">
            {theme === "dark" ? "☀" : "☾"}
          </span>
          <span style={{ color: "var(--text-muted)" }} className="font-mono text-[10px] hidden sm:block">
            {theme === "dark" ? "CLARO" : "ESCURO"}
          </span>
        </motion.button>

        {/* Logout */}
        <div className="relative">
          <motion.button
            onClick={() => setConfirmLogout(v => !v)}
            whileTap={{ scale: 0.92 }}
            title="Sair"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "#f87171" }}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:border-red-400/40"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M5 1.5H2.5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1H5M9 9.5l3-3-3-3M12 6.5H4.5"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>

          <AnimatePresence>
            {confirmLogout && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 z-50 rounded-xl p-3 w-44"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-bright)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                }}
              >
                <p style={{ color: "var(--text-secondary)" }} className="font-body text-xs mb-2.5">
                  Sair da conta?
                </p>
                <div className="flex gap-2">
                  <button onClick={handleLogout}
                    className="flex-1 rounded-lg py-1.5 font-mono text-[10px] transition-colors"
                    style={{ background: "#f8717120", color: "#f87171", border: "1px solid #f8717140" }}>
                    SAIR
                  </button>
                  <button onClick={() => setConfirmLogout(false)}
                    className="flex-1 rounded-lg py-1.5 font-mono text-[10px] transition-colors"
                    style={{ background: "var(--bg-hover)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                    CANCELAR
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}