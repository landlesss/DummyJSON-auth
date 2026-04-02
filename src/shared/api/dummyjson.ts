const DUMMYJSON_BASE = 'https://dummyjson.com'

export function dummyjsonUrl(path: string): string {
  if (!path.startsWith('/')) return `${DUMMYJSON_BASE}/${path}`
  return `${DUMMYJSON_BASE}${path}`
}

