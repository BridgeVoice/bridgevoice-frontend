import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function InterviewSimulator() {
  const navigate = useNavigate()
  const [stage, setStage] = useState('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [listening, setListening] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [jobType, setJobType] = useState('')

  const jobTypes = [
    { title: 'Software Developer', icon: '💻' },
    { title: 'Customer Service', icon: '🎧' },
    { title: 'Healthcare Worker', icon: '🏥' },
    { title: 'Teacher', icon: '📚' },
    { title: 'Accountant', icon: '💼' },
    { title: 'Retail Worker', icon: '🛒' },
    { title: 'Restaurant Worker', icon: '🍽️' },
    { title: 'Driver', icon: '🚗' },
    { title: 'Security Guard', icon: '🔒' },
    { title: 'Warehouse Worker', icon: '📦' },
    { title: 'Bank Teller', icon: '🏦' },
    { title: 'Real Estate Agent', icon: '🏠' },
    { title: 'Marketing Manager', icon: '📊' },
    { title: 'Construction Worker', icon: '🏗️' },
    { title: 'Electrician', icon: '⚡' },
    { title: 'Nurse', icon: '👩‍⚕️' },
    { title: 'Engineer', icon: '⚙️' },
    { title: 'Data Analyst', icon: '📈' },
    { title: 'Pharmacist', icon: '💊' },
    { title: 'Dentist', icon: '🦷' },
    { title: 'Lawyer', icon: '⚖️' },
    { title: 'Social Worker', icon: '🤝' },
    { title: 'Graphic Designer', icon: '🎨' },
    { title: 'Web Developer', icon: '🌐' },
    { title: 'Project Manager', icon: '📋' },
    { title: 'HR Manager', icon: '👥' },
    { title: 'Sales Representative', icon: '💰' },
    { title: 'Truck Driver', icon: '🚛' },
    { title: 'Plumber', icon: '🔧' },
    { title: 'Carpenter', icon: '🪚' },
    { title: 'Mechanic', icon: '🔩' },
    { title: 'Hair Stylist', icon: '✂️' },
    { title: 'Chef', icon: '👨‍🍳' },
    { title: 'Baker', icon: '🥐' },
    { title: 'Veterinarian', icon: '🐾' },
    { title: 'Physiotherapist', icon: '🏃' },
    { title: 'Psychologist', icon: '🧠' },
    { title: 'Financial Advisor', icon: '💵' },
    { title: 'Insurance Agent', icon: '📄' },
    { title: 'Travel Agent', icon: '✈️' },
    { title: 'Hotel Manager', icon: '🏨' },
    { title: 'Event Planner', icon: '🎉' },
    { title: 'Photographer', icon: '📷' },
    { title: 'Journalist', icon: '📰' },
    { title: 'Librarian', icon: '📖' },
    { title: 'Firefighter', icon: '🚒' },
    { title: 'Police Officer', icon: '👮' },
    { title: 'Paramedic', icon: '🚑' },
    { title: 'Childcare Worker', icon: '👶' },
    { title: 'Personal Trainer', icon: '💪' },
    { title: 'Cleaner', icon: '🧹' },
    { title: 'Landscaper', icon: '🌿' },
    { title: 'Painter', icon: '🖌️' },
    { title: 'Welder', icon: '🔥' },
    { title: 'Lab Technician', icon: '🔬' },
    { title: 'Radiologist', icon: '🩻' },
    { title: 'Dental Assistant', icon: '😁' },
    { title: 'Office Administrator', icon: '🗂️' },
    { title: 'Receptionist', icon: '📞' },
    { title: 'Supply Chain Manager', icon: '🏭' },
    { title: 'Quality Control', icon: '✅' },
  ]

  const questions = {
    'Software Developer': [
      'Tell me about yourself and your experience.',
      'What programming languages are you familiar with?',
      'Describe a challenging project you worked on.',
      'How do you stay updated with new technologies?',
      'Why do you want to work at our company?'
    ],
    'Customer Service': [
      'Tell me about yourself.',
      'How do you handle a difficult customer?',
      'Describe a time you went above and beyond for someone.',
      'How do you stay calm under pressure?',
      'Why do you want to work in customer service?'
    ],
    'Healthcare Worker': [
      'Tell me about yourself and your medical background.',
      'How do you handle a medical emergency?',
      'Describe a time you had to make a quick decision.',
      'How do you communicate with patients who are scared?',
      'Why did you choose healthcare as a career?'
    ],
    'Teacher': [
      'Tell me about yourself and your teaching experience.',
      'How do you handle a disruptive student in class?',
      'Describe your teaching style.',
      'How do you support students with different learning needs?',
      'Why do you want to teach at our school?'
    ],
    'Nurse': [
      'Tell me about your nursing experience.',
      'How do you prioritize tasks during a busy shift?',
      'Describe a difficult patient situation you handled.',
      'How do you communicate with doctors and other staff?',
      'Why did you choose nursing as a career?'
    ],
    'Accountant': [
      'Tell me about your accounting experience.',
      'How do you ensure accuracy in your work?',
      'Describe your experience with accounting software.',
      'How do you handle tight deadlines during tax season?',
      'Why do you want to work at our firm?'
    ],
    'Retail Worker': [
      'Tell me about yourself.',
      'How do you handle an angry customer?',
      'Describe a time you worked as part of a team.',
      'How do you stay motivated during slow periods?',
      'Are you comfortable working weekends and holidays?'
    ],
    'Restaurant Worker': [
      'Tell me about your restaurant experience.',
      'How do you handle multiple tables at once?',
      'Describe a time you dealt with a difficult customer.',
      'How do you work under pressure during busy hours?',
      'Are you comfortable working evenings and weekends?'
    ],
    'Driver': [
      'Tell me about your driving experience.',
      'Do you have a clean driving record?',
      'How do you handle long hours of driving?',
      'What would you do if your vehicle broke down?',
      'How do you plan routes efficiently?'
    ],
    'Security Guard': [
      'Tell me about your security experience.',
      'How would you handle a suspicious person?',
      'Describe a time you had to stay calm in a tense situation.',
      'Are you comfortable working night shifts?',
      'Do you have first aid or CPR certification?'
    ],
    'Chef': [
      'Tell me about your culinary experience.',
      'How do you handle a busy kitchen service?',
      'Describe your cooking style and specialties.',
      'How do you manage food safety and hygiene?',
      'How do you handle criticism about your food?'
    ],
    'Engineer': [
      'Tell me about your engineering background.',
      'Describe a complex problem you solved.',
      'How do you ensure quality in your work?',
      'Describe your experience working in a team.',
      'Where do you see engineering technology heading?'
    ],
    'Web Developer': [
      'Tell me about your web development experience.',
      'What frameworks and tools do you use?',
      'Describe a website or app you built.',
      'How do you ensure your code is clean and maintainable?',
      'How do you stay updated with web technologies?'
    ],
    'Data Analyst': [
      'Tell me about your data analysis experience.',
      'What tools do you use for data analysis?',
      'Describe a project where data helped make a decision.',
      'How do you present complex data to non-technical people?',
      'What is your experience with SQL and Excel?'
    ],
    'HR Manager': [
      'Tell me about your HR experience.',
      'How do you handle a conflict between two employees?',
      'Describe your recruitment process.',
      'How do you ensure company culture is maintained?',
      'What HR software are you familiar with?'
    ],
    'Project Manager': [
      'Tell me about your project management experience.',
      'How do you handle a project that is falling behind schedule?',
      'Describe a successful project you managed.',
      'How do you communicate with stakeholders?',
      'What project management tools do you use?'
    ],
    'Financial Advisor': [
      'Tell me about your financial advisory experience.',
      'How do you build trust with a new client?',
      'How do you explain complex financial concepts simply?',
      'Describe a time you helped a client reach their financial goal.',
      'How do you stay updated with financial regulations?'
    ],
    'Pharmacist': [
      'Tell me about your pharmacy experience.',
      'How do you handle a prescription error?',
      'How do you counsel patients about their medication?',
      'Describe how you handle a busy pharmacy.',
      'How do you stay updated with new medications?'
    ],
    'Social Worker': [
      'Tell me about your social work experience.',
      'How do you handle a high caseload?',
      'Describe a time you helped someone in crisis.',
      'How do you maintain professional boundaries?',
      'Why did you choose social work as a career?'
    ],
    'Graphic Designer': [
      'Tell me about your design experience.',
      'What design tools do you use?',
      'Describe your creative process.',
      'How do you handle client feedback on your designs?',
      'Show me an example of your best work and explain it.'
    ],
    'Marketing Manager': [
      'Tell me about your marketing experience.',
      'Describe a successful marketing campaign you ran.',
      'How do you measure the success of a campaign?',
      'How do you stay updated with digital marketing trends?',
      'How do you manage a marketing budget?'
    ],
    'Firefighter': [
      'Tell me about yourself.',
      'Why do you want to be a firefighter?',
      'How do you handle dangerous and stressful situations?',
      'Describe your physical fitness routine.',
      'How do you work as part of a team under pressure?'
    ],
    'Police Officer': [
      'Tell me about yourself.',
      'Why do you want to be a police officer?',
      'How do you handle a confrontational situation?',
      'Describe how you would interact with the community.',
      'How do you make decisions under pressure?'
    ],
    'Plumber': [
      'Tell me about your plumbing experience.',
      'What types of plumbing systems have you worked on?',
      'How do you diagnose a plumbing problem?',
      'Are you comfortable working in tight spaces?',
      'Do you have your plumbing license?'
    ],
    'Electrician': [
      'Tell me about your electrical experience.',
      'What types of electrical work have you done?',
      'How do you ensure safety when working with electricity?',
      'Do you have your electrical license?',
      'How do you read electrical blueprints?'
    ],
    'Office Administrator': [
      'Tell me about your administrative experience.',
      'What office software are you familiar with?',
      'How do you prioritize multiple tasks?',
      'Describe how you handle confidential information.',
      'How do you communicate with different departments?'
    ],
    'Receptionist': [
      'Tell me about yourself.',
      'How do you handle multiple phone calls at once?',
      'Describe how you greet and assist visitors.',
      'How do you handle a difficult or rude caller?',
      'What office software are you comfortable with?'
    ],
    'Childcare Worker': [
      'Tell me about your childcare experience.',
      'How do you handle a child who is upset or crying?',
      'Describe your approach to child development.',
      'How do you communicate with parents?',
      'Do you have first aid certification?'
    ],
    'Personal Trainer': [
      'Tell me about your fitness training experience.',
      'How do you create a workout plan for a new client?',
      'How do you motivate clients who want to give up?',
      'What certifications do you have?',
      'How do you handle a client injury during training?'
    ],
    'Hotel Manager': [
      'Tell me about your hospitality experience.',
      'How do you handle a guest complaint?',
      'Describe how you manage hotel staff.',
      'How do you ensure guest satisfaction?',
      'How do you handle overbooking situations?'
    ],
    'default': [
      'Tell me about yourself.',
      'What are your greatest strengths?',
      'What is your biggest weakness?',
      'Why do you want this job?',
      'Where do you see yourself in 5 years?'
    ]
  }

  const getQuestions = () => questions[jobType] || questions['default']

  const startInterview = (job) => {
    setJobType(job)
    setStage('interview')
    setCurrentQuestion(0)
    setAnswers([])
    speakQuestion(getQuestions()[0])
  }

  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Please use Google Chrome for speech recognition.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onresult = (event) => {
      setCurrentAnswer(event.results[0][0].transcript)
    }
    recognition.start()
  }

  const nextQuestion = () => {
    const newAnswers = [...answers, {
      question: getQuestions()[currentQuestion],
      answer: currentAnswer
    }]
    setAnswers(newAnswers)
    setCurrentAnswer('')

    if (currentQuestion + 1 < getQuestions().length) {
      setCurrentQuestion(prev => prev + 1)
      speakQuestion(getQuestions()[currentQuestion + 1])
    } else {
      generateFeedback(newAnswers)
    }
  }

  const generateFeedback = (allAnswers) => {
    setStage('feedback')
    const scores = allAnswers.map(a => ({
      question: a.question,
      answer: a.answer,
      score: a.answer.length > 50 ? Math.floor(Math.random() * 15) + 75 :
             a.answer.length > 20 ? Math.floor(Math.random() * 20) + 60 : 45,
      tip: a.answer.length > 50 ? 'Great detailed answer!' :
           a.answer.length > 20 ? 'Good answer, try to add more details.' :
           'Try to give longer, more detailed answers.'
    }))

    const avgScore = Math.floor(scores.reduce((a, b) => a + b.score, 0) / scores.length)
    setFeedback({ scores, avgScore })
  }

  return (
    <div className="min-h-screen bg-[#EAF4EC]">

      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">BridgeVoice</h1>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">← Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {stage === 'intro' && (
          <div>
            <div className="text-center mb-8">
              <p className="text-5xl mb-4">💼</p>
              <h2 className="text-2xl font-bold text-gray-700">Interview Simulator</h2>
              <p className="text-gray-500 mt-2">Practice real job interview questions with AI feedback</p>
            </div>

            <h3 className="font-bold text-gray-700 mb-4">Select Job Type:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {jobTypes.map((job, i) => (
                <button
                  key={i}
                  onClick={() => startInterview(job.title)}
                  className="bg-white rounded-xl p-5 text-center hover:shadow-md transition border-2 border-transparent hover:border-blue-200"
                >
                  <p className="text-3xl mb-2">{job.icon}</p>
                  <p className="font-medium text-gray-700 text-sm">{job.title}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === 'interview' && (
          <div>
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-600">Question {currentQuestion + 1} of {getQuestions().length}</p>
                <p className="text-sm text-blue-600 font-medium">{jobType}</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestion) / getQuestions().length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-blue-600 rounded-2xl p-6 mb-6 text-white">
              <p className="text-sm text-blue-200 mb-2">🤖 Interviewer</p>
              <p className="text-xl font-medium">{getQuestions()[currentQuestion]}</p>
              <button
                onClick={() => speakQuestion(getQuestions()[currentQuestion])}
                className="mt-3 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg text-sm transition"
              >
                🔊 Hear question again
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <p className="font-semibold text-gray-700 mb-3">Your Answer:</p>
              <textarea
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer or use the microphone..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={startListening}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition font-medium ${
                    listening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                  }`}
                >
                  🎤 {listening ? 'Listening...' : 'Speak Answer'}
                </button>

                <button
                  onClick={nextQuestion}
                  disabled={!currentAnswer.trim()}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
                >
                  {currentQuestion + 1 === getQuestions().length ? 'Finish Interview 🎉' : 'Next Question →'}
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4">
              <p className="font-semibold text-yellow-700 mb-2">💡 Tips:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use the STAR method: Situation, Task, Action, Result</li>
                <li>• Speak clearly and at a moderate pace</li>
                <li>• Give specific examples from your experience</li>
                <li>• Stay positive and confident!</li>
              </ul>
            </div>
          </div>
        )}

        {stage === 'feedback' && feedback && (
          <div>
            <div className="text-center mb-8">
              <p className="text-5xl mb-4">🎉</p>
              <h2 className="text-2xl font-bold text-gray-700">Interview Complete!</h2>
              <div className={`text-5xl font-bold mt-4 ${
                feedback.avgScore >= 80 ? 'text-green-600' :
                feedback.avgScore >= 60 ? 'text-orange-500' : 'text-red-500'
              }`}>
                {feedback.avgScore}%
              </div>
              <p className="text-gray-500 mt-2">
                {feedback.avgScore >= 80 ? 'Excellent! You are interview ready! 🌟' :
                 feedback.avgScore >= 60 ? 'Good effort! Keep practicing! 💪' :
                 'Keep going! Practice makes perfect! 🎯'}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {feedback.scores.map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
                  <p className="font-semibold text-gray-700 mb-2">Q{i + 1}: {item.question}</p>
                  <p className="text-gray-500 text-sm mb-3 bg-gray-50 rounded-lg p-3">
                    Your answer: "{item.answer || 'No answer given'}"
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-blue-600">{item.tip}</p>
                    <span className={`font-bold ${
                      item.score >= 80 ? 'text-green-600' :
                      item.score >= 60 ? 'text-orange-500' : 'text-red-500'
                    }`}>{item.score}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStage('intro')}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
              >
                Practice Again 🔄
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-white text-blue-600 border-2 border-blue-600 py-3 rounded-xl hover:bg-blue-50 transition font-semibold"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default InterviewSimulator