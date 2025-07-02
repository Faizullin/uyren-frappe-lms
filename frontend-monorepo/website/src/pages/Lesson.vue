<template>
  <div v-if="lesson.data" class="">
    <header class="sticky top-0 z-10 flex items-center justify-between border-b bg-surface-white px-3 py-2.5 sm:px-5">
      <Breadcrumbs class="h-7" :items="breadcrumbs" />
      <div class="flex items-center space-x-2">
        <Tooltip v-if="canGoZen()" :text="__('Zen Mode')">
          <Button @click="goFullScreen()">
            <template #icon>
              <Focus class="w-4 h-4 stroke-2" />
            </template>
          </Button>
        </Tooltip>
        <CertificationLinks :courseName="courseName" />
      </div>
    </header>
    <div class="grid md:grid-cols-[70%,30%] h-screen">
      <div v-if="lesson.data.no_preview" class="border-r">
        <div class="shadow rounded-md w-3/4 mt-10 mx-auto text-center p-4">
          <div class="flex items-center justify-center mt-4 space-x-2">
            <LockKeyholeIcon class="size-4 stroke-2 text-ink-gray-5" />
            <div class="text-lg font-semibold text-ink-gray-7">
              {{ __('This lesson is locked') }}
            </div>
          </div>
          <div class="mt-1 mb-4 text-ink-gray-7">
            {{
              __(
                'This lesson is not available for preview. Please enroll in the course to access it.'
            )
            }}
          </div>
          <Button v-if="user.data && !lesson.data.disable_self_learning" @click="enrollStudent()" variant="solid">
            {{ __('Start Learning') }}
          </Button>
          <Badge theme="blue" size="lg" v-else-if="lesson.data.disable_self_learning" class="mt-2">
            {{ __('Contact the Administrator to enroll for this course.') }}
          </Badge>
          <Button v-else @click="redirectToLogin()">
            <template #prefix>
              <LogIn class="w-4 h-4 stroke-1" />
            </template>
            {{ __('Login') }}
          </Button>
        </div>
      </div>
      <div v-else ref="lessonContainer" class="bg-surface-white" :class="{
        'overflow-y-auto': zenModeEnabled,
      }">
        <div class="border-r container pt-5 pb-10 px-5 h-full" :class="{
          'w-full md:w-3/5 mx-auto border-none !pt-10': zenModeEnabled,
        }">
          <div class="flex flex-col md:flex-row md:items-center justify-between">
            <div class="flex flex-col">
              <div class="text-3xl font-semibold text-ink-gray-9">
                {{ lesson.data.title }}
              </div>

              <div v-if="zenModeEnabled"
                class="relative flex items-center space-x-2 text-sm mt-1 text-ink-gray-7 group w-fit mt-2">
                <span>
                  {{ lesson.data.chapter_title }} -
                  {{ lesson.data.course_title }}
                </span>
                <Info class="size-3" />
                <div
                  class="hidden group-hover:block rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-xl absolute left-0 top-full mt-2">
                  {{ Math.ceil(lesson.data.membership.progress) }}%
                  {{ __('completed') }}
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2 mt-2 md:mt-0">
              <Button v-if="zenModeEnabled" @click="showDiscussionsInZenMode()">
                <template #icon>
                  <MessageCircleQuestion class="w-4 h-4 stroke-1.5" />
                </template>
              </Button>
              <router-link v-if="lesson.data.prev" :to="{
                name: 'Lesson',
                params: {
                  courseName: courseName,
                  chapterNumber: lesson.data.prev.split('.')[0],
                  lessonNumber: lesson.data.prev.split('.')[1],
                },
              }">
                <Button>
                  <template #prefix>
                    <ChevronLeft class="w-4 h-4 stroke-1" />
                  </template>
                  <span>
                    {{ __('Previous') }}
                  </span>
                </Button>
              </router-link>
              <router-link v-if="allowEdit()" :to="{
                name: 'LessonForm',
                params: {
                  courseName: courseName,
                  chapterNumber: props.chapterNumber,
                  lessonNumber: props.lessonNumber,
                },
              }">
                <Button>
                  {{ __('Edit') }}
                </Button>
              </router-link>
              <router-link v-if="lesson.data.next" :to="{
                name: 'Lesson',
                params: {
                  courseName: courseName,
                  chapterNumber: lesson.data.next.split('.')[0],
                  lessonNumber: lesson.data.next.split('.')[1],
                },
              }">
                <Button>
                  <template #suffix>
                    <ChevronRight class="w-4 h-4 stroke-1" />
                  </template>
                  <span>
                    {{ __('Next') }}
                  </span>
                </Button>
              </router-link>
              <router-link v-else :to="{
                name: 'CourseDetail',
                params: { courseName: courseName },
              }">
                <Button>
                  {{ __('Back to Course') }}
                </Button>
              </router-link>
            </div>
          </div>

          <div v-if="!zenModeEnabled" class="flex items-center mt-2">
            <span class="h-6 mr-1" :class="{
              'avatar-group overlap': lesson.data.instructors?.length > 1,
            }">
              <UserAvatar v-for="instructor in lesson.data.instructors" :user="instructor" />
            </span>
            <CourseInstructors v-if="lesson.data?.instructors" :instructors="lesson.data.instructors" />
          </div>

          <div v-if="
            instructorContentHtml &&
            allowInstructorContent()
          " class="bg-surface-gray-2 p-3 rounded-md mt-6">
            <div class="text-ink-gray-5 font-medium">
              {{ __('Instructor Notes') }}
            </div>
            <div v-html="instructorContentHtml"
              class="ProseMirror prose prose-table:table-fixed prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border prose-td:border-outline-gray-2 prose-th:border-outline-gray-2 prose-td:relative prose-th:relative prose-th:bg-surface-gray-2 prose-sm max-w-none !whitespace-normal">
            </div>
          </div>
          <div v-else-if="lesson.data.instructor_notes"
            class="ProseMirror prose prose-table:table-fixed prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border prose-td:border-outline-gray-2 prose-th:border-outline-gray-2 prose-td:relative prose-th:relative prose-th:bg-surface-gray-2 prose-sm max-w-none !whitespace-normal mt-8">
            <LessonContent :content="lesson.data.instructor_notes" />
          </div>
          <div v-if="contentHtml"
            class="ProseMirror prose prose-table:table-fixed prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border prose-td:border-outline-gray-2 prose-th:border-outline-gray-2 prose-td:relative prose-th:relative prose-th:bg-surface-gray-2 prose-sm max-w-none !whitespace-normal mt-8">
            <div v-html="contentHtml"></div>
          </div>
          <div v-else
            class="ProseMirror prose prose-table:table-fixed prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border prose-td:border-outline-gray-2 prose-th:border-outline-gray-2 prose-td:relative prose-th:relative prose-th:bg-surface-gray-2 prose-sm max-w-none !whitespace-normal mt-8">
            <LessonContent v-if="lesson.data?.body" :content="lesson.data.body" :youtube="lesson.data.youtube"
              :quizId="lesson.data.quiz_id" />
          </div>
          <div class="mt-20" ref="discussionsContainer">
            <Discussions v-if="allowDiscussions" :title="'Questions'" :doctype="'Course Lesson'"
              :docname="lesson.data.name" :key="lesson.data.name" />
          </div>
        </div>
      </div>
      <div class="sticky top-10">
        <div class="bg-surface-menu-bar py-5 px-2 border-b">
          <div class="text-lg font-semibold text-ink-gray-9">
            {{ lesson.data.course_title }}
          </div>
          <div v-if="user && lesson.data.membership" class="text-sm mt-4 mb-2 text-ink-gray-5">
            {{ Math.ceil(lessonProgress) }}% {{ __('completed') }}
          </div>

          <ProgressBar v-if="user && lesson.data.membership" :progress="lessonProgress" />
        </div>
        <CourseOutline :courseName="courseName" :key="chapterNumber"
          :getProgress="lesson.data.membership ? true : false" />
      </div>
    </div>
  </div>
