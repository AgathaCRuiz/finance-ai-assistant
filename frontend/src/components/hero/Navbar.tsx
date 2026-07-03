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
      className={`fixed top-4 left-4 right-4 max-w-5xl mx-auto z-50 flex items-center justify-between p-2.5 rounded-2xl border transition-all duration-300 ${
        scrolled
          ? "bg-[#020408]/65 backdrop-blur-md border-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
          : "bg-[#020408]/25 backdrop-blur-sm border-white/[0.02] shadow-lg"
      }`}
    >
      {/* Logo */}
      <button
        onClick={() => scrollToSection("hero")}
        className="flex items-center gap-2 px-1 text-left bg-transparent border-none cursor-pointer focus:outline-none"
      >
        <motion.div
          whileHover={{ boxShadow: "0 0 24px rgba(0,245,212,0.7)", scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#00f5d4] to-[#00E5FF] flex items-center justify-center shadow-[0_0_12px_rgba(0,245,212,0.4)]"
        >
          <span className="text-black font-extrabold text-xs">E</span>
        </motion.div>
        <span className="text-white font-semibold text-sm md:text-base tracking-tight">
          Edu Finance
        </span>
      </button>

      {/* Links - Hidden on mobile, shown on md+ screens */}
      <div className="hidden md:flex items-center gap-1.5">
        {NAV_LINKS.map(({ label, href }) => (
          <button
            key={href}
            onClick={() => { scrollToSection(href); setActiveLink(href); }}
            onMouseEnter={() => setActiveLink(href)}
            onMouseLeave={() => setActiveLink(null)}
            className={`relative px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border-none bg-transparent ${
              activeLink === href ? "text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            {activeLink === href && (
              <motion.span
                layoutId="nav-highlight"
                className="absolute inset-0 rounded-lg bg-[#00f5d4]/5 border border-[#00f5d4]/10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => navigate("/app")}
          className="text-zinc-400 hover:text-white text-xs md:text-sm bg-transparent border-none cursor-pointer py-1.5 px-3 rounded-lg transition-colors focus:outline-none"
        >
          Entrar
        </button>

        <motion.button
          onClick={() => navigate("/app")}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 0 28px rgba(0,245,212,0.55)",
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="bg-gradient-to-tr from-[#00f5d4] to-[#00E5FF] text-black font-bold text-xs md:text-sm border-none rounded-xl py-2 px-4 md:px-5 cursor-pointer shadow-[0_0_16px_rgba(0,245,212,0.3)] transition-all focus:outline-none"
        >
          Começar grátis
        </motion.button>
      </div>
    </motion.nav>
  );
}