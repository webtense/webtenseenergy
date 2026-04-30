import sharp from 'sharp';
import type { AmazonProduct } from './amazon-scraper';

const W = 1080;
const H = 1080;
const BRAND_DARK = '#0b2d55';
const BRAND_LIGHT = '#1565c0';
const ACCENT = '#ff6b00';
const WHITE = '#ffffff';

function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      if (lines.length >= maxLines) break;
      current = word.slice(0, maxChars);
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatPrice(p: number): string {
  return p.toFixed(2).replace('.', ',') + ' EUR';
}

export async function generateDealImage(product: AmazonProduct): Promise<Buffer> {
  // Descargar imagen del producto
  let productImgBuffer: Buffer | null = null;
  if (product.image) {
    try {
      const r = await fetch(product.image, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (r.ok) productImgBuffer = Buffer.from(await r.arrayBuffer());
    } catch {
      // sin imagen
    }
  }

  // Redimensionar imagen del producto (cuadrada, fondo blanco)
  let resizedProduct: Buffer | null = null;
  if (productImgBuffer) {
    resizedProduct = await sharp(productImgBuffer)
      .resize(820, 680, { fit: 'inside', background: WHITE })
      .flatten({ background: WHITE })
      .png()
      .toBuffer();
  }

  const titleLines = wrapText(esc(product.title), 42, 3);
  const currentPriceStr = product.currentPrice ? formatPrice(product.currentPrice) : '';
  const origPriceStr = product.originalPrice ? formatPrice(product.originalPrice) : '';
  const discountStr = product.discountPercent ? `-${product.discountPercent}%` : '';

  // Líneas del título como elementos SVG
  const titleSvg = titleLines
    .map(
      (l, i) =>
        `<text x="540" y="${780 + i * 46}" font-family="Liberation Sans,Arial,sans-serif" font-size="32" fill="#222222" text-anchor="middle">${l}</text>`
    )
    .join('\n');

  const origPriceSvg = origPriceStr
    ? `<text x="400" y="960" font-family="Liberation Sans,Arial,sans-serif" font-size="36" fill="#999999" text-decoration="line-through" text-anchor="middle">${esc(origPriceStr)}</text>`
    : '';

  const currentPriceSvg = currentPriceStr
    ? `<text x="700" y="965" font-family="Liberation Sans,Arial,sans-serif" font-size="52" font-weight="bold" fill="${ACCENT}" text-anchor="middle">${esc(currentPriceStr)}</text>`
    : '';

  const discountBadge = discountStr
    ? `<rect x="20" y="700" width="160" height="72" rx="12" fill="${ACCENT}"/>
       <text x="100" y="750" font-family="Liberation Sans,Arial,sans-serif" font-size="42" font-weight="bold" fill="${WHITE}" text-anchor="middle">${discountStr}</text>`
    : '';

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo blanco -->
  <rect width="${W}" height="${H}" fill="${WHITE}"/>

  <!-- Zona imagen: fondo gris claro -->
  <rect x="0" y="0" width="${W}" height="740" fill="#f5f7fa"/>

  <!-- Header azul con logo texto -->
  <rect x="0" y="0" width="${W}" height="80" fill="${BRAND_DARK}"/>
  <rect x="0" y="0" width="8" height="80" fill="${ACCENT}"/>
  <text x="32" y="30" font-family="Liberation Sans,Arial,sans-serif" font-size="14" fill="#90caf9">ENERGIA SOLAR &amp; DOMOTICA</text>
  <text x="32" y="60" font-family="Liberation Sans,Arial,sans-serif" font-size="28" font-weight="bold" fill="${WHITE}">Webtense Energy</text>
  <text x="${W - 24}" y="50" font-family="Liberation Sans,Arial,sans-serif" font-size="18" fill="#90caf9" text-anchor="end">webtenseenergy.com</text>

  <!-- Badge disponible en Amazon -->
  <rect x="${W - 220}" y="94" width="200" height="38" rx="8" fill="#ff9900"/>
  <text x="${W - 120}" y="120" font-family="Liberation Sans,Arial,sans-serif" font-size="18" font-weight="bold" fill="${WHITE}" text-anchor="middle">disponible en amazon</text>

  <!-- Badge descuento -->
  ${discountBadge}

  <!-- Separador -->
  <line x1="40" y1="756" x2="${W - 40}" y2="756" stroke="#e0e0e0" stroke-width="1.5"/>

  <!-- Titulo producto -->
  ${titleSvg}

  <!-- Precios -->
  ${origPriceSvg}
  ${currentPriceSvg}

  <!-- Footer -->
  <rect x="0" y="${H - 58}" width="${W}" height="58" fill="${BRAND_DARK}"/>
  <rect x="0" y="${H - 58}" width="${W}" height="4" fill="${BRAND_LIGHT}"/>
  <text x="24" y="${H - 22}" font-family="Liberation Sans,Arial,sans-serif" font-size="18" fill="#90caf9">Oferta detectada automaticamente</text>
  <text x="${W - 24}" y="${H - 22}" font-family="Liberation Sans,Arial,sans-serif" font-size="18" fill="#90caf9" text-anchor="end">#domotica  #ahorro  #solar</text>
</svg>`;

  const layers: sharp.OverlayOptions[] = [{ input: Buffer.from(svg), top: 0, left: 0 }];

  if (resizedProduct) {
    const meta = await sharp(resizedProduct).metadata();
    const pw = meta.width ?? 820;
    const ph = meta.height ?? 680;
    const left = Math.round((W - pw) / 2);
    // Centrar verticalmente en zona imagen (80 header → 740 separator)
    const top = Math.round(80 + (660 - ph) / 2);
    layers.push({ input: resizedProduct, top: Math.max(84, top), left });
  }

  return sharp({
    create: { width: W, height: H, channels: 3, background: WHITE },
  })
    .composite(layers)
    .jpeg({ quality: 90 })
    .toBuffer();
}
