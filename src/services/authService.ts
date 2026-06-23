import type { AuthErrorCode, LoginResponse, User } from '@/types/auth'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const API = `${BASE_URL}/api/v1`

// ---------------------------------------------------------------------------
// Access token: vive SOLO en memoria de módulo. Nunca en localStorage ni en un
// store serializable (evita robo por XSS). Un F5 lo borra y se recupera con
// refresh() vía la cookie HttpOnly. Ver openspec/changes/auth-jwt/design.md.
// ---------------------------------------------------------------------------
let accessToken: string | null = null

export function getAccessToken(): string | null {
  return accessToken
}

function setAccessToken(token: string | null): void {
  accessToken = token
}

function authHeader(): HeadersInit {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
}

// Notificación de "sesión perdida": se dispara cuando un refresh falla, para
// que la UI vuelva a estado anónimo sin acoplar el servicio al store.
type SessionExpiredListener = () => void
const sessionExpiredListeners = new Set<SessionExpiredListener>()

export function onSessionExpired(cb: SessionExpiredListener): () => void {
  sessionExpiredListeners.add(cb)
  return () => sessionExpiredListeners.delete(cb)
}

function notifySessionExpired(): void {
  sessionExpiredListeners.forEach((cb) => cb())
}

/** Error tipado que conserva el código máquina del backend. */
export class AuthError extends Error {
  code: AuthErrorCode
  status: number

  constructor(code: AuthErrorCode, message: string, status: number) {
    super(message)
    this.name = 'AuthError'
    this.code = code
    this.status = status
  }
}

async function parseError(res: Response): Promise<AuthError> {
  const body = (await res.json().catch(() => null)) as
    | { error?: string; message?: string }
    | null
  return new AuthError(
    (body?.error as AuthErrorCode) ?? 'internal_error',
    body?.message ?? `HTTP ${res.status}`,
    res.status,
  )
}

/** Mensaje accionable para mostrar en la UI según el código de error. */
export function messageForAuthError(err: unknown): string {
  const code = err instanceof AuthError ? err.code : 'internal_error'
  switch (code) {
    case 'invalid_credentials':
      return 'Email o contraseña inválidos.'
    case 'email_taken':
      return 'Ese email ya está registrado.'
    case 'account_inactive':
      return 'Tu cuenta está desactivada.'
    case 'invalid_request':
      return 'Revisá los datos ingresados.'
    case 'invalid_refresh':
    case 'unauthorized':
      return 'Tu sesión expiró. Iniciá sesión de nuevo.'
    default:
      return 'Ocurrió un error. Reintentá.'
  }
}

// --- Endpoints --------------------------------------------------------------

/** POST /auth/register — no setea cookie ni token. */
export async function register(email: string, password: string): Promise<User> {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw await parseError(res)
  return res.json() as Promise<User>
}

/** POST /auth/login — recibe la cookie de refresh y devuelve el access token. */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // <-- recibe la cookie de refresh
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw await parseError(res)
  const data = (await res.json()) as LoginResponse
  setAccessToken(data.access_token)
  return data
}

// refresh() single-flight: si ya hay un refresh en vuelo, las llamadas
// concurrentes reusan la misma promesa para no disparar N refreshes.
let refreshPromise: Promise<boolean> | null = null

async function doRefresh(): Promise<boolean> {
  const res = await fetch(`${API}/auth/refresh`, {
    method: 'POST',
    credentials: 'include', // <-- manda la cookie de refresh
  })
  if (!res.ok) {
    setAccessToken(null)
    notifySessionExpired()
    return false
  }
  const data = (await res.json()) as LoginResponse
  setAccessToken(data.access_token)
  return true
}

/** Pide un access token nuevo usando la cookie. Devuelve true si lo logró. */
export function refresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

/** POST /auth/logout — invalida la cookie y limpia el token local. */
export async function logout(): Promise<void> {
  try {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
  } finally {
    setAccessToken(null)
  }
}

/** GET /auth/me — datos del usuario autenticado (requiere Bearer). */
export async function getMe(): Promise<User> {
  const res = await authFetch('/auth/me')
  if (!res.ok) throw await parseError(res)
  return res.json() as Promise<User>
}

/**
 * fetch autenticado con auto-refresh: agrega el Bearer y, si da 401, intenta
 * refresh UNA vez y reintenta la request original. `path` es relativo a /api/v1.
 */
export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const doFetch = () =>
    fetch(`${API}${path}`, {
      ...init,
      credentials: 'include',
      headers: { ...init.headers, ...authHeader() },
    })

  let res = await doFetch()
  if (res.status === 401) {
    const ok = await refresh()
    if (ok) res = await doFetch()
  }
  return res
}
