"use client";

import { Canvas } from "@react-three/fiber";

const GOLD = "#C9952A";

function WireframeBuilding() {
  return (
    <group rotation={[0.15, 0.4, 0]}>
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
      frameloop="demand"
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5)]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      style={{ background: "transparent" }}
    >
      <WireframeBuilding />
    </Canvas>
  );
}
