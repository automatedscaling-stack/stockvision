"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei"
import * as THREE from "three"
import { BrainGlobe, gradientPairs } from "./brain-globe"
import { NeuralConnections } from "./neural-connections"
import { SpaceParticles } from "./space-particles"
import { StrategyPopup } from "./strategy-popup"
import {
  getNetworkVersion,
  networkVersions,
  tradingStrategies,
  generateGlobePositions,
  generateGradientIndices,
  type TradingStrategy,
} from "@/lib/trading-strategies"

function CameraController({ version }: { version: number }) {
  const { camera } = useThree()
  const pointerRef = useRef(new THREE.Vector2())
  const zoomBiasRef = useRef(0)
  const desired = useRef(new THREE.Vector3())
  const focus = useRef(new THREE.Vector3())
  const meta = getNetworkVersion(version)

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointerRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }

    const onWheel = (event: WheelEvent) => {
      zoomBiasRef.current = THREE.MathUtils.clamp(zoomBiasRef.current + event.deltaY * 0.03, -100, 120)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("wheel", onWheel, { passive: true })

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("wheel", onWheel)
    }
  }, [])

  useFrame(() => {
    const targetZ = meta.cameraDistance + zoomBiasRef.current
    desired.current.set(pointerRef.current.x * 26, pointerRef.current.y * 18 + meta.verticalLift, targetZ)
    camera.position.lerp(desired.current, 0.04)

    const targetFocus = new THREE.Vector3(pointerRef.current.x * 12, pointerRef.current.y * 9, 0)
    focus.current.lerp(targetFocus, 0.05)
    camera.lookAt(focus.current)
  })

  return null
}

function AmbientPulse() {
  const pulseLight = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    if (!pulseLight.current) return
    pulseLight.current.intensity = 0.9 + Math.sin(state.clock.elapsedTime * 0.55) * 0.22
  })

  return <pointLight ref={pulseLight} position={[0, 0, 0]} intensity={1} color="#49E1FF" distance={240} />
}

function BackgroundMotionLayer() {
  const assetBase = useMemo(() => {
    if (typeof window === "undefined") return "./"
    return window.location.pathname.endsWith("/") ? window.location.pathname : `${window.location.pathname}/`
  }, [])

  const backgroundVideo = `${assetBase}trading-background.mp4`
  const backgroundFallback = `${assetBase}trading-background.gif`

  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={backgroundFallback}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "radial-gradient(circle at 20% 18%, rgba(255,212,77,0.22), transparent 24%)",
              "radial-gradient(circle at 78% 28%, rgba(46,167,255,0.24), transparent 26%)",
              "radial-gradient(circle at 64% 74%, rgba(57,229,140,0.18), transparent 22%)",
              "linear-gradient(180deg, rgba(0,0,0,0.16), rgba(0,0,0,0.78))",
            ].join(", "),
            backgroundSize: "cover, cover, cover, cover",
            backgroundPosition: "center, center, center, center",
            filter: "saturate(1.15) contrast(1.08)",
            animation: "brainBackdropDrift 28s linear infinite",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.18)_55%,rgba(0,0,0,0.84)_100%)]" />
        <div className="brain-grid absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88),transparent_18%,transparent_82%,rgba(0,0,0,0.82))]" />
      </div>
      <style jsx global>{`
        @keyframes brainBackdropDrift {
          0% { transform: scale(1) translate3d(0, 0, 0); }
          50% { transform: scale(1.06) translate3d(-2%, 1.5%, 0); }
          100% { transform: scale(1) translate3d(0, 0, 0); }
        }
        .brain-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 68px 68px;
          mask-image: radial-gradient(circle at center, rgba(0,0,0,0.9), transparent 78%);
        }
      `}</style>
    </>
  )
}

interface BrainNetworkSceneInnerProps {
  onSelectStrategy: (strategy: TradingStrategy) => void
  version: number
}

