interface Cooldown {
  gameId: string
  endTime: number
  skipCount: number
}

const COOLDOWN_DURATION = 24 * 60 * 60 * 1000
const BASE_SKIP_COST = 25

export function getCooldown(gameId: string): Cooldown | null {
  const saved = localStorage.getItem(`cooldown-${gameId}`)
  if (!saved) return null
  
  const cooldown = JSON.parse(saved) as Cooldown
  if (Date.now() >= cooldown.endTime) {
    localStorage.removeItem(`cooldown-${gameId}`)
    return null
  }
  
  return cooldown
}

export function setCooldown(gameId: string): void {
  const existing = getCooldown(gameId)
  const skipCount = existing?.skipCount || 0
  
  const cooldown: Cooldown = {
    gameId,
    endTime: Date.now() + COOLDOWN_DURATION,
    skipCount
  }
  
  localStorage.setItem(`cooldown-${gameId}`, JSON.stringify(cooldown))
}

export function getSkipCost(gameId: string): number {
  const cooldown = getCooldown(gameId)
  if (!cooldown) return BASE_SKIP_COST
  
  return BASE_SKIP_COST * Math.pow(2, cooldown.skipCount)
}

export function skipCooldown(gameId: string): void {
  const cooldown = getCooldown(gameId)
  if (!cooldown) return
  
  const newCooldown: Cooldown = {
    gameId,
    endTime: Date.now(),
    skipCount: cooldown.skipCount + 1
  }
  
  localStorage.setItem(`cooldown-${gameId}`, JSON.stringify(newCooldown))
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
