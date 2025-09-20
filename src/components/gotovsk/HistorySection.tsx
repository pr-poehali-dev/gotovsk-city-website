import { Card, CardContent } from '@/components/ui/card'

export function HistorySection() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-heritage-brown mb-4">История Готовска</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Многовековое наследие и традиции города
        </p>
      </div>

      <Card className="border-heritage-brown/20 bg-gradient-to-br from-heritage-beige to-heritage-cream">
        <CardContent className="p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-heritage-dark leading-relaxed mb-6">
              Город Готовск берет свое начало в глубокой древности, когда на живописных холмах 
              поселились первые готские племена. Уникальное географическое положение сделало 
              город важным торговым и культурным центром региона.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-white/50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-heritage-brown mb-3">Архитектурное наследие</h3>
                <p className="text-heritage-dark">
                  Исторический центр сохранил уникальную архитектуру прошлых веков, 
                  гармонично сочетающуюся с современными зданиями.
                </p>
              </div>
              
              <div className="bg-white/50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-heritage-brown mb-3">Культурные традиции</h3>
                <p className="text-heritage-dark">
                  Готовская культура сформировалась под влиянием различных народов, 
                  создав уникальный культурный код города.
                </p>
              </div>
            </div>
            
            <p className="text-heritage-dark leading-relaxed">
              Сегодня Готовск — это современный город, который бережно хранит свое историческое 
              наследие, развиваясь в ногу со временем и предоставляя жителям все блага 
              цивилизации в окружении природной красоты.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}