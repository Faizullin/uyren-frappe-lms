

export const getGlobalSettings = () => {
	const meta_settings = {
		API_HOST: import.meta.env.VITE_APP_API_HOST,
		SOCKET_HOST: import.meta.env.VITE_APP_SOCKET_HOST,
		BASE_API_URL: "http://localhost:8000",
	}
	const keys = Object.keys(meta_settings)
	for (const key of keys) {
		if (!meta_settings[key]) {
			throw new Error(
				`Global setting ${key} is not defined. Please check your environment variables or configuration.`,
			)
		}
	}
	meta_settings["BASE_API_URL"] = getBaseApiUrl(meta_settings.API_HOST)
	return meta_settings
}
const getBaseApiUrl = (baseHost) => {
	const protocol = window.location.protocol
	return `${protocol}//${baseHost}`
}
