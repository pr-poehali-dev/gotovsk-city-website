export interface BoxItem {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const boxItems: Record<string, BoxItem[]> = {
  'bronze-box': [
    { id: 'coin-pouch', name: 'Мешочек монет', description: '50 лизкоинов', icon: 'Coins', rarity: 'common' },
    { id: 'city-postcard', name: 'Открытка Готовска', description: 'Красивая открытка с видами города', icon: 'Image', rarity: 'common' },
    { id: 'metro-token', name: 'Жетон метро', description: 'Бесплатный проезд на метро', icon: 'Ticket', rarity: 'common' },
    { id: 'city-badge', name: 'Значок города', description: 'Простой значок с символикой Готовска', icon: 'Award', rarity: 'common' },
    { id: 'tourist-map', name: 'Туристическая карта', description: 'Карта достопримечательностей', icon: 'MapPin', rarity: 'common' }
  ],
  
  'silver-box': [
    { id: 'coin-bag', name: 'Сумка монет', description: '100 лизкоинов', icon: 'Coins', rarity: 'rare' },
    { id: 'museum-pass', name: 'Музейный абонемент', description: 'Посещение всех музеев города', icon: 'Building2', rarity: 'rare' },
    { id: 'city-photo-album', name: 'Фотоальбом Готовска', description: 'Коллекционное издание с редкими фото', icon: 'Book', rarity: 'rare' },
    { id: 'vip-restaurant-coupon', name: 'Купон в ресторан', description: 'Скидка 50% в лучших ресторанах', icon: 'UtensilsCrossed', rarity: 'rare' },
    { id: 'park-pass', name: 'Годовой абонемент в парк', description: 'Безлимитный вход в парк культуры', icon: 'TreePine', rarity: 'rare' },
    { id: 'city-hoodie', name: 'Толстовка Готовска', description: 'Стильная одежда с символикой города', icon: 'Shirt', rarity: 'rare' }
  ],
  
  'gold-box': [
    { id: 'coin-chest', name: 'Сундук монет', description: '250 лизкоинов', icon: 'Coins', rarity: 'epic' },
    { id: 'mayor-invitation', name: 'Приглашение от мэра', description: 'Личная встреча с мэром города', icon: 'Mail', rarity: 'epic' },
    { id: 'golden-key', name: 'Золотой ключ города', description: 'Символический ключ от города', icon: 'Key', rarity: 'epic' },
    { id: 'premium-transport-card', name: 'Премиум карта транспорта', description: 'Год бесплатного проезда', icon: 'CreditCard', rarity: 'epic' },
    { id: 'city-artwork', name: 'Картина Готовска', description: 'Авторская картина местного художника', icon: 'Palette', rarity: 'epic' },
    { id: 'vip-theater-box', name: 'VIP ложа в театре', description: 'Абонемент на весь сезон', icon: 'Theater', rarity: 'epic' },
    { id: 'signed-history-book', name: 'Подписанная книга истории', description: 'Редкое издание с автографом историка', icon: 'BookMarked', rarity: 'epic' }
  ],
  
  'elite-box': [
    { id: 'coin-vault', name: 'Хранилище монет', description: '500 лизкоинов', icon: 'Coins', rarity: 'legendary' },
    { id: 'honorary-citizen', name: 'Звание почётного гражданина', description: 'Официальное признание вклада в город', icon: 'Crown', rarity: 'legendary' },
    { id: 'penthouse-keys', name: 'Ключи от пентхауса', description: 'Месяц проживания в элитном пентхаусе', icon: 'Home', rarity: 'legendary' },
    { id: 'city-statue', name: 'Именная статуя', description: 'Ваша статуя будет установлена в парке', icon: 'User', rarity: 'legendary' },
    { id: 'private-tour', name: 'Личная экскурсия мэра', description: 'Эксклюзивная экскурсия по городу', icon: 'MapPinned', rarity: 'legendary' },
    { id: 'city-archive-access', name: 'Доступ к архивам города', description: 'Доступ к секретным историческим документам', icon: 'Archive', rarity: 'legendary' },
    { id: 'vip-elite-lifetime', name: 'VIP Elite навсегда', description: 'Пожизненный VIP Elite статус', icon: 'Sparkles', rarity: 'legendary' }
  ]
}

export const getRandomItem = (boxId: string): BoxItem => {
  const items = boxItems[boxId] || []
  const randomIndex = Math.floor(Math.random() * items.length)
  return items[randomIndex]
}

export const getItemsByRarity = (items: BoxItem[], rarity: string) => {
  return items.filter(item => item.rarity === rarity)
}
