#Product admin (React)

Small admin-style UI for browsing products: authentication, searchable sortable table, and local “add product” flow. Data from [DummyJSON](https://dummyjson.com).

## Stack

- **React** 18+ (built with React 19)
- **TypeScript** (strict mode)
- **React Router**
- **TanStack Query** — data fetching and caching
- **react-hot-toast** — notifications
- **Zod** — runtime validation for API payloads and session storage

## Getting started

```bash
npm install
npm run dev
```

```bash
npm test      # Vitest
npm run lint
npm run build
```

## Authentication (DummyJSON)

Uses `DummyJSON Auth` — `POST /auth/login`.

- **Remember me on** — session token in `localStorage` (survives closing the browser).
- **Remember me off** — token in `sessionStorage` (cleared when the tab/session ends).

Use any user from [dummyjson.com/users](https://dummyjson.com/users) (username + password from the API). Example from DummyJSON docs:

- Username: `emilys`
- Password: `emilyspass`

> Some older tutorials mention `kminchelle` — that user is not in the current DummyJSON dataset; login returns **400 Invalid credentials**.

## Products

Backed by **DummyJSON Products**.

- Paginated list with a top **progress bar** while requests are in flight
- **Search** via API (`/products/search?q=...`)
- **Sorting** by column (server-side `sortBy` / `order`); direction can also be toggled from the toolbar control
- **Add product** — modal with title, price, vendor, SKU; new rows are kept **in memory only** (no POST to the API); success **toast**
- Ratings **below 3.5** highlighted in red
- Row **⋮** control is a **placeholder** (per spec)

## AI-assisted development disclosure

Core implementation was written by the author; AI was **not** used to generate the whole codebase.

**Where AI helped** (Cursor assistant): reviewing existing code against requirements, running through tests and linter output, and high-level suggestions for improvements.

**Example prompt themes:** “check against the spec”, “run tests and fix failures”, “review edge cases”, targeted questions about build or runtime errors.
