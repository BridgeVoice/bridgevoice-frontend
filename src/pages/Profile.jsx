import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email')
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

  if (!user) return (
    <div className="min-h-screen bg-[#EAF4EC] flex items-center justify-center">
      <p className="text-gray-500 text-lg">Loading profile...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#EAF4EC]">

      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">BridgeVoice</h1>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
          <button
            onClick={handleLogout}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.full_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-700">{user.full_name}</h2>
              <p className="text-gray-400">{user.email}</p>
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mt-1 inline-block">
                {user.proficiency_level || 'Beginner'}
              </span>
            </div>
          </div>

          {message && (
            <div className="bg-green-100 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Native Language</p>
              <p className="font-semibold text-gray-700">{user.language_background || 'Not set'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">English Level</p>
              <p className="font-semibold text-gray-700">{user.proficiency_level || 'Not set'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
              <p className="text-sm text-gray-400 mb-1">Learning Goal</p>
              <p className="font-semibold text-gray-700">{user.goals || 'Not set'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h3 className="text-xl font-bold text-gray-700 mb-4">📊 Your Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-400 mt-1">Total Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-500">🔥 7</p>
              <p className="text-sm text-gray-400 mt-1">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">340</p>
              <p className="text-sm text-gray-400 mt-1">Total XP</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h3 className="text-xl font-bold text-gray-700 mb-4">🏆 Badges</h3>
          <div className="flex gap-3 flex-wrap">
            {[
              { badge: '🌟', name: 'First Session', desc: 'Completed your first conversation' },
              { badge: '🔥', name: '7 Day Streak', desc: 'Practiced 7 days in a row' },
              { badge: '💬', name: '10 Chats', desc: 'Completed 10 conversations' },
              { badge: '🍁', name: 'Canada Ready', desc: 'Completed Canadian culture module' },
            ].map((item, i) => (
              <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center w-28">
                <p className="text-3xl">{item.badge}</p>
                <p className="text-xs font-semibold text-yellow-700 mt-1">{item.name}</p>
                <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-700 mb-4">⚙️ Account Settings</h3>
          <div className="space-y-3">
            <button
            onClick={() => navigate('/settings')}
            className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition text-gray-700 font-medium">
            ⚙️ Settings
            </button>
            <button
            onClick={() => navigate('/interview')}
            className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition text-gray-700 font-medium">
            💼 Interview Simulator
            </button>
            <button
            onClick={() => navigate('/community')}
            className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition text-gray-700 font-medium">
            👥 Community
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg border border-red-200 hover:bg-red-50 transition text-red-600 font-medium"
            >
              🚪 Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile