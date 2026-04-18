"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GOLD = "#C9952A";

function WireframeBuilding() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.1;
    groupRef.current.rotation.x += delta * 0.02;
  });

  return (
    <group ref={groupRef}>
      {/* Main tower */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.7, 2.8, 0.7]} />
        <meshBasicMaterial color={GOLD} wireframe />
      </mesh>
      {/* Side annex */}
      <mesh position={[0.72, -0.15, 0]}>
        <boxGeometry args={[0.5, 1.6, 0.5]} />
        <meshBasicMaterial color={GOLD} wireframe />
      </mesh>
      {/* Base plinth */}
      <mesh position={[0.18, -1.05, 0]}>
        <boxGeometry args={[1.4, 0.12, 1.0]} />
        <meshBasicMaterial color={GOLD} wireframe />
      </mesh>
      {/* Roof cap */}
      <mesh position={[0, 2.1, 0]}>
        <boxGeometry args={[0.38, 0.38, 0.38]} />
        <meshBasicMaterial color={GOLD} wireframe />
      </mesh>
      {/* Floating accent — small octahedron */}
      <mesh position={[-1.4, 0.2, -0.5]}>
        <octahedronGeometry args={[0.38, 0]} />
        <meshBasicMaterial color={GOLD} wireframe />
      </mesh>
    </group>
  );
}

export default function HeroBackground3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <WireframeBuilding />
    </Canvas>
  );
}
