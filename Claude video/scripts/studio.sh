#!/usr/bin/env bash
# Kullanım: ./scripts/studio.sh <proje-klasoru>
set -e
cd "$(dirname "$0")/.."
P="${1:?Proje klasörü ver}"; P="${P%/}"; [ -d "$P" ] || P="projeler/$P"
npx remotion studio "$P/src/index.ts" --public-dir "$P/girdiler"
