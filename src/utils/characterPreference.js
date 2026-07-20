import { DEFAULT_CHARACTER_ID } from '../components/characters/characterData'

const STORAGE_KEY = 'bridgevoice_character'

export function getCharacterPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_CHARACTER_ID
  } catch {
    return DEFAULT_CHARACTER_ID
  }
}

export function setCharacterPreference(id) {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // fail silently in private browsing
  }
}
