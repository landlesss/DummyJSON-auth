import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../../shared/ui/Button.tsx'
import { Input } from '../../shared/ui/Input.tsx'
import { Modal } from '../../shared/ui/Modal.tsx'
import type { Product } from './productsTypes.ts'

type FormState = {
  title: string
  price: string
  brand: string
  sku: string
}

export function AddProductModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (p: Product) => void
}) {
  const [form, setForm] = useState<FormState>({
    title: '',
    price: '',
    brand: '',
    sku: '',
  })

  const errors = useMemo(() => {
    const title = form.title.trim() ? null : 'Укажите наименование'
    const priceValue = Number(form.price)
    const price =
      form.price.trim().length === 0
        ? 'Укажите цену'
        : Number.isFinite(priceValue) && priceValue > 0
          ? null
          : 'Цена должна быть числом больше 0'
    const brand = form.brand.trim() ? null : 'Укажите вендора'
    const sku = form.sku.trim() ? null : 'Укажите артикул'
    return { title, price, brand, sku }
  }, [form.brand, form.price, form.sku, form.title])

  const canSubmit = !errors.title && !errors.price && !errors.brand && !errors.sku

  const submit = () => {
    if (!canSubmit) return

    const now = Date.now()
    const created: Product = {
      id: now * -1,
      title: form.title.trim(),
      price: Number(form.price),
      brand: form.brand.trim(),
      sku: form.sku.trim(),
      rating: 5,
      category: 'Новинки',
      thumbnail: '',
    }

    onAdd(created)
    toast.success('Товар добавлен')
    onClose()
    setForm({ title: '', price: '', brand: '', sku: '' })
  }

  return (
    <Modal
      title="Добавить товар"
      open={open}
      onClose={onClose}
      footer={
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={submit} disabled={!canSubmit}>
            Добавить
          </Button>
        </div>
      }
    >
      <div className="grid2">
        <Input
          label="Наименование"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          error={errors.title}
          placeholder="Например, iPhone 13"
        />
        <Input
          label="Цена"
          value={form.price}
          onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
          error={errors.price}
          inputMode="decimal"
          placeholder="999"
        />
        <Input
          label="Вендор"
          value={form.brand}
          onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
          error={errors.brand}
          placeholder="Apple"
        />
        <Input
          label="Артикул"
          value={form.sku}
          onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
          error={errors.sku}
          placeholder="ABC-123"
        />
      </div>
    </Modal>
  )
}

