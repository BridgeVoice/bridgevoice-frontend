import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../assets/logo'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [streak, setStreak] = useState(7)
  const [xp, setXp] = useState(340)
  const [level, setLevel] = useState('Intermediate')

  useEffect(() => {
    const email = localStorage.getItem('email')
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetch(`http://127.0.0.1:8000/api/users/profile?email=${email}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.log(err))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    navigate('/')
  }

  const scenarios = [
    { title: 'Job Interview', icon: '💼', desc: 'Practice interview questions', color: 'from-purple-600 to-purple-800' },
    { title: 'Grocery Store', icon: '🛒', desc: 'Everyday shopping vocabulary', color: 'from-blue-600 to-blue-800' },
    { title: 'Doctor Visit', icon: '🏥', desc: 'Medical conversations', color: 'from-red-600 to-red-800' },
    { title: 'Bank Visit', icon: '🏦', desc: 'Banking conversations', color: 'from-yellow-600 to-yellow-800' },
    { title: 'Workplace Chat', icon: '🏢', desc: 'Professional office talk', color: 'from-green-600 to-green-800' },
    { title: 'Making Friends', icon: '🤝', desc: 'Casual social conversations', color: 'from-pink-600 to-pink-800' },
  ]

  const navLinks = [
    { to: '/chat', label: 'Chat' },
    { to: '/progress', label: 'Progress' },
    { to: '/dictionary', label: 'Dictionary' },
    { to: '/translator', label: 'Translator' },
    { to: '/community', label: 'Community' },
    { to: '/interview', label: 'Interview' },
    { to: '/quiz', label: 'Quiz' },
    { to: '/phrases', label: 'Phrases' },
    { to: '/grammar', label: 'Grammar' },
    { to: '/culture', label: 'Culture' },
    { to: '/settings', label: 'Settings' },
    { to: '/profile', label: 'Profile' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo size={18} />
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">BridgeVoice</h1>
          </div>
          <div className="hidden md:flex items-center gap-1 flex-wrap">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                to={link.to}
                className="text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-1.5 rounded-lg text-sm transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-900 bg-opacity-50 hover:bg-opacity-80 text-red-400 px-4 py-2 rounded-lg text-sm transition font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Welcome back, <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{user?.full_name?.split(' ')[0] || 'Learner'}</span>! 👋
          </h2>
          <p className="text-gray-400 mt-1">Keep up the great work on your English journey!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Day Streak', value: `🔥 ${streak}`, color: 'text-orange-400' },
            { label: 'Total XP', value: xp, color: 'text-purple-400' },
            { label: 'Sessions Done', value: 12, color: 'text-blue-400' },
            { label: 'Current Level', value: level, color: 'text-green-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center hover:border-gray-600 transition">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Daily Goal */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-gray-300">Daily Goal Progress</p>
            <p className="text-sm text-purple-400 font-medium">1/3 sessions</p>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full" style={{ width: '33%' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Complete 2 more sessions to reach your daily goal!</p>
        </div>

        {/* Scenarios */}
        <h3 className="text-xl font-bold text-gray-200 mb-4">Choose a Scenario to Practice</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {scenarios.map((scenario, i) => (
            <button
              key={i}
              onClick={() => navigate('/chat')}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-left hover:border-gray-600 hover:shadow-lg transition group"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${scenario.color} rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition`}>
                {scenario.icon}
              </div>
              <p className="font-semibold text-white">{scenario.title}</p>
              <p className="text-sm text-gray-400 mt-1">{scenario.desc}</p>
            </button>
          ))}
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Badges */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-200 mb-4">🏆 Badges Earned</h3>
            <div className="flex gap-3 flex-wrap">
              {[
                { badge: '🌟', name: 'First Session' },
                { badge: '🔥', name: '7 Day Streak' },
                { badge: '💬', name: '10 Chats' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-center">
                  <p className="text-2xl">{item.badge}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-200 mb-4">📅 Recent Sessions</h3>
            <div className="space-y-3">
              {[
                { scenario: 'Job Interview', date: 'Today', score: '85%' },
                { scenario: 'Grocery Store', date: 'Yesterday', score: '92%' },
                { scenario: 'Doctor Visit', date: '2 days ago', score: '78%' },
              ].map((session, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-800">
                  <div>
                    <p className="font-medium text-gray-300 text-sm">{session.scenario}</p>
                    <p className="text-xs text-gray-500">{session.date}</p>
                  </div>
                  <span className="text-green-400 font-semibold text-sm">{session.score}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard