import type { InputHTMLAttributes } from 'react'

export function Input({
  label,
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string | null
}) {
  return (
    <label className={['field', className].filter(Boolean).join(' ')}>
      {label ? <div className="fieldLabel">{label}</div> : null}
      <input className={['input', error ? 'input--error' : ''].join(' ')} {...props} />
      {error ? <div className="fieldError">{error}</div> : null}
    </label>
  )
}

