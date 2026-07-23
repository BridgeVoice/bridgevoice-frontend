import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../assets/logo'

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
      const response = await fetch('http://127.0.0.1:8000/api/users/register', {
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

        const loginResponse = await fetch('http://127.0.0.1:8000/api/users/login', {
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
        setError(data.detail || 'Registration failed')
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
        <Logo size={40} />
        <h1 className="text-4xl font-bold mt-6 mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          BridgeVoice
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center text-lg leading-relaxed max-w-sm">
          Join thousands of learners building English confidence with AI-powered conversation practice.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
          {[
            { number: '10K+', label: 'Active Learners' },
            { number: '50+', label: 'Scenarios' },
            { number: '95%', label: 'Success Rate' },
            { number: '100%', label: 'Free' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {stat.number}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side — Register Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8">
        <div className="w-full max-w-md">
          <div className="md:hidden flex justify-center mb-8">
            <Logo size={24} />
          </div>

          <h2 className="text-3xl font-bold mb-2">Create your account</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Start your English journey for free</p>

          {error && (
            <div className="bg-red-100 dark:bg-red-900 dark:bg-opacity-50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
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
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
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
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Min 8 characters"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Repeat your password"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
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
  )
}

export default Register