import type { SortDir, SortKey } from './sortProducts.ts'

const keyLabels: Record<SortKey, string> = {
  title: 'Наименование',
  brand: 'Вендор',
  sku: 'Артикул',
  rating: 'Оценка',
  price: 'Цена',
}

/** Текст для screen reader: текущая сортировка и где её менять. */
export function formatSortStateDescription(sort: { key: SortKey; dir: SortDir }): string {
  const col = keyLabels[sort.key]
  const order = sort.dir === 'asc' ? 'по возрастанию' : 'по убыванию'
  return `Активная сортировка: ${col}, ${order}. Порядок можно изменить в заголовках столбцов таблицы.`
}
