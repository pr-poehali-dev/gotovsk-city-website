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
import { InventorySection } from '@/components/gotovsk/InventorySection'
import { ProfileSection } from '@/components/gotovsk/ProfileSection'
import { LeaderboardSection } from '@/components/gotovsk/LeaderboardSection'
import { AdminPanel } from '@/components/gotovsk/AdminPanel'
import GamesSection from '@/components/gotovsk/webapp/GamesSection'
import AchievementsSection from '@/components/gotovsk/webapp/AchievementsSection'
import { getCurrentUser } from '@/utils/auth'
import { AuthModal } from '@/components/gotovsk/AuthModal'

function Index() {
  const [activeSection, setActiveSection] = useState('main')
  const [earnedMessage, setEarnedMessage] = useState('')
  const [showWelcomeAuth, setShowWelcomeAuth] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
    
    if (!user && !hasSeenWelcome) {
      setShowWelcomeAuth(true)
    }
    
    if (user && activeSection !== 'main' && activeSection !== 'gifts' && activeSection !== 'leaderboard' && activeSection !== 'admin') {
      const earned = trackSectionVisit(activeSection)
      if (earned) {
        setEarnedMessage('Вы получили 5 лизкоинов за посещение раздела!')
        setTimeout(() => setEarnedMessage(''), 3000)
      }
    }
  }, [activeSection])

  const handleCloseWelcomeAuth = () => {
    setShowWelcomeAuth(false)
    localStorage.setItem('hasSeenWelcome', 'true')
  }

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
      case 'games':
        return <GamesSection />
      case 'achievements':
        return <AchievementsSection />
      case 'gifts':
        return <GiftsSection />
      case 'inventory':
        return <InventorySection />
      case 'leaderboard':
        return <LeaderboardSection />
      case 'admin':
        return <AdminPanel />
      case 'map':
        return <MapSection />
      case 'profile':
        return <ProfileSection />
      default:
        return <MainSection />
    }
  }

  return (
    <>
      <Layout activeSection={activeSection} onSectionChange={setActiveSection}>
        {renderContent()}
      </Layout>
      <AuthModal isOpen={showWelcomeAuth} onClose={handleCloseWelcomeAuth} />
    </>
  )
}

export default Index