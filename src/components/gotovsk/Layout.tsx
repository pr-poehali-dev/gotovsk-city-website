import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Icon from '@/components/ui/icon'
import { sections } from './data'
import { getLizcoins } from '@/utils/lizcoins'
import { getCurrentUser } from '@/utils/auth'
import { AuthModal } from './AuthModal'
import AchievementNotification from './webapp/AchievementNotification'
import MusicPlayer from './webapp/MusicPlayer'

interface LayoutProps {
  children: React.ReactNode
  activeSection: string
  onSectionChange: (section: string) => void
  earnedMessage?: string
}

export function Layout({ children, activeSection, onSectionChange, earnedMessage }: LayoutProps) {
  const [lizcoins, setLizcoins] = useState(0)
  const [showEarned, setShowEarned] = useState('')
  const [user, setUser] = useState(getCurrentUser())
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLizcoins(currentUser?.lizcoins || getLizcoins())
    
    const handleLizcoinsEarned = (event: any) => {
      setLizcoins(event.detail.newTotal)
      setShowEarned(`+${event.detail.amount} ЛК за ${event.detail.reason}`)
      setTimeout(() => setShowEarned(''), 3000)
    }
    
    const handleAuthChange = () => {
      const updatedUser = getCurrentUser()
      setUser(updatedUser)
      setLizcoins(updatedUser?.lizcoins || 0)
    }
    
    window.addEventListener('lizcoins-earned', handleLizcoinsEarned)
    window.addEventListener('auth-change', handleAuthChange)
    return () => {
      window.removeEventListener('lizcoins-earned', handleLizcoinsEarned)
      window.removeEventListener('auth-change', handleAuthChange)
    }
  }, [])
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-heritage-brown/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-heritage-brown to-heritage-dark rounded-lg flex items-center justify-center">
                <Icon name="Castle" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-heritage-brown">Готовск</h1>
                <p className="text-sm text-muted-foreground">Официальный портал города</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                    <Icon name="Coins" className="text-yellow-600" size={20} />
                    <span className="font-bold text-heritage-brown">{lizcoins} ЛК</span>
                  </div>
                  <Button 
                    onClick={() => onSectionChange('profile')}
                    variant="ghost"
                    className="text-heritage-brown hover:bg-heritage-beige"
                  >
                    <Icon name="User" size={20} className="mr-2" />
                    {user.username}
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-heritage-brown hover:bg-heritage-brown/90"
                >
                  <Icon name="LogIn" size={20} className="mr-2" />
                  Войти
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showEarned && (
        <div className="container mx-auto px-4 pt-4">
          <Alert className="border-green-200 bg-green-50">
            <Icon name="Coins" size={16} className="text-green-600" />
            <AlertDescription className="text-green-800">{showEarned}</AlertDescription>
          </Alert>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 shrink-0">
            <Card className="border-heritage-brown/20 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <CardHeader className="sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                <CardTitle className="text-heritage-brown">Навигация</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <nav className="space-y-1">
                  {sections.map((section) => {
                    if (section.id === 'admin' && (!user || user.username !== 'Админ')) {
                      return null
                    }
                    return (
                      <Button
                        key={section.id}
                        variant={activeSection === section.id ? "default" : "ghost"}
                        className={`w-full justify-start transition-all group ${
                          activeSection === section.id 
                            ? 'bg-heritage-brown hover:bg-heritage-brown/90 text-white shadow-lg scale-105' 
                            : 'text-heritage-brown hover:bg-heritage-beige hover:scale-102'
                        }`}
                        onClick={() => onSectionChange(section.id)}
                      >
                        <Icon 
                          name={(section as any).icon || 'Circle'} 
                          size={18} 
                          className={`mr-2 transition-transform ${
                            activeSection === section.id ? '' : 'group-hover:scale-110'
                          }`}
                        />
                        {section.label}
                      </Button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-heritage-brown text-heritage-cream mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Город Готовск</h3>
              <p className="text-heritage-cream/80 leading-relaxed">
                Современный городской центр с богатой историей и развитой инфраструктурой
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Контакты</h3>
              <div className="space-y-2 text-heritage-cream/80">
                <p>Администрация города</p>
                <p>Готовский проспект, 1</p>
                <p>+7 (XXX) XXX-XX-XX</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Социальные сети</h3>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="text-heritage-cream hover:bg-heritage-cream/20">
                  <Icon name="Phone" size={20} />
                </Button>
                <Button variant="ghost" size="sm" className="text-heritage-cream hover:bg-heritage-cream/20">
                  <Icon name="Mail" size={20} />
                </Button>
                <Button variant="ghost" size="sm" className="text-heritage-cream hover:bg-heritage-cream/20">
                  <Icon name="MapPin" size={20} />
                </Button>
              </div>
            </div>
          </div>
          
          <Separator className="my-8 bg-heritage-cream/20" />
          
          <div className="text-center text-heritage-cream/60">
            <p>&copy; 2024 Город Готовск. Все права защищены.</p>
          </div>
        </div>
      </footer>
      
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <AchievementNotification />
      <MusicPlayer />
    </div>
  )
}