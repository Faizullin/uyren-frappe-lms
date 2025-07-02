import { frappeProxy } from './frappeProxy.js'
import { lucideIcons } from './lucideIcons.js'
import { buildConfig } from './buildConfig.js'

function frappeuiPlugin(options) {
	let plugins = []
	const mergedOptions = {
		lucideIcons: true,
		frappeProxy: true,
		frappeTypes: true,
		jinjaBootData: true,
		buildConfig: true,
		...options,
	}
	if (mergedOptions.lucideIcons) {
		plugins.push(lucideIcons(mergedOptions.lucideIcons))
	}
	if (mergedOptions.frappeProxy) {
		plugins.push(frappeProxy(mergedOptions.frappeProxy, mergedOptions.envConfig))
	}
	//   if (mergedOptions.frappeTypes) {
	//     plugins.push(frappeTypes(mergedOptions.frappeTypes))
	//   }
	//   if (mergedOptions.jinjaBootData) {
	//     plugins.push(jinjaBootData(mergedOptions.jinjaBootData))
	//   }
	  if (mergedOptions.buildConfig) {
	    plugins.push(buildConfig(mergedOptions.buildConfig))
	  }
	return plugins
}

export default frappeuiPlugin
