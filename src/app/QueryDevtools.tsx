import { lazy, Suspense } from 'react'

const ReactQueryDevtools = lazy(async () => {
  const mod = await import('@tanstack/react-query-devtools')
  return { default: mod.ReactQueryDevtools }
})

/** В production-бандл не попадает: вызов только при import.meta.env.DEV. */
export function QueryDevtools() {
  if (!import.meta.env.DEV) {
    return null
  }
  return (
    <Suspense fallback={null}>
      <ReactQueryDevtools initialIsOpen={false} />
    </Suspense>
  )
}
