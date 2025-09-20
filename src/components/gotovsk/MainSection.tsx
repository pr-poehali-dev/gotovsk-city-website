import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'

export function MainSection() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-heritage-beige to-heritage-cream rounded-xl p-8 md:p-12 text-center">
        <div className="absolute inset-0 opacity-30 bg-repeat" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A574' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-heritage-brown mb-4">
            Готовск
          </h1>
          <p className="text-xl md:text-2xl text-heritage-dark mb-6 max-w-3xl mx-auto">
            Современный городской центр на живописных холмах и равнинах
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-lg px-6 py-2">
              50+ км² площади
            </Badge>
            <Badge variant="secondary" className="text-lg px-6 py-2">
              7 микрорайонов
            </Badge>
            <Badge variant="secondary" className="text-lg px-6 py-2">
              Развитая инфраструктура
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-heritage-brown/20 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Icon name="MapPin" className="text-heritage-brown" size={24} />
              <CardTitle className="text-heritage-brown">Расположение</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Живописные холмы и равнины с продуманной планировкой
            </p>
          </CardContent>
        </Card>

        <Card className="border-heritage-brown/20 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Icon name="Building2" className="text-heritage-brown" size={24} />
              <CardTitle className="text-heritage-brown">Архитектура</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Гармоничное сочетание современности и исторического наследия
            </p>
          </CardContent>
        </Card>

        <Card className="border-heritage-brown/20 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Icon name="Trees" className="text-heritage-brown" size={24} />
              <CardTitle className="text-heritage-brown">Экология</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Парковые зоны, озеро и развитая велосипедная инфраструктура
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}