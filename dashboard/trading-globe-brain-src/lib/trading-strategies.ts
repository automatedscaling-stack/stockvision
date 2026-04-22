export interface TradingStrategy {
  id: string
  name: string
  description: string
  riskLevel: string
  timeframe: string
  expectedReturn: string
  indicators: string[]
  details: string
}

export const tradingStrategies: TradingStrategy[] = [
  {
    id: "quantum-momentum",
    name: "Quantum Momentum Algorithm",
    description: "High-frequency momentum detection using quantum-inspired optimization",
    riskLevel: "High",
    timeframe: "1-5 minutes",
    expectedReturn: "15-25% monthly",
    indicators: ["MACD", "RSI", "Bollinger Bands", "Volume Profile", "Fibonacci Retracements"],
    details: "This cutting-edge algorithm leverages quantum-inspired computational methods to detect micro-momentum shifts in price action. By analyzing tick-by-tick data across multiple timeframes simultaneously, it identifies high-probability entry points with sub-second precision. The system employs adaptive position sizing based on real-time volatility metrics and implements dynamic stop-loss mechanisms that adjust to market conditions."
  },
  {
    id: "neural-arbitrage",
    name: "Neural Arbitrage Engine",
    description: "Cross-exchange arbitrage powered by deep learning price prediction",
    riskLevel: "Medium",
    timeframe: "Real-time",
    expectedReturn: "8-12% monthly",
    indicators: ["Order Book Depth", "Spread Analysis", "Latency Metrics", "Cross-Exchange Correlation"],
    details: "The Neural Arbitrage Engine continuously monitors price discrepancies across 50+ cryptocurrency exchanges using a proprietary deep learning model. It predicts price convergence patterns with 94% accuracy and executes triangular and statistical arbitrage opportunities within milliseconds. The system accounts for transaction fees, withdrawal limits, and network congestion to ensure profitable execution."
  },
  {
    id: "sentiment-fusion",
    name: "Sentiment Fusion Matrix",
    description: "Multi-source sentiment aggregation with NLP market analysis",
    riskLevel: "Medium",
    timeframe: "4-24 hours",
    expectedReturn: "10-18% monthly",
    indicators: ["Social Volume", "News Sentiment", "Whale Activity", "Fear & Greed Index", "On-Chain Metrics"],
    details: "This sophisticated strategy combines natural language processing across social media, news outlets, and blockchain data to create a comprehensive market sentiment score. The algorithm processes over 10 million data points daily, identifying sentiment shifts before they manifest in price action. Position entries are timed using confluence between sentiment peaks and technical support/resistance levels."
  },
  {
    id: "volatility-harvester",
    name: "Volatility Harvester Protocol",
    description: "Options-based strategy exploiting implied vs realized volatility spreads",
    riskLevel: "Low",
    timeframe: "Weekly",
    expectedReturn: "5-8% monthly",
    indicators: ["IV Rank", "VIX Correlation", "Options Flow", "Gamma Exposure", "Delta Hedging Ratio"],
    details: "The Volatility Harvester systematically sells premium during high implied volatility periods while maintaining delta-neutral positions. By continuously monitoring the volatility risk premium across multiple asset classes, it captures the spread between implied and realized volatility. The protocol includes sophisticated risk management with automatic position adjustments based on gamma and vanna exposure."
  },
  {
    id: "fractal-trend",
    name: "Fractal Trend Navigator",
    description: "Multi-timeframe trend detection using fractal geometry patterns",
    riskLevel: "Medium",
    timeframe: "1-7 days",
    expectedReturn: "12-20% monthly",
    indicators: ["Fractal Levels", "Elliott Wave Count", "Market Structure", "Volume Delta", "Wyckoff Phases"],
    details: "This algorithm identifies self-similar patterns across multiple timeframes using fractal mathematics. By recognizing the recursive nature of market structure, it predicts major trend reversals and continuation patterns with remarkable accuracy. The system combines Elliott Wave theory with modern market microstructure analysis to identify optimal entry and exit points during trend transitions."
  },
  {
    id: "liquidity-scanner",
    name: "Liquidity Flow Scanner",
    description: "Institutional order flow tracking and front-running prevention",
    riskLevel: "High",
    timeframe: "Intraday",
    expectedReturn: "18-30% monthly",
    indicators: ["Dark Pool Prints", "Block Trades", "Unusual Options Activity", "Institutional Flow", "Smart Money Index"],
    details: "The Liquidity Flow Scanner monitors institutional trading activity across traditional and decentralized venues. By analyzing large block trades, dark pool prints, and unusual options activity, it identifies smart money positioning before retail traders. The algorithm includes machine learning models trained on historical institutional trading patterns to predict accumulation and distribution phases."
  },
  {
    id: "mean-reversion",
    name: "Statistical Mean Reversion Engine",
    description: "Pairs trading and statistical arbitrage across correlated assets",
    riskLevel: "Low",
    timeframe: "1-14 days",
    expectedReturn: "6-10% monthly",
    indicators: ["Cointegration Score", "Z-Score", "Correlation Matrix", "Half-Life", "Hedge Ratio"],
    details: "This market-neutral strategy identifies statistically correlated asset pairs that have temporarily diverged from their equilibrium relationship. Using advanced cointegration analysis and Kalman filtering, the engine dynamically adjusts hedge ratios to maintain beta-neutral exposure. The system automatically screens thousands of potential pairs daily and ranks them by profit potential and mean-reversion probability."
  },
  {
    id: "macro-momentum",
    name: "Global Macro Momentum",
    description: "Cross-asset momentum strategy incorporating macroeconomic indicators",
    riskLevel: "Medium",
    timeframe: "Monthly",
    expectedReturn: "8-15% monthly",
    indicators: ["GDP Growth", "Inflation Data", "Central Bank Policy", "Currency Strength", "Commodity Cycles"],
    details: "The Global Macro Momentum strategy allocates capital across asset classes based on macroeconomic momentum signals. By analyzing economic indicators, central bank policies, and cross-asset correlations, it positions portfolios to capture regime changes in global markets. The system includes sophisticated factor models that decompose returns into momentum, value, and carry components."
  },
  {
    id: "microstructure-alpha",
    name: "Microstructure Alpha Generator",
    description: "Order book dynamics and market making profit extraction",
    riskLevel: "Extreme",
    timeframe: "Milliseconds",
    expectedReturn: "25-40% monthly",
    indicators: ["Order Imbalance", "Trade Flow Toxicity", "Queue Position", "Adverse Selection", "Spread Dynamics"],
    details: "This high-frequency strategy exploits microstructure inefficiencies in order book dynamics. By analyzing the probability of informed trading and queue priority, it generates alpha through precision market making and toxic flow avoidance. The system requires co-located infrastructure and processes millions of order book updates per second to maintain edge."
  },
  {
    id: "regime-detector",
    name: "Regime Detection Protocol",
    description: "Hidden Markov Model for market regime classification and adaptation",
    riskLevel: "Medium",
    timeframe: "Weekly",
    expectedReturn: "10-16% monthly",
    indicators: ["Volatility Regime", "Trend Strength", "Market Breadth", "Risk Appetite", "Correlation Regime"],
    details: "The Regime Detection Protocol uses Hidden Markov Models to classify market conditions into distinct regimes: trending, mean-reverting, high-volatility, and low-volatility. By identifying regime transitions before they become apparent, the system dynamically switches between strategy modules optimized for each environment. This adaptive approach ensures consistent performance across varying market conditions."
  },
  {
    id: "defi-yield",
    name: "DeFi Yield Optimizer",
    description: "Automated yield farming with impermanent loss mitigation",
    riskLevel: "High",
    timeframe: "Continuous",
    expectedReturn: "20-35% APY",
    indicators: ["Pool TVL", "APY Trends", "IL Calculator", "Gas Optimization", "Protocol Risk Score"],
    details: "This DeFi-native strategy automatically allocates capital across yield farming opportunities while actively managing impermanent loss risk. The system monitors liquidity pool dynamics, farming incentives, and protocol security to maximize risk-adjusted returns. It includes automated compounding, gas optimization, and flash loan protection to ensure capital efficiency."
  },
  {
    id: "whale-tracker",
    name: "Whale Movement Tracker",
    description: "Large holder behavior analysis and trade signal generation",
    riskLevel: "Medium",
    timeframe: "Hours to Days",
    expectedReturn: "12-22% monthly",
    indicators: ["Whale Wallets", "Exchange Inflows", "Token Age", "Holder Distribution", "Transaction Clustering"],
    details: "The Whale Movement Tracker monitors on-chain activity of large cryptocurrency holders to identify accumulation and distribution patterns. By analyzing transaction graphs, exchange flows, and dormant coin movements, it generates early signals for major price movements. The system maintains a database of known whale wallets and tracks their historical trading patterns."
  },
  {
    id: "options-flow",
    name: "Options Flow Intelligence",
    description: "Unusual options activity detection with gamma squeeze prediction",
    riskLevel: "High",
    timeframe: "Intraday",
    expectedReturn: "15-28% monthly",
    indicators: ["Unusual Volume", "Put/Call Ratio", "Open Interest", "Max Pain", "Dealer Positioning"],
    details: "This strategy monitors real-time options flow to identify large, unusual trades that may indicate informed positioning. By analyzing strike selection, expiration clustering, and premium paid, it distinguishes between hedging activity and directional bets. The system includes gamma squeeze detection algorithms that predict potential short-term price dislocations from dealer hedging."
  },
  {
    id: "cross-chain",
    name: "Cross-Chain Arbitrage Matrix",
    description: "Bridge arbitrage and wrapped asset price discrepancy exploitation",
    riskLevel: "High",
    timeframe: "Minutes",
    expectedReturn: "10-20% monthly",
    indicators: ["Bridge Liquidity", "Gas Costs", "Slippage Estimates", "Block Times", "MEV Risk"],
    details: "The Cross-Chain Arbitrage Matrix identifies price discrepancies between identical assets on different blockchain networks. By monitoring bridge liquidity, transaction costs, and settlement times, it executes profitable arbitrage trades across chains. The system includes MEV protection and optimizes for the fastest, most liquid routes to capture fleeting opportunities."
  },
  {
    id: "funding-rate",
    name: "Perpetual Funding Optimizer",
    description: "Delta-neutral funding rate capture across perpetual exchanges",
    riskLevel: "Low",
    timeframe: "8 hours",
    expectedReturn: "5-12% monthly",
    indicators: ["Funding Rate", "Open Interest", "Basis Spread", "Exchange Risk", "Liquidation Levels"],
    details: "This market-neutral strategy captures funding rate payments on perpetual swap contracts by maintaining hedged positions. The system monitors funding rates across multiple exchanges and automatically positions to receive maximum funding payments while minimizing directional exposure. It includes sophisticated risk management for exchange counterparty risk and position sizing based on liquidation cascades."
  },
  {
    id: "social-alpha",
    name: "Social Alpha Extraction",
    description: "Influencer tracking and viral content prediction for trading signals",
    riskLevel: "Extreme",
    timeframe: "Minutes to Hours",
    expectedReturn: "30-50% monthly",
    indicators: ["Social Reach", "Engagement Velocity", "Influencer Score", "Viral Coefficient", "Sentiment Shift"],
    details: "This high-risk strategy monitors social media influencers and viral content to identify potential pump-and-dump patterns and legitimate viral adoption events. Using NLP and network analysis, it distinguishes between organic growth and coordinated campaigns. The system provides rapid entry and exit signals based on content velocity and engagement metrics, with strict risk management for the inherently volatile nature of social-driven moves."
  },
  {
    id: "grid-trading",
    name: "Adaptive Grid Trading System",
    description: "Dynamic grid spacing with volatility-adjusted position sizing",
    riskLevel: "Low",
    timeframe: "Continuous",
    expectedReturn: "4-8% monthly",
    indicators: ["ATR", "Support/Resistance", "Volume Profile", "Grid Efficiency", "Drawdown Metrics"],
    details: "The Adaptive Grid Trading System places buy and sell orders at predetermined intervals, capturing profits from natural price oscillations. Unlike traditional grid bots, this system dynamically adjusts grid spacing based on realized volatility and adjusts position sizes according to market conditions. It excels in ranging markets and includes automatic grid repositioning for trending conditions."
  },
  {
    id: "news-alpha",
    name: "News Alpha Generator",
    description: "Real-time news parsing with millisecond trade execution",
    riskLevel: "High",
    timeframe: "Seconds",
    expectedReturn: "12-25% monthly",
    indicators: ["News Sentiment", "Source Credibility", "Market Impact", "Information Decay", "Headline Parsing"],
    details: "This strategy processes news headlines and press releases in real-time using advanced NLP models trained on financial text. By identifying market-moving information within milliseconds of publication, it executes trades before the information is fully priced in. The system distinguishes between high-impact and noise events and includes sophisticated position management for news reversals."
  },
  {
    id: "portfolio-heat",
    name: "Portfolio Heat Management",
    description: "Dynamic risk parity with tail risk hedging",
    riskLevel: "Low",
    timeframe: "Daily",
    expectedReturn: "6-12% monthly",
    indicators: ["VaR", "CVaR", "Risk Contribution", "Correlation Breakdown", "Tail Dependence"],
    details: "The Portfolio Heat Management system maintains target risk levels across a diversified portfolio of trading strategies. Using advanced risk parity techniques and dynamic hedging, it allocates capital to maximize risk-adjusted returns while limiting drawdowns. The system includes tail risk hedges that activate during market stress, providing downside protection without sacrificing upside potential."
  },
  {
    id: "volume-profile",
    name: "Volume Profile Intelligence",
    description: "Point of control and value area analysis for precision entries",
    riskLevel: "Medium",
    timeframe: "Intraday",
    expectedReturn: "10-18% monthly",
    indicators: ["POC", "Value Area High/Low", "Volume Nodes", "TPO Distribution", "Initial Balance"],
    details: "This strategy uses volume profile analysis to identify high-probability trading zones based on historical volume distribution. By mapping where the most trading activity occurred at each price level, it identifies support and resistance zones with statistical significance. The system combines volume profile with market profile concepts to predict price acceptance and rejection zones."
  },
  // Additional strategies for 3x globe count
  {
    id: "entropy-analysis",
    name: "Entropy Analysis Engine",
    description: "Information theory-based market inefficiency detection",
    riskLevel: "Medium",
    timeframe: "Daily",
    expectedReturn: "9-15% monthly",
    indicators: ["Shannon Entropy", "Mutual Information", "Transfer Entropy", "Complexity Metrics"],
    details: "This strategy applies information theory concepts to identify periods of low market entropy where price moves become more predictable. By measuring the information content of price series and identifying entropy anomalies, it times entries during high-conviction setups."
  },
  {
    id: "flash-crash",
    name: "Flash Crash Guardian",
    description: "Rapid market dislocation detection and recovery trading",
    riskLevel: "Extreme",
    timeframe: "Seconds",
    expectedReturn: "20-45% monthly",
    indicators: ["Price Velocity", "Liquidity Drain", "Circuit Breakers", "Recovery Patterns"],
    details: "Specialized strategy that monitors for flash crash conditions and positions to capture the rapid recovery that typically follows. Includes safeguards to distinguish between temporary dislocations and legitimate market moves."
  },
  {
    id: "order-flow-toxicity",
    name: "Order Flow Toxicity Analyzer",
    description: "VPIN-based toxic flow detection and avoidance",
    riskLevel: "High",
    timeframe: "Real-time",
    expectedReturn: "14-22% monthly",
    indicators: ["VPIN", "Order Imbalance", "Trade Classification", "Information Asymmetry"],
    details: "Uses Volume-Synchronized Probability of Informed Trading (VPIN) to detect when informed traders are active in the market, allowing for strategic positioning or avoidance during high-toxicity periods."
  },
  {
    id: "momentum-crash",
    name: "Momentum Crash Protection",
    description: "Momentum strategy with crash-regime detection and hedging",
    riskLevel: "Medium",
    timeframe: "Weekly",
    expectedReturn: "11-19% monthly",
    indicators: ["Momentum Scores", "Crash Indicators", "Tail Risk Metrics", "Hedge Ratios"],
    details: "Traditional momentum strategy enhanced with machine learning models that detect conditions preceding momentum crashes, automatically reducing exposure or implementing hedges during high-risk periods."
  },
  {
    id: "carry-trade",
    name: "Global Carry Optimizer",
    description: "Multi-asset carry trade with dynamic currency hedging",
    riskLevel: "Medium",
    timeframe: "Monthly",
    expectedReturn: "7-13% monthly",
    indicators: ["Interest Differentials", "Carry Ratios", "Currency Volatility", "Unwinding Risk"],
    details: "Systematic carry strategy across currencies, bonds, and commodities with sophisticated currency hedging to capture carry premium while managing tail risks from carry trade unwinding events."
  },
  {
    id: "volatility-surface",
    name: "Volatility Surface Arbitrage",
    description: "Options volatility smile anomaly exploitation",
    riskLevel: "Medium",
    timeframe: "Daily",
    expectedReturn: "8-14% monthly",
    indicators: ["Skew Index", "Term Structure", "Butterfly Spreads", "Surface Anomalies"],
    details: "Identifies mispricings in the options volatility surface by comparing implied volatilities across strikes and expirations, capturing profit from surface normalization through delta-hedged option positions."
  },
  {
    id: "network-analysis",
    name: "Network Topology Analyzer",
    description: "Graph theory-based market structure analysis",
    riskLevel: "Medium",
    timeframe: "Weekly",
    expectedReturn: "10-17% monthly",
    indicators: ["Correlation Networks", "Centrality Measures", "Cluster Detection", "Contagion Risk"],
    details: "Models the market as a network of interconnected assets, using graph theory to identify systemic risks, contagion paths, and assets likely to lead or lag market moves based on their network position."
  },
  {
    id: "auction-dynamics",
    name: "Auction Market Theory System",
    description: "Value area and market profile-based trading",
    riskLevel: "Medium",
    timeframe: "Intraday",
    expectedReturn: "9-16% monthly",
    indicators: ["TPO", "Value Areas", "Single Prints", "Poor Highs/Lows", "Excess"],
    details: "Applies auction market theory to identify fair value, overbought and oversold conditions, and high-probability reversal zones based on how prices are accepted or rejected at various levels."
  },
  {
    id: "intermarket-analysis",
    name: "Intermarket Divergence Detector",
    description: "Cross-market divergence trading with lead-lag analysis",
    riskLevel: "Medium",
    timeframe: "Daily",
    expectedReturn: "8-15% monthly",
    indicators: ["Cross-Correlations", "Lead-Lag Relationships", "Divergence Signals", "Sector Rotation"],
    details: "Identifies divergences between related markets (stocks vs bonds, commodities vs currencies) that historically precede significant moves, timing entries based on intermarket confirmation signals."
  },
  {
    id: "machine-learning-ensemble",
    name: "ML Ensemble Predictor",
    description: "Multi-model machine learning prediction ensemble",
    riskLevel: "High",
    timeframe: "Variable",
    expectedReturn: "15-28% monthly",
    indicators: ["Model Confidence", "Feature Importance", "Ensemble Agreement", "Prediction Intervals"],
    details: "Combines predictions from multiple machine learning models (gradient boosting, neural networks, random forests) using sophisticated ensemble techniques to generate high-confidence trading signals."
  },
  {
    id: "tick-imbalance",
    name: "Tick Imbalance Bars System",
    description: "Information-driven bar sampling for alpha generation",
    riskLevel: "High",
    timeframe: "Intraday",
    expectedReturn: "12-20% monthly",
    indicators: ["Tick Imbalance", "Volume Imbalance", "Dollar Imbalance", "Run Lengths"],
    details: "Uses tick imbalance bars instead of time bars to sample market data based on information arrival, generating signals from patterns in how trades cluster directionally."
  },
  {
    id: "beta-rotation",
    name: "Dynamic Beta Rotation",
    description: "Market exposure management through beta-ranked portfolios",
    riskLevel: "Low",
    timeframe: "Weekly",
    expectedReturn: "6-11% monthly",
    indicators: ["Rolling Beta", "Market Regime", "Defensive/Aggressive", "Factor Loadings"],
    details: "Dynamically rotates between high and low beta assets based on market regime indicators, capturing upside during bull markets while reducing drawdowns during corrections."
  },
  {
    id: "calendar-effects",
    name: "Calendar Anomaly Harvester",
    description: "Systematic exploitation of calendar-based market effects",
    riskLevel: "Low",
    timeframe: "Scheduled",
    expectedReturn: "4-9% monthly",
    indicators: ["Day-of-Week", "Month-of-Year", "Holiday Effects", "Turn-of-Month"],
    details: "Systematically trades known calendar anomalies (January effect, turn-of-month effect, pre-holiday drift) using statistical edge confirmation and dynamic position sizing."
  },
  {
    id: "dispersion-trading",
    name: "Dispersion Trading System",
    description: "Index vs component volatility spread trading",
    riskLevel: "Medium",
    timeframe: "Weekly",
    expectedReturn: "7-12% monthly",
    indicators: ["Implied Correlation", "Dispersion Premium", "Index Skew", "Component Vols"],
    details: "Captures the difference between index-implied correlation and realized component correlations by selling index volatility and buying component volatility, profiting from historically overstated implied correlations."
  },
  {
    id: "event-driven",
    name: "Event-Driven Alpha",
    description: "Corporate events and economic releases trading",
    riskLevel: "High",
    timeframe: "Event-based",
    expectedReturn: "13-24% monthly",
    indicators: ["Event Calendar", "Historical Reactions", "Positioning Data", "Surprise Metrics"],
    details: "Trades around corporate events (earnings, M&A, spinoffs) and economic releases using historical event studies and positioning analysis to identify mispriced event risk."
  },
  {
    id: "factor-timing",
    name: "Factor Timing Strategy",
    description: "Dynamic allocation across equity factors",
    riskLevel: "Medium",
    timeframe: "Monthly",
    expectedReturn: "8-14% monthly",
    indicators: ["Value Spread", "Momentum Crowding", "Quality Premium", "Factor Velocities"],
    details: "Times exposure to equity factors (value, momentum, quality, size) based on factor valuations, crowding metrics, and macroeconomic conditions to capture factor premiums while avoiding factor drawdowns."
  },
  {
    id: "tail-risk-parity",
    name: "Tail Risk Parity",
    description: "Portfolio construction with equal tail risk contribution",
    riskLevel: "Low",
    timeframe: "Weekly",
    expectedReturn: "5-10% monthly",
    indicators: ["CVaR Contributions", "Tail Dependencies", "Extreme Correlations", "Crisis Alpha"],
    details: "Extends risk parity to focus on tail risk, ensuring each asset contributes equally to portfolio extreme losses. Includes crisis alpha strategies that profit during market stress."
  },
  {
    id: "market-making-alpha",
    name: "Market Making Alpha",
    description: "Spread capture with inventory optimization",
    riskLevel: "High",
    timeframe: "Continuous",
    expectedReturn: "10-18% monthly",
    indicators: ["Bid-Ask Spread", "Inventory Skew", "Quote Optimization", "Adverse Selection"],
    details: "Provides liquidity to capture bid-ask spreads while using sophisticated inventory management to limit directional exposure and optimize quote placement based on market conditions."
  },
  {
    id: "relative-value",
    name: "Relative Value Arbitrage",
    description: "Cross-sectional mispricing identification and trading",
    riskLevel: "Medium",
    timeframe: "Daily",
    expectedReturn: "9-16% monthly",
    indicators: ["Valuation Metrics", "Peer Comparisons", "Mean Reversion Speed", "Factor Exposures"],
    details: "Identifies relatively mispriced securities within sectors or peer groups using multiple valuation metrics, going long undervalued and short overvalued with factor-neutral positioning."
  },
  {
    id: "sentiment-reversal",
    name: "Sentiment Reversal Trader",
    description: "Contrarian trading at sentiment extremes",
    riskLevel: "High",
    timeframe: "Variable",
    expectedReturn: "11-21% monthly",
    indicators: ["Put/Call Extremes", "Survey Data", "Positioning Extremes", "Sentiment Oscillators"],
    details: "Takes contrarian positions when sentiment indicators reach historical extremes, using multiple confirmation signals to time entries at points of maximum pessimism or euphoria."
  }
]

