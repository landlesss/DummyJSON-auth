import { IconSearch } from './ProductsIcons.tsx'

type ProductsHeaderProps = {
  query: string
  onQueryChange: (value: string) => void
  onLogout: () => void
  isFetching: boolean
}

export function ProductsHeader({
  query,
  onQueryChange,
  onLogout,
  isFetching,
}: ProductsHeaderProps) {
  return (
    <header className="productsHeader">
      <div className="productsHeaderInner">
        <h1 className="productsPageTitle">Товары</h1>
        <div className="productsSearchSlot">
          <div className="productsSearchPill">
            <IconSearch />
            <input
              className="productsSearchInput"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Найти"
              aria-label="Поиск товаров"
            />
          </div>
        </div>
        <div className="productsHeaderExit">
          <button type="button" className="productsLogout" onClick={onLogout}>
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
  )
}
