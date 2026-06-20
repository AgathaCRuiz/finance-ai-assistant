import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileDrawer } from "./mobiledrawer";
import { DashboardPage } from "@/pages/dashboardpage";
import { ProfilePage } from "@/pages/profilepage";
import { useInvestorProfile } from "@/hooks/useinvestorprofile";
import { ProfilePage } from "@/pages/profilepage";
import { useChatStore } from "@/store/chatStore";

const MIN_WIDTH = 240;
const MAX_WIDTH = 500;
const DEFAULT_WIDTH = 256;
const STORAGE_KEY = "sidebar-width";
const SIDEBAR_OPEN_KEY = "sidebar-open";
const GAP = 12;

export function AppShell() {
  const { data } = useInvestorProfile();
  const isStreaming = useChatStore((s) => s.isStreaming);
  const navigate = useNavigate();
  const location = useLocation();
  const isDash    = location.pathname === "/dashboard";
  const isProfile = location.pathname === "/perfil";

  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? Number(saved) : DEFAULT_WIDTH;
  });

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem(SIDEBAR_OPEN_KEY);
    return saved !== null ? saved === "true" : true;
  });

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(v => {
      localStorage.setItem(SIDEBAR_OPEN_KEY, String(!v));
      return !v;
    });
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragStartX.current = e.clientX;
    dragStartWidth.current = sidebarWidth;
    setIsDragging(true);
  }, [sidebarWidth]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragStartWidth.current + (e.clientX - dragStartX.current)));
      setSidebarWidth(next);
    };
    const onUp = () => {
      setIsDragging(false);
      setSidebarWidth(w => { localStorage.setItem(STORAGE_KEY, String(w)); return w; });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  const onDoubleClick = useCallback(() => {
    setSidebarWidth(DEFAULT_WIDTH);
    localStorage.setItem(STORAGE_KEY, String(DEFAULT_WIDTH));
  }, []);

  function toggleDashboard() { navigate(isDash ? "/" : "/dashboard"); }
  function toggleProfile()   { navigate(isProfile ? "/" : "/perfil"); }

  return (
    <div
      style={{ background: "var(--bg-base)", userSelect: isDragging ? "none" : "auto" }}
      className="flex h-screen w-screen overflow-hidden relative"
    >
      {/* Sidebar flutuante desktop */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            key="sidebar"
            initial={{ x: -(MAX_WIDTH + GAP * 2), opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -(MAX_WIDTH + GAP * 2), opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="hidden md:flex fixed z-30 top-0 left-0 bottom-0"
            style={{ padding: GAP }}
          >
            <div
              className="flex flex-col overflow-hidden relative"
              style={{
                width: sidebarWidth,
                height: "100%",
                borderRadius: 18,
                background: "var(--bg-surface)",
                border: "1px solid var(--border-bright)",
                boxShadow: `
                  0 0 0 1px rgba(34,211,238,0.05),
                  0 8px 32px rgba(0,0,0,0.45),
                  0 20px 60px rgba(0,0,0,0.35),
                  0 0 60px rgba(34,211,238,0.03)
                `,
                transition: "width 0.25s ease",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] z-10 pointer-events-none"
                style={{ background: "linear-gradient(90deg,transparent,rgba(34,211,238,0.3),transparent)", borderRadius: "18px 18px 0 0" }} />
              <div className="absolute top-0 right-0 bottom-0 w-[1px] z-10 pointer-events-none"
                style={{ background: "linear-gradient(180deg,transparent,rgba(34,211,238,0.12),transparent)" }} />
              <div className="flex-1 overflow-hidden flex flex-col" style={{ borderRadius: 18 }}>
                <Sidebar
                  onDashboard={toggleDashboard}
                  onProfile={toggleProfile}
                  isDashboard={isDash}
                  isProfile={isProfile}
                  width={sidebarWidth}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Espaçador */}
      <motion.div
        className="hidden md:block flex-shrink-0"
        animate={{ width: sidebarOpen ? sidebarWidth + GAP * 2 + 6 : 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
      />

      {/* Drag handle */}
      {sidebarOpen && (
        <div
          onMouseDown={onMouseDown}
          onDoubleClick={onDoubleClick}
          title="Arraste para redimensionar · Duplo clique para resetar"
          className="hidden md:block fixed z-40 top-0 bottom-0"
          style={{
            left: sidebarWidth + GAP * 2,
            width: 6,
            cursor: "col-resize",
            background: isDragging ? "var(--accent-dim)" : "transparent",
            transition: isDragging ? "none" : "background 0.2s, left 0.25s ease",
          }}
        />
      )}

      {/* Mobile Drawer */}
      <MobileDrawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        onDashboard={toggleDashboard}
        isDashboard={isDash}
      />

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header
          investorName={data?.perfil.nome}
          isStreaming={isStreaming}
          isDashboard={isDash}
          isProfile={isProfile}
          onToggleDashboard={toggleDashboard}
          onToggleProfile={toggleProfile}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
          mobileDrawerOpen={mobileDrawerOpen}
          onToggleMobileDrawer={() => setMobileDrawerOpen(prev => !prev)}
        />
        <main className={`flex-1 min-h-0 ${isDash || isProfile ? "overflow-y-auto scrollbar-thin" : "overflow-hidden"}`}>
          <Routes>
            <Route path="/" element={<ChatWindow investorName={data?.perfil.nome} />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="perfil" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}