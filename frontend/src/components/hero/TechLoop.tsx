import { useId } from "react";
import { 
  Sparkles, 
  Code2, 
  GitBranch, 
  CheckCircle2, 
  CornerDownLeft, 
  LayoutGrid, 
  Database, 
  Cpu, 
  Lock, 
  TrendingUp, 
  Coins, 
  ShieldCheck 
} from "lucide-react";

// Minimalist Tech Items with uniform elegant white/silver icons
// We remove the hardcoded text color and let them use the SVG linearGradient url(#tech-icon-grad)
const PILL_ITEMS = [
  { id: "sparkles", icon: <Sparkles className="w-8 h-8 stroke-[1px]" stroke="url(#tech-icon-grad)" />, name: "Inteligência Artificial" },
  { id: "code", icon: <Code2 className="w-8 h-8 stroke-[1px]" stroke="url(#tech-icon-grad)" />, name: "TypeScript & React" },
  { id: "git", icon: <GitBranch className="w-8 h-8 stroke-[1px]" stroke="url(#tech-icon-grad)" />, name: "Versionamento de Dados" },
  { id: "check", icon: <CheckCircle2 className="w-8 h-8 stroke-[1px]" stroke="url(#tech-icon-grad)" />, name: "Validação & Zod" },
  { id: "arrow", icon: <CornerDownLeft className="w-8 h-8 stroke-[1px]" stroke="url(#tech-icon-grad)" />, name: "Comandos de Entrada" },
  { id: "grid", icon: <LayoutGrid className="w-8 h-8 stroke-[1px]" stroke="url(#tech-icon-grad)" />, name: "Estrutura Bento Grid" },
  { id: "database", icon: <Database className="w-8 h-8 stroke-[1px]" stroke="url(#tech-icon-grad)" />, name: "PostgreSQL Seguro" },
  { id: "cpu", icon: <Cpu className="w-8 h-8 stroke-[1px]" stroke="url(#tech-icon-grad)" />, name: "Processamento Veloz" },
  { id: "lock", icon: <Lock className="w-8 h-8 stroke-[1px]" stroke="url(#tech-icon-grad)" />, name: "Segurança de Dados" },
  { id: "trending", icon: <TrendingUp className="w-8 h-8 stroke-[1px]" stroke="url(#tech-icon-grad)" />, name: "Evolução Financeira" },
  { id: "coins", icon: <Coins className="w-8 h-8 stroke-[1px]" stroke="url(#tech-icon-grad)" />, name: "Ativos Digitais" },
  { id: "shield", icon: <ShieldCheck className="w-8 h-8 stroke-[1px]" stroke="url(#tech-icon-grad)" />, name: "Fortaleza Criptográfica" },
];

export function TechLoop() {
  const uid = useId();
  // Duplicate list multiple times for seamless infinite scroll
  const duplicatedItems = [...PILL_ITEMS, ...PILL_ITEMS, ...PILL_ITEMS, ...PILL_ITEMS, ...PILL_ITEMS, ...PILL_ITEMS];

  return (
    <section className="relative py-24 bg-[#020408] overflow-hidden border-t border-b border-white/[0.01]">
      {/* Dynamic SVG Gradient definition for the vector strokes */}
      <svg className="absolute w-0 h-0 pointer-events-none" width="0" height="0">
        <defs>
          <linearGradient id="tech-icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#52525b" />
          </linearGradient>
        </defs>
      </svg>

      {/* Glow ambient background behind the worm */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] bg-white/[0.01] blur-[100px] pointer-events-none rounded-full" />

      {/* Dynamic styles injected for smooth marquee scrolling and waves without any package dependencies */}
      <style>{`
        @keyframes marquee-scroll-worm {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.3333%);
          }
        }
        @keyframes wavy-bounce {
          0%, 100% {
            transform: translateY(-28px);
          }
          50% {
            transform: translateY(28px);
          }
        }
        .animate-marquee-worm {
          animation: marquee-scroll-worm 24s linear infinite;
        }
        .animate-marquee-worm:hover {
          animation-play-state: paused;
        }
        .animate-wave-item {
          animation: wavy-bounce 3.5s ease-in-out infinite;
        }
        .animate-marquee-worm:hover .animate-wave-item {
          animation-play-state: paused;
        }

        /* Metallic gradient border */
        .gradient-border-wrapper {
          position: relative;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.02) 100%);
          padding: 1px; /* width of the border */
          border-radius: 9999px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .gradient-border-wrapper:hover {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.1) 100%);
          box-shadow: 0 0 25px rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em] mb-3">
          Arquitetura e Integrações
        </p>
        <h3 className="text-zinc-200 text-lg sm:text-xl font-extralight tracking-tight">
          Nossos algoritmos percorrem canais inteligentes e seguros
        </h3>
      </div>

      {/* SINGLE LINE WORM LOOP CONTAINER */}
      <div className="relative w-full overflow-hidden py-12">
        {/* Overlay Gradients for smooth fade in/out on edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#020408] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#020408] to-transparent z-10 pointer-events-none" />
        
        {/* Continuous horizontal track */}
        <div className="flex gap-6 w-max animate-marquee-worm items-center">
          {duplicatedItems.map((item, idx) => {
            return (
              <div
                key={`${uid}-${idx}`}
                className="animate-wave-item py-8"
                style={{
                  animationDelay: `${idx * -250}ms`,
                }}
              >
                {/* Outermost wrapper is the dynamic gradient border */}
                <div className="gradient-border-wrapper group cursor-pointer">
                  {/* Innermost content is absolute pure black */}
                  <div
                    className="flex items-center justify-center w-[74px] h-[74px] bg-black rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.9)] transition-all duration-300"
                    title={item.name}
                  >
                    <div className="transition-transform duration-300 group-hover:rotate-12 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TechLoop;
