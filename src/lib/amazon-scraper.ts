import * as cheerio from 'cheerio'

export interface AmazonProduct {
  title: string
  image: string
  currentPrice: number | null
  originalPrice: number | null
  discountPercent: number | null
  asin: string
  url: string
}

function parsePrice(text: string): number | null {
  const clean = text.replace(/[^\d,.]/g, '').replace(',', '.')
  const num = parseFloat(clean)
  return isNaN(num) || num <= 0 ? null : num
}

function extractAsin(url: string): string {
  const m = url.match(/\/dp\/([A-Z0-9]{10})/)
  return m ? m[1] : ''
}

export async function scrapeAmazon(url: string): Promise<AmazonProduct | null> {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept-Language': 'es-ES,es;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  })
  if (!res.ok) return null

  const html = await res.text()
  const $ = cheerio.load(html)

  const title = $('#productTitle').text().trim()
  if (!title) return null

  // Imagen principal del producto
  const imgEl = $('#landingImage')
  const imageRaw =
    imgEl.attr('data-old-hires') || imgEl.attr('data-src') || imgEl.attr('src') || ''
  // Si hay JSON con la imagen de alta resolución
  let image = imageRaw
  const dynJson = imgEl.attr('data-a-dynamic-image')
  if (dynJson) {
    try {
      const urls = Object.keys(JSON.parse(dynJson))
      if (urls.length) image = urls[0]
    } catch {
      // ignorar
    }
  }

  // Precio actual
  let currentPrice: number | null = null
  const priceSelectors = [
    '#priceblock_dealprice',
    '#priceblock_ourprice',
    '.a-price[data-a-color="price"] .a-offscreen',
    '.a-price .a-offscreen',
    '#corePrice_feature_div .a-price .a-offscreen',
  ]
  for (const sel of priceSelectors) {
    const val = parsePrice($(sel).first().text())
    if (val) { currentPrice = val; break }
  }

  // Precio original (tachado)
  let originalPrice: number | null = null
  const origSelectors = [
    '.a-text-strike .a-offscreen',
    '.a-price.a-text-price .a-offscreen',
    '#priceblock_saleprice',
    '#listPrice',
    '.a-price[data-a-strike="true"] .a-offscreen',
  ]
  for (const sel of origSelectors) {
    const val = parsePrice($(sel).first().text())
    if (val && val !== currentPrice) { originalPrice = val; break }
  }

  const discountPercent =
    currentPrice && originalPrice && originalPrice > currentPrice
      ? Math.round((1 - currentPrice / originalPrice) * 100)
      : null

  return {
    title,
    image,
    currentPrice,
    originalPrice,
    discountPercent,
    asin: extractAsin(url),
    url,
  }
}
