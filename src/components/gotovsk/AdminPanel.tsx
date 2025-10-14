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
import { gifts } from './data'

interface User {
  id: string
  username: string
  lizcoins: number
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

export function AdminPanel() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [lizcoinsAmount, setLizcoinsAmount] = useState('')
  const [message, setMessage] = useState('')
  const [customGifts, setCustomGifts] = useState<Gift[]>([])
  
  const [newGiftName, setNewGiftName] = useState('')
  const [newGiftPrice, setNewGiftPrice] = useState('')
  const [newGiftDescription, setNewGiftDescription] = useState('')
  const [newGiftIcon, setNewGiftIcon] = useState('Gift')

  useEffect(() => {
    loadUsers()
    loadCustomGifts()
  }, [])

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    setUsers(allUsers)
  }

  const loadCustomGifts = () => {
    const saved = localStorage.getItem('customGifts')
    setCustomGifts(saved ? JSON.parse(saved) : [])
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
      
      loadUsers()
      setMessage(`Успешно ${amount > 0 ? 'начислено' : 'списано'} ${Math.abs(amount)} ЛК пользователю ${allUsers[userIndex].username}`)
      setLizcoinsAmount('')
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

  if (!currentUser || currentUser.username !== 'Админ') {
    return (
      <div className="space-y-6">
        <Alert className="border-red-200 bg-red-50">
          <Icon name="ShieldAlert" size={16} className="text-red-600" />
          <AlertDescription className="text-red-800">
            Доступ запрещен. Эта страница доступна только администратору.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const iconOptions = ['Gift', 'Award', 'Trophy', 'Star', 'Crown', 'Sparkles', 'Gem', 'Heart', 'Ticket', 'Medal']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heritage-brown mb-2">Панель администратора</h1>
        <p className="text-muted-foreground">Управление пользователями и наградами портала Готовска</p>
      </div>

      {message && (
        <Alert className="border-heritage-brown/20 bg-heritage-beige/50">
          <Icon name="Info" size={16} className="text-heritage-brown" />
          <AlertDescription className="text-heritage-brown">{message}</AlertDescription>
        </Alert>
      )}

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
          </CardContent>
        </Card>

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
    </div>
  )
}
