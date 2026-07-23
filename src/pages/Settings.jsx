import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import CharacterAvatar from '../components/characters/CharacterAvatar'
import { CHARACTERS } from '../components/characters/characterData'
import { getCharacterPreference, setCharacterPreference } from '../utils/characterPreference'
import { getBrowserVoice, BROWSER_VOICE_SETTINGS } from '../utils/browserVoice'
import { useVoicePlayback } from '../utils/useVoicePlayback'

function Settings() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState(getCharacterPreference())
  const [previewSpeaking, setPreviewSpeaking] = useState(null)
  const [previewWord, setPreviewWord]       = useState(null)
  // Shared voice control — owns audioRef/wordTimerRef and stops speech on unmount
  const { audioRef, wordTimerRef, stopSpeaking } = useVoicePlayback(() => {
    setPreviewSpeaking(null)
    setPreviewWord(null)
  })

  const [settings, setSettings] = useState({
    emailNotifications: true,
    practiceReminder: true,
    reminderTime: '09:00',
    soundEffects: true,
    autoSpeak: true,
    language: 'English',
    privacy: 'public',
    dailyGoal: '3',
  })

  const handleToggle  = (key)        => setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  const handleChange  = (key, value) => setSettings(prev => ({ ...prev, [key]: value }))

  const handleSelectCharacter = (id) => {
    setSelectedCharacter(id)
    setCharacterPreference(id)
  }

  const handlePreview = async (character) => {
    // Stop any preview already playing (both Groq audio and browser speech)
    stopSpeaking()

    const startTaps = (charId) => {
      const tap = () => {
        setPreviewWord(charId)
        wordTimerRef.current = setTimeout(() => {
          setPreviewWord(null)
          wordTimerRef.current = setTimeout(tap, 180)
        }, 160)
      }
      tap()
    }
    const stopTaps = () => { clearTimeout(wordTimerRef.current); setPreviewWord(null) }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/tts', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text: character.sampleLine, personality: character.id }),
      })
      if (res.ok && res.status !== 204) {
        const blob  = await res.blob()
        const url   = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audioRef.current = audio
        audio.onplay  = () => { setPreviewSpeaking(character.id); startTaps(character.id) }
        audio.onended = () => { setPreviewSpeaking(null); stopTaps(); URL.revokeObjectURL(url) }
        audio.onerror = () => { setPreviewSpeaking(null); stopTaps() }
        audio.play()
        return
      }
    } catch { /* fall through */ }

    // Browser fallback — pick gendered voice by name
    if (!('speechSynthesis' in window)) return
    const isFemale      = ['happy', 'professional'].includes(character.id)
    const genderedVoice = await getBrowserVoice(isFemale)
    const vs            = BROWSER_VOICE_SETTINGS[character.id] || character.voice
    const utterance      = new SpeechSynthesisUtterance(character.sampleLine)
    if (genderedVoice) utterance.voice = genderedVoice
    utterance.pitch      = vs.pitch
    utterance.rate       = vs.rate
    utterance.onstart    = () => setPreviewSpeaking(character.id)
    utterance.onboundary = (e) => {
      if (e.name !== 'word') return
      setPreviewWord(character.id)
      clearTimeout(wordTimerRef.current)
      wordTimerRef.current = setTimeout(() => setPreviewWord(null), 160)
    }
    utterance.onend  = () => { setPreviewSpeaking(null); setPreviewWord(null) }
    utterance.onerror = () => { setPreviewSpeaking(null); setPreviewWord(null) }
    window.speechSynthesis.speak(utterance)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDeleteAccount = () => {
    stopSpeaking()
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone!')) {
      localStorage.clear()
      navigate('/')
    }
  }

  const Toggle = ({ keyName }) => (
    <button
      onClick={() => handleToggle(keyName)}
      className={`w-12 h-6 rounded-full transition-colors relative ${
        settings[keyName] ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-300 dark:bg-gray-700'
      }`}
    >
      <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-transform ${
        settings[keyName] ? 'translate-x-7' : 'translate-x-1'
      }`}></div>
    </button>
  )

  const SettingRow = ({ label, desc, children }) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-800 last:border-0">
      <div>
        <p className="font-medium text-gray-800 dark:text-gray-200">{label}</p>
        {desc && <p className="text-sm text-gray-500 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">⚙️ Settings</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Customize your BridgeVoice experience</p>
        </div>

        {saved && (
          <div className="bg-green-100 dark:bg-green-900 dark:bg-opacity-30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl mb-6 font-medium">
            ✅ Settings saved successfully!
          </div>
        )}

        <div className="space-y-4">

          {/* ── NOTIFICATIONS ── */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">🔔 Notifications</h3>
            <SettingRow label="Email Notifications" desc="Receive progress updates by email">
              <Toggle keyName="emailNotifications" />
            </SettingRow>
            <SettingRow label="Daily Practice Reminder" desc="Get reminded to practice every day">
              <Toggle keyName="practiceReminder" />
            </SettingRow>
            {settings.practiceReminder && (
              <SettingRow label="Reminder Time" desc="When to remind you">
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={e => handleChange('reminderTime', e.target.value)}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </SettingRow>
            )}
          </div>

          {/* ── AUDIO ── */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">🔊 Audio</h3>
            <SettingRow label="Sound Effects" desc="Play sounds for achievements">
              <Toggle keyName="soundEffects" />
            </SettingRow>
            <SettingRow label="Auto Speak AI Responses" desc="AI reads responses aloud">
              <Toggle keyName="autoSpeak" />
            </SettingRow>
          </div>

          {/* ── AI COACH CHARACTER ── */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">🎭 AI Coach Character</h3>
            <p className="text-sm text-gray-500 mb-5">
              Choose your coach's personality. This changes both the character's look <span className="text-purple-600 dark:text-purple-400">and</span> how the AI talks to you in Chat and Interview practice.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHARACTERS.map(char => {
                const isSelected = selectedCharacter === char.id
                const isSpeaking = previewSpeaking === char.id
                const isWord     = previewWord === char.id

                return (
                  <div
                    key={char.id}
                    onClick={() => handleSelectCharacter(char.id)}
                    className={`cursor-pointer rounded-2xl p-4 flex gap-4 items-center transition border ${
                      isSelected
                        ? 'border-purple-500 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30'
                        : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 hover:border-gray-400 dark:hover:border-gray-600'
                    }`}
                  >
                    {/* live animated avatar */}
                    <CharacterAvatar
                      personality={char.id}
                      isSpeaking={isSpeaking}
                      speakingWord={isWord}
                      size={68}
                      className="flex-shrink-0 drop-shadow"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{char.emoji} {char.name}</p>
                        {isSelected && (
                          <span className="text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium mb-1" style={{ color: char.accentColor }}>{char.tagline}</p>
                      <p className="text-xs text-gray-500 leading-snug mb-2">{char.description}</p>
                      <button
                        onClick={e => { e.stopPropagation(); handlePreview(char) }}
                        disabled={isSpeaking}
                        className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-1 rounded-full transition border border-gray-300 dark:border-gray-700 disabled:opacity-60"
                      >
                        {isSpeaking ? '🔊 Speaking…' : '🔊 Hear voice'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-600 mt-4 text-center">
              Your choice is saved instantly — no need to click Save Settings below.
            </p>
          </div>

          {/* ── LEARNING ── */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">🎯 Learning</h3>
            <SettingRow label="Daily Session Goal" desc="How many sessions per day">
              <select
                value={settings.dailyGoal}
                onChange={e => handleChange('dailyGoal', e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
              >
                <option value="1">1 session</option>
                <option value="2">2 sessions</option>
                <option value="3">3 sessions</option>
                <option value="5">5 sessions</option>
                <option value="10">10 sessions</option>
              </select>
            </SettingRow>
            <SettingRow label="Interface Language" desc="Language for menus and buttons">
              <select
                value={settings.language}
                onChange={e => handleChange('language', e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Mandarin</option>
                <option>Arabic</option>
                <option>Spanish</option>
                <option>Punjabi</option>
                <option>French</option>
              </select>
            </SettingRow>
          </div>

          {/* ── PRIVACY ── */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">🔒 Privacy</h3>
            <SettingRow label="Profile Visibility" desc="Who can see your profile">
              <select
                value={settings.privacy}
                onChange={e => handleChange('privacy', e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
              >
                <option value="public">Everyone</option>
                <option value="buddies">Study Buddies Only</option>
                <option value="private">Private</option>
              </select>
            </SettingRow>
          </div>

          {/* ── ACCOUNT ── */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">🔑 Account</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 font-medium">
                🔒 Change Password
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 font-medium">
                📧 Change Email
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 font-medium">
                📥 Download My Data
              </button>
            </div>
          </div>

          {/* ── DANGER ZONE ── */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-red-600 dark:text-red-400 mb-4">⚠️ Danger Zone</h3>
            <button
              onClick={handleDeleteAccount}
              className="w-full text-left px-4 py-3 rounded-xl border border-red-300 dark:border-red-900 hover:border-red-500 dark:hover:border-red-700 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition text-red-600 dark:text-red-400 font-medium"
            >
              🗑️ Delete Account
            </button>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-purple-300 dark:shadow-purple-900"
          >
            Save Settings ✅
          </button>

        </div>
      </div>
    </Layout>
  )
}

export default Settings