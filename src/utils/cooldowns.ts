interface Cooldown {
  gameId: string
  endTime: number
}

const COOLDOWN_DURATION = 24 * 60 * 60 * 1000
const BASE_SKIP_COST = 25

export function getCooldown(gameId: string): Cooldown | null {
  const saved = localStorage.getItem(`cooldown-${gameId}`)
  if (!saved) return null
  
  const cooldown = JSON.parse(saved) as Cooldown
  if (Date.now() >= cooldown.endTime) {
    localStorage.removeItem(`cooldown-${gameId}`)
    localStorage.removeItem(`skip-count-${gameId}`)
    return null
  }
  
  return cooldown
}

export function setCooldown(gameId: string): void {
  const cooldown: Cooldown = {
    gameId,
    endTime: Date.now() + COOLDOWN_DURATION
  }
  
  localStorage.setItem(`cooldown-${gameId}`, JSON.stringify(cooldown))
}

export function getSkipCost(gameId: string): number {
  const skipCountKey = `skip-count-${gameId}`
  const savedSkipCount = localStorage.getItem(skipCountKey)
  const skipCount = savedSkipCount ? parseInt(savedSkipCount, 10) : 0
  
  return BASE_SKIP_COST * Math.pow(2, skipCount)
}

export function skipCooldown(gameId: string): void {
  const skipCountKey = `skip-count-${gameId}`
  const savedSkipCount = localStorage.getItem(skipCountKey)
  const currentSkipCount = savedSkipCount ? parseInt(savedSkipCount, 10) : 0
  
  localStorage.setItem(skipCountKey, (currentSkipCount + 1).toString())
  localStorage.removeItem(`cooldown-${gameId}`)
}

export function getRemainingTime(gameId: string): number {
  const cooldown = getCooldown(gameId)
  if (!cooldown) return 0
  
  return Math.max(0, cooldown.endTime - Date.now())
}

export function formatRemainingTime(ms: number): string {
  const hours = Math.floor(ms / (60 * 60 * 1000))
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
  const seconds = Math.floor((ms % (60 * 1000)) / 1000)
  
  if (hours > 0) {
    return `${hours}ч ${minutes}м`
  } else if (minutes > 0) {
    return `${minutes}м ${seconds}с`
  } else {
    return `${seconds}с`
  }
}