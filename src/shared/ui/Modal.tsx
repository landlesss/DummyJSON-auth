import { useEffect, useId, useRef, type ReactNode } from 'react'

function collectFocusables(root: HTMLElement): HTMLElement[] {
  const sel =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  return [...root.querySelectorAll<HTMLElement>(sel)]
}

export function Modal({
  title,
  open,
  onClose,
  children,
  footer,
}: {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  const titleId = useId()
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const card = cardRef.current
    if (!card) return

    const focusInitial = () => {
      const body = card.querySelector('.modalBody')
      const firstField = body?.querySelector<HTMLElement>(
        'input, select, textarea, button:not([disabled])',
      )
      const all = collectFocusables(card)
      const next = firstField && all.includes(firstField) ? firstField : all[0]
      next?.focus()
    }

    const id = window.requestAnimationFrame(focusInitial)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const focusables = collectFocusables(card)
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(id)
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className="modalBackdrop"
        onClick={onClose}
        tabIndex={-1}
        aria-label="Закрыть диалог"
      />
      <div ref={cardRef} className="modalCard card">
        <div className="modalHeader">
          <div className="modalTitle" id={titleId}>
            {title}
          </div>
          <button type="button" className="iconBtn" onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>
        <div className="modalBody">{children}</div>
        {footer ? <div className="modalFooter">{footer}</div> : null}
      </div>
    </div>
  )
}
