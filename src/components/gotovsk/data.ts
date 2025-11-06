export const sections = [
  { id: 'main', label: 'Главная', icon: 'Home' },
  { id: 'districts', label: 'Районы', icon: 'Building' },
  { id: 'transport', label: 'Транспорт', icon: 'Bus' },
  { id: 'news', label: 'Новости', icon: 'Newspaper' },
  { id: 'attractions', label: 'Достопримечательности', icon: 'Landmark' },
  { id: 'history', label: 'История', icon: 'BookOpen' },
  { id: 'games', label: 'Игры', icon: 'Gamepad2' },
  { id: 'achievements', label: 'Достижения', icon: 'Trophy' },
  { id: 'gifts', label: 'Магазин подарков', icon: 'Gift' },
  { id: 'inventory', label: 'Инвентарь', icon: 'Package' },
  { id: 'leaderboard', label: 'Таблица лидеров', icon: 'Medal' },
  { id: 'map', label: 'Карта', icon: 'Map' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
  { id: 'admin', label: 'Админ-панель', icon: 'Shield' }
]

export const districts = [
  {
    name: 'Микрорайон 1',
    description: 'Элитный район с высотными домами, спортивными комплексами и парковыми зонами',
    type: 'Элитный'
  },
  {
    name: 'Микрорайон 2', 
    description: 'Студенческий район с университетами и колледжами',
    type: 'Студенческий'
  },
  {
    name: 'Микрорайон 3',
    description: 'Семейный район с детскими садами и школами',
    type: 'Семейный'
  },
  {
    name: 'Микрорайон 4',
    description: 'Промышленный район с современными предприятиями',
    type: 'Промышленный'
  },
  {
    name: 'Микрорайон 5',
    description: 'Спальный район с развитой социальной инфраструктурой',
    type: 'Спальный'
  },
  {
    name: 'Микрорайон 6',
    description: 'Экологический район с парковыми зонами',
    type: 'Экологический'
  },
  {
    name: 'Микрорайон 7',
    description: 'Транспортный узел с железнодорожной станцией',
    type: 'Транспортный'
  }
]

export const attractions = [
  {
    name: 'Парк культуры Готов',
    description: 'Крупнейший городской парк площадью 150 гектаров с центральным готовским кровавым факелом',
    features: ['Детская зона', 'Спортивная зона', 'Культурная зона', 'Экологическая зона']
  },
  {
    name: 'Готовское озеро',
    description: 'Природный водоем площадью 2 квадратных километра с благоустроенными пляжами',
    features: ['Пляжи', 'Прогулочные дорожки', 'Места отдыха']
  },
  {
    name: 'Готовская набережная',
    description: 'Благоустроенная территория протяженностью 3 километра',
    features: ['Кафе и рестораны', 'Смотровые площадки', 'Детские площадки']
  }
]

export const streets = [
  {
    name: 'Готовский проспект',
    length: '8 км',
    description: 'Главная артерия города от вокзала до парка культуры'
  },
  {
    name: 'Главная Готовская улица',
    length: '6 км', 
    description: 'Старинная улица с историческими зданиями и музеями'
  },
  {
    name: 'Субкунтрульная улица',
    length: '4 км',
    description: 'Современная магистраль с бизнес-центрами'
  }
]

export const gifts = [
  {
    id: 'calendar',
    name: 'Календарь Готовска',
    price: 250,
    description: 'Официальный городской календарь с красивыми видами Готовска',
    icon: 'Calendar',
    available: true
  },
  {
    id: 'mayor-meeting',
    name: 'Встреча с мэром Готовска',
    price: 150,
    description: 'Персональная встреча с главой города в мэрии',
    icon: 'Users',
    available: true
  },
  {
    id: 'bank-card',
    name: 'Банковская карта Готовска',
    price: 500,
    description: 'Эксклюзивная банковская карта с символикой города',
    icon: 'CreditCard',
    available: true
  },
  {
    id: 'passport',
    name: 'Паспорт Готовска',
    price: 1000,
    description: 'Лимитированный паспорт почетного гражданина города',
    icon: 'BookOpen',
    available: true,
    limited: true,
    remaining: 5,
    total: 5
  }
]

export const boxes = [
  {
    id: 'bronze-box',
    name: 'Бронзовый ящик',
    price: 100,
    description: 'Содержит случайные предметы низкой редкости',
    icon: 'Package',
    rarity: 'common',
    vipOnly: true
  },
  {
    id: 'silver-box',
    name: 'Серебряный ящик',
    price: 250,
    description: 'Содержит случайные предметы средней редкости',
    icon: 'Package',
    rarity: 'rare',
    vipOnly: true
  },
  {
    id: 'gold-box',
    name: 'Золотой ящик',
    price: 500,
    description: 'Содержит случайные предметы высокой редкости',
    icon: 'Package',
    rarity: 'epic',
    vipOnly: true
  },
  {
    id: 'elite-box',
    name: 'Элитный ящик',
    price: 1000,
    description: 'Содержит эксклюзивные предметы высочайшей редкости',
    icon: 'Sparkles',
    rarity: 'legendary',
    vipOnly: true
  }
]