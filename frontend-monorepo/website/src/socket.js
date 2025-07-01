import { io } from 'socket.io-client'
import { getCachedListResource } from '@mono/frappe-ui/src/resources/listResource'
import { getCachedResource } from '@mono/frappe-ui/src/resources/resources'
import { getGlobalSettings } from '@mono/frappe-ui/src/utils/global_settings'

export function initSocket() {
  const conf = getGlobalSettings()
  let host = conf.SOCKET_HOST
  let siteName = window.site_name || host
  let protocol = window.location.protocol;
  let url = `${protocol}//${host}/${siteName}`
  console.log('Connecting to socket:', url)

  let socket = io(url, {
    withCredentials: true,
    reconnectionAttempts: 5,
  })
  socket.on('refetch_resource', (data) => {
    if (data.cache_key) {
      let resource =
        getCachedResource(data.cache_key) ||
        getCachedListResource(data.cache_key)
      if (resource) {
        resource.reload()
      }
    }
  })
  return socket
}
