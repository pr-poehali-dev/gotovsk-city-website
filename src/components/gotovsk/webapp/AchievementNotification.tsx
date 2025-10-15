import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import Icon from '@/components/ui/icon'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  reward: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export default function AchievementNotification() {
  const [notification, setNotification] = useState<Achievement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleAchievement = (event: CustomEvent) => {
      const achievement = event.detail as Achievement
      setNotification(achievement)
      setVisible(true)

      setTimeout(() => {
        setVisible(false)
        setTimeout(() => setNotification(null), 500)
      }, 5000)
    }

    window.addEventListener('achievement-unlocked', handleAchievement as EventListener)
    return () => {
      window.removeEventListener('achievement-unlocked', handleAchievement as EventListener)
    }
  }, [])

  if (!notification) return null

  const getRarityGradient = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-700'
      case 'rare': return 'from-blue-500 to-blue-700'
      case 'epic': return 'from-purple-500 to-purple-700'
      case 'legendary': return 'from-yellow-500 to-orange-600'
    }
  }

  return (
    <div
      className={`fixed top-24 right-6 z-50 transition-all duration-500 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-[calc(100%+2rem)] opacity-0'
      }`}
    >
      <Card className={`border-2 bg-gradient-to-br ${getRarityGradient(notification.rarity)} shadow-2xl w-96 pulse-glow`}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 animate-bounce-in">
              <Icon name={notification.icon as any} size={32} className="text-white" />
            </div>
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Trophy" size={18} className="text-yellow-300" />
                <p className="font-bold text-sm uppercase tracking-wide">
                  {notification.rarity === 'common' && 'Достижение'}
                  {notification.rarity === 'rare' && 'Редкое достижение'}
                  {notification.rarity === 'epic' && 'Эпическое достижение'}
                  {notification.rarity === 'legendary' && '🎉 Легендарное достижение!'}
                </p>
              </div>
              <h3 className="text-xl font-bold mb-1">{notification.title}</h3>
              <p className="text-white/90 text-sm mb-3">{notification.description}</p>
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1 w-fit">
                <Icon name="Coins" size={16} className="text-yellow-300" />
                <span className="font-bold text-yellow-300">+{notification.reward} ЛК</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
