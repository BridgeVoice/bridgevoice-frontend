// Selects a gender-appropriate browser voice from the available system voices.
// Called in the browser TTS fallback (when Groq TTS is unavailable).

const FEMALE_TERMS = [
  'samantha', 'victoria', 'zira', 'karen', 'moira', 'fiona',
  'tessa', 'hazel', 'female', 'woman',
  'google uk english female', 'microsoft zira',
  'microsoft hazel', 'alice', 'amelie', 'anna',
]

const MALE_TERMS = [
  'david', 'mark', 'daniel', 'thomas', 'fred', 'alex', 'jorge',
  'male', 'man',
  'google uk english male', 'microsoft david',
  'microsoft mark', 'luca', 'diego',
]

// Voices are loaded asynchronously in some browsers — this waits for them.
function loadVoices() {
  return new Promise(resolve => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) return resolve(voices)
    window.speechSynthesis.addEventListener(
      'voiceschanged',
      () => resolve(window.speechSynthesis.getVoices()),
      { once: true }
    )
    // Safety timeout — proceed with empty list after 800ms
    setTimeout(() => resolve(window.speechSynthesis.getVoices() || []), 800)
  })
}

/**
 * Returns the best available browser SpeechSynthesisVoice for the given gender.
 * Falls back to null if no match found (browser will use its default voice).
 *
 * @param {boolean} isFemale
 * @returns {Promise<SpeechSynthesisVoice|null>}
 */
export async function getBrowserVoice(isFemale) {
  const voices = await loadVoices()
  const terms  = isFemale ? FEMALE_TERMS : MALE_TERMS

  // 1st priority: language-matched English voice with gender keyword
  const enMatch = voices.find(v =>
    v.lang.startsWith('en') &&
    terms.some(t => v.name.toLowerCase().includes(t))
  )
  if (enMatch) return enMatch

  // 2nd priority: any voice with gender keyword
  const anyMatch = voices.find(v =>
    terms.some(t => v.name.toLowerCase().includes(t))
  )
  return anyMatch || null
}

/**
 * Browser pitch/rate per character — used when no gendered voice is found.
 * Values are exaggerated enough to sound clearly different.
 */
export const BROWSER_VOICE_SETTINGS = {
  happy:        { pitch: 1.7, rate: 1.02 },  // clearly female, upbeat
  professional: { pitch: 1.45, rate: 0.88 }, // clearly female, measured
  stern:        { pitch: 0.60, rate: 0.82 }, // clearly male, slow
  friendly:     { pitch: 0.82, rate: 0.95 }, // male, relaxed
}