</template>
<script setup>
import CourseOutline from '@/components/CourseOutline.vue'
import Discussions from '@/components/Discussions.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { sessionStore } from '@/stores/session'
import { useSidebar } from '@/stores/sidebar'
import { enablePlyr, getEditorTools } from '@/utils'
import {
  Badge,
  Breadcrumbs,
  Button,
  createResource,
  Tooltip,
  usePageMeta,
} from '@mono/mono-frappe-ui'
import {
  ChevronLeft,
  ChevronRight,
  Focus,
  Info,
  LockKeyholeIcon,
  LogIn,
  MessageCircleQuestion,
} from 'lucide-vue-next'
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import EditorJS from '@editorjs/editorjs'
import CertificationLinks from '@/components/CertificationLinks.vue'
import CourseInstructors from '@/components/CourseInstructors.vue'
import LessonContent from '@/components/LessonContent.vue'
import ProgressBar from '@/components/ProgressBar.vue'

const user = inject('$user')
const socket = inject('$socket')
const router = useRouter()
const route = useRoute()
const allowDiscussions = ref(false)
const editor = ref(null)
const instructorEditor = ref(null)
const lessonProgress = ref(0)
const lessonContainer = ref(null)
const zenModeEnabled = ref(false)
const hasQuiz = ref(false)
const discussionsContainer = ref(null)
const timer = ref(0)
const { brand } = sessionStore()
const sidebarStore = useSidebar()
let timerInterval

