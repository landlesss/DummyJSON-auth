import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ApiError } from '../../shared/api/http.ts'
import { useAuth } from '../../shared/auth/useAuth.ts'
import { Button } from '../../shared/ui/Button.tsx'
import { Checkbox } from '../../shared/ui/Checkbox.tsx'

type FieldErrors = {
  username: string | null
  password: string | null
  form: string | null
}

function validate(input: { username: string; password: string }): FieldErrors {
  return {
    username: input.username.trim() ? null : 'Укажите почту',
    password: input.password.trim() ? null : 'Введите пароль',
    form: null,
  }
}

function LoginLogo() {
  return (
    <div className="loginLogo" aria-hidden>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" stroke="#E5E7EB" strokeWidth="2" fill="#fff" />
        <rect x="16" y="16" width="3.5" height="24" rx="1.75" fill="#111827" />
        <rect x="23.25" y="12" width="3.5" height="32" rx="1.75" fill="#111827" />
        <rect x="30.5" y="20" width="3.5" height="16" rx="1.75" fill="#111827" />
        <rect x="37.75" y="24" width="3.5" height="10" rx="1.75" fill="#111827" />
      </svg>
    </div>
  )
}

function IconMail() {
  return (
    <svg className="loginInputIcon" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M2.5 5.833h15v8.334h-15V5.833z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M2.5 6.25L10 11.25l7.5-5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

function IconLock() {
  return (
    <svg className="loginInputIcon" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="4.17" y="8.33" width="11.67" height="9.17" rx="1.67" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M6.25 8.33V5.83a3.75 3.75 0 017.5 0v2.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconClear() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

function IconEyeOpen() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M2.5 10s3.33-5 7.5-5 7.5 5 7.5 5-3.33 5-7.5 5-7.5-5-7.5-5z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )
}

function IconEyeClosed() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M3.33 4.17l13.34 11.66M6.5 6.5a4.2 4.2 0 00-2.83 1.67C2.84 9.67 2.5 10 2.5 10s3.33 5 7.5 5c1.1 0 2.1-.27 2.98-.7M12 8.12a2.5 2.5 0 01-3.26 3.26"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 4.58c.8-.23 1.64-.35 2.5-.35 4.17 0 7.5 5 7.5 5-.47.78-1.2 1.56-2.1 2.27"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = useMemo(() => {
    const state = location.state as { from?: string } | null
    return state?.from ?? '/products'
  }, [location.state])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({
    username: null,
    password: null,
    form: null,
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate({ username, password })
    setErrors(nextErrors)
    if (nextErrors.username || nextErrors.password) return

    setSubmitting(true)
    try {
      // DummyJSON принимает username из модуля users (не e-mail). См. README.
      await auth.login({ username: username.trim(), password, remember })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Не удалось войти'
      setErrors((prev) => ({ ...prev, form: message }))
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="appShell loginScreen">
      <div className="loginPage">
        <div className="loginWrap card">
          <div className="loginHeader">
            <LoginLogo />
            <h1 className="loginWelcomeTitle">Добро пожаловать!</h1>
            <p className="loginWelcomeSub">Пожалуйста, авторизируйтесь</p>
          </div>

          <form onSubmit={onSubmit} className="loginForm">
            <label className="field loginField">
              <span className="fieldLabel">Почта</span>
              <div
                className={[
                  'inputShell',
                  errors.username ? 'inputShell--error' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="inputShellPrefix">
                  <IconMail />
                </span>
                <input
                  className="inputShellControl"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="emilys"
                  type="text"
                  inputMode="email"
                />
                {username ? (
                  <button
                    type="button"
                    className="inputShellSuffixBtn"
                    aria-label="Очистить"
                    onClick={() => setUsername('')}
                  >
                    <IconClear />
                  </button>
                ) : null}
              </div>
              {errors.username ? <div className="fieldError">{errors.username}</div> : null}
            </label>

            <label className="field loginField">
              <span className="fieldLabel">Пароль</span>
              <div
                className={[
                  'inputShell',
                  errors.password ? 'inputShell--error' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="inputShellPrefix">
                  <IconLock />
                </span>
                <input
                  className="inputShellControl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  type="button"
                  className="inputShellSuffixBtn"
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <IconEyeOpen /> : <IconEyeClosed />}
                </button>
              </div>
              {errors.password ? <div className="fieldError">{errors.password}</div> : null}
            </label>

            <div className="loginRememberRow">
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                label="Запомнить данные"
              />
            </div>

            {errors.form ? <div className="formError">{errors.form}</div> : null}

            <Button type="submit" className="btn--block loginSubmit" disabled={submitting}>
              {submitting ? 'Входим…' : 'Войти'}
            </Button>

            <div className="loginDivider" aria-hidden>
              <span>или</span>
            </div>

            <p className="loginFooter">
              Нет аккаунта?{' '}
              <a
                href="#"
                className="loginFooterLink"
                onClick={(e) => {
                  e.preventDefault()
                  toast(
                    'Регистрация в этом демо не реализована (по заданию ссылка не ведёт на экран). Войти можно любым пользователем из dummyjson.com/users — например логин emilys, пароль emilyspass (старый kminchelle в API больше не работает).',
                    { duration: 6000, icon: 'ℹ️' },
                  )
                }}
              >
                Создать
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
