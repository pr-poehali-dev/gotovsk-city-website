import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'

export function MainSection() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative chrome-card rounded-xl p-8 md:p-12 text-center chrome-reflection">
        <div className="absolute inset-0 opacity-20 liquid-animation" style={{background: "url('https://cdn.poehali.dev/files/711c0cf6-000b-44c5-8eb5-a5b72c7da450.jpg')", backgroundSize: "cover", filter: "blur(1px) brightness(0.3)"}}></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold chrome-text mb-4">
            Готовск
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-6 max-w-3xl mx-auto">
            Современный городской центр на живописных холмах и равнинах
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-lg px-6 py-2 chrome-button text-white">
              50+ км² площади
            </Badge>
            <Badge variant="secondary" className="text-lg px-6 py-2 chrome-button text-white">
              7 микрорайонов
            </Badge>
            <Badge variant="secondary" className="text-lg px-6 py-2 chrome-button text-white">
              Развитая инфраструктура
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="chrome-card hover:shadow-lg transition-all duration-300 chrome-reflection">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Icon name="MapPin" className="text-blue-400" size={24} />
              <CardTitle className="chrome-text">Расположение</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">
              Живописные холмы и равнины с продуманной планировкой
            </p>
          </CardContent>
        </Card>

        <Card className="chrome-card hover:shadow-lg transition-all duration-300 chrome-reflection">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Icon name="Building2" className="text-purple-400" size={24} />
              <CardTitle className="chrome-text">Архитектура</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">
              Гармоничное сочетание современности и исторического наследия
            </p>
          </CardContent>
        </Card>

        <Card className="chrome-card hover:shadow-lg transition-all duration-300 chrome-reflection">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Icon name="Trees" className="text-green-400" size={24} />
              <CardTitle className="chrome-text">Экология</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">
              Парковые зоны, озеро и развитая велосипедная инфраструктура
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}