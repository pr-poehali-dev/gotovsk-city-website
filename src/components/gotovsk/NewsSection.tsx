import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function NewsSection() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-heritage-brown mb-4">Новости города</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Актуальные события и развитие Готовска
        </p>
      </div>
      
      <div className="space-y-4">
        <Card className="border-heritage-brown/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-heritage-brown">Открытие новой велодорожки</CardTitle>
              <Badge variant="secondary">Вчера</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              В микрорайоне 6 открыта новая велосипедная дорожка длиной 5 км, 
              соединяющая парковую зону с центром города.
            </p>
          </CardContent>
        </Card>

        <Card className="border-heritage-brown/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-heritage-brown">Реконструкция центрального фонтана</CardTitle>
              <Badge variant="secondary">3 дня назад</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Завершены работы по реконструкции центрального готовского кровавого фонтана 
              в парке культуры Готов.
            </p>
          </CardContent>
        </Card>

        <Card className="border-heritage-brown/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-heritage-brown">Фестиваль готовской культуры</CardTitle>
              <Badge variant="secondary">Неделя назад</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              На Главной Готовской улице прошел ежегодный фестиваль, 
              посвященный культурному наследию города.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}