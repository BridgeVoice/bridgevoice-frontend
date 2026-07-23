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

        <div className="mt-12 grid