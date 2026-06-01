import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#EAF4EC] flex flex-col">

      <nav className="flex justify-between items-center px-10 py-6 bg-[#EAF4EC]">
        <h1 className="text-2xl font-bold text-blue-600">BridgeVoice</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-full border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">

        <h2 className="text-6xl font-bold text-blue-600 mb-4">BridgeVoice</h2>
        <p className="text-2xl text-gray-600 mb-4">Your AI English Conversation Partner</p>
        <p className="max-w-2xl text-lg text-gray-500 leading-relaxed mb-8">
          Practice real English conversations with AI, build confidence, track your progress,
          and connect with other learners — all completely free!
        </p>

        <div className="flex gap-4 mb-16">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 rounded-full bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Start for Free 🚀
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 rounded-full border-2 border-blue-600 text-blue-600 text-lg font-semibold hover:bg-blue-50 transition"
          >
            Login
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-16">
          {[
            { icon: '🗣️', title: 'AI Conversations', desc: 'Practice real scenarios like job interviews, doctor visits, and everyday situations' },
            { icon: '🎤', title: 'Voice Practice', desc: 'Speak directly and get instant feedback on your pronunciation and confidence' },
            { icon: '📊', title: 'Track Progress', desc: 'See your improvement over time with detailed stats, streaks and achievements' },
            { icon: '🏆', title: 'Earn Badges', desc: 'Stay motivated with XP points, levels and badges as you improve' },
            { icon: '🌍', title: 'Built for Newcomers', desc: 'Designed specifically for newcomers to Canada building English confidence' },
            { icon: '💯', title: 'Completely Free', desc: 'All core features are free — no credit card required to get started' },
          ].map((feature, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <p className="text-4xl mb-3">{feature.icon}</p>
              <h3 className="font-bold text-gray-700 text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-600 rounded-2xl p-8 max-w-2xl w-full text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to build confidence?</h3>
          <p className="text-blue-100 mb-6">Join thousands of newcomers improving their English every day</p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3 rounded-full bg-white text-blue-600 font-bold hover:bg-blue-50 transition"
          >
            Create Free Account
          </button>
        </div>

      </main>

      <footer className="text-center py-6 text-gray-400 text-sm">
        © 2026 BridgeVoice — Built for newcomers to Canada 🍁
      </footer>

    </div>
  )
}

export default Home