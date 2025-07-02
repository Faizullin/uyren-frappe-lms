<template>
  <div>
    <header
      class="sticky flex items-center justify-between top-0 z-10 border-[#E4E4E4] border-b-[2.5px] bg-surface-white px-3 py-[24px] sm:px-5">
      <Breadcrumbs :items="breadcrumbs" />
    </header>

    <div class="p-5 pb-10 dark:bg-[#0f0f0f]">
      <div class="certifications-section dark:bg-[#0f0f0f]">
        <p class="text-xl leading-relaxed my-8 dark:text-white">
          <strong>{{ __('Upon completing each course, you receive a personalized digital Uyren.Ai certificate.')
            }}</strong>
        </p>
        <p class="text-xl leading-relaxed mb-32 mt-12 dark:text-white">
          {{ __('Our certificates confirm your skills of specific topics — from Python to Machine Learning.') }}
        </p>

        <div class="lg:flex items-start mt-8">
          <div class="flex-1 lg:max-w-[45%] mt-[80px]">
            <ul class="list-disc pl-6 mb-6 text-xl dark:text-white">
              <li class="mb-2">{{ __('After completing all assignments') }}</li>
              <li class="mb-2">{{ __('With a final score of 70% or higher') }}</li>
              <li class="mb-2">{{ __('Automatically generated in PDF') }}</li>
            </ul>

            <a href="#"
              class="font-semibold text-black text-xl hover:text-blue-600 mb-2 mt-24 inline-block dark:text-white">
              {{ __('[View Sample Certificate]') }}
            </a>

            <button class="download-button bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold text-lg mt-8">
              ⬇ {{ __('Download PDF') }}
            </button>
          </div>

          <div class="image-block flex-shrink-0 lg:w-[35%]">
            <img src="/img/certifications-banner.png" alt="certificate uyren.ai" class="max-w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Breadcrumbs } from '@mono/mono-frappe-ui'
import { computed } from 'vue'

const breadcrumbs = computed(() => [
  {
    label: __('Certifications'),
    route: { name: 'Certification' },
  },
])
</script>

<style scoped>
.certifications-section {
  font-family: "Montserrat", sans-serif;
  margin-bottom: 2rem;
}

.certifications-section p {
  font-size: 24px;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.certifications-section p strong {
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
