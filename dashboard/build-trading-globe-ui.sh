#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="$ROOT_DIR/trading-globe-brain-src"
OUT_DIR="$ROOT_DIR/trading-globe-brain-static"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required to build Trading Globe Brain" >&2
  exit 1
fi

cd "$SRC_DIR"
npm install --no-fund --no-audit
npm run build

mkdir -p "$OUT_DIR"
rsync -a --delete "$SRC_DIR/out/" "$OUT_DIR/"

echo "Trading Globe Brain exported to: $OUT_DIR"
