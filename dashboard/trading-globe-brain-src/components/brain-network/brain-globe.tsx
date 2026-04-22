"use client"

import { useMemo, useRef, useState } from "react"
import { Html, shaderMaterial } from "@react-three/drei"
import { extend, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { Group, Mesh, ShaderMaterial } from "three"

const LuminousMetalMaterial = shaderMaterial(
  {
    time: 0,
    colorA: new THREE.Color("#FFD44D"),
    colorB: new THREE.Color("#00C2FF"),
  },
  `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float time;
    uniform vec3 colorA;
    uniform vec3 colorB;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      float shimmer = sin(vPosition.y * 0.8 + time * 1.3) * 0.5 + 0.5;
      float pulse = sin(time * 1.9 + length(vPosition) * 0.35) * 0.5 + 0.5;
      float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.5);

      vec3 base = mix(colorA, colorB, shimmer);
      vec3 highlight = mix(colorB, colorA, pulse) * 0.55;
      vec3 finalColor = base + highlight * 0.35 + fresnel * mix(colorA, colorB, 0.5) * 0.9;

      gl_FragColor = vec4(finalColor, 0.92);
    }
  `
)

extend({ LuminousMetalMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      luminousMetalMaterial: any
    }
  }
}

export const gradientPairs = [
  { colorA: "#FFD44D", colorB: "#FF8A1E", name: "gold-amber" },
  { colorA: "#FF9F1A", colorB: "#2EA7FF", name: "amber-electric" },
  { colorA: "#2EA7FF", colorB: "#49E1FF", name: "blue-aqua" },
  { colorA: "#49E1FF", colorB: "#39E58C", name: "aqua-emerald" },
  { colorA: "#39E58C", colorB: "#B9FF4F", name: "emerald-lime" },
]

interface TradingStrategy {
  name: string
  description: string
  riskLevel: string
  timeframe: string
  expectedReturn: string
  indicators: string[]
  details: string
}

interface BrainGlobeProps {
  position: [number, number, number]
  gradientIndex: number
  size: number
  strategy: TradingStrategy
  onSelect: (strategy: TradingStrategy) => void
}

export function BrainGlobe({ position, gradientIndex, size, strategy, onSelect }: BrainGlobeProps) {
  const groupRef = useRef<Group>(null)
  const materialRef = useRef<ShaderMaterial>(null)
  const auraRef = useRef<Mesh>(null)
  const ringRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  const gradient = gradientPairs[gradientIndex % gradientPairs.length]
  const colorA = useMemo(() => new THREE.Color(gradient.colorA), [gradient.colorA])
  const colorB = useMemo(() => new THREE.Color(gradient.colorB), [gradient.colorB])
  const mixedColor = useMemo(() => new THREE.Color().lerpColors(colorA, colorB, 0.5), [colorA, colorB])

  const innerNetwork = useMemo(() => {
    const pointCount = 10
    const positions = new Float32Array(pointCount * 2 * 3)

    const samplePoint = () => {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = size * (0.16 + Math.random() * 0.42)
      return new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      )
    }

    for (let i = 0; i < pointCount; i++) {
      const a = samplePoint()
      const b = samplePoint()
      positions.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6)
    }

    return positions
  }, [size])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0014
      groupRef.current.rotation.x = Math.sin(t * 0.35 + position[0] * 0.01) * 0.08
      groupRef.current.rotation.z = Math.cos(t * 0.18 + position[1] * 0.02) * 0.03
    }

    if (materialRef.current) {
      materialRef.current.uniforms.time.value = t
    }

    if (auraRef.current) {
      const scale = hovered ? 1.26 : 1.14 + Math.sin(t * 1.7 + position[2] * 0.02) * 0.04
      auraRef.current.scale.set(scale, scale, scale)
    }

    if (ringRef.current) {
      ringRef.current.rotation.y += 0.004
      ringRef.current.rotation.x = Math.sin(t * 0.6) * 0.3
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={auraRef}>
        <sphereGeometry args={[size * 1.04, 24, 24]} />
        <meshBasicMaterial color={mixedColor} transparent opacity={hovered ? 0.2 : 0.1} side={THREE.BackSide} />
      </mesh>

      <mesh scale={1.18}>
        <sphereGeometry args={[size, 18, 18]} />
        <meshBasicMaterial color={gradient.colorB} transparent opacity={0.07} side={THREE.BackSide} />
      </mesh>

      <mesh
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = "default"
        }}
        onClick={() => onSelect(strategy)}
      >
        <sphereGeometry args={[size, 34, 34]} />
        <luminousMetalMaterial ref={materialRef} colorA={colorA} colorB={colorB} transparent depthWrite={false} />
      </mesh>

      <mesh>
        <icosahedronGeometry args={[size * 1.035, 1]} />
        <meshBasicMaterial color={gradient.colorB} wireframe transparent opacity={hovered ? 0.22 : 0.1} />
      </mesh>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={innerNetwork} count={innerNetwork.length / 3} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={mixedColor} transparent opacity={0.18} />
      </lineSegments>

      <mesh>
        <sphereGeometry args={[size * 0.2, 18, 18]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>

      <mesh>
        <sphereGeometry args={[size * 0.34, 20, 20]} />
        <meshBasicMaterial color={gradient.colorA} transparent opacity={0.18} />
      </mesh>

      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 2.3, 0.2, 0]}>
          <torusGeometry args={[size * 1.28, size * 0.035, 12, 72]} />
          <meshBasicMaterial color={gradient.colorA} transparent opacity={hovered ? 0.62 : 0.3} />
        </mesh>
        <mesh rotation={[Math.PI / 1.6, Math.PI / 4, 0]}>
          <torusGeometry args={[size * 1.42, size * 0.018, 10, 60]} />
          <meshBasicMaterial color={gradient.colorB} transparent opacity={hovered ? 0.55 : 0.24} />
        </mesh>
      </group>

      {hovered ? (
        <Html distanceFactor={18} center>
          <div
            className="pointer-events-none rounded-2xl border px-5 py-3 text-center shadow-2xl backdrop-blur-2xl"
            style={{
              background: `linear-gradient(135deg, ${gradient.colorA}20, ${gradient.colorB}22)`,
              borderColor: `${gradient.colorB}50`,
              boxShadow: `0 0 40px ${gradient.colorA}25, 0 0 90px ${gradient.colorB}10`,
            }}
          >
            <p className="text-sm font-semibold" style={{ color: gradient.colorB }}>
              {strategy.name}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-white/65">
              {strategy.riskLevel} risk • {strategy.timeframe}
            </p>
          </div>
        </Html>
      ) : null}
    </group>
  )
}
