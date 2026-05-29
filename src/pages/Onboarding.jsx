import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    language_background: '',
    proficiency_level: '',
    goals: '',
    daily_goal: ''
  })

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleFinish = async () => {
    const email = localStorage.getItem('email')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#EAF4EC] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">

        <h1 className="text-3xl font-bold text-blue-600 text-center mb-2">BridgeVoice</h1>
        <p className="text-center text-gray-500 mb-2">Let's personalize your experience</p>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map(n => (
            <div
              key={n}
              className={`h-2 w-10 rounded-full ${step >= n ? 'bg-blue-600' : 'bg-gray-200'}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">What is your native language?</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Hindi', 'Mandarin', 'Arabic', 'Spanish', 'Punjabi', 'French', 'Tagalog', 'Other'].map(lang => (
                <button
                  key={lang}
                  onClick={() => handleChange('language_background', lang)}
                  className={`py-3 rounded-lg border-2 font-medium transition ${
                    formData.language_background === lang
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">What is your English level?</h2>
            <div className="space-y-3">
              {[
                { level: 'Beginner', desc: 'I know very little English' },
                { level: 'Elementary', desc: 'I know basic words and phrases' },
                { level: 'Intermediate', desc: 'I can have simple conversations' },
                { level: 'Advanced', desc: 'I am fairly confident in English' },
              ].map(({ level, desc }) => (
                <button
                  key={level}
                  onClick={() => handleChange('proficiency_level', level)}
                  className={`w-full py-3 px-4 rounded-lg border-2 text-left transition ${
                    formData.proficiency_level === level
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <p className="font-medium text-gray-700">{level}</p>
                  <p className="text-sm text-gray-400">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">What is your main goal?</h2>
            <div className="space-y-3">
              {[
                { goal: 'Job Interview Practice', icon: '💼' },
                { goal: 'Everyday Conversation', icon: '💬' },
                { goal: 'Academic English', icon: '📚' },
                { goal: 'Business English', icon: '🏢' },
                { goal: 'Canadian Culture', icon: '🍁' },
                { goal: 'Making Friends', icon: '🤝' },
              ].map(({ goal, icon }) => (
                <button
                  key={goal}
                  onClick={() => handleChange('goals', goal)}
                  className={`w-full py-3 px-4 rounded-lg border-2 text-left transition flex items-center gap-3 ${
                    formData.goals === goal
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-2xl">{icon}</span>
                  <p className="font-medium text-gray-700">{goal}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">How much time can you practice daily?</h2>
            <div className="grid grid-cols-2 gap-3">
              {['5 minutes', '10 minutes', '20 minutes', '30+ minutes'].map(time => (
                <button
                  key={time}
                  onClick={() => handleChange('daily_goal', time)}
                  className={`py-4 rounded-lg border-2 font-medium transition ${
                    formData.daily_goal === time
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            <div className="mt-6 bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-blue-600 font-medium">🎉 You are all set!</p>
              <p className="text-gray-500 text-sm mt-1">Your personalized learning path is ready</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
            >
              Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !formData.language_background) ||
                (step === 2 && !formData.proficiency_level) ||
                (step === 3 && !formData.goals)
              }
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!formData.daily_goal}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              Let's Go! 🚀
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default Onboarding