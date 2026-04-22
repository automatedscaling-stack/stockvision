#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$ROOT_DIR/.." && pwd)"
TRADING_GLOBE_BASE_PATH="/stockvision" \
TRADING_GLOBE_OUT_DIR="$REPO_ROOT/docs" \
"$ROOT_DIR/build-trading-globe-ui.sh"

touch "$REPO_ROOT/docs/.nojekyll"
echo "GitHub Pages marker written to: $REPO_ROOT/docs/.nojekyll"
