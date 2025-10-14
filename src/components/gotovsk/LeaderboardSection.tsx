import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Icon from '@/components/ui/icon'
import { getCurrentUser } from '@/utils/auth'

interface User {
  id: string
  username: string
  lizcoins: number
}

export function LeaderboardSection() {
  const [leaders, setLeaders] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState(getCurrentUser())

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const sortedUsers = users
      .sort((a: User, b: User) => b.lizcoins - a.lizcoins)
      .slice(0, 10)
    
    setLeaders(sortedUsers)
    
    const handleAuthChange = () => {
      setCurrentUser(getCurrentUser())
    }
    
    window.addEventListener('auth-change', handleAuthChange)
    return () => window.removeEventListener('auth-change', handleAuthChange)
  }, [])

  const getMedalIcon = (position: number) => {
    if (position === 1) return '🥇'
    if (position === 2) return '🥈'
    if (position === 3) return '🥉'
    return `${position}.`
  }

  const getMedalColor = (position: number) => {
    if (position === 1) return 'from-yellow-400 to-yellow-600'
    if (position === 2) return 'from-gray-300 to-gray-500'
    if (position === 3) return 'from-orange-400 to-orange-600'
    return 'from-heritage-beige to-heritage-brown/30'
  }

  if (!currentUser) {
    return (
      <div className="space-y-6">
        <Alert className="border-blue-200 bg-blue-50">
          <Icon name="Info" size={16} className="text-blue-600" />
          <AlertDescription className="text-blue-800">
            Войдите в аккаунт, чтобы увидеть таблицу лидеров и соревноваться за первое место!
          </AlertDescription>
        </Alert>
        
        <Card className="border-heritage-brown/20">
          <CardHeader>
            <CardTitle className="text-heritage-brown flex items-center gap-2">
              <Icon name="Trophy" size={24} />
              Таблица лидеров
            </CardTitle>
            <CardDescription>
              Требуется авторизация для просмотра
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Lock" size={48} className="mx-auto mb-4 opacity-30" />
              <p>Войдите в аккаунт, чтобы увидеть рейтинг игроков</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-heritage-brown/20">
        <CardHeader>
          <CardTitle className="text-heritage-brown flex items-center gap-2">
            <Icon name="Trophy" size={24} className="text-yellow-600" />
            Таблица лидеров
          </CardTitle>
          <CardDescription>
            Топ-10 жителей Готовска по количеству лизкоинов
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leaders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Users" size={48} className="mx-auto mb-4 opacity-30" />
              <p>Пока нет участников рейтинга</p>
              <p className="text-sm mt-2">Станьте первым лидером Готовска!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaders.map((user, index) => {
                const position = index + 1
                const isCurrentUser = user.id === currentUser?.id
                
                return (
                  <div
                    key={user.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                      isCurrentUser 
                        ? 'border-heritage-brown bg-heritage-beige/50 shadow-md' 
                        : 'border-heritage-brown/10 hover:border-heritage-brown/30'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getMedalColor(position)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                      {position <= 3 ? getMedalIcon(position) : position}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-heritage-brown">
                          {user.username}
                        </h3>
                        {isCurrentUser && (
                          <Badge variant="outline" className="bg-heritage-brown text-white border-heritage-brown">
                            Вы
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Icon name="Coins" size={14} className="text-yellow-600" />
                        <span className="font-medium text-heritage-brown">{user.lizcoins} ЛК</span>
                      </div>
                    </div>
                    
                    {position === 1 && (
                      <Badge className="bg-yellow-500 text-white border-none">
                        Лидер
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {currentUser && leaders.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Icon name="Lightbulb" size={20} className="text-blue-600 mt-0.5" />
              <div className="space-y-2 text-sm text-blue-800">
                <p className="font-semibold">Как заработать больше лизкоинов:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Посещайте разные разделы портала (+5 ЛК за новый раздел)</li>
                  <li>Заходите каждый день (+10 ЛК за ежедневный визит)</li>
                  <li>Покупайте подарки и участвуйте в жизни города</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
