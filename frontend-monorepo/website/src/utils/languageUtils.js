/**
 * Centralized language management utilities
 */

// Available languages
export const AVAILABLE_LANGUAGES = ['en', 'kk', 'ru']

// Default language
export const DEFAULT_LANGUAGE = 'en'

/**
 * Get the current preferred language from multiple sources
 * Priority: 1. Cookie 2. Browser language 3. Default
 * @returns {string} Current language code
 */
export function getCurrentLanguage() {
  // First check cookies
  const cookieLanguage = getLanguageFromCookie()
  if (cookieLanguage && AVAILABLE_LANGUAGES.includes(cookieLanguage)) {
    return cookieLanguage
  }

  // Then check browser language preferences
  const browserLanguage = getBrowserLanguage()
  if (browserLanguage && AVAILABLE_LANGUAGES.includes(browserLanguage)) {
    return browserLanguage
  }

  // Fall back to default
  return DEFAULT_LANGUAGE
}

/**
 * Get language from cookie
 * @returns {string|null} Language code from cookie or null
 */
function getLanguageFromCookie() {
  const cookies = document.cookie.split(';')
  const langCookie = cookies.find(cookie =>
    cookie.trim().startsWith('preferred_language=')
  )

  if (langCookie) {
    return langCookie.split('=')[1].trim()
  }

  return null
}

/**
 * Get browser's preferred language
 * @returns {string|null} Browser language code or null
 */
function getBrowserLanguage() {
  // Check navigator languages in order of preference
  const languages = navigator.languages || [navigator.language || navigator.userLanguage]

  for (const lang of languages) {
    // Extract primary language code (e.g., 'en-US' -> 'en')
    const primaryLang = lang.split('-')[0].toLowerCase()
    if (AVAILABLE_LANGUAGES.includes(primaryLang)) {
      return primaryLang
    }
  }

  return null
}

/**
 * Set the preferred language in cookies, replacing any existing preference
 * @param {string} lang - Language code to set
 * @param {boolean} reload - Whether to reload the page (default: false)
 */
export function setLanguage(lang, reload = false) {
  if (!AVAILABLE_LANGUAGES.includes(lang)) {
    console.warn(`Language "${lang}" is not supported. Available languages: ${AVAILABLE_LANGUAGES.join(', ')}`)
    return false
  }

  const currentLang = getCurrentLanguage()
  if (lang === currentLang) {
    return true // No change needed, but successful
  }

  const previousLang = getLanguageFromCookie()

  // Remove existing language cookie if it exists
  if (previousLang) {
    removeCookie('preferred_language')
  }

  // Set new cookie with 1 year expiration
  const expireDate = new Date()
  expireDate.setFullYear(expireDate.getFullYear() + 1)

  // Update document language attribute
  document.documentElement.lang = lang

  // Set new cookie with proper expiration and path
  document.cookie = `preferred_language=${lang}; expires=${expireDate.toUTCString()}; path=/; SameSite=Lax`

  // Verify cookie was set
  const newLang = getLanguageFromCookie()
  if (newLang === lang) {
    // Reload the page if requested
    window.location.reload()
    return true
  } else {
    console.error('Failed to set language preference cookie')
    return false
  }
}

/**
 * Remove a cookie by name
 * @param {string} name - Cookie name to remove
 */
function removeCookie(name) {
  // Set cookie to expire in the past to delete it
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

/**
 * Initialize language on app startup with intelligent detection
 * This can be called in main.js or app setup
 */
export function initializeLanguage() {
  const currentLang = getCurrentLanguage()
  const cookieLang = getLanguageFromCookie()
  const browserLang = getBrowserLanguage()

  // If no cookie exists but browser language is supported, set it as preference
  if (!cookieLang && browserLang && AVAILABLE_LANGUAGES.includes(browserLang)) {
    setLanguage(browserLang, false) // Don't reload during initialization
  }

  // Update document language attribute
  document.documentElement.lang = currentLang

  return currentLang
}

/**
 * Get available languages with their display names
 * @returns {Array} Array of language objects with code and name
 */
export function getAvailableLanguages() {
  const languageNames = {
    'en': 'English',
    'kk': 'Қазақша',
    'ru': 'Русский'
  }

  return AVAILABLE_LANGUAGES.map(code => ({
    code,
    name: languageNames[code] || code.toUpperCase(),
    isDefault: code === DEFAULT_LANGUAGE,
    isCurrent: code === getCurrentLanguage()
  }))
}

/**
 * Check if a language is supported
 * @param {string} lang - Language code to check
 * @returns {boolean} Whether the language is supported
 */
export function isLanguageSupported(lang) {
  return AVAILABLE_LANGUAGES.includes(lang)
}

/**
 * Get language display name
 * @param {string} lang - Language code
 * @returns {string} Display name for the language
 */
export function getLanguageDisplayName(lang) {
  const languageNames = {
    'en': 'English',
    'kk': 'Қазақша',
    'ru': 'Русский'
  }

  return languageNames[lang] || lang.toUpperCase()
}
