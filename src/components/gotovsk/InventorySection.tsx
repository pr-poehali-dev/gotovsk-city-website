import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import Icon from '@/components/ui/icon'
import { getCurrentUser, updateUserLizcoins } from '@/utils/auth'
import { getInventory, removeFromInventory, addToInventory, type InventoryItem } from '@/utils/inventory'
import { getRandomItem } from '@/utils/boxItems'
import { toast } from 'sonner'

export function InventorySection() {
  const [user, setUser] = useState(getCurrentUser())
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [showRewardDialog, setShowRewardDialog] = useState(false)
  const [rewardItem, setRewardItem] = useState<any>(null)
  const [isOpening, setIsOpening] = useState(false)

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getCurrentUser())
      setInventory(getInventory())
    }
    
    const handleInventoryUpdate = () => {
      setInventory(getInventory())
    }
    
    setInventory(getInventory())
    
    window.addEventListener('auth-change', handleAuthChange)
    window.addEventListener('inventory-updated', handleInventoryUpdate)
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange)
      window.removeEventListener('inventory-updated', handleInventoryUpdate)
    }
  }, [])

  if (!user) {
    return (
      <Card className="border-heritage-brown/20">
        <CardContent className="p-8 text-center space-y-4">
          <Icon name="Package" className="mx-auto text-muted-foreground mb-4" size={48} />
          <p className="text-muted-foreground">Войдите в аккаунт, чтобы увидеть свой инвентарь</p>
        </CardContent>
      </Card>
    )
  }

  const groupedItems = inventory.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = []
    }
    acc[item.type].push(item)
    return acc
  }, {} as Record<string, InventoryItem[]>)

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'gift': return 'Подарки'
      case 'box': return 'Ящики'
      case 'item': return 'Предметы'
      default: return 'Другое'
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'gift': return 'bg-yellow-500'
      case 'box': return 'bg-purple-500'
      case 'item': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
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

  const handleOpenBox = async (box: InventoryItem) => {
    if (!user) return
    
    setIsOpening(true)
    
    setTimeout(() => {
      const item = getRandomItem(box.id)
      
      if (item.id === 'coin-pouch') {
        const currentLizcoins = user.lizcoins || 0
        updateUserLizcoins(currentLizcoins + 50)
      } else if (item.id === 'coin-bag') {
        const currentLizcoins = user.lizcoins || 0
        updateUserLizcoins(currentLizcoins + 100)
      } else if (item.id === 'coin-chest') {
        const currentLizcoins = user.lizcoins || 0
        updateUserLizcoins(currentLizcoins + 250)
      } else if (item.id === 'coin-vault') {
        const currentLizcoins = user.lizcoins || 0
        updateUserLizcoins(currentLizcoins + 500)
      }
      
      addToInventory({
        id: item.id,
        type: 'item',
        name: item.name,
        description: item.description,
        icon: item.icon,
        metadata: { rarity: item.rarity }
      })
      
      removeFromInventory(box.id, 'box')
      
      setRewardItem(item)
      setShowRewardDialog(true)
      setIsOpening(false)
      
      toast.success(`Вы получили: ${item.name}!`)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heritage-brown mb-2">Инвентарь</h1>
        <p className="text-muted-foreground">Ваши купленные предметы и подарки</p>
      </div>

      {inventory.length === 0 ? (
        <Alert className="border-blue-200 bg-blue-50">
          <Icon name="Info" size={16} className="text-blue-600" />
          <AlertDescription className="text-blue-800">
            Ваш инвентарь пуст. Купите что-нибудь в магазине подарков!
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([type, items]) => (
            <div key={type}>
              <h2 className="text-xl font-semibold text-heritage-brown mb-4 flex items-center gap-2">
                <Icon name="Package" size={20} />
                {getTypeLabel(type)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <Card key={`${item.type}-${item.id}`} className="border-heritage-brown/20 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 ${item.type === 'box' && item.metadata?.rarity ? `bg-gradient-to-br ${getRarityColor(item.metadata.rarity)}` : 'bg-gradient-to-br from-heritage-brown to-heritage-dark'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Icon name={item.icon as any} className="text-white" size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-heritage-brown truncate">{item.name}</h3>
                              {item.count > 1 && (
                                <Badge variant="secondary" className="flex-shrink-0">
                                  x{item.count}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={`${getTypeBadgeColor(item.type)} text-white text-xs`}>
                                {getTypeLabel(item.type)}
                              </Badge>
                              {item.metadata?.rarity && (
                                <Badge className={`bg-gradient-to-r ${getRarityColor(item.metadata.rarity)} text-white text-xs border-0`}>
                                  {getRarityLabel(item.metadata.rarity)}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {new Date(item.acquiredAt).toLocaleDateString('ru-RU')}
                              </span>
                            </div>
                          </div>
                        </div>
                        {item.type === 'box' && (
                          <Button 
                            onClick={() => handleOpenBox(item)}
                            disabled={isOpening}
                            className={`w-full bg-gradient-to-r ${item.metadata?.rarity ? getRarityColor(item.metadata.rarity) : 'from-purple-500 to-purple-700'} hover:opacity-90 text-white`}
                          >
                            {isOpening ? 'Открывается...' : 'Открыть ящик'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">🎉 Поздравляем!</DialogTitle>
            <DialogDescription className="text-center">
              Вы получили награду из ящика
            </DialogDescription>
          </DialogHeader>
          {rewardItem && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-heritage-beige to-heritage-brown/10 rounded-lg">
                <div className={`w-24 h-24 bg-gradient-to-br ${getRarityColor(rewardItem.rarity)} rounded-full flex items-center justify-center shadow-lg animate-bounce-in`}>
                  <Icon name={rewardItem.icon as any} className="text-white" size={48} />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-heritage-brown mb-2">{rewardItem.name}</h3>
                  <Badge className={`bg-gradient-to-r ${getRarityColor(rewardItem.rarity)} text-white border-0 mb-2`}>
                    {getRarityLabel(rewardItem.rarity)}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{rewardItem.description}</p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setShowRewardDialog(false)
                  setRewardItem(null)
                }}
                className="w-full bg-heritage-brown hover:bg-heritage-brown/90"
              >
                Забрать награду
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}