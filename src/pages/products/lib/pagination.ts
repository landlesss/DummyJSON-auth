export function visiblePageRange(current: number, total: number, max = 5): number[] {
  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const start = Math.min(
    Math.max(1, current - Math.floor(max / 2)),
    total - max + 1,
  )
  return Array.from({ length: max }, (_, i) => start + i)
}
