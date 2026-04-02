import { useIsFetching } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuth } from '../../shared/auth/useAuth.ts'
import { useDebouncedValue } from '../../shared/hooks/useDebouncedValue.ts'
import type { Product } from './productsTypes.ts'
import type { SortDir, SortKey } from './lib/sortProducts.ts'
import { PRODUCTS_LIST_ROOT_KEY } from './lib/queryKeys.ts'
import { ProductsHeader } from './components/ProductsHeader.tsx'
import { ProductsPanel } from './components/ProductsPanel.tsx'

export function ProductsPage() {
  const auth = useAuth()
  const [q, setQ] = useState('')
  const debouncedQ = useDebouncedValue(q, 350)
  const [created, setCreated] = useState<Product[]>([])
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: 'title',
    dir: 'asc',
  })

  const panelKey = `${debouncedQ}::${sort.key}::${sort.dir}`
  const isListFetching = useIsFetching({ queryKey: [...PRODUCTS_LIST_ROOT_KEY] }) > 0

  return (
    <div className="appShell productsScreen">
      <ProductsHeader
        query={q}
        onQueryChange={setQ}
        onLogout={auth.logout}
        isFetching={isListFetching}
      />
      <main className="page productsMain">
        <ProductsPanel
          key={panelKey}
          debouncedQ={debouncedQ}
          sort={sort}
          onSortChange={setSort}
          created={created}
          onCreatedAdd={(p) => setCreated((prev) => [p, ...prev])}
        />
      </main>
    </div>
  )
}
