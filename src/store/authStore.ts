import { create } from 'zustand'
import type { AuthStatus, User } from '@/types/auth'

// El access token NO vive acá (vive en memoria de authService) para no
// exponerlo a devtools ni a serialización. Acá solo el usuario y el estado.
interface AuthState {
  user: User | null
  status: AuthStatus
  setAuthenticated: (user: User) => void
  setAnonymous: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'booting',
  setAuthenticated: (user) => set({ user, status: 'authenticated' }),
  setAnonymous: () => set({ user: null, status: 'anonymous' }),
  setUser: (user) => set({ user }),
}))
