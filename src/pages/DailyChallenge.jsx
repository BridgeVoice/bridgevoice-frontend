import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

function DailyChallenge() {
  const [challenges, setChallenges] = useState([])
  const [challengeDate, setChallengeDate] = useState('')
  const [generating, setGenerating] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [activeChallenge, setActiveChallenge] = useState(null)
  const [userResponse, setUserResponse] = useState('')
  const [submitted, setSubmitted] = useState({})
  const [feedback, setFeedback] = useState({})
  const [loadingFeedback, setLoadingFeedback] = useState({})

  const [proficiencyLevel] = useState(
    localStorage.getItem('proficiencyLevel') || 'Beginner'
  )

  const today = new Date().toISOString().split('T')[0]
  const BACKEND_URL = 'http://127.0.0.1:8000'
  const CACHE_KEY = `team_v2_challenges_${today}`
  const CACHE_KEY_ORIGINAL = `team_v2_original_${today}`

  useEffect(() => {
    if (initialized) return
    setInitialized(true)
    const saved = localStorage.getItem(CACHE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.challenges && parsed.challenges.length === 3) {
          setChallenges(parsed.challenges)
          setChallengeDate(parsed.date)
          return
        }
      } catch (e) {
        localStorage.removeItem(CACHE_KEY)
        localStorage.removeItem(CACHE_KEY_ORIGINAL)
      }
    }
    generateChallenges()
  }, [])

  const generateChallenges = async () => {
    setGenerating(true)
    setChallenges([])
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-challenge/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          native_language: 'English',
          proficiency_level: proficiencyLevel
        })
      })
      const data = await response.json()
      setChallenges(data.challenges)
      setChallengeDate(data.date)
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      localStorage.setItem(CACHE_KEY_ORIGINAL, JSON.stringify(data))
    } catch (err) {
      console.log('Could not generate challenges', err)
    }
    setGenerating(false)
  }

  const handleNewChallenges = async () => {
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(CACHE_KEY_ORIGINAL)
    setSubmitted({})
    setFeedback({})
    setActiveChallenge(null)
    setUserResponse('')
    await generateChallenges()
  }

  const handleSubmit = async (index) => {
    if (!userResponse.trim()) return
    const response = userResponse
    setSubmitted(prev => ({ ...prev, [index]: response }))
    setUserResponse('')
    setActiveChallenge(null)

    setLoadingFeedback(prev => ({ ...prev, [index]: true }))
    try {
      const result = await fetch(`${BACKEND_URL}/api/daily-challenge/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge_type: challenges[index].type,
          challenge_instruction: challenges[index].instruction,
          user_response: response,
          native_language: 'English',
          proficiency_level: proficiencyLevel
        })
      })
      const data = await result.json()
      setFeedback(prev => ({ ...prev, [index]: data }))
    } catch (err) {
      console.log('Could not get feedback')
    }
    setLoadingFeedback(prev => ({ ...prev, [index]: false }))
  }

  const typeConfig = {
    'Speaking': {
      icon: '🎙️',
      accent: '#7c3aed',
      badge: 'bg-purple-900 bg-opacity-40 border-purple-800 text-purple-300'
    },
    'Writing': {
      icon: '✍️',
      accent: '#2563eb',
      badge: 'bg-blue-900 bg-opacity-40 border-blue-800 text-blue-300'
    },
    'Vocabulary': {
      icon: '📚',
      accent: '#059669',
      badge: 'bg-green-900 bg-opacity-40 border-green-800 text-green-300'
    },
  }

  const completedCount = Object.keys(submitted).length

  const getScoreStyle = (score) => {
    if (score >= 90) return 'bg-green-900 bg-opacity-30 border-green-800 text-green-400'
    if (score >= 75) return 'bg-blue-900 bg-opacity-30 border-blue-800 text-blue-400'
    if (score >= 60) return 'bg-yellow-900 bg-opacity-30 border-yellow-800 text-yellow-400'
    return 'bg-red-900 bg-opacity-30 border-red-800 text-red-400'
  }

  const splitText = (text) => {
    if (!text) return { english: '', native: '' }
    const parts = text.split('|')
    return {
      english: parts[0]?.trim() || text,
      native: parts[1]?.trim() || ''
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Hero */}
        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 opacity-50"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
          <div className="relative p-8 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">🤖 AI Generated Daily</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Daily Challenge</h2>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                AI generates fresh personalized challenges every day. Get real-time AI feedback on your responses.
              </p>
              <div className="flex items-center gap-6 mt-5">
                {[
                  { value: `${completedCount}/3`, label: 'Completed Today' },
                  { value: challengeDate || 'Today', label: 'Date' },
                  { value: proficiencyLevel, label: 'Your Level' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-base font-bold text-purple-400">{stat.value}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block text-8xl opacity-10">🎯</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-white">Today's Progress</p>
              <span className="text-xs text-gray-500">{completedCount} of 3 completed</span>
            </div>
            <button
              onClick={handleNewChallenges}
              disabled={generating}
              className="flex items-center gap-2 border border-gray-700 hover:border-purple-600 text-gray-400 hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium transition disabled:opacity-50"
            >
              {generating ? (
                <>
                  <span className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                  Generating...
                </>
              ) : '🔄 New Challenges'}
            </button>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / 3) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            {['Speaking', 'Writing', 'Vocabulary'].map((type, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${submitted[i] ? 'bg-green-400' : 'bg-gray-700'}`}></div>
                <span className={`text-xs ${submitted[i] ? 'text-green-400' : 'text-gray-600'}`}>{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Loading */}
        {generating && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-semibold mb-1">Generating your challenges...</p>
            <p className="text-gray-500 text-sm">
              AI is personalizing for {proficiencyLevel} level
            </p>
          </div>
        )}

        {/* Challenge Cards */}
        {!generating && challenges.map((challenge, i) => {
          const config = typeConfig[challenge.type] || typeConfig['Speaking']
          const isSubmitted = !!submitted[i]
          const isActive = activeChallenge === i
          const instruction = splitText(challenge.instruction)
          const tip = splitText(challenge.tip)

          return (
            <div key={i} className={`bg-gray-900 border rounded-2xl overflow-hidden transition ${
              isSubmitted ? 'border-gray-700' : 'border-gray-800 hover:border-gray-700'
            }`}>

              {/* Card Header */}
              <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: `${config.accent}20`, border: `1px solid ${config.accent}40` }}
                  >
                    {config.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${config.badge}`}>
                        {challenge.type}
                      </span>
                      {isSubmitted && (
                        <span className="text-xs font-medium text-green-400">✅ Completed</span>
                      )}
                    </div>
                    <p className="font-bold text-white text-base">{challenge.title}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-500 mb-0.5">Reward</p>
                  <p className="font-bold text-purple-400">+{challenge.xp} XP</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 py-5 space-y-4">

                {/* Instruction */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-0.5 rounded-full flex-shrink-0 mt-1"
                    style={{ backgroundColor: config.accent, minHeight: '20px' }}
                  ></div>
                  <p className="text-gray-200 text-sm leading-relaxed">{instruction.english}</p>
                </div>

                {/* Vocabulary words */}
                {challenge.words && (
                  <div className="flex flex-wrap gap-2">
                    {challenge.words.map((word, j) => (
                      <span key={j} className="bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1 rounded-lg text-xs font-medium">
                        {word}
                      </span>
                    ))}
                  </div>
                )}

                {/* Example */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">Example</p>
                  <p className="text-gray-300 text-sm italic leading-relaxed">"{challenge.example}"</p>
                </div>

                {/* Tip */}
                <div className="flex items-start gap-2.5">
                  <span className="text-yellow-500 text-sm flex-shrink-0 mt-0.5">💡</span>
                  <p className="text-gray-400 text-xs leading-relaxed">{tip.english}</p>
                </div>

                {/* Action Area */}
                {isSubmitted ? (
                  <div className="space-y-3">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                      <p className="text-gray-500 text-xs font-semibold mb-2">Your Response</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{submitted[i]}</p>
                    </div>

                    {loadingFeedback[i] && (
                      <div className="flex items-center gap-2 px-4 py-3 bg-purple-900 bg-opacity-10 border border-purple-800 rounded-xl">
                        <div className="w-4 h-4 border border-purple-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                        <p className="text-purple-400 text-xs">AI is evaluating your response...</p>
                      </div>
                    )}

                    {feedback[i] && !loadingFeedback[i] && (
                      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-purple-600 rounded-lg flex items-center justify-center text-xs">🤖</div>
                            <p className="text-xs font-semibold text-gray-300">AI Feedback</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getScoreStyle(feedback[i].score)}`}>
                              {feedback[i].grade}
                            </span>
                            <span className="text-white font-bold text-sm">{feedback[i].score}/100</span>
                          </div>
                        </div>
                        <div className="p-4 space-y-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1.5 font-medium">Feedback</p>
                            <p className="text-gray-300 text-sm leading-relaxed">{feedback[i].feedback_english}</p>
                          </div>
                          {feedback[i].corrections && feedback[i].corrections.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1.5 font-medium">Corrections</p>
                              <div className="space-y-1.5">
                                {feedback[i].corrections.map((correction, j) => (
                                  <div key={j} className="flex items-start gap-2">
                                    <span className="text-orange-400 text-xs flex-shrink-0 mt-0.5 font-bold">→</span>
                                    <p className="text-gray-400 text-xs leading-relaxed">{correction}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {feedback[i].encouragement && (
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                              <span className="text-sm">💪</span>
                              <p className="text-gray-400 text-xs italic">{feedback[i].encouragement}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                ) : isActive ? (
                  <div className="space-y-3">
                    <textarea
                      value={userResponse}
                      onChange={e => setUserResponse(e.target.value)}
                      placeholder={challenge.type === 'Speaking'
                        ? "Type what you would say out loud..."
                        : "Write your response here..."}
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none text-sm"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setActiveChallenge(null); setUserResponse('') }}
                        className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm font-medium transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSubmit(i)}
                        disabled={!userResponse.trim()}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-40"
                      >
                        Submit & Get AI Feedback
                      </button>
                    </div>
                  </div>

                ) : (
                  <button
                    onClick={() => { setActiveChallenge(i); setUserResponse('') }}
                    className="w-full border border-gray-700 hover:border-purple-600 hover:bg-purple-900 hover:bg-opacity-10 text-gray-300 hover:text-white py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
                  >
                    Start Challenge <span className="text-purple-400">→</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {/* All Completed */}
        {!generating && completedCount === 3 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-purple-900 bg-opacity-30 border border-purple-800 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🎉
            </div>
            <p className="text-xl font-bold text-white mb-2">All Challenges Completed</p>
            <p className="text-gray-400 text-sm mb-1">
              You earned <span className="text-purple-400 font-bold">75 XP</span> today
            </p>
            <p className="text-gray-600 text-xs mb-5">Come back tomorrow for new AI-generated challenges</p>
            <button
              onClick={handleNewChallenges}
              className="border border-gray-700 hover:border-purple-600 text-gray-400 hover:text-white px-5 py-2 rounded-xl text-sm font-medium transition"
            >
              🔄 Generate New Set
            </button>
          </div>
        )}

      </div>
    </Layout>
  )
}

export default DailyChallenge
