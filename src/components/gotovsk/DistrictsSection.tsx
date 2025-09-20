import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { districts } from './data'

export function DistrictsSection() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-heritage-brown mb-4">Районы города</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Семь современных микрорайонов с развитой инфраструктурой
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {districts.map((district, index) => (
          <Card key={index} className="border-heritage-brown/20 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-heritage-brown">{district.name}</CardTitle>
                <Badge variant="outline" className="border-heritage-golden-rod text-heritage-golden-rod">
                  {district.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{district.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}