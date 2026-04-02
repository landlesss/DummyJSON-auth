export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ApiErrorPayload = {
  message?: string
}

export class ApiError extends Error {
  public readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null

export async function httpJson<TResponse>(
  url: string,
  init?: {
    method?: HttpMethod
    headers?: Record<string, string>
    body?: Json
    token?: string | null
    signal?: AbortSignal
  },
): Promise<TResponse> {
  const res = await fetch(url, {
    method: init?.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.token ? { Authorization: `Bearer ${init.token}` } : {}),
      ...(init?.headers ?? {}),
    },
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
    signal: init?.signal,
  })

  if (res.ok) {
    return (await res.json()) as TResponse
  }

  let message = `Request failed with status ${res.status}`
  try {
    const payload = (await res.json()) as ApiErrorPayload
    if (payload?.message) message = payload.message
  } catch {
    // ignore
  }
  throw new ApiError(message, res.status)
}

