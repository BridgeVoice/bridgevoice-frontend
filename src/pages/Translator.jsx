import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

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
    <div className="min-h-screen bg-[#EAF4EC]">

      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">BridgeVoice</h1>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
          <Link to="/dictionary" className="text-gray-600 hover:text-blue-600 font-medium">Dictionary</Link>
          <Link to="/progress" className="text-gray-600 hover:text-blue-600 font-medium">Progress</Link>
          <Link to="/profile" className="text-gray-600 hover:text-blue-600 font-medium">Profile</Link>
          <button
            onClick={() => { localStorage.clear(); navigate('/') }}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-700">🌍 Translator</h2>
          <p className="text-gray-500">Translate between English and your native language instantly</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <select
              value={fromLang}
              onChange={e => setFromLang(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="auto">Auto Detect</option>
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>

            <button
              onClick={swapLanguages}
              className="bg-blue-50 text-blue-600 p-3 rounded-xl hover:bg-blue-100 transition text-xl"
            >
              ⇄
            </button>

            <select
              value={toLang}
              onChange={e => setToLang(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
              <button
                onClick={() => speakText(inputText, fromLang)}
                className="absolute bottom-3 right-3 text-gray-400 hover:text-blue-600"
              >
                🔊
              </button>
            </div>

            <div className="relative bg-gray-50 rounded-xl p-4 min-h-32">
              {loading ? (
                <p className="text-gray-400 animate-pulse">Translating...</p>
              ) : (
                <p className="text-gray-700">{translatedText || 'Translation will appear here...'}</p>
              )}
              {translatedText && (
                <button
                  onClick={() => speakText(translatedText, toLang)}
                  className="absolute bottom-3 right-3 text-gray-400 hover:text-blue-600"
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
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
            >
              {loading ? 'Translating...' : 'Translate'}
            </button>
            {translatedText && (
              <button
                onClick={() => navigator.clipboard.writeText(translatedText)}
                className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl hover:bg-gray-200 transition"
              >
                📋 Copy
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-700 mb-4">💬 Common Phrases for Newcomers</h3>
          <div className="space-y-3">
            {commonPhrases.map((phrase, i) => (
              <div
                key={i}
                className="flex justify-between items-center border border-gray-100 rounded-xl p-4 hover:bg-blue-50 transition cursor-pointer"
                onClick={() => setInputText(phrase.english)}
              >
                <div>
                  <p className="font-medium text-gray-700">{phrase.english}</p>
                  <p className="text-xs text-blue-500 mt-1">{phrase.context}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); speakText(phrase.english, 'en') }}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    🔊
                  </button>
                  <span className="text-gray-300">→</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">Click any phrase to translate it instantly!</p>
        </div>

      </div>
    </div>
  )
}

export default Translator