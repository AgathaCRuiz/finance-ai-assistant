"use client";

import { useId } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface TechItem {
  name: string;
  /** path/elementos internos do SVG (sem a tag <svg>) */
  paths: string;
  viewBox?: string;
}

interface TechLoopRowProps {
  items: TechItem[];
  direction?: "left" | "right";
  speed?: number; // segundos para 1 ciclo completo
  waveDelay?: number; // offset inicial da onda (segundos)
}

// ─── Ícones (monocromáticos via currentColor, só os paths) ───────────────────
const ICONS: Record<string, { viewBox: string; paths: string }> = {
  next: {
    viewBox: "0 0 128 128",
    paths: `<path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-8L48.4 55.3v36.6H36V36h13.5l51.2 76.4C114.8 101.3 128 84.1 128 64c0-35.3-28.7-64-64-64zm22.7 84.9L75 66.6V36h11.7v48.9z"/>`,
  },
  react: {
    viewBox: "0 0 128 128",
    paths: `<circle cx="64" cy="64" r="11.4"/><path d="M107.3 45.2c-2.2-.8-4.5-1.6-6.9-2.3.6-2.4 1.1-4.8 1.5-7.1 2.1-13.2-.2-22.5-6.6-26.1-1.9-1.1-4-1.6-6.4-1.6-7 0-15.9 5.2-24.9 13.9-9-8.7-17.9-13.9-24.9-13.9-2.4 0-4.5.5-6.4 1.6-6.4 3.7-8.7 13-6.6 26.1.4 2.3.9 4.7 1.5 7.1-2.4.7-4.7 1.4-6.9 2.3C8.2 49 1.4 53.6 1.4 64s6.8 15 19.3 18.8c2.2.8 4.5 1.6 6.9 2.3-.6 2.4-1.1 4.8-1.5 7.1-2.1 13.2.2 22.5 6.6 26.1 1.9 1.1 4 1.6 6.4 1.6 7.1 0 16-5.2 24.9-13.9 9 8.7 17.9 13.9 24.9 13.9 2.4 0 4.5-.5 6.4-1.6 6.4-3.7 8.7-13 6.6-26.1-.4-2.3-.9-4.7-1.5-7.1 2.4-.7 4.7-1.4 6.9-2.3 12.5-3.8 19.3-8.4 19.3-18.8s-6.8-15-19.3-18.8zM92.5 14.7c4.1 2.4 5.5 9.8 3.8 20.3-.3 2.1-.8 4.3-1.4 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3 1.3 0 2.5.3 3.5.9zM81.3 74c-1.8 3.2-3.9 6.4-6.1 9.6-3.7.3-7.4.4-11.2.4-3.9 0-7.6-.1-11.2-.4-2.2-3.2-4.2-6.4-6-9.6-1.9-3.3-3.7-6.7-5.3-10 1.6-3.3 3.4-6.7 5.3-10 1.8-3.2 3.9-6.4 6.1-9.6 3.7-.3 7.4-.4 11.2-.4 3.9 0 7.6.1 11.2.4 2.2 3.2 4.2 6.4 6 9.6 1.9 3.3 3.7 6.7 5.3 10-1.7 3.3-3.4 6.6-5.3 10zm8.3-3.3c1.5 3.5 2.7 6.9 3.8 10.3-3.4.8-7 1.4-10.8 1.9 1.2-1.9 2.5-3.9 3.6-6 1.2-2.1 2.3-4.2 3.4-6.2zM64 97.8c-2.4-2.6-4.7-5.4-6.9-8.3 2.3.1 4.6.2 6.9.2 2.3 0 4.6-.1 6.9-.2-2.2 2.9-4.5 5.7-6.9 8.3zm-18.6-15c-3.8-.5-7.4-1.1-10.8-1.9 1.1-3.3 2.3-6.8 3.8-10.3 1.1 2 2.2 4.1 3.4 6.1 1.2 2.2 2.4 4.1 3.6 6.1zm-7-25.5c-1.5-3.5-2.7-6.9-3.8-10.3 3.4-.8 7-1.4 10.8-1.9-1.2 1.9-2.5 3.9-3.6 6-1.2 2.1-2.3 4.2-3.4 6.2zM64 30.2c2.4 2.6 4.7 5.4 6.9 8.3-2.3-.1-4.6-.2-6.9-.2-2.3 0-4.6.1-6.9.2 2.2-2.9 4.5-5.7 6.9-8.3zm22.2 21l-3.6-6c3.8.5 7.4 1.1 10.8 1.9-1.1 3.3-2.3 6.8-3.8 10.3-1.1-2-2.2-4.1-3.4-6.2zM31.7 35c-1.7-10.5-.3-17.9 3.8-20.3 1-.6 2.2-.9 3.5-.9 6 0 13.5 4.9 21 12.3-3.5 3.8-7 8.2-10.4 13-5.8.5-11.3 1.4-16.5 2.5-.6-2.3-1-4.5-1.4-6.6zM7 64c0-4.7 5.7-8.3 15.7-11 2.1-.6 4.2-1.1 6.4-1.5.6 2.9 1.4 5.9 2.5 9-1.1 3.1-1.9 6.1-2.5 9C12.7 72.3 7 68.7 7 64zm28.5 49.3c-4.1-2.4-5.5-9.8-3.8-20.3.3-2.1.8-4.3 1.4-6.6 5.2 1.2 10.7 2 16.5 2.5 3.4 4.8 6.9 9.1 10.4 13-7.4 7.3-14.9 12.3-21 12.3-1.3 0-2.5-.3-3.5-.9zM96.3 93c1.7 10.5.3 17.9-3.8 20.3-1 .6-2.2.9-3.5.9-6 0-13.5-4.9-21-12.3 3.5-3.8 7-8.2 10.4-13 5.8-.5 11.3-1.4 16.5-2.5.6 2.3 1 4.5 1.4 6.6zm9.2-26.3c-.6-3-1.4-6-2.5-9 1.1-3.1 1.9-6.1 2.5-9 10.2 2.7 15.7 6.3 15.7 11 0 4.7-5.8 8.3-15.7 11z"/>`,
  },
  typescript: {
    viewBox: "0 0 128 128",
    paths: `<path d="M0 64v64h128V0H0zm107.5-8c2.6.6 4.6 1.7 6.5 3.5 1 .9 2.4 2.6 2.5 3 .1.2-4.5 3.2-7.2 4.9-.1.1-1-.8-1.9-1.8-2.5-2.9-5.1-4.2-9.1-4.4-5.9-.3-9.7 2.7-9.7 7.6 0 1.5.2 2.4.7 3.6.8 1.9 2.3 3.4 5.5 5.3 1.3.7 6.2 3.3 9.7 5.1 7.3 3.9 10.4 6.4 12.4 10.2 2.2 4.3 2.7 11.2 1.1 16.3-1.7 5.5-5.9 9.3-11.9 11.2-1.8.6-3.2.8-6.3.9-4.2.1-8.1-.5-11.4-1.8-3.5-1.3-6.8-4.1-8.9-7.3l-1.2-2.1 1.9-1.2c1-.7 3.8-2.2 6.2-3.4l4.3-2.2 1.1 1.6c1.5 2.2 4.8 4.2 6.8 4.5 5.2 1 10.3-1.3 10.4-4.9 0-1.6-.7-3-2.5-4.5-1.2-1-3.4-2.3-9-5-6.8-3.3-9.8-5.4-12-8.2-2.7-3.4-3.6-7.3-3.3-12.4.3-4.9 1.5-8 4.1-11 3.6-4.1 9-6.3 15.5-6.3 2.9.1 4.9.3 7.3.9zm-30.5 3.5l.1 3.6H63.5v42.4H51.9V63.1H39.3V59.7c0-1.9.1-3.6.2-3.7.2-.2 8.6-.3 18.8-.2l18.6.2.1 3.5z"/>`,
  },
  tailwind: {
    viewBox: "0 0 128 128",
    paths: `<path d="M64.004 25.602c-17.067 0-27.73 8.53-32 25.597 6.398-8.531 13.867-11.73 22.398-9.597 4.871 1.214 8.352 4.746 12.207 8.66C72.883 56.629 80.145 64 96.004 64c17.066 0 27.73-8.531 32-25.602-6.399 8.536-13.867 11.735-22.399 9.602-4.87-1.215-8.347-4.746-12.207-8.66-6.27-6.367-13.53-13.738-29.394-13.738zM32.004 64c-17.066 0-27.73 8.531-32 25.602C6.402 81.066 13.87 77.867 22.402 80c4.871 1.215 8.352 4.746 12.207 8.66 6.274 6.367 13.536 13.738 29.395 13.738 17.066 0 27.73-8.53 32-25.597-6.399 8.531-13.867 11.73-22.399 9.597-4.87-1.214-8.347-4.746-12.207-8.66C55.128 71.371 47.868 64 32.004 64zm0 0"/>`,
  },
  fastapi: {
    viewBox: "0 0 128 128",
    paths: `<path d="M72 0L24 72h40l-8 56 56-72H72l8-56z"/>`,
  },
  python: {
    viewBox: "0 0 128 128",
    paths: `<path d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zm-13.354 7.569c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721zM91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z"/>`,
  },
  supabase: {
    viewBox: "0 0 109 113",
    paths: `<path d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874L63.708 110.284z"/><path d="M45.317 2.716C48.177-.885 53.975 1.088 54.044 5.686l.796 67.251H9.99c-8.19 0-12.758-9.46-7.665-15.875L45.317 2.716z"/>`,
  },
  postgresql: {
    viewBox: "0 0 128 128",
    paths: `<path d="M93.809 92.112c.785-6.533.55-7.492 5.416-6.433l1.235.108c3.742.17 8.637-.602 11.513-1.938 6.191-2.873 9.861-7.668 3.758-6.409-13.924 2.873-14.881-1.842-14.881-1.842 14.703-21.815 20.849-49.508 15.543-56.287-14.47-18.489-39.517-9.746-39.936-9.52l-.134.025c-2.751-.571-5.83-.912-9.289-.968-6.301-.098-11.082 1.652-14.709 4.402 0 0-44.683-18.409-42.604 23.151.442 8.841 12.672 66.898 27.26 49.362 5.332-6.412 10.484-11.834 10.484-11.834 2.558 1.699 5.622 2.567 8.834 2.255l.249-.212c-.078.796-.044 1.575.099 2.497-3.757 4.199-2.653 4.936-10.166 6.482-7.602 1.566-3.136 4.355-.22 5.084 3.535.884 11.712 2.136 17.238-5.598l-.22.882c1.474 1.18 1.375 8.477 1.583 13.69.209 5.214.558 10.079 1.621 12.948 1.063 2.868 2.317 10.256 12.191 8.14 8.252-1.764 14.561-4.309 15.136-27.974"/>`,
  },
  gemini: {
    viewBox: "0 0 24 24",
    paths: `<path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"/>`,
  },
  framer: {
    viewBox: "0 0 14 21",
    paths: `<path d="M0 0h14v7H7L0 0zm0 7h7l7 7H7v7L0 14V7z"/>`,
  },
  zod: {
    viewBox: "0 0 24 24",
    paths: `<path d="M3 4h18l-9 9 9 9H3l9-9-9-9z"/>`,
  },
  fsrs: {
    viewBox: "0 0 24 24",
    paths: `<path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 2a8 8 0 100 16A8 8 0 0012 4zm1 3v5l4 2-1 1.73-5-2.5V7h2z"/>`,
  },
  vercel: {
    viewBox: "0 0 512 512",
    paths: `<path d="M256 48L496 464H16L256 48z"/>`,
  },
  docker: {
    viewBox: "0 0 128 128",
    paths: `<path d="M124.8 52.1c-4-2.7-13.2-3.7-20.3-2.3-.9-6.7-4.7-12.5-11.5-17.7l-3.9-2.6-2.6 3.9c-3.3 5-4.9 11.9-4.4 18.5.2 2.2.9 6.1 3.2 9.5-2.2 1.2-6.6 2.9-12.4 2.8H2.7l-.4 1.9c-1.2 7.2-.9 29.7 13.3 46.9C26.5 128 42.2 128 64 128c38.3 0 66.6-17.7 80-49.9 5.2.1 16.4.1 22.2-10.9 1.5-2.8 4.6-10.2 1.9-15zM54 61.9H41.9v11.9H54zm15.9 0H57.8v11.9h12.1zm15.9 0H73.7v11.9h12.1zm-31.8-15H42v11.9h11.9zm15.9 0H57.8v11.9h12.1zm15.9 0H73.7v11.9h12.1zm15.8 0H89.6v11.9h12.1z"/>`,
  },
};

