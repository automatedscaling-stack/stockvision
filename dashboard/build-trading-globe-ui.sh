#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$ROOT_DIR/.." && pwd)"
SRC_DIR="$ROOT_DIR/trading-globe-brain-src"
OUT_DIR="${TRADING_GLOBE_OUT_DIR:-$ROOT_DIR/trading-globe-brain-static}"
BASE_PATH="${TRADING_GLOBE_BASE_PATH:-/trading-globe}"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required to build Trading Globe Brain" >&2
  exit 1
fi

cd "$SRC_DIR"
npm install --no-fund --no-audit
TRADING_GLOBE_BASE_PATH="$BASE_PATH" npm run build

mkdir -p "$OUT_DIR"
rsync -a --delete "$SRC_DIR/out/" "$OUT_DIR/"

echo "Trading Globe Brain exported to: $OUT_DIR"
echo "Base path: $BASE_PATH"
echo "Repo root: $REPO_ROOT"
