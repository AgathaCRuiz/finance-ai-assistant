import { motion, AnimatePresence } from "framer-motion";
import { useInvestorProfile } from "@/hooks/useinvestorprofile";
import { useChat } from "@/hooks/usechat";
import { InvestorCard } from "@/components/investor/investorcard";
import { PortfolioSummary } from "@/components/investor/portfoliosummary";
import { GoalsList } from "@/components/investor/goalslist";

interface SidebarProps {
  onDashboard?: () => void;
  isDashboard?: boolean;
}

function timeAgo(ts: number): string {
  const d = Date.now() - ts;
  const m = Math.floor(d / 60000), h = Math.floor(d / 3600000), day = Math.floor(d / 86400000);
  if (m < 1) return "agora"; if (m < 60) return `${m}m`; if (h < 24) return `${h}h`; return `${day}d`;
}

export function Sidebar({ onDashboard, isDashboard }: SidebarProps) {
  const { data, status, error } = useInvestorProfile();
  const { sessions, activeSession, newChat, switchSession, deleteSession } = useChat();

  return (
    <aside style={{ background: "var(--bg-surface)", borderRight: "1px solid var(--border)" }}
      className="w-64 flex-shrink-0 flex flex-col overflow-hidden">

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)" }}
        className="px-4 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div style={{ background: "var(--accent)", boxShadow: "0 0 12px var(--accent-glow)" }}
            className="w-6 h-6 rounded-lg flex items-center justify-center">
            <span className="font-bold text-[11px] text-black">E</span>
          </div>
          <span style={{ color: "var(--text-primary)" }} className="font-display text-sm font-semibold tracking-tight">
            Edu Finance
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Botão dashboard */}
          <motion.button whileTap={{ scale: 0.9 }} onClick={onDashboard}
            style={{
              background: isDashboard ? "var(--accent-glow)" : "var(--bg-elevated)",
              border: `1px solid ${isDashboard ? "var(--accent-dim)" : "var(--border)"}`,
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:border-[var(--border-bright)] transition-colors"
            title="Dashboard">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <rect x="0.5" y="0.5" width="4" height="4" rx="1" stroke="var(--accent)" strokeWidth="1"/>
              <rect x="6.5" y="0.5" width="4" height="4" rx="1" stroke="var(--accent)" strokeWidth="1"/>
              <rect x="0.5" y="6.5" width="4" height="4" rx="1" stroke="var(--accent)" strokeWidth="1"/>
              <rect x="6.5" y="6.5" width="4" height="4" rx="1" stroke="var(--accent)" strokeWidth="1"/>
            </svg>
          </motion.button>

          {/* Novo chat */}
          <motion.button whileTap={{ scale: 0.9 }} onClick={newChat}
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:border-[var(--border-bright)] transition-colors"
            title="Nova conversa">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1v9M1 5.5h9" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Histórico */}
      {sessions.length > 0 && (
        <div style={{ borderBottom: "1px solid var(--border)" }} className="flex-shrink-0">
          <div className="px-4 pt-3 pb-1">
            <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] tracking-widest uppercase">Conversas</span>
          </div>
          <div className="max-h-44 overflow-y-auto scrollbar-thin">
            <AnimatePresence initial={false}>
              {sessions.map((sess) => {
                const isActive = sess.id === activeSession?.id;
                return (
                  <motion.div key={sess.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.15 }}
                    onClick={() => switchSession(sess.id)}
                    style={{ background: isActive ? "var(--bg-elevated)" : "transparent" }}
                    className="group flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors">
                    <span style={{ background: isActive ? "var(--accent)" : "var(--border)", boxShadow: isActive ? "0 0 6px var(--accent-glow)" : "none" }}
                      className="w-1 h-1 rounded-full flex-shrink-0 transition-all" />
                    <span style={{ color: isActive ? "var(--text-primary)" : "var(--text-muted)" }}
                      className="flex-1 font-body text-xs truncate">{sess.title}</span>
                    <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] group-hover:hidden">
                      {timeAgo(sess.createdAt)}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); void deleteSession(sess.id); }}
                      className="hidden group-hover:flex items-center justify-center w-4 h-4 transition-colors"
                      style={{ color: "var(--text-muted)" }}>
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1 1l7 7M8 1L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Perfil */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {status === "loading" && (
          <div className="flex flex-col gap-3 px-4 py-6">
            {[75, 90, 60].map((w, i) => (
              <div key={i} style={{ background: "var(--bg-elevated)", width: `${w}%` }} className="h-3 rounded animate-pulse" />
            ))}
          </div>
        )}
        {status === "error" && (
          <div className="px-4 py-4">
            <p style={{ color: "var(--negative)" }} className="font-mono text-[10px]">{error}</p>
          </div>
        )}
        {status === "success" && data && (
          <>
            <InvestorCard perfil={data.perfil} metricas={data.metricas} reserva={data.reserva} />
            <PortfolioSummary gastos={data.gastos_categoria} />
            <GoalsList metas={data.metas} />
          </>
        )}
      </div>

      <div style={{ borderTop: "1px solid var(--border)" }} className="px-4 py-3 flex-shrink-0">
        <p style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] text-center opacity-50">v1.1 · DIO Lab</p>
      </div>
    </aside>
  );
}