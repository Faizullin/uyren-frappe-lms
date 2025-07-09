<template>
  <node-view-wrapper>
    <div class="code-block-container">
      <div class="code-block-controls">
        <button class="action-btn" @click="copyCode" title="Copy code">
          <Copy class="h-4 w-4" />
        </button>
        <button
          v-if="node.attrs.allowRun"
          class="action-btn"
          @click="runCode"
          :disabled="isRunning"
          title="Run code"
        >
          <Play v-if="!isRunning" class="h-4 w-4" />
          <Loader v-else class="h-4 w-4 animate-spin" />
        </button>
        <button
          v-if="isEditorMode"
          class="settings-btn"
          @click="showSettings = true"
          title="Code-block settings"
        >
          <Settings class="h-4 w-4" />
        </button>
      </div>
      <pre><code><node-view-content /></code></pre>

      <!-- Console output for code execution -->
      <div v-if="showOutput && codeOutput" class="code-console">
        <div class="console-header">
          <span class="console-title">Output:</span>
          <button @click="clearOutput" class="clear-btn" title="Clear output">
            <X class="h-3 w-3" />
          </button>
        </div>
        <pre class="console-content" :class="{ 'error': isError }">{{ codeOutput }}</pre>
      </div>
    </div>
    <Dialog v-if="isEditorMode" v-model="showSettings">
      <template #body-title>
        <h3>Code-block options</h3>
      </template>

      <template #body-content>

        <Tabs as="div" :tabs="[
          { label: 'Options', content: 'Options' },
          { label: 'Run', content: 'Run' }
        ]" v-model="tabState.index" class="mt-4">
          <template #tab-panel="{ tab }">
            <div v-if="tabState.index === 0">
              <!-- First tab: all options -->
              <FormControl type="autocomplete" :options="languages" size="sm" variant="subtle"
                placeholder="Select language" :disabled="false" label="Language" v-model="selectValue" class="mb-2" />
              <FormControl type="checkbox" v-model="tmp.allowRun" label="Allow run" class="mb-2" />
              <FormControl type="checkbox" v-model="tmp.isStatic" label="Is static" class="mb-2" />
            </div>
            <div v-else-if="tabState.index === 1">
              <!-- Second tab: textarea, disabled if not static -->
              <FormControl type="textarea" v-model="codeInput" label="Code Input" placeholder="Enter your code here..."
                :disabled="!tmp.isStatic" class="mb-2" />
              <Button @click="handleRunCode" :loading="isRunning" class="mb-2" :disabled="!tmp.isStatic">
                Run Code
              </Button>
              <div class="code-output" v-if="codeOutput !== ''">
                <h4>Output:</h4>
                <pre>{{ codeOutput }}</pre>
              </div>
            </div>
          </template>
        </Tabs>
      </template>

      <template #actions>
        <Button variant="solid" @click="saveSettings">Save</Button>
        <Button class="ml-2" @click="showSettings = false">Cancel</Button>
      </template>
    </Dialog>
  </node-view-wrapper>
</template>

<script setup>
/* core tiptap helpers */
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { Button, Dialog, FormControl, Tabs } from '@mono/mono-frappe-ui'
import { Settings, Copy, Play, Loader, X } from 'lucide-vue-next'
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps(nodeViewProps)

// ----- reactive state -----
const showSettings = ref(false)

/* copy current attrs into a temp object for the dialog */
const tmp = reactive({
  allowRun: props.node.attrs.allowRun ?? false,
  isStatic: props.node.attrs.isStatic ?? false,
  language: props.node.attrs.language || null,
})


const selectValue = ref(null)

watch(selectValue, (newVal) => {
  console.log('selectValue changed:', newVal)
  const attrs = props.node.attrs

  if (newVal && newVal.value !== attrs.language) {
    console.log('Updating language from', attrs, 'to', newVal.value)
    props.updateAttributes({ language: newVal.value })
  }
})

/* you already had this helper — unchanged */
const languages = computed(() =>
  props.extension.options.lowlight
    .listLanguages()
    .map((l) => ({ label: l, value: l }))
    .concat([{ label: 'html', value: 'xml' }])
    .sort((a, b) => a.label.localeCompare(b.label))
)

// ----- dialog logic -----
function saveSettings() {
  /* write values back to the node, including language */
  props.updateAttributes({
    allowRun: tmp.allowRun,
    isStatic: tmp.isStatic,
    language: selectValue.value ? selectValue.value.value : null,
  })
  console.log('Settings saved:', {
    allowRun: tmp.allowRun,
    isStatic: tmp.isStatic,
    language: selectValue.value ? selectValue.value.value : null,
  })
  showSettings.value = false
}

// Set selectValue when dialog opens, keep in sync with node attrs
watch(
  () => showSettings.value,
  (open) => {
    if (open) {
      const lang = props.node.attrs.language
      selectValue.value = lang
        ? languages.value.find((l) => l.value === lang) || null
        : null
    }
  }
)

const tabState = ref({ index: 0 })
const codeInput = ref('')
const codeOutput = ref('')
const isRunning = ref(false)
const showOutput = ref(false)
const isError = ref(false)

// Detect if we're in editor mode (has node and editor props)
const isEditorMode = computed(() => {
  return props.node && props.editor && typeof props.updateAttributes === 'function'
})

