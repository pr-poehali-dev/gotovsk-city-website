export type AdminRank = 'super_admin' | 'senior_admin' | 'middle_admin' | 'junior_admin' | null

export interface AdminPermissions {
  canManageUsers: boolean
  canManageGifts: boolean
  canManageNews: boolean
  canViewStats: boolean
  canManageAdmins: boolean
  canEditContent: boolean
}

const SUPER_ADMINS = ['Админ', 'Володя']

export const getAdminRank = (username: string): AdminRank => {
  if (SUPER_ADMINS.includes(username)) {
    return 'super_admin'
  }
  
  const adminRanks = JSON.parse(localStorage.getItem('adminRanks') || '{}')
  return adminRanks[username] || null
}

export const setAdminRank = (username: string, rank: AdminRank): void => {
  if (SUPER_ADMINS.includes(username)) {
    return
  }
  
  const adminRanks = JSON.parse(localStorage.getItem('adminRanks') || '{}')
  
  if (rank === null) {
    delete adminRanks[username]
  } else {
    adminRanks[username] = rank
  }
  
  localStorage.setItem('adminRanks', JSON.stringify(adminRanks))
  window.dispatchEvent(new Event('admin-ranks-changed'))
}

export const getAdminPermissions = (rank: AdminRank): AdminPermissions => {
  switch (rank) {
    case 'super_admin':
      return {
        canManageUsers: true,
        canManageGifts: true,
        canManageNews: true,
        canViewStats: true,
        canManageAdmins: true,
        canEditContent: true
      }
    
    case 'senior_admin':
      return {
        canManageUsers: true,
        canManageGifts: true,
        canManageNews: true,
        canViewStats: true,
        canManageAdmins: false,
        canEditContent: true
      }
    
    case 'middle_admin':
      return {
        canManageUsers: false,
        canManageGifts: true,
        canManageNews: true,
        canViewStats: true,
        canManageAdmins: false,
        canEditContent: true
      }
    
    case 'junior_admin':
      return {
        canManageUsers: false,
        canManageGifts: false,
        canManageNews: true,
        canViewStats: true,
        canManageAdmins: false,
        canEditContent: false
      }
    
    default:
      return {
        canManageUsers: false,
        canManageGifts: false,
        canManageNews: false,
        canViewStats: false,
        canManageAdmins: false,
        canEditContent: false
      }
  }
}

export const getRankLabel = (rank: AdminRank): string => {
  switch (rank) {
    case 'super_admin':
      return 'Главный Администратор'
    case 'senior_admin':
      return 'Старший Администратор'
    case 'middle_admin':
      return 'Средний Администратор'
    case 'junior_admin':
      return 'Младший Администратор'
    default:
      return 'Пользователь'
  }
}

export const getRankColor = (rank: AdminRank): string => {
  switch (rank) {
    case 'super_admin':
      return 'from-red-500 to-orange-600'
    case 'senior_admin':
      return 'from-purple-500 to-pink-600'
    case 'middle_admin':
      return 'from-blue-500 to-cyan-600'
    case 'junior_admin':
      return 'from-green-500 to-emerald-600'
    default:
      return 'from-gray-400 to-gray-500'
  }
}

export const isAdmin = (username: string): boolean => {
  return getAdminRank(username) !== null
}

export const getAllAdmins = () => {
  const adminRanks = JSON.parse(localStorage.getItem('adminRanks') || '{}')
  const admins = []
  
  for (const admin of SUPER_ADMINS) {
    admins.push({ username: admin, rank: 'super_admin' as AdminRank })
  }
  
  for (const [username, rank] of Object.entries(adminRanks)) {
    admins.push({ username, rank: rank as AdminRank })
  }
  
  return admins
}
