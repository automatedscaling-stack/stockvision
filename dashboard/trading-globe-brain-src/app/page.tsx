"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { MarketCommandCenter } from "@/components/brain-network/market-command-center"
import { VersionSelector } from "@/components/brain-network/version-selector"

const BrainNetworkScene = dynamic(
  () => import("@/components/brain-network/brain-network-scene").then((mod) => mod.BrainNetworkScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div
              className="h-20 w-20 animate-spin rounded-full"
              style={{
                background: "conic-gradient(from 0deg, transparent, #00CED1, #FFD700, #FF8C00, transparent)",
                maskImage: "radial-gradient(transparent 60%, black 61%)",
                WebkitMaskImage: "radial-gradient(transparent 60%, black 61%)",
              }}
            />
            <div className="absolute inset-2 rounded-full bg-black" />
          </div>
          <div className="text-center">
            <p className="mb-1 text-sm font-medium text-white/80">Initializing Neural Network</p>
            <p className="text-xs text-white/40">Loading trading intelligence modules...</p>
          </div>
        </div>
      </div>
    ),
  }
)

const versionGlobeCounts: Record<number, number> = {
  1: 75,
  2: 105,
  3: 60,
  4: 135,
  5: 90,
}

export default function Home() {
  const [currentVersion, setCurrentVersion] = useState(4)

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">
      <BrainNetworkScene version={currentVersion} globeCount={versionGlobeCounts[currentVersion]} />
      <VersionSelector currentVersion={currentVersion} onVersionChange={setCurrentVersion} />
      <MarketCommandCenter />
    </main>
  )
}
