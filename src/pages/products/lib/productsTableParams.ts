export const PRODUCTS_PAGE_SIZE = 20

/** Сколько локально созданных строк показываем максимум на первой странице. */
export function capCreatedRows(createdCount: number, pageSize = PRODUCTS_PAGE_SIZE): number {
  return Math.min(createdCount, pageSize)
}

export function computeProductsApiWindow(input: {
  activePage: number
  pageSize: number
  createdCount: number
}): { capCreated: number; apiSkip: number; apiLimit: number } {
  const capCreated = capCreatedRows(input.createdCount, input.pageSize)
  const apiSkip = Math.max(0, (input.activePage - 1) * input.pageSize - capCreated)
  const apiLimit = input.activePage === 1 ? input.pageSize - capCreated : input.pageSize
  return { capCreated, apiSkip, apiLimit }
}
