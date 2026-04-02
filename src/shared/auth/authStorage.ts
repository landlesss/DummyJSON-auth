import type { AuthSession, AuthStorageMode } from './authTypes.ts'
import { storedSessionSchema } from './sessionSchema.ts'

const STORAGE_KEY = 'aitiGuru.auth.session.v1'

type StoredSession = {
  token: string
  user: AuthSession['user']
  mode: AuthStorageMode
}

function getStorage(mode: AuthStorageMode): Storage {
  return mode === 'local' ? localStorage : sessionStorage
}

function tryParseStoredSession(raw: string): AuthSession | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  const r = storedSessionSchema.safeParse(parsed)
  if (!r.success) {
    return null
  }
  return { token: r.data.token, user: r.data.user }
}

export function readSession(): AuthSession | null {
  const fromLocal = localStorage.getItem(STORAGE_KEY)
  if (fromLocal) {
    const session = tryParseStoredSession(fromLocal)
    if (session) return session
    localStorage.removeItem(STORAGE_KEY)
  }

  const fromSession = sessionStorage.getItem(STORAGE_KEY)
  if (fromSession) {
    const session = tryParseStoredSession(fromSession)
    if (session) return session
    sessionStorage.removeItem(STORAGE_KEY)
  }

  return null
}

export function writeSession(session: AuthSession, mode: AuthStorageMode): void {
  clearSession()
  const storage = getStorage(mode)
  const payload: StoredSession = { ...session, mode }
  storage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(STORAGE_KEY)
}
