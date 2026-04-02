import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { fetchProducts } from './productsApi.ts'
import type { Product } from './productsTypes.ts'
import { useDebouncedValue } from '../../shared/hooks/useDebouncedValue.ts'
import { useAuth } from '../../shared/auth/useAuth.ts'
import { AddProductModal } from './AddProductModal.tsx'

type SortKey = 'title' | 'price' | 'rating' | 'brand' | 'sku'
type SortDir = 'asc' | 'desc'

const PAGE_SIZE = 20

const CATEGORY_RU: Record<string, string> = {
  smartphones: 'Телефоны',
  tablets: 'Планшеты',
  laptops: 'Ноутбуки',
  groceries: 'Продукты',
  'home-decoration': 'Для дома',
  fragrances: 'Парфюмерия',
  skincare: 'Уход',
  'mobile-accessories': 'Аксессуары',
  beauty: 'Красота',
  furniture: 'Мебель',
  'kitchen-accessories': 'Бытовая техника',
  watches: 'Часы',
  accessories: 'Аксессуары',
  automotive: 'Авто',
  motorcycle: 'Мото',
  lighting: 'Свет',
  electronics: 'Электроника',
  gaming: 'Игровые приставки',
  'mens-watches': 'Часы',
  sunglasses: 'Аксессуары',
  sports: 'Спорт',
}

const priceRu = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatPriceRub(value: number): string {
  return priceRu.format(value)
}

function categorySubtitle(raw: string): string {
  if (!raw || raw === '—') return '—'
  return CATEGORY_RU[raw] ?? raw.split('-').filter(Boolean).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
}

function sortProducts(items: Product[], sort: { key: SortKey; dir: SortDir }): Product[] {
  const dir = sort.dir === 'asc' ? 1 : -1
  const copy = [...items]
  copy.sort((a, b) => {
    const ka = a[sort.key]
    const kb = b[sort.key]
    if (typeof ka === 'number' && typeof kb === 'number') return (ka - kb) * dir
    return String(ka).localeCompare(String(kb), 'ru', { sensitivity: 'base' }) * dir
  })
  return copy
}

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M8.25 14.25a6 6 0 100-12 6 6 0 000 12zM15 15l-3.2-3.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconRefresh() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M3.2 7.5A6.8 6.8 0 0114 4.6M14.8 10.5A6.8 6.8 0 014 13.4M14.8 10.5V7M14.8 10.5h-3.3M4 13.4v3M4 13.4h3.3"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconPlusCircle({ light }: { light?: boolean }) {
  return (
    <span className={light ? 'productsPlusIcon productsPlusIcon--light' : 'productsPlusIcon'} aria-hidden>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  )
}

function RowDotsMenu() {
  return (
    <span className="productsRowDots" aria-hidden>
      <span />
      <span />
      <span />
    </span>
  )
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function visiblePageRange(current: number, total: number, max = 5): number[] {
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1)
  const start = Math.min(Math.max(1, current - Math.floor(max / 2)), total - max + 1)
  return Array.from({ length: max }, (_, i) => start + i)
}