// Content conversion variables
const convertedContent = ref('')
const convertedInstructorContent = ref('')

const props = defineProps({
  courseName: {
    type: String,
    required: true,
  },
  chapterNumber: {
    type: String,
    required: true,
  },
  lessonNumber: {
    type: String,
    required: true,
  },
})

onMounted(() => {
  startTimer()
  console.log(sidebarStore.isSidebarCollapsed)
  sidebarStore.isSidebarCollapsed = true
  document.addEventListener('fullscreenchange', attachFullscreenEvent)
  socket.on('update_lesson_progress', (data) => {
    if (data.course === props.courseName) {
      lessonProgress.value = data.progress
    }
  })
})

const attachFullscreenEvent = () => {
  if (document.fullscreenElement) {
    zenModeEnabled.value = true
    allowDiscussions.value = false
  } else {
    zenModeEnabled.value = false
    if (!hasQuiz.value) {
      allowDiscussions.value = true
    }
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', attachFullscreenEvent)
  sidebarStore.isSidebarCollapsed = false
})

const lesson = createResource({
  url: 'lms.lms.utils.get_lesson',
  makeParams(values) {
    return {
      course: props.courseName,
      chapter: values ? values.chapter : props.chapterNumber,
      lesson: values ? values.lesson : props.lessonNumber,
    }
  },
  auto: true,
})

const setupLesson = (data) => {
  if (Object.keys(data).length === 0) {
    router.push({
      name: 'CourseDetail',
      params: { courseName: props.courseName },
    })
    return
  }
  lessonProgress.value = data.membership?.progress
  // if (data.content) editor.value = renderEditor('editor', data.content)
  // if (
  // 	data.instructor_content &&
  // 	JSON.parse(data.instructor_content)?.blocks?.length > 1
  // )
  // 	instructorEditor.value = renderEditor(
  // 		'instructor-content',
  // 		data.instructor_content
  // 	)
  // editor.value?.isReady.then(() => {
  // 	checkIfDiscussionsAllowed()
  // })

  // if (!editor.value && data.body) {
  // 	const quizRegex = /\{\{ Quiz\(".*"\) \}\}/
  // 	hasQuiz.value = quizRegex.test(data.body)
  // 	if (!hasQuiz.value && !zenModeEnabled) allowDiscussions.value = true
  // }
}

const renderEditor = (holder, content) => {
  // empty the holder
  if (document.getElementById(holder))
    document.getElementById(holder).innerHTML = ''
  return new EditorJS({
    holder: holder,
    tools: getEditorTools(),
    data: JSON.parse(content),
    readOnly: true,
    defaultBlock: 'embed', // editor adds an empty block at the top, so to avoid that added default block as embed
  })
}

const markProgress = () => {
  if (user.data && lesson.data && !lesson.data.progress) {
    progress.submit()
  }
}

const progress = createResource({
  url: 'lms.lms.doctype.course_lesson.course_lesson.save_progress',
  makeParams() {
    return {
      lesson: lesson.data.name,
      course: props.courseName,
    }
  },
  onSuccess(data) {
    lessonProgress.value = data
  },
})

const breadcrumbs = computed(() => {
  let items = [{ label: 'Courses', route: { name: 'Courses' } }]
  items.push({
    label: lesson?.data?.course_title,
    route: { name: 'CourseDetail', params: { courseName: props.courseName } },
  })
  items.push({
    label: lesson?.data?.title,
    route: {
      name: 'Lesson',
      params: {
        courseName: props.courseName,
        chapterNumber: props.chapterNumber,
        lessonNumber: props.lessonNumber,
      },
    },
  })
  return items
})

