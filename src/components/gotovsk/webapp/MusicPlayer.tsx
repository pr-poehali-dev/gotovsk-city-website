import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import Icon from '@/components/ui/icon'

const spotifyTracks = [
  { id: 1, name: "Blinding Lights", artist: "The Weeknd", uri: "spotify:track:0VjIjW4GlUZAMYd2vXMi3b" },
  { id: 2, name: "Shape of You", artist: "Ed Sheeran", uri: "spotify:track:7qiZfU4dY1lWllzX7mPBI" },
  { id: 3, name: "Someone Like You", artist: "Adele", uri: "spotify:track:1zwMYTA5nlNjZxYrvBB2pV" },
  { id: 4, name: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", uri: "spotify:track:32OlwWuMpZ6b0aN2RZOeMS" },
  { id: 5, name: "Thinking Out Loud", artist: "Ed Sheeran", uri: "spotify:track:lp7Lcs2NqealmpMe0p49" },
  { id: 6, name: "Radioactive", artist: "Imagine Dragons", uri: "spotify:track:2takcwOaAZWiXQijPHIx7B" },
  { id: 7, name: "Rolling in the Deep", artist: "Adele", uri: "spotify:track:4OSBTYWVlMW3YkXGmT" },
  { id: 8, name: "Counting Stars", artist: "OneRepublic", uri: "spotify:track:2tpWsVSb9UEmDRxAl1zhX1" },
  { id: 9, name: "Wake Me Up", artist: "Avicii", uri: "spotify:track:0nrRP2bk19rLc0orkWPQk2" },
  { id: 10, name: "Demons", artist: "Imagine Dragons", uri: "spotify:track:5qaEfEh1AtSdrdrByCP7qR" }
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [volume, setVolume] = useState(50)
  const [playlist, setPlaylist] = useState<typeof spotifyTracks>([])
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const extended = []
    for (let i = 0; i < 50; i++) {
      extended.push(...spotifyTracks.map((track, idx) => ({
        ...track,
        id: i * spotifyTracks.length + idx + 1
      })))
    }
    setPlaylist(shuffleArray(extended))
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('music-player-state')
    if (saved) {
      const state = JSON.parse(saved)
      setIsOpen(state.isOpen || false)
      setVolume(state.volume || 50)
      setIsMuted(state.isMuted || false)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('music-player-state', JSON.stringify({
      isOpen,
      volume,
      isMuted
    }))
  }, [isOpen, volume, isMuted])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length)
    setIsPlaying(true)
  }

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length)
    setIsPlaying(true)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (value[0] > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  const currentTrack = playlist[currentTrackIndex]

  if (!currentTrack) return null

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-2xl bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all hover:scale-110"
          title="Открыть музыкальный плеер"
        >
          <Icon name="Music" size={24} className="text-white" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-40 w-80 shadow-2xl border-2 border-green-500/30 bg-white/95 backdrop-blur-md animate-slide-in-right">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <Icon name="Music" size={16} className="text-white" />
                </div>
                <h3 className="font-bold text-sm">Музыка Готовска</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <Icon name="ChevronDown" size={18} />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                    <Icon 
                      name={isPlaying ? "Music2" : "Music"} 
                      size={20} 
                      className={`text-white ${isPlaying ? 'animate-pulse' : ''}`} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-gray-900">
                      {currentTrack.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {currentTrack.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevTrack}
                    className="h-9 w-9 p-0 hover:bg-green-100"
                  >
                    <Icon name="SkipBack" size={18} className="text-gray-700" />
                  </Button>

                  <Button
                    onClick={togglePlay}
                    className="h-10 w-10 p-0 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:scale-110 transition-all"
                  >
                    <Icon 
                      name={isPlaying ? "Pause" : "Play"} 
                      size={20} 
                      className="text-white" 
                    />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextTrack}
                    className="h-9 w-9 p-0 hover:bg-green-100"
                  >
                    <Icon name="SkipForward" size={18} className="text-gray-700" />
                  </Button>

                  <div className="flex-1" />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="h-9 w-9 p-0 hover:bg-green-100"
                  >
                    <Icon 
                      name={isMuted || volume === 0 ? "VolumeX" : volume < 50 ? "Volume1" : "Volume2"} 
                      size={18} 
                      className="text-gray-700"
                    />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="Volume2" size={14} className="text-gray-500" />
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-600 w-8 text-right">
                    {isMuted ? 0 : volume}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                <div className="flex items-center gap-1">
                  <Icon name="ListMusic" size={12} />
                  <span>Трек {currentTrackIndex + 1} из {playlist.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Shuffle" size={12} className="text-green-600" />
                  <span className="text-green-600">Перемешано</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
