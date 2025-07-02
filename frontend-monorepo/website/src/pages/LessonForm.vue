<template>
  <div class="">
    <div class="grid md:grid-cols-[75%,25%] h-screen">
      <div class="border-r">
        <header
          class="sticky top-0 z-10 flex flex-col md:flex-row md:items-center justify-between border-b overflow-hidden bg-surface-white px-3 py-2.5 sm:px-5">
          <Breadcrumbs class="text-ellipsis" :items="breadcrumbs" />
          <Button variant="solid" @click="saveLesson({ showSuccessMessage: true })" class="mt-3 md:mt-0">
            {{ __('Save') }}
          </Button>
        </header>
        <div class="py-5">
          <div class="w-5/6 mx-auto">
            <FormControl v-model="lesson.title" label="Title" class="mb-4" :required="true" />
            <FormControl v-model="lesson.include_in_preview" type="checkbox" label="Include in Preview" />
          </div>
          <div class="border-t mt-4">
            <div class="w-5/6 mx-auto pt-4">
              <div class="flex justify-between cursor-pointer" @click="
                () => {
                  openInstructorEditor = !openInstructorEditor
                }
              ">
                <label class="block font-medium text-ink-gray-5 mb-1">
                  {{ __('Instructor Notes') }}
                </label>
                <ChevronRight class="stroke-2 h-5 w-5 text-ink-gray-5" :class="{
                  'rotate-90 transform duration-200': openInstructorEditor,
                  'duration-200': !openInstructorEditor,
                }" />
              </div>
              <div v-show="openInstructorEditor">
                <TextEditor editor-class="prose-sm min-h-[4rem] border rounded-b-lg border-t-0 p-2" :content="instructorNotesHtml"
                  placeholder="Type instructor notes..." @change="(val) => instructorNotesHtml = val" :bubbleMenu="true"
                  :fixed-menu="true" :extensions="contentExtensions" />
              </div>
            </div>
          </div>
          <div class="border-t mt-4">
            <div class="w-5/6 mx-auto pt-4">
              <label class="block font-medium text-ink-gray-5 mb-1">
                {{ __('Content') }}
              </label>
              <!-- <div
								id="content"
								class="ProseMirror prose prose-table:table-fixed prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border prose-td:border-outline-gray-2 prose-th:border-outline-gray-2 prose-td:relative prose-th:relative prose-th:bg-surface-gray-2 prose-sm max-w-none !whitespace-normal py-3"
							></div> -->
              <TextEditor editor-class="prose-sm min-h-[4rem] border rounded-b-lg border-t-0 p-2" :content="contentHtml"
                placeholder="Type something..." @change="(val) => contentHtml = val" :bubbleMenu="true"
                :fixed-menu="true" :extensions="contentExtensions" ref="editorRef" />
            </div>
          </div>
        </div>
      </div>
      <div class="">
        <div class="sticky top-0 p-5">
          <LessonHelp />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  Breadcrumbs,
  Button,
  createResource,
  FormControl,
  toast,
  usePageMeta,
} from '@mono/mono-frappe-ui'
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from 'vue'
import { sessionStore } from '../stores/session'
// import EditorJS from '@editorjs/editorjs'
import LessonHelp from '@/components/LessonHelp.vue'
import { capture, startRecording, stopRecording } from '@/telemetry'
import { enablePlyr, getEditorTools } from '@/utils'
import { useOnboarding } from '@mono/mono-frappe-ui/frappe'
import { ChevronRight } from 'lucide-vue-next'


import CodeBlockPlugin from '@/components/MTextEditor/CodeBlockPlugin.ts'
import { TextEditor } from '@mono/mono-frappe-ui'
import { common, createLowlight } from 'lowlight'
const lowlight = createLowlight(common)

// import {CodeBlockLowlight} from '@tiptap/extension-code-block-lowlight'
const contentHtml = ref('')
const instructorNotesHtml = ref('')
const contentExtensions = {
  "codeBlockLowlight": CodeBlockPlugin.configure({ lowlight }),
}

