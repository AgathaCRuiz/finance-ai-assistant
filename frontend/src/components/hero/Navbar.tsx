import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Features",  href: "features"  },
  { label: "Dashboard", href: "dashboard" },
  { label: "Sobre",     href: "sobre"     },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
          position: "fixed",
          top: 16,
          left: 24,
          right: 24,
          maxWidth: 1100,
          margin: "0 auto",
        transform: "translateX(-50%)",
        width: "calc(100% - 48px)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        borderRadius: 16,
        background: scrolled
        ? "rgba(7, 9, 13, 0.45)"
        : "rgba(7, 9, 13, 0.2)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(34, 211, 238, 0.08)",
        boxShadow: scrolled
          ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)"
          : "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
        transition: "background 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Logo */}
      <motion.button
        onClick={() => scrollToSection("hero")}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 10 }}
      >
        <motion.div
          whileHover={{ boxShadow: "0 0 24px rgba(34,211,238,0.7)" }}
          transition={{ duration: 0.2 }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "linear-gradient(135deg, #22d3ee, #06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(34,211,238,0.4)",
          }}
        >
          <span style={{ color: "#000", fontWeight: 800, fontSize: 13 }}>E</span>
        </motion.div>
        <span style={{ color: "#f0f4f8", fontWeight: 600, fontSize: 15, letterSpacing: "-0.02em" }}>
          Edu Finance
        </span>
      </motion.button>

      {/* Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {NAV_LINKS.map(({ label, href }) => (
          <motion.button
            key={href}
            onClick={() => { scrollToSection(href); setActiveLink(href); }}
            onHoverStart={() => setActiveLink(href)}
            onHoverEnd={() => setActiveLink(null)}
            style={{
              position: "relative",
              color: activeLink === href ? "#f0f4f8" : "rgba(160,180,200,0.55)",
              fontSize: 14,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 14px",
              borderRadius: 8,
              transition: "color 0.2s",
            }}
          >
            {/* Highlight de fundo no hover */}
            {activeLink === href && (
              <motion.span
                layoutId="nav-highlight"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 8,
                  background: "rgba(34,211,238,0.07)",
                  border: "1px solid rgba(34,211,238,0.12)",
                }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Ações */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <motion.button
          onClick={() => navigate("/app")}
          whileHover={{ color: "#f0f4f8" }}
          whileTap={{ scale: 0.96 }}
          style={{
            color: "rgba(160,180,200,0.6)",
            fontSize: 14,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "7px 16px",
            borderRadius: 8,
            transition: "color 0.2s",
          }}
        >
          Entrar
        </motion.button>

        <motion.button
          onClick={() => navigate("/app")}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 0 28px rgba(34,211,238,0.55)",
          }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{
            background: "linear-gradient(135deg, #22d3ee, #06b6d4)",
            color: "#000",
            fontWeight: 700,
            fontSize: 14,
            border: "none",
            borderRadius: 10,
            padding: "8px 20px",
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(34,211,238,0.3)",
            letterSpacing: "-0.01em",
          }}
        >
          Começar grátis
        </motion.button>
      </div>
    </motion.nav>
  );
}