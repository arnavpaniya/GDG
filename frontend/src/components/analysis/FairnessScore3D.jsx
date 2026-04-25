"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Ring } from "@react-three/drei";
import * as THREE from "three";
import FairnessScoreRing from "@/components/analysis/FairnessScoreRing";

const MOBILE_QUERY = "(max-width: 640px), (prefers-reduced-motion: reduce)";

function useReducedScene() {
  const [isReduced, setIsReduced] = useState(true);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isReduced;
}

function getScoreColor(score) {
  if (score >= 75) return "#1d9e75";
  if (score >= 50) return "#f5a623";
  return "#e24b4a";
}

function ScoreObject({ score }) {
  const group = useRef(null);
  const fill = useRef(null);
  const scoreColor = useMemo(() => new THREE.Color(getScoreColor(score)), [score]);
  const fillScale = Math.max(0.04, Math.min(score, 100) / 100);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.45;
      group.current.rotation.x = Math.sin(t * 0.6) * 0.12;
    }
    if (fill.current) {
      fill.current.scale.setScalar(THREE.MathUtils.lerp(fill.current.scale.x, fillScale, 0.08));
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.82, 48, 24]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.1} metalness={0.2} roughness={0.18} />
      </mesh>
      <mesh ref={fill}>
        <icosahedronGeometry args={[0.78, 3]} />
        <meshStandardMaterial color={scoreColor} emissive={scoreColor} emissiveIntensity={0.18} roughness={0.26} metalness={0.35} transparent opacity={0.78} />
      </mesh>
      <Ring args={[0.98, 1.03, 96]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={scoreColor} emissive={scoreColor} emissiveIntensity={0.2} side={THREE.DoubleSide} />
      </Ring>
      <Ring args={[1.12, 1.15, 96]} rotation={[0.88, 0.2, 0]}>
        <meshStandardMaterial color="#d4a017" transparent opacity={0.55} side={THREE.DoubleSide} />
      </Ring>
    </group>
  );
}

export default function FairnessScore3D({ score = 0 }) {
  const reduced = useReducedScene();

  if (reduced) {
    return <FairnessScoreRing score={score} />;
  }

  return (
    <div className="flex flex-col items-center gap-compact">
      <div className="relative h-[160px] w-[180px]">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 38 }}
          dpr={[1, 1.5]}
          performance={{ min: 0.6 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 2.6, 3]} intensity={1.25} />
          <pointLight position={[-2, -1, 2]} intensity={0.75} color="#4a85f6" />
          <Suspense fallback={null}>
            <ScoreObject score={score} />
          </Suspense>
        </Canvas>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-medium text-text-primary drop-shadow-sm">{score}</span>
          <span className="text-[10px] text-text-secondary uppercase tracking-wider">Score</span>
        </div>
      </div>
    </div>
  );
}
