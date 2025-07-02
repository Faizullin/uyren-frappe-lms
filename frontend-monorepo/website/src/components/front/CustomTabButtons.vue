<template>
  <div
    class="bg-gray-100 p-1 rounded-full flex flex-wrap gap-2
           sm:w-fit sm:flex-nowrap sm:overflow-x-auto sm:scrollbar-hide"
  >
    <button
      v-for="tab in buttons"
      :key="tab.label"
      @click="selectTab(tab.label)"
      :class="[
        'px-5 py-3 rounded-full text-md font-medium transition-colors duration-200 whitespace-nowrap',
        currentValue === tab.label
          ? 'bg-[#f1511b] text-white shadow-sm'
          : 'bg-transparent text-[#f1511b] hover:bg-[#f1511b]/10',
      ]"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  buttons: Array,
  modelValue: String,
})

const emit = defineEmits(['update:modelValue'])

const currentValue = computed(() => props.modelValue)

const selectTab = (label) => {
  emit('update:modelValue', label)
}
</script>
