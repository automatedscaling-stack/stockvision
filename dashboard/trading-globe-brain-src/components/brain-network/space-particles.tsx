"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function SpaceParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const glowPointsRef = useRef<THREE.Points>(null)

  const particles = useMemo(() => {
    const count = 4000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const colorPalette = [
      new THREE.Color("#FFD44D"),
      new THREE.Color("#FF9F1A"),
      new THREE.Color("#2EA7FF"),
      new THREE.Color("#49E1FF"),
      new THREE.Color("#39E58C"),
      new THREE.Color("#B9FF4F"),
      new THREE.Color("#FFFFFF"),
    ]

    for (let i = 0; i < count; i++) {
      const radius = 200 + Math.random() * 300
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    return { positions, colors }
  }, [])

  // Floating energy particles closer to the network
  const glowParticles = useMemo(() => {
    const count = 1500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const colorPalette = [
      new THREE.Color("#FFD44D"),
      new THREE.Color("#49E1FF"),
      new THREE.Color("#39E58C"),
    ]

    for (let i = 0; i < count; i++) {
      const radius = 80 + Math.random() * 120
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0001
      pointsRef.current.rotation.x += 0.00005
    }
    if (glowPointsRef.current) {
      glowPointsRef.current.rotation.y -= 0.0003
      glowPointsRef.current.rotation.z += 0.0001
    }
  })

  return (
    <group>
      {/* Background stars */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.6}
          transparent
          opacity={0.7}
          vertexColors
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Floating energy particles */}
      <points ref={glowPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={glowParticles.positions.length / 3}
            array={glowParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={glowParticles.colors.length / 3}
            array={glowParticles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.2}
          transparent
          opacity={0.4}
          vertexColors
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  )
}
