"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { gradientPairs } from "./brain-globe"

interface NeuralConnectionsProps {
  positions: [number, number, number][]
  gradientIndices: number[]
  neighborRadius?: number
}

interface ConnectionModel {
  curve: THREE.QuadraticBezierCurve3
  linePositions: Float32Array
  glowPositions: Float32Array
  color: THREE.Color
  index: number
}

export function NeuralConnections({ positions, gradientIndices, neighborRadius = 78 }: NeuralConnectionsProps) {
  const groupRef = useRef<THREE.Group>(null)

  const connections = useMemo<ConnectionModel[]>(() => {
    const models: ConnectionModel[] = []

    for (let i = 0; i < positions.length; i++) {
      const start = new THREE.Vector3(...positions[i])
      const nearest = positions
        .map((pos, idx) => ({ idx, distance: start.distanceTo(new THREE.Vector3(...pos)) }))
        .filter((candidate) => candidate.idx !== i && candidate.distance < neighborRadius)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2)

      nearest.forEach(({ idx, distance }, order) => {
        if (idx <= i) return

        const end = new THREE.Vector3(...positions[idx])
        const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
        const bend = distance * 0.12
        midpoint.x += (Math.random() - 0.5) * bend
        midpoint.y += (Math.random() - 0.5) * bend
        midpoint.z += (Math.random() - 0.5) * bend

        const curve = new THREE.QuadraticBezierCurve3(start, midpoint, end)
        const samples = 18
        const linePositions = new Float32Array((samples + 1) * 3)
        for (let step = 0; step <= samples; step++) {
          const point = curve.getPoint(step / samples)
          linePositions.set([point.x, point.y, point.z], step * 3)
        }

        const glowPositions = new Float32Array(4 * 3)
        for (let particle = 0; particle < 4; particle++) {
          const point = curve.getPoint(particle / 4)
          glowPositions.set([point.x, point.y, point.z], particle * 3)
        }

        const from = gradientPairs[gradientIndices[i] % gradientPairs.length]
        const to = gradientPairs[gradientIndices[idx] % gradientPairs.length]
        const color = new THREE.Color(from.colorB).lerp(new THREE.Color(to.colorA), 0.5)

        models.push({
          curve,
          linePositions,
          glowPositions,
          color,
          index: i * 10 + order,
        })
      })
    }

    return models
  }, [gradientIndices, neighborRadius, positions])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (!groupRef.current) return

    groupRef.current.children.forEach((child, idx) => {
      const glow = child.getObjectByName(`glow-${idx}`) as THREE.Points | undefined
      if (!glow) return
      const model = connections[idx]
      const attribute = glow.geometry.attributes.position
      const array = attribute.array as Float32Array
      for (let particle = 0; particle < 4; particle++) {
        const point = model.curve.getPoint(((particle / 4) + time * 0.12 + model.index * 0.03) % 1)
        array[particle * 3] = point.x
        array[particle * 3 + 1] = point.y
        array[particle * 3 + 2] = point.z
      }
      attribute.needsUpdate = true
    })
  })

  return (
    <group ref={groupRef}>
      {connections.map((connection, idx) => (
        <group key={`${connection.index}-${idx}`}>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                array={connection.linePositions}
                count={connection.linePositions.length / 3}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={connection.color} transparent opacity={0.3} />
          </line>

          <line scale={1.02}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                array={connection.linePositions}
                count={connection.linePositions.length / 3}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={connection.color} transparent opacity={0.1} />
          </line>

          <points name={`glow-${idx}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                array={connection.glowPositions}
                count={connection.glowPositions.length / 3}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial color={connection.color} size={0.7} transparent opacity={0.85} sizeAttenuation depthWrite={false} />
          </points>
        </group>
      ))}
    </group>
  )
}
