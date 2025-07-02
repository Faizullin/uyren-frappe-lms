<template>
  <Header />
  <section class="relative w-full font-montserrat dark:bg-white">
    <div class="md:hidden w-full bg-[url('/img/banner_copy.png')] bg-cover bg-center relative"
      style="padding-top: 100%;">
      <div class="absolute inset-0 bg-white/60"></div>
    </div>
    <div class="absolute top-0 left-0 w-full h-full md:static md:h-auto md:py-[80px] px-[32px] flex justify-center">
      <div class="max-w-screen-xl mx-auto flex flex-col-reverse md:flex-row items-center gap-[48px] justify-center">
        <div class="max-w-xl z-10 text-center md:text-left space-y-[12px]">
          <h1 class="text-[32px] md:text-[48px] font-[700] text-[#1a1a1a] mb-[12px]">
            <span class="text-[#f1511b] font-[700]">{{ __('Create') }}</span> {{ __('a future with real skills') }}
          </h1>
          <p class="text-[16px] md:text-[18px] lg:text-[20px] font-[500] text-[#4a4a4a] mb-[32px]">
            {{ __('Learn what actually matters: Python, ML, science. No fluff. Just challenges, structure, and growth.')}}
          </p>
          <div class="flex flex-wrap gap-[20px] mb-[40px] justify-center md:justify-start">
            <button @click="goToCourses"
              class="bg-[#f1511b] hover:bg-[#e64a19] text-[#ffffff] font-[700] py-[12px] px-[24px] rounded-full text-[14px] md:text-[16px] transition-all duration-300">
              {{ __('Start Learning') }}
            </button>
            <button class="flex items-center gap-[8px] text-[#1a1a1a] font-[700] text-[14px] md:text-[16px]">
              <img src="/img/play.svg" alt="Play Icon" class="w-[32px] h-[32px] md:w-[40px] md:h-[40px]" />
              {{ __('Watch Lecture') }}
            </button>
          </div>
          <div class="flex gap-[40px] text-center justify-center md:justify-start">
            <div class="w-[96px]">
              <h2 class="text-[28px] md:text-[36px] font-[700] text-[#1a1a1a]">10+</h2>
              <p class="text-[12px] md:text-[14px] leading-tight text-[#4a4a4a]">
                {{ __('Years of') }}<br />{{ __('Experience') }}
              </p>
            </div>
            <div class="w-[96px]">
              <h2 class="text-[28px] md:text-[36px] font-[700] text-[#1a1a1a]">200+</h2>
              <p class="text-[12px] md:text-[14px] leading-tight text-[#4a4a4a]">
                {{ __('Students') }}<br />{{ __('Enrolled') }}
              </p>
            </div>
            <div class="w-[96px]">
              <h2 class="text-[28px] md:text-[36px] font-[700] text-[#1a1a1a]">40+</h2>
              <p class="text-[12px] md:text-[14px] leading-tight text-[#4a4a4a]">
                {{ __('Popular') }}<br />{{ __('Courses') }}
              </p>
            </div>
          </div>
        </div>
        <div class="hidden md:block -ml-[48px]">
          <img src="/img/banner.png" alt="Banner" class="max-w-[450px] h-auto" />
        </div>
      </div>
    </div>
  </section>
  <section class="py-[28px] px-[28px] md:py-[40px] md:px-[80px] bg-[#ffffff] dark:bg-black">
    <div class="mx-auto max-w-[1280px]">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[100px] mb-[10px] md:mb-[60px] items-center">
        <h2 class="text-[42px] font-[700] text-[#1a1a1a] dark:text-white">
          <span class="text-[#f1511b]">{{ __('More') }}</span>{{ __(' than just video lessons') }}
        </h2>
        <p class="text-[18px] md:text-[20px] text-[#4a4a4a] max-w-[524px] md:pl-[30px] leading-snug dark:text-white">
          {{ __('Courses built with a system: theory, practice, support. Every module is a step toward real growth.') }}

        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
        <div v-for="(item, i) in featureList" :key="i"
          class="bg-[#f4f4f4] p-[30px] rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.2)] transition-all duration-300">
          <div class="flex items-center mb-[20px]">
            <div class="w-[60px] h-[60px] bg-[#ececec] rounded-full flex items-center justify-center mr-[10px]">
              <img :src="item.icon" :alt="item.title" class="w-[30px] h-[30px]" />
            </div>
            <h3 class="text-[22px] font-[600] text-[#1a1a1a]">{{ item.title }}</h3>
          </div>
          <p class="text-[20px] leading-[1.5] font-[400] text-[#4a4a4a]">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
  <section class="py-[60px] bg-[#ececec]">
    <div
      class="mx-auto max-w-[1280px] rounded-[40px] p-[30px_24px] flex flex-col md:flex-row items-center justify-between gap-[20px]">
      <div class="w-full md:max-w-[560px] space-y-[20px]">
        <h2 class="text-[42px] font-[700] text-[#1a1a1a] break-words">
          <span class="text-[#f1511b] text-center ">{{ __('Courses') }}</span> {{ __(' that lead to real results') }}
        </h2>
        <router-link to="/courses"
          class="inline-block w-full sm:w-[80%] bg-[#ffffff] border-[3px] border-[#f1511b] text-[#f1511b] text-[24px] font-[700] rounded-[10px] py-[15px] px-[20px] text-center hover:bg-[#f1511b] hover:text-[#ffffff] transition-all duration-300">
          {{ __('Explore More Courses') }}
        </router-link>
      </div>
      <div class="w-full flex flex-wrap gap-[20px] justify-center md:justify-end">
        <router-link v-for="course in courseList" :key="course.slug" :to="`/courses/${course.slug}`"
          class="flex-1 max-w-[280px] bg-[#ffffff] rounded-[12px] p-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.2)] transition-all duration-300">
          <img :src="course.image" :alt="course.title" class="w-full rounded-[10px] mb-[10px] object-cover" />
          <div class="flex items-center gap-[5px] mb-[5px]">
            <img src="/img/logo.svg" alt="logo" class="w-[30px] p-[2px] border-[1px_#4a4a4a] rounded-[5px]" />
            <p class="text-[16px] font-[400] text-[#1a1a1a]">Uyren Academy</p>
          </div>
          <h3 class="text-[20px] font-[700] text-[#1a1a1a] mb-[10px] break-words">{{ course.title }}</h3>
          <p class="text-[14px] font-[400] text-[#4a4a4a]">{{ course.level }}</p>
        </router-link>
      </div>
    </div>
  </section>
  <section class="py-[60px] bg-[#ffffff]">
    <div class="mx-auto max-w-[1280px] px-[10px]">
      <h2 class="text-center text-[42px] font-[700] text-[#1a1a1a] mb-[15px]">
        {{ __('What people say about ') }}<span class="text-[#f1511b]">Uyren.Ai</span>
      </h2>
      <p class="text-center text-[20px] font-[400] text-[#4a4a4a] px-[20px] mb-[30px]">
        {{ __('Our platform is a real shift in understanding. Here’s what our first clients say.') }}
      </p>
      <div class="flex flex-wrap justify-center gap-[20px]">
        <div v-for="item in testimonials" :key="item.name"
          class="bg-[#ffffff] rounded-[10px] border-[1px_rgba(0,0,0,0.3)] p-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] max-w-[400px]">
          <div class="flex items-center gap-[5px] mb-[10px]">
            <img :src="item.img" :alt="item.name" class="w-[40px] h-[40px] rounded-full" />
            <p class="font-[700] text-[#1a1a1a]">
              {{ item.name }}<br />
              <span class="font-[400] text-[13px] text-[#777777]">{{ item.university }}</span>
            </p>
          </div>
          <p class="text-[14px] font-[400] textalign-left text-[#333333]">{{ item.text }}</p>
        </div>
      </div>
    </div>
  </section>
  <Footer />
