import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../assets/logo'
import { API_BASE } from '../config'

function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    const isDarkMode = () => document.documentElement.classList.contains('dark')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    let gradientAngle = 0

    const draw = () => {
      const dark = isDarkMode()

      if (!dark) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        animationId = requestAnimationFrame(draw)
        return
      }

      gradientAngle += 0.003
      const x1 = canvas.width / 2 + Math.cos(gradientAngle) * canvas.width * 0.4
      const y1 = canvas.height / 2 + Math.sin(gradientAngle) * canvas.height * 0.4
      const x2 = canvas.width / 2 + Math.cos(gradientAngle + Math.PI) * canvas.width * 0.4
      const y2 = canvas.height / 2 + Math.sin(gradientAngle + Math.PI) * canvas.height * 0.4

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
      gradient.addColorStop(0, '#0f0720')
      gradient.addColorStop(0.3, '#1a0a2e')
      gradient.addColorStop(0.6, '#0d1117')
      gradient.addColorStop(1, '#0a1628')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const blobs = [
        { x: canvas.width * 0.3, y: canvas.height * 0.3, color: 'rgba(147, 51, 234, 0.10)' },
        { x: canvas.width * 0.8, y: canvas.height * 0.7, color: 'rgba(59, 130, 246, 0.10)' },
        { x: canvas.width * 0.5, y: canvas.height * 0.5, color: 'rgba(139, 92, 246, 0.06)' },
      ]
      blobs.forEach(blob => {
        const blobGrad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, 280)
        blobGrad.addColorStop(0, blob.color)
        blobGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = blobGrad
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity})`
        ctx.fill()
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full dark:block hidden"
        style={{ pointerEvents: 'none' }}
      />
      <div className="absolute inset-0 w-full h-full block dark:hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden" style={{ pointerEvents: 'none' }}>
        <div
          className="absolute rounded-full opacity-40"
          style={{
            width: '400px',
            height: '400px',
            top: '-10%',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.35) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'regAurora1 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full opacity-40"
          style={{
            width: '380px',
            height: '380px',
            bottom: '-15%',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'regAurora2 22s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full opacity-30"
          style={{
            width: '320px',
            height: '320px',
            top: '40%',
            left: '35%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'regAurora3 25s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes regAurora1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(40px, 30px) scale(1.1); }
          }
          @keyframes regAurora2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-30px, -20px) scale(1.08); }
          }
          @keyframes regAurora3 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-25px, 30px) scale(0.95); }
          }
        `}</style>
      </div>
    </>
  )
}

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        if (data.email_sent) {
          setSuccessMessage('Account created successfully! A welcome email has been sent.')
        } else {
          setSuccessMessage('Account created successfully, but the welcome email could not be sent.')
        }

        const loginResponse = await fetch(`${API_BASE}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        })

        const loginData = await loginResponse.json()

        if (loginResponse.ok) {
          localStorage.setItem('token', loginData.access_token)
          localStorage.setItem('email', formData.email)
          localStorage.setItem('full_name', formData.full_name)
          setRegistrationComplete(true)
        } else {
          setError('Account created, but auto-login failed. Please login manually.')
        }
      } else {
        if (Array.isArray(data.detail)) {
          const messages = data.detail.map((err) => {
            const field = err.loc?.[err.loc.length - 1] || 'input'
            return `${field}: ${err.msg}`
          })
          setError(messages.join('. '))
        } else {
          setError(data.detail || 'Registration failed')
        }
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex">

      {/* Left Side — Branding */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 px-12">

        <svg width="340" height="85" viewBox="0 0 680 170" className="mb-2">
          <defs>
            <linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#9333ea' }} />
              <stop offset="100%" style={{ stopColor: '#3b82f6' }} />
            </linearGradient>
            <style>{`
              @keyframes regGrowUp {
                0% { transform: scaleY(0); opacity: 0; }
                100% { transform: scaleY(1); opacity: 1; }
              }
              .rbar { transform-origin: bottom; animation: regGrowUp 0.4s ease forwards; opacity: 0; }
              .rb1{animation-delay:0.1s}.rb2{animation-delay:0.2s}.rb3{animation-delay:0.3s}
              .rb4{animation-delay:0.4s}.rb5{animation-delay:0.5s}.rb6{animation-delay:0.6s}
              .rb7{animation-delay:0.7s}.rb8{animation-delay:0.8s}.rb9{animation-delay:0.9s}
              .rb10{animation-delay:1.0s}.rb11{animation-delay:1.1s}.rb12{animation-delay:1.2s}
              @keyframes regFadeIn { 0%{opacity:0} 100%{opacity:1} }
              .rland { animation: regFadeIn 0.5s ease forwards; opacity: 0; }
              .rl1{animation-delay:0s}.rl2{animation-delay:1.3s}
            `}</style>
          </defs>
          <rect className="rland rl1" x="170" y="148" width="50" height="12" rx="6" fill="url(#rg1)"/>
          <rect className="rland rl2" x="460" y="148" width="50" height="12" rx="6" fill="url(#rg1)"/>
          <rect className="rbar rb1" x="228" y="138" width="14" height="22" rx="4" fill="#9333ea"/>
          <rect className="rbar rb2" x="248" y="128" width="14" height="32" rx="4" fill="#9333ea"/>
          <rect className="rbar rb3" x="268" y="115" width="14" height="45" rx="4" fill="#8b2fe8"/>
          <rect className="rbar rb4" x="288" y="105" width="14" height="55" rx="4" fill="#7c3aed"/>
          <rect className="rbar rb5" x="308" y="98" width="14" height="62" rx="4" fill="url(#rg1)"/>
          <rect className="rbar rb6" x="328" y="94" width="14" height="66" rx="4" fill="url(#rg1)"/>
          <rect className="rbar rb7" x="348" y="94" width="14" height="66" rx="4" fill="url(#rg1)"/>
          <rect className="rbar rb8" x="368" y="98" width="14" height="62" rx="4" fill="url(#rg1)"/>
          <rect className="rbar rb9" x="388" y="105" width="14" height="55" rx="4" fill="#3b82f6"/>
          <rect className="rbar rb10" x="408" y="115" width="14" height="45" rx="4" fill="#3b82f6"/>
          <rect className="rbar rb11" x="428" y="128" width="14" height="32" rx="4" fill="#3b82f6"/>
          <rect className="rbar rb12" x="448" y="138" width="14" height="22" rx="4" fill="#3b82f6"/>
        </svg>

        <h1 className="text-5xl font-bold leading-normal mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          BridgeVoice
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center text-lg leading-relaxed max-w-sm mb-10">
          Build English confidence with AI-powered conversation practice made for newcomers to Canada.
        </p>

        <div className="w-full max-w-sm space-y-3">
          {[
            { icon: '🗣️', text: 'Practice with 4 AI coach personalities' },
            { icon: '🍁', text: 'Culture guide for every province and territory' },
            { icon: '💼', text: 'Interview simulator with 60+ job types' },
            { icon: '📈', text: 'Quizzes, daily challenges, XP and streaks' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3">
              <span className="text-xl">{item.icon}</span>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{item.text}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Right Side — animated background + form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 relative overflow-hidden py-10">

        <AnimatedBackground />

        <div className="relative z-10 w-full max-w-md px-8">

          <div className="md:hidden flex justify-center mb-8">
            <Logo size={24} />
          </div>

          <div className="bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-70 backdrop-blur-md border border-gray-200 dark:border-gray-700 border-opacity-70 dark:border-opacity-50 rounded-3xl p-8 shadow-2xl">

            <h2 className="text-3xl font-bold mb-2">Create your account</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Start your English journey for free</p>

            {error && (
              <div className="bg-red-100 dark:bg-red-900 dark:bg-opacity-50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
                ❌ {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-100 dark:bg-green-900 dark:bg-opacity-50 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl mb-6 text-sm">
                {successMessage}
              </div>
            )}

            {registrationComplete && (
              <button
                onClick={() => navigate('/onboarding')}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white py-3 rounded-xl font-bold text-lg transition mb-5"
              >
                Continue to Onboarding →
              </button>
            )}

            {!registrationComplete && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full bg-gray-50 dark:bg-gray-800 bg-opacity-80 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full bg-gray-50 dark:bg-gray-800 bg-opacity-80 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Create a password"
                      className="w-full bg-gray-50 dark:bg-gray-800 bg-opacity-80 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-purple-500 transition pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Repeat your password"
                    className="w-full bg-gray-50 dark:bg-gray-800 bg-opacity-80 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl font-bold text-lg transition disabled:opacity-50 shadow-lg shadow-purple-300 dark:shadow-purple-900"
                >
                  {loading ? 'Creating Account...' : 'Create Account 🚀'}
                </button>
              </form>
            )}

            {!registrationComplete && (
              <p className="text-center text-gray-500 text-sm mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 font-medium">
                  Login here
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
