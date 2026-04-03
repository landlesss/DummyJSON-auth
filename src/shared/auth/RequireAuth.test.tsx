import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './RequireAuth.tsx'
import { AuthContext, type AuthContextValue } from './AuthContext.ts'

function renderWithAuth(isAuthed: boolean, initialPath = '/products') {
  const value: AuthContextValue = {
    session: isAuthed
      ? {
          token: 't',
          user: {
            id: 1,
            username: 'u',
            firstName: 'A',
            lastName: 'B',
            image: '',
          },
        }
      : null,
    isAuthed,
    token: isAuthed ? 't' : null,
    login: async () => {},
    logout: () => {},
  }
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="/products"
            element={
              <RequireAuth>
                <div>protected</div>
              </RequireAuth>
            }
          />
          <Route path="/login" element={<div>login-page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('RequireAuth', () => {
  it('пускает при сессии', () => {
    renderWithAuth(true)
    expect(screen.getByText('protected')).toBeInTheDocument()
  })

  it('редиректит на /login без сессии', () => {
    renderWithAuth(false)
    expect(screen.getByText('login-page')).toBeInTheDocument()
  })
})
