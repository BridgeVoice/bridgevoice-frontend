import { useState } from 'react'
import Layout from '../components/Layout'

function Dictionary() {
  // const navigate = useNavigate()
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
      <Layout>
    {/* // <div className="min-h-screen bg-gray-950 text-white"> */}

    {/* //   <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
    //     <div className="flex items-center gap-2">
    //       <Logo size={18} />
    //       <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">BridgeVoice</h1>
    //     </div>
    //     <div className="flex items-center gap-4">
    //       <Link to="/dashboard" className="text-gray-400 hover:text-white transition text-sm">Dashboard</Link>
    //       <button
    //         onClick={() => { localStorage.clear(); navigate('/') }}
    //         className="bg-red-900 bg-opacity-50 hover:bg-opacity-80 text-red-400 px-4 py-2 rounded-lg text-sm transition"
    //       >
    //         Logout
    //       </button>
    //     </div>
    //   </nav> */}

      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">📖 Dictionary</h2>
          <p className="text-gray-400 mt-1">Search words, save vocabulary and learn pronunciation</p>
        </div>

        <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700 rounded-2xl p-6 mb-8">
          <p className="text-sm font-medium text-purple-300 mb-1">✨ Word of the Day</p>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-3xl font-bold mb-1">{wordOfTheDay.word}</h3>
              <p className="text-purple-300 text-sm mb-2">{wordOfTheDay.pronunciation}</p>
              <p className="text-gray-200 mb-2">{wordOfTheDay.meaning}</p>
              <p className="text-gray-400 text-sm italic">"{wordOfTheDay.example}"</p>
              <p className="text-yellow-400 text-sm mt-2">💡 {wordOfTheDay.tip}</p>
            </div>
            <button
              onClick={() => speakWord(wordOfTheDay.word)}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 p-3 rounded-full transition"
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
              className={`px-4 py-2 rounded-xl font-medium capitalize transition text-sm ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
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
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              />
              <button
                onClick={() => speakWord(searchWord)}
                className="bg-gray-900 border border-gray-700 text-gray-400 px-4 py-3 rounded-xl hover:border-gray-500 hover:text-white transition"
              >
                🔊
              </button>
              <button
                onClick={searchDictionary}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl transition disabled:opacity-50 font-medium"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {error && (
              <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-400 px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            {result && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-3xl font-bold text-white">{result.word}</h3>
                    {result.phonetic && (
                      <p className="text-gray-400 mt-1">{result.phonetic}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => speakWord(result.word)}
                      className="bg-gray-800 text-gray-300 p-3 rounded-xl hover:bg-gray-700 transition"
                    >
                      🔊
                    </button>
                    <button
                      onClick={saveWord}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-xl transition font-medium text-sm"
                    >
                      + Save
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {result.meanings.map((meaning, i) => (
                    <div key={i} className="border-l-4 border-purple-500 pl-4">
                      <p className="text-sm font-semibold text-purple-400 uppercase mb-1">{meaning.partOfSpeech}</p>
                      <p className="text-gray-200 mb-1">{meaning.definition}</p>
                      {meaning.example && (
                        <p className="text-gray-500 text-sm italic">"{meaning.example}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!result && !error && !loading && (
              <div className="text-center py-12">
                <p className="text-6xl mb-4">📖</p>
                <p className="text-gray-500">Search any word to see its meaning and pronunciation</p>
                <div className="flex gap-2 justify-center mt-4 flex-wrap">
                  {['Perseverance', 'Etiquette', 'Confident', 'Fluent', 'Ambitious'].map(word => (
                    <button
                      key={word}
                      onClick={() => setSearchWord(word)}
                      className="bg-gray-900 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 px-3 py-1 rounded-full text-sm transition"
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
                <p className="text-gray-500">No saved words yet. Search and save words to build your vocabulary!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedWords.map((word, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex justify-between items-start hover:border-gray-600 transition">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white">{word.word}</h4>
                        <button
                          onClick={() => speakWord(word.word)}
                          className="text-gray-500 hover:text-purple-400 transition"
                        >
                          🔊
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm">{word.meaning}</p>
                      {word.example && (
                        <p className="text-gray-600 text-xs italic mt-1">"{word.example}"</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeWord(word.word)}
                      className="text-gray-600 hover:text-red-400 ml-4 transition"
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
    </Layout>
    // {/* // </div> */}
  )
}

export default Dictionary