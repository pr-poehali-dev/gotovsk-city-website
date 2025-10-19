import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Icon from '@/components/ui/icon'
import { register, login } from '@/utils/auth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (mode === 'register') {
      if (!username || !password) {
        setError('Заполните имя и пароль')
        return
      }
      
      if (password.length < 6) {
        setError('Пароль должен быть минимум 6 символов')
        return
      }

      const result = register(username, email || `user_${Date.now()}@gotovsk.local`, password)
      if (result) {
        setSuccess('Регистрация успешна! +50 стартовых лизкоинов')
        setTimeout(() => {
          onClose()
          window.location.reload()
        }, 1500)
      } else {
        setError('Ошибка регистрации')
      }
    } else {
      if (!username || !password) {
        setError('Заполните имя и пароль')
        return
      }

      const result = login(username, password)
      if (result) {
        setSuccess('Вход выполнен успешно!')
        setTimeout(() => {
          onClose()
          window.location.reload()
        }, 1000)
      } else {
        setError('Неверное имя или пароль')
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-heritage-brown">
            {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login' 
              ? 'Войдите чтобы сохранить прогресс' 
              : 'Создайте аккаунт и получите 50 стартовых лизкоинов'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{mode === 'register' ? 'Имя пользователя' : 'Имя пользователя или Email'}</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={mode === 'register' ? 'Иван Петров' : 'Введите имя или email'}
            />
          </div>

          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="email">Email (необязательно)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ivan@example.com"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
            />
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <Icon name="AlertCircle" size={16} className="text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <Icon name="CheckCircle" size={16} className="text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full bg-heritage-brown hover:bg-heritage-brown/90">
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login')
                setError('')
                setSuccess('')
              }}
              className="text-heritage-brown hover:underline"
            >
              {mode === 'login' 
                ? 'Нет аккаунта? Зарегистрируйтесь' 
                : 'Уже есть аккаунт? Войдите'
              }
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}