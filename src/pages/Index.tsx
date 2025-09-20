import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Icon from '@/components/ui/icon'

const sections = [
  { id: 'main', label: 'Главная' },
  { id: 'districts', label: 'Районы' },
  { id: 'transport', label: 'Транспорт' },
  { id: 'news', label: 'Новости' },
  { id: 'attractions', label: 'Достопримечательности' },
  { id: 'history', label: 'История' },
  { id: 'mayor', label: 'Мэр города' },
  { id: 'map', label: 'Карта' }
]

const districts = [
  {
    name: 'Микрорайон 1',
    description: 'Элитный район с высотными домами, спортивными комплексами и парковыми зонами',
    type: 'Элитный'
  },
  {
    name: 'Микрорайон 2', 
    description: 'Студенческий район с университетами и колледжами',
    type: 'Студенческий'
  },
  {
    name: 'Микрорайон 3',
    description: 'Семейный район с детскими садами и школами',
    type: 'Семейный'
  },
  {
    name: 'Микрорайон 4',
    description: 'Промышленный район с современными предприятиями',
    type: 'Промышленный'
  },
  {
    name: 'Микрорайон 5',
    description: 'Спальный район с развитой социальной инфраструктурой',
    type: 'Спальный'
  },
  {
    name: 'Микрорайон 6',
    description: 'Экологический район с парковыми зонами',
    type: 'Экологический'
  },
  {
    name: 'Микрорайон 7',
    description: 'Транспортный узел с железнодорожной станцией',
    type: 'Транспортный'
  }
]

const attractions = [
  {
    name: 'Парк культуры Готов',
    description: 'Крупнейший городской парк площадью 150 гектаров с центральным готовским кровавым факелом',
    features: ['Детская зона', 'Спортивная зона', 'Культурная зона', 'Экологическая зона']
  },
  {
    name: 'Готовское озеро',
    description: 'Природный водоем площадью 2 квадратных километра с благоустроенными пляжами',
    features: ['Пляжи', 'Прогулочные дорожки', 'Места отдыха']
  },
  {
    name: 'Готовская набережная',
    description: 'Благоустроенная территория протяженностью 3 километра',
    features: ['Кафе и рестораны', 'Смотровые площадки', 'Детские площадки']
  }
]

const streets = [
  {
    name: 'Готовский проспект',
    length: '8 км',
    description: 'Главная артерия города от вокзала до парка культуры'
  },
  {
    name: 'Главная Готовская улица',
    length: '6 км', 
    description: 'Старинная улица с историческими зданиями и музеями'
  },
  {
    name: 'Субкунтрульная улица',
    length: '4 км',
    description: 'Современная магистраль с бизнес-центрами'
  }
]

function Index() {
  const [activeSection, setActiveSection] = useState('main')

  const renderContent = () => {
    switch (activeSection) {
      case 'main':
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

      case 'districts':
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

      case 'attractions':
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

      case 'transport':
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

      case 'history':
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

      case 'news':
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

      case 'map':
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

      case 'mayor':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-heritage-brown mb-4">Мэр города</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Руководство города Готовск
              </p>
            </div>

            <Card className="border-heritage-brown/20 bg-gradient-to-br from-heritage-beige to-heritage-cream">
              <CardContent className="p-8">
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
                      <h3 className="text-3xl font-bold text-heritage-brown mb-2">Алексей Викторович Готовский</h3>
                      <p className="text-xl text-heritage-dark mb-4">Мэр города Готовск</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        <Badge variant="secondary" className="bg-heritage-golden-rod/20 text-heritage-brown">
                          В должности с 2020 года
                        </Badge>
                        <Badge variant="secondary" className="bg-heritage-golden-rod/20 text-heritage-brown">
                          Экономист
                        </Badge>
                        <Badge variant="secondary" className="bg-heritage-golden-rod/20 text-heritage-brown">
                          Почетный житель
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-heritage-brown mb-2">Образование</h4>
                        <p className="text-heritage-dark">
                          Московский государственный университет экономики, статистики и информатики. 
                          Кандидат экономических наук.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-heritage-brown mb-2">Достижения</h4>
                        <ul className="space-y-2 text-heritage-dark">
                          <li className="flex items-start gap-2">
                            <Icon name="CheckCircle" className="text-heritage-golden-rod mt-1 shrink-0" size={16} />
                            <span>Модернизация транспортной инфраструктуры города</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Icon name="CheckCircle" className="text-heritage-golden-rod mt-1 shrink-0" size={16} />
                            <span>Создание 7 современных микрорайонов</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Icon name="CheckCircle" className="text-heritage-golden-rod mt-1 shrink-0" size={16} />
                            <span>Развитие экологических зон и парковых территорий</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Icon name="CheckCircle" className="text-heritage-golden-rod mt-1 shrink-0" size={16} />
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

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-heritage-brown/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-heritage-brown to-heritage-dark rounded-lg flex items-center justify-center">
                <Icon name="Castle" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-heritage-brown">Готовск</h1>
                <p className="text-sm text-muted-foreground">Официальный портал города</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 shrink-0">
            <Card className="border-heritage-brown/20 sticky top-24">
              <CardHeader>
                <CardTitle className="text-heritage-brown">Навигация</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeSection === section.id 
                          ? 'bg-heritage-brown hover:bg-heritage-brown/90 text-white' 
                          : 'text-heritage-brown hover:bg-heritage-beige'
                      }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      {section.label}
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-heritage-brown text-heritage-cream mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Город Готовск</h3>
              <p className="text-heritage-cream/80 leading-relaxed">
                Современный городской центр с богатой историей и развитой инфраструктурой
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Контакты</h3>
              <div className="space-y-2 text-heritage-cream/80">
                <p>Администрация города</p>
                <p>Готовский проспект, 1</p>
                <p>+7 (XXX) XXX-XX-XX</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Социальные сети</h3>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="text-heritage-cream hover:bg-heritage-cream/20">
                  <Icon name="Phone" size={20} />
                </Button>
                <Button variant="ghost" size="sm" className="text-heritage-cream hover:bg-heritage-cream/20">
                  <Icon name="Mail" size={20} />
                </Button>
                <Button variant="ghost" size="sm" className="text-heritage-cream hover:bg-heritage-cream/20">
                  <Icon name="MapPin" size={20} />
                </Button>
              </div>
            </div>
          </div>
          
          <Separator className="my-8 bg-heritage-cream/20" />
          
          <div className="text-center text-heritage-cream/60">
            <p>&copy; 2024 Город Готовск. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index