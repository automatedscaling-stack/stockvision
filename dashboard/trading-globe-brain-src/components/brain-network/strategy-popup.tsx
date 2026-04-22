"use client"

import { useEffect, useRef } from "react"
import { X, TrendingUp, Clock, AlertTriangle, BarChart3, Zap } from "lucide-react"
import type { TradingStrategy } from "@/lib/trading-strategies"
import { gradientPairs } from "./brain-globe"

interface StrategyPopupProps {
  strategy: TradingStrategy | null
  onClose: () => void
}

export function StrategyPopup({ strategy, onClose }: StrategyPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (strategy) {
      window.addEventListener("keydown", handleEscape)
      window.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      window.removeEventListener("keydown", handleEscape)
      window.removeEventListener("mousedown", handleClickOutside)
    }
  }, [strategy, onClose])

  if (!strategy) return null

  const riskColors = {
    Low: { bg: "rgba(0,255,127,0.15)", border: "rgba(0,255,127,0.4)", text: "#00FF7F", gradient: gradientPairs[1] },
    Medium: { bg: "rgba(255,215,0,0.15)", border: "rgba(255,215,0,0.4)", text: "#FFD700", gradient: gradientPairs[0] },
    High: { bg: "rgba(255,140,0,0.15)", border: "rgba(255,140,0,0.4)", text: "#FF8C00", gradient: gradientPairs[0] },
    Extreme: { bg: "rgba(255,23,68,0.15)", border: "rgba(255,23,68,0.4)", text: "#FF1744", gradient: gradientPairs[4] },
  }

  const risk = riskColors[strategy.riskLevel as keyof typeof riskColors] || riskColors.Medium

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Popup */}
      <div
        ref={popupRef}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(0,5,20,0.98) 0%, rgba(0,0,0,0.98) 100%)",
          borderColor: `${risk.gradient.colorA}40`,
          boxShadow: `0 0 60px ${risk.gradient.colorA}20, 0 0 120px ${risk.gradient.colorB}10, inset 0 1px 0 rgba(255,255,255,0.05)`
        }}
      >
        {/* Header gradient line */}
        <div className="h-1 w-full rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, ${risk.gradient.colorA}, ${risk.gradient.colorB})` }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ 
            background: "rgba(255,255,255,0.05)", 
            border: "1px solid rgba(255,255,255,0.1)" 
          }}
        >
          <X className="w-5 h-5 text-white/60" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Title section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full animate-pulse"
                style={{ background: `linear-gradient(135deg, ${risk.gradient.colorA}, ${risk.gradient.colorB})` }}
              />
              <span className="text-xs uppercase tracking-widest" style={{ color: risk.gradient.colorA }}>
                Strategy Module
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3"
              style={{
                background: `linear-gradient(135deg, #ffffff 0%, ${risk.gradient.colorA} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {strategy.name}
            </h2>
            <p className="text-white/60 text-sm md:text-base leading-relaxed">{strategy.description}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { icon: AlertTriangle, label: "Risk Level", value: strategy.riskLevel, color: risk.text },
              { icon: Clock, label: "Timeframe", value: strategy.timeframe, color: "#00CED1" },
              { icon: TrendingUp, label: "Expected Return", value: strategy.expectedReturn, color: "#00FF7F" },
              { icon: BarChart3, label: "Indicators", value: `${strategy.indicators.length} Active`, color: "#FFD700" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="rounded-xl p-3 md:p-4"
                style={{ 
                  background: `${color}10`, 
                  border: `1px solid ${color}30` 
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color }} />
                  <span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
                </div>
                <p className="font-semibold text-sm md:text-base" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Indicators */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" style={{ color: risk.gradient.colorA }} />
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Technical Indicators</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {strategy.indicators.map((indicator, i) => (
                <span
                  key={indicator}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: `linear-gradient(135deg, ${gradientPairs[i % 5].colorA}15, ${gradientPairs[i % 5].colorB}15)`,
                    border: `1px solid ${gradientPairs[i % 5].colorA}40`,
                    color: gradientPairs[i % 5].colorB
                  }}
                >
                  {indicator}
                </span>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full" style={{ background: `linear-gradient(180deg, ${risk.gradient.colorA}, ${risk.gradient.colorB})` }} />
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Strategy Details</h3>
            </div>
            <div className="rounded-xl p-4 md:p-5"
              style={{ 
                background: "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <p className="text-white/70 text-sm md:text-base leading-relaxed">{strategy.details}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row gap-3">
            <button
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${risk.gradient.colorA}, ${risk.gradient.colorB})`,
                color: "#000",
                boxShadow: `0 4px 20px ${risk.gradient.colorA}40`
              }}
            >
              Activate Strategy
            </button>
            <button
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-white/10"
              style={{
                background: "transparent",
                border: `1px solid ${risk.gradient.colorA}50`,
                color: risk.gradient.colorA
              }}
            >
              View Performance
            </button>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="h-px w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${risk.gradient.colorA}30, transparent)` }}
        />
      </div>
    </div>
  )
}
