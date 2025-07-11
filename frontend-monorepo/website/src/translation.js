import { createResource } from '@mono/mono-frappe-ui'
import { getCurrentLanguage } from './utils/languageUtils'

export default function translationPlugin(app) {
	app.config.globalProperties.__ = translate
	window.__ = translate
	if (!window.translatedMessages) {
		const language = getCurrentLanguage()
		fetchTranslations(language)
	}
}

function translate(message) {
	let translatedMessages = window.translatedMessages || {}
	let translatedMessage = translatedMessages[message] || message

	const hasPlaceholders = /{\d+}/.test(message)
	if (!hasPlaceholders) {
		return translatedMessage
	}
	return {
		format: function (...args) {
			return translatedMessage.replace(
				/{(\d+)}/g,
				function (match, number) {
					return typeof args[number] != 'undefined'
						? args[number]
						: match
				}
			)
		},
	}
}

function fetchTranslations(lang) {
	createResource({
		url: 'lms.lms.api.get_translations?lang=' + lang,
		cache: 'translations',
		auto: true,
		transform: (data) => {
			window.translatedMessages = data
		},
	})
}
