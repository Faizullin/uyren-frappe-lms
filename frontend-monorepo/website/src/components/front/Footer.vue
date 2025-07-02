<template>
  <footer class="bg-[#0f0f0f] text-white font-montserrat py-10">
    <div class="max-w-screen-xl mx-auto px-4 flex flex-col gap-6">
      <div
        class="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between gap-6 text-center md:text-left">
        <div class="flex items-center gap-2 justify-center md:justify-start">
          <img src="/img/logo.svg" alt="UYREN.AI" class="w-14 h-14" />
          <a href="#" class="text-white font-hammersmith text-2xl font-bold tracking-widest">UYREN.AI</a>
        </div>
        <nav>
          <ul class="flex flex-row gap-4 md:gap-8 items-center">
            <li>
              <router-link to="/courses" class="text-[#ccc] hover:text-white text-base font-semibold">
                {{ __('Courses') }}
              </router-link>
            </li>
            <li>
              <a href="#" class="text-[#ccc] hover:text-white text-base font-semibold">
                {{ __('About Us') }}
              </a>
            </li>
            <li>
              <router-link to="/community" class="text-[#ccc] hover:text-white text-base font-semibold">
                {{ __('Contacts') }}
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="h-px bg-white/30 my-4"></div>
      <div class="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 text-center">
        <div class="flex gap-4 justify-center">
          <a href="https://www.instagram.com/uyrenai?igsh=bXZhN3gzeHQxc3lq">
            <img src="/img/instagram.svg" alt="instagram" class="w-8 h-8" />
          </a>
          <a href="https://t.me/uyrenai">
            <img src="/img/telegram.svg" alt="telegram" class="w-8 h-8" />
          </a>
          <a href="https://wa.me/77780080502">
            <img src="/img/whatsapp.svg" alt="whatsapp" class="w-8 h-8" />
          </a>
          <a href="https://www.linkedin.com/company/uyrenai/">
            <img src="/img/linkedin.svg" alt="linkedin" class="w-8 h-8" />
          </a>
          <a href="https://discord.gg/x3SWq3pU">
            <img src="/img/discord.svg" alt="discord" class="w-8 h-8" />
          </a>
        </div>
        <p class="text-sm text-[#999]">
          © 2025 Uyren.Ai. {{ __('All rights reserved.') }}
        </p>
      </div>
    </div>
  </footer>
</template>



<script setup>
</script>
