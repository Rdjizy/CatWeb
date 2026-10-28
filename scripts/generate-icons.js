import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE4E6" />
      <stop offset="50%" stop-color="#FEF3C7" />
      <stop offset="100%" stop-color="#FCE7F3" />
    </linearGradient>
    <linearGradient id="catGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#FFF5EB" />
    </linearGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#881337" flood-opacity="0.15" />
    </filter>
  </defs>

  <!-- Background rounded app icon -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />

  <g filter="url(#softShadow)">
    <!-- Cat Ears -->
    <!-- Left Ear -->
    <path d="M120 220 L160 90 L230 170 Z" fill="#FFB703" stroke="#F59E0B" stroke-width="8" stroke-linejoin="round" />
    <path d="M138 200 L168 115 L215 168 Z" fill="#FDA4AF" />

    <!-- Right Ear -->
    <path d="M392 220 L352 90 L282 170 Z" fill="#FFB703" stroke="#F59E0B" stroke-width="8" stroke-linejoin="round" />
    <path d="M374 200 L344 115 L297 168 Z" fill="#FDA4AF" />

    <!-- Head -->
    <ellipse cx="256" cy="275" rx="160" ry="140" fill="url(#catGrad)" stroke="#FB7185" stroke-width="8" />

    <!-- Cute Calico Patch over right ear/eye -->
    <path d="M280 155 Q350 160 380 210 Q390 260 360 280 Q320 250 300 210 Z" fill="#FDBA74" opacity="0.85" />

    <!-- Eyes (closed happy curved arches) -->
    <path d="M185 265 Q205 245 225 265" fill="none" stroke="#4C1D95" stroke-width="10" stroke-linecap="round" />
    <path d="M287 265 Q307 245 327 265" fill="none" stroke="#4C1D95" stroke-width="10" stroke-linecap="round" />

    <!-- Pink blush cheeks -->
    <ellipse cx="170" cy="290" rx="22" ry="14" fill="#FDA4AF" opacity="0.85" />
    <ellipse cx="342" cy="290" rx="22" ry="14" fill="#FDA4AF" opacity="0.85" />

    <!-- Cute Pink Nose -->
    <polygon points="256,288 245,275 267,275" fill="#F43F5E" />

    <!-- Mouth -->
    <path d="M256 288 Q242 305 232 296" fill="none" stroke="#4C1D95" stroke-width="6" stroke-linecap="round" />
    <path d="M256 288 Q270 305 280 296" fill="none" stroke="#4C1D95" stroke-width="6" stroke-linecap="round" />

    <!-- Whiskers -->
    <line x1="120" y1="280" x2="160" y2="285" stroke="#CBD5E1" stroke-width="5" stroke-linecap="round" />
    <line x1="115" y1="300" x2="158" y2="298" stroke="#CBD5E1" stroke-width="5" stroke-linecap="round" />
    <line x1="392" y1="280" x2="352" y2="285" stroke="#CBD5E1" stroke-width="5" stroke-linecap="round" />
    <line x1="397" y1="300" x2="354" y2="298" stroke="#CBD5E1" stroke-width="5" stroke-linecap="round" />

    <!-- Heart Collar Charm -->
    <path d="M256 405 C256 405 224 380 224 355 C224 340 238 330 256 345 C274 330 288 340 288 355 C288 380 256 405 256 405 Z" fill="#F43F5E" stroke="#BE123C" stroke-width="4" />
  </g>
</svg>
`;

const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE4E6" />
      <stop offset="50%" stop-color="#FEF3C7" />
      <stop offset="100%" stop-color="#FCE7F3" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bgGrad2)" />
  <g transform="translate(64, 64) scale(0.75)">
    <!-- Cat Ears -->
    <path d="M120 220 L160 90 L230 170 Z" fill="#FFB703" stroke="#F59E0B" stroke-width="8" stroke-linejoin="round" />
    <path d="M138 200 L168 115 L215 168 Z" fill="#FDA4AF" />
    <path d="M392 220 L352 90 L282 170 Z" fill="#FFB703" stroke="#F59E0B" stroke-width="8" stroke-linejoin="round" />
    <path d="M374 200 L344 115 L297 168 Z" fill="#FDA4AF" />
    <ellipse cx="256" cy="275" rx="160" ry="140" fill="#FFFFFF" stroke="#FB7185" stroke-width="8" />
    <path d="M280 155 Q350 160 380 210 Q390 260 360 280 Q320 250 300 210 Z" fill="#FDBA74" opacity="0.85" />
    <path d="M185 265 Q205 245 225 265" fill="none" stroke="#4C1D95" stroke-width="10" stroke-linecap="round" />
    <path d="M287 265 Q307 245 327 265" fill="none" stroke="#4C1D95" stroke-width="10" stroke-linecap="round" />
    <ellipse cx="170" cy="290" rx="22" ry="14" fill="#FDA4AF" opacity="0.85" />
    <ellipse cx="342" cy="290" rx="22" ry="14" fill="#FDA4AF" opacity="0.85" />
    <polygon points="256,288 245,275 267,275" fill="#F43F5E" />
    <path d="M256 288 Q242 305 232 296" fill="none" stroke="#4C1D95" stroke-width="6" stroke-linecap="round" />
    <path d="M256 288 Q270 305 280 296" fill="none" stroke="#4C1D95" stroke-width="6" stroke-linecap="round" />
    <path d="M256 405 C256 405 224 380 224 355 C224 340 238 330 256 345 C274 330 288 340 288 355 C288 380 256 405 256 405 Z" fill="#F43F5E" />
  </g>
</svg>
`;

async function buildIcons() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Save favicon.svg
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgIcon.trim());

  // 2. Render pwa-192x192.png
  await sharp(Buffer.from(svgIcon))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 3. Render pwa-512x512.png
  await sharp(Buffer.from(svgIcon))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 4. Render apple-touch-icon.png (180x180)
  await sharp(Buffer.from(svgIcon))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 5. Render pwa-maskable-512x512.png
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  console.log('All PWA and Android app icons generated successfully!');
}

buildIcons().catch(err => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
