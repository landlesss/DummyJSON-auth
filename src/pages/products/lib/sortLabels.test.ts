import { describe, expect, it } from 'vitest'
import { formatSortStateDescription } from './sortLabels.ts'

describe('formatSortStateDescription', () => {
  it('описывает активный столбец и направление', () => {
    const t = formatSortStateDescription({ key: 'price', dir: 'desc' })
    expect(t).toContain('Цена')
    expect(t).toContain('убыванию')
  })
})
