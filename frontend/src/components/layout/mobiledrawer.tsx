import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./SideBar";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  onDashboard?: () => void;
  isDashboard?: boolean;
}

export function MobileDrawer({ open, onClose, onDashboard, isDashboard }: MobileDrawerProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          />

          {/* Drawer flutuante */}
          <motion.div
            key="drawer"
            initial={{ x: "-110%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-110%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed z-50 md:hidden"
            style={{
              top: 12,
              left: 12,
              bottom: 12,
              width: 272,
            }}
          >
            {/* Container com bordas arredondadas e sombra flutuante */}
            <div
              className="h-full flex flex-col overflow-hidden relative"
              style={{
                borderRadius: 20,
                background: "var(--bg-surface)",
                border: "1px solid var(--border-bright)",
                boxShadow: `
                  0 0 0 1px rgba(34,211,238,0.06),
                  0 8px 32px rgba(0,0,0,0.5),
                  0 24px 64px rgba(0,0,0,0.4),
                  0 0 80px rgba(34,211,238,0.04)
                `,
              }}
            >
              {/* Linha de brilho no topo */}
              <div
                className="absolute top-0 left-0 right-0 h-[1px] z-10"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.35), transparent)",
                  borderRadius: "20px 20px 0 0",
                }}
              />

              {/* Linha de brilho na direita */}
              <div
                className="absolute top-0 right-0 bottom-0 w-[1px] z-10"
                style={{
                  background: "linear-gradient(180deg, transparent, rgba(34,211,238,0.15), transparent)",
                }}
              />

              {/* Sidebar dentro do drawer — passa borderRadius pra não vazar */}
              <div className="flex-1 overflow-hidden flex flex-col" style={{ borderRadius: 20 }}>
                <Sidebar
                  onDashboard={() => { onDashboard?.(); onClose(); }}
                  isDashboard={isDashboard}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}