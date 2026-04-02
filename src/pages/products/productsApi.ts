import { dummyjsonUrl } from '../../shared/api/dummyjson.ts'
import { httpJson } from '../../shared/api/http.ts'
import type { Product, ProductsResponse } from './productsTypes.ts'

function mapProduct(p: ProductsResponse['products'][number]): Product {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    rating: p.rating,
    brand: p.brand ?? '—',
    sku: p.sku ?? '—',
    category: p.category ?? '—',
    thumbnail: p.thumbnail ?? '',
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
  const res = await httpJson<ProductsResponse>(url)

  return {
    items: res.products.map(mapProduct),
    total: res.total,
    limit: res.limit,
    skip: res.skip,
  }
}
