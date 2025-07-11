import './index.css'
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import { createPinia } from 'pinia'
// import dayjs from '@/utils/dayjs'
import { createDialog } from '@/utils/dialogs.js'
import {initializeLanguage} from '@/utils/languageUtils.js'
import translationPlugin from './translation'
import { usersStore } from './stores/user'
import { initSocket } from './socket.js'
import { FrappeUI, setConfig, frappeRequest, pageMetaPlugin, dayjs } from '@mono/mono-frappe-ui'

initializeLanguage()
const pinia = createPinia()
const app = createApp(App)
setConfig('resourceFetcher', frappeRequest)

app.use(FrappeUI)
app.use(pinia)
app.use(router)
app.use(translationPlugin)
app.use(pageMetaPlugin)
app.provide('$dayjs', dayjs)
app.provide('$socket', initSocket())
app.mount('#app')

const { userResource, allUsers } = usersStore()
app.provide('$user', userResource)
app.provide('$allUsers', allUsers)

app.config.globalProperties.$user = userResource
app.config.globalProperties.$dialog = createDialog
