#!/usr/bin/env bash
# Regenerates the self-hosted subsets in src/styles/fonts/ (#30).
#
# Requires Python with fonttools[woff] (`pip install fonttools brotli zopfli`) and
# writes into src/styles/fonts/. Sources are the upstream Google Fonts variable
# builds of Newsreader and IBM Plex Sans, both SIL OFL 1.1; the licences ship
# beside the subsets.
#
# The unicode ranges below must stay in step with @font-face in src/styles/fonts.css.
# scripts/check-font-coverage.mjs reads each generated file's cmap and fails the
# build if any character the site renders is missing, so widening the corpus means
# widening these ranges and re-running this script.
set -euo pipefail

work="$(mktemp -d)"
out="$(cd "$(dirname "$0")/.." && pwd)/src/styles/fonts"
raw='https://raw.githubusercontent.com/google/fonts/main/ofl'

LATIN='U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
LATINEXT='U+0107,U+010D,U+0161,U+017E'   # ć č š ž — Srebrenica material
VIET='U+01A1,U+1EA3,U+1EF9'             # ơ ả ỹ — Quảng Ngãi, Sơn Mỹ

curl -sSf -o "$work/Newsreader.ttf"        "$raw/newsreader/Newsreader%5Bopsz,wght%5D.ttf"
curl -sSf -o "$work/Newsreader-Italic.ttf" "$raw/newsreader/Newsreader-Italic%5Bopsz,wght%5D.ttf"
curl -sSf -o "$work/IBMPlexSans.ttf"       "$raw/ibmplexsans/IBMPlexSans%5Bwdth,wght%5D.ttf"
curl -sSf -o "$out/Newsreader-OFL.txt"     "$raw/newsreader/OFL.txt"
curl -sSf -o "$out/IBMPlexSans-OFL.txt"    "$raw/ibmplexsans/OFL.txt"

# The ramp uses three weights; the variable axis is clipped to that range, and
# Plex's width axis is pinned so only the weight axis ships.
python3 -m fontTools.varLib.instancer "$work/Newsreader.ttf"        wght=400:700 -o "$work/nr.ttf"
python3 -m fontTools.varLib.instancer "$work/Newsreader-Italic.ttf" wght=400:700 -o "$work/nri.ttf"
python3 -m fontTools.varLib.instancer "$work/IBMPlexSans.ttf"       wght=400:700 wdth=100 -o "$work/plex.ttf"

subset () {
  pyftsubset "$1" --output-file="$out/$2-$4.woff2" --flavor=woff2 --unicodes="$3" \
    --layout-features='kern,liga,calt,tnum,onum,lnum,pnum,ccmp,mark,mkmk,locl' \
    --name-IDs='*' --drop-tables+=DSIG --no-hinting --desubroutinize
}
for spec in "nr.ttf newsreader" "nri.ttf newsreader-italic" "plex.ttf plexsans"; do
  set -- $spec
  subset "$work/$1" "$2" "$LATIN" latin
  subset "$work/$1" "$2" "$LATINEXT" latin-ext
  subset "$work/$1" "$2" "$VIET" vietnamese
done

rm -rf "$work"
ls -l "$out"
