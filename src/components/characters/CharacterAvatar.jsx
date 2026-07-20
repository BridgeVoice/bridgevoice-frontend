// CharacterAvatar — photorealistic portrait with calibrated CSS mouth overlay
//
// Photos live in:  bridgevoice-frontend/public/characters/
//   happy.jpg | stern.jpg | professional.jpg | friendly.jpg
//
// Props:
//   personality  – 'happy' | 'stern' | 'professional' | 'friendly'
//   isSpeaking   – true while audio plays  (drives glow ring + waveform bars)
//   speakingWord – true ~160ms per word    (drives mouth open/close)
//   size         – frame diameter in px (default 120)
//   className    – extra CSS classes

import { useState } from 'react'
import { getCharacterById } from './characterData'

// Minimal fallback shown only if the photo file is missing
function FallbackSVG({ personality }) {
  const palette = {
    happy:        { face: '#e8b090', top: '#f59e0b' },
    stern:        { face: '#c8906a', top: '#334155' },
    professional: { face: '#d49060', top: '#1e3a5f' },
    friendly:     { face: '#dda070', top: '#0d9488' },
  }
  const c = palette[personality] || palette.friendly
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="50" cy="40" r="28" fill={c.face}/>
      <path d="M15,100 C15,70 30,60 50,58 C70,60 85,70 85,100 Z" fill={c.top}/>
      <ellipse cx="41" cy="40" rx="5" ry="4" fill="white"/>
      <ellipse cx="59" cy="40" rx="5" ry="4" fill="white"/>
      <circle cx="41" cy="40" r="2.5" fill="#222"/>
      <circle cx="59" cy="40" r="2.5" fill="#222"/>
      <path d="M40,52 Q50,60 60,52" stroke="#8b4513" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

function CharacterAvatar({
  personality  = 'friendly',
  isSpeaking   = false,
  speakingWord = false,
  size         = 120,
  className    = '',
}) {
  const [imgError, setImgError] = useState(false)
  const character = getCharacterById(personality)

  return (
    <div
      className={`char-avatar ${className}`}
      style={{ '--char-accent': character.accentColor }}
    >
      {/* ── Portrait frame ── */}
      <div
        className={`char-frame ${isSpeaking ? 'is-speaking' : ''}`}
        style={{ width: size, height: size }}
      >
        {imgError ? (
          <FallbackSVG personality={personality} />
        ) : (
          <img
            src={character.photo}
            alt={`${character.coachName} — ${character.name} AI coach`}
            className="char-photo"
            onError={() => setImgError(true)}
            draggable={false}
          />
        )}

        {/* ── Mouth overlay — position calibrated per character ── */}
        {!imgError && (
          <div
            className={`char-mouth ${speakingWord ? 'is-open' : ''}`}
            style={{ top: `${character.mouthTop}%` }}
          />
        )}
      </div>

      {/* ── Animated waveform bars while speaking ── */}
      <div className={`char-bars ${isSpeaking ? 'visible' : ''}`}>
        {[0,1,2,3,4].map(i => (
          <div key={i} className="char-bar" />
        ))}
      </div>
    </div>
  )
}

export default CharacterAvatar
