export type AuthUser = {
  id: number
  username: string
  firstName: string
  lastName: string
  image: string
}

export type AuthSession = {
  token: string
  user: AuthUser
}

export type AuthStorageMode = 'local' | 'session'