const { brand } = sessionStore()
const editor = ref(null)
const instructorEditor = ref(null)
const user = inject('$user')
const openInstructorEditor = ref(false)
const { updateOnboardingStep } = useOnboarding('learning')
let showSuccessMessage = false

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
  if (!user.data?.is_moderator && !user.data?.is_instructor) {
    window.location.href = '/login'
  }
  capture('lesson_form_opened')
  startRecording()
  // editor.value = renderEditor('content')
  // instructorEditor.value = renderEditor('instructor-notes')
  // window.addEventListener('keydown', keyboardShortcut)
  enablePlyr()




})

const renderEditor = (holder) => {
  return new EditorJS({
    holder: holder,
    tools: getEditorTools(true),
    autofocus: true,
    defaultBlock: 'markdown',
    onChange: async (api, event) => {
      enablePlyr()
    },
  })
}

const lesson = reactive({
  title: '',
  include_in_preview: false,
  body: '',
  instructor_notes: '',
  content: '',
  instructor_content: '',
})

const lessonDetails = createResource({
  url: 'lms.lms.utils.get_lesson_creation_details',
  params: {
    course: props.courseName,
    chapter: props.chapterNumber,
    lesson: props.lessonNumber,
  },
  auto: true,
  onSuccess(data) {
    if (data.lesson) {
      Object.keys(data.lesson).forEach((key) => {
        lesson[key] = data.lesson[key]
      })
      lesson.include_in_preview = data?.lesson?.include_in_preview
        ? true
        : false
      addLessonContent(data)
    }
  },
})

const convertToJSON = (data) => {
  try {
    return data
  } catch (error) {
    throw error;
  }
  throw new Error('Invalid JSON format')
}

const addLessonContent = (data) => {
  if (data.lesson.content) {
    try {
      const parsedContent = JSON.parse(data.lesson.content)
      if (parsedContent.html) {
        // New format: has both json and html
        contentHtml.value = parsedContent.html
      } else {
        // Legacy format: just HTML content
        contentHtml.value = data.lesson.content
      }
    } catch (e) {
      // Not JSON, treat as plain HTML
      contentHtml.value = data.lesson.content
    }
  }

  if (data.lesson.instructor_content) {
    try {
      const parsedInstructorContent = JSON.parse(data.lesson.instructor_content)
      if (parsedInstructorContent.html) {
        // New format: has both json and html
        instructorNotesHtml.value = parsedInstructorContent.html
      } else {
        // Legacy format: just HTML content
        instructorNotesHtml.value = data.lesson.instructor_content
      }
    } catch (e) {
      // Not JSON, treat as plain HTML
      instructorNotesHtml.value = data.lesson.instructor_content
    }
  }
}

const addInstructorNotes = (data) => {
  instructorEditor.value.isReady.then(() => {
    if (data.lesson.instructor_content) {
      instructorEditor.value.render(JSON.parse(data.lesson.instructor_content))
    } else if (data.lesson.instructor_notes) {
      let blocks = convertToJSON(data.lesson)
      instructorEditor.value.render({
        blocks: blocks,
      })
    }
  })
}

const keyboardShortcut = (e) => {
  if (
    e.key === 's' &&
    (e.ctrlKey || e.metaKey) &&
    !e.target.classList.contains('ProseMirror')
  ) {
    saveLesson({ showSuccessMessage: true })
    e.preventDefault()
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', keyboardShortcut)
  stopRecording()
})

const newLessonResource = createResource({
  url: 'frappe.client.insert',
  makeParams(values) {
    return {
      doc: {
        doctype: 'Course Lesson',
        course: props.courseName,
        chapter: lessonDetails.data?.chapter.name,
        ...lesson,
      },
    }
  },
})

const editLesson = createResource({
  url: 'frappe.client.set_value',
  makeParams(values) {
    return {
      doctype: 'Course Lesson',
      name: values.lesson,
      fieldname: lesson,
    }
  },
})

