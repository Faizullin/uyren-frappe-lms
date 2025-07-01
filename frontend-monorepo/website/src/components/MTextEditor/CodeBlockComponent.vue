<template>
  <node-view-wrapper>
    <div class="code-block-container">
      <div class="code-block-controls">
        <button class="settings-btn" @click="showSettings = true" title="Code-block settings">
          <Settings class="h-4 w-4" />
        </button>
      </div>
      <pre><code><node-view-content /></code></pre>

    </div>
    <Dialog v-model="showSettings">
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
import { Button, Dialog, FormControl, Tabs } from '@mono/frappe-ui'
import { Settings } from 'lucide-vue-next'
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

.settings-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
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
