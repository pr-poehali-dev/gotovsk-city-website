interface User {
  id: string
  username: string
  email: string
  createdAt: string
  lizcoins: number
}

export const register = (username: string, email: string, password: string): boolean => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  
  if (users.find((u: User) => u.email === email)) {
    return false
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    username,
    email,
    createdAt: new Date().toISOString(),
    lizcoins: 50
  }
  
  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))
  localStorage.setItem('user_' + newUser.id, password)
  
  login(email, password)
  return true
}

export const login = (email: string, password: string): boolean => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const user = users.find((u: User) => u.email === email)
  
  if (!user) return false
  
  const storedPassword = localStorage.getItem('user_' + user.id)
  if (storedPassword !== password) return false
  
  localStorage.setItem('currentUser', JSON.stringify(user))
  window.dispatchEvent(new Event('auth-change'))
  return true
}

export const logout = () => {
  localStorage.removeItem('currentUser')
  window.dispatchEvent(new Event('auth-change'))
}

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('currentUser')
  return userStr ? JSON.parse(userStr) : null
}

export const updateUserLizcoins = (lizcoins: number) => {
  const user = getCurrentUser()
  if (!user) return
  
  user.lizcoins = lizcoins
  localStorage.setItem('currentUser', JSON.stringify(user))
  
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const index = users.findIndex((u: User) => u.id === user.id)
  if (index !== -1) {
    users[index].lizcoins = lizcoins
    localStorage.setItem('users', JSON.stringify(users))
  }
}
