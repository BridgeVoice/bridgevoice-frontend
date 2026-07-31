import { useState } from 'react'
import Layout from '../components/Layout'
import { API_BASE, authFetch } from '../config'

function GrammarChecker() {
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const commonErrors = [
    { wrong: 'I am going to store', correct: 'I am going to the store', rule: 'Use "the" before specific places' },
    { wrong: 'She don\'t like coffee', correct: 'She doesn\'t like coffee', rule: 'Use "doesn\'t" with he/she/it' },
    { wrong: 'I have went there', correct: 'I have gone there', rule: 'Use past participle after "have"' },
    { wrong: 'He is more taller', correct: 'He is taller', rule: 'Don\'t use "more" with -er adjectives' },
    { wrong: 'I am boring', correct: 'I am bored', rule: 'Use -ed for feelings, -ing for things' },
    { wrong: 'Since 3 years', correct: 'For 3 years', rule: 'Use "for" with durations, "since" with specific times' },
  ]

  const checkGrammar = async () => {
    if (!inputText.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const response = await authFetch(`${API_BASE}/api/grammar`, {
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
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">✍️ Grammar Checker</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Type any sentence and get instant grammar corrections</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Type your sentence or paragraph:
          </label>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Example: I am going to store yesterday to buyed some milk..."
            rows={5}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={checkGrammar}
              disabled={loading || !inputText.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl transition disabled:opacity-50 font-semibold"
            >
              {loading ? 'Checking...' : '✅ Check Grammar'}
            </button>
            <button
              onClick={() => { setInputText(''); setResult(null) }}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-4 py-3 rounded-xl hover:border-gray-500 transition"
            >
              Clear
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-4 mb-8">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 dark:text-gray-200">✅ Corrected Version</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${
                    result.score >= 80 ? 'text-green-600 dark:text-green-400' :
                    result.score >= 60 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                  }`}>{result.score}%</span>
                  <button
                    onClick={() => speakText(result.corrected)}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    🔊
                  </button>
                </div>
              </div>
              <p className="text-gray-800 dark:text-gray-200 bg-green-100 dark:bg-green-900 dark:bg-opacity-20 border border-green-300 dark:border-green-800 rounded-xl p-4 leading-relaxed">
                {result.corrected}
              </p>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">❌ Errors Found ({result.errors.length})</h3>
                <div className="space-y-3">
                  {result.errors.map((error, i) => (
                    <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-gray-400 dark:hover:border-gray-600 transition">
                      <div className="flex gap-4 mb-2">
                        <span className="text-red-600 dark:text-red-400 line-through text-sm">{error.wrong}</span>
                        <span className="text-gray-400 dark:text-gray-600">→</span>
                        <span className="text-green-600 dark:text-green-400 font-medium text-sm">{error.correct}</span>
                      </div>
                      <p className="text-xs text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900 dark:bg-opacity-20 px-3 py-1 rounded-full inline-block">
                        📌 {error.rule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.feedback && (
              <div className="bg-purple-100 dark:bg-purple-900 dark:bg-opacity-20 border border-purple-300 dark:border-purple-800 rounded-2xl p-5">
                <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">💡 Overall Feedback</p>
                <p className="text-gray-600 dark:text-gray-400">{result.feedback}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">📚 Common Grammar Mistakes</h3>
          <p className="text-sm text-gray-500 mb-4">Click any example to load it into the checker!</p>
          <div className="space-y-3">
            {commonErrors.map((item, i) => (
              <div
                key={i}
                onClick={() => setInputText(item.wrong)}
                className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition"
              >
                <div className="flex gap-4 mb-1">
                  <span className="text-red-600 dark:text-red-400 line-through text-sm">❌ {item.wrong}</span>
                </div>
                <div className="flex gap-4 mb-2">
                  <span className="text-green-600 dark:text-green-400 font-medium text-sm">✅ {item.correct}</span>
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">📌 Rule: {item.rule}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default GrammarChecker