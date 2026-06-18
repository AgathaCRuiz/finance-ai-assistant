import { motion, useMotionValue, useSpring, useMotionValueEvent, MotionValue } from "framer-motion";
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

function SingleParticle({ p, mouseX, mouseY }: ParticleProps) {
  const attractionRadius = 250;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Calcula o offset toda vez que mouseX ou mouseY mudar
  useMotionValueEvent(mouseX, "change", (mx) => {
    const my = mouseY.get();
    const dx = mx - p.x;
    const dy = my - p.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < attractionRadius && distance > 0) {
      const force = Math.pow((attractionRadius - distance) / attractionRadius, 1.8);
      rawX.set(dx * force * 0.35);
    } else {
      rawX.set(0);
    }
  });

  useMotionValueEvent(mouseY, "change", (my) => {
    const mx = mouseX.get();
    const dx = mx - p.x;
    const dy = my - p.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < attractionRadius && distance > 0) {
      const force = Math.pow((attractionRadius - distance) / attractionRadius, 1.8);
      rawY.set(dy * force * 0.35);
    } else {
      rawY.set(0);
    }
  });

  const smoothX = useSpring(rawX, { stiffness: 80, damping: 18, mass: 0.4 });
  const smoothY = useSpring(rawY, { stiffness: 80, damping: 18, mass: 0.4 });

  const isWhite = p.color === "#ffffff";

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
      <motion.div
        className="rounded-full"
        style={{
          width: p.size,
          height: p.size,
          background: p.color,
          boxShadow: isWhite
            ? "0 0 6px rgba(255,255,255,0.8), 0 0 14px rgba(255,255,255,0.4)"
            : "0 0 6px rgba(34,211,238,0.9), 0 0 16px rgba(34,211,238,0.5)",
        }}
        animate={{
          y: [0, -14, 0],
          opacity: [p.opacity, p.opacity * 1.8, p.opacity],
          scale: [1, 1.3, 1],
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
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleLeave = () => {
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