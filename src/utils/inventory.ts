export interface InventoryItem {
  id: string
  type: 'gift' | 'box' | 'item'
  name: string
  description: string
  icon: string
  acquiredAt: string
  count: number
  metadata?: Record<string, any>
}

export const getInventory = (): InventoryItem[] => {
  const saved = localStorage.getItem('userInventory')
  return saved ? JSON.parse(saved) : []
}

export const addToInventory = (item: Omit<InventoryItem, 'acquiredAt' | 'count'>): void => {
  const inventory = getInventory()
  const existingIndex = inventory.findIndex(i => i.id === item.id && i.type === item.type)
  
  if (existingIndex >= 0) {
    inventory[existingIndex].count += 1
  } else {
    inventory.push({
      ...item,
      acquiredAt: new Date().toISOString(),
      count: 1
    })
  }
  
  localStorage.setItem('userInventory', JSON.stringify(inventory))
  window.dispatchEvent(new Event('inventory-updated'))
}

export const removeFromInventory = (itemId: string, itemType: string): void => {
  const inventory = getInventory()
  const itemIndex = inventory.findIndex(i => i.id === itemId && i.type === itemType)
  
  if (itemIndex >= 0) {
    if (inventory[itemIndex].count > 1) {
      inventory[itemIndex].count -= 1
    } else {
      inventory.splice(itemIndex, 1)
    }
    
    localStorage.setItem('userInventory', JSON.stringify(inventory))
    window.dispatchEvent(new Event('inventory-updated'))
  }
}

export const getItemCount = (itemId: string, itemType: string): number => {
  const inventory = getInventory()
  const item = inventory.find(i => i.id === itemId && i.type === itemType)
  return item ? item.count : 0
}

export const clearInventory = (): void => {
  localStorage.removeItem('userInventory')
  window.dispatchEvent(new Event('inventory-updated'))
}
