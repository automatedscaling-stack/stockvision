"use client"

import { cn } from "@/lib/utils"
import { networkVersions } from "@/lib/trading-strategies"
import { gradientPairs } from "./brain-globe"

interface VersionSelectorProps {
  currentVersion: number
  onVersionChange: (version: number) => void
}

export function VersionSelector({ currentVersion, onVersionChange }: VersionSelectorProps) {
  return (
    <div className="absolute right-4 top-24 z-20 md:right-8 md:top-28">
      <div
        className="w-[290px] max-w-[82vw] rounded-[28px] border p-3 shadow-2xl backdrop-blur-2xl md:p-4"
        style={{
          background: "linear-gradient(135deg, rgba(0,0,0,0.72), rgba(4,10,18,0.88))",
          borderColor: "rgba(255,255,255,0.12)",
        }}
      >
        <div className="mb-3 flex items-center gap-2 px-1">
          <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(73,225,255,0.9)]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/56">Five standalone versions</span>
        </div>

        <div className="space-y-2">
          {networkVersions.map((version) => {
            const gradient = gradientPairs[version.gradientIndex]
            const active = currentVersion === version.id

            return (
              <button
                key={version.id}
                onClick={() => onVersionChange(version.id)}
                className={cn(
                  "w-full rounded-2xl border px-3 py-3 text-left transition duration-300",
                  active ? "scale-[1.01]" : "hover:scale-[1.01]"
                )}
                style={{
                  background: active
                    ? `linear-gradient(135deg, ${gradient.colorA}24, ${gradient.colorB}18)`
                    : "rgba(255,255,255,0.03)",
                  borderColor: active ? `${gradient.colorB}55` : "rgba(255,255,255,0.06)",
                  boxShadow: active ? `0 18px 46px ${gradient.colorA}1f` : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-black"
                    style={{
                      background: `linear-gradient(135deg, ${gradient.colorA}, ${gradient.colorB})`,
                    }}
                  >
                    {version.id}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-white">{version.name}</p>
                      {active ? <span className="h-2 w-2 rounded-full" style={{ background: gradient.colorB }} /> : null}
                    </div>
                    <p className="mt-1 text-xs text-white/48">{version.globeCount}+ globes • {version.shortLabel}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-white/62">{version.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
