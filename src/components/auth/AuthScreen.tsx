import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Lock, Mail, ShieldAlert } from 'lucide-react'
import { messageForAuthError } from '@/services/authService'
import { useAuth } from '@/hooks/useAuth'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

type FormValues = z.infer<typeof schema>

type Mode = 'login' | 'register'

export default function AuthScreen() {
  const { login, register: registerUser } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [serverError, setServerError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setServerError(null)
    setNotice(null)
    try {
      if (mode === 'login') {
        await login(values.email, values.password)
      } else {
        await registerUser(values.email, values.password)
        setMode('login')
        setNotice('Cuenta creada. Iniciá sesión para continuar.')
        reset({ email: values.email, password: '' })
      }
    } catch (err) {
      setServerError(messageForAuthError(err))
    }
  }

  function switchMode(next: Mode) {
    setMode(next)
    setServerError(null)
    setNotice(null)
  }

  const isLogin = mode === 'login'

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0b0d12] p-4">
      <div className="w-full max-w-[400px] border border-white/[0.08] bg-[#14161c] p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)]">
        <div className="mb-6">
          <div className="mb-1 flex items-center gap-2 text-[#00E599]">
            <ShieldAlert size={18} />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">CABA · Rutas</span>
          </div>
          <h1 className="text-xl font-semibold text-white">
            {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </h1>
          <p className="mt-1 text-sm text-[#8B93A7]">
            {isLogin
              ? 'Accedé para calcular rutas seguras.'
              : 'Registrate para empezar a usar la app.'}
          </p>
        </div>

        <div className="mb-5 flex gap-1 border border-white/[0.08] p-1">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 py-1.5 text-sm font-medium transition ${
              isLogin ? 'bg-white/[0.08] text-white' : 'text-[#8B93A7] hover:text-[#C7CDDA]'
            }`}
          >
            Ingresar
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`flex-1 py-1.5 text-sm font-medium transition ${
              !isLogin ? 'bg-white/[0.08] text-white' : 'text-[#8B93A7] hover:text-[#C7CDDA]'
            }`}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[#8B93A7]">Email</span>
            <div className="flex items-center gap-2 border border-white/[0.08] bg-[#0b0d12] px-3 focus-within:border-white/25">
              <Mail size={15} className="text-[#6e7689]" />
              <input
                type="email"
                autoComplete="email"
                {...register('email')}
                className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-[#5a6275]"
                placeholder="vos@ejemplo.com"
              />
            </div>
            {errors.email && <span className="text-xs text-[#F5556B]">{errors.email.message}</span>}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[#8B93A7]">Contraseña</span>
            <div className="flex items-center gap-2 border border-white/[0.08] bg-[#0b0d12] px-3 focus-within:border-white/25">
              <Lock size={15} className="text-[#6e7689]" />
              <input
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                {...register('password')}
                className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-[#5a6275]"
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            {errors.password && (
              <span className="text-xs text-[#F5556B]">{errors.password.message}</span>
            )}
          </label>

          {notice && <p className="text-xs text-[#00E599]">{notice}</p>}
          {serverError && <p className="text-xs text-[#F5556B]">{serverError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 flex h-11 items-center justify-center gap-2 bg-[#00E599] text-sm font-semibold text-[#0b0d12] transition hover:bg-[#1cf0a8] disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={15} className="animate-spin" />}
            {isLogin ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