const lessonReference = createResource({
  url: 'frappe.client.insert',
  makeParams(values) {
    return {
      doc: {
        doctype: 'Lesson Reference',
        parent: lessonDetails.data?.chapter.name,
        parenttype: 'Course Chapter',
        parentfield: 'lessons',
        lesson: values.lesson,
        idx: props.lessonNumber,
      },
    }
  },
})


// Function to convert HTML to a simple JSON representation for TipTap
const convertHtmlToTipTapJson = (html) => {
  // This is a simplified conversion - in a real implementation,
  // you might want to use DOMParser and more sophisticated parsing
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: html.replace(/<[^>]*>/g, '') // Strip HTML tags for simple text extraction
          }
        ]
      }
    ]
  }
}

const saveLesson = (e) => {
  showSuccessMessage = false
  if (typeof e != 'undefined' && e.showSuccessMessage) {
    showSuccessMessage = true
  }

  // Store content in combined format: {json: ..., html: ...}
  lesson.content = JSON.stringify({
    json: convertHtmlToTipTapJson(contentHtml.value),
    html: contentHtml.value
  })

  // Store instructor content in combined format: {json: ..., html: ...}
  // Only store if there's actual content
  if (instructorNotesHtml.value && instructorNotesHtml.value.trim()) {
    lesson.instructor_content = JSON.stringify({
      json: convertHtmlToTipTapJson(instructorNotesHtml.value),
      html: instructorNotesHtml.value
    })
  } else {
    lesson.instructor_content = ''
  }

  if (lessonDetails.data?.lesson) {
    editCurrentLesson()
  } else {
    createNewLesson()
  }
}

const createNewLesson = () => {
  newLessonResource.submit(
    {},
    {
      validate() {
        return validateLesson()
      },
      onSuccess(data) {
        lessonReference.submit(
          { lesson: data.name },
          {
            onSuccess() {
              if (user.data?.is_system_manager)
                updateOnboardingStep('create_first_lesson')

              capture('lesson_created')
              toast.success(__('Lesson created successfully'))
              lessonDetails.reload()
            },
          }
        )
      },
      onError(err) {
        toast.error(err.messages?.[0] || err)
      },
    }
  )
}

const editCurrentLesson = () => {
  editLesson.submit(
    {
      lesson: lessonDetails.data.lesson.name,
    },
    {
      validate() {
        return validateLesson()
      },
      onSuccess() {
        showSuccessMessage
          ? toast.success(__('Lesson updated successfully'))
          : ''
      },
      onError(err) {
        toast.error(err.message)
      },
    }
  )
}

const validateLesson = () => {
  if (!lesson.title) {
    return 'Title is required'
  }
  if (!lesson.content) {
    return 'Content is required'
  }
}

const breadcrumbs = computed(() => {
  let crumbs = [
    {
      label: 'Courses',
      route: { name: 'Courses' },
    },
    {
      label: lessonDetails.data?.course_title,
      route: { name: 'CourseForm', params: { courseName: props.courseName } },
    },
  ]

  if (lessonDetails?.data?.lesson) {
    crumbs.push({
      label: lessonDetails.data.lesson.title,
      route: {
        name: 'Lesson',
        params: {
          courseName: props.courseName,
          chapterNumber: props.chapterNumber,
          lessonNumber: props.lessonNumber,
        },
      },
    })
  }
  crumbs.push({
    label: lessonDetails?.data?.lesson ? 'Edit Lesson' : 'Create Lesson',
    route: {
      name: 'LessonForm',
      params: {
        courseName: props.courseName,
        chapterNumber: props.chapterNumber,
        lessonNumber: props.lessonNumber,
      },
    },
  })
  return crumbs
})

usePageMeta(() => {
  return {
    title: lessonDetails?.data?.lesson
      ? lessonDetails.data.lesson.title
      : 'New Lesson',
    icon: brand.favicon,
  }
})
</script>
