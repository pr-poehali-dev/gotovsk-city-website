import { useState } from 'react'
import { Layout } from '@/components/gotovsk/Layout'
import { MainSection } from '@/components/gotovsk/MainSection'
import { DistrictsSection } from '@/components/gotovsk/DistrictsSection'
import { AttractionsSection } from '@/components/gotovsk/AttractionsSection'
import { TransportSection } from '@/components/gotovsk/TransportSection'
import { HistorySection } from '@/components/gotovsk/HistorySection'
import { NewsSection } from '@/components/gotovsk/NewsSection'

import { MapSection } from '@/components/gotovsk/MapSection'
import { GiftsSection } from '@/components/gotovsk/GiftsSection'

function Index() {
  const [activeSection, setActiveSection] = useState('main')

  const renderContent = () => {
    switch (activeSection) {
      case 'main':
        return <MainSection />
      case 'districts':
        return <DistrictsSection />
      case 'attractions':
        return <AttractionsSection />
      case 'transport':
        return <TransportSection />
      case 'history':
        return <HistorySection />
      case 'news':
        return <NewsSection />

      case 'gifts':
        return <GiftsSection />
      case 'map':
        return <MapSection />
      default:
        return <MainSection />
    }
  }

  return (
    <Layout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </Layout>
  )
}

export default Index