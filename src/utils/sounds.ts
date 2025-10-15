export type SoundType = 
  | 'click' 
  | 'success' 
  | 'error' 
  | 'coin' 
  | 'levelup' 
  | 'achievement'
  | 'notification'

class SoundManager {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map()
  private enabled: boolean = true
  private volume: number = 0.3

  constructor() {
    this.loadSounds()
    const savedEnabled = localStorage.getItem('sounds-enabled')
    const savedVolume = localStorage.getItem('sounds-volume')
    
    if (savedEnabled !== null) {
      this.enabled = savedEnabled === 'true'
    }
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume)
    }
  }

  private loadSounds() {
    const soundFrequencies: Record<SoundType, { freq: number[], duration: number }> = {
      click: { freq: [800], duration: 50 },
      success: { freq: [523, 659, 784], duration: 150 },
      error: { freq: [300, 200], duration: 200 },
      coin: { freq: [660, 880], duration: 100 },
      levelup: { freq: [523, 659, 784, 1047], duration: 200 },
      achievement: { freq: [659, 784, 988, 1319], duration: 250 },
      notification: { freq: [880, 1047], duration: 100 }
    }

    Object.entries(soundFrequencies).forEach(([type, config]) => {
      const audio = this.createBeepSound(config.freq, config.duration)
      this.sounds.set(type as SoundType, audio)
    })
  }

  private createBeepSound(frequencies: number[], duration: number): HTMLAudioElement {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const sampleRate = audioContext.sampleRate
    const numSamples = (sampleRate * duration) / 1000
    const buffer = audioContext.createBuffer(1, numSamples, sampleRate)
    const channel = buffer.getChannelData(0)

    const segmentLength = Math.floor(numSamples / frequencies.length)
    
    frequencies.forEach((freq, index) => {
      const startSample = index * segmentLength
      const endSample = Math.min((index + 1) * segmentLength, numSamples)
      
      for (let i = startSample; i < endSample; i++) {
        const t = (i - startSample) / sampleRate
        const envelope = Math.exp(-5 * (i - startSample) / (endSample - startSample))
        channel[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3
      }
    })

    const source = audioContext.createBufferSource()
    source.buffer = buffer
    
    const gainNode = audioContext.createGain()
    gainNode.gain.value = this.volume
    source.connect(gainNode)
    gainNode.connect(audioContext.destination)

    const audio = new Audio()
    const mediaStreamDestination = audioContext.createMediaStreamDestination()
    gainNode.connect(mediaStreamDestination)
    
    const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream)
    const chunks: Blob[] = []
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data)
      }
    }
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
      audio.src = URL.createObjectURL(blob)
    }
    
    return audio
  }

  play(type: SoundType) {
    if (!this.enabled) return
    
    const sound = this.sounds.get(type)
    if (sound) {
      sound.currentTime = 0
      sound.volume = this.volume
      sound.play().catch(() => {
      })
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
    localStorage.setItem('sounds-enabled', enabled.toString())
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    localStorage.setItem('sounds-volume', this.volume.toString())
    
    this.sounds.forEach(sound => {
      sound.volume = this.volume
    })
  }

  isEnabled(): boolean {
    return this.enabled
  }

  getVolume(): number {
    return this.volume
  }
}

export const soundManager = new SoundManager()

export const playSound = (type: SoundType) => {
  soundManager.play(type)
}
