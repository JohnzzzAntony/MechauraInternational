#!/bin/bash
# Sequential image generation with delays to avoid rate limits.
# Note: 1440x720 is INVALID (720 not multiple of 32). Use 1344x768 for wide landscape.

set -u
OUT=/home/z/my-project/public/images
STYLE="professional industrial photography, dramatic lighting with warm amber accents, dark moody background, high detail, photorealistic, premium B2B catalog quality, sharp focus, no text, no watermark"

gen() {
  local prompt="$1"
  local outpath="$2"
  local size="${3:-1024x1024}"
  if [ -f "$outpath" ]; then
    echo "[skip] $outpath already exists"
    return 0
  fi
  echo "[gen ] $outpath ($size)"
  z-ai image -p "${prompt}, ${STYLE}" -o "$outpath" -s "$size" 2>&1 | tail -3
  sleep 4
}

gen "Wide cinematic shot of a modern industrial warehouse facility at dusk, organized shelves of industrial equipment, forklift in distance, dramatic amber lighting from above, dark moody atmosphere, premium industrial aesthetic" \
    "${OUT}/hero/hero-bg.png" 1344x768

gen "Professional industrial supply warehouse interior, neatly organized shelves stocked with bearings and industrial tools, a worker in safety gear inspecting inventory, warm amber accent lighting, dark industrial aesthetic" \
    "${OUT}/about/warehouse.png" 1344x768

gen "Collection of industrial brushes arranged on dark surface, wire brushes, abrasive nylon brushes, cup brushes, wheel brushes, professional product photography, warm amber accent lighting" \
    "${OUT}/services/specialized-brushes.png" 1024x1024

gen "Industrial machinery and equipment in a clean modern facility, hydraulic presses, conveyor systems, heavy duty equipment, dramatic amber lighting from side, dark industrial atmosphere" \
    "${OUT}/services/industrial-equipment.png" 1024x1024

gen "Close-up product shot of precision steel ball bearings and roller bearings arranged on dark surface, various sizes, polished metal, professional product photography, warm amber reflections" \
    "${OUT}/products/bearings.png" 1024x1024

gen "Close-up product shot of high pressure hydraulic hoses with steel wire reinforcement and crimped fittings, coiled neatly, dark industrial background, professional product photography, amber accent lighting" \
    "${OUT}/products/hydraulic-hose.png" 1024x1024

gen "Close-up product shot of carbide cutting tools, indexable inserts, end mills, drills, taps arranged on dark workbench, precision machined metal, professional product photography, warm amber lighting" \
    "${OUT}/products/cutting-tools.png" 1024x1024

gen "Close-up product shot of industrial bandsaw blades coiled, bi-metal steel teeth visible, sharp precision cutting edges, dark background, professional product photography, warm amber reflections on metal" \
    "${OUT}/products/bandsaw-blades.png" 1024x1024

gen "Wide cinematic industrial facility exterior at dusk, modern factory building with warm amber lit windows, dramatic sky, dark silhouette of equipment, premium B2B corporate aesthetic" \
    "${OUT}/cta/cta-bg.png" 1344x768

echo ""
echo "=== Final inventory ==="
find ${OUT} -name "*.png" | sort
