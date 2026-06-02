import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  } 

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Email domain restriction (enable later for production)
    /*const domainAllowed = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', "fanshaweonline.ca"]
    const emailDomain = formData.email.split('@')[1]?.toLowerCase()
    if (!domainAllowed.includes(emailDomain)) {
      setError('Please use an email from gmail.com, yahoo.com, outlook.com, hotmail.com, or fanshaweonline.ca')
      return
    }*/

    if(formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

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
        navigate('/onboarding')
      } else {
        setError(data.detail || 'Registration failed')
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#EAF4EC] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-2">BridgeVoice</h1>
        <p className="text-center text-gray-500 mb-6">Create your free account</p>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Min 8 characters"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Repeat your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login here
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register