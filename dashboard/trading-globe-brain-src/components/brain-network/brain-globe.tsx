"use client"

import { useRef, useState, useMemo } from "react"
import { useFrame, extend } from "@react-three/fiber"
import { Html, shaderMaterial } from "@react-three/drei"
import * as THREE from "three"
import type { Mesh, Group, Points, ShaderMaterial } from "three"

// Metallic gradient shader material
const MetallicGradientMaterial = shaderMaterial(
  {
    time: 0,
    colorA: new THREE.Color("#FFD700"),
    colorB: new THREE.Color("#FF8C00"),
    fresnelPower: 2.0,
    metalness: 0.9,
    roughness: 0.1,
  },
  // Vertex shader
  `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      vPosition = position;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 colorA;
    uniform vec3 colorB;
    uniform float fresnelPower;
    uniform float metalness;
    uniform float roughness;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vec3 viewDir = normalize(vViewPosition);
      
      // Fresnel effect for metallic rim
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), fresnelPower);
      
      // Dynamic gradient based on position and time
      float gradientFactor = sin(vPosition.y * 0.5 + time * 0.5) * 0.5 + 0.5;
      gradientFactor += sin(vPosition.x * 0.3 + time * 0.3) * 0.25;
      gradientFactor = clamp(gradientFactor, 0.0, 1.0);
      
      // Mix colors with opalescent shimmer
      vec3 baseColor = mix(colorA, colorB, gradientFactor);
      
      // Add iridescent highlights
      float iridescence = sin(vUv.x * 20.0 + time) * sin(vUv.y * 20.0 + time * 0.7);
      vec3 iridescentColor = vec3(
        0.5 + 0.5 * sin(iridescence + 0.0),
        0.5 + 0.5 * sin(iridescence + 2.0),
        0.5 + 0.5 * sin(iridescence + 4.0)
      );
      
      // Metallic specular highlights
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      vec3 halfDir = normalize(lightDir + viewDir);
      float specular = pow(max(dot(vNormal, halfDir), 0.0), 64.0 / (roughness + 0.01));
      
      // Combine all effects
      vec3 finalColor = baseColor * (1.0 - metalness * 0.5);
      finalColor += iridescentColor * 0.15 * metalness;
      finalColor += fresnel * colorB * 0.8;
      finalColor += specular * vec3(1.0) * metalness;
      
      // Add subtle glow at edges
      float glow = fresnel * 0.5;
      finalColor += glow * mix(colorA, colorB, 0.5);
      
      gl_FragColor = vec4(finalColor, 0.92);
    }
  `
)

extend({ MetallicGradientMaterial })

// Declare the JSX element type
declare global {
  namespace JSX {
    interface IntrinsicElements {
      metallicGradientMaterial: any
    }
  }
}

interface TradingStrategy {
  name: string
  description: string
  riskLevel: string
  timeframe: string
  expectedReturn: string
  indicators: string[]
  details: string
}

