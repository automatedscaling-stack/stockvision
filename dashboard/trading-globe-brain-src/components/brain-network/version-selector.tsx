"use client"

import { cn } from "@/lib/utils"
import { gradientPairs } from "./brain-globe"

interface VersionSelectorProps {
  currentVersion: number
  onVersionChange: (version: number) => void
}

const versions = [
  { id: 1, name: "Quantum", description: "75 nodes - Dense cluster", gradientIndex: 2 },
  { id: 2, name: "Nebula", description: "105 nodes - Cosmic spread", gradientIndex: 0 },
  { id: 3, name: "Synapse", description: "60 nodes - Neural focus", gradientIndex: 1 },
  { id: 4, name: "Galaxy", description: "135 nodes - Maximum dispersion", gradientIndex: 3 },
  { id: 5, name: "Singularity", description: "90 nodes - Balanced equilibrium", gradientIndex: 4 },
]

export function VersionSelector({ currentVersion, onVersionChange }: VersionSelectorProps) {
  return (
    <div className="absolute top-24 left-6 md:left-8 z-20">
      <div className="backdrop-blur-xl border rounded-2xl p-4 w-64"
        style={{
          background: "linear-gradient(135deg, rgba(0,5,20,0.9), rgba(0,0,0,0.9))",
          borderColor: "rgba(255,255,255,0.1)"
        }}
      >
        <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Network Versions
        </h3>
        <div className="space-y-2">
          {versions.map((version) => {
            const gradient = gradientPairs[version.gradientIndex]
            const isActive = currentVersion === version.id
            
            return (
              <button
                key={version.id}
                onClick={() => onVersionChange(version.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                  isActive ? "scale-[1.02]" : "hover:scale-[1.01]"
                )}
                style={{
                  background: isActive 
                    ? `linear-gradient(135deg, ${gradient.colorA}20, ${gradient.colorB}20)`
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? gradient.colorA + "50" : "transparent"}`,
                  boxShadow: isActive ? `0 4px 20px ${gradient.colorA}20` : "none"
                }}
              >
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-black font-bold text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${gradient.colorA}, ${gradient.colorB})`,
                    boxShadow: `0 2px 10px ${gradient.colorA}40`
                  }}
                >
                  {version.id}
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-sm" style={{ color: isActive ? gradient.colorB : "rgba(255,255,255,0.8)" }}>
                    {version.name}
                  </p>
                  <p className="text-white/40 text-xs">{version.description}</p>
                </div>
                {isActive && (
                  <div className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: gradient.colorA }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
