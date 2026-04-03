import { describe, expect, it } from 'vitest'
import { productsResponseSchema } from './productsSchema.ts'

describe('productsResponseSchema', () => {
  it('принимает валидный ответ DummyJSON', () => {
    const r = productsResponseSchema.safeParse({
      products: [
        {
          id: 1,
          title: 'x',
          price: 10,
          rating: 4.5,
          brand: 'b',
          sku: 's',
          category: 'c',
          thumbnail: 'https://x.test/t.png',
        },
      ],
      total: 1,
      skip: 0,
      limit: 20,
    })
    expect(r.success).toBe(true)
  })

  it('отклоняет ответ без products', () => {
    const r = productsResponseSchema.safeParse({
      total: 0,
      skip: 0,
      limit: 20,
    })
    expect(r.success).toBe(false)
  })

  it('отбрасывает неверный тип total', () => {
    const r = productsResponseSchema.safeParse({
      products: [],
      total: 'nope',
      skip: 0,
      limit: 20,
    })
    expect(r.success).toBe(false)
  })
})
