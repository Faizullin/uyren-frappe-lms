<template>
  <Header />
  <div class="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-4">
    <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
      <img src="/img/logo.svg" class="mx-auto h-12 mb-6" />
      <h2 class="text-center text-2xl font-bold text-gray-800 mb-6">{{ __('Sign Up') }}</h2>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-gray-700 text-sm font-medium mb-1">{{ __('Email') }}</label>
          <input v-model="email" type="email"
            class="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f1511b]"
            required />
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-[#f1511b] hover:bg-[#e64a19] text-white py-2 rounded-lg text-sm font-semibold transition-all duration-300">
          {{ loading ? 'Отправка...' : 'Получить ссылку для входа' }}
        </button>
      </form>

      <p v-if="error" class="text-red-500 text-sm mt-4 text-center">{{ error }}</p>
      <p v-if="success" class="text-green-600 text-sm mt-4 text-center">
        {{ __('Link for ligging in sent. Check your email') }}
      </p>

      <p class="text-center text-sm mt-6 text-gray-600">
        {{ __('Already have an account?') }}
        <router-link to="/login" class="text-[#f1511b] font-medium hover:underline">
          {{ __('Login') }}
        </router-link>
      </p>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { call } from '@mono/mono-frappe-ui'
import Header from '@/components/front/Header.vue'
import Footer from '@/components/front/Footer.vue'

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const router = useRouter()

const onSubmit = async () => {
  error.value = ''
  success.value = false
  loading.value = true

  try {
    await call('frappe.auth.sign_up', {
      email: email.value,
    })
    success.value = true
  } catch (e) {
    error.value = e.message || 'Ошибка при регистрации'
  } finally {
    loading.value = false
  }
}
</script>
