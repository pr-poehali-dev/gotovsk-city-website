export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  reward: number
  requirement: number
  current: number
  unlocked: boolean
  category: 'exploration' | 'social' | 'collector' | 'master' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const initialAchievements: Achievement[] = [
  {
    id: 'first-steps',
    title: 'Первые шаги',
    description: 'Создайте свой аккаунт',
    icon: 'UserPlus',
    reward: 10,
    requirement: 1,
    current: 0,
    unlocked: false,
    category: 'exploration',
    rarity: 'common'
  },
  {
    id: 'explorer-bronze',
    title: 'Любопытный турист',
    description: 'Посетите 3 разных раздела',
    icon: 'Map',
    reward: 25,
    requirement: 3,
    current: 0,
    unlocked: false,
    category: 'exploration',
    rarity: 'common'
  },
  {
    id: 'explorer-silver',
    title: 'Опытный путешественник',
    description: 'Посетите все разделы сайта',
    icon: 'Compass',
    reward: 50,
    requirement: 6,
    current: 0,
    unlocked: false,
    category: 'exploration',
    rarity: 'rare'
  },
  {
    id: 'coin-collector-1',
    title: 'Копилка',
    description: 'Накопите 100 лизкоинов',
    icon: 'PiggyBank',
    reward: 20,
    requirement: 100,
    current: 0,
    unlocked: false,
    category: 'collector',
    rarity: 'common'
  },
  {
    id: 'coin-collector-2',
    title: 'Сундук с сокровищами',
    description: 'Накопите 500 лизкоинов',
    icon: 'Gem',
    reward: 100,
    requirement: 500,
    current: 0,
    unlocked: false,
    category: 'collector',
    rarity: 'rare'
  },
  {
    id: 'coin-collector-3',
    title: 'Банк Готовска',
    description: 'Накопите 1000 лизкоинов',
    icon: 'Vault',
    reward: 250,
    requirement: 1000,
    current: 0,
    unlocked: false,
    category: 'collector',
    rarity: 'epic'
  },
  {
    id: 'shopaholic',
    title: 'Шопоголик',
    description: 'Купите 5 разных подарков',
    icon: 'ShoppingCart',
    reward: 50,
    requirement: 5,
    current: 0,
    unlocked: false,
    category: 'collector',
    rarity: 'rare'
  },
  {
    id: 'quiz-master',
    title: 'Знаток Готовска',
    description: 'Ответьте правильно на 10 вопросов викторины',
    icon: 'GraduationCap',
    reward: 75,
    requirement: 10,
    current: 0,
    unlocked: false,
    category: 'master',
    rarity: 'rare'
  },
  {
    id: 'perfect-quiz',
    title: 'Гений истории',
    description: 'Пройдите викторину без ошибок',
    icon: 'Award',
    reward: 100,
    requirement: 1,
    current: 0,
    unlocked: false,
    category: 'master',
    rarity: 'epic'
  },
  {
    id: 'puzzle-solver',
    title: 'Мастер головоломок',
    description: 'Решите пазл менее чем за 50 ходов',
    icon: 'Puzzle',
    reward: 60,
    requirement: 1,
    current: 0,
    unlocked: false,
    category: 'master',
    rarity: 'rare'
  },
  {
    id: 'daily-visitor-7',
    title: 'Верный житель',
    description: 'Посещайте сайт 7 дней подряд',
    icon: 'Calendar',
    reward: 100,
    requirement: 7,
    current: 0,
    unlocked: false,
    category: 'special',
    rarity: 'epic'
  },
  {
    id: 'news-reader',
    title: 'В курсе событий',
    description: 'Прочитайте 10 новостей',
    icon: 'Newspaper',
    reward: 40,
    requirement: 10,
    current: 0,
    unlocked: false,
    category: 'exploration',
    rarity: 'common'
  },
  {
    id: 'quest-completer',
    title: 'Искатель приключений',
    description: 'Завершите 3 квеста',
    icon: 'Target',
    reward: 150,
    requirement: 3,
    current: 0,
    unlocked: false,
    category: 'master',
    rarity: 'epic'
  },
  {
    id: 'legend',
    title: 'Легенда Готовска',
    description: 'Разблокируйте все достижения',
    icon: 'Crown',
    reward: 500,
    requirement: 13,
    current: 0,
    unlocked: false,
    category: 'special',
    rarity: 'legendary'
  }
]
