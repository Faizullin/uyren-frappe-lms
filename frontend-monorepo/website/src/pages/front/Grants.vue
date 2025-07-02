<template>
  <div>
    <header
      class="sticky flex items-center justify-between top-0 z-10 border-[#E4E4E4] border-b-[2.5px] bg-surface-white px-3 py-[24px] sm:px-5">
      <Breadcrumbs :items="breadcrumbs" />
    </header>

    <div class="p-5 pb-10 dark:bg-[#0f0f0f] dark:text-white">
      <div class="grants-section bg-[ffffff] dark:bg-[#0f0f0f]">
        <p class="text-[28px] leading-relaxed my-8 font-bold">
          {{ __('Education should be accessible.') }}
        </p>
        <p class="text-xl leading-relaxed">
          {{ __('At Uyren.Ai, we believe everyone deserves the chance to learn, regardless of their financial situation. Our support program gives a real opportunity to those who are motivated and ready to prove it.') }}
        </p>

        <div class="lg:flex items-end justify-between mt-8">
          <div class="flex-1">
            <p class="text-[28px] font-bold mb-4 mt-4">{{ __('What’s available:') }}</p>
            <ul class="list-disc pl-6 mb-6 text-xl">
              <li class="mb-2">{{ __('100% grant — free access to all materials') }}</li>
              <li class="mb-2">{{ __('Discount up to 50% — based on social situation') }}</li>
            </ul>

            <p class="text-[28px] font-bold mb-4 mt-4">{{ __('Who can apply and how:') }}</p>
            <ul class="list-disc pl-6 space-y-4 text-xl">
              <li class="list-none mb-[5px]">
                <p class="text-[24px] font-bold mb-[5px]">{{ __('High school students (grades 9-12):') }}</p>
                {{ __('Grants available after passing an entrance test. We also consider achievements such as olympiads, projects, and portfolios.') }}
              </li>
              <li class="list-none mb-[5px]">
                <p class="text-[24px] font-bold mb-[5px]">{{ __('University and college students:') }}</p>
                <ul class="list-disc pl-6 space-y-2 text-xl">
                  <li>{{ __('100% grant — for those in difficult life situations (low income, health issues, etc.)') }}
                  </li>
                  <li>{{ __('Discount up to 50% — with application based on verified information') }}</li>
                </ul>
              </li>
              <li class="list-none mb-[5px]">
                <p class="text-[24px] font-bold mb-[5px]">{{ __('Motivated learners with limited resources:') }}</p>
                <ul class="list-disc pl-6 space-y-2">
                  <li>{{ __('Discount up to 50%') }}</li>
                  <li>{{ __('Must complete a short interview and fill out a form') }}</li>
                </ul>
              </li>
            </ul>


            <button
              class="apply-button flex items-center gap-3 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold text-xl mt-8">
              <img src="/img/mail-inbox.svg" alt="apply" class="w-14 h-14" />
              {{ __('Apply Now') }}
            </button>
          </div>

          <div class="image-block flex-shrink-0 lg:w-[35%]">
            <img src="/img/foxy_grant.png" alt="Uyren.Ai Grant" class="max-w-full h-auto" />
          </div>
        </div>

        <p class="text-[24px] mt-10 text-gray-700 dark:text-[#D4D4D4]">
          {{ __('We value motivation, effort, and responsibility.') }}
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
    label: __('Grants'),
    route: { name: 'Grants' },
  },
])
</script>

<style scoped>
.grants-section {
  font-family: "Montserrat", sans-serif;
}

.grants-section p {
  line-height: 1.5;

}

.grants-section p strong {
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
