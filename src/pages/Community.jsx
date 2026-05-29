import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Community() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('feed')
  const [newPost, setNewPost] = useState('')
  const [posts, setPosts] = useState([
    {
      id: 1,
      name: 'Priya S.',
      avatar: 'P',
      time: '2 mins ago',
      content: 'Just completed my first job interview practice! Feeling much more confident now 💪',
      likes: 12,
      liked: false,
      comments: 3
    },
    {
      id: 2,
      name: 'Wei L.',
      avatar: 'W',
      time: '15 mins ago',
      content: 'Reached 30 day streak today! BridgeVoice has helped me so much with my English confidence 🔥',
      likes: 28,
      liked: false,
      comments: 7
    },
    {
      id: 3,
      name: 'Ahmed K.',
      avatar: 'A',
      time: '1 hour ago',
      content: 'The Doctor Visit scenario really helped me communicate better at my appointment today. Highly recommend!',
      likes: 19,
      liked: false,
      comments: 4
    },
    {
      id: 4,
      name: 'Maria G.',
      avatar: 'M',
      time: '2 hours ago',
      content: 'Tips for newcomers: Practice the grocery store scenario first — it builds confidence fast! 🛒',
      likes: 35,
      liked: false,
      comments: 11
    },
    {
      id: 5,
      name: 'Jin P.',
      avatar: 'J',
      time: '3 hours ago',
      content: 'Got my first job offer in Canada today! BridgeVoice interview practice really helped me prepare 🍁',
      likes: 87,
      liked: false,
      comments: 23
    },
  ])

  const leaderboard = [
    { rank: 1, name: 'Jin P.', avatar: 'J', xp: 2840, streak: 45, badge: '🏆' },
    { rank: 2, name: 'Maria G.', avatar: 'M', xp: 2650, streak: 38, badge: '🥈' },
    { rank: 3, name: 'Wei L.', avatar: 'W', xp: 2340, streak: 30, badge: '🥉' },
    { rank: 4, name: 'Ahmed K.', avatar: 'A', xp: 1980, streak: 22, badge: '' },
    { rank: 5, name: 'Priya S.', avatar: 'P', xp: 1750, streak: 18, badge: '' },
    { rank: 6, name: 'You', avatar: 'G', xp: 340, streak: 7, badge: '' },
  ]

  const studyBuddies = [
    { name: 'Priya S.', level: 'Intermediate', language: 'Hindi', goal: 'Job Interview', online: true },
    { name: 'Carlos M.', level: 'Beginner', language: 'Spanish', goal: 'Everyday Conversation', online: true },
    { name: 'Fatima A.', level: 'Advanced', language: 'Arabic', goal: 'Business English', online: false },
    { name: 'Yuki T.', level: 'Intermediate', language: 'Japanese', goal: 'Academic English', online: true },
  ]

  const handleLike = (id) => {
    setPosts(prev => prev.map(post =>
      post.id === id
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  const handlePost = () => {
    if (!newPost.trim()) return
    const post = {
      id: posts.length + 1,
      name: 'You',
      avatar: 'G',
      time: 'Just now',
      content: newPost,
      likes: 0,
      liked: false,
      comments: 0
    }
    setPosts(prev => [post, ...prev])
    setNewPost('')
  }

  return (
    <div className="min-h-screen bg-[#EAF4EC]">

      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">BridgeVoice</h1>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
          <Link to="/progress" className="text-gray-600 hover:text-blue-600 font-medium">Progress</Link>
          <Link to="/profile" className="text-gray-600 hover:text-blue-600 font-medium">Profile</Link>
          <button
            onClick={() => { localStorage.clear(); navigate('/') }}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-700">👥 Community</h2>
          <p className="text-gray-500">Connect with other English learners across Canada</p>
        </div>

        <div className="flex gap-2 mb-6">
          {['feed', 'leaderboard', 'buddies'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              {tab === 'feed' ? '📰 Feed' : tab === 'leaderboard' ? '🏆 Leaderboard' : '🤝 Study Buddies'}
            </button>
          ))}
        </div>

        {activeTab === 'feed' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <textarea
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                placeholder="Share your progress or tips with the community..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handlePost}
                  disabled={!newPost.trim()}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium text-sm"
                >
                  Post 📢
                </button>
              </div>
            </div>

            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {post.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">{post.name}</p>
                    <p className="text-xs text-gray-400">{post.time}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{post.content}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 text-sm font-medium transition ${
                      post.liked ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'
                    }`}
                  >
                    {post.liked ? '👍' : '👍'} {post.likes}
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600 transition">
                    💬 {post.comments}
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600 transition">
                    🔗 Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-blue-600 p-4 text-center">
              <p className="text-white font-bold text-lg">🏆 Weekly Leaderboard</p>
              <p className="text-blue-200 text-sm">Top learners this week</p>
            </div>
            <div className="divide-y divide-gray-100">
              {leaderboard.map((user, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 ${user.name === 'You' ? 'bg-blue-50' : ''}`}
                >
                  <p className="text-xl font-bold text-gray-400 w-8">{user.badge || user.rank}</p>
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-700">{user.name} {user.name === 'You' ? '(You)' : ''}</p>
                    <p className="text-xs text-gray-400">🔥 {user.streak} day streak</p>
                  </div>
                  <p className="font-bold text-blue-600">{user.xp} XP</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'buddies' && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="font-semibold text-blue-700">🤝 Find a Study Buddy</p>
              <p className="text-sm text-gray-500 mt-1">Practice English with other learners at your level!</p>
            </div>
            {studyBuddies.map((buddy, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      {buddy.name.charAt(0)}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${buddy.online ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">{buddy.name}</p>
                    <p className="text-xs text-gray-400">{buddy.language} speaker • {buddy.level}</p>
                    <p className="text-xs text-blue-500">Goal: {buddy.goal}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Community