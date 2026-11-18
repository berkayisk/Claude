#!/usr/bin/env bash
# Kullanım: ./scripts/render.sh <proje-klasoru> [CompositionId] [cikti-adi.mp4]
set -e
cd "$(dirname "$0")/.."
P="${1:?Proje klasörü ver (örn. projeler/2026-11-18_deneme)}"
P="${P%/}"; [ -d "$P" ] || P="projeler/$P"
ID="${2:-Video}"
OUT="${3:-${ID}.mp4}"
npx remotion render "$P/src/index.ts" "$ID" "$P/ciktilar/$OUT" --public-dir "$P/girdiler"
