const CATEGORY_RU: Record<string, string> = {
  smartphones: 'Телефоны',
  tablets: 'Планшеты',
  laptops: 'Ноутбуки',
  groceries: 'Продукты',
  'home-decoration': 'Для дома',
  fragrances: 'Парфюмерия',
  skincare: 'Уход',
  'mobile-accessories': 'Аксессуары',
  beauty: 'Красота',
  furniture: 'Мебель',
  'kitchen-accessories': 'Бытовая техника',
  watches: 'Часы',
  accessories: 'Аксессуары',
  automotive: 'Авто',
  motorcycle: 'Мото',
  lighting: 'Свет',
  electronics: 'Электроника',
  gaming: 'Игровые приставки',
  'mens-watches': 'Часы',
  sunglasses: 'Аксессуары',
  sports: 'Спорт',
}

export function categorySubtitle(raw: string): string {
  if (!raw || raw === '—') return '—'
  return (
    CATEGORY_RU[raw] ??
    raw
      .split('-')
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ')
  )
}
