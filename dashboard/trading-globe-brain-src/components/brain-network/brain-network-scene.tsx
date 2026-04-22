"use client"

import { useRef, useState, useCallback, useEffect, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Stars, Float } from "@react-three/drei"
import * as THREE from "three"
import { BrainGlobe, gradientPairs } from "./brain-globe"
import { NeuralConnections } from "./neural-connections"
import { SpaceParticles } from "./space-particles"
import { StrategyPopup } from "./strategy-popup"
import { tradingStrategies, generateGlobePositions, generateGradientIndices, type TradingStrategy } from "@/lib/trading-strategies"

function CameraController() {
  const { camera } = useThree()
  const mouseRef = useRef({ x: 0, y: 0 })
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useFrame(() => {
    const targetX = mouseRef.current.x * 30
    const targetY = mouseRef.current.y * 20
    
    currentLookAt.current.x += (targetX - currentLookAt.current.x) * 0.02
    currentLookAt.current.y += (targetY - currentLookAt.current.y) * 0.02
    
    camera.lookAt(currentLookAt.current)
  })

  return null
}

// Ambient light pulses for Iron Man effect
function AmbientPulse() {
  const lightRef = useRef<THREE.PointLight>(null)
  
  useFrame((state) => {
    if (lightRef.current) {
      const intensity = 0.8 + Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      lightRef.current.intensity = intensity
    }
  })
  
  return <pointLight ref={lightRef} position={[0, 0, 0]} intensity={0.8} color="#00CED1" distance={200} />
}

// Holographic grid floor
function HolographicGrid() {
  const gridRef = useRef<THREE.GridHelper>(null)
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.y = -80 + Math.sin(state.clock.elapsedTime * 0.2) * 2
    }
  })
  
  return (
    <group>
      <gridHelper 
        ref={gridRef}
        args={[400, 60, "#00CED1", "#1E90FF"]} 
        position={[0, -80, 0]}
      />
      <mesh position={[0, -82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[400, 400]} />
        <meshBasicMaterial color="#000510" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

interface BrainNetworkSceneInnerProps {
  onSelectStrategy: (strategy: TradingStrategy) => void
  globeCount: number
  version: number
}

function BrainNetworkSceneInner({ onSelectStrategy, globeCount, version }: BrainNetworkSceneInnerProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Generate positions based on version with 3x count
  const positions = useMemo(() => {
    const spread = version === 1 ? 90 : version === 2 ? 110 : version === 3 ? 100 : version === 4 ? 120 : 105
    return generateGlobePositions(globeCount, spread, version)
  }, [globeCount, version])

  // Generate gradient indices for color distribution
  const gradientIndices = useMemo(() => {
    return generateGradientIndices(globeCount)
  }, [globeCount])

  // Map strategies to globes with bigger sizes
  const globeData = useMemo(() => {
    return positions.map((pos, i) => ({
      position: pos,
      gradientIndex: gradientIndices[i],
      size: 5 + Math.random() * 4, // Bigger globes: 5-9 units
      strategy: tradingStrategies[i % tradingStrategies.length]
    }))
  }, [positions, gradientIndices])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0002
    }
  })

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000510", 150, 500]} />
      
      {/* Lighting setup for metallic reflections */}
      <ambientLight intensity={0.2} />
      <AmbientPulse />
      
      {/* Key lights for metallic highlights */}
      <pointLight position={[150, 100, 100]} intensity={1.5} color="#FFD700" distance={400} />
      <pointLight position={[-150, -80, -100]} intensity={1.2} color="#00CED1" distance={400} />
      <pointLight position={[0, 150, -150]} intensity={1} color="#FF8C00" distance={400} />
      <pointLight position={[-100, 50, 150]} intensity={0.8} color="#9B30FF" distance={400} />
      <pointLight position={[100, -100, 50]} intensity={0.8} color="#00FF7F" distance={400} />

      {/* Rim lights for dramatic effect */}
      <directionalLight position={[0, 100, -200]} intensity={0.5} color="#1E90FF" />
      <directionalLight position={[0, -100, 200]} intensity={0.3} color="#FF1744" />

      <PerspectiveCamera makeDefault position={[0, 20, 180]} fov={60} />
      <CameraController />
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        panSpeed={0.8}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        minDistance={50}
        maxDistance={400}
        dampingFactor={0.05}
        enableDamping
      />

      {/* Enhanced star field */}
      <Stars 
        radius={400} 
        depth={150} 
        count={3000} 
        factor={5} 
        saturation={0.7} 
        fade 
        speed={0.3}
      />

      <SpaceParticles />
      <HolographicGrid />

      <group ref={groupRef}>
        {/* Neural connections between globes */}
        <NeuralConnections 
          positions={positions} 
          gradientIndices={gradientIndices}
        />

        {/* Brain globes with metallic gradients */}
        {globeData.map((globe, i) => (
          <Float
            key={i}
            speed={0.5 + Math.random() * 0.5}
            rotationIntensity={0.1}
            floatIntensity={0.3}
            floatingRange={[-0.5, 0.5]}
          >
            <BrainGlobe
              position={globe.position}
              gradientIndex={globe.gradientIndex}
              size={globe.size}
              strategy={globe.strategy}
              onSelect={onSelectStrategy}
            />
          </Float>
        ))}
      </group>
    </>
  )
}

