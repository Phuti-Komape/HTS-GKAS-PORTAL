// Script to generate standard PWA PNG and SVG icons for HTS & GKAS Student Residences
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const ICONS_DIR = path.resolve('public', 'icons');
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Minimal pure Node.js PNG encoder
function createPng(width, height, getPixel) {
  // getPixel(x, y) returns [r, g, b, a] (0-255)
  const rowBytes = 1 + width * 4; // 1 filter byte + RGBA pixels
  const rawData = Buffer.alloc(rowBytes * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData, { level: 9 });

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: 6 = RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // IDAT Chunk
  const idatChunk = makeChunk('IDAT', deflated);

  // IEND Chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = zlib.crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Draw HTS & GKAS Crest Icon
function drawResidenceIcon(size, isMaskable = false) {
  const bgNavy = [11, 25, 44, 255]; // #0b192c
  const goldPrimary = [200, 147, 58, 255]; // #c8933a
  const goldBright = [245, 197, 88, 255]; // #f5c558
  const goldLight = [253, 230, 138, 255]; // #fde68a
  const white = [255, 255, 255, 255];
  const transparent = [0, 0, 0, 0];

  const scale = size / 512;
  const radius = isMaskable ? 0 : Math.round(72 * scale); // Rounded corners for standard, full bleed for maskable

  return createPng(size, size, (x, y) => {
    // Check if within rounded rectangle for standard icon
    if (!isMaskable) {
      const pad = Math.round(16 * scale);
      if (x < pad || x >= size - pad || y < pad || y >= size - pad) {
        return transparent;
      }
      // Corner radii
      const cx = x < pad + radius ? pad + radius : x > size - pad - radius ? size - pad - radius : x;
      const cy = y < pad + radius ? pad + radius : y > size - pad - radius ? size - pad - radius : y;
      const dist = Math.hypot(x - cx, y - cy);
      if (dist > radius) {
        return transparent;
      }
    }

    // Normalised coordinates centered on (0, 0) from -1 to 1
    const nx = (x - size / 2) / (size / 2);
    const ny = (y - size / 2) / (size / 2);

    // Maskable safe zone is 80% (radius 0.8)
    const factor = isMaskable ? 0.72 : 0.88;
    const sx = nx / factor;
    const sy = ny / factor;

    // Outer subtle gold circular/shield accent
    const distCenter = Math.hypot(sx, sy);
    if (distCenter >= 0.88 && distCenter <= 0.92) {
      return goldPrimary;
    }

    // 1. Residence Building / Crest Roof Silhouette
    // Triangle roof: apex at (0, -0.55), base at (-0.52, -0.15) to (0.52, -0.15)
    if (sy >= -0.58 && sy <= -0.12) {
      const roofWidthAtY = (sy - (-0.58)) / 0.46 * 0.54;
      if (Math.abs(sx) <= roofWidthAtY) {
        // Roof border outline
        if (Math.abs(Math.abs(sx) - roofWidthAtY) <= 0.04 || sy >= -0.16) {
          return goldBright;
        }
        return goldPrimary;
      }
    }

    // Chimney / finial at top
    if (sy >= -0.72 && sy <= -0.56 && Math.abs(sx) <= 0.05) {
      return goldBright;
    }

    // 2. Main Residence Building Pillars / Facade (-0.12 <= sy <= 0.42, |sx| <= 0.50)
    if (sy >= -0.12 && sy <= 0.42 && Math.abs(sx) <= 0.50) {
      // Outer border
      if (Math.abs(sx) >= 0.46 || sy >= 0.38) {
        return goldBright;
      }

      // Pillars: 4 pillars
      const pillarPositions = [-0.36, -0.12, 0.12, 0.36];
      for (const p of pillarPositions) {
        if (Math.abs(sx - p) <= 0.06) {
          return sy >= 0.32 ? goldBright : goldPrimary;
        }
      }

      // Windows / Archways between pillars
      if (sy >= 0.05 && sy <= 0.28) {
        if (Math.abs(sx - (-0.24)) <= 0.04 || Math.abs(sx - 0.0) <= 0.04 || Math.abs(sx - 0.24) <= 0.04) {
          return goldLight; // Warm glowing windows
        }
      }

      // Internal background inside building
      return [16, 36, 64, 255];
    }

    // 3. Base foundation podium (0.42 <= sy <= 0.52, |sx| <= 0.60)
    if (sy >= 0.42 && sy <= 0.52 && Math.abs(sx) <= 0.60) {
      return goldBright;
    }

    // 4. "GKAS" Monogram text band at bottom (0.56 <= sy <= 0.72)
    // Draw 4 distinct letter blocks for G, K, A, S
    if (sy >= 0.58 && sy <= 0.72) {
      // G block (-0.42 to -0.22)
      if (sx >= -0.42 && sx <= -0.22) {
        if (sx <= -0.38 || sy <= 0.61 || sy >= 0.69 || (sx >= -0.26 && sy >= 0.65) || (sy >= 0.64 && sy <= 0.66 && sx >= -0.32)) {
          return goldLight;
        }
      }
      // K block (-0.18 to -0.02)
      if (sx >= -0.18 && sx <= -0.02) {
        if (sx <= -0.14 || Math.abs((sx - (-0.02)) - (sy - 0.65) * 1.2) <= 0.03 || Math.abs((sx - (-0.02)) + (sy - 0.65) * 1.2) <= 0.03) {
          return goldLight;
        }
      }
      // A block (0.02 to 0.18)
      if (sx >= 0.02 && sx <= 0.18) {
        if (Math.abs(Math.abs(sx - 0.10) - (sy - 0.58) * 0.55) <= 0.03 || (sy >= 0.65 && sy <= 0.67 && Math.abs(sx - 0.10) <= 0.06)) {
          return goldLight;
        }
      }
      // S block (0.22 to 0.42)
      if (sx >= 0.22 && sx <= 0.42) {
        const topHalf = sy <= 0.65;
        if (sy <= 0.61 || (sy >= 0.64 && sy <= 0.66) || sy >= 0.69) return goldLight;
        if (topHalf && sx <= 0.26) return goldLight;
        if (!topHalf && sx >= 0.38) return goldLight;
      }
    }

    // Default Navy Background
    return bgNavy;
  });
}

// Generate all standard PWA icons
console.log('Generating PWA standard icons...');

const icons = [
  { name: 'icon-192x192.png', size: 192, maskable: false },
  { name: 'icon-512x512.png', size: 512, maskable: false },
  { name: 'icon-maskable-192x192.png', size: 192, maskable: true },
  { name: 'icon-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
  { name: 'favicon-32x32.png', size: 32, maskable: false }
];

for (const icon of icons) {
  const filePath = path.join(ICONS_DIR, icon.name);
  const buf = drawResidenceIcon(icon.size, icon.maskable);
  fs.writeFileSync(filePath, buf);
  console.log(`✓ Generated ${icon.name} (${icon.size}x${icon.size}, ${buf.length} bytes)`);
}

// SVG Vector Icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b192c"/>
      <stop offset="100%" stop-color="#1b2a47"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5c558"/>
      <stop offset="50%" stop-color="#c8933a"/>
      <stop offset="100%" stop-color="#9a6e23"/>
    </linearGradient>
    <linearGradient id="windowGlow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Background with rounded corners -->
  <rect width="512" height="512" rx="100" fill="url(#bgGrad)"/>
  
  <!-- Outer Decorative Ring -->
  <circle cx="256" cy="256" r="226" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-opacity="0.5"/>
  <circle cx="256" cy="256" r="218" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="6 6" stroke-opacity="0.4"/>

  <!-- Main Residence Building Emblem -->
  <g filter="url(#shadow)">
    <!-- Finial top spire -->
    <path d="M256 68 L262 105 L250 105 Z" fill="url(#goldGrad)"/>
    <circle cx="256" cy="64" r="5" fill="#fde68a"/>

    <!-- Roof Pediment -->
    <polygon points="256,92 120,188 392,188" fill="url(#goldGrad)" stroke="#fde68a" stroke-width="3"/>
    
    <!-- Roof Inner Medallion -->
    <circle cx="256" cy="154" r="18" fill="#0b192c" stroke="#fde68a" stroke-width="2.5"/>
    <path d="M256 142 L256 166 M244 154 L268 154" stroke="url(#goldGrad)" stroke-width="2"/>

    <!-- Building Architrave -->
    <rect x="136" y="188" width="240" height="20" fill="url(#goldGrad)"/>

    <!-- Building Colonels / Pillars -->
    <!-- Pillar 1 -->
    <rect x="146" y="208" width="34" height="130" fill="url(#goldGrad)"/>
    <!-- Pillar 2 -->
    <rect x="208" y="208" width="34" height="130" fill="url(#goldGrad)"/>
    <!-- Pillar 3 -->
    <rect x="270" y="208" width="34" height="130" fill="url(#goldGrad)"/>
    <!-- Pillar 4 -->
    <rect x="332" y="208" width="34" height="130" fill="url(#goldGrad)"/>

    <!-- Archways & Lit Windows between pillars -->
    <!-- Window 1 -->
    <path d="M185 240 Q194 228 203 240 L203 295 L185 295 Z" fill="url(#windowGlow)"/>
    <!-- Main Center Doorway -->
    <path d="M247 232 Q256 218 265 232 L265 338 L247 338 Z" fill="url(#windowGlow)"/>
    <!-- Window 2 -->
    <path d="M309 240 Q318 228 327 240 L327 295 L309 295 Z" fill="url(#windowGlow)"/>

    <!-- Podium Steps Foundation -->
    <rect x="126" y="338" width="260" height="16" fill="url(#goldGrad)"/>
    <rect x="110" y="354" width="292" height="18" fill="url(#goldGrad)"/>
  </g>

  <!-- GKAS Typography -->
  <text x="256" y="426" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="34" font-weight="800" letter-spacing="7" fill="url(#goldGrad)">
    GKAS
  </text>
  <text x="256" y="454" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="14" font-weight="600" letter-spacing="4" fill="#94a3b8">
    STUDENT RESIDENCES
  </text>
</svg>`;

fs.writeFileSync(path.join(ICONS_DIR, 'icon.svg'), svgContent);
fs.writeFileSync(path.resolve('public', 'favicon.svg'), svgContent);
console.log('✓ Generated icon.svg & favicon.svg');
