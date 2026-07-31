import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import CharacterAvatar from '../components/characters/CharacterAvatar'
import { getBrowserVoice, BROWSER_VOICE_SETTINGS } from '../utils/browserVoice'
import { useVoicePlayback } from '../utils/useVoicePlayback'
import { API_BASE, authFetch } from '../config'

function InterviewSimulator() {
  const navigate = useNavigate()
  // Identifies the user whose interview progress will be updated
  const email = localStorage.getItem('email')
  const [stage, setStage] = useState('intro')          // intro | loading | interview | scoring | feedback
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [listening, setListening] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [jobType, setJobType] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speakingWord, setSpeakingWord] = useState(false)
  // AI-generated questions for the selected job (loaded from the backend)
  const [aiQuestions, setAiQuestions] = useState([])
  // Shared voice control — owns audioRef/wordTimerRef and stops speech on unmount
  const { audioRef, wordTimerRef, stopSpeaking } = useVoicePlayback(() => {
    setIsSpeaking(false)
    setSpeakingWord(false)
  })

  const jobTypes = [
    { title: 'Software Developer', icon: '💻' },
    { title: 'Customer Service', icon: '🎧' },
    { title: 'Healthcare Worker', icon: '🏥' },
    { title: 'Teacher', icon: '📚' },
    { title: 'Accountant', icon: '💼' },
    { title: 'Retail Worker', icon: '🛒' },
    { title: 'Restaurant Worker', icon: '🍽️' },
    { title: 'Driver', icon: '🚗' },
    { title: 'Security Guard', icon: '🔒' },
    { title: 'Warehouse Worker', icon: '📦' },
    { title: 'Bank Teller', icon: '🏦' },
    { title: 'Real Estate Agent', icon: '🏠' },
    { title: 'Marketing Manager', icon: '📊' },
    { title: 'Construction Worker', icon: '🏗️' },
    { title: 'Electrician', icon: '⚡' },
    { title: 'Nurse', icon: '👩‍⚕️' },
    { title: 'Engineer', icon: '⚙️' },
    { title: 'Data Analyst', icon: '📈' },
    { title: 'Pharmacist', icon: '💊' },
    { title: 'Dentist', icon: '🦷' },
    { title: 'Lawyer', icon: '⚖️' },
    { title: 'Social Worker', icon: '🤝' },
    { title: 'Graphic Designer', icon: '🎨' },
    { title: 'Web Developer', icon: '🌐' },
    { title: 'Project Manager', icon: '📋' },
    { title: 'HR Manager', icon: '👥' },
    { title: 'Sales Representative', icon: '💰' },
    { title: 'Truck Driver', icon: '🚛' },
    { title: 'Plumber', icon: '🔧' },
    { title: 'Carpenter', icon: '🪚' },
    { title: 'Mechanic', icon: '🔩' },
    { title: 'Hair Stylist', icon: '✂️' },
    { title: 'Chef', icon: '👨‍🍳' },
    { title: 'Baker', icon: '🥐' },
    { title: 'Veterinarian', icon: '🐾' },
    { title: 'Physiotherapist', icon: '🏃' },
    { title: 'Psychologist', icon: '🧠' },
    { title: 'Financial Advisor', icon: '💵' },
    { title: 'Insurance Agent', icon: '📄' },
    { title: 'Travel Agent', icon: '✈️' },
    { title: 'Hotel Manager', icon: '🏨' },
    { title: 'Event Planner', icon: '🎉' },
    { title: 'Photographer', icon: '📷' },
    { title: 'Journalist', icon: '📰' },
    { title: 'Librarian', icon: '📖' },
    { title: 'Firefighter', icon: '🚒' },
    { title: 'Police Officer', icon: '👮' },
    { title: 'Paramedic', icon: '🚑' },
    { title: 'Childcare Worker', icon: '👶' },
    { title: 'Personal Trainer', icon: '💪' },
    { title: 'Cleaner', icon: '🧹' },
    { title: 'Landscaper', icon: '🌿' },
    { title: 'Painter', icon: '🖌️' },
    { title: 'Welder', icon: '🔥' },
    { title: 'Lab Technician', icon: '🔬' },
    { title: 'Radiologist', icon: '🩻' },
    { title: 'Dental Assistant', icon: '😁' },
    { title: 'Office Administrator', icon: '🗂️' },
    { title: 'Receptionist', icon: '📞' },
    { title: 'Supply Chain Manager', icon: '🏭' },
    { title: 'Quality Control', icon: '✅' },
  ]

  // Kept as an OFFLINE FALLBACK only — used if the backend or Groq is unavailable
  const fallbackQuestions = {
    'Software Developer': [
      'Tell me about yourself and your experience.',
      'What programming languages are you familiar with?',
      'Describe a challenging project you worked on.',
      'How do you stay updated with new technologies?',
      'Why do you want to work at our company?'
    ],
    'Customer Service': [
      'Tell me about yourself.',
      'How do you handle a difficult customer?',
      'Describe a time you went above and beyond for someone.',
      'How do you stay calm under pressure?',
      'Why do you want to work in customer service?'
    ],
    'Nurse': [
      'Tell me about your nursing experience.',
      'How do you prioritize tasks during a busy shift?',
      'Describe a difficult patient situation you handled.',
      'How do you communicate with doctors and other staff?',
      'Why did you choose nursing as a career?'
    ],
    'Teacher': [
      'Tell me about yourself and your teaching experience.',
      'How do you handle a disruptive student in class?',
      'Describe your teaching style.',
      'How do you support students with different learning needs?',
      'Why do you want to teach at our school?'
    ],
    'Chef': [
      'Tell me about your culinary experience.',
      'How do you handle a busy kitchen service?',
      'Describe your cooking style and specialties.',
      'How do you manage food safety and hygiene?',
      'How do you handle criticism about your food?'
    ],
    'default': [
      'Tell me about yourself.',
      'What are your greatest strengths?',
      'What is your biggest weakness?',
      'Why do you want this job?',
      'Where do you see yourself in 5 years?'
    ]
  }

  // Questions for the current interview: AI-generated if available, fallback otherwise
  const getQuestions = () =>
    aiQuestions.length > 0
      ? aiQuestions
      : (fallbackQuestions[jobType] || fallbackQuestions['default'])

  // Fetches AI-generated questions for the chosen job, then starts the interview
  const startInterview = async (job) => {
    stopSpeaking()
    setJobType(job)
    setStage('loading')
    setCurrentQuestion(0)
    setAnswers([])
    setCurrentAnswer('')
    setFeedback(null)

    let loadedQuestions = fallbackQuestions[job] || fallbackQuestions['default']

    try {
      const res = await authFetch(`${API_BASE}/api/interview/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_type: job }),
      })
      const data = await res.json()
      if (res.ok && Array.isArray(data.questions) && data.questions.length > 0) {
        loadedQuestions = data.questions
      }
    } catch {
      // Backend unreachable — keep the fallback questions
    }

    setAiQuestions(loadedQuestions)
    setStage('interview')
    speakQuestion(loadedQuestions[0])
  }

  const speakQuestion = async (text) => {
    // Stop any current speech (both Groq audio and browser speech)
    stopSpeaking()

    // Word-tap simulation for audio element
    const startTaps = () => {
      const tap = () => {
        setSpeakingWord(true)
        wordTimerRef.current = setTimeout(() => {
          setSpeakingWord(false)
          wordTimerRef.current = setTimeout(tap, 180)
        }, 160)
      }
      tap()
    }
    const stopTaps = () => { clearTimeout(wordTimerRef.current); setSpeakingWord(false) }

    try {
      const res = await authFetch(`${API_BASE}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Interview always uses the Professional character voice
        body: JSON.stringify({ text, personality: 'professional' }),
      })
      if (res.ok && res.status !== 204) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audioRef.current = audio
        audio.onplay = () => { setIsSpeaking(true); startTaps() }
        audio.onended = () => { setIsSpeaking(false); stopTaps(); URL.revokeObjectURL(url) }
        audio.onerror = () => { setIsSpeaking(false); stopTaps() }
        audio.play()
        return
      }
    } catch { /* fall through */ }

    // Browser fallback — Professional is female
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const genderedVoice = await getBrowserVoice(true)   // female
    const vs = BROWSER_VOICE_SETTINGS['professional']
    const utterance = new SpeechSynthesisUtterance(text)
    if (genderedVoice) utterance.voice = genderedVoice
    utterance.pitch = vs.pitch
    utterance.rate = vs.rate
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onboundary = (e) => {
      if (e.name !== 'word') return
      setSpeakingWord(true)
      clearTimeout(wordTimerRef.current)
      wordTimerRef.current = setTimeout(() => setSpeakingWord(false), 160)
    }
    utterance.onend = () => { setIsSpeaking(false); setSpeakingWord(false) }
    utterance.onerror = () => { setIsSpeaking(false); setSpeakingWord(false) }
    window.speechSynthesis.speak(utterance)
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Please use Google Chrome for speech recognition.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onresult = (event) => {
      setCurrentAnswer(event.results[0][0].transcript)
    }
    recognition.start()
  }

  const nextQuestion = () => {
    stopSpeaking()   // stop the interviewer mid-question when the user moves on
    const newAnswers = [...answers, {
      question: getQuestions()[currentQuestion],
      answer: currentAnswer
    }]
    setAnswers(newAnswers)
    setCurrentAnswer('')

    if (currentQuestion + 1 < getQuestions().length) {
      setCurrentQuestion(prev => prev + 1)
      speakQuestion(getQuestions()[currentQuestion + 1])
    } else {
      generateFeedback(newAnswers)
    }
  }

  // Saves one completed interview session to the user's progress
  const saveInterviewProgress = async (score) => {
    try {
      await authFetch(`${API_BASE}/api/users/complete-activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          xp_earned: 30,
        }),
      })

      await authFetch(`${API_BASE}/api/users/session-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          activity_name: `Interview - ${jobType}`,
          score,
          xp_earned: 30,
        }),
      })
    } catch (error) {
      console.error('Error saving interview progress:', error)
    }
  }

  // Sends all answers to the backend and gets real AI feedback
  const generateFeedback = async (allAnswers) => {
    stopSpeaking()
    setStage('scoring')

    try {
      const res = await authFetch(`${API_BASE}/api/interview/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_type: jobType,
          answers: allAnswers.map(a => ({ question: a.question, answer: a.answer })),
        }),
      })
      const data = await res.json()
      if (res.ok && Array.isArray(data.scores) && data.scores.length > 0) {

        // Saves the completed interview to the user's progress
        await saveInterviewProgress(data.avgScore)

        setFeedback({ scores: data.scores, avgScore: data.avgScore })
        setStage('feedback')
        return
      }
    } catch {
      // Backend unreachable — fall through to the simple offline scoring below
    }

    // OFFLINE FALLBACK — old length-based scoring so the demo never breaks
    const scores = allAnswers.map(a => ({
      question: a.question,
      answer: a.answer,
      score: a.answer.length > 50 ? Math.floor(Math.random() * 15) + 75 :
        a.answer.length > 20 ? Math.floor(Math.random() * 20) + 60 : 45,
      tip: a.answer.length > 50 ? 'Great detailed answer!' :
        a.answer.length > 20 ? 'Good answer, try to add more details.' :
          'Try to give longer, more detailed answers.'
    }))
    const avgScore = Math.floor(scores.reduce((a, b) => a + b.score, 0) / scores.length)

    // Saves interview progress even when using the offline fallback
    await saveInterviewProgress(avgScore)

    setFeedback({ scores, avgScore })
    setStage('feedback')
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">

        {stage === 'intro' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">💼 Interview Simulator</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Practice real job interview questions with AI feedback</p>
            </div>

            <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4">Select Job Type:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {jobTypes.map((job, i) => (
                <button
                  key={i}
                  onClick={() => startInterview(job.title)}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-lg transition group"
                >
                  <p className="text-3xl mb-2 group-hover:scale-110 transition">{job.icon}</p>
                  <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">{job.title}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === 'loading' && (
          <div className="text-center py-24">
            <CharacterAvatar
              personality="professional"
              isSpeaking={true}
              speakingWord={speakingWord}
              size={100}
              className="mx-auto mb-6"
            />
            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Preparing your interview...</p>
            <p className="text-gray-600 dark:text-gray-400">Alex is writing questions for a {jobType} position 📝</p>
          </div>
        )}

        {stage === 'interview' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">💼 Interview Simulator</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Job: {jobType}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-600 dark:text-gray-400 text-sm">Question {currentQuestion + 1} of {getQuestions().length}</p>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">{jobType}</p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestion) / getQuestions().length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700 rounded-2xl p-5 mb-6 flex gap-5 items-start text-white">
              {/* Professional coach avatar — always fixed for interviews */}
              <CharacterAvatar
                personality="professional"
                isSpeaking={isSpeaking}
                speakingWord={speakingWord}
                size={80}
                className="flex-shrink-0 mt-1"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-purple-300 mb-2">💼 Interviewer — Alex</p>
                <p className="text-xl font-medium text-white leading-snug">{getQuestions()[currentQuestion]}</p>
                <button
                  onClick={() => speakQuestion(getQuestions()[currentQuestion])}
                  className="mt-3 bg-white bg-opacity-10 hover:bg-opacity-20 px-3 py-1.5 rounded-lg text-sm transition text-white"
                >
                  🔊 Hear question again
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-6">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Your Answer:</p>
              <textarea
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer or use the microphone..."
                rows={4}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={startListening}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition font-medium ${listening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  🎤 {listening ? 'Listening...' : 'Speak Answer'}
                </button>

                <button
                  onClick={nextQuestion}
                  disabled={!currentAnswer.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-2 rounded-xl transition disabled:opacity-50 font-semibold"
                >
                  {currentQuestion + 1 === getQuestions().length ? 'Finish Interview 🎉' : 'Next Question →'}
                </button>
              </div>
            </div>

            <div className="bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-20 border border-yellow-300 dark:border-yellow-800 rounded-xl p-4">
              <p className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">💡 Tips:</p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Use the STAR method: Situation, Task, Action, Result</li>
                <li>• Speak clearly and at a moderate pace</li>
                <li>• Give specific examples from your experience</li>
                <li>• Stay positive and confident!</li>
              </ul>
            </div>
          </div>
        )}

        {stage === 'scoring' && (
          <div className="text-center py-24">
            <CharacterAvatar
              personality="professional"
              isSpeaking={true}
              speakingWord={speakingWord}
              size={100}
              className="mx-auto mb-6"
            />
            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Reviewing your answers...</p>
            <p className="text-gray-600 dark:text-gray-400">Alex is preparing your feedback 📋</p>
          </div>
        )}

        {stage === 'feedback' && feedback && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">💼 Interview Complete!</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Here's your performance feedback</p>
            </div>

            <div className="text-center mb-8">
              <p className="text-5xl mb-4">
                {feedback.avgScore >= 80 ? '🏆' : feedback.avgScore >= 60 ? '🌟' : '💪'}
              </p>
              <div className={`text-6xl font-bold ${feedback.avgScore >= 80 ? 'text-green-600 dark:text-green-400' :
                feedback.avgScore >= 60 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                }`}>
                {feedback.avgScore}%
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {feedback.avgScore >= 80 ? 'Excellent! You are interview ready! 🌟' :
                  feedback.avgScore >= 60 ? 'Good effort! Keep practicing! 💪' :
                    'Keep going! Practice makes perfect! 🎯'}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {feedback.scores.map((item, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Q{i + 1}: {item.question}</p>
                  <p className="text-gray-600 dark:text-gray-500 text-sm mb-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    Your answer: "{item.answer || 'No answer given'}"
                  </p>
                  <div className="flex justify-between items-center gap-4">
                    <p className="text-sm text-purple-600 dark:text-purple-400">{item.tip}</p>
                    <span className={`font-bold text-lg flex-shrink-0 ${item.score >= 80 ? 'text-green-600 dark:text-green-400' :
                      item.score >= 60 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                      }`}>{item.score}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => { stopSpeaking(); setAiQuestions([]); setStage('intro') }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl transition font-semibold"
              >
                Practice Again 🔄
              </button>
              <button
                onClick={() => { stopSpeaking(); navigate('/dashboard') }}
                className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-gray-500 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-3 rounded-xl transition font-semibold"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}

export default InterviewSimulator