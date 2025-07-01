<template>
  <div>
    <Button @click="dialog2 = true">Open Advanced Dialog</Button>

    <Dialog v-model="dialog2">
      <template #body-title>
        <h3>Advanced Code Settings</h3>
      </template>

      <template #body-content>
        <Tabs v-model="activeTab">
          <Tab name="settings" label="Settings">
            <div class="p-4 space-y-4">
              <Checkbox v-model="allowRun" label="Allow Run" />
              <Checkbox v-model="staticOutput" label="Static Output" />
              <Button
                v-if="staticOutput"
                size="sm"
                @click="runCode"
              >
                Run
              </Button>
            </div>
          </Tab>

          <Tab name="code" label="Code">
            <div class="p-4">
              <codemirror
                v-model="code"
                :options="cmOptions"
                class="border rounded mb-4"
              />
              <div class="border rounded p-3">
                <strong>Output:</strong>
                <pre class="whitespace-pre-wrap">{{ output }}</pre>
              </div>
            </div>
          </Tab>
        </Tabs>
      </template>

      <template #actions>
        <Button variant="solid" @click="onConfirm">
          Confirm
        </Button>
        <Button variant="outline" class="ml-2" @click="dialog2 = false">
          Close
        </Button>
        <Button variant="primary" class="ml-2" @click="onSave">
          Save
        </Button>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Dialog, Button, Checkbox, Tabs, Tab } from '@mono/mono-frappe-ui'
import { Codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'

const dialog2 = ref(false)
const activeTab = ref<'settings' | 'code'>('settings')
const allowRun = ref(false)
const staticOutput = ref(false)
const code = ref(`// write your JS here
Math.random() * 100`)
const output = ref('')

// CodeMirror options
const cmOptions = {
  mode: 'javascript',
  lineNumbers: true,
  lineWrapping: true,
  tabSize: 2,
}

// auto‐run logic
watch(code, () => {
  if (allowRun.value && !staticOutput.value) {
    runCode()
  }
})

function runCode() {
  try {
    // eslint-disable-next-line no-eval
    const result = eval(code.value)
    output.value = String(result)
  } catch (err: any) {
    output.value = `Error: ${err.message}`
  }
}

function onConfirm() {
  // whatever “Confirm” should do
  console.log('Confirmed with settings:', {
    allowRun: allowRun.value,
    staticOutput: staticOutput.value,
  })
}

function onSave() {
  // persist code & settings
  console.log('Saved code and settings:', {
    code: code.value,
    allowRun: allowRun.value,
    staticOutput: staticOutput.value,
  })
  dialog2.value = false
}
</script>

<style scoped>
/* ensure editor has a reasonable height */
.CodeMirror {
  height: 200px;
}
</style>
