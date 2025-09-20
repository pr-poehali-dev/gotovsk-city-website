import { Card, CardContent } from '@/components/ui/card'
import Icon from '@/components/ui/icon'

export function MapSection() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-heritage-brown mb-4">Карта города</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Интерактивная карта Готовска с основными объектами
        </p>
      </div>
      
      <Card className="border-heritage-brown/20">
        <CardContent className="p-8">
          <div className="bg-gradient-to-br from-heritage-beige to-heritage-cream rounded-lg p-12 text-center min-h-[400px] flex items-center justify-center">
            <div>
              <Icon name="Map" className="text-heritage-brown mx-auto mb-4" size={64} />
              <h3 className="text-2xl font-semibold text-heritage-brown mb-4">Интерактивная карта</h3>
              <p className="text-heritage-dark max-w-md mx-auto">
                Здесь будет размещена интерактивная карта города Готовск 
                с отмеченными достопримечательностями, транспортными узлами и районами.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}