"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  Brain,
  ChevronRight,
  Loader2,
  LogIn,
  Newspaper,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type SearchResult = { ticker: string; name: string }
type Recommendation = { ticker: string; name?: string; company_name?: string; adj_confidence?: number; confidence?: number; horizon?: string }
type NewsArticle = { title: string; source?: string; published?: string; link?: string; description?: string }
type ArrowState = { active?: boolean; score?: number; reasons?: string[] }
type StockResponse = {
  ticker: string
  name: string
  description?: string
  sector?: string
  industry?: string
  latest_close?: number
  change?: number
  change_pct?: number
  candles?: Array<{ date: string; close: number }>
  arrow_states?: Record<string, ArrowState>
}
type PredictionsResponse = {
  signals?: Array<{ buy_date: string; horizon: string; confidence: number; actual_return?: number | null }>
  summary?: {
    total_trades?: number
    win_rate?: number
    avg_confidence?: number
    avg_return?: number
    summary_text?: string
  }
}

type AuthState = "checking" | "ready" | "login_required"

function currency(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return "--"
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value)
}

function percent(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return "--"
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
}

function compactNumber(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return "--"
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value)
}

function cleanSummary(text?: string) {
  if (!text) return ""
  return text
    .replace(/<br\s*\/?/gi, "\n")
    .replace(/#+\s?/g, "")
    .replace(/\*\*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

async function getJson<T>(url: string): Promise<{ status: number; data: T | null }> {
  const response = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    headers: { Accept: "application/json" },
  })

  if (response.status === 204) return { status: response.status, data: null }

  try {
    const data = (await response.json()) as T
    return { status: response.status, data }
  } catch {
    return { status: response.status, data: null }
  }
}

function ArrowBadge({ label, state }: { label: string; state?: ArrowState }) {
  const active = Boolean(state?.active)
  const score = state?.score ?? 0
  return (
    <div
      className="rounded-2xl border px-3 py-3"
      style={{
        background: active ? "rgba(34,197,94,0.12)" : "rgba(15,23,42,0.72)",
        borderColor: active ? "rgba(34,197,94,0.35)" : "rgba(148,163,184,0.16)",
      }}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">{label}</span>
        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${active ? "text-emerald-300" : "text-white/45"}`}>{active ? "LIVE" : "IDLE"}</span>
      </div>
      <div className="text-lg font-semibold text-white">{Math.round(score * 100)}%</div>
      <div className="mt-1 line-clamp-2 text-[11px] text-white/45">{state?.reasons?.[0] ?? "Awaiting qualifying setup"}</div>
    </div>
  )
}

export function MarketCommandCenter() {
  const [authState, setAuthState] = useState<AuthState>("checking")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedTicker, setSelectedTicker] = useState("NVDA")
  const [stock, setStock] = useState<StockResponse | null>(null)
  const [predictions, setPredictions] = useState<PredictionsResponse | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loadingTicker, setLoadingTicker] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { status, data } = await getJson<{ logged_in?: boolean }>("/api/auth/status")
        if (cancelled) return
        if (status === 200 && data?.logged_in) {
          setAuthState("ready")
        } else {
          setAuthState("login_required")
        }
      } catch {
        if (!cancelled) setAuthState("login_required")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (authState !== "ready") return
    let cancelled = false
    ;(async () => {
      const [recRes, newsRes] = await Promise.all([
        getJson<{ recommendations?: Recommendation[] }>("/api/recommendations"),
        getJson<{ articles?: NewsArticle[] }>("/api/news"),
      ])

      if (cancelled) return

      if (recRes.status === 200 && recRes.data?.recommendations?.length) {
        setRecommendations(recRes.data.recommendations.slice(0, 5))
        setSelectedTicker((current) => current || recRes.data!.recommendations![0].ticker)
      }
      if (newsRes.status === 200 && newsRes.data?.articles) {
        setNews(newsRes.data.articles.slice(0, 6))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authState])

  useEffect(() => {
    if (authState !== "ready") return
    const trimmed = searchTerm.trim()
    if (!trimmed) {
      setSearchResults([])
      return
    }

    const timeout = window.setTimeout(async () => {
      const { status, data } = await getJson<{ results?: SearchResult[] }>(`/api/search?q=${encodeURIComponent(trimmed)}`)
      if (status === 200 && data?.results) {
        setSearchResults(data.results.slice(0, 8))
      }
    }, 180)

    return () => window.clearTimeout(timeout)
  }, [searchTerm, authState])

  useEffect(() => {
    if (authState !== "ready" || !selectedTicker) return
    let cancelled = false
    setLoadingTicker(true)

    ;(async () => {
      const [stockRes, predictionRes, newsRes] = await Promise.all([
        getJson<StockResponse>(`/api/stock/${encodeURIComponent(selectedTicker)}?period=1y`),
        getJson<PredictionsResponse>(`/api/predictions/${encodeURIComponent(selectedTicker)}`),
        getJson<{ articles?: NewsArticle[] }>(`/api/news?ticker=${encodeURIComponent(selectedTicker)}`),
      ])

      if (cancelled) return

      if (stockRes.status === 200 && stockRes.data) setStock(stockRes.data)
      if (predictionRes.status === 200 && predictionRes.data) setPredictions(predictionRes.data)
      if (newsRes.status === 200 && newsRes.data?.articles) setNews(newsRes.data.articles.slice(0, 6))
      setLoadingTicker(false)
    })().catch(() => {
      if (!cancelled) setLoadingTicker(false)
    })

    return () => {
      cancelled = true
    }
  }, [selectedTicker, authState])

  const chartData = useMemo(
    () =>
      (stock?.candles ?? []).slice(-60).map((candle) => ({
        date: candle.date?.slice(5),
        close: Number(candle.close ?? 0),
      })),
    [stock?.candles]
  )

  const summary = cleanSummary(predictions?.summary?.summary_text)
  const arrowStates = stock?.arrow_states ?? {}

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-4 md:inset-x-6 md:top-6">
        <div className="pointer-events-auto max-w-sm rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4 shadow-2xl shadow-cyan-950/25 backdrop-blur-2xl md:px-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-300/80">Standalone UI</div>
              <h1 className="text-lg font-semibold text-white">Trading Globe Brain</h1>
            </div>
          </div>
          <p className="text-sm leading-6 text-white/65">
            Full Desktop globe UI, now isolated on its own branch and wired to the stock predictor API as an additional experience.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1">3D neural scene</span>
            <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1">API-backed HUD</span>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1">Zero impact on current UI</span>
          </div>
        </div>
      </div>

      <div className="pointer-events-auto absolute right-4 top-24 bottom-4 flex w-[min(460px,calc(100vw-2rem))] flex-col gap-4 md:right-6 md:top-6 md:w-[430px]">
        <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl md:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">Command center</div>
              <div className="mt-1 flex items-center gap-2 text-white">
                <Radar className="h-4 w-4 text-cyan-300" />
                <span className="font-semibold">Market neural overlay</span>
              </div>
            </div>
            <div
              className="rounded-full border px-3 py-1 text-[11px] font-semibold"
              style={{
                borderColor: authState === "ready" ? "rgba(16,185,129,0.28)" : "rgba(245,158,11,0.28)",
                background: authState === "ready" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                color: authState === "ready" ? "#86efac" : "#fcd34d",
              }}
            >
              {authState === "ready" ? "API linked" : authState === "checking" ? "Checking access" : "Login required"}
            </div>
          </div>

          {authState !== "ready" ? (
            <div className="rounded-3xl border border-amber-400/20 bg-amber-400/8 p-4 text-sm text-white/75">
              <div className="mb-2 flex items-center gap-2 text-amber-300">
                <ShieldCheck className="h-4 w-4" />
                <span className="font-semibold">Session required</span>
              </div>
              <p className="leading-6 text-white/70">
                The globe UI is live, but the stock predictor data plane is protected by the existing Flask session. Sign in once to unlock search, recommendations, news, and live signal overlays.
              </p>
              <button
                onClick={() => (window.location.href = "/login")}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-400/12 px-4 py-2 font-semibold text-cyan-200 transition hover:bg-cyan-400/18"
              >
                <LogIn className="h-4 w-4" />
                Open login
              </button>
            </div>
          ) : (
            <>
              <div className="relative mb-4">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search ticker or company"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:bg-black/40"
                />
                {searchResults.length > 0 ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-20 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-2xl">
                    {searchResults.map((result) => (
                      <button
                        key={result.ticker}
                        onClick={() => {
                          setSelectedTicker(result.ticker)
                          setSearchTerm("")
                          setSearchResults([])
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition hover:bg-white/5"
                      >
                        <div>
                          <div className="font-semibold text-white">{result.ticker}</div>
                          <div className="text-xs text-white/50">{result.name}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-white/35" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/25 p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-white/40">Focused ticker</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-2xl font-semibold text-white">{stock?.ticker ?? selectedTicker}</span>
                      {loadingTicker ? <Loader2 className="h-4 w-4 animate-spin text-cyan-300" /> : null}
                    </div>
                    <div className="mt-1 max-w-[220px] text-sm text-white/55">{stock?.name ?? "Loading company profile..."}</div>
                  </div>
                  <div className={`rounded-2xl px-3 py-2 text-right ${Number(stock?.change_pct) >= 0 ? "bg-emerald-500/12 text-emerald-300" : "bg-rose-500/12 text-rose-300"}`}>
                    <div className="text-xs uppercase tracking-[0.2em] text-white/45">Price</div>
                    <div className="text-lg font-semibold">{currency(stock?.latest_close)}</div>
                    <div className="text-xs font-semibold">{percent(stock?.change_pct)}</div>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3 text-xs text-white/55">
                  <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
                    <div className="mb-1 uppercase tracking-[0.18em] text-white/35">Sector</div>
                    <div className="font-medium text-white/80">{stock?.sector ?? "Equities"}</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
                    <div className="mb-1 uppercase tracking-[0.18em] text-white/35">Industry</div>
                    <div className="font-medium text-white/80">{stock?.industry ?? "Signal network"}</div>
                  </div>
                </div>

                <div className="h-44 w-full overflow-hidden rounded-3xl border border-cyan-400/12 bg-slate-950/70 p-3">
                  {chartData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="globePrice" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.55} />
                            <stop offset="100%" stopColor="#0f172a" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
                        <XAxis dataKey="date" tick={{ fill: "rgba(226,232,240,0.45)", fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={18} />
                        <YAxis tick={{ fill: "rgba(226,232,240,0.45)", fontSize: 11 }} tickLine={false} axisLine={false} width={56} domain={["auto", "auto"]} />
                        <Tooltip
                          contentStyle={{
                            background: "rgba(2,6,23,0.92)",
                            border: "1px solid rgba(34,211,238,0.16)",
                            borderRadius: 16,
                            color: "white",
                          }}
                          formatter={(value: number) => [currency(Number(value)), "Close"]}
                        />
                        <Area type="monotone" dataKey="close" stroke="#22d3ee" strokeWidth={2.2} fill="url(#globePrice)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-white/45">Waiting for price history…</div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <ArrowBadge label="Green" state={arrowStates.green} />
                  <ArrowBadge label="Light Blue" state={arrowStates.light_blue} />
                  <ArrowBadge label="Aqua Blue" state={arrowStates.aqua_blue} />
                  <ArrowBadge label="Orange" state={arrowStates.orange} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/35">Trades</div>
                  <div className="mt-1 text-lg font-semibold text-white">{compactNumber(predictions?.summary?.total_trades)}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/35">Win rate</div>
                  <div className="mt-1 text-lg font-semibold text-white">{predictions?.summary?.win_rate ? `${predictions.summary.win_rate}%` : "--"}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/35">Confidence</div>
                  <div className="mt-1 text-lg font-semibold text-white">{predictions?.summary?.avg_confidence ? `${predictions.summary.avg_confidence}%` : "--"}</div>
                </div>
              </div>

              {summary ? (
                <div className="mt-4 rounded-[24px] border border-fuchsia-400/18 bg-fuchsia-400/8 p-4">
                  <div className="mb-2 flex items-center gap-2 text-fuchsia-200">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">Oracle readout</span>
                  </div>
                  <p className="whitespace-pre-line text-sm leading-6 text-white/78">{summary}</p>
                </div>
              ) : null}
            </>
          )}
        </section>

        <section className="grid flex-1 grid-cols-1 gap-4 overflow-hidden md:min-h-0">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/55 p-4 backdrop-blur-2xl md:min-h-0 md:overflow-auto">
            <div className="mb-3 flex items-center gap-2 text-white">
              <Activity className="h-4 w-4 text-emerald-300" />
              <span className="font-semibold">Top recommendations</span>
            </div>
            <div className="space-y-3">
              {recommendations.length ? (
                recommendations.map((item) => (
                  <button
                    key={item.ticker}
                    onClick={() => setSelectedTicker(item.ticker)}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-3 py-3 text-left transition hover:border-cyan-400/20 hover:bg-white/6"
                  >
                    <div>
                      <div className="font-semibold text-white">{item.ticker}</div>
                      <div className="text-xs text-white/45">{item.company_name ?? item.name ?? "AI-ranked candidate"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-emerald-300">
                        {Math.round((item.adj_confidence ?? item.confidence ?? 0) * 100)}%
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">{item.horizon ?? "signal"}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-5 text-sm text-white/45">Recommendations will appear after API auth is active.</div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/55 p-4 backdrop-blur-2xl md:min-h-0 md:overflow-auto">
            <div className="mb-3 flex items-center gap-2 text-white">
              <Newspaper className="h-4 w-4 text-cyan-300" />
              <span className="font-semibold">News pulse</span>
            </div>
            <div className="space-y-3">
              {news.length ? (
                news.map((article, index) => (
                  <a
                    key={`${article.link ?? article.title}-${index}`}
                    href={article.link || "#"}
                    target={article.link ? "_blank" : undefined}
                    rel={article.link ? "noreferrer" : undefined}
                    className="block rounded-2xl border border-white/8 bg-white/4 px-4 py-3 transition hover:border-cyan-400/18 hover:bg-white/6"
                  >
                    <div className="line-clamp-2 text-sm font-medium leading-6 text-white/82">{article.title}</div>
                    <div className="mt-2 flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.18em] text-white/35">
                      <span>{article.source ?? "Market feed"}</span>
                      <span>{article.published ? article.published.slice(0, 10) : "Live"}</span>
                    </div>
                  </a>
                ))
              ) : (
                <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-5 text-sm text-white/45">News feed will hydrate from the Flask API.</div>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-black/50 to-transparent" />
    </div>
  )
}
