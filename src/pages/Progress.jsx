import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Progress() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const weeklyData = [
    { day: 'Mon', score: 75 },
    { day: 'Tue', score: 80 },
    { day: 'Wed', score: 85 },
    { day: 'Thu', score: 78 },
    { day: 'Fri', score: 90 },
    { day: 'Sat', score: 88 },
    { day: 'Sun', score: 92 },
  ]

  const skills = [
    { name: 'Grammar', score: 75, color: 'from-purple-600 to-purple-400' },
    { name: 'Pronunciation', score: 60, color: 'from-blue-600 to-blue-400' },
    { name: 'Vocabulary', score: 85, color: 'from-green-600 to-green-400' },
    { name: 'Fluency', score: 70, color: 'from-orange-600 to-orange-400' },
    { name: 'Confidence', score: 80, color: 'from-pink-600 to-pink-400' },
  ]

  const sessions = [
    { scenario: 'Job Interview', date: 'Today', score: 85, duration: '12 mins', feedback: 'Great eye contact phrases! Work on past tense.' },
    { scenario: 'Grocery Store', date: 'Yesterday', score: 92, duration: '8 mins', feedback: 'Excellent vocabulary! Very natural conversation.' },
    { scenario: 'Doctor Visit', date: '2 days ago', score: 78, duration: '15 mins', feedback: 'Good effort! Practice medical terms more.' },
    { scenario: 'Bank Visit', date: '3 days ago', score: 88, duration: '10 mins', feedback: 'Very polite and professional tone!' },
  ]

  const maxScore = Math.max(...weeklyData.map(d => d.score))

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">📊 Your Progress</h2>
          <p className="text-gray-400 mt-1">Track your English learning journey</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { value: '15', label: 'Total Sessions', color: 'text-blue-400' },
            { value: '83%', label: 'Avg Score', color: 'text-green-400' },
            { value: '🔥 7', label: 'Day Streak', color: 'text-orange-400' },
            { value: '2.5h', label: 'Total Practice', color: 'text-purple-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center hover:border-gray-600 transition">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {['overview', 'skills', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-medium capitalize transition text-sm ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold text-gray-200 mb-6">📈 This Week's Scores</h3>
              <div className="flex items-end gap-3 h-40">
                {weeklyData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <p className="text-xs text-gray-400 font-medium">{d.score}%</p>
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-blue-500 rounded-t-lg transition-all"
                      style={{ height: `${(d.score / maxScore) * 120}px` }}
                    ></div>
                    <p className="text-xs text-gray-500">{d.day}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold text-gray-200 mb-4">🎯 Confidence Over Time</h3>
              <div className="space-y-3">
                {[
                  { week: 'Week 1', score: 55 },
                  { week: 'Week 2', score: 65 },
                  { week: 'Week 3', score: 72 },
                  { week: 'Week 4', score: 83 },
                ].map((w, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <p className="text-sm text-gray-500 w-16">{w.week}</p>
                    <div className="flex-1 bg-gray-800 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-500 h-3 rounded-full"
                        style={{ width: `${w.score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm font-semibold text-gray-300 w-10">{w.score}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-200 mb-6">🧠 Skill Breakdown</h3>
            <div className="space-y-5">
              {skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <p className="font-medium text-gray-300">{skill.name}</p>
                    <p className="text-sm font-semibold text-gray-400">{skill.score}%</p>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r ${skill.color} h-3 rounded-full`}
                      style={{ width: `${skill.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-purple-900 bg-opacity-30 border border-purple-700 rounded-xl p-4">
              <p className="font-semibold text-purple-300 mb-2">💡 AI Recommendation</p>
              <p className="text-sm text-gray-400">Your pronunciation score is lowest at 60%. Try the <strong className="text-white">Doctor Visit</strong> scenario which focuses on clear speech!</p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-200 mb-4">📅 Session History</h3>
            <div className="space-y-4">
              {sessions.map((session, i) => (
                <div key={i} className="border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-200">{session.scenario}</p>
                      <p className="text-xs text-gray-500">{session.date} • {session.duration}</p>
                    </div>
                    <span className={`font-bold text-lg ${
                      session.score >= 85 ? 'text-green-400' :
                      session.score >= 70 ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {session.score}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 bg-gray-800 rounded-lg px-3 py-2">
                    💬 {session.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Progress