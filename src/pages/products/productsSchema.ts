import { z } from 'zod'

/** Элемент массива products в ответе DummyJSON. */
export const productDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  rating: z.number(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  category: z.string().optional(),
  thumbnail: z.string().optional(),
})

export const productsResponseSchema = z.object({
  products: z.array(productDtoSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
})

export type ProductDto = z.infer<typeof productDtoSchema>
