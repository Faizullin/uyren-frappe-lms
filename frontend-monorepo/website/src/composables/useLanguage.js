/**
 * Vue composable for language management
 */
import { ref, onMounted } from 'vue'
import { AVAILABLE_LANGUAGES, getCurrentLanguage, setLanguage } from '@/utils/languageUtils'

export function useLanguage() {
  const currentLanguage = ref(getCurrentLanguage())
  const availableLanguages = AVAILABLE_LANGUAGES

  // Update current language on mount
  onMounted(() => {
    currentLanguage.value = getCurrentLanguage()
  })

  /**
   * Change the current language
   * @param {string} lang - Language code to set
   */
  const changeLanguage = (lang) => {
    setLanguage(lang)
  }

  /**
   * Check if a language is currently selected
   * @param {string} lang - Language code to check
   * @returns {boolean}
   */
  const isCurrentLanguage = (lang) => {
    return currentLanguage.value === lang
  }

  return {
    currentLanguage,
    availableLanguages,
    changeLanguage,
    isCurrentLanguage
  }
}
