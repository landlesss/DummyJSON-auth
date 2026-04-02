import { dummyjsonUrl } from '../api/dummyjson.ts'
import { ApiError, httpJson } from '../api/http.ts'
import { dummyJsonLoginResponseSchema } from './sessionSchema.ts'
import type { AuthSession, AuthUser } from './authTypes.ts'

export async function loginWithDummyJson(input: {
  username: string
  password: string
}): Promise<AuthSession> {
  const raw = await httpJson<unknown>(dummyjsonUrl('/auth/login'), {
    method: 'POST',
    body: {
      username: input.username,
      password: input.password,
      expiresInMins: 60,
    },
  })

  const parsed = dummyJsonLoginResponseSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join('; ') || 'Некорректный ответ сервера'
    throw new ApiError(msg, 502)
  }

  const res = parsed.data
  const token = res.accessToken ?? res.token
  if (!token) {
    throw new ApiError('Токен авторизации отсутствует', 502)
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