function BrainNetworkSceneInner({ onSelectStrategy, version }: BrainNetworkSceneInnerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { size, pointer } = useThree()
  const meta = getNetworkVersion(version)

  const effectiveCount = useMemo(() => {
    if (size.width < 768) return Math.max(84, Math.round(meta.globeCount * 0.44))
    if (size.width < 1180) return Math.round(meta.globeCount * 0.7)
    return meta.globeCount
  }, [meta.globeCount, size.width])

  const positions = useMemo(() => generateGlobePositions(effectiveCount, meta.spread, version), [effectiveCount, meta.spread, version])
  const gradientIndices = useMemo(() => generateGradientIndices(effectiveCount), [effectiveCount])

  const globeData = useMemo(() => {
    return positions.map((position, index) => ({
      position,
      gradientIndex: gradientIndices[index],
      size: meta.sizeRange[0] + Math.random() * (meta.sizeRange[1] - meta.sizeRange[0]),
      strategy: tradingStrategies[index % tradingStrategies.length],
    }))
  }, [gradientIndices, meta.sizeRange, positions])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += meta.rotationDrift
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, pointer.x * 10, 0.035)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, pointer.y * 7, 0.04)
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.025
  })

  return (
    <>
      <fog attach="fog" args={["#040404", meta.cameraDistance * 0.8, meta.cameraDistance + 340]} />
      <ambientLight intensity={0.22} />
      <AmbientPulse />
      <pointLight position={[140, 90, 120]} intensity={1.3} color="#FFD44D" distance={420} />
      <pointLight position={[-150, -70, -120]} intensity={1.1} color="#2EA7FF" distance={420} />
      <pointLight position={[0, 110, -180]} intensity={0.7} color="#39E58C" distance={420} />
      <PerspectiveCamera makeDefault position={[0, meta.verticalLift, meta.cameraDistance]} fov={58} />
      <CameraController version={version} />
      <OrbitControls
        enablePan={false}
        enableZoom
        enableRotate
        rotateSpeed={0.42}
        zoomSpeed={0.85}
        dampingFactor={0.06}
        enableDamping
        minDistance={meta.cameraDistance - 110}
        maxDistance={meta.cameraDistance + 180}
        minPolarAngle={Math.PI * 0.24}
        maxPolarAngle={Math.PI * 0.78}
      />
      <Stars radius={540} depth={180} count={2600} factor={4.5} saturation={0.9} fade speed={0.45} />
      <SpaceParticles />

      <group ref={groupRef}>
        <NeuralConnections positions={positions} gradientIndices={gradientIndices} neighborRadius={meta.neighborRadius} />
        {globeData.map((globe, index) => (
          <Float
            key={`${version}-${index}`}
            speed={0.5 + (index % 7) * 0.04}
            rotationIntensity={0.09}
            floatIntensity={0.4}
            floatingRange={[-0.7, 0.7]}
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
}

export function BrainNetworkScene({ version = 1 }: BrainNetworkSceneProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategy | null>(null)
  const meta = getNetworkVersion(version)

  const handleSelectStrategy = useCallback((strategy: TradingStrategy) => {
    setSelectedStrategy(strategy)
  }, [])

  const handleClosePopup = useCallback(() => {
    setSelectedStrategy(null)
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <BackgroundMotionLayer />

      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.18,
        }}
        dpr={[1, 1.8]}
      >
        <BrainNetworkSceneInner onSelectStrategy={handleSelectStrategy} version={version} />
      </Canvas>

      <StrategyPopup strategy={selectedStrategy} onClose={handleClosePopup} />

      <div className="pointer-events-none absolute inset-0 z-10">
        <nav className="flex items-start justify-between gap-4 p-4 md:p-8">
          <div className="pointer-events-auto flex items-center gap-3">
            <div
              className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10"
              style={{ background: "linear-gradient(135deg, #FFD44D, #FF8A1E 38%, #2EA7FF 68%, #39E58C 100%)" }}
            >
              <div className="absolute inset-[2px] rounded-[14px] bg-black/90" />
              <div className="relative z-10 h-5 w-5 rounded-full border border-cyan-300/60 bg-cyan-300/20 shadow-[0_0_22px_rgba(73,225,255,0.45)]" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">Trading Brain</p>
              <h1 className="text-lg font-semibold text-white md:text-xl">Obsidian Globe Network</h1>
            </div>
          </div>

          <>
            <div className="pointer-events-auto hidden items-center gap-6 rounded-full border border-white/10 bg-black/35 px-5 py-3 backdrop-blur-2xl md:flex">
              {[
                "Strategies",
                "Structures",
                "Intelligence",
                "Execution",
              ].map((item) => (
                <a key={item} href="#" className="text-sm text-white/58 transition hover:text-white">
                  {item}
                </a>
              ))}
            </div>
            <div className="pointer-events-auto rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/56 backdrop-blur-2xl md:hidden">
              Strategy · Intel · Execute
            </div>
          </>

          <div className="pointer-events-auto rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-cyan-100 backdrop-blur-2xl md:px-5 md:py-3">
            Mouse gravity active
          </div>
        </nav>

        <div className="absolute left-4 top-24 max-w-[88vw] md:left-8 md:top-28 md:max-w-2xl">
          <div className="rounded-[28px] border border-white/10 bg-black/36 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl md:p-7">
            <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/48">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{meta.shortLabel}</span>
              <span>{meta.globeCount}+ premium globes</span>
              <span>interconnected luxury lattice</span>
            </div>
            <h2 className="max-w-4xl text-3xl font-semibold leading-tight text-white md:text-6xl">
              {meta.hero}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68 md:text-base">
              {meta.description}. Each globe behaves like its own bespoke trading desk, every connection glows through yellow, orange,
              blue, aqua, and green lanes, and the whole field leans into the mouse with a premium gravitational drift.
            </p>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1.25fr)_minmax(320px,420px)]">
            <div className="rounded-[28px] border border-white/10 bg-black/34 p-5 backdrop-blur-2xl md:p-6">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {gradientPairs.map((gradient) => (
                  <div key={gradient.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-10 rounded-full"
                      style={{ background: `linear-gradient(90deg, ${gradient.colorA}, ${gradient.colorB})` }}
                    />
                    <span className="text-[11px] uppercase tracking-[0.2em] text-white/52">{gradient.name}</span>
                  </div>
                ))}
              </div>
              <div className="grid gap-3 text-sm text-white/68 md:grid-cols-3">
                <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/42">Navigation</div>
                  <div className="mt-2 font-medium text-white">Drag to orbit, wheel to dive through the brain field.</div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/42">Interaction</div>
                  <div className="mt-2 font-medium text-white">Click any large globe to open its bespoke trading playbook.</div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/42">Responsive</div>
                  <div className="mt-2 font-medium text-white">Controls collapse below md and the graph density scales down cleanly.</div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/38 p-5 backdrop-blur-2xl md:p-6">
              <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-white/45">Five UI variants</div>
              <div className="space-y-3">
                {networkVersions.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                    <div>
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-xs text-white/46">{item.globeCount}+ globes • {item.shortLabel}</div>
                    </div>
                    <div
                      className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]"
                      style={{
                        color: version === item.id ? gradientPairs[item.gradientIndex].colorB : "rgba(255,255,255,0.56)",
                        background: version === item.id ? `${gradientPairs[item.gradientIndex].colorA}22` : "rgba(255,255,255,0.04)",
                      }}
                    >
                      v{item.id}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
