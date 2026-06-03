import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'

function Chat() {
  const navigate = useNavigate()
  const location = useLocation()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your BridgeVoice AI conversation partner. I'm here to help you practice English. What scenario would you like to practice today? You can type or use the microphone button to speak!"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [scenario, setScenario] = useState(location.state?.scenario || 'General Conversation')
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async (text) => {
    if (!text.trim()) return

    const userMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          scenario: scenario
        })
      })

      const data = await response.json()
      const aiReply = data.reply || "I'm sorry, I couldn't understand that. Could you try again?"

      setMessages(prev => [...prev, { role: 'assistant', content: aiReply }])

      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiReply)
        utterance.rate = 0.9
        utterance.pitch = 1
        window.speechSynthesis.speak(utterance)
      }

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your connection and try again!"
      }])
    }
    setLoading(false)
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Please use Google Chrome.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = 'en-US'

    recognitionRef.current.onstart = () => setListening(true)
    recognitionRef.current.onend = () => setListening(false)
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      sendMessage(transcript)
    }
    recognitionRef.current.onerror = () => {
      setListening(false)
      alert('Could not hear you. Please try again.')
    }

    recognitionRef.current.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="min-h-screen bg-[#EAF4EC] flex flex-col">

      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">BridgeVoice</h1>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">← Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto w-full px-4 py-4 flex-1 flex flex-col">

        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-2 font-medium">Select Scenario:</p>
          <div className="flex gap-2 flex-wrap">
            {['General Conversation', 
            'Job Interview', 
            'Grocery Store', 
            'Doctor Visit', 
            'Bank Visit', 
            'Workplace Chat',
            'Making Friends'].map(s => (
              <button
                key={s}
                onClick={() => setScenario(s)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  scenario === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm flex-1 flex flex-col" style={{ minHeight: '400px' }}>

          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '500px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-700 rounded-bl-sm'
                }`}>
                  {msg.role === 'assistant' && (
                    <p className="text-xs font-semibold text-blue-500 mb-1">🤖 BridgeVoice AI</p>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-100 p-4">
            <div className="flex gap-2 items-center">
              <button
                onClick={listening ? stopListening : startListening}
                className={`p-3 rounded-full transition ${
                  listening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                }`}
                title={listening ? 'Stop listening' : 'Start speaking'}
              >
                🎤
              </button>

              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={listening ? '🎤 Listening...' : 'Type your message or click 🎤 to speak...'}
                disabled={listening || loading}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />

              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-medium"
              >
                Send
              </button>
            </div>
            {listening && (
              <p className="text-center text-red-500 text-xs mt-2 animate-pulse">
                🔴 Listening... speak now!
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 mt-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-600 mb-2">💡 Quick Phrases:</p>
          <div className="flex gap-2 flex-wrap">
            {['Hello, nice to meet you!', 'Could you repeat that?', "I don't understand", 'Can you speak slower?'].map(phrase => (
              <button
                key={phrase}
                onClick={() => sendMessage(phrase)}
                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs hover:bg-blue-100 transition"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Chat