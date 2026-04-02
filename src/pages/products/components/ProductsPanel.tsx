import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { fetchProducts } from '../productsApi.ts'
import type { Product } from '../productsTypes.ts'
import { categorySubtitle } from '../lib/categoryLabels.ts'
import { formatPriceRub } from '../lib/formatPrice.ts'
import type { SortDir, SortKey } from '../lib/sortProducts.ts'
import { sortLocalProducts } from '../lib/sortProducts.ts'
import { visiblePageRange } from '../lib/pagination.ts'
import { PRODUCTS_LIST_ROOT_KEY } from '../lib/queryKeys.ts'
import { AddProductModal } from '../AddProductModal.tsx'
import {
  ChevronLeft,
  ChevronRight,
  IconPlusCircle,
  RowDotsMenu,
} from './ProductsIcons.tsx'

const PAGE_SIZE = 20

type ProductsPanelProps = {
  debouncedQ: string
  sort: { key: SortKey; dir: SortDir }
  onSortChange: React.Dispatch<React.SetStateAction<{ key: SortKey; dir: SortDir }>>
  created: Product[]
  onCreatedAdd: (p: Product) => void
}

export function ProductsPanel({
  debouncedQ,
  sort,
  onSortChange,
  created,
  onCreatedAdd,
}: ProductsPanelProps) {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [apiTotalCache, setApiTotalCache] = useState(0)

  const capCreated = Math.min(created.length, PAGE_SIZE)

  const totalPages = Math.max(1, Math.ceil((apiTotalCache + created.length) / PAGE_SIZE))
  const activePage = Math.min(Math.max(1, page), totalPages)

  const apiSkip = Math.max(0, (activePage - 1) * PAGE_SIZE - capCreated)
  const apiLimit = activePage === 1 ? PAGE_SIZE - capCreated : PAGE_SIZE

  const query = useQuery({
    queryKey: [
      ...PRODUCTS_LIST_ROOT_KEY,
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
        return { items: [] as Product[], total: r.total, limit: 0, skip: 0 }
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setApiTotalCache(query.data.total)
    }
  }, [query.data?.total])

  const totalCount = (query.data?.total ?? apiTotalCache) + created.length

  const tableRows = useMemo(() => {
    const apiItems = query.data?.items ?? []
    const sortedCreated = sortLocalProducts(created, sort)
    if (activePage === 1 && capCreated > 0) {
      return [...sortedCreated.slice(0, capCreated), ...apiItems]
    }
    return apiItems
  }, [activePage, capCreated, created, query.data?.items, sort])

  const rowFrom = totalCount === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1
  const rowTo = totalCount === 0 ? 0 : Math.min(activePage * PAGE_SIZE, totalCount)

  const toggleSort = (key: SortKey) => {
    onSortChange((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
    )
  }

  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: [...PRODUCTS_LIST_ROOT_KEY] })
    toast.success('Обновлено')
  }

  const selectRow = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  return (
    <>
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
              <img
                src="/ArrowsClockwise.svg"
                alt=""
                width={22}
                height={22}
                className="productsIconBtnGraphic"
                aria-hidden
              />
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
                            p.rating < 3.5
                              ? 'productsRating productsRating--bad'
                              : 'productsRating productsRating--ok'
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

      <AddProductModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(p) => {
          onCreatedAdd(p)
          setPage(1)
        }}
      />
    </>
  )
}
