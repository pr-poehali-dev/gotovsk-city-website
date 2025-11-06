import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Icon from '@/components/ui/icon'
import CrystalAnimation from '@/components/ui/crystal-animation'
import { gifts, boxes } from './data'
import { getCurrentUser, updateUserLizcoins } from '@/utils/auth'
import { getLizcoins } from '@/utils/lizcoins'
import { getKrestcoins, hasVIPStatus, getVIPExpiry, activateVIP, renewVIP, formatVIPExpiry, hasVIPEliteStatus, getVIPEliteExpiry, activateVIPElite, renewVIPElite } from '@/utils/krestcoins'
import { addToInventory } from '@/utils/inventory'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function GiftsSection() {
  const [user, setUser] = useState(getCurrentUser())
  const [lizcoins, setLizcoins] = useState(() => user?.lizcoins || 0)
  const [krestcoins, setKrestcoins] = useState(() => getKrestcoins())
  const [isVIP, setIsVIP] = useState(() => hasVIPStatus())
  const [vipExpiry, setVipExpiry] = useState(() => getVIPExpiry())
  const [isVIPElite, setIsVIPElite] = useState(() => hasVIPEliteStatus())
  const [vipEliteExpiry, setVipEliteExpiry] = useState(() => getVIPEliteExpiry())
  
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(() => {
    const lastClaim = localStorage.getItem('dailyRewardClaimed')
    if (!lastClaim) return false
    const claimDate = new Date(lastClaim).toDateString()
    const today = new Date().toDateString()
    return claimDate === today
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
  const [activeTab, setActiveTab] = useState('gifts')

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
      setIsVIPElite(hasVIPEliteStatus())
      setVipEliteExpiry(getVIPEliteExpiry())
    }
    
    window.addEventListener('auth-change', handleAuthChange)
    window.addEventListener('storage', handleCustomGiftsChange)
    window.addEventListener('krestcoins-earned', handleKrestcoinsChange)
    window.addEventListener('vip-activated', handleKrestcoinsChange)
    window.addEventListener('vip-renewed', handleKrestcoinsChange)
    window.addEventListener('vip-elite-activated', handleKrestcoinsChange)
    window.addEventListener('vip-elite-renewed', handleKrestcoinsChange)
    return () => {
      window.removeEventListener('auth-change', handleAuthChange)
      window.removeEventListener('storage', handleCustomGiftsChange)
      window.removeEventListener('krestcoins-earned', handleKrestcoinsChange)
      window.removeEventListener('vip-activated', handleKrestcoinsChange)
      window.removeEventListener('vip-renewed', handleKrestcoinsChange)
      window.removeEventListener('vip-elite-activated', handleKrestcoinsChange)
      window.removeEventListener('vip-elite-renewed', handleKrestcoinsChange)
    }
  }, [])



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
    
    addToInventory({
      id: gift.id,
      type: 'gift',
      name: gift.name,
      description: gift.description,
      icon: gift.icon
    })
    
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

  const handleBoxPurchase = (box: typeof boxes[0]) => {
    if (!user) {
      setMessage('Войдите в аккаунт, чтобы покупать ящики!')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    if (!isVIP && !isVIPElite) {
      setMessage('Ящики доступны только VIP пользователям!')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    if (lizcoins < box.price) {
      setMessage('Недостаточно лизкоинов для покупки!')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const newLizcoins = lizcoins - box.price
    
    setLizcoins(newLizcoins)
    updateUserLizcoins(newLizcoins)
    
    const transaction = {
      userId: user.id,
      username: user.username,
      amount: -box.price,
      reason: `Покупка: ${box.name}`,
      timestamp: new Date().toISOString(),
      balanceAfter: newLizcoins
    }
    
    const allTransactions = JSON.parse(localStorage.getItem('lizcoinsTransactions') || '[]')
    allTransactions.push(transaction)
    localStorage.setItem('lizcoinsTransactions', JSON.stringify(allTransactions))
    
    addToInventory({
      id: box.id,
      type: 'box',
      name: box.name,
      description: box.description,
      icon: box.icon,
      metadata: { rarity: box.rarity }
    })
    
    setMessage(`Вы успешно приобрели: ${box.name}!`)
    setTimeout(() => setMessage(''), 5000)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600'
      case 'rare': return 'from-blue-400 to-blue-600'
      case 'epic': return 'from-purple-400 to-purple-600'
      case 'legendary': return 'from-yellow-400 to-orange-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Обычный'
      case 'rare': return 'Редкий'
      case 'epic': return 'Эпический'
      case 'legendary': return 'Легендарный'
      default: return 'Обычный'
    }
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

      <Card className="border-green-400 border-2 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Icon name="Gift" size={24} className="text-green-600" />
            Бесплатно
          </CardTitle>
          <p className="text-green-700">Ежедневные награды для всех игроков</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <Card className={`border-2 ${!dailyRewardClaimed ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-gray-100'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${!dailyRewardClaimed ? 'bg-green-500' : 'bg-gray-400'}`}>
                      <Icon name="Calendar" className="text-white" size={28} />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Ежедневная награда</p>
                      <div className="flex items-center gap-2">
                        <Icon name="Coins" size={16} className="text-yellow-600" />
                        <span className="font-semibold text-yellow-700">+50 ЛК</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      if (dailyRewardClaimed) {
                        setMessage('Вы уже получили награду сегодня!')
                      } else {
                        const newLizcoins = lizcoins + 50
                        setLizcoins(newLizcoins)
                        updateUserLizcoins(newLizcoins)
                        localStorage.setItem('dailyRewardClaimed', new Date().toISOString())
                        setDailyRewardClaimed(true)
                        setMessage('Вы получили ежедневную награду: 50 лизкоинов!')
                      }
                      setTimeout(() => setMessage(''), 3000)
                    }}
                    disabled={dailyRewardClaimed}
                    className={!dailyRewardClaimed ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    {dailyRewardClaimed ? 'Получено' : 'Забрать'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {isVIP && (
              <Card className="border-2 border-yellow-500 bg-gradient-to-br from-yellow-100 to-amber-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-500 to-amber-600">
                        <Icon name="Crown" className="text-white" size={28} />
                      </div>
                      <div>
                        <p className="font-bold text-lg flex items-center gap-2">
                          VIP Бонус
                          <Badge className="bg-yellow-500 text-yellow-950">VIP</Badge>
                        </p>
                        <div className="flex items-center gap-2">
                          <Icon name="Coins" size={16} className="text-yellow-600" />
                          <span className="font-semibold text-yellow-700">+100 ЛК</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        const vipRewardKey = `vipDailyReward_${new Date().toDateString()}`
                        const claimed = localStorage.getItem(vipRewardKey)
                        if (claimed) {
                          setMessage('Вы уже получили VIP награду сегодня!')
                        } else {
                          const newLizcoins = lizcoins + 100
                          setLizcoins(newLizcoins)
                          updateUserLizcoins(newLizcoins)
                          localStorage.setItem(vipRewardKey, 'true')
                          setMessage('Вы получили VIP награду: 100 лизкоинов!')
                        }
                        setTimeout(() => setMessage(''), 3000)
                      }}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      Забрать VIP
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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

      <Card className="border-blue-500 border-2 bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200 shadow-2xl relative overflow-hidden">
        <CrystalAnimation />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/40 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-cyan-400/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center relative shadow-2xl animate-pulse">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M20 2L28 12H12L20 2Z" fill="currentColor" opacity="0.9"/>
                  <path d="M28 12H12L4 24L20 36L36 24L28 12Z" fill="currentColor" opacity="0.7"/>
                  <path d="M20 36L12 12L20 2L28 12L20 36Z" fill="currentColor"/>
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-2xl"></div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <CardTitle className="text-3xl text-blue-950 font-black">VIP ELITE</CardTitle>
                  <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 shadow-lg animate-pulse">ЛЕГЕНДА</Badge>
                </div>
                <p className="text-blue-800 mt-1 font-semibold">Максимальные привилегии на 30 дней</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-1 bg-purple-200 px-4 py-2 rounded-full border-2 border-purple-400 shadow-lg">
                <span className="text-3xl">✠</span>
                <span className="font-black text-purple-900 text-2xl">50 КК</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 bg-white/70 rounded-lg shadow border border-blue-200">
              <Icon name="Coins" className="text-blue-600" size={20} />
              <span className="text-sm font-semibold text-blue-950">Награды x2</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white/70 rounded-lg shadow border border-blue-200">
              <Icon name="Sparkles" className="text-blue-600" size={20} />
              <span className="text-sm font-semibold text-blue-950">Все VIP игры</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white/70 rounded-lg shadow border border-blue-200">
              <Icon name="Gift" className="text-blue-600" size={20} />
              <span className="text-sm font-semibold text-blue-950">Эксклюзивные подарки</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white/70 rounded-lg shadow border border-blue-200">
              <Icon name="Zap" className="text-blue-600" size={20} />
              <span className="text-sm font-semibold text-blue-950">Ускорение x3</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white/70 rounded-lg shadow border border-blue-200">
              <Icon name="Trophy" className="text-blue-600" size={20} />
              <span className="text-sm font-semibold text-blue-950">Уникальные достижения</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white/70 rounded-lg shadow border border-blue-200">
              <Icon name="Star" className="text-blue-600" size={20} />
              <span className="text-sm font-semibold text-blue-950">Elite бейдж</span>
            </div>
          </div>
          
          <Button
            onClick={() => {
              if (isVIPElite) {
                const success = renewVIPElite()
                if (success) {
                  setMessage('VIP Elite статус продлён на 30 дней!')
                  setKrestcoins(getKrestcoins())
                  setVipEliteExpiry(getVIPEliteExpiry())
                } else {
                  setMessage('Недостаточно Крест Клин! Нужно 50 КК')
                }
              } else {
                const success = activateVIPElite()
                if (success) {
                  setMessage('VIP Elite статус активирован на 30 дней!')
                  setKrestcoins(getKrestcoins())
                  setIsVIPElite(true)
                  setVipEliteExpiry(getVIPEliteExpiry())
                } else {
                  setMessage('Недостаточно Крест Клин! Нужно 50 КК')
                }
              }
              setTimeout(() => setMessage(''), 3000)
            }}
            disabled={krestcoins < 50}
            className={`w-full h-14 text-xl font-black ${
              krestcoins >= 50
                ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-700 hover:via-cyan-600 hover:to-blue-700 text-white shadow-2xl animate-pulse'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="inline">
              <path d="M12 2L16 8H8L12 2Z"/>
              <path d="M16 8H8L4 14L12 18L20 14L16 8Z" opacity="0.7"/>
            </svg>
            <span className="ml-2">
              {isVIPElite ? 'Продлить VIP Elite' : 'Активировать VIP Elite'}
            </span>
          </Button>
          
          {krestcoins < 50 && (
            <p className="text-center text-sm font-semibold text-blue-800 bg-blue-100 p-2 rounded-lg">
              Крест Клин можно получить за мифические и легендарные достижения
            </p>
          )}
        </CardContent>
      </Card>
      
      {isVIPElite && vipEliteExpiry && (
        <Alert className="border-blue-500 bg-gradient-to-r from-blue-100 to-cyan-100 shadow-lg">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="inline text-blue-600">
            <path d="M10 2L14 8H6L10 2Z" fill="currentColor"/>
            <path d="M14 8H6L2 14L10 18L18 14L14 8Z" fill="currentColor" opacity="0.7"/>
          </svg>
          <AlertDescription className="text-blue-950 font-bold ml-2">
            VIP Elite активен • Осталось: {formatVIPExpiry(vipEliteExpiry)}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gifts" className="flex items-center gap-2">
            <Icon name="Gift" size={18} />
            Подарки
          </TabsTrigger>
          <TabsTrigger value="boxes" className="flex items-center gap-2">
            <Icon name="Package" size={18} />
            Ящики
            {(isVIP || isVIPElite) && <Badge className="ml-1 bg-yellow-500 text-yellow-950">VIP</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gifts" className="space-y-4 mt-6">
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
        </TabsContent>

        <TabsContent value="boxes" className="space-y-4 mt-6">
          {!isVIP && !isVIPElite ? (
            <Alert className="border-yellow-400 bg-yellow-50">
              <Icon name="Lock" size={16} className="text-yellow-600" />
              <AlertDescription className="text-yellow-900">
                Ящики доступны только для VIP пользователей! Приобретите VIP статус в разделе подписок.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {boxes.map((box) => {
                const canAfford = lizcoins >= box.price
                
                return (
                  <Card key={box.id} className={`border-2 transition-all hover:shadow-xl ${
                    !canAfford ? 'opacity-60' : ''
                  }`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${getRarityColor(box.rarity)} rounded-lg flex items-center justify-center shadow-lg`}>
                            <Icon name={box.icon as any} className="text-white" size={24} />
                          </div>
                          <div>
                            <CardTitle className="text-heritage-brown">{box.name}</CardTitle>
                            <Badge className={`mt-1 bg-gradient-to-r ${getRarityColor(box.rarity)} text-white border-0`}>
                              {getRarityLabel(box.rarity)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Icon name="Coins" className="text-yellow-600" size={16} />
                            <span className="font-bold text-heritage-brown">{box.price}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {box.description}
                      </p>
                      
                      <Button
                        onClick={() => handleBoxPurchase(box)}
                        disabled={!canAfford}
                        className={`w-full ${
                          canAfford 
                            ? `bg-gradient-to-r ${getRarityColor(box.rarity)} hover:opacity-90 text-white`
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {!canAfford 
                          ? `Недостаточно лизкоинов (нужно ${box.price - lizcoins} ЛК)`
                          : 'Купить ящик'
                        }
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}