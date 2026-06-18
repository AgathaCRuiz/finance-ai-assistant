import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Features",   href: "features"   },
  { label: "Dashboard",  href: "dashboard"  },
  { label: "Sobre",      href: "sobre"      },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Navbar() {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
      style={{
        background: "rgba(7,9,13,0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(34,211,238,0.06)",
      }}
    >
      {/* Logo */}
      <button
        onClick={() => scrollToSection("hero")}
        className="flex items-center gap-2.5"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "#22d3ee", boxShadow: "0 0 16px rgba(34,211,238,0.4)" }}
        >
          <span style={{ color: "#000", fontWeight: 700, fontSize: 12 }}>E</span>
        </div>
        <span style={{ color: "#f0f4f8", fontWeight: 600, fontSize: 15, letterSpacing: "-0.01em" }}>
          Edu Finance
        </span>
      </button>

      {/* Links de seção */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(({ label, href }) => (
          <button
            key={href}
            onClick={() => scrollToSection(href)}
            style={{
              color: "rgba(160,180,200,0.6)",
              fontSize: 14,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f0f4f8")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(160,180,200,0.6)")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Ações */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={() => navigate("/app")}
          whileTap={{ scale: 0.96 }}
          style={{
            color: "rgba(160,180,200,0.7)",
            fontSize: 14,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px 16px",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#f0f4f8")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(160,180,200,0.7)")}
        >
          Entrar
        </motion.button>

        <motion.button
          onClick={() => navigate("/app")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          style={{
            background: "#22d3ee",
            color: "#000",
            fontWeight: 600,
            fontSize: 14,
            border: "none",
            borderRadius: 10,
            padding: "8px 20px",
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(34,211,238,0.3)",
          }}
        >
          Começar grátis
        </motion.button>
      </div>
    </motion.nav>
  );
}