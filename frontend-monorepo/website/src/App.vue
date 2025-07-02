<template>
  <FrappeUIProvider>
    <Layout>
      <div class="text-base">
        <router-view />
        <ChatWidget />
      </div>
    </Layout>
    <Dialogs />
  </FrappeUIProvider>
</template>
<script setup>
import { FrappeUIProvider } from '@mono/mono-frappe-ui'
import { Dialogs } from '@/utils/dialogs'
import { computed, onUnmounted, ref, watch } from 'vue'
import { useScreenSize } from './utils/composables'
import DesktopLayout from './components/DesktopLayout.vue'
import MobileLayout from './components/MobileLayout.vue'
import NoSidebarLayout from './components/NoSidebarLayout.vue'
import { usersStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { posthogSettings } from '@/telemetry'


import ChatWidget from '@/components/front/ChatWidget.vue'


const screenSize = useScreenSize()
const router = useRouter()
const noSidebar = ref(false)
const { userResource } = usersStore()


const noSidebarRoutes = [
  '/persona',
  '/home',
  '/login',
  '/register',
]


router.beforeEach((to, from, next) => {
  if (to.query.fromLesson || noSidebarRoutes.includes(to.path)) {
    noSidebar.value = true
  } else {
    noSidebar.value = false
  }
  next()
})

const Layout = computed(() => {
  if (noSidebar.value) {
    return NoSidebarLayout
  }
  if (screenSize.width < 640) {
    return MobileLayout
  }

  return DesktopLayout
})

onUnmounted(() => {
  noSidebar.value = false
})

watch(userResource, () => {
  if (userResource.data) {
    posthogSettings.reload()
  }
})
</script>
