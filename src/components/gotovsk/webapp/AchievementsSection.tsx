import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Icon from '@/components/ui/icon'
import { getCurrentUser } from '@/utils/auth'
import { addLizcoins } from '@/utils/lizcoins'
import { addKrestcoins } from '@/utils/krestcoins'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  reward: number
  requirement: number
  current: number
  unlocked: boolean
  category: 'exploration' | 'social' | 'collector' | 'master' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  krestReward?: number
}

const initialAchievements: Achievement[] = [
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
    id: 'gothic-historian',
    title: 'Готский Историк',
    description: 'Изучите всю историю Готовска (10 разделов)',
    icon: 'BookOpen',
    reward: 200,
    krestReward: 1,
    requirement: 10,
    current: 0,
    unlocked: false,
    category: 'master',
    rarity: 'legendary'
  },
  {
    id: 'master-collector',
    title: 'Великий Коллекционер',
    description: 'Соберите 15 уникальных подарков',
    icon: 'Package',
    reward: 200,
    krestReward: 1,
    requirement: 15,
    current: 0,
    unlocked: false,
    category: 'collector',
    rarity: 'legendary'
  },
  {
    id: 'quiz-perfectionist',
    title: 'Совершенный Разум',
    description: 'Пройдите 5 викторин без единой ошибки',
    icon: 'Brain',
    reward: 250,
    krestReward: 1,
    requirement: 5,
    current: 0,
    unlocked: false,
    category: 'master',
    rarity: 'legendary'
  },
  {
    id: 'millionaire',
    title: 'Лизкоин Миллионер',
    description: 'Накопите 5000 лизкоинов за всё время',
    icon: 'Sparkles',
    reward: 300,
    krestReward: 1,
    requirement: 5000,
    current: 0,
    unlocked: false,
    category: 'collector',
    rarity: 'legendary'
  },
  {
    id: 'explorer-legend',
    title: 'Легендарный Путешественник',
    description: 'Посетите каждый раздел 50 раз',
    icon: 'Globe',
    reward: 250,
    krestReward: 1,
    requirement: 50,
    current: 0,
    unlocked: false,
    category: 'exploration',
    rarity: 'legendary'
  },
  {
    id: 'game-master',
    title: 'Мастер Всех Игр',
    description: 'Победите в каждой игре минимум 10 раз',
    icon: 'Gamepad2',
    reward: 300,
    krestReward: 1,
    requirement: 10,
    current: 0,
    unlocked: false,
    category: 'master',
    rarity: 'legendary'
  },
  {
    id: 'daily-champion',
    title: 'Чемпион Преданности',
    description: 'Посещайте портал 30 дней подряд',
    icon: 'CalendarCheck',
    reward: 250,
    krestReward: 1,
    requirement: 30,
    current: 0,
    unlocked: false,
    category: 'special',
    rarity: 'legendary'
  },
  {
    id: 'social-legend',
    title: 'Душа Готовска',
    description: 'Оставьте 100 комментариев и лайков',
    icon: 'Heart',
    reward: 200,
    krestReward: 1,
    requirement: 100,
    current: 0,
    unlocked: false,
    category: 'social',
    rarity: 'legendary'
  },
  {
    id: 'ancient-guardian',
    title: 'Хранитель Древности',
    description: 'Откройте 20 секретных мест в городе',
    icon: 'Shield',
    reward: 500,
    krestReward: 5,
    requirement: 20,
    current: 0,
    unlocked: false,
    category: 'special',
    rarity: 'mythic'
  },
  {
    id: 'eternal-scholar',
    title: 'Вечный Учёный',
    description: 'Ответьте на 500 вопросов правильно',
    icon: 'GraduationCap',
    reward: 500,
    krestReward: 5,
    requirement: 500,
    current: 0,
    unlocked: false,
    category: 'master',
    rarity: 'mythic'
  },
  {
    id: 'treasure-hunter',
    title: 'Охотник за Сокровищами',
    description: 'Найдите все 25 скрытых артефактов Готовска',
    icon: 'Gem',
    reward: 600,
    krestReward: 5,
    requirement: 25,
    current: 0,
    unlocked: false,
    category: 'collector',
    rarity: 'mythic'
  },
  {
    id: 'time-traveler',
    title: 'Путешественник во Времени',
    description: 'Изучите историю с 1284 года до наших дней',
    icon: 'Clock',
    reward: 700,
    krestReward: 5,
    requirement: 1,
    current: 0,
    unlocked: false,
    category: 'special',
    rarity: 'mythic'
  },
  {
    id: 'ultimate-champion',
    title: 'Абсолютный Чемпион',
    description: 'Займите 1 место в таблице лидеров 10 раз',
    icon: 'Trophy',
    reward: 800,
    krestReward: 5,
    requirement: 10,
    current: 0,
    unlocked: false,
    category: 'special',
    rarity: 'mythic'
  },
  {
    id: 'grand-patron',
    title: 'Великий Меценат',
    description: 'Потратьте 10000 лизкоинов в магазине',
    icon: 'DollarSign',
    reward: 500,
    krestReward: 5,
    requirement: 10000,
    current: 0,
    unlocked: false,
    category: 'collector',
    rarity: 'mythic'
  },
  {
    id: 'myth-legend',
    title: 'Легенда Готовска',
    description: 'Разблокируйте все достижения портала',
    icon: 'Crown',
    reward: 1000,
    krestReward: 5,
    requirement: 33,
    current: 0,
    unlocked: false,
    category: 'special',
    rarity: 'mythic'
  }
]

