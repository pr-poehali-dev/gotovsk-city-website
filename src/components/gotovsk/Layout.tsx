import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Icon from '@/components/ui/icon'
import { sections } from './data'

interface LayoutProps {
  children: React.ReactNode
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Layout({ children, activeSection, onSectionChange }: LayoutProps) {
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
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 shrink-0">
            <Card className="border-heritage-brown/20 sticky top-24">
              <CardHeader>
                <CardTitle className="text-heritage-brown">Навигация</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeSection === section.id 
                          ? 'bg-heritage-brown hover:bg-heritage-brown/90 text-white' 
                          : 'text-heritage-brown hover:bg-heritage-beige'
                      }`}
                      onClick={() => onSectionChange(section.id)}
                    >
                      {section.label}
                    </Button>
                  ))}
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
    </div>
  )
}