#!/bin/bash
# Mechaura Industrial — Image Generation Script
# Generates all section images in parallel batches.
# Style: premium industrial, dark dramatic lighting with amber accents,
# photorealistic, professional product photography aesthetic.

set -u
OUT=/home/z/my-project/public/images

# Common style suffix for visual consistency
STYLE="professional industrial photography, dramatic lighting with warm amber accents, dark moody background, high detail, photorealistic, premium B2B catalog quality, sharp focus, no text, no watermark"

echo "=========================================="
echo "Batch 1/3: Hero, About, Services (5 images)"
echo "=========================================="

z-ai image -p "Wide cinematic shot of a modern industrial warehouse facility at dusk, organized shelves of industrial equipment, forklift in distance, dramatic amber lighting from above, dark moody atmosphere, premium industrial aesthetic, ${STYLE}" -o "${OUT}/hero/hero-bg.png" -s 1440x720 &
P1=$!

z-ai image -p "Professional industrial supply warehouse interior, neatly organized shelves stocked with bearings and industrial tools, a worker in safety gear inspecting inventory, warm amber accent lighting, dark industrial aesthetic, ${STYLE}" -o "${OUT}/about/warehouse.png" -s 1344x768 &
P2=$!

z-ai image -p "Professional arrangement of precision industrial tools on a dark workbench, wrenches, calipers, drill bits, power tools, organized neatly, dramatic amber rim lighting, top-down product photography, ${STYLE}" -o "${OUT}/services/industrial-tools.png" -s 1024x1024 &
P3=$!

z-ai image -p "Collection of industrial brushes arranged on dark surface, wire brushes, abrasive nylon brushes, cup brushes, wheel brushes, professional product photography, warm amber accent lighting, ${STYLE}" -o "${OUT}/services/specialized-brushes.png" -s 1024x1024 &
P4=$!

z-ai image -p "Industrial machinery and equipment in a clean modern facility, hydraulic presses, conveyor systems, heavy duty equipment, dramatic amber lighting from side, dark industrial atmosphere, ${STYLE}" -o "${OUT}/services/industrial-equipment.png" -s 1024x1024 &
P5=$!

wait $P1 $P2 $P3 $P4 $P5
echo "Batch 1 complete."
ls -la ${OUT}/hero/ ${OUT}/about/ ${OUT}/services/

echo ""
echo "=========================================="
echo "Batch 2/3: Product images (6 images)"
echo "=========================================="

z-ai image -p "Close-up product shot of industrial abrasive removal brushes, nylon filament brushes with abrasive grit, cup brush and wheel brush variants, dark background, professional product photography, amber accent lighting, ${STYLE}" -o "${OUT}/products/abrasive-brushes.png" -s 1024x1024 &
P1=$!

z-ai image -p "Close-up product shot of precision steel ball bearings and roller bearings arranged on dark surface, various sizes, polished metal, professional product photography, warm amber reflections, ${STYLE}" -o "${OUT}/products/bearings.png" -s 1024x1024 &
P2=$!

z-ai image -p "Close-up product shot of high pressure hydraulic hoses with steel wire reinforcement and crimped fittings, coiled neatly, dark industrial background, professional product photography, amber accent lighting, ${STYLE}" -o "${OUT}/products/hydraulic-hose.png" -s 1024x1024 &
P3=$!

z-ai image -p "Close-up product shot of carbide cutting tools, indexable inserts, end mills, drills, taps arranged on dark workbench, precision machined metal, professional product photography, warm amber lighting, ${STYLE}" -o "${OUT}/products/cutting-tools.png" -s 1024x1024 &
P4=$!

z-ai image -p "Close-up product shot of elevator components, steel guide rails, door operators, rollers and brackets arranged neatly, dark industrial background, professional product photography, amber accent lighting, ${STYLE}" -o "${OUT}/products/elevator-accessories.png" -s 1024x1024 &
P5=$!

z-ai image -p "Close-up product shot of industrial bandsaw blades coiled, bi-metal steel teeth visible, sharp precision cutting edges, dark background, professional product photography, warm amber reflections on metal, ${STYLE}" -o "${OUT}/products/bandsaw-blades.png" -s 1024x1024 &
P6=$!

wait $P1 $P2 $P3 $P4 $P5 $P6
echo "Batch 2 complete."
ls -la ${OUT}/products/

echo ""
echo "=========================================="
echo "Batch 3/3: CTA + OG (2 images)"
echo "=========================================="

z-ai image -p "Wide cinematic industrial facility exterior at dusk, modern factory building with warm amber lit windows, dramatic sky, dark silhouette of equipment, premium B2B corporate aesthetic, ${STYLE}" -o "${OUT}/cta/cta-bg.png" -s 1440x720 &
P1=$!

z-ai image -p "Premium industrial brand hero image, dark moody warehouse with organized industrial equipment shelves, dramatic amber lighting from above, professional corporate aesthetic, wide composition, ${STYLE}" -o "${OUT}/og/og-image.png" -s 1344x768 &
P2=$!

wait $P1 $P2
echo "Batch 3 complete."
ls -la ${OUT}/cta/ ${OUT}/og/

echo ""
echo "=========================================="
echo "All images generated."
echo "=========================================="
find ${OUT} -name "*.png" | wc -l
echo "images total"
