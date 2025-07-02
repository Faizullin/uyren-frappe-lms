<template>
  <div>
    <header
      class="sticky flex items-center justify-between top-0 z-10 border-[#E4E4E4] border-b-[2.5px] bg-surface-white px-3 py-[24px] sm:px-5">
      <Breadcrumbs :items="breadcrumbs" />
    </header>

    <div class="p-5 pb-10 dark:bg-[#0f0f0f]">
      <div class="community-section bg-[ffffff] dark:bg-[#0f0f0f] dark:text-white">

        <p class="text-xl font-bold my-8">
          {{ __('Don\'t study alone. Be part of a community.') }}
        </p>
        <p class="text-xl leading-relaxed mb-32 ">
          {{ __('We\'re building not just a platform, but an entire environment for growth and support. In our community you can:') }}
        </p>

        <div class="flex items-end justify-between mt-8">
          <!-- Left Column -->
          <div class="flex-1">
            <ul class="list-disc pl-6 mb-10 text-xl space-y-2">
              <li>{{ __('Connect with mentors and students') }}</li>
              <li>{{ __('Build projects with others') }}</li>
              <li>{{ __('Get help and share ideas') }}</li>
              <li>{{ __('Join calls and challenges') }}</li>
            </ul>

            <p class="text-2xl font-bold mb-6">{{ __('Our platforms:') }}</p>
            <div class="grid  grid-cols-1 lg:grid-cols-4 gap-6">
              <div v-for="(platform, index) in platforms" :key="index"
                class="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm">
                <p class="text-lg font-semibold mb-4 max-w-[160px]">{{ platform.name }}</p>
                <img :src="platform.qr" :alt="platform.name + ' QR'" class="w-[180px] h-[180px]" />
                <button class="mt-4 download-button">{{ __('Visit') }}</button>
              </div>
              <div class="">
                <img src="/img/foxy_socialmedia.png" :alt="__('Uyren.Ai Community')"
                  class="w-full max-w-[220px] h-auto mb-4" />
              </div>
            </div>
          </div>
        </div>
        <p class="mt-10 text-base text-gray-700 dark:text-[#D4D4D4]">
          ❤️ <strong>{{ __('Why it matters:') }}</strong><br />
          {{ __('Learning is not just knowledge, it\'s people around you.') }}<br />
          {{ __('We grow faster together.') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Breadcrumbs } from '@mono/mono-frappe-ui'
import { computed } from 'vue'

const breadcrumbs = computed(() => [
  {
    label: __('Community Uyren.AI'),
    route: { name: 'Community' },
  },
])

const platforms = [
  {
    name: __('Discord Server'),
    qr: '/img/telegram-qr.jpg',  // fix
  },
  {
    name: __('Instagram Page'),
    qr: '/img/telegram-qr.jpg',   // fix
  },
  {
    name: __('Telegram Channel'),
    qr: '/img/telegram-qr.jpg',
  },
]
</script>

<style scoped>
.community-section {
  font-family: "Montserrat", sans-serif;
  margin-bottom: 2rem;
}

.community-section p {
  font-size: 24px;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.community-section p strong {
  font-weight: 700;
}

.download-button {
  background-color: #f1511b;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  font-size: 18px;
}

.download-button:hover {
  background-color: #e13f1b;
}

.image-block img {
  max-width: 100%;
  height: auto;
}

.text-xl {
  font-size: 24px;
}
</style>
