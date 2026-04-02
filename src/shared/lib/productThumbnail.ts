/**
 * Разрешённые хосты для превью товаров (ответ API + наш же origin не используется).
 * Сужает класс атак при подстановке произвольного URL в <img src>.
 */
const ALLOWED_THUMBNAIL_HOSTS = new Set([
  'cdn.dummyjson.com',
  'dummyjson.com',
  'www.dummyjson.com',
])

export function sanitizeProductThumbnailUrl(raw: string | undefined | null): string | undefined {
  const s = raw?.trim()
  if (!s) return undefined
  try {
    const u = new URL(s)
    if (u.protocol !== 'https:') return undefined
    if (!ALLOWED_THUMBNAIL_HOSTS.has(u.hostname)) return undefined
    return u.toString()
  } catch {
    return undefined
  }
}
