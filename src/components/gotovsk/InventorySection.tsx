import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import { getCurrentUser } from '@/utils/auth'
import { getInventory, type InventoryItem } from '@/utils/inventory'

export function InventorySection() {
  const [user, setUser] = useState(getCurrentUser())
  const [inventory, setInventory] = useState<InventoryItem[]>([])

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
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-heritage-brown to-heritage-dark rounded-lg flex items-center justify-center flex-shrink-0">
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
                          <div className="flex items-center gap-2">
                            <Badge className={`${getTypeBadgeColor(item.type)} text-white text-xs`}>
                              {getTypeLabel(item.type)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.acquiredAt).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
