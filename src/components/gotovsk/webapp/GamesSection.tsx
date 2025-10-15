import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { addLizcoins, getLizcoins } from '@/utils/lizcoins'
import { getCurrentUser } from '@/utils/auth'
import { getCooldown, setCooldown, getSkipCost, skipCooldown, getRemainingTime, formatRemainingTime } from '@/utils/cooldowns'
import CrosswordGame from './CrosswordGame'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correct: number
  reward: number
  difficulty: 'easy' | 'medium' | 'hard'
}

interface PuzzlePiece {
  id: number
  position: number
  currentPosition: number
}

interface Quest {
  id: string
  title: string
  description: string
  tasks: QuestTask[]
  reward: number
  completed: boolean
}

interface QuestTask {
  id: string
  description: string
  completed: boolean
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'В каком году был основан город Готовск?',
    options: ['1147', '1703', '1812', '1918'],
    correct: 0,
    reward: 10,
    difficulty: 'easy'
  },
  {
    id: 2,
    question: 'Какой район Готовска самый старый?',
    options: ['Северный', 'Центральный', 'Речной', 'Промышленный'],
    correct: 1,
    reward: 15,
    difficulty: 'medium'
  },
  {
    id: 3,
    question: 'Какое историческое событие произошло в Готовске в 1945 году?',
    options: [
      'Основание музея',
      'Открытие первой школы',
      'Освобождение города',
      'Постройка моста'
    ],
    correct: 2,
    reward: 20,
    difficulty: 'hard'
  },
  {
    id: 4,
    question: 'Сколько районов в современном Готовске?',
    options: ['3', '4', '5', '6'],
    correct: 1,
    reward: 10,
    difficulty: 'easy'
  },
  {
    id: 5,
    question: 'Какая достопримечательность является символом города?',
    options: ['Ратуша', 'Музей истории', 'Парк Победы', 'Речной вокзал'],
    correct: 0,
    reward: 15,
    difficulty: 'medium'
  }
]

const initialQuests: Quest[] = [
  {
    id: 'explorer',
    title: 'Исследователь Готовска',
    description: 'Посетите все основные разделы сайта',
    tasks: [
      { id: 'news', description: 'Посетить раздел Новости', completed: false },
      { id: 'attractions', description: 'Изучить Достопримечательности', completed: false },
      { id: 'districts', description: 'Узнать о Районах', completed: false },
      { id: 'history', description: 'Прочитать Историю', completed: false }
    ],
    reward: 50,
    completed: false
  },
  {
    id: 'collector',
    title: 'Коллекционер наград',
    description: 'Соберите первые награды',
    tasks: [
      { id: 'first-gift', description: 'Купить первый подарок', completed: false },
      { id: 'earn-100', description: 'Заработать 100 лизкоинов', completed: false },
      { id: 'daily-visit', description: 'Посетить сайт 3 дня подряд', completed: false }
    ],
    reward: 75,
    completed: false
  },
  {
    id: 'master',
    title: 'Мастер викторин',
    description: 'Пройдите все викторины без ошибок',
    tasks: [
      { id: 'quiz-5', description: 'Правильно ответить на 5 вопросов подряд', completed: false },
      { id: 'quiz-perfect', description: 'Пройти викторину без единой ошибки', completed: false }
    ],
    reward: 100,
    completed: false
  }
]

