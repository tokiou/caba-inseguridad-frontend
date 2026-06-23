import { useCallback } from 'react'
import * as authService from '@/services/authService'
import { useAuthStore } from '@/store/authStore'

/**
 * Orquesta el servicio de auth con el authStore. Centraliza login/register/
 * logout/bootstrap para que la UI no toque el servicio directamente.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const status = useAuthStore((s) => s.status)
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated)
  const setAnonymous = useAuthStore((s) => s.setAnonymous)

  const login = useCallback(
    async (email: string, password: string) => {
      await authService.login(email, password)
      const me = await authService.getMe()
      setAuthenticated(me)
    },
    [setAuthenticated],
  )

  const register = useCallback(
    (email: string, password: string) => authService.register(email, password),
    [],
  )

  const logout = useCallback(async () => {
    await authService.logout()
    setAnonymous()
  }, [setAnonymous])

  // Recupera la sesión vía la cookie de refresh al arrancar la app.
  const bootstrap = useCallback(async () => {
    const ok = await authService.refresh()
    if (!ok) {
      setAnonymous()
      return
    }
    try {
      const me = await authService.getMe()
      setAuthenticated(me)
    } catch {
      setAnonymous()
    }
  }, [setAuthenticated, setAnonymous])

  return { user, status, login, register, logout, bootstrap }
}
