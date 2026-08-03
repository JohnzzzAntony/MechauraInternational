const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = `C:\\Users\\johns\\.gemini\\antigravity-ide\\brain\\258b6681-8beb-45dd-9144-011e0861bedf\\media__1785722864637.jpg`;

async function processFavicon() {
  console.log("Processing uploaded logo icon for favicon...");

  // Load raw RGBA pixels from input image
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelCount = info.width * info.height;
  // Loop through pixels and turn grey/dark/checkerboard pixels transparent
  for (let i = 0; i < pixelCount; i++) {
    const offset = i * 4;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];

    // Check if pixel is part of the checkerboard (r,g,b all low or near grey <= 75 and not vibrant orange/white)
    // Vibrant orange has high R (>= 150) and low B (<= 100), white gear has high R, G, B (>= 200)
    const isOrange = r > 120 && r > b + 40;
    const isWhiteGear = r > 200 && g > 190 && b > 180;
    
    if (!isOrange && !isWhiteGear) {
      // Background checkerboard pixel -> set alpha to 0
      data[offset + 3] = 0;
    }
  }

  // Create clean transparent PNG buffer
  const transparentPngBuffer = await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .trim() // trim transparent borders
    .resize(512, 512, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  // Save to target locations
  const projectRoot = path.resolve(__dirname, '..');
  const appIconPath = path.join(projectRoot, 'src', 'app', 'icon.png');
  const appFaviconIcoPath = path.join(projectRoot, 'src', 'app', 'favicon.ico');
  const publicLogoMarkPath = path.join(projectRoot, 'public', 'logo-mark.png');

  fs.writeFileSync(appIconPath, transparentPngBuffer);
  console.log('✓ Saved:', appIconPath);

  fs.writeFileSync(publicLogoMarkPath, transparentPngBuffer);
  console.log('✓ Saved:', publicLogoMarkPath);

  // Generate 32x32 ico buffer
  const ico32Buffer = await sharp(transparentPngBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();

  fs.writeFileSync(appFaviconIcoPath, ico32Buffer);
  console.log('✓ Saved:', appFaviconIcoPath);

  // Generate SVG icon
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="mGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E85D04"/>
      <stop offset="50%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#FF9E0D"/>
    </linearGradient>
  </defs>
  <path d="M 120 400 L 220 180 L 260 270 Z" fill="url(#mGrad)"/>
  <path d="M 220 400 L 350 180 L 480 400 Z" fill="url(#mGrad)"/>
  <path d="M 350 300 A 45 45 0 0 1 395 345 A 45 45 0 0 1 305 345 Z" fill="#FFFFFF"/>
</svg>`;

  const svgPath = path.join(projectRoot, 'public', 'favicon.svg');
  fs.writeFileSync(svgPath, svgContent);
  console.log('✓ Saved:', svgPath);

  console.log('🎉 Favicon updated successfully!');
}

processFavicon().catch((err) => {
  console.error('Error processing favicon:', err);
  process.exit(1);
});