export default function GamesSection() {
  const [activeGame, setActiveGame] = useState<'quiz' | 'puzzle' | 'quests' | 'crossword' | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([])
  const [puzzleMoves, setPuzzleMoves] = useState(0)
  const [puzzleSolved, setPuzzleSolved] = useState(false)
  
  const [quests, setQuests] = useState<Quest[]>(initialQuests)
  const [message, setMessage] = useState('')
  
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({})

  const user = getCurrentUser()
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns({
        quiz: getRemainingTime('quiz'),
        puzzle: getRemainingTime('puzzle'),
        crossword: getRemainingTime('crossword')
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    initPuzzle()
    loadQuestsProgress()
  }, [])

  const loadQuestsProgress = () => {
    const saved = localStorage.getItem('quests-progress')
    if (saved) {
      setQuests(JSON.parse(saved))
    }
  }

  const saveQuestsProgress = (updatedQuests: Quest[]) => {
    localStorage.setItem('quests-progress', JSON.stringify(updatedQuests))
  }

  const initPuzzle = () => {
    const pieces = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      position: i,
      currentPosition: i
    }))
    
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pieces[i].currentPosition, pieces[j].currentPosition] = [
        pieces[j].currentPosition,
        pieces[i].currentPosition
      ]
    }
    
    setPuzzlePieces(pieces)
    setPuzzleMoves(0)
    setPuzzleSolved(false)
  }

  const handleQuizAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === quizQuestions[currentQuestion].correct
    
    if (isCorrect) {
      const reward = quizQuestions[currentQuestion].reward
      setScore(score + reward)
      setCorrectAnswers(correctAnswers + 1)
      setConsecutiveCorrect(consecutiveCorrect + 1)
      addLizcoins(reward, `Правильный ответ на вопрос викторины`)
      
      if (consecutiveCorrect + 1 >= 5) {
        updateQuestTask('master', 'quiz-5')
      }
    } else {
      setConsecutiveCorrect(0)
    }
    
    setShowResult(true)
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setQuizCompleted(true)
        setCooldown('quiz')
        if (correctAnswers + (isCorrect ? 1 : 0) === quizQuestions.length) {
          addLizcoins(50, 'Безупречное прохождение викторины!')
          updateQuestTask('master', 'quiz-perfect')
        }
      }
    }, 2000)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setCorrectAnswers(0)
    setQuizCompleted(false)
  }
  
  const handleSkipCooldown = (gameId: string) => {
    const cost = getSkipCost(gameId)
    const balance = getLizcoins()
    
    if (balance < cost) {
      setMessage(`Недостаточно лизкоинов! Нужно ${cost} ЛК`)
      setTimeout(() => setMessage(''), 3000)
      return
    }
    
    addLizcoins(-cost, `Пропуск кулдауна ${gameId}`)
    skipCooldown(gameId)
    setCooldowns({ ...cooldowns, [gameId]: 0 })
    setMessage(`Кулдаун пропущен за ${cost} ЛК!`)
    setTimeout(() => setMessage(''), 3000)
  }
  
  const startGame = (gameId: 'quiz' | 'puzzle' | 'crossword') => {
    const cooldown = getCooldown(gameId)
    if (cooldown) {
      return
    }
    
    setActiveGame(gameId)
    if (gameId === 'quiz') resetQuiz()
    if (gameId === 'puzzle') initPuzzle()
  }
  
  const handleGameComplete = (gameId: string) => {
    setCooldown(gameId)
    setCooldowns({ ...cooldowns, [gameId]: getRemainingTime(gameId) })
  }

  const movePuzzlePiece = (pieceIndex: number) => {
    const emptyIndex = puzzlePieces.findIndex(p => p.currentPosition === 8)
    const clickedPiece = puzzlePieces[pieceIndex]
    
    const emptyPos = puzzlePieces[emptyIndex].currentPosition
    const clickedPos = clickedPiece.currentPosition
    
    const emptyRow = Math.floor(emptyPos / 3)
    const emptyCol = emptyPos % 3
    const clickedRow = Math.floor(clickedPos / 3)
    const clickedCol = clickedPos % 3
    
    const isAdjacent =
      (Math.abs(emptyRow - clickedRow) === 1 && emptyCol === clickedCol) ||
      (Math.abs(emptyCol - clickedCol) === 1 && emptyRow === clickedRow)
    
    if (isAdjacent) {
      const newPieces = [...puzzlePieces]
      ;[newPieces[emptyIndex].currentPosition, newPieces[pieceIndex].currentPosition] = [
        newPieces[pieceIndex].currentPosition,
        newPieces[emptyIndex].currentPosition
      ]
      
      setPuzzlePieces(newPieces)
      setPuzzleMoves(puzzleMoves + 1)
      
      const solved = newPieces.every(p => p.position === p.currentPosition)
      if (solved) {
        setPuzzleSolved(true)
        handleGameComplete('puzzle')
        const reward = Math.max(50 - puzzleMoves, 20)
        addLizcoins(reward, `Решение пазла за ${puzzleMoves + 1} ходов`)
        setMessage(`Пазл решен за ${puzzleMoves + 1} ходов! +${reward} ЛК`)
        setTimeout(() => setMessage(''), 3000)
      }
    }
  }
  
  const handleCrosswordComplete = (crosswordScore: number) => {
    handleGameComplete('crossword')
    addLizcoins(crosswordScore, 'Решение кроссворда')
    setMessage(`Кроссворд решён! +${crosswordScore} ЛК`)
    setTimeout(() => setMessage(''), 5000)
  }

  const updateQuestTask = (questId: string, taskId: string) => {
    const updatedQuests = quests.map(quest => {
      if (quest.id === questId) {
        const updatedTasks = quest.tasks.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
        )
        const allCompleted = updatedTasks.every(t => t.completed)
        
        if (allCompleted && !quest.completed) {
          addLizcoins(quest.reward, `Выполнение квеста: ${quest.title}`)
          setMessage(`Квест завершен: ${quest.title}! +${quest.reward} ЛК`)
          setTimeout(() => setMessage(''), 5000)
          return { ...quest, tasks: updatedTasks, completed: true }
        }
        
        return { ...quest, tasks: updatedTasks }
      }
      return quest
    })
    
    setQuests(updatedQuests)
    saveQuestsProgress(updatedQuests)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <Card className="border-green-500/50 bg-green-500/10 bounce-in">
          <CardContent className="pt-6">
            <p className="text-center text-green-400 font-semibold">{message}</p>
          </CardContent>
        </Card>
      )}

      {!activeGame && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card 
            className={`border-2 border-blue-200 bg-white hover:scale-105 transition-transform cursor-pointer fade-in-up relative ${cooldowns.quiz ? 'opacity-60' : ''}`}
            onClick={() => !cooldowns.quiz && startGame('quiz')}
          >
            {cooldowns.quiz > 0 && (
              <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex flex-col items-center justify-center z-10 p-4">
                <Icon name="Clock" size={32} className="text-yellow-400 mb-2" />
                <p className="text-white font-bold text-center mb-2">Кулдаун</p>
                <p className="text-yellow-400 text-sm mb-3">{formatRemainingTime(cooldowns.quiz)}</p>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSkipCooldown('quiz')
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                >
                  <Icon name="Zap" size={16} />
                  <span className="ml-1">Пропустить за {getSkipCost('quiz')} ЛК</span>
                </Button>
              </div>
            )}
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center float-animation shadow-lg">
                <Icon name="Brain" size={32} className="text-white" />
              </div>
              <CardTitle className="text-center text-gray-900">Викторина</CardTitle>
              <CardDescription className="text-center">
                Проверьте свои знания о Готовске
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 text-center">
                <p>• {quizQuestions.length} интересных вопросов</p>
                <p>• Награды за правильные ответы</p>
                <p>• Бонусы за серии ответов</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`border-2 border-green-200 bg-white hover:scale-105 transition-transform cursor-pointer fade-in-up relative ${cooldowns.puzzle ? 'opacity-60' : ''}`}
            style={{animationDelay: '0.1s'}}
            onClick={() => !cooldowns.puzzle && startGame('puzzle')}
          >
            {cooldowns.puzzle > 0 && (
              <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex flex-col items-center justify-center z-10 p-4">
                <Icon name="Clock" size={32} className="text-yellow-400 mb-2" />
                <p className="text-white font-bold text-center mb-2">Кулдаун</p>
                <p className="text-yellow-400 text-sm mb-3">{formatRemainingTime(cooldowns.puzzle)}</p>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSkipCooldown('puzzle')
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                >
                  <Icon name="Zap" size={16} />
                  <span className="ml-1">Пропустить за {getSkipCost('puzzle')} ЛК</span>
                </Button>
              </div>
            )}
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center float-animation shadow-lg" style={{animationDelay: '0.5s'}}>
                <Icon name="Puzzle" size={32} className="text-white" />
              </div>
              <CardTitle className="text-center text-gray-900">Пазл</CardTitle>
              <CardDescription className="text-center">
                Соберите изображение Готовска
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 text-center">
                <p>• Классическая игра 3x3</p>
                <p>• Награды за скорость</p>
                <p>• Тренировка логики</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`border-2 border-purple-200 bg-white hover:scale-105 transition-transform cursor-pointer fade-in-up relative ${cooldowns.crossword ? 'opacity-60' : ''}`}
            style={{animationDelay: '0.15s'}}
            onClick={() => !cooldowns.crossword && startGame('crossword')}
          >
            {cooldowns.crossword > 0 && (
              <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex flex-col items-center justify-center z-10 p-4">
                <Icon name="Clock" size={32} className="text-yellow-400 mb-2" />
                <p className="text-white font-bold text-center mb-2">Кулдаун</p>
                <p className="text-yellow-400 text-sm mb-3">{formatRemainingTime(cooldowns.crossword)}</p>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSkipCooldown('crossword')
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                >
                  <Icon name="Zap" size={16} />
                  <span className="ml-1">Пропустить за {getSkipCost('crossword')} ЛК</span>
                </Button>
              </div>
            )}
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center float-animation shadow-lg" style={{animationDelay: '0.7s'}}>
                <Icon name="Grid3x3" size={32} className="text-white" />
              </div>
              <CardTitle className="text-center text-gray-900">Кроссворд</CardTitle>
              <CardDescription className="text-center">
                Разгадайте городские слова
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 text-center">
                <p>• 4 слова о Готовске</p>
                <p>• Разные кроссворды каждый раз</p>
                <p>• Награды за правильные ответы</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-2 border-orange-200 bg-white hover:scale-105 transition-transform cursor-pointer fade-in-up" 
            style={{animationDelay: '0.2s'}} 
            onClick={() => setActiveGame('quests')}
          >
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center float-animation shadow-lg" style={{animationDelay: '1s'}}>
                <Icon name="Trophy" size={32} className="text-white" />
              </div>
              <CardTitle className="text-center text-gray-900">Квесты</CardTitle>
              <CardDescription className="text-center">
                Выполняйте задания и получайте награды
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 text-center">
                <p>• {quests.filter(q => !q.completed).length} активных квестов</p>
                <p>• Крупные награды</p>
                <p>• Без кулдаунов</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeGame === 'quiz' && !quizCompleted && (
        <Card className="chrome-card scale-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setActiveGame(null)}>
                <Icon name="ArrowLeft" size={20} />
                <span className="ml-2">Назад</span>
              </Button>
              <Badge className={getDifficultyColor(quizQuestions[currentQuestion].difficulty)}>
                {quizQuestions[currentQuestion].difficulty === 'easy' ? 'Легко' : 
                 quizQuestions[currentQuestion].difficulty === 'medium' ? 'Средне' : 'Сложно'}
              </Badge>
            </div>
            <CardTitle className="chrome-text">Викторина о Готовске</CardTitle>
            <CardDescription>
              Вопрос {currentQuestion + 1} из {quizQuestions.length}
            </CardDescription>
            <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Набрано очков:</span>
                <span className="font-bold text-yellow-500 flex items-center gap-1">
                  <Icon name="Coins" size={16} />
                  {score} ЛК
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Правильных ответов:</span>
                <span className="font-bold text-green-500">{correctAnswers}/{quizQuestions.length}</span>
              </div>
              {consecutiveCorrect >= 3 && (
                <div className="text-center p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg">
                  <span className="text-yellow-400 font-bold">🔥 Серия: {consecutiveCorrect} подряд!</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold chrome-text">{quizQuestions[currentQuestion].question}</h3>
              
              <div className="grid gap-3">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`h-auto p-4 text-left justify-start transition-all ${
                      selectedAnswer === null
                        ? 'hover:bg-blue-500/20'
                        : selectedAnswer === index
                        ? index === quizQuestions[currentQuestion].correct
                          ? 'bg-green-500/30 border-green-500'
                          : 'bg-red-500/30 border-red-500'
                        : index === quizQuestions[currentQuestion].correct
                        ? 'bg-green-500/30 border-green-500'
                        : ''
                    }`}
                    onClick={() => handleQuizAnswer(index)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span>{option}</span>
                      {showResult && index === quizQuestions[currentQuestion].correct && (
                        <Icon name="Check" size={20} className="text-green-500 ml-auto" />
                      )}
                      {showResult && selectedAnswer === index && index !== quizQuestions[currentQuestion].correct && (
                        <Icon name="X" size={20} className="text-red-500 ml-auto" />
                      )}
                    </span>
                  </Button>
                ))}
              </div>

              {showResult && (
                <div className={`p-4 rounded-lg text-center font-semibold bounce-in ${
                  selectedAnswer === quizQuestions[currentQuestion].correct
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {selectedAnswer === quizQuestions[currentQuestion].correct
                    ? `Правильно! +${quizQuestions[currentQuestion].reward} ЛК`
                    : 'Неверно, попробуйте еще раз!'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeGame === 'quiz' && quizCompleted && (
        <Card className="chrome-card scale-in">
          <CardHeader>
            <CardTitle className="text-center chrome-text">Викторина завершена!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center bounce-in">
                <Icon name="Trophy" size={48} className="text-white" />
              </div>
              
              <div className="space-y-2">
                <p className="text-2xl font-bold chrome-text">
                  {correctAnswers} из {quizQuestions.length}
                </p>
                <p className="text-muted-foreground">правильных ответов</p>
              </div>

              <div className="p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg">
                <p className="text-3xl font-bold text-yellow-400 flex items-center justify-center gap-2">
                  <Icon name="Coins" size={32} />
                  +{score} ЛК
                </p>
                <p className="text-sm text-muted-foreground mt-2">Заработано лизкоинов</p>
              </div>

              {correctAnswers === quizQuestions.length && (
                <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg pulse-glow">
                  <p className="text-lg font-bold text-purple-400">
                    🎉 Безупречно! Все ответы верны!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Вы получили бонус +50 ЛК
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={resetQuiz} className="flex-1 chrome-button">
                <Icon name="RotateCcw" size={20} />
                <span className="ml-2">Пройти еще раз</span>
              </Button>
              <Button onClick={() => setActiveGame(null)} variant="outline" className="flex-1">
                <Icon name="Home" size={20} />
                <span className="ml-2">В меню</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeGame === 'puzzle' && (
        <Card className="chrome-card scale-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setActiveGame(null)}>
                <Icon name="ArrowLeft" size={20} />
                <span className="ml-2">Назад</span>
              </Button>
              <Button variant="outline" onClick={initPuzzle}>
                <Icon name="RotateCcw" size={20} />
                <span className="ml-2">Новая игра</span>
              </Button>
            </div>
            <CardTitle className="chrome-text">Пазл Готовска</CardTitle>
            <CardDescription>
              Соберите изображение, перемещая плитки
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Ходов:</span>
              <span className="font-bold">{puzzleMoves}</span>
            </div>

            <div className="max-w-sm mx-auto">
              <div className="grid grid-cols-3 gap-2 bg-slate-800 p-4 rounded-lg">
                {puzzlePieces.map((piece, index) => {
                  const row = Math.floor(piece.currentPosition / 3)
                  const col = piece.currentPosition % 3
                  
                  return (
                    <button
                      key={piece.id}
                      onClick={() => movePuzzlePiece(index)}
                      disabled={puzzleSolved}
                      className={`aspect-square rounded-lg font-bold text-2xl transition-all ${
                        piece.position === 8
                          ? 'bg-transparent'
                          : piece.position === piece.currentPosition
                          ? 'bg-gradient-to-br from-green-500 to-teal-600 text-white shadow-lg'
                          : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:scale-105 cursor-pointer'
                      }`}
                      style={{
                        gridColumn: col + 1,
                        gridRow: row + 1
                      }}
                    >
                      {piece.position !== 8 && piece.position + 1}
                    </button>
                  )
                })}
              </div>
            </div>

            {puzzleSolved && (
              <div className="text-center space-y-4">
                <div className="p-6 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg bounce-in">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                    <Icon name="Check" size={32} className="text-white" />
                  </div>
                  <p className="text-2xl font-bold text-green-400">Пазл решен!</p>
                  <p className="text-muted-foreground mt-2">За {puzzleMoves} ходов</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeGame === 'crossword' && (
        <CrosswordGame 
          onComplete={handleCrosswordComplete}
          onBack={() => setActiveGame(null)}
        />
      )}

      {activeGame === 'quests' && (
        <Card className="chrome-card scale-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setActiveGame(null)}>
                <Icon name="ArrowLeft" size={20} />
                <span className="ml-2">Назад</span>
              </Button>
            </div>
            <CardTitle className="chrome-text">Активные квесты</CardTitle>
            <CardDescription>
              Выполняйте задания и получайте награды
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quests.map((quest, index) => {
              const completedTasks = quest.tasks.filter(t => t.completed).length
              const progress = (completedTasks / quest.tasks.length) * 100
              
              return (
                <Card
                  key={quest.id}
                  className={`border-2 fade-in-up ${
                    quest.completed
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-blue-500/30'
                  }`}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Icon
                            name={quest.completed ? 'CheckCircle2' : 'Target'}
                            size={24}
                            className={quest.completed ? 'text-green-500' : 'text-blue-500'}
                          />
                          {quest.title}
                        </CardTitle>
                        <CardDescription>{quest.description}</CardDescription>
                      </div>
                      <Badge className="bg-yellow-500 text-black">
                        <Icon name="Coins" size={14} />
                        <span className="ml-1">{quest.reward} ЛК</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span className="font-bold">
                          {completedTasks}/{quest.tasks.length}
                        </span>
                      </div>
                      <Progress value={progress} />
                    </div>

                    <div className="space-y-2">
                      {quest.tasks.map(task => (
                        <div
                          key={task.id}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                            task.completed
                              ? 'bg-green-500/20'
                              : 'bg-slate-800/50'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            task.completed
                              ? 'bg-green-500'
                              : 'border-2 border-slate-600'
                          }`}>
                            {task.completed && (
                              <Icon name="Check" size={16} className="text-white" />
                            )}
                          </div>
                          <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                            {task.description}
                          </span>
                        </div>
                      ))}
                    </div>

                    {quest.completed && (
                      <div className="p-3 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg text-center">
                        <p className="text-green-400 font-bold flex items-center justify-center gap-2">
                          <Icon name="Trophy" size={20} />
                          Квест завершен!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}