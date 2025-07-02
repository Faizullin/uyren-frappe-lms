<template>
    <div class="fixed bottom-6 right-6 z-50">
        <button
            @click="toggleChat"
            class="bg-[#f1511b] hover:bg-[#d3420f] text-white p-4 rounded-full shadow-lg transition duration-300"
        >
            <img src="/public/img/chat.svg" alt="">
        </button>
        <transition name="slide-up">
            <div
                v-if="showChat"
                class="mt-4 w-80 max-w-[90vw] h-[500px] bg-white shadow-xl rounded-xl flex flex-col overflow-hidden"
            >
                <div class="bg-[#f1511b] text-white p-4 font-semibold text-lg flex justify-between items-center">
                    Chat with us
                    <button @click="toggleChat" class="text-white hover:opacity-70">
                        ✕
                    </button>
                </div>
                <div class="flex-1 p-4 overflow-y-auto text-sm text-[#1a1a1a]">
                    <p class="mb-2">Hi! How can I help you?</p>
                    <!-- <p class="mb-2 italic text-gray-600"></p> -->
                </div>
                <div class="p-3 border-t flex items-center">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f1511b]"
                    />
                    <button class="ml-2 text-[#f1511b] font-bold">Send</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
  import { ref } from 'vue'
  const showChat = ref(false)
  const toggleChat = () => {
    showChat.value = !showChat.value
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
