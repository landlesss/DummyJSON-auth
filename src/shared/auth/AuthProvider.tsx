import React, { useCallback, useMemo, useState } from 'react'
import type { AuthSession, AuthStorageMode } from './authTypes.ts'
import { clearSession, readSession, writeSession } from './authStorage.ts'
import { loginWithDummyJson } from './authApi.ts'
import { AuthContext, type AuthContextValue } from './AuthContext.ts'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => readSession())

  const login = useCallback(
    async (input: { username: string; password: string; remember: boolean }) => {
      const next = await loginWithDummyJson({
        username: input.username,
        password: input.password,
      })
      const mode: AuthStorageMode = input.remember ? 'local' : 'session'
      writeSession(next, mode)
      setSession(next)
    },
    [],
  )

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthed: Boolean(session?.token),
      token: session?.token ?? null,
      login,
      logout,
    }),
    [login, logout, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

