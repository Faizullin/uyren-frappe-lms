<template>
  <div class="code-block-renderer">
    <div class="code-block-controls">
      <button class="action-btn" @click="copyCode" title="Copy code">
        <Copy class="h-4 w-4" />
      </button>
      <button
        v-if="allowRun"
        class="action-btn"
        @click="runCode"
        :disabled="isRunning"
        title="Run code"
      >
        <Play v-if="!isRunning" class="h-4 w-4" />
        <Loader v-else class="h-4 w-4 animate-spin" />
      </button>
    </div>

    <pre class="code-content" :data-language="language"><code>{{ code }}</code></pre>

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
</template>

<script setup>
import { Copy, Play, Loader, X } from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'javascript'
  },
  allowRun: {
    type: Boolean,
    default: false
  }
})

// Reactive state
const codeOutput = ref('')
const isRunning = ref(false)
const showOutput = ref(false)
const isError = ref(false)

// Copy code
async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}

// Run code
async function runCode() {
  if (!props.allowRun) return

  isRunning.value = true
  isError.value = false
  showOutput.value = true

  try {
    const result = await executeCode(props.code, props.language)
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

// Execute code via API
async function executeCode(code, language) {
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
    throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`)
  }

  // Format response
  let output = ''
  if (result.output) output += result.output
  if (result.error_output) output += result.error_output

  return output.trim() || 'Code executed successfully (no output)'
}
</script>

<style scoped>
.code-block-renderer {
  background: #1a1a1a;
  border-radius: 1rem;
  border: 1px solid #333;
  position: relative;
  margin: 1rem 0;
  overflow: hidden;

  /* Performance optimizations */
  transform: translateZ(0); /* Force GPU acceleration */
  will-change: auto; /* Only apply will-change when needed */
}

.code-block-controls {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.code-block-renderer:hover .code-block-controls {
  opacity: 1;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 0.375rem;
  padding: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.code-content {
  background: #0d0d0d;
  color: #fff;
  font-family: ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono',
    'Roboto Mono', 'Oxygen Mono', 'Ubuntu Mono', 'Source Code Pro', 'Fira Mono',
    'Droid Sans Mono', 'Consolas', 'Courier New', monospace;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  position: relative;

  /* Performance optimizations */
  contain: layout style; /* Improve rendering performance */
  overscroll-behavior: contain; /* Prevent scrolling conflicts */
}

.code-content code {
  color: inherit;
  padding: 0;
  background: none;
  font-size: 12px;
  line-height: 1.5;

  /* Performance: Prevent layout shifts */
  display: block;
  white-space: pre;
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
  justify-content: space-between;
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

/* Syntax highlighting styles */
:deep(.hljs-comment),
:deep(.hljs-quote) {
  color: #999;
}

:deep(.hljs-variable),
:deep(.hljs-template-variable),
:deep(.hljs-attribute),
:deep(.hljs-tag),
:deep(.hljs-name),
:deep(.hljs-regexp),
:deep(.hljs-link),
:deep(.hljs-selector-id),
:deep(.hljs-selector-class) {
  color: #f2777a;
}

:deep(.hljs-number),
:deep(.hljs-meta),
:deep(.hljs-built_in),
:deep(.hljs-builtin-name),
:deep(.hljs-literal),
:deep(.hljs-type),
:deep(.hljs-params) {
  color: #f99157;
}

:deep(.hljs-string),
:deep(.hljs-symbol),
:deep(.hljs-bullet) {
  color: #99cc99;
}

:deep(.hljs-title),
:deep(.hljs-section) {
  color: #ffcc66;
}

:deep(.hljs-keyword),
:deep(.hljs-selector-tag) {
  color: #6196cc;
}

:deep(.hljs-emphasis) {
  font-style: italic;
}

:deep(.hljs-strong) {
  font-weight: 700;
}
</style>
