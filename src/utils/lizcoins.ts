export const addLizcoins = (amount: number, reason: string) => {
  const currentLizcoins = parseInt(localStorage.getItem('lizcoins') || '0')
  const newLizcoins = currentLizcoins + amount
  
  localStorage.setItem('lizcoins', newLizcoins.toString())
  
  // Trigger custom event for UI updates
  window.dispatchEvent(new CustomEvent('lizcoins-earned', { 
    detail: { amount, reason, newTotal: newLizcoins }
  }))
  
  return newLizcoins
}

export const trackSectionVisit = (sectionId: string, reward: number = 5) => {
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
  return parseInt(localStorage.getItem('lizcoins') || '0')
}