// ─── Lista de tecnologias do projeto (edite à vontade) ────────────────────────
export const EDUFINANCE_STACK_A: TechItem[] = [
  { name: "Next.js 14",   ...ICONS.next },
  { name: "React",        ...ICONS.react },
  { name: "TypeScript",   ...ICONS.typescript },
  { name: "Tailwind CSS", ...ICONS.tailwind },
  { name: "FastAPI",      ...ICONS.fastapi },
  { name: "Python",       ...ICONS.python },
  { name: "Supabase",     ...ICONS.supabase },
  { name: "PostgreSQL",   ...ICONS.postgresql },
  { name: "Gemini AI",    ...ICONS.gemini },
  { name: "Framer Motion",...ICONS.framer },
];

export const EDUFINANCE_STACK_B: TechItem[] = [
  { name: "Zod",     ...ICONS.zod },
  { name: "FSRS",    ...ICONS.fsrs },
  { name: "Vercel",  ...ICONS.vercel },
  { name: "Docker",  ...ICONS.docker },
];

// ─── Uma linha do loop ─────────────────────────────────────────────────────────
function TechLoopRow({ items, direction = "left", speed = 26, waveDelay = 0 }: TechLoopRowProps) {
  const uid = useId();
  // duplica a lista 4x para o loop ficar contínuo sem "salto"
  const doubled = [...items, ...items, ...items, ...items];

  return (
    <div className="tech-loop-row">
      <div
        className="tech-loop-track"
        style={{
          animationDirection: direction === "left" ? "normal" : "reverse",
          animationDuration: `${speed}s`,
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={`${uid}-${i}`}
            className="tech-loop-item"
            style={{ animationDelay: `${(i % items.length) * 0.18 + waveDelay}s` }}
          >
            <div className="tech-loop-circle" title={item.name}>
              <svg viewBox={item.viewBox} xmlns="http://www.w3.org/2000/svg"
                dangerouslySetInnerHTML={{ __html: item.paths }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────
interface TechLoopProps {
  rowA?: TechItem[];
  rowB?: TechItem[];
  label?: string;
}

export function TechLoop({
  rowA = EDUFINANCE_STACK_A,
  rowB = EDUFINANCE_STACK_B,
  label = "construído com tecnologias modernas",
}: TechLoopProps) {
  return (
    <div className="tech-loop-wrap">
      <style>{`
        .tech-loop-wrap {
          padding: 50px 0;
        }
        .tech-loop-label {
          text-align: center;
          margin-bottom: 36px;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(34,211,238,0.4);
          font-family: monospace;
        }
        .tech-loop-row {
          position: relative;
          overflow: hidden;
          height: 140px;
          margin-bottom: 4px;
        }
        .tech-loop-row::before,
        .tech-loop-row::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 140px;
          z-index: 10;
          pointer-events: none;
        }
        .tech-loop-row::before {
          left: 0;
          background: linear-gradient(90deg, var(--loop-bg, #07090d), transparent);
        }
        .tech-loop-row::after {
          right: 0;
          background: linear-gradient(90deg, transparent, var(--loop-bg, #07090d));
        }
        .tech-loop-track {
          display: flex;
          width: max-content;
          height: 100%;
          position: relative;
          animation-name: tech-loop-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .tech-loop-row:hover .tech-loop-track {
          animation-play-state: paused;
        }
        @keyframes tech-loop-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .tech-loop-item {
          flex-shrink: 0;
          width: 90px;
          margin: 0 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: tech-loop-snake 2.4s ease-in-out infinite;
        }
        @keyframes tech-loop-snake {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-14px); }
        }
        .tech-loop-circle {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(13,19,25,0.9);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
        }
        .tech-loop-circle:hover {
          border-color: rgba(34,211,238,0.4);
          box-shadow: 0 0 22px rgba(34,211,238,0.18), inset 0 0 14px rgba(34,211,238,0.05);
          transform: scale(1.12);
        }
        .tech-loop-circle svg {
          width: 38px;
          height: 38px;
        }
        .tech-loop-circle svg path,
        .tech-loop-circle svg circle,
        .tech-loop-circle svg rect,
        .tech-loop-circle svg ellipse,
        .tech-loop-circle svg line,
        .tech-loop-circle svg g {
          fill: rgba(235,242,248,0.75);
          transition: fill 0.25s;
        }
        .tech-loop-circle:hover svg path,
        .tech-loop-circle:hover svg circle,
        .tech-loop-circle:hover svg rect,
        .tech-loop-circle:hover svg ellipse,
        .tech-loop-circle:hover svg line,
        .tech-loop-circle:hover svg g {
          fill: #ffffff;
        }

        @media (prefers-reduced-motion: reduce) {
          .tech-loop-item { animation: none; }
          .tech-loop-track { animation-duration: 60s !important; }
        }
      `}</style>

      <p className="tech-loop-label">{label}</p>

      <TechLoopRow items={rowA} direction="left" speed={26} waveDelay={0} />
      <TechLoopRow items={rowB} direction="right" speed={28} waveDelay={1.2} />
    </div>
  );
}

export default TechLoop;