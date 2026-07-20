// Character metadata — used by CharacterAvatar, Settings, Chat, InterviewSimulator

export const CHARACTERS = [
  {
    id: 'happy',
    name: 'Happy',
    coachName: 'Maya',
    emoji: '😊',
    tagline: 'Upbeat & encouraging',
    description: 'Energetic and full of encouragement — great for everyday practice.',
    accentColor: '#f59e0b',
    sampleLine: 'Hi there! I am so excited to practice English with you today. You are doing amazing!',
    photo: '/characters/happy.jpg',
    mouthTop: 61,          // % from top — calibrated to this specific photo
    groqVoice: 'hannah',
    groqDirection: '[cheerful] ',
    voice: { pitch: 1.3, rate: 1.05 },
    llmTone: 'You are enthusiastic, warm, and very encouraging. Use exclamation points, celebrate every effort, and keep energy high. Your coach name is Maya.',
  },
  {
    id: 'stern',
    name: 'Stern',
    coachName: 'Dr. Reed',
    emoji: '🎓',
    tagline: 'Serious & strict',
    description: 'Direct and no-nonsense — pushes you to be precise and prepared.',
    accentColor: '#64748b',
    sampleLine: 'Let us begin. Listen carefully and answer with precision.',
    photo: '/characters/stern.jpg',
    mouthTop: 64,
    groqVoice: 'austin',
    groqDirection: '',
    voice: { pitch: 0.75, rate: 0.82 },
    llmTone: 'You are strict, precise, and formal. Correct errors firmly but fairly. Do not use casual language or emojis. Your coach name is Dr. Reed.',
  },
  {
    id: 'professional',
    name: 'Professional',
    coachName: 'Alex',
    emoji: '💼',
    tagline: 'Polished & confident',
    description: 'Calm, businesslike tone — the default for interview practice.',
    accentColor: '#3b82f6',
    sampleLine: 'Good day. Let us get started with your practice session.',
    photo: '/characters/professional.jpg',
    mouthTop: 64,
    groqVoice: 'diana',      // female voice — matches photo
    groqDirection: '',
    voice: { pitch: 1.1, rate: 0.88 },
    llmTone: 'You are calm, polished, and businesslike. Use clear professional English. Keep responses focused and structured. Your coach name is Alex.',
  },
  {
    id: 'friendly',
    name: 'Friendly',
    coachName: 'Sam',
    emoji: '🤝',
    tagline: 'Warm & approachable',
    description: 'Relaxed and supportive — like chatting with a patient friend.',
    accentColor: '#0d9488',
    sampleLine: 'Hey! No pressure at all. Let us just chat and have some fun with it.',
    photo: '/characters/friendly.jpg',
    mouthTop: 63,
    groqVoice: 'troy',       // male voice — matches photo
    groqDirection: '',
    voice: { pitch: 0.9, rate: 0.95 },
    llmTone: 'You are relaxed, supportive, and conversational. Use casual language, contractions, and a warm tone. Your coach name is Sam.',
  },
]

export const DEFAULT_CHARACTER_ID = 'friendly'

export function getCharacterById(id) {
  return CHARACTERS.find(c => c.id === id) || CHARACTERS.find(c => c.id === DEFAULT_CHARACTER_ID)
}
