import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Icon from '@/components/ui/icon'

interface CrosswordWord {
  word: string
  clue: string
  direction: 'horizontal' | 'vertical'
  row: number
  col: number
}

const crosswordSets = [
  [
    { word: 'ГОТОВСК', clue: 'Название нашего города', direction: 'horizontal', row: 0, col: 0 },
    { word: 'ПАРК', clue: 'Место для прогулок', direction: 'vertical', row: 0, col: 2 },
    { word: 'МУЗЕЙ', clue: 'Место хранения истории', direction: 'horizontal', row: 2, col: 1 },
    { word: 'РЕКА', clue: 'Водный поток через город', direction: 'vertical', row: 1, col: 4 }
  ],
  [
    { word: 'ТЕАТР', clue: 'Место для спектаклей', direction: 'horizontal', row: 0, col: 0 },
    { word: 'ШКОЛА', clue: 'Место для учёбы', direction: 'vertical', row: 0, col: 3 },
    { word: 'МОСТ', clue: 'Переход через реку', direction: 'horizontal', row: 2, col: 1 },
    { word: 'ПЛОЩАДЬ', clue: 'Центральное место города', direction: 'horizontal', row: 4, col: 0 }
  ],
  [
    { word: 'БИБЛИОТЕКА', clue: 'Дом книг', direction: 'horizontal', row: 0, col: 0 },
    { word: 'СТАДИОН', clue: 'Место для спорта', direction: 'vertical', row: 0, col: 2 },
    { word: 'ФОНТАН', clue: 'Водный памятник', direction: 'horizontal', row: 3, col: 1 },
    { word: 'АЛЛЕЯ', clue: 'Дорожка с деревьями', direction: 'vertical', row: 2, col: 5 }
  ],
  [
    { word: 'ПАМЯТНИК', clue: 'Историческое сооружение', direction: 'horizontal', row: 0, col: 0 },
    { word: 'ЦЕРКОВЬ', clue: 'Религиозное здание', direction: 'vertical', row: 0, col: 3 },
    { word: 'СКВЕР', clue: 'Небольшой парк', direction: 'horizontal', row: 3, col: 2 },
    { word: 'УЛИЦА', clue: 'Городская дорога', direction: 'vertical', row: 1, col: 6 }
  ],
  [
    { word: 'КАФЕ', clue: 'Место для перекуса', direction: 'horizontal', row: 0, col: 0 },
    { word: 'КИНО', clue: 'Место для просмотра фильмов', direction: 'vertical', row: 0, col: 2 },
    { word: 'МАГАЗИН', clue: 'Место для покупок', direction: 'horizontal', row: 2, col: 1 },
    { word: 'АПТЕКА', clue: 'Место для лекарств', direction: 'vertical', row: 1, col: 5 }
  ]
]

function getRandomCrosswordSet() {
  return crosswordSets[Math.floor(Math.random() * crosswordSets.length)]
}

interface CrosswordGameProps {
  onComplete: (score: number) => void
  onBack: () => void
}

export default function CrosswordGame({ onComplete, onBack }: CrosswordGameProps) {
  const [words] = useState<CrosswordWord[]>(() => getRandomCrosswordSet())
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const initialAnswers: Record<string, string> = {}
    words.forEach((word, index) => {
      initialAnswers[index.toString()] = ''
    })
    setAnswers(initialAnswers)
  }, [words])

  const handleInputChange = (wordIndex: number, value: string) => {
    const word = words[wordIndex]
    const sanitized = value.toUpperCase().replace(/[^А-ЯЁA-Z]/g, '').slice(0, word.word.length)
    setAnswers({ ...answers, [wordIndex]: sanitized })
  }

  const checkAnswers = () => {
    let correct = 0
    words.forEach((word, index) => {
      if (answers[index]?.toUpperCase() === word.word) {
        correct++
      }
    })
    
    const finalScore = correct * 15
    setScore(finalScore)
    setCompleted(true)
    onComplete(finalScore)
  }

  const getGridSize = () => {
    let maxRow = 0
    let maxCol = 0
    
    words.forEach(word => {
      if (word.direction === 'horizontal') {
        maxRow = Math.max(maxRow, word.row)
        maxCol = Math.max(maxCol, word.col + word.word.length - 1)
      } else {
        maxRow = Math.max(maxRow, word.row + word.word.length - 1)
        maxCol = Math.max(maxCol, word.col)
      }
    })
    
    return { rows: maxRow + 1, cols: maxCol + 1 }
  }

  const { rows, cols } = getGridSize()

  const grid: (string | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null))
  
  words.forEach(word => {
    for (let i = 0; i < word.word.length; i++) {
      const row = word.direction === 'horizontal' ? word.row : word.row + i
      const col = word.direction === 'horizontal' ? word.col + i : word.col
      grid[row][col] = word.word[i]
    }
  })

  return (
    <Card className="border-2 border-purple-200 bg-white shadow-2xl scale-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <Icon name="ArrowLeft" size={20} />
            <span className="ml-2">Назад</span>
          </Button>
          {!completed && (
            <Button onClick={checkAnswers} className="bg-purple-500 hover:bg-purple-600">
              <Icon name="Check" size={20} />
              <span className="ml-2">Проверить</span>
            </Button>
          )}
        </div>
        <CardTitle className="text-gray-900">Кроссворд Готовска</CardTitle>
        <CardDescription>Разгадайте слова по подсказкам</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {completed && (
          <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-300 bounce-in">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Icon name="Trophy" size={32} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">Кроссворд решён!</p>
              <p className="text-lg text-purple-600 font-semibold">+{score} ЛК</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {words.map((word, index) => {
            const isCorrect = answers[index]?.toUpperCase() === word.word
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                    word.direction === 'horizontal' ? 'bg-blue-500' : 'bg-green-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">
                        {word.direction === 'horizontal' ? '→' : '↓'}
                      </span>
                      {' '}{word.clue} ({word.word.length} букв)
                    </p>
                    <div className="flex gap-1">
                      <Input
                        value={answers[index] || ''}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        disabled={completed}
                        placeholder="Введите слово..."
                        className={`text-center uppercase font-mono text-lg ${
                          completed && isCorrect
                            ? 'border-green-500 bg-green-50'
                            : completed && !isCorrect
                            ? 'border-red-500 bg-red-50'
                            : ''
                        }`}
                      />
                      {completed && (
                        <div className={`w-10 h-10 rounded flex items-center justify-center ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          <Icon 
                            name={isCorrect ? 'Check' : 'X'} 
                            size={20} 
                            className="text-white" 
                          />
                        </div>
                      )}
                    </div>
                    {completed && !isCorrect && (
                      <p className="text-sm text-gray-600 mt-1">
                        Правильный ответ: <span className="font-bold text-green-600">{word.word}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Прогресс:</span>
            <span className="font-bold">
              {Object.values(answers).filter(a => a.length > 0).length} / {words.length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
