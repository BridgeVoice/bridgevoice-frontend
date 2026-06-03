import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../assets/logo'

function Phrases() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('workplace')
  const [expandedPhrase, setExpandedPhrase] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'workplace', icon: '🏢', title: 'Workplace' },
    { id: 'social', icon: '🤝', title: 'Social' },
    { id: 'canadian', icon: '🍁', title: 'Canadian' },
    { id: 'interview', icon: '💼', title: 'Interview' },
    { id: 'daily', icon: '☀️', title: 'Daily Life' },
    { id: 'slang', icon: '😎', title: 'Slang' },
  ]

  const phrases = {
    workplace: [
      { phrase: 'Touch base', meaning: 'To make contact or check in with someone', example: 'Let\'s touch base tomorrow to discuss the project.', tip: 'Use this when you want to have a quick meeting or call.' },
      { phrase: 'On the same page', meaning: 'Everyone understands and agrees on something', example: 'Before we start, let\'s make sure we\'re all on the same page.', tip: 'Very common in meetings and team discussions.' },
      { phrase: 'Give me a heads up', meaning: 'Warn or inform someone in advance', example: 'Give me a heads up before the client arrives.', tip: 'Use this to ask someone to notify you early.' },
      { phrase: 'Circle back', meaning: 'Return to a topic or person later', example: 'Let\'s circle back to this issue after the meeting.', tip: 'Common way to say you\'ll discuss something later.' },
      { phrase: 'Take it offline', meaning: 'Discuss something privately outside the meeting', example: 'This is a detailed topic — let\'s take it offline.', tip: 'Use when a topic needs more time than the meeting allows.' },
      { phrase: 'Bandwidth', meaning: 'The capacity or time someone has to do work', example: 'Do you have the bandwidth to take on this project?', tip: 'Used to ask if someone has enough time or energy.' },
      { phrase: 'Low hanging fruit', meaning: 'Easy tasks or goals that can be achieved quickly', example: 'Let\'s tackle the low hanging fruit first.', tip: 'Use when suggesting starting with the easiest tasks.' },
      { phrase: 'Move the needle', meaning: 'To make a noticeable difference or progress', example: 'We need a strategy that will really move the needle.', tip: 'Common in business discussions about results.' },
      { phrase: 'Deep dive', meaning: 'A thorough examination of a subject', example: 'Let\'s do a deep dive into the sales data.', tip: 'Use when you want to analyze something in detail.' },
      { phrase: 'Action item', meaning: 'A task that someone needs to complete', example: 'The action item from today\'s meeting is to send the report.', tip: 'Very common in meetings and emails.' },
    ],
    social: [
      { phrase: 'How\'s it going?', meaning: 'A casual greeting asking how you are', example: 'Hey! How\'s it going?', tip: 'More casual than "How are you?" — very common in Canada.' },
      { phrase: 'No worries', meaning: 'It\'s okay, don\'t be concerned', example: 'Sorry I\'m late! — No worries, we just started!', tip: 'Canadians use this constantly instead of "you\'re welcome".' },
      { phrase: 'For sure', meaning: 'Definitely, absolutely', example: 'Are you coming to the party? For sure!', tip: 'Very Canadian way to say yes enthusiastically.' },
      { phrase: 'Hang out', meaning: 'Spend time with someone casually', example: 'Want to hang out this weekend?', tip: 'Use when inviting friends to spend time together.' },
      { phrase: 'My bad', meaning: 'My mistake, I apologize', example: 'Oh my bad, I forgot to text you!', tip: 'Very casual way to apologize.' },
      { phrase: 'Rain check', meaning: 'Postpone plans to do something later', example: 'I can\'t make it tonight — can I take a rain check?', tip: 'Use when you can\'t attend something but want to reschedule.' },
      { phrase: 'Catch up', meaning: 'Talk with someone you haven\'t seen in a while', example: 'We should catch up over coffee sometime!', tip: 'Very common when reconnecting with old friends.' },
    ],
    canadian: [
      { phrase: 'Double double', meaning: 'Coffee with two creams and two sugars at Tim Hortons', example: 'I\'ll have a double double please.', tip: 'Ordering this makes you sound like a true Canadian!' },
      { phrase: 'Toque', meaning: 'A warm knitted hat worn in winter', example: 'Don\'t forget your toque — it\'s freezing outside!', tip: 'Pronounced "TOOOK". Every Canadian owns one!' },
      { phrase: 'Eh?', meaning: 'A question tag meaning "right?" or "don\'t you think?"', example: 'Great game last night, eh?', tip: 'The most famous Canadian expression!' },
      { phrase: 'Loonie and Toonie', meaning: 'Canadian one dollar and two dollar coins', example: 'Do you have a loonie for the parking meter?', tip: 'Loonie = $1 coin, Toonie = $2 coin.' },
      { phrase: 'Hydro', meaning: 'Electricity or the electricity bill', example: 'Did you pay the hydro bill this month?', tip: 'Canadians call electricity "hydro" — don\'t be confused!' },
      { phrase: 'Pop', meaning: 'Carbonated soft drink (soda)', example: 'Can I get a pop with my meal?', tip: 'Canadians say "pop" not "soda"!' },
      { phrase: 'Kerfuffle', meaning: 'A commotion or fuss about something', example: 'There was a big kerfuffle at the office today.', tip: 'Very Canadian word for a small dramatic situation.' },
    ],
    interview: [
      { phrase: 'I\'m a team player', meaning: 'I work well with others', example: 'I consider myself a team player who communicates openly.', tip: 'Almost every interviewer expects to hear this!' },
      { phrase: 'Outside the box', meaning: 'Thinking creatively and differently', example: 'I like to think outside the box to find new solutions.', tip: 'Shows creativity and problem-solving skills.' },
      { phrase: 'Track record', meaning: 'History of past achievements or performance', example: 'I have a strong track record of meeting deadlines.', tip: 'Use to talk about your past work achievements.' },
      { phrase: 'Hit the ground running', meaning: 'Start something quickly and energetically', example: 'I\'m ready to hit the ground running from day one.', tip: 'Shows enthusiasm and readiness to start immediately.' },
      { phrase: 'Self-starter', meaning: 'Someone who works independently without being told', example: 'I\'m a self-starter who takes initiative on projects.', tip: 'Shows you don\'t need constant supervision.' },
      { phrase: 'People person', meaning: 'Someone who enjoys working with and talking to others', example: 'I\'m a people person who loves building relationships.', tip: 'Great for customer service and team roles.' },
      { phrase: 'Wear many hats', meaning: 'Handle many different responsibilities', example: 'I\'m comfortable wearing many hats in a small team.', tip: 'Shows flexibility and willingness to do various tasks.' },
    ],
    daily: [
      { phrase: 'Bear with me', meaning: 'Please be patient with me', example: 'Bear with me while I find the right document.', tip: 'Very polite way to ask for patience.' },
      { phrase: 'In a nutshell', meaning: 'To summarize briefly', example: 'In a nutshell, we need to improve our service.', tip: 'Use when giving a quick summary.' },
      { phrase: 'On the fence', meaning: 'Undecided or neutral about something', example: 'I\'m still on the fence about which apartment to choose.', tip: 'Use when you haven\'t made a decision yet.' },
      { phrase: 'Under the weather', meaning: 'Feeling sick or unwell', example: 'I\'m feeling a bit under the weather today.', tip: 'Polite way to say you\'re sick without details.' },
      { phrase: 'Cost an arm and a leg', meaning: 'Very expensive', example: 'That apartment costs an arm and a leg!', tip: 'Very common expression for expensive things.' },
      { phrase: 'Once in a blue moon', meaning: 'Very rarely', example: 'We only go out for dinner once in a blue moon.', tip: 'Use to describe something that happens very rarely.' },
    ],
    slang: [
      { phrase: 'Lit', meaning: 'Exciting, amazing, or fun', example: 'That concert was absolutely lit!', tip: 'Popular among younger Canadians.' },
      { phrase: 'Vibe', meaning: 'The feeling or atmosphere of something', example: 'This coffee shop has a really good vibe.', tip: 'Used to describe atmosphere or someone\'s energy.' },
      { phrase: 'GOAT', meaning: 'Greatest Of All Time', example: 'Wayne Gretzky is the GOAT of hockey.', tip: 'Used to praise someone as the absolute best.' },
      { phrase: 'Lowkey', meaning: 'Secretly or quietly, not making a big deal', example: 'I lowkey love Tim Hortons coffee.', tip: 'Use when admitting something casually.' },
      { phrase: 'No cap', meaning: 'I\'m not lying, I\'m being serious', example: 'That was the best poutine I\'ve ever had, no cap.', tip: 'Use to emphasize you\'re telling the truth.' },
      { phrase: 'Ghosting', meaning: 'Suddenly stopping all communication with someone', example: 'He just ghosted me after three dates!', tip: 'Very common in dating and social media context.' },
    ]
  }

  const phraseOfTheDay = {
    phrase: 'Hit the ground running',
    meaning: 'Start something quickly and with great energy',
    example: 'I want someone who can hit the ground running from day one.',
    tip: 'Use this in job interviews to show you are ready to start immediately!'
  }

  const allPhrases = Object.values(phrases).flat()
  const filteredPhrases = searchTerm
    ? allPhrases.filter(p =>
        p.phrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.meaning.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : phrases[activeCategory]

  const speakPhrase = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
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
          <h2 className="text-2xl font-bold">💬 English Phrases</h2>
          <p className="text-gray-400 mt-1">Learn Canadian idioms, slang and professional phrases</p>
        </div>

        <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700 rounded-2xl p-6 mb-8">
          <p className="text-sm font-medium text-purple-300 mb-1">💡 Phrase of the Day</p>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold mb-1">"{phraseOfTheDay.phrase}"</h3>
              <p className="text-gray-300 mb-2">{phraseOfTheDay.meaning}</p>
              <p className="text-gray-400 italic text-sm">"{phraseOfTheDay.example}"</p>
              <p className="text-yellow-400 text-sm mt-2">💡 {phraseOfTheDay.tip}</p>
            </div>
            <button
              onClick={() => speakPhrase(phraseOfTheDay.phrase)}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 p-3 rounded-full transition"
            >
              🔊
            </button>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search any phrase or idiom..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {!searchTerm && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setExpandedPhrase(null) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition font-medium text-sm ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {cat.icon} {cat.title}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {filteredPhrases.map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition">
              <button
                onClick={() => setExpandedPhrase(expandedPhrase === i ? null : i)}
                className="w-full text-left px-6 py-4 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); speakPhrase(item.phrase) }}
                    className="text-gray-500 hover:text-purple-400 transition"
                  >
                    🔊
                  </button>
                  <p className="font-semibold text-gray-200">"{item.phrase}"</p>
                </div>
                <span className="text-gray-600 text-xl">{expandedPhrase === i ? '−' : '+'}</span>
              </button>

              {expandedPhrase === i && (
                <div className="px-6 pb-5 border-t border-gray-800">
                  <p className="text-gray-400 my-3">{item.meaning}</p>
                  <div className="bg-gray-800 rounded-xl px-4 py-3 mb-3">
                    <p className="text-sm font-semibold text-purple-400 mb-1">Example:</p>
                    <p className="text-gray-300 italic">"{item.example}"</p>
                    <button
                      onClick={() => speakPhrase(item.example)}
                      className="text-gray-500 hover:text-purple-400 text-sm mt-2 transition"
                    >
                      🔊 Hear example
                    </button>
                  </div>
                  <div className="bg-yellow-900 bg-opacity-20 border border-yellow-800 rounded-xl px-4 py-3">
                    <p className="text-sm font-semibold text-yellow-400 mb-1">💡 When to use it:</p>
                    <p className="text-sm text-gray-400">{item.tip}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredPhrases.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500">No phrases found for "{searchTerm}"</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Phrases