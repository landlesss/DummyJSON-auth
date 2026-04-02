import { dummyjsonUrl } from '../api/dummyjson.ts'
import { httpJson } from '../api/http.ts'
import type { AuthSession, AuthUser } from './authTypes.ts'

type DummyJsonLoginResponse = {
  id: number
  username: string
  firstName: string
  lastName: string
  image: string
  accessToken?: string
  token?: string
}

export async function loginWithDummyJson(input: {
  username: string
  password: string
}): Promise<AuthSession> {
  const res = await httpJson<DummyJsonLoginResponse>(dummyjsonUrl('/auth/login'), {
    method: 'POST',
    body: {
      username: input.username,
      password: input.password,
      // DummyJSON allows this to get cookies; we don't need cookies.
      expiresInMins: 60,
    },
  })

  const token = res.accessToken ?? res.token
  if (!token) {
    throw new Error('Auth token missing in response')
  }

  const user: AuthUser = {
    id: res.id,
    username: res.username,
    firstName: res.firstName,
    lastName: res.lastName,
    image: res.image,
  }

  return { token, user }
}

