import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import { API_BASE } from '../config'

function Community() {
  const [activeTab, setActiveTab] = useState('feed')
  const [newPost, setNewPost] = useState('')

  const [posts, setPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [postsAvailable, setPostsAvailable] = useState(true)

  const [leaderboard, setLeaderboard] = useState([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(true)

  const [studyBuddies, setStudyBuddies] = useState([])
  const [buddiesLoading, setBuddiesLoading] = useState(true)
  const [buddiesAvailable, setBuddiesAvailable] = useState(true)

  const [incomingRequests, setIncomingRequests] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const [connectedBuddies, setConnectedBuddies] = useState([])

  const [activeChatBuddy, setActiveChatBuddy] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const email = localStorage.getItem('email')

  useEffect(() => {
    fetchLeaderboard()
    fetchPosts()
    fetchStudyBuddies()
    fetchRequests()
    fetchConnectedBuddies()
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    if (!activeChatBuddy) return
    const interval = setInterval(() => {
      fetchMessages(activeChatBuddy.email)
    }, 10000)
    return () => clearInterval(interval)
  }, [activeChatBuddy])

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/leaderboard?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      setLeaderboard(data)
    } catch (err) {
      console.log('Could not fetch leaderboard')
    }
    setLeaderboardLoading(false)
  }

  const fetchPosts = async () => {
    setPostsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/posts`)
      if (!res.ok) throw new Error('not found')
      const data = await res.json()
      setPosts(data)
    } catch (err) {
      setPostsAvailable(false)
    }
    setPostsLoading(false)
  }

  const handlePost = async () => {
    if (!newPost.trim() || !postsAvailable) return
    try {
      await fetch(`${API_BASE}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: email, content: newPost }),
      })
      setNewPost('')
      fetchPosts()
    } catch (err) {
      console.log('Could not post')
    }
  }

  const handleLike = async (id) => {
    try {
      await fetch(`${API_BASE}/api/posts/${id}/like`, { method: 'POST' })
      fetchPosts()
    } catch (err) {
      console.log('Could not like')
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/api/posts/${id}?user_email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      })
      fetchPosts()
    } catch (err) {
      console.log('Could not delete')
    }
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays}d ago`
  }

  const fetchStudyBuddies = async () => {
    setBuddiesLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/study-buddies?email=${encodeURIComponent(email)}`)
      if (!res.ok) throw new Error('not found')
      const data = await res.json()
      setStudyBuddies(data)
    } catch (err) {
      setBuddiesAvailable(false)
    }
    setBuddiesLoading(false)
  }

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/study-buddies/requests?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      setIncomingRequests(data.incoming || [])
      setSentRequests(data.sent || [])
    } catch (err) {
      console.log('Could not fetch requests')
    }
  }

  const fetchConnectedBuddies = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/study-buddies/connected?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      setConnectedBuddies(Array.isArray(data) ? data : [data])
    } catch (err) {
      console.log('Could not fetch connected buddies')
    }
  }

  const sendRequest = async (toEmail) => {
    try {
      await fetch(`${API_BASE}/api/study-buddies/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_email: email, to_email: toEmail }),
      })
      fetchRequests()
    } catch (err) {
      console.log('Could not send request')
    }
  }

  const respondToRequest = async (requestId, action) => {
    try {
      await fetch(`${API_BASE}/api/study-buddies/request/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, email }),
      })
      fetchRequests()
      fetchConnectedBuddies()
      fetchStudyBuddies()
    } catch (err) {
      console.log('Could not respond to request')
    }
  }

  const fetchMessages = async (buddyEmail) => {
    setMessagesLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/messages/${encodeURIComponent(buddyEmail)}?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [data])
    } catch (err) {
      console.log('Could not fetch messages')
    }
    setMessagesLoading(false)
  }

  const openChat = (buddy) => {
    setActiveChatBuddy(buddy)
    fetchMessages(buddy.email)
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChatBuddy) return
    setSendingMessage(true)
    const content = newMessage.trim()
    setNewMessage('')

    setMessages(prev => [...prev, {
      id: Date.now(),
      from_email: email,
      content,
      created_at: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      is_mine: true,
    }])

    try {
      await fetch(`${API_BASE}/api/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_email: email, to_email: activeChatBuddy.email, content }),
      })
    } catch (err) {
      console.log('Could not send message')
    }
    setSendingMessage(false)
  }

  const avatarColors = ['from-purple-600 to-blue-600', 'from-green-600 to-teal-600', 'from-orange-600 to-red-600', 'from-pink-600 to-purple-600', 'from-blue-600 to-cyan-600']

  const getColor = (str) => {
    const hash = (str || 'U').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return avatarColors[hash % avatarColors.length]
  }

  const getCompatibilityLabel = (score) => {
    if (score >= 5) return { label: '⭐ Best Match', color: 'text-green-600 dark:text-green-400' }
    if (score >= 3) return { label: '✅ Good Match', color: 'text-blue-600 dark:text-blue-400' }
    return { label: '🔵 Potential Match', color: 'text-gray-500 dark:text-gray-400' }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">👥 Community</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Connect with other English learners across Canada</p>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { id: 'feed', label: '📰 Feed' },
            { id: 'leaderboard', label: '🏆 Leaderboard' },
            { id: 'buddies', label: incomingRequests.length > 0 ? '🤝 Study Buddies 🔴' : '🤝 Study Buddies' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium transition text-sm ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'feed' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
              <textarea
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                placeholder="Share your progress or tips with the community..."
                rows={3}
                disabled={!postsAvailable}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none text-sm disabled:opacity-50"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handlePost}
                  disabled={!newPost.trim() || !postsAvailable}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-5 py-2 rounded-xl transition disabled:opacity-50 font-medium text-sm"
                >
                  Post 📢
                </button>
              </div>
            </div>

            {postsLoading ? (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 flex justify-center">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : !postsAvailable ? (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center">
                <p className="text-3xl mb-2 opacity-30">📰</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium text-sm mb-1">Feed isn't connected yet</p>
                <p className="text-gray-500 text-xs">The posts backend hasn't been built. Once it's live, real posts will show here.</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center">
                <p className="text-3xl mb-2 opacity-30">📰</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">No posts yet — be the first to share something!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-gray-400 dark:hover:border-gray-700 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getColor(post.full_name)} flex items-center justify-center text-white font-bold`}>
                      {post.full_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{post.full_name}</p>
                      <p className="text-xs text-gray-500">{formatTime(post.created_at)}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{post.content}</p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition"
                    >
                      👍 {post.likes}
                    </button>
                    {post.user_email === email && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition text-sm"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-4 text-center border-b border-gray-200 dark:border-gray-800 text-white">
              <p className="font-bold text-lg">🏆 Leaderboard</p>
              <p className="text-gray-300 text-sm">Top learners by XP</p>
            </div>
            {leaderboardLoading ? (
              <div className="p-12 flex justify-center">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-3xl mb-2 opacity-30">🏆</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">No rankings yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {leaderboard.map((u) => {
                  const badge = u.rank === 1 ? '🏆' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : null
                  return (
                    <div key={u.rank} className={`flex items-center gap-4 p-4 ${u.is_you ? 'bg-purple-100 dark:bg-purple-900 dark:bg-opacity-20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'} transition`}>
                      <p className="text-xl font-bold text-gray-500 dark:text-gray-400 w-8">{badge || u.rank}</p>
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getColor(u.name)} flex items-center justify-center text-white font-bold`}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{u.name} {u.is_you ? '(You)' : ''}</p>
                        <p className="text-xs text-gray-500">🔥 {u.streak} day streak</p>
                      </div>
                      <p className="font-bold text-purple-600 dark:text-purple-400">{u.xp} XP</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'buddies' && (
          <div className="space-y-6">

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">✅ My Study Buddies</p>
                <p className="text-gray-500 text-xs mt-0.5">{connectedBuddies.length} connected</p>
              </div>
              {connectedBuddies.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-3xl mb-2 opacity-30">🤝</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No study buddies yet — send a request below to get started</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {connectedBuddies.map((buddy, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getColor(buddy.full_name)} flex items-center justify-center text-white font-bold text-lg`}>
                        {buddy.initial}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{buddy.full_name}</p>
                        <p className="text-xs text-gray-500">{buddy.language_background} speaker • {buddy.proficiency_level}</p>
                      </div>
                      <button
                        onClick={() => openChat(buddy)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                      >
                        💬 Message
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {incomingRequests.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-yellow-300 dark:border-yellow-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">📬 Connection Requests</p>
                    <p className="text-gray-500 text-xs mt-0.5">People who want to study with you</p>
                  </div>
                  <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold">{incomingRequests.length} New</span>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {incomingRequests.map((req) => (
                    <div key={req.id} className="px-6 py-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getColor(req.from_name)} flex items-center justify-center text-white font-bold`}>
                          {req.from_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{req.from_name}</p>
                          <p className="text-xs text-gray-500">{req.from_language} speaker • {req.from_level}</p>
                          {req.from_goals && <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">🎯 {req.from_goals}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => respondToRequest(req.id, 'accept')}
                          className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-xl text-xs font-bold transition"
                        >
                          ✅ Accept
                        </button>
                        <button
                          onClick={() => respondToRequest(req.id, 'reject')}
                          className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:bg-opacity-30 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 py-2 rounded-xl text-xs font-bold transition"
                        >
                          ❌ Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">🤖 Suggested Buddies</p>
                <p className="text-gray-500 text-xs mt-0.5">Matched by level, language and goals</p>
              </div>

              {buddiesLoading ? (
                <div className="p-12 flex justify-center">
                  <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : !buddiesAvailable ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-3xl mb-2 opacity-30">🤝</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Study buddy matching isn't connected yet</p>
                </div>
              ) : studyBuddies.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-3xl mb-2 opacity-30">🔍</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium text-sm mb-1">No suggestions available</p>
                  <p className="text-gray-500 text-xs">You're connected with everyone available right now.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {studyBuddies.map((buddy, i) => {
                    const compat = getCompatibilityLabel(buddy.compatibility_score)
                    const sentReq = sentRequests.find(r => r.to_email === buddy.email)
                    const reqStatus = sentReq?.status

                    return (
                      <div key={i} className="px-6 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getColor(buddy.full_name)} flex items-center justify-center text-white font-bold text-lg`}>
                            {buddy.full_name?.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-gray-800 dark:text-gray-200">{buddy.full_name}</p>
                              <span className={`text-xs font-medium ${compat.color}`}>{compat.label}</span>
                            </div>
                            <p className="text-xs text-gray-500">{buddy.language_background} speaker • {buddy.proficiency_level}</p>
                            <p className="text-xs text-purple-600 dark:text-purple-400">Goal: {buddy.goals}</p>
                          </div>
                        </div>

                        {!reqStatus && (
                          <button
                            onClick={() => sendRequest(buddy.email)}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-2 rounded-xl transition text-xs font-medium"
                          >
                            🤝 Send Connection Request
                          </button>
                        )}
                        {reqStatus === 'pending' && (
                          <div className="w-full bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-20 border border-yellow-300 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 py-2 rounded-xl text-xs font-medium text-center">
                            ⏳ Request Sent — Waiting for response
                          </div>
                        )}
                        {reqStatus === 'rejected' && (
                          <div className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-500 py-2 rounded-xl text-xs font-medium text-center">
                            ❌ Request Declined
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {activeChatBuddy && (
        <div className="fixed inset-0 bg-gray-900/30 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl h-[750px] flex flex-col shadow-2xl overflow-hidden">

            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getColor(activeChatBuddy.full_name)} flex items-center justify-center text-white font-bold`}>
                {activeChatBuddy.initial}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{activeChatBuddy.full_name}</p>
                <p className="text-xs text-gray-500">Study Buddy • {activeChatBuddy.proficiency_level}</p>
              </div>
              <button
                onClick={() => { setActiveChatBuddy(null); setMessages([]) }}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messagesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-3xl mb-3">👋</p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">Start a conversation!</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Say hi to {activeChatBuddy.full_name.split(' ')[0]} and start practicing together
                  </p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.is_mine
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                    }`}>
                      {msg.content}
                      <p className={`text-xs mt-1 ${msg.is_mine ? 'text-purple-100' : 'text-gray-500'}`}>{msg.created_at}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder={`Message ${activeChatBuddy.full_name.split(' ')[0]}...`}
                className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sendingMessage}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl transition disabled:opacity-50 font-bold text-sm flex-shrink-0"
              >
                {sendingMessage ? '...' : '→'}
              </button>
            </div>

          </div>
        </div>
      )}

    </Layout>
  )
}

export default Community