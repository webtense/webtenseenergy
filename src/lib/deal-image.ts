import sharp from 'sharp';
import type { AmazonProduct } from './amazon-scraper';

const W = 1080;
const H = 1080;

// Colores de la web (globals.css)
const DARK = '#06111d';
const GREEN = '#1ab775'; // primary-500
const GREEN_DARK = '#0f935d'; // primary-600
const GREEN_LIGHT = '#3ed394'; // primary-400
const WHITE = '#ffffff';
const ORANGE = '#ff6b00'; // badge descuento (contraste con verde)

// Layout vertical
const HEADER_H = 160;
const IMG_TOP = HEADER_H; // 160
const IMG_BOTTOM = 740;
const IMG_H = IMG_BOTTOM - IMG_TOP; // 580
const AMAZON_BAR_TOP = IMG_BOTTOM; // 740
const AMAZON_BAR_H = 70;
const AMAZON_BAR_BOTTOM = AMAZON_BAR_TOP + AMAZON_BAR_H; // 810
const FOOTER_TOP = H - 80; // 1000

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
  let productImgBuffer: Buffer | null = null;
  if (product.image) {
    try {
      const r = await fetch(product.image, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (r.ok) productImgBuffer = Buffer.from(await r.arrayBuffer());
    } catch {
      // sin imagen
    }
  }

  let resizedProduct: Buffer | null = null;
  if (productImgBuffer) {
    resizedProduct = await sharp(productImgBuffer)
      .resize(860, 520, { fit: 'inside', background: WHITE })
      .flatten({ background: WHITE })
      .png()
      .toBuffer();
  }

  const titleLines = wrapText(esc(product.title), 40, 3);
  const currentPriceStr = product.currentPrice ? formatPrice(product.currentPrice) : '';
  const origPriceStr = product.originalPrice ? formatPrice(product.originalPrice) : '';
  const discountStr = product.discountPercent ? `-${product.discountPercent}%` : '';

  // Título: 3 líneas centradas en la zona de texto (y=830 a y=970)
  const titleSvg = titleLines
    .map(
      (l, i) =>
        `<text x="540" y="${850 + i * 48}" font-family="Liberation Sans,Arial,sans-serif" font-size="34" fill="#1a1a1a" text-anchor="middle">${l}</text>`
    )
    .join('\n');

  // Precio tachado a la izquierda
  const origPriceSvg = origPriceStr
    ? `<text x="380" y="975" font-family="Liberation Sans,Arial,sans-serif" font-size="36" fill="#999999" text-decoration="line-through" text-anchor="middle">${esc(origPriceStr)}</text>`
    : '';

  // Precio actual en verde
  const currentPriceSvg = currentPriceStr
    ? `<text x="700" y="982" font-family="Liberation Sans,Arial,sans-serif" font-size="54" font-weight="bold" fill="${GREEN}" text-anchor="middle">${esc(currentPriceStr)}</text>`
    : '';

  // Badge descuento (naranja para contraste)
  const discountBadge = discountStr
    ? `<rect x="24" y="${IMG_BOTTOM - 82}" width="150" height="70" rx="14" fill="${ORANGE}"/>
       <text x="99" y="${IMG_BOTTOM - 32}" font-family="Liberation Sans,Arial,sans-serif" font-size="40" font-weight="bold" fill="${WHITE}" text-anchor="middle">${discountStr}</text>`
    : '';

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo blanco -->
  <rect width="${W}" height="${H}" fill="${WHITE}"/>

  <!-- ===== HEADER (160px) ===== -->
  <rect x="0" y="0" width="${W}" height="${HEADER_H}" fill="${DARK}"/>
  <!-- Franja verde izquierda -->
  <rect x="0" y="0" width="12" height="${HEADER_H}" fill="${GREEN}"/>

  <!-- Eyebrow verde -->
  <text x="36" y="50" font-family="Liberation Sans,Arial,sans-serif" font-size="16" fill="${GREEN}" letter-spacing="3">ENERGIA SOLAR &amp; DOMOTICA</text>

  <!-- Logo: WEBTENSE (blanco) + ENERGY (verde) -->
  <text x="36" y="124" font-family="Liberation Sans,Arial,sans-serif" font-size="62" font-weight="bold">
    <tspan fill="${WHITE}">WEBTENSE</tspan><tspan fill="${GREEN}">ENERGY</tspan>
  </text>

  <!-- URL web derecha -->
  <text x="${W - 28}" y="100" font-family="Liberation Sans,Arial,sans-serif" font-size="20" fill="${GREEN_LIGHT}" text-anchor="end">webtenseenergy.com</text>

  <!-- ===== ZONA IMAGEN (y=160 a y=740) ===== -->
  <rect x="0" y="${IMG_TOP}" width="${W}" height="${IMG_H}" fill="#f2f9f5"/>

  <!-- Badge descuento sobre imagen -->
  ${discountBadge}

  <!-- ===== BARRA AMAZON (y=740 a y=810, 70px) ===== -->
  <rect x="0" y="${AMAZON_BAR_TOP}" width="${W}" height="${AMAZON_BAR_H}" fill="${GREEN_DARK}"/>
  <text x="${W / 2}" y="${AMAZON_BAR_TOP + 46}" font-family="Liberation Sans,Arial,sans-serif" font-size="30" font-weight="bold" fill="${WHITE}" text-anchor="middle">Disponible en Amazon</text>

  <!-- ===== ZONA TÍTULO (y=810 a y=990) ===== -->
  ${titleSvg}

  <!-- ===== PRECIOS ===== -->
  ${origPriceSvg}
  ${currentPriceSvg}

  <!-- ===== FOOTER (y=1000 a y=1080) ===== -->
  <rect x="0" y="${FOOTER_TOP}" width="${W}" height="${H - FOOTER_TOP}" fill="${DARK}"/>
  <rect x="0" y="${FOOTER_TOP}" width="${W}" height="5" fill="${GREEN}"/>
  <text x="28" y="${FOOTER_TOP + 50}" font-family="Liberation Sans,Arial,sans-serif" font-size="20" fill="${GREEN_LIGHT}">Oferta detectada automaticamente</text>
  <text x="${W - 28}" y="${FOOTER_TOP + 50}" font-family="Liberation Sans,Arial,sans-serif" font-size="20" fill="${GREEN_LIGHT}" text-anchor="end">#domotica  #ahorro  #solar</text>
</svg>`;

  const layers: sharp.OverlayOptions[] = [{ input: Buffer.from(svg), top: 0, left: 0 }];

  if (resizedProduct) {
    const meta = await sharp(resizedProduct).metadata();
    const pw = meta.width ?? 860;
    const ph = meta.height ?? 520;
    const left = Math.round((W - pw) / 2);
    // Centrar verticalmente en zona imagen (y=160 a y=740 = 580px)
    const top = Math.round(IMG_TOP + (IMG_H - ph) / 2);
    layers.push({ input: resizedProduct, top: Math.max(IMG_TOP + 10, top), left });
  }

  return sharp({
    create: { width: W, height: H, channels: 3, background: WHITE },
  })
    .composite(layers)
    .jpeg({ quality: 90 })
    .toBuffer();
}
