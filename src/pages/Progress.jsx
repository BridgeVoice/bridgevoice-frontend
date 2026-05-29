import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Progress() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const weeklyData = [
    { day: 'Mon', sessions: 2, score: 75 },
    { day: 'Tue', sessions: 1, score: 80 },
    { day: 'Wed', sessions: 3, score: 85 },
    { day: 'Thu', sessions: 2, score: 78 },
    { day: 'Fri', sessions: 4, score: 90 },
    { day: 'Sat', sessions: 1, score: 88 },
    { day: 'Sun', sessions: 2, score: 92 },
  ]

  const skills = [
    { name: 'Grammar', score: 75, color: 'bg-blue-500' },
    { name: 'Pronunciation', score: 60, color: 'bg-green-500' },
    { name: 'Vocabulary', score: 85, color: 'bg-purple-500' },
    { name: 'Fluency', score: 70, color: 'bg-orange-500' },
    { name: 'Confidence', score: 80, color: 'bg-pink-500' },
  ]

  const sessions = [
    { scenario: 'Job Interview', date: 'Today', score: 85, duration: '12 mins', feedback: 'Great eye contact phrases! Work on past tense.' },
    { scenario: 'Grocery Store', date: 'Yesterday', score: 92, duration: '8 mins', feedback: 'Excellent vocabulary! Very natural conversation.' },
    { scenario: 'Doctor Visit', date: '2 days ago', score: 78, duration: '15 mins', feedback: 'Good effort! Practice medical terms more.' },
    { scenario: 'Bank Visit', date: '3 days ago', score: 88, duration: '10 mins', feedback: 'Very polite and professional tone!' },
    { scenario: 'Workplace Chat', date: '4 days ago', score: 71, duration: '9 mins', feedback: 'Work on formal vs informal language.' },
  ]

  const maxScore = Math.max(...weeklyData.map(d => d.score))

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

      <div className="max-w-5xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-700">📊 Your Progress</h2>
          <p className="text-gray-500">Track your English learning journey</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-blue-600">15</p>
            <p className="text-sm text-gray-500 mt-1">Total Sessions</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-green-600">83%</p>
            <p className="text-sm text-gray-500 mt-1">Avg Score</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-orange-500">🔥 7</p>
            <p className="text-sm text-gray-500 mt-1">Day Streak</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-purple-600">2.5h</p>
            <p className="text-sm text-gray-500 mt-1">Total Practice</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['overview', 'skills', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-4">📈 This Week's Scores</h3>
              <div className="flex items-end gap-3 h-40">
                {weeklyData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <p className="text-xs text-gray-500 font-medium">{d.score}%</p>
                    <div
                      className="w-full bg-blue-500 rounded-t-lg transition-all"
                      style={{ height: `${(d.score / maxScore) * 120}px` }}
                    ></div>
                    <p className="text-xs text-gray-400">{d.day}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-4">🎯 Confidence Over Time</h3>
              <div className="space-y-2">
                {[
                  { week: 'Week 1', score: 55 },
                  { week: 'Week 2', score: 65 },
                  { week: 'Week 3', score: 72 },
                  { week: 'Week 4', score: 83 },
                ].map((w, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <p className="text-sm text-gray-500 w-16">{w.week}</p>
                    <div className="flex-1 bg-gray-100 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{ width: `${w.score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 w-10">{w.score}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-700 mb-6">🧠 Skill Breakdown</h3>
            <div className="space-y-5">
              {skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <p className="font-medium text-gray-700">{skill.name}</p>
                    <p className="text-sm font-semibold text-gray-500">{skill.score}%</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-4">
                    <div
                      className={`${skill.color} h-4 rounded-full transition-all`}
                      style={{ width: `${skill.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-blue-50 rounded-xl p-4">
              <p className="font-semibold text-blue-700 mb-2">💡 AI Recommendation</p>
              <p className="text-sm text-gray-600">Your pronunciation score is lowest at 60%. Try the <strong>Doctor Visit</strong> scenario which focuses on clear speech and medical vocabulary!</p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-700 mb-4">📅 Session History</h3>
            <div className="space-y-4">
              {sessions.map((session, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-700">{session.scenario}</p>
                      <p className="text-xs text-gray-400">{session.date} • {session.duration}</p>
                    </div>
                    <span className={`font-bold text-lg ${
                      session.score >= 85 ? 'text-green-600' :
                      session.score >= 70 ? 'text-orange-500' : 'text-red-500'
                    }`}>
                      {session.score}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                    💬 {session.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Progress