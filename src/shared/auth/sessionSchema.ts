import { z } from 'zod'

/** Профиль пользователя после логина (ответ DummyJSON). */
export const authUserSchema = z.object({
  id: z.number(),
  username: z.string().min(1),
  firstName: z.string(),
  lastName: z.string(),
  image: z.string(),
})

export const authStorageModeSchema = z.enum(['local', 'session'])

export const storedSessionSchema = z.object({
  token: z.string().min(1),
  user: authUserSchema,
  mode: authStorageModeSchema,
})

export type StoredSessionParsed = z.infer<typeof storedSessionSchema>

/** Ответ POST /auth/login (DummyJSON). */
export const dummyJsonLoginResponseSchema = z
  .object({
    id: z.number(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    image: z.string(),
    accessToken: z.string().optional(),
    token: z.string().optional(),
  })
  .refine((d) => Boolean(d.accessToken ?? d.token), {
    message: 'В ответе нет токена авторизации',
  })