// Copy code functionality
async function copyCode() {
  try {
    const codeText = props.node.textContent || ''
    await navigator.clipboard.writeText(codeText)
    // You could add a toast notification here
    console.log('Code copied to clipboard')
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}

// Run code functionality
async function runCode() {
  if (!props.node.attrs.allowRun) return

  isRunning.value = true
  isError.value = false
  showOutput.value = true

  try {
    const codeText = props.node.textContent || ''
    const language = props.node.attrs.language || 'javascript'

    // Call your code execution API here
    const result = await executeCode(codeText, language)
    codeOutput.value = result
  } catch (error) {
    isError.value = true
    codeOutput.value = error.message || 'An error occurred while running the code'
  } finally {
    isRunning.value = false
  }
}

// Clear output
function clearOutput() {
  codeOutput.value = ''
  showOutput.value = false
  isError.value = false
}

// Execute code using the actual API
async function executeCode(code, language) {
  try {
    const apiUrl = import.meta.env.VITE_APP_SERVICE_V2_ABS_API_URL || 'http://82.115.49.85:8001'
    const response = await fetch(`${apiUrl}/api/v1/executions/execute-immediate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        language: language || 'javascript'
      })
    })

    const result = await response.json()

    if (!response.ok) {
      // Handle validation error (422) or other errors
      if (response.status === 422 && result.detail) {
        const errors = result.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join('\n')
        throw new Error(`Validation Error:\n${errors}`)
      }
      throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    // Format the successful response
    let output = ''
    if (result.status === 'string') {
      output += `Status: ${result.status}\n`
    }
    if (result.output) {
      output += `Output:\n${result.output}\n`
    }
    if (result.error_output) {
      output += `Errors:\n${result.error_output}\n`
    }
    if (result.execution_time) {
      output += `Execution Time: ${result.execution_time}\n`
    }
    if (result.memory_usage) {
      output += `Memory Usage: ${result.memory_usage}\n`
    }
    if (result.message) {
      output += `Message: ${result.message}`
    }

    return output.trim() || 'Code executed successfully (no output)'

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Failed to connect to code execution service. Please check your network connection.')
    }
    throw error
  }
}

async function handleRunCode() {
  isRunning.value = true
  try {
    // codeOutput.value = await runCode(
    //   selectValue.value ? selectValue.value.value : '',
    //   codeInput.value
    // )
  } catch (e) {
    codeOutput.value = String(e)
  } finally {
    isRunning.value = false
  }
}
</script>

<style>
/* CodeBlock styles */
.code-block {
  position: relative;
}

.code-block-container {
  position: relative;
}

.code-block-controls {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  z-index: 10;
}

.action-btn,
.settings-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  border-radius: 0.25rem;
  color: #fff;
}

.action-btn:hover,
.settings-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Console output styles */
.code-console {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  overflow: hidden;
}

.console-header {
  background: #2a2a2a;
  padding: 0.5rem 0.75rem;
  display: flex;
  justify-content: between;
  align-items: center;
  border-bottom: 1px solid #333;
}

.console-title {
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  flex: 1;
}

.clear-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.125rem;
  border-radius: 0.125rem;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #fff;
}

.console-content {
  background: #0d0d0d;
  color: #fff;
  padding: 0.75rem;
  margin: 0;
  font-family: ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono',
    'Roboto Mono', 'Oxygen Mono', 'Ubuntu Mono', 'Source Code Pro', 'Fira Mono',
    'Droid Sans Mono', 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
}

.console-content.error {
  color: #ff6b6b;
}

.ProseMirror pre {
  background: #0d0d0d;
  color: #fff;
  font-family: ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono',
    'Roboto Mono', 'Oxygen Mono', 'Ubuntu Mono', 'Source Code Pro', 'Fira Mono',
    'Droid Sans Mono', 'Consolas', 'Courier New', monospace;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  caret-color: #fff;
}

.ProseMirror pre code {
  color: inherit;
  padding: 0;
  background: none;
  font-size: 12px;
}

.ProseMirror pre .hljs-comment,
.ProseMirror pre .hljs-quote {
  color: #999;
}

.ProseMirror pre .hljs-variable,
.ProseMirror pre .hljs-template-variable,
.ProseMirror pre .hljs-attribute,
.ProseMirror pre .hljs-tag,
.ProseMirror pre .hljs-name,
.ProseMirror pre .hljs-regexp,
.ProseMirror pre .hljs-link,
.ProseMirror pre .hljs-selector-id,
.ProseMirror pre .hljs-selector-class {
  color: #f2777a;
}

.ProseMirror pre .hljs-number,
.ProseMirror pre .hljs-meta,
.ProseMirror pre .hljs-built_in,
.ProseMirror pre .hljs-builtin-name,
.ProseMirror pre .hljs-literal,
.ProseMirror pre .hljs-type,
.ProseMirror pre .hljs-params {
  color: #f99157;
}

.ProseMirror pre .hljs-string,
.ProseMirror pre .hljs-symbol,
.ProseMirror pre .hljs-bullet {
  color: #99cc99;
}

.ProseMirror pre .hljs-title,
.ProseMirror pre .hljs-section {
  color: #ffcc66;
}

.ProseMirror pre .hljs-keyword,
.ProseMirror pre .hljs-selector-tag {
  color: #6196cc;
}

.ProseMirror pre .hljs-emphasis {
  font-style: italic;
}

.ProseMirror pre .hljs-strong {
  font-weight: 700;
}
</style>
