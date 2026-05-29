import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Dictionary() {
  const navigate = useNavigate()
  const [searchWord, setSearchWord] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedWords, setSavedWords] = useState([
    { word: 'Confident', meaning: 'Feeling sure about yourself', example: 'She was confident during the interview.' },
    { word: 'Fluent', meaning: 'Able to speak a language easily', example: 'He speaks fluent English.' },
    { word: 'Etiquette', meaning: 'Rules of polite behavior', example: 'Workplace etiquette is important in Canada.' },
  ])
  const [activeTab, setActiveTab] = useState('search')

  const wordOfTheDay = {
    word: 'Perseverance',
    pronunciation: '/ˌpɜːrsɪˈvɪərəns/',
    meaning: 'Continued effort to do something despite difficulty',
    example: 'Her perseverance helped her learn English in just 6 months.',
    tip: 'Use this word in job interviews to describe your work ethic!'
  }

  const searchDictionary = async () => {
    if (!searchWord.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`)
      const data = await response.json()

      if (response.ok && data.length > 0) {
        const entry = data[0]
        setResult({
          word: entry.word,
          phonetic: entry.phonetic || '',
          meanings: entry.meanings.slice(0, 2).map(m => ({
            partOfSpeech: m.partOfSpeech,
            definition: m.definitions[0].definition,
            example: m.definitions[0].example || ''
          }))
        })
      } else {
        setError('Word not found. Try another word!')
      }
    } catch (err) {
      setError('Could not connect. Please try again!')
    }
    setLoading(false)
  }

  const saveWord = () => {
    if (!result) return
    const alreadySaved = savedWords.find(w => w.word.toLowerCase() === result.word.toLowerCase())
    if (alreadySaved) return
    setSavedWords(prev => [...prev, {
      word: result.word,
      meaning: result.meanings[0].definition,
      example: result.meanings[0].example
    }])
  }

  const removeWord = (word) => {
    setSavedWords(prev => prev.filter(w => w.word !== word))
  }

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-US'
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen bg-[#EAF4EC]">

      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">BridgeVoice</h1>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
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
          <h2 className="text-2xl font-bold text-gray-700">📖 Dictionary</h2>
          <p className="text-gray-500">Search words, save vocabulary and learn pronunciation</p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white">
          <p className="text-sm font-medium text-blue-200 mb-1">✨ Word of the Day</p>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-3xl font-bold mb-1">{wordOfTheDay.word}</h3>
              <p className="text-blue-200 text-sm mb-2">{wordOfTheDay.pronunciation}</p>
              <p className="text-white mb-2">{wordOfTheDay.meaning}</p>
              <p className="text-blue-100 text-sm italic">"{wordOfTheDay.example}"</p>
              <p className="text-yellow-300 text-sm mt-2">💡 {wordOfTheDay.tip}</p>
            </div>
            <button
              onClick={() => speakWord(wordOfTheDay.word)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-full transition"
            >
              🔊
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['search', 'saved'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              {tab === 'search' ? '🔍 Search' : `📚 Saved (${savedWords.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'search' && (
          <div>
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={searchWord}
                onChange={e => setSearchWord(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && searchDictionary()}
                placeholder="Search any English word..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={() => speakWord(searchWord)}
                className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl hover:bg-gray-200 transition"
              >
                🔊
              </button>
              <button
                onClick={searchDictionary}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-medium"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            {result && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-700">{result.word}</h3>
                    {result.phonetic && (
                      <p className="text-gray-400 mt-1">{result.phonetic}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => speakWord(result.word)}
                      className="bg-blue-50 text-blue-600 p-3 rounded-xl hover:bg-blue-100 transition"
                    >
                      🔊
                    </button>
                    <button
                      onClick={saveWord}
                      className="bg-green-50 text-green-600 px-4 py-3 rounded-xl hover:bg-green-100 transition font-medium"
                    >
                      + Save
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {result.meanings.map((meaning, i) => (
                    <div key={i} className="border-l-4 border-blue-400 pl-4">
                      <p className="text-sm font-semibold text-blue-500 uppercase mb-1">{meaning.partOfSpeech}</p>
                      <p className="text-gray-700 mb-1">{meaning.definition}</p>
                      {meaning.example && (
                        <p className="text-gray-400 text-sm italic">"{meaning.example}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!result && !error && !loading && (
              <div className="text-center py-12">
                <p className="text-6xl mb-4">📖</p>
                <p className="text-gray-400">Search any word to see its meaning, pronunciation and examples</p>
                <div className="flex gap-2 justify-center mt-4 flex-wrap">
                  {['Perseverance', 'Etiquette', 'Confident', 'Fluent', 'Ambitious'].map(word => (
                    <button
                      key={word}
                      onClick={() => { setSearchWord(word); }}
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-100 transition"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            {savedWords.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-6xl mb-4">📚</p>
                <p className="text-gray-400">No saved words yet. Search and save words to build your vocabulary!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedWords.map((word, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-700">{word.word}</h4>
                        <button
                          onClick={() => speakWord(word.word)}
                          className="text-blue-400 hover:text-blue-600"
                        >
                          🔊
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm">{word.meaning}</p>
                      {word.example && (
                        <p className="text-gray-400 text-xs italic mt-1">"{word.example}"</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeWord(word.word)}
                      className="text-red-400 hover:text-red-600 ml-4"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default Dictionary