// Computed property to extract HTML from the new combined content format
const contentHtml = computed(() => {
  if (!lesson.data?.content) return null

  try {
    const parsed = JSON.parse(lesson.data.content)
    // New format: has both json and html
    if (parsed.html) {
      return parsed.html
    }
  } catch (e) {
    // Legacy format: treat as plain HTML
    return lesson.data.content
  }
  return lesson.data.content
})

// Computed property to extract HTML from the new combined instructor content format
const instructorContentHtml = computed(() => {
  if (!lesson.data?.instructor_content) return null

  try {
    const parsed = JSON.parse(lesson.data.instructor_content)
    // New format: has both json and html
    if (parsed.html) {
      return parsed.html
    }
  } catch (e) {
    // Legacy format: treat as plain HTML
    return lesson.data.instructor_content
  }
  return lesson.data.instructor_content
})

watch(
  [() => route.params.chapterNumber, () => route.params.lessonNumber],
  (
    [newChapterNumber, newLessonNumber],
    [oldChapterNumber, oldLessonNumber]
  ) => {
    if (newChapterNumber || newLessonNumber) {
      editor.value = null
      instructorEditor.value = null
      allowDiscussions.value = false
      lesson.submit({
        chapter: newChapterNumber,
        lesson: newLessonNumber,
      })
      clearInterval(timerInterval)
      timer.value = 0
      startTimer()
      enablePlyr()
    }
  }
)

watch(
  () => lesson.data,
  (data) => {
    setupLesson(data)
    enablePlyr()
  }
)

const startTimer = () => {
  timerInterval = setInterval(() => {
    timer.value++
    if (timer.value == 30) {
      clearInterval(timerInterval)
      markProgress()
    }
  }, 1000)
}

onBeforeUnmount(() => {
  clearInterval(timerInterval)
})

const checkIfDiscussionsAllowed = () => {
  JSON.parse(lesson.data?.content)?.blocks?.forEach((block) => {
    if (block.type === 'quiz') hasQuiz.value = true
  })

  if (
    !hasQuiz.value &&
    !zenModeEnabled.value &&
    (lesson.data?.membership ||
      user.data?.is_moderator ||
      user.data?.is_instructor)
  )
    allowDiscussions.value = true
}

const allowEdit = () => {
  if (window.read_only_mode) return false
  if (user.data?.is_moderator) return true
  if (lesson.data?.instructors?.includes(user.data?.name)) return true
  return false
}

const allowInstructorContent = () => {
  if (user.data?.is_moderator) return true
  if (lesson.data?.instructors?.includes(user.data?.name)) return true
  return false
}

const enrollment = createResource({
  url: 'frappe.client.insert',
  makeParams() {
    return {
      doc: {
        doctype: 'LMS Enrollment',
        course: props.courseName,
        member: user.data?.name,
      },
    }
  },
})

const enrollStudent = () => {
  enrollment.submit(
    {},
    {
      onSuccess() {
        window.location.reload()
      },
    }
  )
}

const canGoZen = () => {
  if (
    user.data?.is_moderator ||
    user.data?.is_instructor ||
    user.data?.is_evaluator
  )
    return true
  if (lesson.data?.membership) return true
  return false
}

const goFullScreen = () => {
  if (lessonContainer.value.requestFullscreen) {
    lessonContainer.value.requestFullscreen()
  } else if (lessonContainer.value.mozRequestFullScreen) {
    lessonContainer.value.mozRequestFullScreen()
  } else if (lessonContainer.value.webkitRequestFullscreen) {
    lessonContainer.value.webkitRequestFullscreen()
  } else if (lessonContainer.value.msRequestFullscreen) {
    lessonContainer.value.msRequestFullscreen()
  }
}

const showDiscussionsInZenMode = () => {
  if (allowDiscussions.value) {
    allowDiscussions.value = false
  } else {
    allowDiscussions.value = true
    scrollDiscussionsIntoView()
  }
}

const scrollDiscussionsIntoView = () => {
  nextTick(() => {
    discussionsContainer.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    })
  })
}

const redirectToLogin = () => {
  window.location.href = `/login?redirect-to=/lms/courses/${props.courseName}`
}

usePageMeta(() => {
  return {
    title: lesson?.data?.title,
    icon: brand.favicon,
  }
})
</script>
