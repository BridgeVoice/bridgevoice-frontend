import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import CharacterAvatar from '../components/characters/CharacterAvatar'
import { getCharacterById } from '../components/characters/characterData'
import { getCharacterPreference } from '../utils/characterPreference'
import { getBrowserVoice, BROWSER_VOICE_SETTINGS } from '../utils/browserVoice'
import { useVoicePlayback } from '../utils/useVoicePlayback'
import { API_BASE, authFetch } from '../config'

function Chat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your BridgeVoice AI conversation partner. I'm here to help you practice English. What scenario would you like to practice today? You can type or use the microphone button to speak!"
    }
  ])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [listening, setListening] = useState(false)
  const [scenario, setScenario] = useState('General Conversation')

  // Character state
  const [characterId]        = useState(() => getCharacterPreference())
  const character             = getCharacterById(characterId)
  const [isSpeaking, setIsSpeaking]     = useState(false)
  const [speakingWord, setSpeakingWord] = useState(false)
  // Shared voice control — owns audioRef/wordTimerRef and stops speech on unmount
  const { audioRef, wordTimerRef, stopSpeaking } = useVoicePlayback(() => {
    setIsSpeaking(false)
    setSpeakingWord(false)
  })

  const messagesEndRef  = useRef(null)
  const recognitionRef  = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Simulate word-boundary mouth taps for audio playback ──
  const startWordTaps = () => {
    const tap = () => {
      setSpeakingWord(true)
      wordTimerRef.current = setTimeout(() => {
        setSpeakingWord(false)
        wordTimerRef.current = setTimeout(tap, 180)
      }, 160)
    }
    tap()
  }
  const stopWordTaps = () => {
    clearTimeout(wordTimerRef.current)
    setSpeakingWord(false)
  }

  // ── Speak via Groq TTS, fall back to browser speech ──
  const speakText = async (text) => {
    // Stop any current speech (both Groq audio and browser speech)
    stopSpeaking()

    try {
      const res = await authFetch(`${API_BASE}/api/tts`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text, personality: characterId }),
      })

      if (res.ok && res.status !== 204) {
        // ── Groq Orpheus audio ──
        const blob  = await res.blob()
        const url   = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audioRef.current = audio
        audio.onplay  = () => { setIsSpeaking(true);  startWordTaps() }
        audio.onended = () => { setIsSpeaking(false); stopWordTaps(); URL.revokeObjectURL(url) }
        audio.onerror = () => { setIsSpeaking(false); stopWordTaps() }
        audio.play()
        return
      }
    } catch { /* fall through to browser TTS */ }

    // ── Browser speech fallback — picks a gendered voice by name ──
    if (!('speechSynthesis' in window)) return
    const isFemale    = ['happy', 'professional'].includes(characterId)
    const voiceSettings = BROWSER_VOICE_SETTINGS[characterId] || character.voice
    const genderedVoice = await getBrowserVoice(isFemale)

    const utterance   = new SpeechSynthesisUtterance(text)
    if (genderedVoice) utterance.voice = genderedVoice
    utterance.pitch   = voiceSettings.pitch
    utterance.rate    = voiceSettings.rate
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onboundary = (e) => {
      if (e.name !== 'word') return
      setSpeakingWord(true)
      clearTimeout(wordTimerRef.current)
      wordTimerRef.current = setTimeout(() => setSpeakingWord(false), 160)
    }
    utterance.onend   = () => { setIsSpeaking(false); setSpeakingWord(false) }
    utterance.onerror = () => { setIsSpeaking(false); setSpeakingWord(false) }
    window.speechSynthesis.speak(utterance)
  }

  // ── Send message to backend (includes personality for LLM tone) ──
  const sendMessage = async (text) => {
    if (!text.trim()) return
    stopSpeaking()   // stop the coach mid-sentence when the user sends a new message
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)

    try {
      const response = await authFetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, scenario, personality: characterId })
      })
      const data = await response.json()
      const aiReply = data.reply || "I'm sorry, I couldn't understand that. Could you try again?"
      setMessages(prev => [...prev, { role: 'assistant', content: aiReply }])
      speakText(aiReply)
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your connection and try again!"
      }])
    }
    setLoading(false)
  }

  // ── Microphone / speech recognition ──
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Please use Google Chrome for speech recognition.')
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SR()
    recognitionRef.current.continuous     = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang           = 'en-US'
    recognitionRef.current.onstart  = () => setListening(true)
    recognitionRef.current.onend    = () => setListening(false)
    recognitionRef.current.onresult = (e) => sendMessage(e.results[0][0].transcript)
    recognitionRef.current.onerror  = () => { setListening(false); alert('Could not hear you. Please try again.') }
    recognitionRef.current.start()
  }

  const stopListening = () => { recognitionRef.current?.stop(); setListening(false) }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto flex flex-col gap-4">

        <div>
          <h2 className="text-2xl font-bold">🗣️ AI Conversation</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Practice English with your AI conversation partner</p>
        </div>

        {/* ── Coach panel ── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-5">
          <CharacterAvatar
            personality={character.id}
            isSpeaking={isSpeaking}
            speakingWord={speakingWord}
            size={80}
            className="flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {character.emoji} {character.name} is your coach
            </p>
            <p className="text-xs mt-0.5" style={{ color: character.accentColor }}>
              {character.tagline}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              The AI will reply in {character.name}'s style. &nbsp;
              <Link to="/settings" onClick={stopSpeaking} className="text-purple-600 dark:text-purple-400 hover:underline">Change character →</Link>
            </p>
          </div>
          {isSpeaking && (
            <div className="flex gap-0.5 items-end h-6 flex-shrink-0">
              {[0, 70, 140, 210, 280].map(d => (
                <div
                  key={d}
                  className="w-1 rounded-full animate-bounce"
                  style={{ backgroundColor: character.accentColor, animationDelay: `${d}ms`, height: `${12 + (d / 280) * 12}px` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Scenario selector ── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">Select Scenario:</p>
          <div className="flex gap-2 flex-wrap">
            {['General Conversation', 'Job Interview', 'Grocery Store', 'Doctor Visit', 'Bank Visit', 'Workplace Chat'].map(s => (
              <button
                key={s}
                onClick={() => { stopSpeaking(); setScenario(s) }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  scenario === s
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Chat window ── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col" style={{ minHeight: '400px' }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '450px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-200 dark:border-gray-700'
                }`}>
                  {msg.role === 'assistant' && (
                    <p className="text-xs font-semibold mb-1" style={{ color: character.accentColor }}>
                      {character.emoji} {character.name}
                    </p>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="flex gap-2 items-center">
              <button
                onClick={listening ? stopListening : startListening}
                className={`p-3 rounded-full transition ${
                  listening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                🎤
              </button>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={listening ? '🎤 Listening...' : 'Type your message or click 🎤 to speak...'}
                disabled={listening || loading}
                className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition text-sm"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl transition disabled:opacity-50 font-medium text-sm"
              >
                Send
              </button>
            </div>
            {listening && (
              <p className="text-center text-red-500 dark:text-red-400 text-xs mt-2 animate-pulse">
                🔴 Listening... speak now!
              </p>
            )}
          </div>
        </div>

        {/* ── Quick phrases ── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">💡 Quick Phrases:</p>
          <div className="flex gap-2 flex-wrap">
            {['Hello, nice to meet you!', 'Could you repeat that?', "I don't understand", 'Can you speak slower?'].map(phrase => (
              <button
                key={phrase}
                onClick={() => sendMessage(phrase)}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-1 rounded-full text-xs transition border border-gray-300 dark:border-gray-700"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default Chat