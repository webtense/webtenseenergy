import sharp from 'sharp'
import type { AmazonProduct } from './amazon-scraper'

const W = 1200
const H = 630
const BRAND_COLOR = '#0f3460'
const ACCENT = '#e94560'

function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length <= maxChars) {
      current = candidate
    } else {
      if (current) lines.push(current)
      if (lines.length >= maxLines) break
      current = word.slice(0, maxChars)
    }
  }
  if (current && lines.length < maxLines) lines.push(current)
  return lines
}

function formatPrice(p: number): string {
  return p.toFixed(2).replace('.', ',') + ' €'
}

export async function generateDealImage(product: AmazonProduct): Promise<Buffer> {
  // Descarga imagen del producto
  let productImgBuffer: Buffer | null = null
  if (product.image) {
    try {
      const r = await fetch(product.image, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      })
      if (r.ok) productImgBuffer = Buffer.from(await r.arrayBuffer())
    } catch {
      // sin imagen → solo fondo
    }
  }

  // Redimensiona imagen del producto a encajar en zona izquierda
  let resizedProduct: Buffer | null = null
  if (productImgBuffer) {
    resizedProduct = await sharp(productImgBuffer)
      .resize(560, 500, { fit: 'inside', background: '#ffffff' })
      .flatten({ background: '#ffffff' })
      .png()
      .toBuffer()
  }

  const titleLines = wrapText(product.title, 38, 3)
  const currentPriceStr = product.currentPrice ? formatPrice(product.currentPrice) : ''
  const origPriceStr = product.originalPrice ? formatPrice(product.originalPrice) : ''
  const discountStr = product.discountPercent ? `-${product.discountPercent}%` : ''

  // SVG con branding y precios (zona derecha)
  const titleSvgLines = titleLines
    .map((l, i) => `<text x="660" y="${130 + i * 34}" font-family="Arial,sans-serif" font-size="26" fill="#1a1a1a">${l}</text>`)
    .join('\n')

  const origPriceSvg = origPriceStr
    ? `<text x="660" y="340" font-family="Arial,sans-serif" font-size="30" fill="#aaaaaa" text-decoration="line-through">${origPriceStr}</text>`
    : ''

  const currentPriceSvg = currentPriceStr
    ? `<text x="660" y="420" font-family="Arial,sans-serif" font-size="72" font-weight="bold" fill="${ACCENT}">${currentPriceStr}</text>`
    : ''

  const discountBadge = discountStr
    ? `<rect x="660" y="440" width="170" height="56" rx="10" fill="${ACCENT}"/>
       <text x="745" y="479" font-family="Arial,sans-serif" font-size="34" font-weight="bold" fill="white" text-anchor="middle">${discountStr}</text>
       <text x="850" y="479" font-family="Arial,sans-serif" font-size="18" fill="${ACCENT}" font-weight="bold">¡Mínimo histórico!</text>`
    : ''

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo blanco -->
  <rect width="${W}" height="${H}" fill="#ffffff"/>

  <!-- Zona izquierda: fondo producto -->
  <rect x="0" y="0" width="610" height="${H}" fill="#f4f6fb"/>

  <!-- Zona derecha: info -->
  <rect x="610" y="0" width="590" height="${H}" fill="#ffffff"/>

  <!-- Header banner -->
  <rect x="0" y="0" width="${W}" height="68" fill="${BRAND_COLOR}"/>
  <text x="30" y="46" font-family="Arial,sans-serif" font-size="26" font-weight="bold" fill="white">⚡ Webtense Energy</text>
  <text x="${W - 30}" y="46" font-family="Arial,sans-serif" font-size="18" fill="#a0c4e8" text-anchor="end">webtenseenergy.com</text>

  <!-- Amazon badge -->
  <rect x="660" y="80" width="160" height="34" rx="6" fill="#ff9900"/>
  <text x="740" y="104" font-family="Arial,sans-serif" font-size="17" font-weight="bold" fill="white" text-anchor="middle">disponible en amazon</text>

  <!-- Título -->
  ${titleSvgLines}

  <!-- Precios -->
  ${origPriceSvg}
  ${currentPriceSvg}

  <!-- Badge descuento -->
  ${discountBadge}

  <!-- Footer -->
  <rect x="0" y="${H - 48}" width="${W}" height="48" fill="${BRAND_COLOR}"/>
  <text x="30" y="${H - 18}" font-family="Arial,sans-serif" font-size="16" fill="#a0c4e8">Oferta detectada automáticamente · Sin patrocinio</text>
  <text x="${W - 30}" y="${H - 18}" font-family="Arial,sans-serif" font-size="16" fill="#a0c4e8" text-anchor="end">#chollo #domótica #energia</text>
</svg>`

  const layers: sharp.OverlayOptions[] = [
    { input: Buffer.from(svg), top: 0, left: 0 },
  ]

  if (resizedProduct) {
    // Centrar imagen del producto en la zona izquierda
    const meta = await sharp(resizedProduct).metadata()
    const pw = meta.width ?? 560
    const ph = meta.height ?? 500
    const left = Math.round((610 - pw) / 2)
    const top = Math.round(68 + (H - 68 - 48 - ph) / 2)
    layers.push({ input: resizedProduct, top, left })
  }

  return sharp({
    create: { width: W, height: H, channels: 3, background: '#ffffff' },
  })
    .composite(layers)
    .jpeg({ quality: 88 })
    .toBuffer()
}
