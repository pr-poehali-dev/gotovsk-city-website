import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Icon from '@/components/ui/icon'
import { gifts } from './data'
import { getCurrentUser, updateUserLizcoins } from '@/utils/auth'
import { getLizcoins } from '@/utils/lizcoins'
import { getKrestcoins, hasVIPStatus, getVIPExpiry, activateVIP, renewVIP, formatVIPExpiry } from '@/utils/krestcoins'

export function GiftsSection() {
  const [user, setUser] = useState(getCurrentUser())
  const [lizcoins, setLizcoins] = useState(() => user?.lizcoins || 0)
  const [krestcoins, setKrestcoins] = useState(() => getKrestcoins())
  const [isVIP, setIsVIP] = useState(() => hasVIPStatus())
  const [vipExpiry, setVipExpiry] = useState(() => getVIPExpiry())
  
  const [lastVisit, setLastVisit] = useState(() => {
    return localStorage.getItem('lastVisit') || ''
  })
  
  const [purchasedGifts, setPurchasedGifts] = useState(() => {
    const saved = localStorage.getItem('purchasedGifts')
    return saved ? JSON.parse(saved) : []
  })
  
  const [message, setMessage] = useState('')
  const [customGifts, setCustomGifts] = useState(() => {
    const saved = localStorage.getItem('customGifts')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLizcoins(currentUser?.lizcoins || 0)
    setKrestcoins(getKrestcoins())
    setIsVIP(hasVIPStatus())
    setVipExpiry(getVIPExpiry())
    
    const handleAuthChange = () => {
      const updatedUser = getCurrentUser()
      setUser(updatedUser)
      setLizcoins(updatedUser?.lizcoins || 0)
      setKrestcoins(getKrestcoins())
      setIsVIP(hasVIPStatus())
      setVipExpiry(getVIPExpiry())
    }
    
    const handleCustomGiftsChange = () => {
      const saved = localStorage.getItem('customGifts')
      setCustomGifts(saved ? JSON.parse(saved) : [])
    }
    
    const handleKrestcoinsChange = () => {
      setKrestcoins(getKrestcoins())
      setIsVIP(hasVIPStatus())
      setVipExpiry(getVIPExpiry())
    }
    
    window.addEventListener('auth-change', handleAuthChange)
    window.addEventListener('storage', handleCustomGiftsChange)
    window.addEventListener('krestcoins-earned', handleKrestcoinsChange)
    window.addEventListener('vip-activated', handleKrestcoinsChange)
    window.addEventListener('vip-renewed', handleKrestcoinsChange)
    return () => {
      window.removeEventListener('auth-change', handleAuthChange)
      window.removeEventListener('storage', handleCustomGiftsChange)
      window.removeEventListener('krestcoins-earned', handleKrestcoinsChange)
      window.removeEventListener('vip-activated', handleKrestcoinsChange)
      window.removeEventListener('vip-renewed', handleKrestcoinsChange)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    
    const today = new Date().toDateString()
    
    if (lastVisit !== today) {
      const newLizcoins = lizcoins + 10
      setLizcoins(newLizcoins)
      setLastVisit(today)
      setMessage('Вы получили 10 лизкоинов за ежедневное посещение!')
      
      updateUserLizcoins(newLizcoins)
      localStorage.setItem('lastVisit', today)
      
      setTimeout(() => setMessage(''), 5000)
    }
  }, [user])

  const handlePurchase = (gift: typeof gifts[0]) => {
    if (!user) {
      setMessage('Войдите в аккаунт, чтобы покупать подарки!')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    if (lizcoins < gift.price) {
      setMessage('Недостаточно лизкоинов для покупки!')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    if (gift.limited) {
      const purchaseCount = purchasedGifts.filter((id: string) => id === gift.id).length
      if (purchaseCount >= (gift.total || 1)) {
        setMessage('Этот подарок уже недоступен!')
        setTimeout(() => setMessage(''), 3000)
        return
      }
    }

    const newLizcoins = lizcoins - gift.price
    const newPurchasedGifts = [...purchasedGifts, gift.id]
    
    setLizcoins(newLizcoins)
    updateUserLizcoins(newLizcoins)
    
    const transaction = {
      userId: user.id,
      username: user.username,
      amount: -gift.price,
      reason: `Покупка: ${gift.name}`,
      timestamp: new Date().toISOString(),
      balanceAfter: newLizcoins
    }
    
    const allTransactions = JSON.parse(localStorage.getItem('lizcoinsTransactions') || '[]')
    allTransactions.push(transaction)
    localStorage.setItem('lizcoinsTransactions', JSON.stringify(allTransactions))
    
    setPurchasedGifts(newPurchasedGifts)
    setMessage(`Вы успешно приобрели: ${gift.name}!`)
    
    localStorage.setItem('purchasedGifts', JSON.stringify(newPurchasedGifts))
    
    setTimeout(() => setMessage(''), 5000)
  }

  const getGiftStatus = (gift: typeof gifts[0]) => {
    if (gift.limited) {
      const purchaseCount = purchasedGifts.filter((id: string) => id === gift.id).length
      const remaining = (gift.total || 1) - purchaseCount
      return { canPurchase: remaining > 0, remaining }
    }
    return { canPurchase: true, remaining: null }
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Alert className="border-blue-200 bg-blue-50">
          <Icon name="Info" size={16} className="text-blue-600" />
          <AlertDescription className="text-blue-800">
            Войдите в аккаунт, чтобы получать лизкоины и покупать подарки!
          </AlertDescription>
        </Alert>
        
        <Card className="border-heritage-brown/20">
          <CardHeader>
            <CardTitle className="text-heritage-brown flex items-center gap-2">
              <Icon name="Gift" size={24} />
              Подарки за лизкоины
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Lock" size={48} className="mx-auto mb-4 opacity-30" />
              <p>Войдите в аккаунт, чтобы увидеть подарки</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-heritage-brown mb-2">Подарки за лизкоины</h1>
            <p className="text-muted-foreground">Обменивайте лизкоины на эксклюзивные подарки города</p>
          </div>
          
          <div className="flex gap-3">
            <Card className="border-heritage-brown/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <Icon name="Coins" className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Лизкоины</p>
                    <p className="text-2xl font-bold text-heritage-brown">{lizcoins} ЛК</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center relative">
                    <span className="text-2xl text-white font-bold">✠</span>
                  </div>
                  <div>
                    <p className="text-sm text-purple-700 font-medium">Крест Клин</p>
                    <p className="text-2xl font-bold text-purple-900">{krestcoins} КК</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {isVIP && vipExpiry && (
          <Alert className="border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50">
            <Icon name="Crown" size={20} className="text-yellow-600" />
            <AlertDescription className="text-yellow-900 font-medium">
              VIP-статус активен • Осталось: {formatVIPExpiry(vipExpiry)}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {message && (
        <Alert className="border-heritage-brown/20">
          <Icon name="Info" size={16} />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Card className="border-heritage-brown/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-heritage-brown">
            <Icon name="Gift" size={20} />
            Как получить лизкоины
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-heritage-beige/30 rounded-lg">
              <Icon name="Calendar" className="text-heritage-brown" size={20} />
              <div>
                <p className="font-medium">Ежедневный вход</p>
                <p className="text-sm text-muted-foreground">+10 лизкоинов</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-heritage-beige/30 rounded-lg">
              <Icon name="Eye" className="text-heritage-brown" size={20} />
              <div>
                <p className="font-medium">Посещение разделов</p>
                <p className="text-sm text-muted-foreground">+5 лизкоинов в день</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-heritage-beige/30 rounded-lg">
              <Icon name="Trophy" className="text-heritage-brown" size={20} />
              <div>
                <p className="font-medium">Мероприятия</p>
                <p className="text-sm text-muted-foreground">Бонусы за активность</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-400 border-2 bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-yellow-300/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-300/20 to-transparent rounded-full blur-3xl"></div>
        
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl flex items-center justify-center relative shadow-lg">
                <Icon name="Crown" className="text-white" size={32} />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-xl"></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl text-yellow-900">VIP-статус</CardTitle>
                  <Badge className="bg-yellow-500 text-yellow-950 border-yellow-600">ЭКСКЛЮЗИВ</Badge>
                </div>
                <p className="text-yellow-700 mt-1">Премиум возможности на 30 дней</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-1 bg-purple-100 px-3 py-1 rounded-full border-2 border-purple-300">
                <span className="text-2xl">✠</span>
                <span className="font-bold text-purple-900 text-xl">1 КК</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 relative">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
              <Icon name="Sparkles" className="text-yellow-600" size={18} />
              <span className="text-sm text-yellow-900">Эксклюзивные игры</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
              <Icon name="Gift" className="text-yellow-600" size={18} />
              <span className="text-sm text-yellow-900">Особые подарки</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
              <Icon name="Zap" className="text-yellow-600" size={18} />
              <span className="text-sm text-yellow-900">Ускоренный заработок</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
              <Icon name="Trophy" className="text-yellow-600" size={18} />
              <span className="text-sm text-yellow-900">VIP-достижения</span>
            </div>
          </div>
          
          <Button
            onClick={() => {
              if (isVIP) {
                const success = renewVIP()
                if (success) {
                  setMessage('VIP-статус продлён на 30 дней!')
                  setKrestcoins(getKrestcoins())
                  setVipExpiry(getVIPExpiry())
                } else {
                  setMessage('Недостаточно Крест Клин! Нужен 1 КК')
                }
              } else {
                const success = activateVIP()
                if (success) {
                  setMessage('VIP-статус активирован на 30 дней!')
                  setKrestcoins(getKrestcoins())
                  setIsVIP(true)
                  setVipExpiry(getVIPExpiry())
                } else {
                  setMessage('Недостаточно Крест Клин! Нужен 1 КК')
                }
              }
              setTimeout(() => setMessage(''), 3000)
            }}
            disabled={krestcoins < 1}
            className={`w-full h-12 text-lg font-bold ${
              krestcoins >= 1
                ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-yellow-950 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Icon name="Crown" size={20} />
            <span className="ml-2">
              {isVIP ? 'Продлить VIP-статус' : 'Активировать VIP-статус'}
            </span>
          </Button>
          
          {krestcoins < 1 && (
            <p className="text-center text-sm text-yellow-700">
              Крест Клин можно получить за выполнение легендарных заданий
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {[...gifts, ...customGifts].map((gift) => {
          const status = getGiftStatus(gift)
          const canAfford = lizcoins >= gift.price
          const canPurchase = status.canPurchase && canAfford
          
          return (
            <Card key={gift.id} className={`border-heritage-brown/20 transition-all hover:shadow-lg ${
              !canPurchase ? 'opacity-60' : ''
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-heritage-brown/10 rounded-lg flex items-center justify-center">
                      <Icon name={gift.icon as any} className="text-heritage-brown" size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-heritage-brown">{gift.name}</CardTitle>
                      {gift.limited && (
                        <Badge variant="secondary" className="mt-1">
                          Лимитированный: осталось {status.remaining}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Icon name="Coins" className="text-yellow-600" size={16} />
                      <span className="font-bold text-heritage-brown">{gift.price}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {gift.description}
                </p>
                
                <Button
                  onClick={() => handlePurchase(gift)}
                  disabled={!canPurchase}
                  className={`w-full ${
                    canPurchase 
                      ? 'bg-heritage-brown hover:bg-heritage-brown/90 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {!canAfford 
                    ? `Недостаточно лизкоинов (нужно ${gift.price - lizcoins} ЛК)`
                    : !status.canPurchase 
                      ? 'Недоступно'
                      : 'Получить подарок'
                  }
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}