import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Icon from '@/components/ui/icon'

export function MayorSection() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold chrome-text mb-4">Мэр города</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Руководство города Готовск
        </p>
      </div>

      <Card className="chrome-card relative overflow-hidden chrome-reflection">
        <CardContent className="p-8 relative z-10">
          {/* Очки на заднем фоне */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 text-6xl">👓</div>
            <div className="absolute top-16 right-12 text-4xl">👓</div>
            <div className="absolute bottom-8 left-16 text-5xl">👓</div>
            <div className="absolute bottom-12 right-8 text-3xl">👓</div>
            <div className="absolute top-1/2 left-1/3 text-7xl">👓</div>
            <div className="absolute top-1/4 right-1/4 text-4xl">👓</div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <div className="relative">
                <img 
                  src="https://cdn.poehali.dev/files/a74b978f-5b72-4749-a56a-d665fb22e0fb.jpg" 
                  alt="Мэр города Готовск"
                  className="w-full aspect-square object-cover rounded-xl shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-heritage-brown/20 to-transparent rounded-xl"></div>
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">Алексей Викторович Готовский</h3>
                <p className="text-xl text-blue-100 mb-4">Мэр города Готовск</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    В должности с 2020 года
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    Экономист
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    Почетный житель
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Образование</h4>
                  <p className="text-blue-100">
                    Московский государственный университет экономики, статистики и информатики. 
                    Кандидат экономических наук.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Достижения</h4>
                  <ul className="space-y-2 text-blue-100">
                    <li className="flex items-start gap-2">
                      <Icon name="CheckCircle" className="text-yellow-300 mt-1 shrink-0" size={16} />
                      <span>Модернизация транспортной инфраструктуры города</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="CheckCircle" className="text-yellow-300 mt-1 shrink-0" size={16} />
                      <span>Создание 7 современных микрорайонов</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="CheckCircle" className="text-yellow-300 mt-1 shrink-0" size={16} />
                      <span>Развитие экологических зон и парковых территорий</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="CheckCircle" className="text-yellow-300 mt-1 shrink-0" size={16} />
                      <span>Строительство велосипедной инфраструктуры</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-heritage-brown/20">
          <CardHeader>
            <CardTitle className="text-heritage-brown flex items-center gap-3">
              <Icon name="Quote" size={24} />
              Обращение к жителям
            </CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="text-heritage-dark italic leading-relaxed">
              "Готовск — это не просто место на карте, это наш общий дом. Каждый проект, 
              каждое решение принимается с мыслью о том, как сделать жизнь наших граждан 
              комфортнее, безопаснее и качественнее. Вместе мы строим будущее нашего города."
            </blockquote>
            <footer className="mt-4 text-heritage-brown font-semibold">
              — А.В. Готовский
            </footer>
          </CardContent>
        </Card>

        <Card className="border-heritage-brown/20">
          <CardHeader>
            <CardTitle className="text-heritage-brown flex items-center gap-3">
              <Icon name="Calendar" size={24} />
              Приёмные часы
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Понедельник</span>
                <span className="text-muted-foreground">14:00 - 18:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Среда</span>
                <span className="text-muted-foreground">10:00 - 14:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Пятница</span>
                <span className="text-muted-foreground">15:00 - 17:00</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Icon name="MapPin" size={16} />
                Готовский проспект, 1, каб. 301
              </p>
              <p className="flex items-center gap-2">
                <Icon name="Phone" size={16} />
                +7 (XXX) XXX-XX-XX доб. 101
              </p>
              <p className="flex items-center gap-2">
                <Icon name="Mail" size={16} />
                mayor@gotovsk.gov.ru
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}