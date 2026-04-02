import { describe, expect, it } from 'vitest'
import { storedSessionSchema, dummyJsonLoginResponseSchema } from './sessionSchema.ts'

describe('storedSessionSchema', () => {
  it('принимает валидную сессию', () => {
    const r = storedSessionSchema.safeParse({
      token: 'abc',
      user: {
        id: 1,
        username: 'u',
        firstName: 'A',
        lastName: 'B',
        image: 'https://x.test/i.png',
      },
      mode: 'local',
    })
    expect(r.success).toBe(true)
  })

  it('отклоняет битые данные', () => {
    const r = storedSessionSchema.safeParse({
      token: '',
      user: { id: 'x' },
      mode: 'local',
    })
    expect(r.success).toBe(false)
  })
})

describe('dummyJsonLoginResponseSchema', () => {
  it('требует хотя бы один токен', () => {
    const bad = dummyJsonLoginResponseSchema.safeParse({
      id: 1,
      username: 'a',
      firstName: 'A',
      lastName: 'B',
      image: '',
    })
    expect(bad.success).toBe(false)
  })

  it('принимает accessToken', () => {
    const ok = dummyJsonLoginResponseSchema.safeParse({
      id: 1,
      username: 'a',
      firstName: 'A',
      lastName: 'B',
      image: '',
      accessToken: 'jwt',
    })
    expect(ok.success).toBe(true)
  })
})
