import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import { streets } from './data'

export function TransportSection() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-heritage-brown mb-4">Транспорт</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Развитая транспортная сеть и инфраструктура
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-semibold text-heritage-brown mb-4">Главные улицы</h3>
          <div className="space-y-4">
            {streets.map((street, index) => (
              <Card key={index} className="border-heritage-brown/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-heritage-brown">{street.name}</h4>
                    <Badge variant="outline">{street.length}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{street.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-heritage-brown mb-4">Виды транспорта</h3>
          <div className="grid gap-4">
            <Card className="border-heritage-brown/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Bus" className="text-heritage-brown" size={20} />
                  <h4 className="font-semibold">Общественный транспорт</h4>
                </div>
                <p className="text-muted-foreground text-sm">Автобусы, троллейбусы и маршрутные такси</p>
              </CardContent>
            </Card>

            <Card className="border-heritage-brown/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Bike" className="text-heritage-brown" size={20} />
                  <h4 className="font-semibold">Велосипедные дорожки</h4>
                </div>
                <p className="text-muted-foreground text-sm">Более 30 километров велосипедной инфраструктуры</p>
              </CardContent>
            </Card>

            <Card className="border-heritage-brown/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Car" className="text-heritage-brown" size={20} />
                  <h4 className="font-semibold">Автомагистрали</h4>
                </div>
                <p className="text-muted-foreground text-sm">Связь с соседними населенными пунктами</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}