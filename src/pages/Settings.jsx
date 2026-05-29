import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Settings() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    darkMode: false,
    emailNotifications: true,
    practiceReminder: true,
    reminderTime: '09:00',
    soundEffects: true,
    autoSpeak: true,
    language: 'English',
    privacy: 'public',
    dailyGoal: '3',
  })

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone!')) {
      localStorage.clear()
      navigate('/')
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

      <div className="max-w-3xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-700">⚙️ Settings</h2>
          <p className="text-gray-500">Customize your BridgeVoice experience</p>
        </div>

        {saved && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl mb-6 font-medium">
            ✅ Settings saved successfully!
          </div>
        )}

        <div className="space-y-6">

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-700 mb-4">🎨 Appearance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">Dark Mode</p>
                  <p className="text-sm text-gray-400">Switch to dark theme</p>
                </div>
                <button
                  onClick={() => handleToggle('darkMode')}
                  className={`w-14 h-7 rounded-full transition-colors ${
                    settings.darkMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${
                    settings.darkMode ? 'translate-x-7' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-700 mb-4">🔔 Notifications</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive progress updates by email</p>
                </div>
                <button
                  onClick={() => handleToggle('emailNotifications')}
                  className={`w-14 h-7 rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${
                    settings.emailNotifications ? 'translate-x-7' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">Daily Practice Reminder</p>
                  <p className="text-sm text-gray-400">Get reminded to practice every day</p>
                </div>
                <button
                  onClick={() => handleToggle('practiceReminder')}
                  className={`w-14 h-7 rounded-full transition-colors ${
                    settings.practiceReminder ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${
                    settings.practiceReminder ? 'translate-x-7' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

              {settings.practiceReminder && (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-700">Reminder Time</p>
                    <p className="text-sm text-gray-400">When to remind you to practice</p>
                  </div>
                  <input
                    type="time"
                    value={settings.reminderTime}
                    onChange={e => handleChange('reminderTime', e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-700 mb-4">🔊 Audio</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">Sound Effects</p>
                  <p className="text-sm text-gray-400">Play sounds for achievements and alerts</p>
                </div>
                <button
                  onClick={() => handleToggle('soundEffects')}
                  className={`w-14 h-7 rounded-full transition-colors ${
                    settings.soundEffects ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${
                    settings.soundEffects ? 'translate-x-7' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">Auto Speak AI Responses</p>
                  <p className="text-sm text-gray-400">AI reads responses aloud automatically</p>
                </div>
                <button
                  onClick={() => handleToggle('autoSpeak')}
                  className={`w-14 h-7 rounded-full transition-colors ${
                    settings.autoSpeak ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-1 ${
                    settings.autoSpeak ? 'translate-x-7' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-700 mb-4">🎯 Learning</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">Daily Session Goal</p>
                  <p className="text-sm text-gray-400">How many sessions per day</p>
                </div>
                <select
                  value={settings.dailyGoal}
                  onChange={e => handleChange('dailyGoal', e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="1">1 session</option>
                  <option value="2">2 sessions</option>
                  <option value="3">3 sessions</option>
                  <option value="5">5 sessions</option>
                  <option value="10">10 sessions</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">Interface Language</p>
                  <p className="text-sm text-gray-400">Language for menus and buttons</p>
                </div>
                <select
                  value={settings.language}
                  onChange={e => handleChange('language', e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Mandarin</option>
                  <option>Arabic</option>
                  <option>Spanish</option>
                  <option>Punjabi</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-700 mb-4">🔒 Privacy</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">Profile Visibility</p>
                  <p className="text-sm text-gray-400">Who can see your profile</p>
                </div>
                <select
                  value={settings.privacy}
                  onChange={e => handleChange('privacy', e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="public">Everyone</option>
                  <option value="buddies">Study Buddies Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-700 mb-4">🔑 Account</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-gray-700 font-medium">
                🔒 Change Password
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-gray-700 font-medium">
                📧 Change Email
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-gray-700 font-medium">
                📥 Download My Data
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-red-500 mb-4">⚠️ Danger Zone</h3>
            <button
              onClick={handleDeleteAccount}
              className="w-full text-left px-4 py-3 rounded-xl border border-red-200 hover:bg-red-50 transition text-red-600 font-medium"
            >
              🗑️ Delete Account
            </button>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition font-bold text-lg"
          >
            Save Settings ✅
          </button>

        </div>
      </div>
    </div>
  )
}

export default Settings