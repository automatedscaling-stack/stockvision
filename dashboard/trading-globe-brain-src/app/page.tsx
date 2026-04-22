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
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <div
              className="h-24 w-24 animate-spin rounded-full"
              style={{
                background: "conic-gradient(from 0deg, transparent, #FFD44D, #FF8A1E, #2EA7FF, #49E1FF, transparent)",
                maskImage: "radial-gradient(transparent 60%, black 61%)",
                WebkitMaskImage: "radial-gradient(transparent 60%, black 61%)",
              }}
            />
            <div className="absolute inset-3 rounded-full bg-black" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/82">Spinning up the trading brain</p>
            <p className="mt-1 text-xs text-white/42">Loading premium globe versions and interaction fields...</p>
          </div>
        </div>
      </div>
    ),
  }
)

export default function Home() {
  const [currentVersion, setCurrentVersion] = useState(2)

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">
      <BrainNetworkScene version={currentVersion} />
      <VersionSelector currentVersion={currentVersion} onVersionChange={setCurrentVersion} />
      <MarketCommandCenter />
    </main>
  )
}
