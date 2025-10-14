import { getCurrentUser, updateUserLizcoins } from './auth'

export const addLizcoins = (amount: number, reason: string) => {
  const user = getCurrentUser()
  
  if (user) {
    const newLizcoins = user.lizcoins + amount
    updateUserLizcoins(newLizcoins)
    
    window.dispatchEvent(new CustomEvent('lizcoins-earned', { 
      detail: { amount, reason, newTotal: newLizcoins }
    }))
    
    return newLizcoins
  }
  
  return 0
}

export const trackSectionVisit = (sectionId: string, reward: number = 5) => {
  const user = getCurrentUser()
  if (!user) return false
  
  const visitKey = `section-visit-${sectionId}`
  const today = new Date().toDateString()
  const lastVisit = localStorage.getItem(visitKey)
  
  if (lastVisit !== today) {
    localStorage.setItem(visitKey, today)
    addLizcoins(reward, `Посещение раздела "${getSectionName(sectionId)}"`)
    return true
  }
  
  return false
}

const getSectionName = (sectionId: string): string => {
  const sectionNames: Record<string, string> = {
    'news': 'Новости',
    'attractions': 'Достопримечательности', 
    'districts': 'Районы',
    'transport': 'Транспорт',
    'history': 'История',
    'map': 'Карта'
  }
  
  return sectionNames[sectionId] || 'Неизвестный раздел'
}

export const getLizcoins = (): number => {
  const user = getCurrentUser()
  return user ? user.lizcoins : parseInt(localStorage.getItem('lizcoins') || '0')
}