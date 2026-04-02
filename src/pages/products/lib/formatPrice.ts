const priceRu = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatPriceRub(value: number): string {
  return priceRu.format(value)
}
