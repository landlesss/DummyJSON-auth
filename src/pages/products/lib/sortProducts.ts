import type { Product } from '../productsTypes.ts'

export type SortKey = 'title' | 'price' | 'rating' | 'brand' | 'sku'
export type SortDir = 'asc' | 'desc'

export function sortLocalProducts(
  items: Product[],
  sort: { key: SortKey; dir: SortDir },
): Product[] {
  const dir = sort.dir === 'asc' ? 1 : -1
  const copy = [...items]
  copy.sort((a, b) => {
    const ka = a[sort.key]
    const kb = b[sort.key]
    if (typeof ka === 'number' && typeof kb === 'number') {
      return (ka - kb) * dir
    }
    return String(ka).localeCompare(String(kb), 'ru', { sensitivity: 'base' }) * dir
  })
  return copy
}
