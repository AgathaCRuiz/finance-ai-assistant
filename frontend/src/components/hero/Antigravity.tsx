import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

export interface AntigravityProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: 'capsule' | 'sphere' | 'box' | 'tetrahedron';
  fieldStrength?: number;
}

const AntigravityInner: React.FC<AntigravityProps> = ({
  count = 300,
  magnetRadius = 10,
  ringRadius = 10,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 2,
  lerpSpeed = 0.1,
  color = '#FF9FFC',
  autoAnimate = false,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = 'capsule',
  fieldStrength = 10
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = useRef(0);
  const virtualMouse = useRef({ x: 0, y: 0 });
  
  // Track global window pointer coordinates so HTML overlays don't block hover events
  const globalMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      globalMouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      globalMouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        globalMouse.current.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        globalMouse.current.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Pre-instantiated Three.js color objects for high performance
  const color1 = useMemo(() => new THREE.Color(), []);
  const color2 = useMemo(() => new THREE.Color(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Compute a gorgeous gradient range by shifting the hue of the primary color
  useMemo(() => {
    color1.set(color);
    const hsl = { h: 0, s: 0, l: 0 };
    color1.getHSL(hsl);
    // Dynamic hue shift (+12% on the wheel) to produce a harmonized gradient
    color2.setHSL((hsl.h + 0.12) % 1, hsl.s, Math.max(0.35, hsl.l * 0.95));
  }, [color, color1, color2]);

  const particles = useMemo(() => {
    const temp = [];
    const width = viewport.width || 100;
    const height = viewport.height || 100;

    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;

      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      const z = (Math.random() - 0.5) * 20;

      const randomRadiusOffset = (Math.random() - 0.5) * 2;
      const colorRatio = i / count;

      temp.push({
        t,
        factor,
        speed,
        xFactor,
        yFactor,
        zFactor,
        mx: x,
        my: y,
        mz: z,
        cx: x,
        cy: y,
        cz: z,
        vx: 0,
        vy: 0,
        vz: 0,
        randomRadiusOffset,
        colorRatio
      });
    }
    return temp;
  }, [count, viewport.width, viewport.height]);

  useFrame(state => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const { viewport: v } = state;
    const m = globalMouse.current;

    const mouseDist = Math.sqrt(Math.pow(m.x - lastMousePos.current.x, 2) + Math.pow(m.y - lastMousePos.current.y, 2));

    if (mouseDist > 0.001) {
      lastMouseMoveTime.current = Date.now();
      lastMousePos.current = { x: m.x, y: m.y };
    }

    let destX = (m.x * v.width) / 2;
    let destY = (m.y * v.height) / 2;

    if (autoAnimate && Date.now() - lastMouseMoveTime.current > 3500) {
      const time = state.clock.getElapsedTime();
      destX = Math.sin(time * 0.4) * (v.width / 4);
      destY = Math.cos(time * 0.4 * 2) * (v.height / 4);
    }

    const smoothFactor = 0.08;
    virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
    virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;

    const targetX = virtualMouse.current.x;
    const targetY = virtualMouse.current.y;

    const globalRotation = state.clock.getElapsedTime() * rotationSpeed;

    particles.forEach((particle, i) => {
      let { t, speed, mx, my, mz, cz, randomRadiusOffset, colorRatio } = particle;

      t = particle.t += speed / 2;

      const projectionFactor = 1 - cz / 50;
      const projectedTargetX = targetX * projectionFactor;
      const projectedTargetY = targetY * projectionFactor;

      const dx = mx - projectedTargetX;
      const dy = my - projectedTargetY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Smooth transition influence based on distance to the cursor (avoid binary snapping)
      const rawInfluence = Math.max(0, Math.min(1, 1 - dist / magnetRadius));
      const smoothInfluence = rawInfluence * rawInfluence * (3 - 2 * rawInfluence);

      const angle = Math.atan2(dy, dx) + globalRotation;
      const wave = Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
      const deviation = randomRadiusOffset * (5 / (fieldStrength + 0.1));
      const currentRingRadius = ringRadius + wave + deviation;

      // Define coordinates on the ring orbit
      const ringX = projectedTargetX + currentRingRadius * Math.cos(angle);
      const ringY = projectedTargetY + currentRingRadius * Math.sin(angle);
      const ringZ = mz * depthFactor + Math.sin(t) * (1 * waveAmplitude * depthFactor);

      // Interpolate target position between default ambient coordinates and magnetic ring coordinates
      const targetXPos = THREE.MathUtils.lerp(mx, ringX, smoothInfluence);
      const targetYPos = THREE.MathUtils.lerp(my, ringY, smoothInfluence);
      const targetZPos = THREE.MathUtils.lerp(mz * depthFactor, ringZ, smoothInfluence);

      particle.cx += (targetXPos - particle.cx) * lerpSpeed;
      particle.cy += (targetYPos - particle.cy) * lerpSpeed;
      particle.cz += (targetZPos - particle.cz) * lerpSpeed;

      dummy.position.set(particle.cx, particle.cy, particle.cz);

      dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
      dummy.rotateX(Math.PI / 2);

      const currentDistToMouse = Math.sqrt(
        Math.pow(particle.cx - projectedTargetX, 2) + Math.pow(particle.cy - projectedTargetY, 2)
      );

      const distFromRing = Math.abs(currentDistToMouse - ringRadius);

      // Smooth scale factor: ambient dust when far, fully defined and larger when captured by the ring vortex
      const ringProximity = Math.max(0, Math.min(1, 1 - distFromRing / (ringRadius * 0.8 || 1)));
      const baseScale = 0.25; // elegant ambient dust size
      const activeScale = 0.8 + 0.2 * ringProximity;
      const scaleFactor = THREE.MathUtils.lerp(baseScale, activeScale, smoothInfluence);

      const finalScale = scaleFactor * (0.8 + Math.sin(t * pulseSpeed) * 0.2 * particleVariance) * particleSize;
      dummy.scale.set(finalScale, finalScale, finalScale);

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // Dynamic color gradient: blend index and magnet capture influence
      const mixRatio = THREE.MathUtils.lerp(colorRatio, 1 - smoothInfluence * 0.4, 0.4);
      tempColor.copy(color1).lerp(color2, mixRatio);
      
      // Slight brightness glow when captured inside the magnetic field
      if (smoothInfluence > 0.1) {
        tempColor.multiplyScalar(1.15);
      }
      mesh.setColorAt(i, tempColor);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
      {particleShape === 'capsule' && <capsuleGeometry args={[0.08, 0.35, 4, 8]} />}
      {particleShape === 'sphere' && <sphereGeometry args={[0.15, 12, 12]} />}
      {particleShape === 'box' && <boxGeometry args={[0.22, 0.22, 0.22]} />}
      {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.22]} />}
      <meshBasicMaterial transparent opacity={0.85} />
    </instancedMesh>
  );
};

const Antigravity: React.FC<AntigravityProps> = props => {
  return (
    <Canvas camera={{ position: [0, 0, 50], fov: 35 }}>
      <AntigravityInner {...props} />
    </Canvas>
  );
};

export default Antigravity;
