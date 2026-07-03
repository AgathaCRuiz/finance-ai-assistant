import React, { useState, useEffect, Children } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Card({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

export default function CardSwap({
  children,
  cardDistance = 35,
  verticalDistance = 35,
  delay = 5000,
  pauseOnHover = true,
  width = "100%",
  height = "100%",
  skewAmount = 2.5,
  easing = "elastic"
}: {
  children: React.ReactNode;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  width?: string | number;
  height?: string | number;
  skewAmount?: number;
  easing?: string;
}) {
  const cards = Children.toArray(children);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (cards.length <= 1) return;
    if (pauseOnHover && isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, delay);

    return () => clearInterval(interval);
  }, [cards.length, delay, pauseOnHover, isHovered]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width, height, perspective: 1200 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="popLayout">
        {cards.map((card, idx) => {
          // Calculate relative index from current activeIndex
          const relativeIdx = (idx - activeIndex + cards.length) % cards.length;
          
          // Display up to 3 cards in stack
          if (relativeIdx > 2) return null;

          const isTop = relativeIdx === 0;
          const zIndex = cards.length - relativeIdx;
          
          const translateX = relativeIdx * cardDistance;
          const translateY = -relativeIdx * verticalDistance;
          const translateZ = -relativeIdx * 100;
          const rotateZ = -relativeIdx * 3;

          return (
            <motion.div
              key={idx}
              style={{
                position: "absolute",
                width: "480px",
                height: "260px",
                zIndex,
                transformStyle: "preserve-3d",
              }}
              initial={isTop ? { 
                opacity: 0, 
                x: cardDistance + 120, 
                y: -verticalDistance, 
                rotate: 8,
                scale: 0.9 
              } : { 
                opacity: 0, 
                scale: 0.9 
              }}
              animate={{
                opacity: 1,
                x: translateX,
                y: translateY,
                z: translateZ,
                rotate: rotateZ,
                scale: 1,
                filter: isTop ? "blur(0px)" : "blur(1.2px)",
              }}
              exit={{
                opacity: 0,
                x: -180,
                y: 80,
                rotate: -12,
                scale: 0.9,
                transition: { duration: 0.4 }
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 24,
              }}
              className="absolute"
            >
              {card}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
