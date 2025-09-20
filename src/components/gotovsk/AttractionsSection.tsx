import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { attractions } from './data'

export function AttractionsSection() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-heritage-brown mb-4">Достопримечательности</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Природные и культурные объекты города Готовск
        </p>
      </div>
      <div className="space-y-6">
        {attractions.map((attraction, index) => (
          <Card key={index} className="border-heritage-brown/20">
            <CardHeader>
              <CardTitle className="text-2xl text-heritage-brown">{attraction.name}</CardTitle>
              <CardDescription className="text-lg">{attraction.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {attraction.features.map((feature, featureIndex) => (
                  <Badge key={featureIndex} variant="secondary" className="bg-heritage-beige text-heritage-brown">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}