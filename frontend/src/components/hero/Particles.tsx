import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import { useEffect, useMemo } from "react";

interface ParticleData {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
}

interface ParticleProps {
  p: ParticleData;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

// Componente individual para cada partícula. 
// Evita re-renderizar o pai e permite física independente para cada estrela.
function SingleParticle({ p, mouseX, mouseY }: ParticleProps) {
  const attractionRadius = 220; // Raio de atração ligeiramente maior para melhor usabilidade

  // 1. Calcula a distância e aplica uma curva de atração exponencial (não-linear)
  const offsetX = useTransform([mouseX, mouseY], ([latestX, latestY]) => {
    const dx = latestX - p.x;
    const dy = latestY - p.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < attractionRadius) {
      // Força exponencial: quanto mais perto do mouse, maior a atração (efeito magnético real)
      const force = Math.pow((attractionRadius - distance) / attractionRadius, 1.8);
      return dx * force * 0.22; // 0.22 determina a força de aproximação
    }
    return 0;
  });

  const offsetY = useTransform([mouseX, mouseY], ([latestX, latestY]) => {
    const dx = latestX - p.x;
    const dy = latestY - p.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < attractionRadius) {
      const force = Math.pow((attractionRadius - distance) / attractionRadius, 1.8);
      return dy * force * 0.22;
    }
    return 0;
  });

  // 2. Aplica suavização com Física de Mola (Spring Physics)
  // stiffness: rigidez da mola, damping: amortecimento (evita oscilação infinita), mass: peso/inércia
  const smoothX = useSpring(offsetX, { stiffness: 50, damping: 15, mass: 0.6 });
  const smoothY = useSpring(offsetY, { stiffness: 50, damping: 15, mass: 0.6 });

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: p.x,
        top: p.y,
        x: smoothX,
        y: smoothY,
      }}
    >
      {/* Elemento interno que faz o efeito de flutuação e brilho (independente do mouse) */}
      <motion.div
        className="rounded-full"
        style={{
          width: p.size,
          height: p.size,
          background: p.color,
          boxShadow:
            p.color === "#ffffff"
              ? "0 0 6px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.4)"
              : "0 0 6px rgba(34,211,238,0.8), 0 0 12px rgba(34,211,238,0.4)",
        }}
        animate={{
          y: [0, -12, 0], // flutuação sutil
          opacity: [p.opacity, p.opacity * 1.6, p.opacity], // pulsação de brilho
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: p.duration,
          delay: p.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

function Particles() {
  // Inicializa fora da tela (-9999) para as partículas não serem atraídas para o canto superior esquerdo no início
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleLeave = () => {
      // Afasta o ponto magnético quando o mouse sai da janela
      mouseX.set(-9999);
      mouseY.set(-9999);
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [mouseX, mouseY]);

  const particles = useMemo<ParticleData[]>(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2.5 + 1,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 4,
        opacity: Math.random() * 0.4 + 0.2,
        color: Math.random() > 0.8 ? "#ffffff" : "#22d3ee",
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <SingleParticle key={p.id} p={p} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  );
}

export default Particles;