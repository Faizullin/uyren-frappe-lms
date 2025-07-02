<template>
  <Header />
  <div class="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-4">
    <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
      <img src="/img/logo.svg" class="mx-auto h-12 mb-6" />
      <h2 class="text-center text-2xl font-bold text-gray-800 mb-6">{{ __('Login to Uyren.AI') }}</h2>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-gray-700 text-sm font-medium mb-1">{{ __('Email') }}</label>
          <input v-model="email" type="text"
            class="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f1511b]"
            required />
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-medium mb-1">{{ __('Password') }}</label>
          <input v-model="password" type="password"
            class="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f1511b]"
            required />
        </div>
        <button type="submit" :disabled="loading"
          class="w-full bg-[#f1511b] hover:bg-[#e64a19] text-white py-2 rounded-lg text-sm font-semibold transition-all duration-300">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
      <p v-if="error" class="text-red-500 text-sm mt-4 text-center">{{ error }}</p>
      <p class="text-center text-sm mt-6 text-gray-600">
        {{ __("Don't have account?") }}
        <router-link to="/register" class="text-[#f1511b] font-medium hover:underline">
          {{ __('Sign Up') }}
        </router-link>
      </p>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { call } from '@mono/mono-frappe-ui'
import Header from '@/components/front/Header.vue'
import Footer from '@/components/front/Footer.vue'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const user = inject('$user')
const router = useRouter()

const onSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    await call('login', { usr: email.value, pwd: password.value })
    await user.reload()
    router.push({ name: 'Courses' })
  } catch (e) {
    error.value = 'Неверный логин или пароль'
  } finally {
    loading.value = false
  }
}
</script>