export default function AchievementsSection() {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements)
  const [filter, setFilter] = useState<'all' | Achievement['category']>('all')
  const [sortBy, setSortBy] = useState<'default' | 'progress' | 'rarity'>('default')
  const user = getCurrentUser()

  useEffect(() => {
    loadAchievements()
    updateAchievementProgress()
  }, [user])

  const loadAchievements = () => {
    const saved = localStorage.getItem('achievements')
    if (saved) {
      setAchievements(JSON.parse(saved))
    }
  }

  const saveAchievements = (updated: Achievement[]) => {
    localStorage.setItem('achievements', JSON.stringify(updated))
    setAchievements(updated)
  }

  const updateAchievementProgress = () => {
    if (!user) return

    const updatedAchievements = [...achievements]
    let hasChanges = false

    updatedAchievements.forEach(achievement => {
      if (achievement.unlocked) return

      let newCurrent = achievement.current

      switch (achievement.id) {
        case 'first-steps':
          newCurrent = 1
          break
        case 'explorer-bronze':
        case 'explorer-silver':
          const visitedSections = new Set([
            localStorage.getItem('section-visit-news'),
            localStorage.getItem('section-visit-attractions'),
            localStorage.getItem('section-visit-districts'),
            localStorage.getItem('section-visit-transport'),
            localStorage.getItem('section-visit-history'),
            localStorage.getItem('section-visit-map')
          ].filter(Boolean))
          newCurrent = visitedSections.size
          break
        case 'coin-collector-1':
        case 'coin-collector-2':
        case 'coin-collector-3':
          newCurrent = user.lizcoins
          break
        case 'shopaholic':
          const purchased = JSON.parse(localStorage.getItem('purchasedGifts') || '[]')
          newCurrent = new Set(purchased).size
          break
        case 'news-reader':
          const readNews = parseInt(localStorage.getItem('news-read-count') || '0')
          newCurrent = readNews
          break
      }

      if (newCurrent !== achievement.current) {
        achievement.current = newCurrent
        hasChanges = true
      }

      if (newCurrent >= achievement.requirement && !achievement.unlocked) {
        achievement.unlocked = true
        achievement.current = achievement.requirement
        hasChanges = true
        
        addLizcoins(achievement.reward, `Достижение: ${achievement.title}`)
        
        if (achievement.krestReward) {
          addKrestcoins(achievement.krestReward, `Достижение: ${achievement.title}`)
        }
        
        window.dispatchEvent(new CustomEvent('achievement-unlocked', {
          detail: achievement
        }))
      }
    })

    const mythLegendAchievement = updatedAchievements.find(a => a.id === 'myth-legend')
    if (mythLegendAchievement) {
      const unlockedCount = updatedAchievements.filter(a => a.unlocked && a.id !== 'myth-legend').length
      mythLegendAchievement.current = unlockedCount
      if (unlockedCount >= mythLegendAchievement.requirement && !mythLegendAchievement.unlocked) {
        mythLegendAchievement.unlocked = true
        hasChanges = true
        addLizcoins(mythLegendAchievement.reward, `Достижение: ${mythLegendAchievement.title}`)
        if (mythLegendAchievement.krestReward) {
          addKrestcoins(mythLegendAchievement.krestReward, `Достижение: ${mythLegendAchievement.title}`)
        }
      }
    }

    if (hasChanges) {
      saveAchievements(updatedAchievements)
    }
  }

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-700'
      case 'rare': return 'from-blue-500 to-blue-700'
      case 'epic': return 'from-purple-500 to-purple-700'
      case 'legendary': return 'from-yellow-500 to-orange-600'
      case 'mythic': return 'from-pink-500 via-red-500 to-purple-600'
    }
  }

  const getRarityBorder = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-500/50'
      case 'rare': return 'border-blue-500/50'
      case 'epic': return 'border-purple-500/50'
      case 'legendary': return 'border-yellow-500/50'
      case 'mythic': return 'border-pink-500/50'
    }
  }

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'exploration': return 'Map'
      case 'social': return 'Users'
      case 'collector': return 'Package'
      case 'master': return 'Trophy'
      case 'special': return 'Star'
    }
  }

  const getCategoryName = (category: Achievement['category']) => {
    switch (category) {
      case 'exploration': return 'Исследование'
      case 'social': return 'Социальные'
      case 'collector': return 'Коллекционер'
      case 'master': return 'Мастерство'
      case 'special': return 'Особые'
    }
  }

  let filteredAchievements = filter === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === filter)

  if (sortBy === 'progress') {
    filteredAchievements = [...filteredAchievements].sort((a, b) => {
      const progressA = (a.current / a.requirement) * 100
      const progressB = (b.current / b.requirement) * 100
      return progressB - progressA
    })
  } else if (sortBy === 'rarity') {
    const rarityOrder = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 }
    filteredAchievements = [...filteredAchievements].sort((a, b) => {
      return rarityOrder[b.rarity] - rarityOrder[a.rarity]
    })
  }

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    common: achievements.filter(a => a.rarity === 'common' && a.unlocked).length,
    rare: achievements.filter(a => a.rarity === 'rare' && a.unlocked).length,
    epic: achievements.filter(a => a.rarity === 'epic' && a.unlocked).length,
    legendary: achievements.filter(a => a.rarity === 'legendary' && a.unlocked).length,
    mythic: achievements.filter(a => a.rarity === 'mythic' && a.unlocked).length,
  }

  const categories: Achievement['category'][] = ['exploration', 'collector', 'master', 'special']

  return (
    <div className="space-y-6">
      <Card className="chrome-card border-2 border-yellow-500/30 fade-in-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 chrome-text">
            <Icon name="Trophy" size={28} className="text-yellow-500" />
            Достижения
          </CardTitle>
          <CardDescription>
            Выполняйте задания и получайте уникальные награды
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-700/20 border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-400">{stats.unlocked}/{stats.total}</div>
              <div className="text-sm text-muted-foreground">Разблокировано</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-gray-500/20 to-gray-700/20 border border-gray-500/30">
              <div className="text-3xl font-bold text-gray-400">{stats.common}</div>
              <div className="text-sm text-muted-foreground">Обычные</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-700/20 border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-400">{stats.rare}</div>
              <div className="text-sm text-muted-foreground">Редкие</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-700/20 border border-purple-500/30">
              <div className="text-3xl font-bold text-purple-400">{stats.epic}</div>
              <div className="text-sm text-muted-foreground">Эпические</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 pulse-glow">
              <div className="text-3xl font-bold text-yellow-400">{stats.legendary}</div>
              <div className="text-sm text-muted-foreground">Легендарные</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-pink-500/20 via-red-500/20 to-purple-600/20 border border-pink-500/30 animate-pulse">
              <div className="text-3xl font-bold text-pink-400">{stats.mythic}</div>
              <div className="text-sm text-muted-foreground">Мифические</div>
            </div>
          </div>

          <Progress 
            value={(stats.unlocked / stats.total) * 100} 
            className="mt-4 h-3"
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant={filter === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilter('all')}
        >
          Все
        </Badge>
        {categories.map(category => (
          <Badge
            key={category}
            variant={filter === category ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setFilter(category)}
          >
            <Icon name={getCategoryIcon(category)} size={14} className="mr-1" />
            {getCategoryName(category)}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredAchievements.map((achievement, index) => {
          const progress = Math.min((achievement.current / achievement.requirement) * 100, 100)
          
          return (
            <Card
              key={achievement.id}
              className={`border-2 transition-all hover:scale-105 fade-in-up ${
                achievement.unlocked
                  ? `${getRarityBorder(achievement.rarity)} bg-gradient-to-br ${getRarityColor(achievement.rarity)}/10`
                  : 'border-slate-700 bg-slate-800/50 grayscale'
              }`}
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    achievement.unlocked
                      ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} shimmer`
                      : 'bg-slate-700'
                  }`}>
                    <Icon 
                      name={achievement.icon as any} 
                      size={32} 
                      className={achievement.unlocked ? 'text-white' : 'text-slate-500'}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <CardTitle className={achievement.unlocked ? 'chrome-text' : 'text-slate-500'}>
                        {achievement.title}
                      </CardTitle>
                      <Badge className={achievement.unlocked ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}` : 'bg-slate-700'}>
                        {achievement.rarity === 'common' && 'Обычное'}
                        {achievement.rarity === 'rare' && 'Редкое'}
                        {achievement.rarity === 'epic' && 'Эпическое'}
                        {achievement.rarity === 'legendary' && 'Легендарное'}
                        {achievement.rarity === 'mythic' && 'Мифическое'}
                      </Badge>
                    </div>
                    <CardDescription>
                      {achievement.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Прогресс</span>
                    <span className="font-bold">
                      {achievement.current} / {achievement.requirement}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name={getCategoryIcon(achievement.category)} size={16} />
                    <span>{getCategoryName(achievement.category)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 font-bold text-yellow-500">
                      <Icon name="Coins" size={16} />
                      <span>{achievement.reward} ЛК</span>
                    </div>
                    {achievement.krestReward && (
                      <div className="flex items-center gap-1 font-bold text-purple-500">
                        <span className="text-lg">✠</span>
                        <span>{achievement.krestReward} КК</span>
                      </div>
                    )}
                  </div>
                </div>

                {achievement.unlocked && (
                  <div className="p-2 bg-green-500/20 rounded-lg text-center">
                    <span className="text-green-400 font-semibold text-sm flex items-center justify-center gap-1">
                      <Icon name="Check" size={16} />
                      Разблокировано!
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}