export type Product = {
  id: number
  title: string
  price: number
  rating: number
  brand: string
  sku: string
  category: string
  thumbnail: string
}

export type ProductsResponse = {
  products: Array<{
    id: number
    title: string
    price: number
    rating: number
    brand?: string
    sku?: string
    category?: string
    thumbnail?: string
  }>
  total: number
  skip: number
  limit: number
}
