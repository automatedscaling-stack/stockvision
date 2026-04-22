"use client"

import { useEffect, useMemo, useRef } from "react"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  Clock3,
  Layers3,
  Shield,
  Sparkles,
  X,
  Zap,
} from "lucide-react"
import type { TradingStrategy } from "@/lib/trading-strategies"
import { gradientPairs } from "./brain-globe"

interface StrategyPopupProps {
  strategy: TradingStrategy | null
  onClose: () => void
}

function buildStrategyIntel(strategy: TradingStrategy) {
  const riskTone = {
    Low: "Capital-preserving, smooth, and institutionally disciplined.",
    Medium: "Balanced for directional conviction without surrendering composure.",
    High: "Aggressive when the tape confirms, with premium paid for speed and selectivity.",
    Extreme: "Built for explosive opportunity capture where latency and nerve both matter.",
  }[strategy.riskLevel] ?? "Engineered for adaptive risk taking."

  const horizonTone = strategy.timeframe.includes("minute") || strategy.timeframe.includes("Milliseconds") || strategy.timeframe.includes("Seconds")
    ? "This globe behaves like a tactical execution pod, breathing with every acceleration in liquidity and sentiment."
    : strategy.timeframe.includes("day") || strategy.timeframe.includes("Daily")
      ? "This globe trades like a high-conviction desk, allowing structure, flow, and confirmation to stack before deployment."
      : "This globe behaves like a strategic capital allocator, waiting for cleaner regime alignment before it commits size."

  const keySignals = strategy.indicators.slice(0, 4)

  return {
    riskTone,
    horizonTone,
    deployment: `When ${keySignals.join(", ")} compress into alignment, this node shifts from observation into active orchestration.`,
    idealRegime: `Best used when ${strategy.description.toLowerCase()} and price structure stop fighting the thesis. The engine then expands from signal detection into staged execution and managed follow-through.`,
    premiumBehavior: `Inside the network, ${strategy.name} acts like a luxury autonomous desk: scanning continuously, refining entries, and only surfacing when the edge is strong enough to justify attention.`,
    playbook: [
      `Stage one is reconnaissance, where ${keySignals[0] ?? "market structure"} sets the initial bias and filters out weak context.`,
      `Stage two is confirmation, where the rest of the stack pressure-tests the move so the globe does not overreact to noise.`,
      `Stage three is extraction, where the strategy leans into ${strategy.expectedReturn.toLowerCase()} while adapting exits to the live regime.`,
    ],
  }
}

export function StrategyPopup({ strategy, onClose }: StrategyPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) onClose()
    }

    if (!strategy) return
    window.addEventListener("keydown", handleEscape)
    window.addEventListener("mousedown", handleClickOutside)
    return () => {
      window.removeEventListener("keydown", handleEscape)
      window.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose, strategy])

  const intel = useMemo(() => (strategy ? buildStrategyIntel(strategy) : null), [strategy])
  if (!strategy || !intel) return null

  const gradient = gradientPairs[Math.abs(strategy.name.length) % gradientPairs.length]
  const riskColor = {
    Low: "#39E58C",
    Medium: "#FFD44D",
    High: "#FF9F1A",
    Extreme: "#2EA7FF",
  }[strategy.riskLevel] ?? "#FFD44D"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 p-4 backdrop-blur-md md:p-8">
      <div
        ref={popupRef}
        className="relative max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-[32px] border shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
        style={{
          background: "linear-gradient(135deg, rgba(1,4,8,0.98), rgba(7,12,18,0.96))",
          borderColor: `${gradient.colorB}45`,
        }}
      >
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${gradient.colorA}, ${gradient.colorB})` }} />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:scale-105 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_360px]">
            <div>
              <div className="mb-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/46">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Premium globe strategy</span>
                <span>{strategy.timeframe}</span>
              </div>

              <h2
                className="text-3xl font-semibold leading-tight text-white md:text-5xl"
                style={{
                  background: `linear-gradient(135deg, #ffffff 0%, ${gradient.colorA} 45%, ${gradient.colorB} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {strategy.name}
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/68 md:text-base">{strategy.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { icon: AlertTriangle, label: "Risk level", value: strategy.riskLevel, color: riskColor },
                  { icon: Clock3, label: "Timeframe", value: strategy.timeframe, color: "#49E1FF" },
                  { icon: Activity, label: "Return target", value: strategy.expectedReturn, color: "#B9FF4F" },
                  { icon: Brain, label: "Indicators", value: `${strategy.indicators.length} stacked`, color: gradient.colorA },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/42">
                      <Icon className="h-4 w-4" style={{ color }} />
                      <span>{label}</span>
                    </div>
                    <div className="text-base font-semibold" style={{ color }}>{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <Sparkles className="h-4 w-4" style={{ color: gradient.colorB }} />
                    Strategic character
                  </div>
                  <p className="text-sm leading-7 text-white/68">{intel.riskTone}</p>
                  <p className="mt-3 text-sm leading-7 text-white/68">{intel.horizonTone}</p>
                  <p className="mt-3 text-sm leading-7 text-white/68">{intel.premiumBehavior}</p>
                </section>

                <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <Zap className="h-4 w-4" style={{ color: gradient.colorA }} />
                    Deployment logic
                  </div>
                  <p className="text-sm leading-7 text-white/68">{intel.deployment}</p>
                  <p className="mt-3 text-sm leading-7 text-white/68">{intel.idealRegime}</p>
                </section>
              </div>

              <section className="mt-6 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <Layers3 className="h-4 w-4" style={{ color: gradient.colorB }} />
                  Technical signal stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {strategy.indicators.map((indicator, index) => {
                    const pair = gradientPairs[index % gradientPairs.length]
                    return (
                      <span
                        key={indicator}
                        className="rounded-full border px-3 py-2 text-xs font-medium"
                        style={{
                          background: `linear-gradient(135deg, ${pair.colorA}16, ${pair.colorB}16)`,
                          borderColor: `${pair.colorB}40`,
                          color: pair.colorB,
                        }}
                      >
                        {indicator}
                      </span>
                    )
                  })}
                </div>
              </section>

              <section className="mt-6 rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <BarChart3 className="h-4 w-4" style={{ color: gradient.colorA }} />
                  Full premium brief
                </div>
                <p className="text-sm leading-7 text-white/70">{strategy.details}</p>
              </section>
            </div>

            <aside className="space-y-4">
              <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <Shield className="h-4 w-4" style={{ color: riskColor }} />
                  Globe playbook
                </div>
                <div className="space-y-3">
                  {intel.playbook.map((step, index) => (
                    <div key={step} className="rounded-2xl border border-white/8 bg-black/24 p-4">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">Stage {index + 1}</div>
                      <p className="mt-2 text-sm leading-7 text-white/70">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                <div className="text-[11px] uppercase tracking-[0.24em] text-white/42">Operator note</div>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  In the five-version globe UI, this node is intentionally theatrical. It is supposed to feel like a living premium desk,
                  not a flat tooltip. The click state is the strategy reveal, the lines imply capital flow, and the color lane communicates
                  the temperament of the tactic before you even read a word.
                </p>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