interface BrainNetworkSceneProps {
  version?: number
  globeCount?: number
}

export function BrainNetworkScene({ version = 1, globeCount = 60 }: BrainNetworkSceneProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategy | null>(null)

  const handleSelectStrategy = useCallback((strategy: TradingStrategy) => {
    setSelectedStrategy(strategy)
  }, [])

  const handleClosePopup = useCallback(() => {
    setSelectedStrategy(null)
  }, [])

  // Color legend for the gradients
  const colorLegend = [
    { gradient: gradientPairs[0], label: "High Frequency" },
    { gradient: gradientPairs[1], label: "Momentum" },
    { gradient: gradientPairs[2], label: "Arbitrage" },
    { gradient: gradientPairs[3], label: "Market Making" },
    { gradient: gradientPairs[4], label: "Sentiment" },
  ]

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Canvas
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        dpr={[1, 2]}
      >
        <BrainNetworkSceneInner 
          onSelectStrategy={handleSelectStrategy}
          globeCount={globeCount}
          version={version}
        />
      </Canvas>

      {/* Strategy Popup */}
      <StrategyPopup 
        strategy={selectedStrategy} 
        onClose={handleClosePopup} 
      />

      {/* Premium Navigation Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <nav className="flex items-center justify-between p-6 md:p-8">
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="relative w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #FFD700 0%, #FF8C00 50%, #00CED1 100%)",
              }}
            >
              <div className="absolute inset-[2px] bg-black/90 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="hidden md:block">
              <span className="text-white font-bold text-xl tracking-tight">Neural Trade</span>
              <span className="block text-xs text-cyan-400/80 -mt-0.5 tracking-widest">INTELLIGENCE NETWORK</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 pointer-events-auto">
            {["Strategies", "Analytics", "Portfolio", "Settings"].map((item) => (
              <a key={item} href="#" className="relative text-white/60 hover:text-white transition-colors text-sm group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <button className="pointer-events-auto relative px-5 py-2.5 rounded-full text-white text-sm font-medium overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, rgba(0,206,209,0.2), rgba(30,144,255,0.2))",
              border: "1px solid rgba(0,206,209,0.5)"
            }}
          >
            <span className="relative z-10">Connect Wallet</span>
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </nav>
      </div>

      {/* Color Legend */}
      <div className="absolute top-24 right-6 md:right-8 z-10 pointer-events-none">
        <div className="backdrop-blur-xl rounded-xl p-4 border border-white/10"
          style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,5,20,0.8))" }}
        >
          <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Strategy Types</p>
          <div className="space-y-2">
            {colorLegend.map(({ gradient, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${gradient.colorA}, ${gradient.colorB})` }}
                />
                <span className="text-xs text-white/70">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 pointer-events-none">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400/80 text-xs uppercase tracking-widest">Live Network</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 text-balance"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #00CED1 50%, #FFD700 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Neural Trading Intelligence
            </h1>
            <p className="text-white/50 text-sm md:text-base text-pretty leading-relaxed">
              Explore our interconnected network of AI-powered trading strategies. 
              Each node represents a sophisticated algorithm with real-time performance metrics.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 text-xs text-white/40">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-sm"
              style={{ background: "linear-gradient(135deg, rgba(0,255,127,0.1), rgba(0,206,209,0.1))", border: "1px solid rgba(0,255,127,0.2)" }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400">{globeCount} Active Strategies</span>
            </div>
            <span className="text-white/30">Version {version}.0</span>
          </div>
        </div>
      </div>

      {/* Controls Hint */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="flex items-center gap-4 px-5 py-2.5 backdrop-blur-xl rounded-full"
          style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,5,20,0.6))", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <span className="text-white/50 text-xs">Drag to rotate</span>
          <span className="w-1 h-1 rounded-full bg-cyan-400/50" />
          <span className="text-white/50 text-xs">Scroll to zoom</span>
          <span className="w-1 h-1 rounded-full bg-cyan-400/50" />
          <span className="text-white/50 text-xs">Click nodes to explore</span>
        </div>
      </div>

      {/* Decorative corner elements - Iron Man style */}
      <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
          <path d="M0 0 L30 0 L30 5 L5 5 L5 30 L0 30 Z" fill="url(#corner-gradient)" />
          <defs>
            <linearGradient id="corner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00CED1" />
              <stop offset="100%" stopColor="#1E90FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none rotate-90">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
          <path d="M0 0 L30 0 L30 5 L5 5 L5 30 L0 30 Z" fill="url(#corner-gradient-2)" />
          <defs>
            <linearGradient id="corner-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FF8C00" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none -rotate-90">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
          <path d="M0 0 L30 0 L30 5 L5 5 L5 30 L0 30 Z" fill="url(#corner-gradient-3)" />
          <defs>
            <linearGradient id="corner-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9B30FF" />
              <stop offset="100%" stopColor="#FF1744" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none rotate-180">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
          <path d="M0 0 L30 0 L30 5 L5 5 L5 30 L0 30 Z" fill="url(#corner-gradient-4)" />
          <defs>
            <linearGradient id="corner-gradient-4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FF7F" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
