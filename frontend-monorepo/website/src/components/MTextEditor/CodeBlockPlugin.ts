import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CodeBlockComponent from './CodeBlockComponent.vue'

interface CodeBlockPluginOptions {
  /**
   * A callback that receives `(node, view, getPos)`
   * so you can open your dialog.
   */
  onSettingsClick: (node: any, view: any, getPos: () => number) => void
}

const CodeBlockPlugin = CodeBlockLowlight.extend<CodeBlockPluginOptions>({
  name: 'codeBlockLowlight',
  // group: 'block',
  // content: 'text*',
  // marks: '',
  // code: true,
  // defining: true,
  // isolating: true,

  /* ------------------------------------------------------------------ */
  /* 2️⃣  ATTRIBUTES                                                     */
  /* ------------------------------------------------------------------ */
  addAttributes() {
    return {
      language: {
        default: null as string | null,
        parseHTML: (el: HTMLElement) => {
          return el.getAttribute('data-language') || null
        },
        renderHTML: (attrs) => {
          return attrs.language ? { 'data-language': attrs.language } : {}
        },
      },

      allowRun: {
        default: false,
        parseHTML: (el: HTMLElement) => {
          return el.getAttribute('data-allow-run') === 'true'
        },
        renderHTML: (attrs) => (attrs.allowRun ? { 'data-allow-run': 'true' } : {}),
      },

      isStatic: {
        default: false,
        parseHTML: (el: HTMLElement) => {
          return el.getAttribute('data-is-static') === 'true'
        },
        renderHTML: (attrs) => (attrs.isStatic ? { 'data-is-static': 'true' } : {}),
      },
    }
  },
  // parseHTML() {
  //   return [
  //     {
  //       tag: 'pre[data-type="codeBlockWithSettings"]',
  //     },
  //   ]
  // },

  // renderHTML({ HTMLAttributes }) {
  //   return [
  //     'pre',
  //     mergeAttributes(HTMLAttributes, { 'data-type': 'codeBlockWithSettings' }),
  //     ['code', 0],
  //   ]
  // },

  addNodeView() {
    return VueNodeViewRenderer(CodeBlockComponent)
  },
})

export default CodeBlockPlugin
