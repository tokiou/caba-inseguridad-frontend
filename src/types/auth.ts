// Tipos del contrato de autenticación del backend.
// Ver openspec/changes/auth-jwt.

export interface User {
  id: number
  email: string
}

/** Respuesta de /auth/login y /auth/refresh. */
export interface LoginResponse {
  access_token: string
  token_type: string // "bearer"
  expires_in: number // segundos (900 = 15 min)
}

/** Códigos máquina de error que devuelve el backend en { error, message }. */
export type AuthErrorCode =
  | 'invalid_request'
  | 'invalid_credentials'
  | 'invalid_refresh'
  | 'unauthorized'
  | 'account_inactive'
  | 'email_taken'
  | 'internal_error'

export type AuthStatus = 'booting' | 'anonymous' | 'authenticated'
