"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const MOBILE_QUERY = "(max-width: 768px), (prefers-reduced-motion: reduce)";

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

function ScaleBeam({ position = [0, 0, 0], rotation = [0, 0, 0], color = "#d4a017" }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[2.7, 0.045, 0.045]} />
      <meshStandardMaterial color={color} metalness={0.72} roughness={0.28} />
    </mesh>
  );
}

function ScalePan({ position, tilt = 0 }) {
  const chainPoints = useMemo(
    () => [
      new THREE.Vector3(-0.24, 0.44, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.24, 0.44, 0),
    ],
    []
  );

  return (
    <group position={position} rotation={[0, 0, tilt]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <torusGeometry args={[0.46, 0.018, 10, 72]} />
        <meshStandardMaterial color="#1d9e75" metalness={0.55} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.13, 0]} scale={[1, 0.1, 1]}>
        <sphereGeometry args={[0.43, 32, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.18} roughness={0.1} metalness={0.2} />
      </mesh>
      <Line points={chainPoints} color="#d4a017" transparent opacity={0.7} lineWidth={1} />
    </group>
  );
}

function JusticeScale({ reduced }) {
  const group = useRef(null);
  const orb = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.2, 0.045);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.08, 0.045);
      group.current.position.y = Math.sin(t * 0.7) * 0.04;
    }
    if (orb.current && !reduced) {
      orb.current.rotation.x = t * 0.18;
      orb.current.rotation.y = t * 0.26;
    }
  });

  return (
    <Float speed={reduced ? 0.6 : 1.1} rotationIntensity={reduced ? 0.04 : 0.16} floatIntensity={reduced ? 0.08 : 0.24}>
      <group ref={group} scale={reduced ? 0.88 : 1}>
        <mesh ref={orb} position={[0, 0.14, 0]}>
          <icosahedronGeometry args={[0.9, reduced ? 1 : 3]} />
          <MeshTransmissionMaterial
            color="#f7e3a0"
            thickness={0.45}
            roughness={0.18}
            transmission={0.68}
            ior={1.25}
            chromaticAberration={0.03}
            backside
          />
        </mesh>

        <mesh position={[0, -0.08, 0]}>
          <cylinderGeometry args={[0.035, 0.05, 2.15, 24]} />
          <meshStandardMaterial color="#d4a017" metalness={0.75} roughness={0.25} />
        </mesh>
        <ScaleBeam position={[0, 0.62, 0]} rotation={[0, 0, -0.05]} />
        <ScaleBeam position={[0, -1.2, 0]} rotation={[0, 0, Math.PI / 2]} color="#1d9e75" />
        <mesh position={[0, -1.28, 0]} scale={[1.2, 0.12, 1.2]}>
          <cylinderGeometry args={[0.46, 0.58, 0.18, 48]} />
          <meshStandardMaterial color="#1a1916" metalness={0.4} roughness={0.34} />
        </mesh>

        <ScalePan position={[-1.04, 0.06, 0]} tilt={0.04} />
        <ScalePan position={[1.04, -0.05, 0]} tilt={-0.04} />
      </group>
    </Float>
  );
}

export default function HeroCanvas() {
  const reduced = useReducedScene();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.1, 5.2], fov: 38 }}
        dpr={reduced ? 1 : [1, 1.6]}
        performance={{ min: 0.55 }}
        gl={{ antialias: !reduced, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.72} />
        <directionalLight position={[2.6, 3.2, 4]} intensity={1.3} color="#fff4cf" />
        <pointLight position={[-3, -1, 3]} intensity={0.9} color="#4a85f6" />
        <Suspense fallback={null}>
          <JusticeScale reduced={reduced} />
          {!reduced && <Sparkles count={36} scale={[5, 2.6, 1.6]} size={1.8} speed={0.24} color="#d4a017" opacity={0.3} />}
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/20 via-bg-primary/55 to-bg-primary" />
    </div>
  );
}
