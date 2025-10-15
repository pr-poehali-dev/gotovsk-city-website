import Icon from '@/components/ui/icon'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse-glow">
            <Icon name="Castle" size={48} className="text-white animate-float" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold chrome-text">Готовск</h2>
          <p className="text-slate-400 animate-pulse">Загрузка портала города...</p>
        </div>
        
        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  )
}
