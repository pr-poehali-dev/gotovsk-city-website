import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Icon from '@/components/ui/icon'
import { getCurrentUser, logout } from '@/utils/auth'
import { getKrestcoins, hasVIPStatus, hasVIPEliteStatus, getVIPExpiry, getVIPEliteExpiry, formatVIPExpiry } from '@/utils/krestcoins'
import { AuthModal } from './AuthModal'
import CrystalAnimation from '@/components/ui/crystal-animation'

export function ProfileSection() {
  const [user, setUser] = useState(getCurrentUser())
  const [krestcoins, setKrestcoins] = useState(getKrestcoins())
  const [isVIP, setIsVIP] = useState(hasVIPStatus())
  const [isVIPElite, setIsVIPElite] = useState(hasVIPEliteStatus())
  const [vipExpiry, setVipExpiry] = useState(getVIPExpiry())
  const [vipEliteExpiry, setVipEliteExpiry] = useState(getVIPEliteExpiry())
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getCurrentUser())
    }
    
    const handleKrestcoinsChange = () => {
      setKrestcoins(getKrestcoins())
      setIsVIP(hasVIPStatus())
      setIsVIPElite(hasVIPEliteStatus())
      setVipExpiry(getVIPExpiry())
      setVipEliteExpiry(getVIPEliteExpiry())
    }
    
    window.addEventListener('auth-change', handleAuthChange)
    window.addEventListener('krestcoins-earned', handleKrestcoinsChange)
    window.addEventListener('vip-activated', handleKrestcoinsChange)
    window.addEventListener('vip-renewed', handleKrestcoinsChange)
    window.addEventListener('vip-elite-activated', handleKrestcoinsChange)
    window.addEventListener('vip-elite-renewed', handleKrestcoinsChange)
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange)
      window.removeEventListener('krestcoins-earned', handleKrestcoinsChange)
      window.removeEventListener('vip-activated', handleKrestcoinsChange)
      window.removeEventListener('vip-renewed', handleKrestcoinsChange)
      window.removeEventListener('vip-elite-activated', handleKrestcoinsChange)
      window.removeEventListener('vip-elite-renewed', handleKrestcoinsChange)
    }
  }, [])

  if (!user) {
    return (
      <>
        <Card className="border-heritage-brown/20">
          <CardContent className="p-8 text-center space-y-4">
            <Icon name="UserX" className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">Войдите в аккаунт чтобы увидеть профиль</p>
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="bg-heritage-brown hover:bg-heritage-brown/90"
            >
              <Icon name="LogIn" size={20} className="mr-2" />
              Войти
            </Button>
          </CardContent>
        </Card>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    )
  }

  const memberDays = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-6">
      <Card className="border-heritage-brown/20">
        <CardHeader>
          <CardTitle className="text-heritage-brown flex items-center gap-2">
            <Icon name="User" size={24} />
            Профиль пользователя
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-heritage-brown to-heritage-dark rounded-full flex items-center justify-center">
              <span className="text-3xl text-white font-bold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-heritage-brown">{user.username}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-heritage-beige/30 p-4 rounded-lg text-center">
              <Icon name="Coins" className="mx-auto text-yellow-600 mb-2" size={32} />
              <div className="text-3xl font-bold text-heritage-brown">{user.lizcoins}</div>
              <div className="text-sm text-muted-foreground">Лизкоинов</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg text-center border-2 border-purple-200">
              <span className="text-2xl mb-2 block">✠</span>
              <div className="text-3xl font-bold text-purple-700">{krestcoins}</div>
              <div className="text-sm text-purple-600 font-semibold">Крест Клин</div>
            </div>

            <div className="bg-heritage-beige/30 p-4 rounded-lg text-center">
              <Icon name="Calendar" className="mx-auto text-heritage-brown mb-2" size={32} />
              <div className="text-3xl font-bold text-heritage-brown">{memberDays}</div>
              <div className="text-sm text-muted-foreground">Дней с нами</div>
            </div>
          </div>

          <Separator />

          {(isVIP || isVIPElite) && (
            <>
              <div className="space-y-3">
                <h4 className="font-semibold text-heritage-brown flex items-center gap-2">
                  <Icon name="Crown" size={20} className="text-yellow-600" />
                  Подписка
                </h4>
                {isVIPElite ? (
                  <Card className="relative overflow-hidden border-2 border-blue-400 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600">
                    <CrystalAnimation />
                    <CardContent className="p-4 relative z-10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40 animate-pulse-glow">
                          <Icon name="Sparkles" className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            VIP Elite
                            <span className="text-lg">✨</span>
                          </h3>
                          <p className="text-blue-100 text-sm">Элитный статус</p>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm">
                        Действительна до: {formatVIPExpiry(vipEliteExpiry)}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Icon name="Crown" className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">VIP Статус</h3>
                          <p className="text-yellow-100 text-sm">Премиум членство</p>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm">
                        Действительна до: {formatVIPExpiry(vipExpiry)}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
              <Separator />
            </>
          )}

          <div className="space-y-3">
            <h4 className="font-semibold text-heritage-brown">Информация</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дата регистрации:</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID пользователя:</span>
                <span className="font-mono text-xs">{user.id}</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={logout}
            variant="outline" 
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
          >
            <Icon name="LogOut" size={16} className="mr-2" />
            Выйти из аккаунта
          </Button>
        </CardContent>
      </Card>

      <Card className="border-heritage-brown/20">
        <CardHeader>
          <CardTitle className="text-heritage-brown flex items-center gap-2">
            <Icon name="Award" size={24} />
            Достижения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-heritage-beige/30 rounded-lg">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-xs text-muted-foreground">Новичок</div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-lg opacity-50">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-xs text-muted-foreground">Исследователь</div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-lg opacity-50">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-xs text-muted-foreground">Эксперт</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}