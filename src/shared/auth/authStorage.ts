import type { AuthSession, AuthStorageMode } from './authTypes.ts'

const STORAGE_KEY = 'aitiGuru.auth.session.v1'

type StoredSession = {
  token: string
  user: AuthSession['user']
  mode: AuthStorageMode
}

function getStorage(mode: AuthStorageMode): Storage {
  return mode === 'local' ? localStorage : sessionStorage
}

export function readSession(): AuthSession | null {
  const fromLocal = localStorage.getItem(STORAGE_KEY)
  if (fromLocal) {
    const parsed = JSON.parse(fromLocal) as StoredSession
    return { token: parsed.token, user: parsed.user }
  }

  const fromSession = sessionStorage.getItem(STORAGE_KEY)
  if (fromSession) {
    const parsed = JSON.parse(fromSession) as StoredSession
    return { token: parsed.token, user: parsed.user }
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

