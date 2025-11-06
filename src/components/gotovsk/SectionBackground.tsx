import { useEffect, useState } from 'react'

interface SectionBackgroundProps {
  section: string
}

export function SectionBackground({ section }: SectionBackgroundProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getBackgroundStyle = () => {
    switch (section) {
      case 'main':
        return 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400'
      case 'districts':
        return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600'
      case 'transport':
        return 'bg-gradient-to-br from-red-400 via-red-500 to-red-600'
      case 'news':
        return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600'
      case 'history':
        return 'bg-gradient-to-br from-amber-700 via-yellow-800 to-amber-900'
      case 'games':
        return 'bg-gradient-to-br from-sky-300 via-sky-400 to-blue-400'
      case 'gifts':
        return 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600'
      case 'inventory':
        return 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600'
      default:
        return 'bg-gradient-to-br from-heritage-beige to-heritage-brown'
    }
  }

  const renderAnimations = () => {
    switch (section) {
      case 'main':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`absolute animate-float-${i}`}
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 10}%`,
                  animationDelay: `${i * 0.5}s`
                }}
              >
                <span className="text-6xl opacity-20">🐦</span>
              </div>
            ))}
          </div>
        )
      
      case 'transport':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-train"
                style={{
                  top: `${20 + i * 25}%`,
                  animationDelay: `${i * 2}s`,
                  animationDuration: '8s'
                }}
              >
                <span className="text-7xl opacity-20">🚂</span>
              </div>
            ))}
          </div>
        )
      
      case 'games':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`absolute ${i % 2 === 0 ? 'animate-spin-slow' : 'animate-pulse-slow'}`}
                style={{
                  left: `${15 + i * 20}%`,
                  top: `${15 + i * 15}%`,
                  animationDelay: `${i * 0.7}s`
                }}
              >
                <span className="text-6xl opacity-15">
                  {i % 2 === 0 ? '🎮' : '🕹️'}
                </span>
              </div>
            ))}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className={`fixed inset-0 -z-10 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'} ${getBackgroundStyle()}`}>
      {renderAnimations()}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  )
}
