import { describe, expect, it } from 'vitest'
import { computeProductsApiWindow, PRODUCTS_PAGE_SIZE } from './productsTableParams.ts'

describe('computeProductsApiWindow', () => {
  it('на первой странице уменьшает limit под локально созданные строки', () => {
    expect(
      computeProductsApiWindow({
        activePage: 1,
        pageSize: PRODUCTS_PAGE_SIZE,
        createdCount: 3,
      }),
    ).toEqual({
      capCreated: 3,
      apiSkip: 0,
      apiLimit: PRODUCTS_PAGE_SIZE - 3,
    })
  })

  it('при полной первой странице из created даёт apiLimit 0', () => {
    const w = computeProductsApiWindow({
      activePage: 1,
      pageSize: 5,
      createdCount: 5,
    })
    expect(w.apiLimit).toBe(0)
    expect(w.apiSkip).toBe(0)
  })

  it('на второй странице skip учитывает «занятые» created слоты', () => {
    expect(
      computeProductsApiWindow({
        activePage: 2,
        pageSize: 20,
        createdCount: 3,
      }),
    ).toEqual({
      capCreated: 3,
      apiSkip: 20 - 3,
      apiLimit: 20,
    })
  })
})
