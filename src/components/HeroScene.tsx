"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Torus, Octahedron, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

/* ─── Individual floating food orb ─── */
function FoodOrb({
  position,
  color,
  emissive,
  scale,
  speed,
  shape,
}: {
  position: [number, number, number];
  color: string;
  emissive: string;
  scale: number;
  speed: number;
  shape: "sphere" | "torus" | "octahedron";
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed;
    meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.3;
    meshRef.current.rotation.y += 0.008 * speed;
    meshRef.current.rotation.z = Math.cos(t * 0.4) * 0.2;
  });

  const material = (
    <MeshDistortMaterial
      color={color}
      emissive={emissive}
      emissiveIntensity={0.4}
      roughness={0.1}
      metalness={0.05}
      distort={0.35}
      speed={2}
      transparent
      opacity={0.9}
    />
  );

  return (
    <Float speed={speed * 1.2} rotationIntensity={0.4} floatIntensity={1.5}>
      {shape === "sphere" && (
        <Sphere ref={meshRef} args={[scale, 32, 32]} position={position}>
          {material}
        </Sphere>
      )}
      {shape === "torus" && (
        <Torus ref={meshRef} args={[scale * 0.8, scale * 0.3, 16, 64]} position={position}>
          {material}
        </Torus>
      )}
      {shape === "octahedron" && (
        <Octahedron ref={meshRef} args={[scale]} position={position}>
          {material}
        </Octahedron>
      )}
    </Float>
  );
}

/* ─── Mouse-reactive camera rig ─── */
function CameraRig() {
  const { camera, pointer } = useThree();
  
  useFrame(() => {
    if (!camera) return;
    camera.position.x += (pointer.x * 1.5 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 1.0 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

/* ─── Scene config ─── */
const FOOD_ITEMS = [
  // Avocados – green
  { position: [-3.5, 1.5, -2] as [number,number,number], color: "#7ec87e", emissive: "#4e9a4e", scale: 0.75, speed: 0.8, shape: "sphere" as const },
  { position: [3.8, -0.5, -3] as [number,number,number], color: "#9ed99e", emissive: "#5ea85e", scale: 0.6,  speed: 1.1, shape: "sphere" as const },
  // Berries – pink/red
  { position: [-2, -2, -1.5] as [number,number,number], color: "#f48fb1", emissive: "#c2185b", scale: 0.5,  speed: 1.3, shape: "sphere" as const },
  { position: [2.5, 2.2, -2]  as [number,number,number], color: "#f06292", emissive: "#ad1457", scale: 0.45, speed: 0.9, shape: "sphere" as const },
  { position: [0.5, -2.5, -1] as [number,number,number], color: "#f44336", emissive: "#b71c1c", scale: 0.38, speed: 1.5, shape: "sphere" as const },
  // Lemon – apricot/yellow
  { position: [1.5, 0.8, -2.5] as [number,number,number], color: "#ffd54f", emissive: "#f57f17", scale: 0.55, speed: 0.7, shape: "sphere" as const },
  // Lavender torus – abstract nutrient ring
  { position: [-1, 1.2, -3]   as [number,number,number], color: "#ce93d8", emissive: "#7b1fa2", scale: 0.65, speed: 1.0, shape: "torus" as const },
  { position: [3, -1.8, -3.5] as [number,number,number], color: "#b39ddb", emissive: "#4527a0", scale: 0.5,  speed: 0.85, shape: "torus" as const },
  // Crystal octahedra – vitamin drops
  { position: [-3, -0.8, -4]  as [number,number,number], color: "#80deea", emissive: "#00838f", scale: 0.45, speed: 1.2, shape: "octahedron" as const },
  { position: [0, 3, -4]      as [number,number,number], color: "#a5d6a7", emissive: "#1b5e20", scale: 0.4,  speed: 1.4, shape: "octahedron" as const },
];

/* ─── Main export ─── */
export default function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#f4e0e0" />
        <pointLight position={[-5, -3, 3]} intensity={0.8} color="#eae0f4" />
        <pointLight position={[0, -5, -2]} intensity={0.5} color="#fbe5c8" />

        <Stars radius={80} depth={50} count={800} factor={3} fade speed={0.5} />

        <Suspense fallback={null}>
          {FOOD_ITEMS.map((item, i) => (
            <FoodOrb key={i} {...item} />
          ))}
        </Suspense>

        <CameraRig />
      </Canvas>
    </div>
  );
}