// Gradient color pairs for the opalescent effect
export const gradientPairs = [
  { colorA: "#FF8C00", colorB: "#FFD700", name: "orange-yellow" },      // Orange → Yellow
  { colorA: "#FFD700", colorB: "#00FF7F", name: "yellow-green" },       // Yellow → Green  
  { colorA: "#1E90FF", colorB: "#00CED1", name: "blue-aqua" },          // Blue → Aqua
  { colorA: "#00CED1", colorB: "#FFD700", name: "aqua-yellow" },        // Aqua → Yellow
  { colorA: "#9B30FF", colorB: "#FF1744", name: "purple-red" },         // Purple → Red
]

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
  const glowRef = useRef<Mesh>(null)
  const innerGlowRef = useRef<Mesh>(null)
  const ringsRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  const gradient = gradientPairs[gradientIndex % gradientPairs.length]

  // Create internal neural web geometry
  const internalConnections = useMemo(() => {
    const lines: THREE.Vector3[][] = []
    const nodeCount = 60
    const nodes: THREE.Vector3[] = []
    
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount)
      const theta = Math.sqrt(nodeCount * Math.PI) * phi
      const radius = size * (0.3 + Math.random() * 0.5)
      nodes.push(new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      ))
    }

    for (let i = 0; i < nodeCount; i++) {
      const connections = Math.floor(Math.random() * 4) + 2
      for (let j = 0; j < connections; j++) {
        const target = Math.floor(Math.random() * nodeCount)
        if (target !== i) {
          lines.push([nodes[i], nodes[target]])
        }
      }
    }
    return lines
  }, [size])

  // Create energy ring positions
  const energyRings = useMemo(() => {
    return [
      { radius: size * 1.15, thickness: 0.03, rotation: [Math.PI / 2, 0, 0] as [number, number, number] },
      { radius: size * 1.25, thickness: 0.02, rotation: [Math.PI / 2.5, Math.PI / 4, 0] as [number, number, number] },
      { radius: size * 1.35, thickness: 0.015, rotation: [Math.PI / 3, -Math.PI / 3, Math.PI / 6] as [number, number, number] },
    ]
  }, [size])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003
      groupRef.current.rotation.x = Math.sin(time * 0.15) * 0.08
    }

    if (materialRef.current) {
      materialRef.current.uniforms.time.value = time
    }

    if (glowRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.03 + (hovered ? 0.1 : 0)
      glowRef.current.scale.set(scale, scale, scale)
    }

    if (innerGlowRef.current) {
      const innerScale = 1 + Math.sin(time * 3) * 0.05
      innerGlowRef.current.scale.set(innerScale, innerScale, innerScale)
    }

    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.z += 0.002 * (i + 1) * (i % 2 === 0 ? 1 : -1)
      })
    }
  })

  const colorA = new THREE.Color(gradient.colorA)
  const colorB = new THREE.Color(gradient.colorB)
  const mixedColor = new THREE.Color().lerpColors(colorA, colorB, 0.5)

  return (
    <group ref={groupRef} position={position}>
      {/* Outer atmospheric glow */}
      <mesh ref={glowRef} scale={1.5}>
        <sphereGeometry args={[size, 48, 48]} />
        <meshBasicMaterial 
          color={mixedColor} 
          transparent 
          opacity={hovered ? 0.12 : 0.06} 
          side={THREE.BackSide}
        />
      </mesh>

      {/* Secondary glow layer */}
      <mesh scale={1.3}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial 
          color={colorB} 
          transparent 
          opacity={0.04} 
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main metallic opalescent sphere */}
      <mesh
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
        onClick={() => onSelect(strategy)}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <metallicGradientMaterial
          ref={materialRef}
          colorA={colorA}
          colorB={colorB}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Inner core glow */}
      <mesh ref={innerGlowRef}>
        <sphereGeometry args={[size * 0.25, 32, 32]} />
        <meshBasicMaterial 
          color={mixedColor} 
          transparent 
          opacity={0.9}
        />
      </mesh>

      {/* Inner energy sphere */}
      <mesh>
        <sphereGeometry args={[size * 0.15, 24, 24]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Internal neural connections */}
      {internalConnections.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                line[0].x, line[0].y, line[0].z,
                line[1].x, line[1].y, line[1].z
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial 
            color={mixedColor} 
            transparent 
            opacity={0.15}
          />
        </line>
      ))}

      {/* Energy rings - Iron Man style */}
      <group ref={ringsRef}>
        {energyRings.map((ring, i) => (
          <mesh key={i} rotation={ring.rotation}>
            <torusGeometry args={[ring.radius, ring.thickness, 8, 64]} />
            <meshBasicMaterial 
              color={i % 2 === 0 ? colorA : colorB} 
              transparent 
              opacity={hovered ? 0.7 : 0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Hexagonal tech pattern overlay (subtle) */}
      <mesh>
        <icosahedronGeometry args={[size * 1.02, 1]} />
        <meshBasicMaterial 
          color={colorB}
          wireframe 
          transparent 
          opacity={hovered ? 0.25 : 0.1}
        />
      </mesh>

      {/* Hover label with premium styling */}
      {hovered && (
        <Html distanceFactor={12} center>
          <div className="pointer-events-none backdrop-blur-xl px-5 py-3 rounded-xl whitespace-nowrap border"
            style={{
              background: `linear-gradient(135deg, ${gradient.colorA}20, ${gradient.colorB}20)`,
              borderColor: `${gradient.colorB}50`,
              boxShadow: `0 0 30px ${gradient.colorA}30, 0 0 60px ${gradient.colorB}20`
            }}
          >
            <p className="font-bold text-sm mb-1" style={{ color: gradient.colorB }}>{strategy.name}</p>
            <p className="text-white/70 text-xs">{strategy.riskLevel} Risk</p>
          </div>
        </Html>
      )}
    </group>
  )
}
