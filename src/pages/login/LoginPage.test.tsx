import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage.tsx'
import { AuthContext, type AuthContextValue } from '../../shared/auth/AuthContext.ts'

describe('LoginPage', () => {
  it('показывает ошибку валидации для пустого логина', async () => {
    const user = userEvent.setup()
    const login = vi.fn<AuthContextValue['login']>()
    const value: AuthContextValue = {
      session: null,
      isAuthed: false,
      token: null,
      login,
      logout: () => {},
    }
    render(
      <AuthContext.Provider value={value}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthContext.Provider>,
    )

    await user.click(screen.getByRole('button', { name: /войти/i }))
    expect(await screen.findByText('Укажите логин')).toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })
})
