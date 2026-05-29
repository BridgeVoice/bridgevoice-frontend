import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

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
    { title: 'Job Interview', icon: '💼', desc: 'Practice common interview questions', color: 'bg-blue-50 border-blue-200' },
    { title: 'Grocery Store', icon: '🛒', desc: 'Learn everyday shopping vocabulary', color: 'bg-green-50 border-green-200' },
    { title: 'Doctor Visit', icon: '🏥', desc: 'Practice medical conversations', color: 'bg-red-50 border-red-200' },
    { title: 'Bank Visit', icon: '🏦', desc: 'Handle banking conversations', color: 'bg-yellow-50 border-yellow-200' },
    { title: 'Workplace Chat', icon: '🏢', desc: 'Professional office conversations', color: 'bg-purple-50 border-purple-200' },
    { title: 'Making Friends', icon: '🤝', desc: 'Casual social conversations', color: 'bg-pink-50 border-pink-200' },
  ]

  return (
    <div className="min-h-screen bg-[#EAF4EC]">

      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">BridgeVoice</h1>
        <div className="flex items-center gap-4">
            <Link to="/progress" className="text-gray-600 hover:text-blue-600 font-medium">Progress</Link>
            <Link to="/dictionary" className="text-gray-600 hover:text-blue-600 font-medium">Dictionary</Link>
            <Link to="/translator" className="text-gray-600 hover:text-blue-600 font-medium">Translator</Link>
            <Link to="/community" className="text-gray-600 hover:text-blue-600 font-medium">Community</Link>
            <Link to="/interview" className="text-gray-600 hover:text-blue-600 font-medium">Interview</Link>
            <Link to="/culture" className="text-gray-600 hover:text-blue-600 font-medium">Culture</Link>
            <Link to="/quiz" className="text-gray-600 hover:text-blue-600 font-medium">Quiz</Link>
            <Link to="/phrases" className="text-gray-600 hover:text-blue-600 font-medium">Phrases</Link>
            <Link to="/grammar" className="text-gray-600 hover:text-blue-600 font-medium">Grammar</Link>
            <Link to="/settings" className="text-gray-600 hover:text-blue-600 font-medium">Settings</Link>
            <Link to="/profile" className="text-gray-600 hover:text-blue-600 font-medium">Profile</Link>
            <button
            onClick={handleLogout}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition font-medium"
            >
                Logout
            </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-700">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Learner'}! 👋
          </h2>
          <p className="text-gray-500">Keep up the great work on your English journey!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-orange-500">🔥 {streak}</p>
            <p className="text-sm text-gray-500 mt-1">Day Streak</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-blue-600">{xp}</p>
            <p className="text-sm text-gray-500 mt-1">Total XP</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-green-600">12</p>
            <p className="text-sm text-gray-500 mt-1">Sessions Done</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-xl font-bold text-purple-600">{level}</p>
            <p className="text-sm text-gray-500 mt-1">Current Level</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-gray-700">Daily Goal Progress</p>
            <p className="text-sm text-blue-600 font-medium">1/3 sessions</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div className="bg-blue-600 h-3 rounded-full" style={{ width: '33%' }}></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">Complete 2 more sessions to reach your daily goal!</p>
        </div>

        <h3 className="text-xl font-bold text-gray-700 mb-4">Choose a Scenario to Practice</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {scenarios.map((scenario) => (
            <button
              key={scenario.title}
              onClick={() => navigate('/chat')}
              className={`${scenario.color} border-2 rounded-xl p-5 text-left hover:shadow-md transition`}
            >
              <p className="text-3xl mb-2">{scenario.icon}</p>
              <p className="font-semibold text-gray-700">{scenario.title}</p>
              <p className="text-sm text-gray-500 mt-1">{scenario.desc}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-700 mb-4">🏆 Badges Earned</h3>
            <div className="flex gap-3 flex-wrap">
              {['🌟 First Session', '🔥 7 Day Streak', '💬 10 Chats'].map(badge => (
                <span key={badge} className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-700 mb-4">📅 Recent Sessions</h3>
            <div className="space-y-2">
              {[
                { scenario: 'Job Interview', date: 'Today', score: '85%' },
                { scenario: 'Grocery Store', date: 'Yesterday', score: '92%' },
                { scenario: 'Doctor Visit', date: '2 days ago', score: '78%' },
              ].map((session, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-700 text-sm">{session.scenario}</p>
                    <p className="text-xs text-gray-400">{session.date}</p>
                  </div>
                  <span className="text-green-600 font-semibold text-sm">{session.score}</span>
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