import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInvestorProfile } from "@/hooks/useInvestorProfile";
import { useChat } from "@/hooks/useChat";
import { InvestorCard } from "@/components/investor/InvestorCard";
import { PortfolioSummary } from "@/components/investor/PortfolioSummary";
import { GoalsList } from "@/components/investor/GoalsList";

interface SidebarProps {
  onDashboard?: () => void;
  onProfile?: () => void;
  isDashboard?: boolean;
  isProfile?: boolean;
  width?: number;
}

const COLLAPSE_THRESHOLD = 200;
const PANEL_OPEN_KEY     = "sidebar-panel-open";
const PANEL_HEIGHT_KEY   = "sidebar-panel-height";
const DEFAULT_PANEL_PCT  = 40;
const MIN_PANEL_PCT      = 15;
const MAX_PANEL_PCT      = 80;

function timeAgo(ts: number): string {
  const d = Date.now() - ts;
  const m = Math.floor(d / 60000), h = Math.floor(d / 3600000), day = Math.floor(d / 86400000);
  if (m < 1) return "agora"; if (m < 60) return `${m}m`; if (h < 24) return `${h}h`; return `${day}d`;
}

export function Sidebar({ onDashboard, onProfile, isDashboard, isProfile, width = 256 }: SidebarProps) {
  const { data, status, error } = useInvestorProfile();
  const { sessions, activeSession, newChat, switchSession, deleteSession } = useChat();
  const isCompact = width < COLLAPSE_THRESHOLD;

  const [panelOpen, setPanelOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem(PANEL_OPEN_KEY);
    return saved !== null ? saved === "true" : true;
  });

  const [panelPct, setPanelPct] = useState<number>(() => {
    const saved = localStorage.getItem(PANEL_HEIGHT_KEY);
    return saved ? Number(saved) : DEFAULT_PANEL_PCT;
  });

  const [isDragging, setIsDragging] = useState(false);
  const asideRef       = useRef<HTMLElement>(null);
  const dragStartY     = useRef(0);
  const dragStartPct   = useRef(0);

  const togglePanel = () => {
    setPanelOpen(v => { localStorage.setItem(PANEL_OPEN_KEY, String(!v)); return !v; });
  };

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragStartY.current   = e.clientY;
    dragStartPct.current = panelPct;
    setIsDragging(true);
  }, [panelPct]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      if (!asideRef.current) return;
      const totalH   = asideRef.current.getBoundingClientRect().height;
      const deltaY   = e.clientY - dragStartY.current;
      const deltaPct = (deltaY / totalH) * 100;
      const next     = Math.min(MAX_PANEL_PCT, Math.max(MIN_PANEL_PCT, dragStartPct.current - deltaPct));
      setPanelPct(next);
    };
    const onUp = () => {
      setIsDragging(false);
      setPanelPct(p => { localStorage.setItem(PANEL_HEIGHT_KEY, String(p)); return p; });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [isDragging]);

  const onDoubleClick = useCallback(() => {
    setPanelPct(DEFAULT_PANEL_PCT);
    localStorage.setItem(PANEL_HEIGHT_KEY, String(DEFAULT_PANEL_PCT));
  }, []);

  return (
    <aside
      ref={asideRef}
      style={{ width: "100%", background: "transparent", userSelect: isDragging ? "none" : "auto" }}
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)" }}
        className="px-4 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div style={{ background: "var(--accent)", boxShadow: "0 0 12px var(--accent-glow)", flexShrink: 0 }}
            className="w-6 h-6 rounded-lg flex items-center justify-center">
            <span className="font-bold text-[11px] text-black">E</span>
          </div>
          {!isCompact && (
            <span style={{ color: "var(--text-primary)" }} className="font-display text-sm font-semibold tracking-tight truncate">
              Edu Finance
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Dashboard */}
          <motion.button whileTap={{ scale: 0.9 }} onClick={onDashboard}
            style={{ background: isDashboard ? "var(--accent-glow)" : "var(--bg-elevated)", border: `1px solid ${isDashboard ? "var(--accent-dim)" : "var(--border)"}` }}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:border-[var(--border-bright)] transition-colors" title="Dashboard">
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
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:border-[var(--border-bright)] transition-colors" title="Nova conversa">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1v9M1 5.5h9" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Histórico */}
      <div className="overflow-hidden flex flex-col min-h-0 flex-1">
        {sessions.length > 0 && (
          <div style={{ borderBottom: "1px solid var(--border)" }} className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {!isCompact && (
              <div className="px-4 pt-3 pb-1 flex-shrink-0">
                <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] tracking-widest uppercase">Conversas</span>
              </div>
            )}
            <div className="overflow-y-auto scrollbar-thin flex-1 min-h-0">
              <AnimatePresence initial={false}>
                {sessions.map((sess) => {
                  const isActive = sess.id === activeSession?.id;
                  return (
                    <motion.div key={sess.id}
                      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.15 }}
                      onClick={() => switchSession(sess.id)}
                      style={{ background: isActive ? "var(--bg-elevated)" : "transparent" }}
                      className="group flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors">
                      <span style={{ background: isActive ? "var(--accent)" : "var(--border)", boxShadow: isActive ? "0 0 6px var(--accent-glow)" : "none", flexShrink: 0 }}
                        className="w-1 h-1 rounded-full transition-all" />
                      {!isCompact && (
                        <>
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
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Drag handle */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseDown={onMouseDown}
            onDoubleClick={onDoubleClick}
            title="Arraste · Duplo clique para resetar"
            style={{
              height: 4, flexShrink: 0, cursor: "row-resize",
              background: isDragging ? "var(--accent-dim)" : "var(--border)",
              transition: isDragging ? "none" : "background 0.2s",
              zIndex: 10,
            }}
            className="hover:bg-[var(--accent-dim)]"
          />
        )}
      </AnimatePresence>

      {/* Painel inferior — trigger */}
      <div style={{ borderTop: "1px solid var(--border)" }} className="flex-shrink-0">
        {status === "success" && data && (
          <div className="flex items-center">
            {/* Clica no avatar/nome → abre perfil */}
            <button onClick={onProfile}
              className="flex-1 flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors group"
              title="Editar perfil"
            >
              <div style={{ background: isProfile ? "var(--accent)" : "var(--bg-elevated)", border: `1px solid ${isProfile ? "var(--accent)" : "var(--border-bright)"}`, boxShadow: "0 0 12px var(--accent-glow)", flexShrink: 0 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all">
                <span style={{ color: isProfile ? "#000" : "var(--accent)" }} className="font-display text-sm font-bold">
                  {data.perfil.nome.split(" ").slice(0, 2).map((n: string) => n[0]).join("")}
                </span>
              </div>
              {!isCompact && (
                <div className="flex-1 text-left min-w-0">
                  <p style={{ color: "var(--text-primary)" }} className="font-display text-sm font-semibold leading-tight truncate">
                    {data.perfil.nome}
                  </p>
                  <span style={{ color: "var(--accent)", background: "var(--accent-glow)", border: "1px solid var(--accent-dim)" }}
                    className="font-mono text-[9px] rounded px-1.5 py-0.5 inline-block mt-0.5">
                    {data.perfil.perfil_investidor.toUpperCase()}
                  </span>
                </div>
              )}
            </button>

            {/* Botão de colapsar painel */}
            <button onClick={togglePanel}
              className="px-3 py-3 hover:bg-[var(--bg-hover)] transition-colors flex-shrink-0"
              style={{ borderLeft: "1px solid var(--border)" }}>
              <motion.div animate={{ rotate: panelOpen ? 180 : 0 }} transition={{ duration: 0.22 }}
                style={{ color: "var(--text-muted)" }} className="opacity-40 hover:opacity-80 transition-opacity">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </button>
          </div>
        )}
        {status === "loading" && (
          <div className="flex flex-col gap-3 px-4 py-4">
            {[75, 90, 60].map((w, i) => (
              <div key={i} style={{ background: "var(--bg-elevated)", width: `${w}%` }} className="h-3 rounded animate-pulse" />
            ))}
          </div>
        )}
        {status === "error" && (
          <div className="px-4 py-3">
            <p style={{ color: "var(--negative)" }} className="font-mono text-[10px]">{error}</p>
          </div>
        )}
      </div>

      {/* Painel colapsável com dados do investidor */}
      <AnimatePresence initial={false}>
        {panelOpen && status === "success" && data && (
          <motion.div
            key="panel-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: `${panelPct}%`, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden", flexShrink: 0 }}
          >
            <div className="overflow-y-auto scrollbar-thin h-full" style={{ borderTop: "1px solid var(--border)" }}>
              <InvestorCard perfil={data.perfil} metricas={data.metricas} reserva={data.reserva} />
              <PortfolioSummary gastos={data.gastos_categoria} />
              <GoalsList metas={data.metas} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rodapé */}
      <div style={{ borderTop: "1px solid var(--border)" }} className="px-4 py-2.5 flex-shrink-0">
        {!isCompact ? (
          <p style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] text-center opacity-50">v1.1 · DIO Lab</p>
        ) : (
          <div style={{ background: "var(--border)" }} className="w-4 h-0.5 mx-auto rounded opacity-30" />
        )}
      </div>
    </aside>
  );
}