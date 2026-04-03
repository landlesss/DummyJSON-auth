import { dummyjsonUrl } from '../../shared/api/dummyjson.ts'
import { ApiError, httpJson } from '../../shared/api/http.ts'
import { sanitizeProductThumbnailUrl } from '../../shared/lib/productThumbnail.ts'
import type { ProductDto } from './productsSchema.ts'
import { productsResponseSchema } from './productsSchema.ts'
import type { Product } from './productsTypes.ts'

function mapProduct(p: ProductDto): Product {
  const thumb = sanitizeProductThumbnailUrl(p.thumbnail) ?? ''
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    rating: p.rating,
    brand: p.brand ?? '—',
    sku: p.sku ?? '—',
    category: p.category ?? '—',
    thumbnail: thumb,
  }
}

export type FetchProductsParams = {
  q: string
  limit: number
  skip: number
  sortBy: string
  order: 'asc' | 'desc'
}

export async function fetchProducts(
  input: FetchProductsParams,
): Promise<{ items: Product[]; total: number; limit: number; skip: number }> {
  const q = input.q.trim()
  const base = q.length > 0 ? `/products/search?q=${encodeURIComponent(q)}` : `/products`
  const joiner = base.includes('?') ? '&' : '?'
  const sortParams = `sortBy=${encodeURIComponent(input.sortBy)}&order=${encodeURIComponent(input.order)}`
  const url = dummyjsonUrl(
    `${base}${joiner}limit=${input.limit}&skip=${input.skip}&${sortParams}`,
  )
  const raw = await httpJson<unknown>(url)
  const parsed = productsResponseSchema.safeParse(raw)
  if (!parsed.success) {
    const msg =
      parsed.error.issues.map((i) => i.message).join('; ') || 'Некорректный ответ списка товаров'
    throw new ApiError(msg, 502)
  }
  const res = parsed.data

  return {
    items: res.products.map(mapProduct),
    total: res.total,
    limit: res.limit,
    skip: res.skip,
  }
}
