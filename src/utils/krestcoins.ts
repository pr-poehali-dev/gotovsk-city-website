import { getCurrentUser } from './auth'

export const addKrestcoins = (amount: number, reason: string) => {
  const user = getCurrentUser()
  
  if (user) {
    const currentKrest = getKrestcoins()
    const newKrest = currentKrest + amount
    localStorage.setItem(`krestcoins-${user.id}`, newKrest.toString())
    
    const transaction = {
      userId: user.id,
      username: user.username,
      amount: amount,
      reason: reason,
      timestamp: new Date().toISOString(),
      balanceAfter: newKrest
    }
    
    const allTransactions = JSON.parse(localStorage.getItem('krestcoinsTransactions') || '[]')
    allTransactions.push(transaction)
    localStorage.setItem('krestcoinsTransactions', JSON.stringify(allTransactions))
    
    window.dispatchEvent(new CustomEvent('krestcoins-earned', { 
      detail: { amount, reason, newTotal: newKrest }
    }))
    
    return newKrest
  }
  
  return 0
}

export const getKrestcoins = (): number => {
  const user = getCurrentUser()
  if (!user) return 0
  
  const saved = localStorage.getItem(`krestcoins-${user.id}`)
  return saved ? parseInt(saved, 10) : 0
}

export const hasVIPStatus = (): boolean => {
  const user = getCurrentUser()
  if (!user) return false
  
  const vipExpiry = localStorage.getItem(`vip-expiry-${user.id}`)
  if (!vipExpiry) return false
  
  const expiryDate = new Date(vipExpiry)
  return expiryDate > new Date()
}

export const getVIPExpiry = (): Date | null => {
  const user = getCurrentUser()
  if (!user) return null
  
  const vipExpiry = localStorage.getItem(`vip-expiry-${user.id}`)
  if (!vipExpiry) return null
  
  return new Date(vipExpiry)
}

export const activateVIP = (): boolean => {
  const user = getCurrentUser()
  if (!user) return false
  
  const krest = getKrestcoins()
  if (krest < 1) return false
  
  addKrestcoins(-1, 'Покупка VIP-статуса на 30 дней')
  
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 30)
  
  localStorage.setItem(`vip-expiry-${user.id}`, expiryDate.toISOString())
  
  window.dispatchEvent(new CustomEvent('vip-activated', { 
    detail: { expiryDate }
  }))
  
  return true
}

export const renewVIP = (): boolean => {
  const user = getCurrentUser()
  if (!user) return false
  
  const krest = getKrestcoins()
  if (krest < 1) return false
  
  addKrestcoins(-1, 'Продление VIP-статуса на 30 дней')
  
  const currentExpiry = getVIPExpiry()
  const newExpiry = currentExpiry && currentExpiry > new Date() 
    ? new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  
  localStorage.setItem(`vip-expiry-${user.id}`, newExpiry.toISOString())
  
  window.dispatchEvent(new CustomEvent('vip-renewed', { 
    detail: { expiryDate: newExpiry }
  }))
  
  return true
}

export const formatVIPExpiry = (date: Date): string => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.ceil(diff / (24 * 60 * 60 * 1000))
  
  if (days <= 0) return 'Истёк'
  if (days === 1) return '1 день'
  if (days <= 4) return `${days} дня`
  return `${days} дней`
}

export const hasVIPEliteStatus = (): boolean => {
  const user = getCurrentUser()
  if (!user) return false
  
  const vipEliteExpiry = localStorage.getItem(`vip-elite-expiry-${user.id}`)
  if (!vipEliteExpiry) return false
  
  const expiryDate = new Date(vipEliteExpiry)
  return expiryDate > new Date()
}

export const getVIPEliteExpiry = (): Date | null => {
  const user = getCurrentUser()
  if (!user) return null
  
  const vipEliteExpiry = localStorage.getItem(`vip-elite-expiry-${user.id}`)
  if (!vipEliteExpiry) return null
  
  return new Date(vipEliteExpiry)
}

export const activateVIPElite = (): boolean => {
  const user = getCurrentUser()
  if (!user) return false
  
  const krest = getKrestcoins()
  if (krest < 50) return false
  
  addKrestcoins(-50, 'Покупка VIP Elite статуса на 30 дней')
  
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 30)
  
  localStorage.setItem(`vip-elite-expiry-${user.id}`, expiryDate.toISOString())
  
  window.dispatchEvent(new CustomEvent('vip-elite-activated', { 
    detail: { expiryDate }
  }))
  
  return true
}

export const renewVIPElite = (): boolean => {
  const user = getCurrentUser()
  if (!user) return false
  
  const krest = getKrestcoins()
  if (krest < 50) return false
  
  addKrestcoins(-50, 'Продление VIP Elite статуса на 30 дней')
  
  const currentExpiry = getVIPEliteExpiry()
  const newExpiry = currentExpiry && currentExpiry > new Date() 
    ? new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  
  localStorage.setItem(`vip-elite-expiry-${user.id}`, newExpiry.toISOString())
  
  window.dispatchEvent(new CustomEvent('vip-elite-renewed', { 
    detail: { expiryDate: newExpiry }
  }))
  
  return true
}