import { useState, useEffect } from 'react'
import { Layout } from '@/components/gotovsk/Layout'
import { trackSectionVisit } from '@/utils/lizcoins'
import { MainSection } from '@/components/gotovsk/MainSection'
import { DistrictsSection } from '@/components/gotovsk/DistrictsSection'
import { AttractionsSection } from '@/components/gotovsk/AttractionsSection'
import { TransportSection } from '@/components/gotovsk/TransportSection'
import { HistorySection } from '@/components/gotovsk/HistorySection'
import { NewsSection } from '@/components/gotovsk/NewsSection'
import { MapSection } from '@/components/gotovsk/MapSection'
import { GiftsSection } from '@/components/gotovsk/GiftsSection'
import { ProfileSection } from '@/components/gotovsk/ProfileSection'
import { LeaderboardSection } from '@/components/gotovsk/LeaderboardSection'
import { getCurrentUser } from '@/utils/auth'

function Index() {
  const [activeSection, setActiveSection] = useState('main')
  const [earnedMessage, setEarnedMessage] = useState('')

  useEffect(() => {
    const user = getCurrentUser()
    if (user && activeSection !== 'main' && activeSection !== 'gifts' && activeSection !== 'leaderboard') {
      const earned = trackSectionVisit(activeSection)
      if (earned) {
        setEarnedMessage('Вы получили 5 лизкоинов за посещение раздела!')
        setTimeout(() => setEarnedMessage(''), 3000)
      }
    }
  }, [activeSection])

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
      case 'leaderboard':
        return <LeaderboardSection />
      case 'map':
        return <MapSection />
      case 'profile':
        return <ProfileSection />
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