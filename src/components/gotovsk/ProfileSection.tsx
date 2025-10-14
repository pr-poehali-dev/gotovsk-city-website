import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Icon from '@/components/ui/icon'
import { getCurrentUser, logout } from '@/utils/auth'

export function ProfileSection() {
  const user = getCurrentUser()

  if (!user) {
    return (
      <Card className="border-heritage-brown/20">
        <CardContent className="p-8 text-center">
          <Icon name="UserX" className="mx-auto text-muted-foreground mb-4" size={48} />
          <p className="text-muted-foreground">Войдите в аккаунт чтобы увидеть профиль</p>
        </CardContent>
      </Card>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-heritage-beige/30 p-4 rounded-lg text-center">
              <Icon name="Coins" className="mx-auto text-yellow-600 mb-2" size={32} />
              <div className="text-3xl font-bold text-heritage-brown">{user.lizcoins}</div>
              <div className="text-sm text-muted-foreground">Лизкоинов</div>
            </div>

            <div className="bg-heritage-beige/30 p-4 rounded-lg text-center">
              <Icon name="Calendar" className="mx-auto text-heritage-brown mb-2" size={32} />
              <div className="text-3xl font-bold text-heritage-brown">{memberDays}</div>
              <div className="text-sm text-muted-foreground">Дней с нами</div>
            </div>
          </div>

          <Separator />

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
