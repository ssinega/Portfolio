import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "../hooks/useMobile";

// LAYER 1: Floating Orbs (always visible, slow drift)
const FloatingOrbs = () => {
  const orbs = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        -8 - Math.random() * 12,
      ] as [number, number, number],
      radius: 0.3 + Math.random() * 0.9,
      color: i % 2 === 0 ? "#38bdf8" : "#0ea5e9", // Sky Blue tones per latest theme update
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  return (
    <>
      {orbs.map((orb, i) => (
        <Orb 
          key={i} 
          position={orb.position} 
          radius={orb.radius} 
          color={orb.color} 
          speed={orb.speed} 
          offset={orb.offset} 
        />
      ))}
    </>
  );
};

const Orb = ({ position, radius, color, speed, offset }: any) => {
  const ref = useRef<THREE.Mesh>(null);
  const isMobile = useIsMobile();
  
  useFrame((state) => {
    if (ref.current) {
      // Reduce parallax effect on mobile devices
      const parallaxMultiplier = isMobile ? 0.5 : 2;
      const targetX = position[0] + state.mouse.x * parallaxMultiplier;
      const targetY = position[1] + Math.sin(state.clock.getElapsedTime() * speed + offset) * 0.3 + state.mouse.y * parallaxMultiplier;
      
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX, 0.05);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, 0.05);
      
      ref.current.rotation.x += 0.005;
      ref.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.5} 
        transparent 
        opacity={0.25} 
      />
    </mesh>
  );
};

// LAYER 2: Particle Field (star-like dots)
const ParticleField = () => {
  const ref = useRef<THREE.Points>(null);
  const isMobile = useIsMobile();
  const count = 400;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0003;
      // Reduce parallax shift on mobile
      const parallaxMultiplier = isMobile ? 0.1 : 0.5;
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, state.mouse.x * parallaxMultiplier, 0.02);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, state.mouse.y * parallaxMultiplier, 0.02);
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#7dd3fc" transparent opacity={0.6} />
    </points>
  );
};

// LAYER 3: Grid Plane (bottom of screen, perspective grid)
const GridPlane = () => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const s = 0.98 + (Math.sin(state.clock.getElapsedTime()) + 1) * 0.02; // scale 0.98 - 1.02
      ref.current.scale.set(s, s, s);
    }
  });

  return (
    <mesh 
      ref={ref} 
      rotation={[-Math.PI / 2.2, 0, 0]} 
      position={[0, -8, -5]}
    >
      <planeGeometry args={[60, 60, 30, 30]} />
      <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.07} />
    </mesh>
  );
};

// LAYER 4: Floating Geometric Shapes (section transitions)
const FloatingShapes = () => {
  const shapes = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 25,
        (i / 5) * 40 - 20,
        -15,
      ] as [number, number, number],
      type: i % 2 === 0 ? "octahedron" : "torus",
      rotationSpeeds: [
        Math.random() * 0.01,
        Math.random() * 0.01,
        Math.random() * 0.01,
      ] as [number, number, number],
    }));
  }, []);

  return (
    <>
      {shapes.map((shape, i) => (
        <GeometricShape key={i} {...shape} />
      ))}
    </>
  );
};

const GeometricShape = ({ position, type, rotationSpeeds }: any) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += rotationSpeeds[0];
      ref.current.rotation.y += rotationSpeeds[1];
      ref.current.rotation.z += rotationSpeeds[2];
    }
  });

  return (
    <mesh ref={ref} position={position}>
      {type === "octahedron" ? (
        <octahedronGeometry args={[1.5]} />
      ) : (
        <torusGeometry args={[1, 0.3, 16, 32]} />
      )}
      <meshBasicMaterial color="#0ea5e9" wireframe transparent opacity={0.12} />
    </mesh>
  );
};

export const BackgroundCanvas = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#38bdf8" intensity={2} />
        
        <FloatingOrbs />
        <ParticleField />
        <GridPlane />
        <FloatingShapes />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40 pointer-events-none" />
    </div>
  );
};

export default BackgroundCanvas;
