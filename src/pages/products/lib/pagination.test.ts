import { describe, expect, it } from 'vitest'
import { visiblePageRange } from './pagination.ts'

describe('visiblePageRange', () => {
  it('возвращает все страницы если их мало', () => {
    expect(visiblePageRange(2, 4, 5)).toEqual([1, 2, 3, 4])
  })

  it('центрирует окно вокруг текущей страницы', () => {
    expect(visiblePageRange(5, 12)).toEqual([3, 4, 5, 6, 7])
  })
})
