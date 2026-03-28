import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// LAYER 1: Cloud Nodes (the "servers")
const CloudNode = ({ position, color, rotationSpeed, offset }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + offset) * 0.15;
      meshRef.current.rotation.x += rotationSpeed[0];
      meshRef.current.rotation.y += rotationSpeed[1];
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} roughness={0.3} metalness={0.8} />
      </mesh>
      <pointLight color={color} intensity={0.5} distance={3} />
    </group>
  );
};

// LAYER 2: Data Link & Traveling Packet
const DataLink = ({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) => {
  const packetRef = useRef<THREE.Mesh>(null);
  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([start, end]);
  }, [start, end]);

  useFrame((state) => {
    if (packetRef.current) {
      const t = (state.clock.getElapsedTime() * 0.4) % 1; // Speed factor 0.4
      packetRef.current.position.lerpVectors(start, end, t);
    }
  });

  return (
    <group>
      <primitive 
        object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: "#6366f1", transparent: true, opacity: 0.2 }))} 
      />
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};

// LAYER 3: Cloud Shell Rings
const CloudShell = () => {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ring1Ref.current) ring1Ref.current.rotation.y += 0.0005;
    if (ring2Ref.current) ring2Ref.current.rotation.z += 0.0005;
  });

  return (
    <group>
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[6, 0.02, 12, 64]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.06} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[6, 0.02, 12, 64]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.06} />
      </mesh>
    </group>
  );
};

// LAYER 4: Spherical Particle Field
const SphericalStarfield = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 300;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const radius = 8 + Math.random() * 12;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
        pointsRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#c4b5fd" transparent opacity={0.4} sizeAttenuation={true} />
    </points>
  );
};

export default function ThreeDElement() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const nodes = useMemo(() => {
    const colors = ["#378ADD", "#6366f1", "#a855f7"];
    return Array.from({ length: 8 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        -2 - Math.random() * 6,
      ] as [number, number, number],
      color: colors[i % colors.length],
      rotationSpeed: [Math.random() * 0.01, Math.random() * 0.01] as [number, number],
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  const links = useMemo(() => {
    return Array.from({ length: 10 }).map(() => {
      const startIdx = Math.floor(Math.random() * nodes.length);
      let endIdx = Math.floor(Math.random() * nodes.length);
      while (endIdx === startIdx) endIdx = Math.floor(Math.random() * nodes.length);
      
      return {
        start: new THREE.Vector3(...nodes[startIdx].position),
        end: new THREE.Vector3(...nodes[endIdx].position),
      };
    });
  }, [nodes]);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.3} color="#0a0a2e" />
        <directionalLight position={[5, 5, 5]} color="#6366f1" intensity={1.5} />
        <directionalLight position={[-5, -3, -5]} color="#a855f7" intensity={0.8} />

        <group>
          {nodes.map((node, i) => (
            <CloudNode key={i} {...node} />
          ))}
          {links.map((link, i) => (
            <DataLink key={i} start={link.start} end={link.end} />
          ))}
        </group>

        <CloudShell />
        <SphericalStarfield />
      </Canvas>
    </div>
  );
}
