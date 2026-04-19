"use client";

import { useEffect, useState, Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import type { Group } from "three";

function GoldSpinnerOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0D0D0D] z-10">
      <div
        className="w-10 h-10 rounded-full border-2 border-t-[#C9952A] animate-spin"
        style={{ borderColor: "rgba(201,149,42,0.2)", borderTopColor: "#C9952A" }}
      />
    </div>
  );
}

function GLTFScene({ url, onLoad }: { url: string; onLoad: () => void }) {
  const { scene } = useGLTF(url);
  useEffect(() => { onLoad(); }, [onLoad]);
  return <primitive object={scene} />;
}

function FBXScene({ url, onLoad }: { url: string; onLoad: () => void }) {
  const fbx = useLoader(FBXLoader, url) as Group;
  useEffect(() => { onLoad(); }, [onLoad]);
  return <primitive object={fbx} />;
}

interface Props {
  url: string;
}

export default function Model3DViewer({ url }: Props) {
  const [loaded, setLoaded] = useState(false);
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "glb";

  return (
    <div className="relative w-full h-full bg-[#0D0D0D]" style={{ minHeight: 400 }}>
      {!loaded && <GoldSpinnerOverlay />}
      <Canvas camera={{ position: [0, 1, 4], fov: 50 }}>
        <ambientLight intensity={0.4} color="#D4AF37" />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#C9952A" />
        <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#D4AF37" />
        <Suspense fallback={null}>
          {ext === "fbx" ? (
            <FBXScene url={url} onLoad={() => setLoaded(true)} />
          ) : (
            <GLTFScene url={url} onLoad={() => setLoaded(true)} />
          )}
        </Suspense>
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}
