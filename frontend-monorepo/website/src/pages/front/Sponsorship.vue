<template>
  <div>
    <header
      class="sticky flex items-center justify-between top-0 z-10 border-[#E4E4E4] border-b-[2.5px] bg-surface-white px-3 py-[24px] sm:px-5">
      <Breadcrumbs :items="breadcrumbs" />
    </header>

    <div class="p-5 pb-10 dark:bg-[#0f0f0f]">
      <div class="community-section bg-[ffffff] dark:bg-[#0f0f0f] dark:text-white">

        <p class="text-xl font-bold my-8">
          {{ __('Support the new generation of Kazakhstan.') }}
        </p>
        <p class="text-xl leading-relaxed">
          {{ __('Uyren.Ai is an educational platform created by Nazarbayev University students. We teach real skills: Python, ML, applied sciences, math.If you believe in the power of education and want to invest in the future — let\'s work together.') }}
        </p>

        <div class="lg:flex items-end justify-between mt-8">
          <div class="flex-1">
            <p class="text-[28px] font-bold mb-4">{{ __('Partnership formats:') }}</p>
            <ul class="list-disc pl-6 text-xl mb-8 space-y-2">
              <li>{{ __('Financial sponsorships and grants') }}</li>
              <li>{{ __('Support specific courses or areas') }}</li>
              <li>{{ __('Provide prizes, scholarships, equipment') }}</li>
              <li>{{ __('Host events and challenges together') }}</li>
              <li>{{ __('Help with promotion, content, platform') }}</li>
            </ul>

            <p class="text-[28px] font-bold mb-4">{{ __('What we offer in return:') }}</p>
            <ul class="list-disc pl-6 text-xl mb-8 space-y-2">
              <li>{{ __('Brand mention on the website and in courses') }}</li>
              <li>{{ __('Logo on certificates and materials') }}</li>
              <li>{{ __('Access to anonymized analytics') }}</li>
              <li>{{ __('Joint PR campaigns') }}</li>
              <li>{{ __('Direct contribution to a socially impactful project') }}</li>
            </ul>

            <p class="text-[28px] font-bold mb-4">{{ __('Leave a request — we\'ll reach out:') }}</p>
            <button class="download-button flex items-center gap-3 text-xl mt-4">
              <img src="/img/handshake.svg" alt="Sponsorship icon" class="w-14 h-14" />
              {{ __('Become a Sponsor') }}
            </button>
          </div>

          <div class="image-block flex-shrink-0 lg:w-[35%]">
            <img src="/img/sponsorship-banner.png" :alt="__('Uyren.Ai Sponsorship')" class="max-w-full h-auto" />
          </div>
        </div>

        <p class="mt-10 text-base text-gray-700 dark:text-[#D4D4D4] text-xl">
          ❤️ <strong>{{ __('Thank you for your interest.') }}</strong>
          {{ __('Each partnership helps us make education in Kazakhstan stronger, more accessible, and more relevant.')
          }}
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
    label: __('Sponsorships'),
    route: { name: 'Sponsorship' },
  },
])
</script>

<style scoped>
.sponsorships-section {
  font-family: "Montserrat", sans-serif;
  margin-bottom: 2rem;
}

.sponsorships-section p {
  font-size: 24px;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.sponsorships-section p strong {
  font-weight: 700;
}

.download-button {
  background-color: #f1511b;
  color: white;
  padding: 18px 36px;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  width: fit-content;
  font-size: 24px;
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
