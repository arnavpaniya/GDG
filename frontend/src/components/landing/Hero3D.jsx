"use client";

import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * Hero3D — A 3D realisation of the Nyaya AI logo mark
 * (oval/circle with 4 nodes connected by a cross), floating in space
 * with mouse parallax, gold particles, and a transmissive sphere core.
 */

function LogoMark3D({ reduced = false }) {
  const group = useRef(null);
  const orb = useRef(null);
  const ring = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      // mouse parallax
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        state.pointer.x * 0.6,
        0.04
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -state.pointer.y * 0.3,
        0.04
      );
      group.current.position.y = Math.sin(t * 0.6) * 0.08;
    }
    if (orb.current) {
      orb.current.rotation.x = t * 0.25;
      orb.current.rotation.y = t * 0.4;
    }
    if (ring.current && !reduced) {
      ring.current.rotation.z = t * 0.15;
    }
  });

  // Node positions: top, bottom, left, right
  const nodes = useMemo(
    () => [
      { pos: [0, 1.25, 0], scale: 0.13 }, // top
      { pos: [0, -1.25, 0], scale: 0.13 }, // bottom
      { pos: [-1.55, 0, 0], scale: 0.18 }, // left
      { pos: [1.55, 0, 0], scale: 0.18 }, // right
      { pos: [0, 0, 0], scale: 0.28 }, // center
    ],
    []
  );

  return (
    <Float
      speed={reduced ? 0.5 : 1.1}
      rotationIntensity={reduced ? 0.1 : 0.35}
      floatIntensity={reduced ? 0.1 : 0.3}
    >
      <group ref={group} scale={reduced ? 0.6 : 0.75}>
        {/* Outer ring (oval) - tilted */}
        <group ref={ring} rotation={[0, 0, 0]}>
          <mesh>
            <torusGeometry args={[1.7, 0.045, 24, 128]} />
            <meshStandardMaterial
              color="#E5B028"
              metalness={0.95}
              roughness={0.18}
              emissive="#7a5a10"
              emissiveIntensity={0.4}
            />
          </mesh>
          {/* Subtle outer glow ring */}
          <mesh>
            <torusGeometry args={[1.78, 0.012, 16, 128]} />
            <meshStandardMaterial
              color="#F5C238"
              emissive="#F5C238"
              emissiveIntensity={1.2}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>

        {/* Cross beams */}
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 2.5, 16]} />
          <meshStandardMaterial color="#E5B028" metalness={0.9} roughness={0.2} emissive="#5a4008" emissiveIntensity={0.4} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 3.1, 16]} />
          <meshStandardMaterial color="#E5B028" metalness={0.9} roughness={0.2} emissive="#5a4008" emissiveIntensity={0.4} />
        </mesh>

        {/* Side node rings (the small "O" shapes on left/right) */}
        <mesh position={[-1.55, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.035, 16, 48]} />
          <meshStandardMaterial color="#E5B028" metalness={0.95} roughness={0.2} emissive="#5a4008" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[1.55, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.035, 16, 48]} />
          <meshStandardMaterial color="#E5B028" metalness={0.95} roughness={0.2} emissive="#5a4008" emissiveIntensity={0.5} />
        </mesh>

        {/* Nodes */}
        {nodes.map((n, i) => (
          <mesh key={i} position={n.pos}>
            <sphereGeometry args={[n.scale, 32, 32]} />
            <meshStandardMaterial
              color="#F5C238"
              metalness={0.6}
              roughness={0.2}
              emissive="#F5C238"
              emissiveIntensity={0.7}
            />
          </mesh>
        ))}

        {/* Translucent core orb behind everything for depth */}
        <mesh ref={orb} position={[0, 0, -0.05]}>
          <icosahedronGeometry args={[0.55, reduced ? 1 : 3]} />
          <MeshTransmissionMaterial
            color="#F7E3A0"
            thickness={0.35}
            roughness={0.15}
            transmission={0.85}
            ior={1.3}
            chromaticAberration={0.04}
            backside
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function Hero3D({ reduced = false }) {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 38 }}
        dpr={reduced ? 1 : [1, 2]}
        performance={{ min: 0.5 }}
        gl={{ antialias: !reduced, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} color="#FFE9B0" />
        <pointLight position={[-4, -2, 3]} intensity={1.2} color="#4A85F6" />
        <pointLight position={[4, 3, -2]} intensity={0.9} color="#F5C238" />

          <Suspense fallback={null}>
            <LogoMark3D reduced={reduced} />
            {!reduced && (
              <Sparkles
                count={70}
                scale={[8, 5, 4]}
                size={2.4}
                speed={0.3}
                color="#F5C238"
                opacity={0.9}
              />
            )}
          </Suspense>
      </Canvas>
    </div>
  );
}