// Generate positions for globes in 3D space - enhanced for 3x count
export function generateGlobePositions(count: number, spread: number = 100, version: number = 1): [number, number, number][] {
  const positions: [number, number, number][] = []
  
  // Different distribution patterns based on version
  if (version === 1 || version === 3 || version === 5) {
    // Fibonacci sphere distribution
    const phi = Math.PI * (3 - Math.sqrt(5))
    
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const radius = Math.sqrt(1 - y * y)
      const theta = phi * i
      
      const layerSpread = spread * (0.7 + Math.random() * 0.6)
      
      positions.push([
        Math.cos(theta) * radius * layerSpread + (Math.random() - 0.5) * 15,
        y * spread * 0.8 + (Math.random() - 0.5) * 15,
        Math.sin(theta) * radius * layerSpread + (Math.random() - 0.5) * 15
      ])
    }
  } else if (version === 2 || version === 4) {
    // Clustered nebula distribution
    const clusterCenters = [
      [0, 0, 0],
      [spread * 0.6, spread * 0.3, spread * 0.2],
      [-spread * 0.5, spread * 0.4, -spread * 0.3],
      [spread * 0.3, -spread * 0.5, spread * 0.4],
      [-spread * 0.4, -spread * 0.3, spread * 0.5],
      [spread * 0.2, spread * 0.6, -spread * 0.4],
    ]
    
    for (let i = 0; i < count; i++) {
      const cluster = clusterCenters[i % clusterCenters.length]
      const clusterSpread = spread * 0.4
      
      positions.push([
        cluster[0] + (Math.random() - 0.5) * clusterSpread,
        cluster[1] + (Math.random() - 0.5) * clusterSpread,
        cluster[2] + (Math.random() - 0.5) * clusterSpread
      ])
    }
  }
  
  return positions
}

// Generate gradient indices with good distribution
export function generateGradientIndices(count: number): number[] {
  const indices: number[] = []
  for (let i = 0; i < count; i++) {
    indices.push(i % 5)
  }
  // Shuffle for more organic distribution
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices
}