export function ProductsPage() {
  const auth = useAuth()
  const qc = useQueryClient()

  const [q, setQ] = useState('')
  const debouncedQ = useDebouncedValue(q, 350)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: 'title',
    dir: 'asc',
  })
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [created, setCreated] = useState<Product[]>([])
  const [apiTotalCache, setApiTotalCache] = useState(0)

  const capCreated = Math.min(created.length, PAGE_SIZE)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- сброс кэша total при новом поисковом запросе
    setApiTotalCache(0)
  }, [debouncedQ])

  const totalPages = Math.max(1, Math.ceil((apiTotalCache + created.length) / PAGE_SIZE))
  const activePage = Math.min(Math.max(1, page), totalPages)

  const apiSkip = Math.max(0, (activePage - 1) * PAGE_SIZE - capCreated)
  const apiLimit = activePage === 1 ? PAGE_SIZE - capCreated : PAGE_SIZE

  const query = useQuery({
    queryKey: [
      'products',
      {
        q: debouncedQ,
        limit: apiLimit,
        skip: apiSkip,
        sortBy: sort.key,
        order: sort.dir,
        activePage,
        capCreated,
      },
    ],
    queryFn: async () => {
      if (activePage === 1 && apiLimit <= 0) {
        const r = await fetchProducts({
          q: debouncedQ,
          limit: 1,
          skip: 0,
          sortBy: sort.key,
          order: sort.dir,
        })
        return { items: [], total: r.total, limit: 0, skip: 0 }
      }
      return fetchProducts({
        q: debouncedQ,
        limit: apiLimit,
        skip: apiSkip,
        sortBy: sort.key,
        order: sort.dir,
      })
    },
  })

  useEffect(() => {
    if (typeof query.data?.total === 'number') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- total из ответа API для пагинации
      setApiTotalCache(query.data.total)
    }
  }, [query.data?.total])

  const totalCount = (query.data?.total ?? apiTotalCache) + created.length

  const isFetching = query.isFetching

  const tableRows = useMemo(() => {
    const apiItems = query.data?.items ?? []
    const sortedCreated = sortProducts(created, sort)
    if (activePage === 1 && capCreated > 0) {
      return [...sortedCreated.slice(0, capCreated), ...apiItems]
    }
    return apiItems
  }, [activePage, capCreated, created, query.data?.items, sort])

  const rowFrom = totalCount === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1
  const rowTo = totalCount === 0 ? 0 : Math.min(activePage * PAGE_SIZE, totalCount)

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
    )
    setPage(1)
  }

  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: ['products'] })
    toast.success('Обновлено')
  }

  const selectRow = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="appShell productsScreen">
      <header className="productsHeader">
        <div className="productsHeaderInner">
          <h1 className="productsPageTitle">Товары</h1>
          <div className="productsSearchSlot">
            <div className="productsSearchPill">
              <IconSearch />
              <input
                className="productsSearchInput"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setPage(1)
                }}
                placeholder="Найти"
                aria-label="Поиск товаров"
              />
            </div>
          </div>
          <div className="productsHeaderExit">
            <button type="button" className="productsLogout" onClick={auth.logout}>
              Выйти
            </button>
          </div>
        </div>
        {isFetching ? (
          <div className="progressBar">
            <div />
          </div>
        ) : null}
      </header>

      <main className="page productsMain">
        <section className="productsPanel card">
          <div className="productsPanelTop">
            <h2 className="productsSectionTitle">Все позиции</h2>
            <div className="productsToolbar">
              <button
                type="button"
                className="productsIconBtn"
                title="Обновить"
                aria-label="Обновить таблицу"
                onClick={() => void refresh()}
              >
                <IconRefresh />
              </button>
              <button type="button" className="productsAddBtn" onClick={() => setAddOpen(true)}>
                <IconPlusCircle light />
                Добавить
              </button>
            </div>
          </div>

          {query.isError ? (
            <div className="formError productsError">
              Ошибка загрузки: {query.error instanceof Error ? query.error.message : 'unknown'}
            </div>
          ) : null}

          <div className="productsTableScroll">
            <table className="productsTable">
              <thead>
                <tr>
                  <th className="productsTh productsTh--check" aria-hidden />
                  <th className="productsTh productsTh--thumb" aria-hidden />
                  <th className="productsTh">
                    <button type="button" className="productsThBtn" onClick={() => toggleSort('title')}>
                      Наименование
                    </button>
                  </th>
                  <th className="productsTh">
                    <button type="button" className="productsThBtn" onClick={() => toggleSort('brand')}>
                      Вендор
                    </button>
                  </th>
                  <th className="productsTh">
                    <button type="button" className="productsThBtn" onClick={() => toggleSort('sku')}>
                      Артикул
                    </button>
                  </th>
                  <th className="productsTh productsTh--right">
                    <button type="button" className="productsThBtn" onClick={() => toggleSort('rating')}>
                      Оценка
                    </button>
                  </th>
                  <th className="productsTh productsTh--right">
                    <button type="button" className="productsThBtn" onClick={() => toggleSort('price')}>
                      Цена, ₽
                    </button>
                  </th>
                  <th className="productsTh productsTh--actions" aria-hidden />
                </tr>
              </thead>
              <tbody>
                {query.isLoading ? (
                  <tr>
                    <td colSpan={8} className="productsTdEmpty">
                      Загружаем товары…
                    </td>
                  </tr>
                ) : tableRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="productsTdEmpty">
                      Ничего не найдено
                    </td>
                  </tr>
                ) : (
                  tableRows.map((p) => {
                    const selected = selectedId === p.id
                    return (
                      <tr
                        key={p.id}
                        className={selected ? 'productsTr productsTr--selected' : 'productsTr'}
                        onClick={() => selectRow(p.id)}
                      >
                        <td className="productsTd productsTd--check">
                          <input
                            type="checkbox"
                            className="productsCheckbox"
                            checked={selected}
                            onChange={() => selectRow(p.id)}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Выбрать ${p.title}`}
                          />
                        </td>
                        <td className="productsTd productsTd--thumb">
                          {p.thumbnail ? (
                            <img
                              className="productsThumb"
                              src={p.thumbnail}
                              alt=""
                              loading="lazy"
                            />
                          ) : (
                            <div className="productsThumb productsThumb--placeholder" aria-hidden />
                          )}
                        </td>
                        <td className="productsTd productsTd--title">
                          <div className="productsTitleCell">
                            <span className="productsTitleMain">{p.title}</span>
                            <span className="productsTitleSub">{categorySubtitle(p.category)}</span>
                          </div>
                        </td>
                        <td className="productsTd">
                          <span className="productsVendor">{p.brand}</span>
                        </td>
                        <td className="productsTd productsTd--sku">{p.sku}</td>
                        <td className="productsTd productsTd--right">
                          <span
                            className={
                              p.rating < 3.5 ? 'productsRating productsRating--bad' : 'productsRating productsRating--ok'
                            }
                          >
                            {p.rating.toFixed(1)}/5
                          </span>
                        </td>
                        <td className="productsTd productsTd--right productsTd--price">
                          {formatPriceRub(p.price)}
                        </td>
                        <td className="productsTd productsTd--actions">
                          <div className="productsRowActions">
                            <button
                              type="button"
                              className="productsRowAddStub"
                              title="Заглушка"
                              aria-label="Действие"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <IconPlusCircle />
                            </button>
                            <button
                              type="button"
                              className="productsRowMenuStub"
                              title="Меню"
                              aria-label="Меню строки"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <RowDotsMenu />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <footer className="productsFooter">
            <p className="productsFooterInfo">
              Показано {rowFrom}–{rowTo} из {totalCount}
            </p>
            <nav className="productsPagination" aria-label="Страницы">
              <button
                type="button"
                className="productsPageNav"
                disabled={activePage <= 1}
                aria-label="Назад"
                onClick={() => setPage(Math.max(1, activePage - 1))}
              >
                <ChevronLeft />
              </button>
              {visiblePageRange(activePage, totalPages).map((pNum) => (
                <button
                  key={pNum}
                  type="button"
                  className={
                    pNum === activePage ? 'productsPageBtn productsPageBtn--active' : 'productsPageBtn'
                  }
                  onClick={() => setPage(pNum)}
                >
                  {pNum}
                </button>
              ))}
              <button
                type="button"
                className="productsPageNav"
                disabled={activePage >= totalPages}
                aria-label="Вперёд"
                onClick={() => setPage(Math.min(totalPages, activePage + 1))}
              >
                <ChevronRight />
              </button>
            </nav>
          </footer>
        </section>
      </main>

      <AddProductModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(p) => {
          setCreated((prev) => [p, ...prev])
          setPage(1)
        }}
      />
    </div>
  )
}
