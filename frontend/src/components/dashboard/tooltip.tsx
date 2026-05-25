import { useState, useRef, type ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ children, content, side = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos]         = useState({ top: "auto", bottom: "auto", left: "auto", right: "auto", transform: "" });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) return;

    const trigger  = triggerRef.current.getBoundingClientRect();
    const tooltip  = tooltipRef.current.getBoundingClientRect();
    const vw       = window.innerWidth;
    const vh       = window.innerHeight;
    const gap       = 8;

    let top = "auto", bottom = "auto", left = "auto", right = "auto", transform = "";

    // Posição base
    if (side === "top" || side === "bottom") {
      // Centralizado horizontalmente
      let lVal = trigger.left + trigger.width / 2 - tooltip.width / 2;
      // Clamp para não sair da tela
      lVal = Math.max(8, Math.min(lVal, vw - tooltip.width - 8));
      left = `${lVal}px`;

      if (side === "top") {
        // Tenta cima, se não couber vai pra baixo
        if (trigger.top - tooltip.height - gap > 0) {
          bottom = `${vh - trigger.top + gap}px`;
        } else {
          top = `${trigger.bottom + gap}px`;
        }
      } else {
        if (trigger.bottom + tooltip.height + gap < vh) {
          top = `${trigger.bottom + gap}px`;
        } else {
          bottom = `${vh - trigger.top + gap}px`;
        }
      }
    }

    if (side === "right" || side === "left") {
      let tVal = trigger.top + trigger.height / 2 - tooltip.height / 2;
      tVal = Math.max(8, Math.min(tVal, vh - tooltip.height - 8));
      top = `${tVal}px`;

      if (side === "right") {
        if (trigger.right + tooltip.width + gap < vw) {
          left = `${trigger.right + gap}px`;
        } else {
          right = `${vw - trigger.left + gap}px`;
        }
      } else {
        if (trigger.left - tooltip.width - gap > 0) {
          right = `${vw - trigger.left + gap}px`;
        } else {
          left = `${trigger.right + gap}px`;
        }
      }
    }

    setPos({ top, bottom, left, right, transform });
  }, [visible, side]);

  return (
    <>
      <div ref={triggerRef} className="relative inline-flex w-full"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>

      <AnimatePresence>
        {visible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[9999] pointer-events-none w-max max-w-[240px]"
            style={{
              top: pos.top,
              bottom: pos.bottom,
              left: pos.left,
              right: pos.right,
              transform: pos.transform,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-bright)",
              borderRadius: "10px",
              padding: "10px 12px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(34,211,238,0.06)",
            }}
          >
            <div className="absolute top-0 left-3 right-3 h-[1px] rounded-full"
              style={{ background: "linear-gradient(90deg,transparent,var(--accent),transparent)", opacity: 0.4 }} />
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface KpiTooltipContentProps {
  label: string;
  value: string;
  detail?: string;
  trend?: string;
  trendColor?: string;
}

export function KpiTooltipContent({ label, value, detail, trend, trendColor = "#22d3ee" }: KpiTooltipContentProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span style={{ color: "var(--text-muted)" }} className="font-mono text-[9px] uppercase tracking-widest">
        {label}
      </span>
      <span style={{ color: "var(--text-primary)" }} className="font-display text-lg font-bold tracking-tight">
        {value}
      </span>
      {trend && (
        <span style={{ color: trendColor }} className="font-mono text-[10px]">{trend}</span>
      )}
      {detail && (
        <span style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}
          className="font-body text-[10px] pt-1.5 mt-0.5 leading-relaxed">
          {detail}
        </span>
      )}
    </div>
  );
}