</template>

<script setup>
import { useRouter } from 'vue-router'
import Header from '@/components/front/Header.vue'
import Footer from '@/components/front/Footer.vue'
import { usePageMeta } from '@mono/mono-frappe-ui'

const router = useRouter()

usePageMeta(() => ({
  title: 'Uyren.AI',
}))

const featureList = [
  { icon: '/img/gears.svg', title: __('Systematic approach'), description: __('Courses are divided into modules, assignments, and final projects. Clear structure over chaos.') },
  { icon: '/img/python.svg', title: __('Built-in practice'), description: __('Each topic comes with tasks and case studies. Learning means solving, not just watching.') },
  { icon: '/img/chart-line-up.svg', title: __('Growth through understanding'), description: __('No cramming. Only deep, truly engineering-level thinking.') },
  { icon: '/img/support.svg', title: __('Feedback'), description: __('Smart chatbot and expert support. Answers come when they\'re really needed.') },
]

const courseList = [
  { slug: 'python-course', image: '/img/python-course.jpeg', title: 'Intro to Python Programming', level: __('Level: Beginner · Core Skill') },
  { slug: 'data-analytics-course', image: '/img/data-analytics.jpeg', title: 'Data Analytics Introduction', level: __('Level: Beginner · Core Skill') },
]

const testimonials = [
  { name: 'Aidos N.', university: __('Student at Nazarbayev University'), img: '/img/aidos_n.jpg', text: __('The organized material and system of deadlines helped me to study with discipline. And the practical experience — labs and quizzes — kept me engaged.') },
  { name: 'Aruzhan M.', university: __('Student at Kazakh-British University'), img: '/img/aruzhan_m.jpg', text: __('I liked how every topic was explained logically and without extra fluff. I felt each module carried real understanding, not just translated content.') },
  { name: 'Aldina A.', university: __('Student at Sabanci University'), img: '/img/aldina_a.jpg', text: __('With Uyren.Ai, I finally understood how to study effectively. Each block gave me clarity, and I began to connect better with my IT career goals.') },
]
function goToCourses() {
  router.push({ name: 'Courses' })
}
</script>
