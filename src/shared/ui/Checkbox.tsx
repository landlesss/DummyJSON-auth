import type { InputHTMLAttributes } from 'react'

export function Checkbox({
  label,
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
}) {
  return (
    <label className={['checkbox', className].filter(Boolean).join(' ')}>
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  )
}

