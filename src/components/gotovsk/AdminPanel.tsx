import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import Icon from '@/components/ui/icon'
import { getCurrentUser, updateUserLizcoins } from '@/utils/auth'
import { addKrestcoins, getKrestcoins } from '@/utils/krestcoins'
import { getAdminRank, getAdminPermissions, setAdminRank, getRankLabel, getRankColor, getAllAdmins, type AdminRank } from '@/utils/adminRanks'
import { gifts } from './data'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface User {
  id: string
  username: string
  lizcoins: number
  email?: string
  createdAt: string
}

interface Gift {
  id: string
  name: string
  price: number
  description: string
  icon: string
  available: boolean
  limited?: boolean
  remaining?: number
  total?: number
}

interface Purchase {
  userId: string
  username: string
  giftId: string
  giftName: string
  price: number
  timestamp: string
}

interface Transaction {
  userId: string
  username: string
  amount: number
  reason: string
  timestamp: string
  balanceAfter: number
}

export function AdminPanel() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [lizcoinsAmount, setLizcoinsAmount] = useState('')
  const [krestcoinsAmount, setKrestcoinsAmount] = useState('')
  const [message, setMessage] = useState('')
  const [customGifts, setCustomGifts] = useState<Gift[]>([])
  
  const [newGiftName, setNewGiftName] = useState('')
  const [newGiftPrice, setNewGiftPrice] = useState('')
  const [newGiftDescription, setNewGiftDescription] = useState('')
  const [newGiftIcon, setNewGiftIcon] = useState('Gift')
  const [activeTab, setActiveTab] = useState<'manage' | 'purchases' | 'transactions' | 'admins'>('manage')
  const [adminRank, setAdminRankState] = useState<AdminRank>(null)
  const [permissions, setPermissions] = useState(getAdminPermissions(null))
  const [allAdmins, setAllAdmins] = useState(getAllAdmins())
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (currentUser) {
      const rank = getAdminRank(currentUser.username)
      setAdminRankState(rank)
      setPermissions(getAdminPermissions(rank))
    }
    loadUsers()
    loadCustomGifts()
    loadPurchases()
    loadTransactions()
    loadAdmins()
    
    const handleAdminRanksChange = () => {
      loadAdmins()
    }
    
    window.addEventListener('admin-ranks-changed', handleAdminRanksChange)
    return () => window.removeEventListener('admin-ranks-changed', handleAdminRanksChange)
  }, [])

  const loadAdmins = () => {
    setAllAdmins(getAllAdmins())
  }

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    setUsers(allUsers)
  }

  const loadCustomGifts = () => {
    const saved = localStorage.getItem('customGifts')
    setCustomGifts(saved ? JSON.parse(saved) : [])
  }

  const loadPurchases = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const purchasedGifts = JSON.parse(localStorage.getItem('purchasedGifts') || '[]')
    const allGifts = [...gifts, ...JSON.parse(localStorage.getItem('customGifts') || '[]')]
    
    const purchaseHistory: Purchase[] = purchasedGifts.map((giftId: string) => {
      const gift = allGifts.find(g => g.id === giftId)
      return {
        userId: 'unknown',
        username: 'Неизвестный',
        giftId: giftId,
        giftName: gift?.name || giftId,
        price: gift?.price || 0,
        timestamp: new Date().toISOString()
      }
    })
    
    setPurchases(purchaseHistory.reverse())
  }

  const loadTransactions = () => {
    const saved = localStorage.getItem('lizcoinsTransactions')
    if (saved) {
      setTransactions(JSON.parse(saved).reverse())
    }
  }

  const saveCustomGifts = (gifts: Gift[]) => {
    localStorage.setItem('customGifts', JSON.stringify(gifts))
    setCustomGifts(gifts)
  }

  const handleAddLizcoins = () => {
    if (!selectedUserId || !lizcoinsAmount) {
      setMessage('Выберите пользователя и укажите количество лизкоинов')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const amount = parseInt(lizcoinsAmount)
    if (isNaN(amount)) {
      setMessage('Введите корректное число')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = allUsers.findIndex((u: User) => u.id === selectedUserId)
    
    if (userIndex !== -1) {
      const newLizcoins = allUsers[userIndex].lizcoins + amount
      allUsers[userIndex].lizcoins = newLizcoins
      
      localStorage.setItem('users', JSON.stringify(allUsers))
      
      const currentUserData = getCurrentUser()
      if (currentUserData && currentUserData.id === selectedUserId) {
        updateUserLizcoins(newLizcoins)
      }
      
      const transaction: Transaction = {
        userId: selectedUserId,
        username: allUsers[userIndex].username,
        amount: amount,
        reason: `Админ: ${amount > 0 ? 'начисление' : 'списание'}`,
        timestamp: new Date().toISOString(),
        balanceAfter: newLizcoins
      }
      
      const allTransactions = JSON.parse(localStorage.getItem('lizcoinsTransactions') || '[]')
      allTransactions.push(transaction)
      localStorage.setItem('lizcoinsTransactions', JSON.stringify(allTransactions))
      
      loadUsers()
      loadTransactions()
      setMessage(`Успешно ${amount > 0 ? 'начислено' : 'списано'} ${Math.abs(amount)} ЛК пользователю ${allUsers[userIndex].username}`)
      setLizcoinsAmount('')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleAddKrestcoins = () => {
    if (!selectedUserId || !krestcoinsAmount) {
      setMessage('Выберите пользователя и укажите количество Крест Клин')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const amount = parseInt(krestcoinsAmount)
    if (isNaN(amount)) {
      setMessage('Введите корректное число')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = allUsers.findIndex((u: User) => u.id === selectedUserId)
    
    if (userIndex !== -1) {
      const currentUserData = getCurrentUser()
      const isSameUser = currentUserData && currentUserData.id === selectedUserId
      
      if (isSameUser) {
        addKrestcoins(amount, `Админ: ${amount > 0 ? 'начисление' : 'списание'}`)
      } else {
        const currentKrest = parseInt(localStorage.getItem(`krestcoins-${selectedUserId}`) || '0')
        const newKrest = currentKrest + amount
        localStorage.setItem(`krestcoins-${selectedUserId}`, newKrest.toString())
      }
      
      setMessage(`Успешно ${amount > 0 ? 'начислено' : 'списано'} ${Math.abs(amount)} КК пользователю ${allUsers[userIndex].username}`)
      setKrestcoinsAmount('')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleAddGift = () => {
    if (!newGiftName || !newGiftPrice || !newGiftDescription) {
      setMessage('Заполните все поля награды')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const price = parseInt(newGiftPrice)
    if (isNaN(price) || price <= 0) {
      setMessage('Цена должна быть положительным числом')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const newGift: Gift = {
      id: `custom_${Date.now()}`,
      name: newGiftName,
      price: price,
      description: newGiftDescription,
      icon: newGiftIcon,
      available: true
    }

    const updatedGifts = [...customGifts, newGift]
    saveCustomGifts(updatedGifts)
    
    setMessage(`Награда "${newGiftName}" успешно добавлена!`)
    setNewGiftName('')
    setNewGiftPrice('')
    setNewGiftDescription('')
    setNewGiftIcon('Gift')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleRemoveGift = (giftId: string) => {
    const updatedGifts = customGifts.filter(g => g.id !== giftId)
    saveCustomGifts(updatedGifts)
    setMessage('Награда успешно удалена')
    setTimeout(() => setMessage(''), 3000)
  }

  if (!currentUser || !adminRank) {
    return (
      <div className="space-y-6">
        <Alert className="border-red-200 bg-red-50">
          <Icon name="ShieldAlert" size={16} className="text-red-600" />
          <AlertDescription className="text-red-800">
            Доступ запрещен. Эта страница доступна только администраторам.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const handleSetAdminRank = (username: string, rank: AdminRank) => {
    setAdminRank(username, rank)
    loadAdmins()
    setMessage(`Ранг ${username} изменён на ${getRankLabel(rank)}`)
    setTimeout(() => setMessage(''), 3000)
  }

  const iconOptions = ['Gift', 'Award', 'Trophy', 'Star', 'Crown', 'Sparkles', 'Gem', 'Heart', 'Ticket', 'Medal']

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTotalStats = () => {
    const totalUsers = users.length
    const totalLizcoins = users.reduce((sum, user) => sum + user.lizcoins, 0)
    const totalPurchases = purchases.length
    const totalSpent = purchases.reduce((sum, p) => sum + p.price, 0)
    
    return { totalUsers, totalLizcoins, totalPurchases, totalSpent }
  }

  const stats = getTotalStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heritage-brown mb-2">Панель администратора</h1>
        <p className="text-muted-foreground">Управление пользователями и наградами портала Готовска</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-heritage-brown/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon name="Users" size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Пользователей</p>
                <p className="text-2xl font-bold text-heritage-brown">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-heritage-brown/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Icon name="Coins" size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Всего ЛК</p>
                <p className="text-2xl font-bold text-heritage-brown">{stats.totalLizcoins}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-heritage-brown/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="ShoppingBag" size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Покупок</p>
                <p className="text-2xl font-bold text-heritage-brown">{stats.totalPurchases}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-heritage-brown/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Icon name="TrendingUp" size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Потрачено ЛК</p>
                <p className="text-2xl font-bold text-heritage-brown">{stats.totalSpent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-heritage-brown/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'manage' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('manage')}
              className={activeTab === 'manage' ? 'bg-heritage-brown' : ''}
            >
              <Icon name="Settings" size={16} className="mr-2" />
              Управление
            </Button>
            <Button
              variant={activeTab === 'purchases' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('purchases')}
              className={activeTab === 'purchases' ? 'bg-heritage-brown' : ''}
            >
              <Icon name="ShoppingBag" size={16} className="mr-2" />
              Покупки ({purchases.length})
            </Button>
            <Button
              variant={activeTab === 'transactions' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('transactions')}
              className={activeTab === 'transactions' ? 'bg-heritage-brown' : ''}
            >
              <Icon name="History" size={16} className="mr-2" />
              Транзакции ({transactions.length})
            </Button>
            {permissions.canManageAdmins && (
              <Button
                variant={activeTab === 'admins' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('admins')}
                className={activeTab === 'admins' ? 'bg-heritage-brown' : ''}
              >
                <Icon name="Shield" size={16} className="mr-2" />
                Администраторы ({allAdmins.length})
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>
      
      <Card className={`border-2 bg-gradient-to-r ${getRankColor(adminRank)}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-white">
            <Icon name="Shield" size={24} />
            <div>
              <p className="font-semibold">Ваш ранг: {getRankLabel(adminRank)}</p>
              <p className="text-sm text-white/90">
                {adminRank === 'super_admin' && 'Полный доступ ко всем функциям'}
                {adminRank === 'senior_admin' && 'Управление пользователями, наградами и новостями'}
                {adminRank === 'middle_admin' && 'Управление наградами и новостями'}
                {adminRank === 'junior_admin' && 'Управление новостями и просмотр статистики'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {message && (
        <Alert className="border-heritage-brown/20 bg-heritage-beige/50">
          <Icon name="Info" size={16} className="text-heritage-brown" />
          <AlertDescription className="text-heritage-brown">{message}</AlertDescription>
        </Alert>
      )}

      {activeTab === 'manage' && (
        <>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-heritage-brown/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-heritage-brown">
              <Icon name="Coins" size={24} className="text-yellow-600" />
              Управление лизкоинами
            </CardTitle>
            <CardDescription>
              Начисление или списание валюты пользователям
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!permissions.canManageUsers ? (
              <Alert className="border-orange-200 bg-orange-50">
                <Icon name="Lock" size={16} className="text-orange-600" />
                <AlertDescription className="text-orange-800">
                  У вас нет прав для управления пользователями
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="user-select">Выберите пользователя</Label>
                  <select
                    id="user-select"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full p-2 border border-heritage-brown/20 rounded-md bg-white"
                  >
                    <option value="">-- Выберите пользователя --</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.username} ({user.lizcoins} ЛК)
                      </option>
                    ))}
                  </select>
                </div>

            <div className="space-y-2">
              <Label htmlFor="lizcoins-amount">Количество лизкоинов</Label>
              <Input
                id="lizcoins-amount"
                type="number"
                value={lizcoinsAmount}
                onChange={(e) => setLizcoinsAmount(e.target.value)}
                placeholder="Введите число (может быть отрицательным)"
              />
              <p className="text-xs text-muted-foreground">
                Положительное число для начисления, отрицательное для списания
              </p>
            </div>

                <Button 
                  onClick={handleAddLizcoins}
                  className="w-full bg-heritage-brown hover:bg-heritage-brown/90"
                  disabled={!selectedUserId || !lizcoinsAmount}
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Применить изменения
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <span className="text-2xl">✠</span>
              Управление Крест Клин
            </CardTitle>
            <CardDescription className="text-purple-700">
              Начисление или списание легендарной валюты
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="krest-user-select" className="text-purple-900">Выберите пользователя</Label>
              <select
                id="krest-user-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full p-2 border border-purple-300 rounded-md bg-white"
              >
                <option value="">-- Выберите пользователя --</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({getKrestcoins()} КК)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="krestcoins-amount" className="text-purple-900">Количество Крест Клин</Label>
              <Input
                id="krestcoins-amount"
                type="number"
                value={krestcoinsAmount}
                onChange={(e) => setKrestcoinsAmount(e.target.value)}
                placeholder="Введите число (может быть отрицательным)"
                className="border-purple-300"
              />
              <p className="text-xs text-purple-700">
                Положительное число для начисления, отрицательное для списания
              </p>
            </div>

            <Button 
              onClick={handleAddKrestcoins}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
              disabled={!selectedUserId || !krestcoinsAmount}
            >
              <span className="mr-2">✠</span>
              Применить изменения
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-heritage-brown/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-heritage-brown">
              <Icon name="Gift" size={24} className="text-purple-600" />
              Добавить награду
            </CardTitle>
            <CardDescription>
              Создание новой награды для магазина подарков
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!permissions.canManageGifts ? (
              <Alert className="border-orange-200 bg-orange-50">
                <Icon name="Lock" size={16} className="text-orange-600" />
                <AlertDescription className="text-orange-800">
                  У вас нет прав для управления наградами
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gift-name">Название награды</Label>
                  <Input
                    id="gift-name"
                    value={newGiftName}
                    onChange={(e) => setNewGiftName(e.target.value)}
                    placeholder="Сертификат в музей"
                  />
                </div>

            <div className="space-y-2">
              <Label htmlFor="gift-price">Цена (лизкоины)</Label>
              <Input
                id="gift-price"
                type="number"
                value={newGiftPrice}
                onChange={(e) => setNewGiftPrice(e.target.value)}
                placeholder="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gift-description">Описание</Label>
              <Textarea
                id="gift-description"
                value={newGiftDescription}
                onChange={(e) => setNewGiftDescription(e.target.value)}
                placeholder="Бесплатный вход в городской музей на месяц"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gift-icon">Иконка</Label>
              <select
                id="gift-icon"
                value={newGiftIcon}
                onChange={(e) => setNewGiftIcon(e.target.value)}
                className="w-full p-2 border border-heritage-brown/20 rounded-md bg-white"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>

                <Button 
                  onClick={handleAddGift}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={!newGiftName || !newGiftPrice || !newGiftDescription}
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить награду
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-heritage-brown/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-heritage-brown">
            <Icon name="Package" size={24} />
            Управление наградами
          </CardTitle>
          <CardDescription>
            Список всех пользовательских наград
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customGifts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Package" size={48} className="mx-auto mb-4 opacity-30" />
              <p>Пока нет добавленных наград</p>
            </div>
          ) : (
            <div className="space-y-3">
              {customGifts.map(gift => (
                <div
                  key={gift.id}
                  className="flex items-center justify-between p-4 border border-heritage-brown/10 rounded-lg hover:border-heritage-brown/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Icon name={gift.icon as any} size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-heritage-brown">{gift.name}</h3>
                      <p className="text-sm text-muted-foreground">{gift.description}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Icon name="Coins" size={14} className="text-yellow-600" />
                        <span className="text-sm font-medium text-heritage-brown">{gift.price} ЛК</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveGift(gift.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
            <div className="space-y-2 text-sm text-blue-800">
              <p className="font-semibold">Возможности админ-панели:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Начисление и списание лизкоинов любому пользователю</li>
                <li>Создание новых наград в магазине подарков</li>
                <li>Удаление пользовательских наград</li>
                <li>Все изменения применяются мгновенно</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      </>
      )}

      {activeTab === 'purchases' && (
        <Card className="border-heritage-brown/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-heritage-brown">
              <Icon name="ShoppingBag" size={24} className="text-green-600" />
              История покупок
            </CardTitle>
            <CardDescription>
              Все покупки подарков пользователями
            </CardDescription>
          </CardHeader>
          <CardContent>
            {purchases.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="ShoppingBag" size={48} className="mx-auto mb-4 opacity-30" />
                <p>Пока нет покупок</p>
              </div>
            ) : (
              <div className="space-y-3">
                {purchases.map((purchase, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-heritage-brown/10 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Icon name="Gift" size={20} className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-heritage-brown">{purchase.giftName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Покупатель: {purchase.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(purchase.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Icon name="Coins" size={16} className="text-yellow-600" />
                        <span className="font-bold text-heritage-brown">{purchase.price} ЛК</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'transactions' && (
        <Card className="border-heritage-brown/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-heritage-brown">
              <Icon name="History" size={24} className="text-blue-600" />
              История транзакций
            </CardTitle>
            <CardDescription>
              Все операции с лизкоинами пользователей
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="History" size={48} className="mx-auto mb-4 opacity-30" />
                <p>Пока нет транзакций</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-heritage-brown/10 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Icon 
                          name={transaction.amount > 0 ? 'TrendingUp' : 'TrendingDown'} 
                          size={20} 
                          className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'} 
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-heritage-brown">{transaction.username}</h3>
                        <p className="text-sm text-muted-foreground">{transaction.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(transaction.timestamp)} • Баланс после: {transaction.balanceAfter} ЛК
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-1 font-bold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} ЛК
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'admins' && permissions.canManageAdmins && (
        <Card className="border-heritage-brown/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-heritage-brown">
              <Icon name="Shield" size={24} className="text-red-600" />
              Управление администраторами
            </CardTitle>
            <CardDescription>
              Назначение рангов и управление правами доступа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-heritage-brown">Уровни доступа:</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 border-2 border-red-200 rounded-lg bg-gradient-to-r from-red-50 to-orange-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Crown" size={20} className="text-red-600" />
                    <h4 className="font-bold text-red-900">Главный Администратор</h4>
                  </div>
                  <p className="text-sm text-red-700">✓ Все права • ✓ Управление админами • ✓ Управление пользователями</p>
                </div>
                
                <div className="p-3 border-2 border-purple-200 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="ShieldCheck" size={20} className="text-purple-600" />
                    <h4 className="font-bold text-purple-900">Старший Администратор</h4>
                  </div>
                  <p className="text-sm text-purple-700">✓ Управление пользователями • ✓ Награды • ✓ Новости • ✓ Статистика</p>
                </div>
                
                <div className="p-3 border-2 border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Shield" size={20} className="text-blue-600" />
                    <h4 className="font-bold text-blue-900">Средний Администратор</h4>
                  </div>
                  <p className="text-sm text-blue-700">✓ Награды • ✓ Новости • ✓ Статистика • ✓ Редактирование контента</p>
                </div>
                
                <div className="p-3 border-2 border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="ShieldAlert" size={20} className="text-green-600" />
                    <h4 className="font-bold text-green-900">Младший Администратор</h4>
                  </div>
                  <p className="text-sm text-green-700">✓ Новости • ✓ Статистика • ✓ Базовый доступ</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h3 className="font-semibold text-heritage-brown">Текущие администраторы ({allAdmins.length}):</h3>
              {allAdmins.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Shield" size={48} className="mx-auto mb-4 opacity-30" />
                  <p>Нет администраторов</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allAdmins.map((admin) => (
                    <div
                      key={admin.username}
                      className={`p-4 border-2 rounded-lg bg-gradient-to-r ${getRankColor(admin.rank)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Icon name="User" size={24} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-lg">{admin.username}</h4>
                            <p className="text-white/90 text-sm">{getRankLabel(admin.rank)}</p>
                          </div>
                        </div>
                        
                        {admin.rank !== 'super_admin' && (
                          <div className="flex items-center gap-2">
                            <Select
                              value={admin.rank || ''}
                              onValueChange={(value) => handleSetAdminRank(admin.username, value as AdminRank)}
                            >
                              <SelectTrigger className="w-48 bg-white">
                                <SelectValue placeholder="Выберите ранг" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="senior_admin">Старший Администратор</SelectItem>
                                <SelectItem value="middle_admin">Средний Администратор</SelectItem>
                                <SelectItem value="junior_admin">Младший Администратор</SelectItem>
                                <SelectItem value="null">Снять ранг</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        {admin.rank === 'super_admin' && (
                          <Badge className="bg-white/20 text-white border-white/40">
                            Не изменяется
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h3 className="font-semibold text-heritage-brown">Назначить нового администратора:</h3>
              <div className="flex gap-3">
                <select
                  className="flex-1 p-2 border border-heritage-brown/20 rounded-md bg-white"
                  id="new-admin-select"
                  onChange={(e) => {
                    const username = e.target.value
                    const rankSelect = document.getElementById('new-admin-rank') as HTMLSelectElement
                    if (username && rankSelect && rankSelect.value) {
                      handleSetAdminRank(username, rankSelect.value as AdminRank)
                      e.target.value = ''
                      rankSelect.value = ''
                    }
                  }}
                >
                  <option value="">-- Выберите пользователя --</option>
                  {users
                    .filter(u => !allAdmins.find(a => a.username === u.username))
                    .map(user => (
                      <option key={user.id} value={user.username}>
                        {user.username}
                      </option>
                    ))}
                </select>
                
                <select
                  id="new-admin-rank"
                  className="w-56 p-2 border border-heritage-brown/20 rounded-md bg-white"
                >
                  <option value="">-- Выберите ранг --</option>
                  <option value="senior_admin">Старший Администратор</option>
                  <option value="middle_admin">Средний Администратор</option>
                  <option value="junior_admin">Младший Администратор</option>
                </select>
              </div>
              <p className="text-sm text-muted-foreground">
                Главные администраторы (Админ, Володя) имеют постоянные полные права
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}