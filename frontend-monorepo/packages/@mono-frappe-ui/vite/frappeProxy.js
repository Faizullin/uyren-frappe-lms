

export function frappeProxy({
	port = 8080,
	source = '^/(app|login|api|assets|files|private)',
} = {}, envConfig = {}) {
	const serverBaseUrl = envConfig.VITE_APP_ABS_API_URL;

	let proxy = {}
	proxy[source] = {
		target: serverBaseUrl,
		ws: true,
		// router: function (req) {
		//   const site_name = req.headers.host.split(':')[0]
		//   return `http://${site_name}:${webserver_port}`
		// },
	}

	return {
		name: 'frappeui-proxy-plugin',
		config: () => ({
			server: {
				port: port,
				proxy: proxy,
			},
		}),
	}
}
