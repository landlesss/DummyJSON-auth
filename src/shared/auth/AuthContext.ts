import { createContext } from 'react'
import type { AuthSession } from './authTypes.ts'

export type AuthContextValue = {
  session: AuthSession | null
  isAuthed: boolean
  token: string | null
  login: (input: {
    username: string
    password: string
    remember: boolean
  }) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

