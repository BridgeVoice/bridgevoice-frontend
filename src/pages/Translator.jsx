import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../assets/logo'

function Translator() {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [fromLang, setFromLang] = useState('auto')
  const [toLang, setToLang] = useState('en')
  const [loading, setLoading] = useState(false)

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'zh', name: 'Mandarin' },
    { code: 'ar', name: 'Arabic' },
    { code: 'es', name: 'Spanish' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'fr', name: 'French' },
    { code: 'tl', name: 'Tagalog' },
    { code: 'ur', name: 'Urdu' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ja', name: 'Japanese' },
  ]

  const commonPhrases = [
    { english: 'How are you?', context: 'Greeting' },
    { english: 'Can you help me please?', context: 'Asking for help' },
    { english: 'Where is the nearest hospital?', context: 'Emergency' },
    { english: 'How much does this cost?', context: 'Shopping' },
    { english: 'I would like to apply for this job.', context: 'Job' },
    { english: 'Could you repeat that please?', context: 'Conversation' },
  ]

  const translate = async () => {
    if (!inputText.trim()) return
    setLoading(true)
    setTranslatedText('')
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(inputText)}`
      )
      const data = await response.json()
      const translated = data[0].map(item => item[0]).join('')
      setTranslatedText(translated)
    } catch (err) {
      setTranslatedText('Could not connect. Please try again!')
    }
    setLoading(false)
  }

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      window.speechSynthesis.speak(utterance)
    }
  }

  const swapLanguages = () => {
    setFromLang(toLang)
    setToLang(fromLang)
    setInputText(translatedText)
    setTranslatedText(inputText)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo size={18} />
          <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">BridgeVoice</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-400 hover:text-white transition text-sm">Dashboard</Link>
          <button
            onClick={() => { localStorage.clear(); navigate('/') }}
            className="bg-red-900 bg-opacity-50 hover:bg-opacity-80 text-red-400 px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">🌍 Translator</h2>
          <p className="text-gray-400 mt-1">Translate between English and your native language instantly</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <select
              value={fromLang}
              onChange={e => setFromLang(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition"
            >
              <option value="auto">Auto Detect</option>
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>

            <button
              onClick={swapLanguages}
              className="bg-gray-800 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white p-3 rounded-xl transition text-xl"
            >
              ⇄
            </button>

            <select
              value={toLang}
              onChange={e => setToLang(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type text to translate..."
                rows={5}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none"
              />
              <button
                onClick={() => speakText(inputText, fromLang)}
                className="absolute bottom-3 right-3 text-gray-500 hover:text-purple-400 transition"
              >
                🔊
              </button>
            </div>

            <div className="relative bg-gray-800 border border-gray-700 rounded-xl p-4 min-h-32">
              {loading ? (
                <p className="text-gray-500 animate-pulse">Translating...</p>
              ) : (
                <p className="text-gray-200">{translatedText || 'Translation will appear here...'}</p>
              )}
              {translatedText && (
                <button
                  onClick={() => speakText(translatedText, toLang)}
                  className="absolute bottom-3 right-3 text-gray-500 hover:text-purple-400 transition"
                >
                  🔊
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={translate}
              disabled={loading || !inputText.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl transition disabled:opacity-50 font-semibold"
            >
              {loading ? 'Translating...' : 'Translate'}
            </button>
            {translatedText && (
              <button
                onClick={() => navigator.clipboard.writeText(translatedText)}
                className="bg-gray-800 border border-gray-700 text-gray-400 hover:text-white px-4 py-3 rounded-xl hover:border-gray-500 transition"
              >
                📋 Copy
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="font-bold text-gray-200 mb-4">💬 Common Phrases for Newcomers</h3>
          <div className="space-y-3">
            {commonPhrases.map((phrase, i) => (
              <div
                key={i}
                className="flex justify-between items-center border border-gray-800 rounded-xl p-4 hover:border-gray-600 hover:bg-gray-800 transition cursor-pointer"
                onClick={() => setInputText(phrase.english)}
              >
                <div>
                  <p className="font-medium text-gray-200">{phrase.english}</p>
                  <p className="text-xs text-purple-400 mt-1">{phrase.context}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); speakText(phrase.english, 'en') }}
                    className="text-gray-500 hover:text-purple-400 transition"
                  >
                    🔊
                  </button>
                  <span className="text-gray-700">→</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-4 text-center">Click any phrase to translate it instantly!</p>
        </div>

      </div>
    </div>
  )
}

export default Translator