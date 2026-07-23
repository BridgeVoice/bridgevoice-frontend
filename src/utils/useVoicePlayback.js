import { useEffect, useRef } from 'react'

/**
 * Shared voice-playback control for every page that speaks
 * (Chat, Interview Simulator, Settings preview).
 *
 * WHY THIS EXISTS
 * ---------------
 * Both speech paths outlive the React component that started them:
 *   1. `new Audio(...)`      — the Groq/Orpheus TTS blob player
 *   2. `window.speechSynthesis` — a browser-wide singleton
 *
 * If they are not cancelled when the component unmounts, the voice keeps
 * talking after the user navigates to another page. This hook owns the
 * refs and registers the unmount cleanup so each page doesn't repeat it.
 *
 * USAGE
 * -----
 *   const { audioRef, wordTimerRef, stopSpeaking } =
 *     useVoicePlayback(() => { setIsSpeaking(false); setSpeakingWord(false) })
 *
 * Then call stopSpeaking() at the start of any speak function, and in any
 * button handler that navigates away or moves to a new section.
 *
 * @param {Function} onStop - resets this page's speaking-related state.
 *                            Each page names its state differently, so the
 *                            reset is passed in rather than assumed here.
 */
export function useVoicePlayback(onStop) {
  // The <audio> element currently playing Groq TTS (null when idle)
  const audioRef = useRef(null)
  // Timer driving the avatar's mouth-tap animation
  const wordTimerRef = useRef(null)
  // Keeps the latest onStop without re-registering the unmount effect
  const onStopRef = useRef(onStop)
  onStopRef.current = onStop

  // Stops BOTH speech paths and clears the animation timer.
  // Safe to call at any time, including when nothing is playing.
  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    window.speechSynthesis?.cancel()
    clearTimeout(wordTimerRef.current)
    onStopRef.current?.()
  }

  // Runs when the component is destroyed — i.e. the user navigated away
  // via the sidebar, a button, or the browser back arrow.
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      window.speechSynthesis?.cancel()
      clearTimeout(wordTimerRef.current)
    }
  }, [])

  return { audioRef, wordTimerRef, stopSpeaking }
}
