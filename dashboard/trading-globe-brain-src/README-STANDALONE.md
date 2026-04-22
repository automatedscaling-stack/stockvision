# Trading Globe Brain Standalone UI

This source tree is the full Desktop UI copied from `/Users/cao/Desktop/TRADING GLOBE BRAIN` and adapted to build as a static export under `/trading-globe/`.

## Build

```bash
cd dashboard/trading-globe-brain-src
npm install
npm run build
```

The generated export lands in `dashboard/trading-globe-brain-src/out/` and should be synced into `dashboard/trading-globe-brain-static/` for Flask serving.
