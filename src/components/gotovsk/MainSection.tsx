import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'

export function MainSection() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 md:p-12 text-center border-2 border-blue-200 shadow-xl">
        <div className="absolute inset-0 opacity-10 liquid-animation" style={{background: "url('https://cdn.poehali.dev/files/711c0cf6-000b-44c5-8eb5-a5b72c7da450.jpg')", backgroundSize: "cover", borderRadius: '0.75rem'}}></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
            Готовск
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-6 max-w-3xl mx-auto">
            Современный городской центр на живописных холмах и равнинах
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="text-lg px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white">
              50+ км² площади
            </Badge>
            <Badge className="text-lg px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white">
              7 микрорайонов
            </Badge>
            <Badge className="text-lg px-6 py-2 bg-green-500 hover:bg-green-600 text-white">
              Развитая инфраструктура
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 fade-in-up bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center float-animation shadow-lg">
                <Icon name="MapPin" className="text-white" size={24} />
              </div>
              <CardTitle className="text-gray-900">Расположение</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Живописные холмы и равнины с продуманной планировкой
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 fade-in-up bg-white" style={{animationDelay: '0.1s'}}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center float-animation shadow-lg" style={{animationDelay: '0.5s'}}>
                <Icon name="Building2" className="text-white" size={24} />
              </div>
              <CardTitle className="text-gray-900">Архитектура</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Гармоничное сочетание современности и исторического наследия
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 fade-in-up bg-white" style={{animationDelay: '0.2s'}}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center float-animation shadow-lg" style={{animationDelay: '1s'}}>
                <Icon name="TreePine" fallback="Leaf" className="text-white" size={24} />
              </div>
              <CardTitle className="text-gray-900">Экология</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Парковые зоны, озеро и развитая велосипедная инфраструктура
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}