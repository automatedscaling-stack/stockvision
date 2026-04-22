"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { gradientPairs } from "./brain-globe"

interface NeuralConnectionsProps {
  positions: [number, number, number][]
  gradientIndices: number[]
}

export function NeuralConnections({ positions, gradientIndices }: NeuralConnectionsProps) {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  const connections = useMemo(() => {
    const lines: { 
      start: THREE.Vector3
      end: THREE.Vector3
      colorA: string
      colorB: string
      midPoint: THREE.Vector3
      distance: number
    }[] = []

    // Connect each globe to nearby globes based on distance
    for (let i = 0; i < positions.length; i++) {
      const startPos = new THREE.Vector3(...positions[i])
      const startGradient = gradientPairs[gradientIndices[i] % gradientPairs.length]
      
      // Find nearest neighbors
      const distances = positions
        .map((pos, idx) => ({
          idx,
          distance: startPos.distanceTo(new THREE.Vector3(...pos))
        }))
        .filter(d => d.idx !== i && d.distance < 60) // Only connect nearby nodes
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 4) // Connect to 4 nearest

      distances.forEach(({ idx, distance }) => {
        // Avoid duplicate connections
        if (idx > i) {
          const endPos = new THREE.Vector3(...positions[idx])
          const endGradient = gradientPairs[gradientIndices[idx] % gradientPairs.length]
          
          const midPoint = new THREE.Vector3()
            .addVectors(startPos, endPos)
            .multiplyScalar(0.5)
          
          // Add curve offset based on distance
          const curveStrength = distance * 0.15
          midPoint.x += (Math.random() - 0.5) * curveStrength
          midPoint.y += (Math.random() - 0.5) * curveStrength
          midPoint.z += (Math.random() - 0.5) * curveStrength

          lines.push({
            start: startPos,
            end: endPos,
            colorA: startGradient.colorB,
            colorB: endGradient.colorA,
            midPoint,
            distance
          })
        }
      })
    }

    return lines
  }, [positions, gradientIndices])

  // Create tube geometries for thicker, more visible connections
  const tubeGeometries = useMemo(() => {
    return connections.map(connection => {
      const curve = new THREE.QuadraticBezierCurve3(
        connection.start,
        connection.midPoint,
        connection.end
      )
      return new THREE.TubeGeometry(curve, 32, 0.08, 8, false)
    })
  }, [connections])

  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime
  })

  return (
    <group ref={groupRef}>
      {connections.map((connection, i) => {
        const mixedColor = new THREE.Color(connection.colorA).lerp(
          new THREE.Color(connection.colorB), 
          0.5
        )

        return (
          <group key={i}>
            {/* Main glowing tube connection */}
            <mesh geometry={tubeGeometries[i]}>
              <meshBasicMaterial 
                color={mixedColor} 
                transparent 
                opacity={0.6}
              />
            </mesh>

            {/* Outer glow tube */}
            <mesh geometry={tubeGeometries[i]} scale={2}>
              <meshBasicMaterial 
                color={connection.colorA} 
                transparent 
                opacity={0.15}
              />
            </mesh>

            {/* Energy flow particles along the connection */}
            <ConnectionParticles 
              curve={new THREE.QuadraticBezierCurve3(
                connection.start,
                connection.midPoint,
                connection.end
              )}
              color={connection.colorB}
              index={i}
            />
          </group>
        )
      })}
    </group>
  )
}

interface ConnectionParticlesProps {
  curve: THREE.QuadraticBezierCurve3
  color: string
  index: number
}

function ConnectionParticles({ curve, color, index }: ConnectionParticlesProps) {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 8

  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount
      const point = curve.getPoint(t)
      arr[i * 3] = point.x
      arr[i * 3 + 1] = point.y
      arr[i * 3 + 2] = point.z
    }
    return arr
  }, [curve])

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < particleCount; i++) {
        const t = ((i / particleCount) + time * 0.3 + index * 0.1) % 1
        const point = curve.getPoint(t)
        posArray[i * 3] = point.x
        posArray[i * 3 + 1] = point.y
        posArray[i * 3 + 2] = point.z
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color={color} 
        size={0.4}
        transparent 
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  )
}
