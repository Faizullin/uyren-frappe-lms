<template>
  <header class="w-full border-b border-black/30">
    <div
      class="max-w-screen-xl w-full mx-auto px-10 py-3 flex items-center md:justify-between flex flex-col md:flex-row lg:flex-nowrap flex-wrap justify-center gap-5">
      <div class="flex items-center space-x-2">
        <img src="/img/logo.svg" alt="UYREN.AI Logo" class="w-14 h-13" />
        <router-link to="/"
          class="text-[#191919] text-[24px] font-bold font-hammersmith tracking-wider dark:text-white">
          UYREN.AI
        </router-link>
      </div>
      <nav>
        <ul class="flex gap-6">
          <li>
            <router-link to="/courses" class="text-[#1a1a1a] font-bold text-[16px] font-montserrat dark:text-white">
              {{ __('Courses') }}
            </router-link>
          </li>
          <li>
            <a href="#about" class="text-[#1a1a1a] font-bold text-[16px] font-montserrat dark:text-white">
              {{ __('About Us') }}
            </a>
          </li>
          <li>
            <router-link to="/community" class="text-[#1a1a1a] font-bold text-[16px] font-montserrat dark:text-white">
              {{ __('Contacts') }}
            </router-link>
          </li>
        </ul>
      </nav>
      <!-- Language Switcher -->
      <div class="flex gap-2 items-center text-[16px] font-semibold text-[#1a1a1a] dark:text-white">
        <template v-for="(lang, index) in langs" :key="lang">
          <span class="cursor-pointer hover:underline" :class="{ 'text-[#f1511b] font-bold': selectedLang === lang }"
            @click="setLanguage(lang)">
            {{ lang }}
          </span>
          <span v-if="index !== langs.length - 1">|</span>
        </template>
      </div>
      <button class="px-4 py-2 rounded-full bg-[#f1511b] text-white text-[18px] font-semibold font-montserrat">
        {{ __('Start Learning') }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const langs = ['en', 'kz', 'ru']
const selectedLang = ref(localStorage.getItem('lang') || 'en')

function setLanguage(lang) {
  if (lang === selectedLang.value) return
  localStorage.setItem('lang', lang)
  location.reload()
}
</script>
