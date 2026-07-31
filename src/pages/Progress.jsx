import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { API_BASE } from '../config'

function Progress() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const [user, setUser] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const email = localStorage.getItem('email')
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    Promise.all([
      fetch(`${API_BASE}/api/users/profile?email=${email}`).then(res => res.json()),
      fetch(`${API_BASE}/api/users/session-history/${email}`).then(res => res.json()),
    ])
      .then(([profileData, sessionData]) => {
        setUser(profileData)
        setSessions(Array.isArray(sessionData) ? sessionData : [])
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }, [])

  // Group the last 5 sessions by activity — this is real data, not a fixed
  // Grammar/Pronunciation/Vocabulary breakdown, since the backend doesn't
  // tag sessions with a skill category.
  const activityBreakdown = sessions.reduce((acc, s) => {
    if (!acc[s.activity_name]) acc[s.activity_name] = { name: s.activity_name, scores: [] }
    acc[s.activity_name].scores.push(s.score)
    return acc
  }, {})
  const activityList = Object.values(activityBreakdown).map(a => ({
    name: a.name,
    score: Math.round(a.scores.reduce((sum, s) => sum + s, 0) / a.scores.length),
    count: a.scores.length,
  }))

  const overallScore = sessions.length
    ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length)
    : 0

  const weakestActivity = activityList.length
    ? activityList.reduce((min, a) => (a.score < min.score ? a : min), activityList[0])
    : null

  const colorCycle = [
    'from-purple-600 to-purple-400',
    'from-blue-600 to-blue-400',
    'from-green-600 to-green-400',
    'from-orange-600 to-orange-400',
    'from-pink-600 to-pink-400',
  ]

  // ===== AI Insights =====
  const [insights, setInsights] = useState('')
  const [insightsLoading, setInsightsLoading] = useState(false)
  const [insightsError, setInsightsError] = useState('')

  const generateInsights = async () => {
    if (sessions.length < 3) {
      setInsightsError('You need at least 3 completed sessions before AI can analyze your progress. Keep practicing!')
      return
    }

    setInsightsLoading(true)
    setInsightsError('')
    setInsights('')

    try {
      const sessionSummary = sessions
        .map(s => `${s.activity_name}: ${s.score}% on ${new Date(s.created_at).toLocaleDateString()}`)
        .join('\n')

      const prompt = `Here is a summary of my recent English learning sessions:\n${sessionSummary}\n\nMy overall average score is ${overallScore}% across ${sessions.length} sessions, with a ${user?.day_streak ?? 0} day streak. Give me a short, encouraging progress report: what I'm doing well, one area to focus on, and one specific next step.`

      // NOTE: request body below is a guess (message/text field name unconfirmed).
      // Swap the key once the ChatMessage schema is confirmed.
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      })

      const data = await response.json()
      setInsights(data.response || data.reply || data.message || JSON.stringify(data))
    } catch (err) {
      setInsightsError('Could not generate insights. Make sure the backend is running!')
    }
    setInsightsLoading(false)
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto text-center py-20">
          <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Loading your progress...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">📊 Your Progress</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your English learning journey</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { value: String(user?.sessions_completed ?? 0), label: 'Total Sessions', color: 'text-blue-600 dark:text-blue-400' },
            { value: sessions.length ? `${overallScore}%` : '—', label: 'Recent Avg Score', color: 'text-green-600 dark:text-green-400' },
            { value: `🔥 ${user?.day_streak ?? 0}`, label: 'Day Streak', color: 'text-orange-600 dark:text-orange-400' },
            { value: String(user?.total_xp ?? 0), label: 'Total XP', color: 'text-purple-600 dark:text-purple-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-center hover:border-gray-400 dark:hover:border-gray-600 transition">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {['overview', 'skills', 'history', 'insights'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-medium capitalize transition text-sm ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab === 'insights' ? '🤖 AI Insights' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
  <div className="space-y-6">
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
      <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">📈 This Week's Scores</h3>
      <p className="text-gray-500 text-xs mb-6">
        Based on your last {sessions.length} session{sessions.length !== 1 ? 's' : ''} — days with no session show empty
      </p>
      <div className="flex items-end gap-3 h-40">
        {(() => {
          const days = []
          for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dayKey = d.toDateString()
            const daySessions = sessions.filter(s => new Date(s.created_at).toDateString() === dayKey)
            const avgScore = daySessions.length
              ? Math.round(daySessions.reduce((sum, s) => sum + s.score, 0) / daySessions.length)
              : 0
            days.push({
              label: d.toLocaleDateString('en-US', { weekday: 'short' }),
              score: avgScore,
              hasData: daySessions.length > 0,
            })
          }
          return days
        })().map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {d.hasData ? `${d.score}%` : '—'}
            </p>
            <div
              className={`w-full rounded-t-lg transition-all ${
                d.hasData ? 'bg-gradient-to-t from-purple-600 to-blue-500' : 'bg-gray-200 dark:bg-gray-800'
              }`}
              style={{ height: `${d.hasData ? (d.score / 100) * 120 : 4}px` }}
            ></div>
            <p className="text-xs text-gray-500">{d.label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

        {activeTab === 'skills' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">🧠 Activity Breakdown</h3>
            <p className="text-gray-500 text-xs mb-6">Average score per activity, based on your last {sessions.length} session{sessions.length !== 1 ? 's' : ''}</p>
            {activityList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2 opacity-30">🧠</p>
                <p className="text-gray-500 dark:text-gray-600 text-sm">No activity data yet</p>
              </div>
            ) : (
              <>
                <div className="space-y-5">
                  {activityList.map((a, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-2">
                        <p className="font-medium text-gray-700 dark:text-gray-300">{a.name} <span className="text-gray-400 text-xs">({a.count})</span></p>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{a.score}%</p>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                        <div
                          className={`bg-gradient-to-r ${colorCycle[i % colorCycle.length]} h-3 rounded-full`}
                          style={{ width: `${a.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                {weakestActivity && (
                  <div className="mt-8 bg-purple-100 dark:bg-purple-900 dark:bg-opacity-30 border border-purple-300 dark:border-purple-700 rounded-xl p-4">
                    <p className="font-semibold text-purple-700 dark:text-purple-300 mb-2">💡 Recommendation</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your <strong className="text-gray-900 dark:text-white">{weakestActivity.name}</strong> score is lowest at {weakestActivity.score}%. Try practicing it again to bring your average up!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">📅 Session History</h3>
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2 opacity-30">📅</p>
                <p className="text-gray-500 dark:text-gray-600 text-sm">No sessions yet — go complete one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session, i) => (
                  <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-gray-400 dark:hover:border-gray-600 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{session.activity_name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <span className={`font-bold text-lg ${
                        session.score >= 85 ? 'text-green-600 dark:text-green-400' :
                        session.score >= 70 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {session.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">🤖 AI Learning Insights</p>
                <p className="text-gray-500 text-xs">Personalized report based on your sessions</p>
              </div>
              <button
                onClick={generateInsights}
                disabled={insightsLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center gap-2"
              >
                {insightsLoading ? (
                  <>
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </>
                ) : insights ? '🔄 Refresh Insights' : '✨ Generate Insights'}
              </button>
            </div>

            <div className="p-6">
              {insightsError && (
                <div className="bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-20 border border-yellow-300 dark:border-yellow-800 rounded-xl px-4 py-3 flex items-start gap-3">
                  <span className="text-yellow-600 dark:text-yellow-400 text-lg flex-shrink-0">⚠️</span>
                  <p className="text-yellow-800 dark:text-yellow-300 text-sm">{insightsError}</p>
                </div>
              )}

              {insightsLoading && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-12 h-12 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">AI is analyzing your learning data...</p>
                </div>
              )}

              {!insightsLoading && !insights && !insightsError && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 dark:bg-opacity-30 border border-purple-300 dark:border-purple-700 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    🤖
                  </div>
                  <p className="text-gray-800 dark:text-white font-bold mb-2">Ready to Analyze Your Progress</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm max-w-sm mx-auto leading-relaxed mb-2">
                    AI will review your {sessions.length} sessions and give you a short progress report.
                  </p>
                </div>
              )}

              {insights && !insightsLoading && (
                <div className="bg-purple-100 dark:bg-purple-900 dark:bg-opacity-20 border border-purple-300 dark:border-purple-800 rounded-2xl p-5">
                  <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-line">{insights}</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Progress