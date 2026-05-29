import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function GrammarChecker() {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const commonErrors = [
    {
      wrong: 'I am going to store',
      correct: 'I am going to the store',
      rule: 'Use "the" before specific places'
    },
    {
      wrong: 'She don\'t like coffee',
      correct: 'She doesn\'t like coffee',
      rule: 'Use "doesn\'t" with he/she/it'
    },
    {
      wrong: 'I have went there',
      correct: 'I have gone there',
      rule: 'Use past participle after "have"'
    },
    {
      wrong: 'He is more taller',
      correct: 'He is taller',
      rule: 'Don\'t use "more" with -er adjectives'
    },
    {
      wrong: 'I am boring',
      correct: 'I am bored',
      rule: 'Use -ed for feelings, -ing for things'
    },
    {
      wrong: 'Since 3 years',
      correct: 'For 3 years',
      rule: 'Use "for" with durations, "since" with specific times'
    },
  ]

  const checkGrammar = async () => {
    if (!inputText.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      })
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setResult({
        corrected: inputText,
        errors: [],
        score: 100,
        feedback: 'Could not connect to server. Please make sure backend is running.'
      })
    }
    setLoading(false)
  }

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen bg-[#EAF4EC]">

      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">BridgeVoice</h1>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
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
          <h2 className="text-2xl font-bold text-gray-700">✍️ Grammar Checker</h2>
          <p className="text-gray-500">Type any sentence and get instant grammar corrections and explanations</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type your sentence or paragraph:
          </label>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Example: I am going to store yesterday to buyed some milk..."
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={checkGrammar}
              disabled={loading || !inputText.trim()}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
            >
              {loading ? 'Checking...' : '✅ Check Grammar'}
            </button>
            <button
              onClick={() => { setInputText(''); setResult(null) }}
              className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl hover:bg-gray-200 transition"
            >
              Clear
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-4 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700">✅ Corrected Version</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${
                    result.score >= 80 ? 'text-green-600' :
                    result.score >= 60 ? 'text-orange-500' : 'text-red-500'
                  }`}>{result.score}%</span>
                  <button
                    onClick={() => speakText(result.corrected)}
                    className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100"
                  >
                    🔊
                  </button>
                </div>
              </div>
              <p className="text-gray-700 bg-green-50 border border-green-200 rounded-xl p-4 leading-relaxed">
                {result.corrected}
              </p>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-gray-700 mb-4">❌ Errors Found ({result.errors.length})</h3>
                <div className="space-y-3">
                  {result.errors.map((error, i) => (
                    <div key={i} className="border border-red-100 rounded-xl p-4">
                      <div className="flex gap-4 mb-2">
                        <span className="text-red-500 line-through text-sm">{error.wrong}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-green-600 font-medium text-sm">{error.correct}</span>
                      </div>
                      <p className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                        📌 {error.rule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.feedback && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <p className="font-semibold text-blue-700 mb-2">💡 Overall Feedback</p>
                <p className="text-gray-600">{result.feedback}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-700 mb-4">📚 Common Grammar Mistakes</h3>
          <p className="text-sm text-gray-400 mb-4">Click any example to load it into the checker!</p>
          <div className="space-y-3">
            {commonErrors.map((item, i) => (
              <div
                key={i}
                onClick={() => setInputText(item.wrong)}
                className="border border-gray-100 rounded-xl p-4 hover:bg-blue-50 cursor-pointer transition"
              >
                <div className="flex gap-4 mb-1">
                  <span className="text-red-500 line-through text-sm">❌ {item.wrong}</span>
                </div>
                <div className="flex gap-4 mb-2">
                  <span className="text-green-600 font-medium text-sm">✅ {item.correct}</span>
                </div>
                <p className="text-xs text-blue-600">📌 Rule: {item.rule}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default GrammarChecker