import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInvestorProfile } from "@/hooks/useinvestorprofile";
import { useChat } from "@/hooks/usechat";

interface SidebarProps {
  onDashboard?: () => void;
  onProfile?: () => void;
  onUpload?: () => void;
  onTransacoes?: () => void;
  isDashboard?: boolean;
  isProfile?: boolean;
  isUpload?: boolean;
  isTransacoes?: boolean;
  width?: number;
}

function timeAgo(ts: number): string {
  const d = Date.now() - ts;
  const m = Math.floor(d / 60000), h = Math.floor(d / 3600000), day = Math.floor(d / 86400000);
  if (m < 1) return "agora"; if (m < 60) return `${m}m`; if (h < 24) return `${h}h`; return `${day}d`;
}

// ── Tooltip ──────────────────────────────────────────────────
function Tip({ label, children }: { label: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center"
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.12 }}
            className="absolute left-full ml-3 z-50 pointer-events-none px-2.5 py-1.5 rounded-lg whitespace-nowrap"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-bright)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
            <span style={{ color: "var(--text-primary)" }} className="font-body text-xs">{label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── NavButton ─────────────────────────────────────────────────
function NavBtn({ icon, label, active, onClick, badge }: {
  icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void; badge?: number;
}) {
  return (
    <Tip label={label}>
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.92 }}
        className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
        style={{
          background: active ? "var(--accent-glow)" : "transparent",
          border: `1px solid ${active ? "var(--accent-dim)" : "transparent"}`,
          color: active ? "var(--accent)" : "var(--text-muted)",
          boxShadow: active ? "0 0 16px var(--accent-glow)" : "none",
        }}
      >
        {icon}
        {!!badge && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center font-mono text-[9px]"
            style={{ background: "var(--accent)", color: "#000" }}>
            {badge}
          </span>
        )}
      </motion.button>
    </Tip>
  );
}

// ── Icons SVG ─────────────────────────────────────────────────
const Icons = {
  chat: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M14 9.333A1.333 1.333 0 0 1 12.667 10.667H4.667L2 13.333V3.333A1.333 1.333 0 0 1 3.333 2h9.334A1.333 1.333 0 0 1 14 3.333v6z"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  transacoes: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  upload: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 10V3M8 3L5.5 5.5M8 3L10.5 5.5M3 13h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  profile: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M2.5 14c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  plus: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  close: (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

export function Sidebar({
  onDashboard, onProfile, onUpload, onTransacoes,
  isDashboard, isProfile, isUpload, isTransacoes,
  width = 256,
}: SidebarProps) {
  const { data } = useInvestorProfile();
  const { sessions, activeSession, newChat, switchSession, deleteSession } = useChat();

  const isChat = !isDashboard && !isProfile && !isUpload && !isTransacoes;
  const isCompact = width < 200;

  return (
    <div className="flex h-full w-full" style={{ userSelect: "none" }}>

      {/* ── Rail de ícones ── */}
      <div className="flex flex-col items-center py-4 gap-1 flex-shrink-0"
        style={{
          width: 56,
          borderRight: "1px solid var(--border)",
          background: "var(--bg-surface)",
        }}>

        {/* Logo */}
        <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
          style={{ background: "var(--accent)", boxShadow: "0 0 16px var(--accent-glow)" }}>
          <span className="font-bold text-[13px] text-black">E</span>
        </div>

        {/* Nav principal */}
        <NavBtn icon={Icons.chat}       label="Chat"         active={isChat}        onClick={newChat} />
        <NavBtn icon={Icons.dashboard}  label="Dashboard"    active={isDashboard}   onClick={onDashboard} />
        <NavBtn icon={Icons.transacoes} label="Extrato"      active={isTransacoes}  onClick={onTransacoes} />

        {/* Separador */}
        <div className="w-6 h-px my-2" style={{ background: "var(--border)" }} />

        <NavBtn icon={Icons.upload}  label="Importar CSV" active={isUpload}   onClick={onUpload} />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Separador */}
        <div className="w-6 h-px mb-2" style={{ background: "var(--border)" }} />

        {/* Avatar do usuário */}
        <Tip label={data?.perfil.nome ?? "Perfil"}>
          <motion.button
            onClick={onProfile}
            whileTap={{ scale: 0.92 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: isProfile ? "var(--accent)" : "var(--bg-elevated)",
              border: `1px solid ${isProfile ? "var(--accent)" : "var(--border-bright)"}`,
              boxShadow: isProfile ? "0 0 12px var(--accent-glow)" : "none",
              color: isProfile ? "#000" : "var(--accent)",
            }}
          >
            <span className="font-display text-xs font-bold">
              {(data?.perfil.nome ?? "?").split(" ").slice(0, 2).map((n: string) => n[0]).join("")}
            </span>
          </motion.button>
        </Tip>
      </div>

      {/* ── Painel lateral (histórico de chat) ── */}
      {!isCompact && (
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

          {/* Header do painel */}
          <div className="px-4 py-4 flex items-center justify-between flex-shrink-0"
            style={{ borderBottom: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase tracking-widest">
              Conversas
            </span>
            <motion.button whileTap={{ scale: 0.9 }} onClick={newChat}
              className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--accent)" }}
              title="Nova conversa">
              {Icons.plus}
            </motion.button>
          </div>

          {/* Lista de sessões */}
          <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0 py-2">
            {sessions.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p style={{ color: "var(--text-muted)" }} className="font-body text-xs">
                  Nenhuma conversa ainda
                </p>
                <button onClick={newChat}
                  className="mt-3 px-3 py-1.5 rounded-lg font-mono text-[10px] transition-colors"
                  style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-dim)", color: "var(--accent)" }}>
                  Iniciar conversa
                </button>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {sessions.map(sess => {
                  const isActive = sess.id === activeSession?.id;
                  return (
                    <motion.div key={sess.id}
                      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.15 }}
                      onClick={() => switchSession(sess.id)}
                      className="group flex items-center gap-2.5 mx-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                      style={{
                        background: isActive ? "var(--bg-elevated)" : "transparent",
                        border: `1px solid ${isActive ? "var(--border-bright)" : "transparent"}`,
                      }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all"
                        style={{ background: isActive ? "var(--accent)" : "var(--border)", boxShadow: isActive ? "0 0 6px var(--accent-glow)" : "none" }} />
                      <span style={{ color: isActive ? "var(--text-primary)" : "var(--text-muted)" }}
                        className="flex-1 font-body text-xs truncate">{sess.title}</span>
                      <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] group-hover:hidden flex-shrink-0">
                        {timeAgo(sess.createdAt)}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); void deleteSession(sess.id); }}
                        className="hidden group-hover:flex items-center justify-center w-4 h-4 flex-shrink-0 transition-colors hover:text-red-400"
                        style={{ color: "var(--text-muted)" }}>
                        {Icons.close}
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
            {data ? (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-dim)" }}>
                  <span style={{ color: "var(--accent)" }} className="font-display text-[10px] font-bold">
                    {data.perfil.nome.split(" ").slice(0, 2).map((n: string) => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ color: "var(--text-secondary)" }} className="font-body text-xs font-medium truncate">
                    {data.perfil.nome}
                  </p>
                  <p style={{ color: "var(--accent)" }} className="font-mono text-[9px]">
                    {data.perfil.perfil_investidor}
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] text-center">v1.2 · DIO Lab</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}