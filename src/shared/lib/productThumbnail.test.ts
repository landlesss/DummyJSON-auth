import { describe, expect, it } from 'vitest'
import { sanitizeProductThumbnailUrl } from './productThumbnail.ts'

describe('sanitizeProductThumbnailUrl', () => {
  it('пропускает https с cdn.dummyjson.com', () => {
    expect(
      sanitizeProductThumbnailUrl(
        'https://cdn.dummyjson.com/product-images/beauty/x/thumbnail.webp',
      ),
    ).toBe('https://cdn.dummyjson.com/product-images/beauty/x/thumbnail.webp')
  })

  it('отклоняет не-https', () => {
    expect(sanitizeProductThumbnailUrl('http://cdn.dummyjson.com/x.jpg')).toBeUndefined()
  })

  it('отклоняет чужой хост', () => {
    expect(sanitizeProductThumbnailUrl('https://evil.com/a.jpg')).toBeUndefined()
  })

  it('отклоняет javascript: и пустые значения', () => {
    expect(sanitizeProductThumbnailUrl('javascript:alert(1)')).toBeUndefined()
    expect(sanitizeProductThumbnailUrl('')).toBeUndefined()
    expect(sanitizeProductThumbnailUrl(null)).toBeUndefined()
  })
})
