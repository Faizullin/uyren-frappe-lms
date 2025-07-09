/**
 * Content processor for enhancing HTML content with interactive components
 * Optimized for performance with batch processing and DOM fragment manipulation
 */
import { h, render } from 'vue'
import CodeBlockRenderer from '@/components/CodeBlockRenderer.vue'
import { measurePerformance, recordCacheMetric } from './performanceUtils'

// Performance optimization: Reuse selectors
const CODE_BLOCK_SELECTORS = [
  'pre[data-language]',
  'pre code[class*="language-"]',
  'pre code[class*="hljs"]',
  'pre:has(code)',
  'pre code',
  '.code-block pre',
  '[data-type="codeBlockWithSettings"]'
].join(', ')

/**
 * Extract code block information efficiently
 * @param {Element} element - The code block element
 * @returns {Object|null} - Code block info or null if invalid
 */
function extractCodeBlockInfo(element) {
  const isPreElement = element.tagName === 'PRE'
  const codeElement = isPreElement ? element.querySelector('code') : element
  const preElement = isPreElement ? element : element.closest('pre')

  if (!codeElement || !preElement || !preElement.parentNode) {
    return null
  }

  // Extract code content
  const code = codeElement.textContent || ''
  if (!code.trim()) return null

  // Extract language from various sources
  let language = preElement.getAttribute('data-language') ||
                element.getAttribute('data-language')

  if (!language && codeElement.className) {
    const langMatch = codeElement.className.match(/(?:language-|hljs-?)(\w+)/)
    language = langMatch ? langMatch[1] : null
  }

  if (!language && preElement.className) {
    const preLangMatch = preElement.className.match(/(?:language-|hljs-?)(\w+)/)
    language = preLangMatch ? preLangMatch[1] : null
  }

  // Auto-detect language if not specified
  if (!language) {
    language = detectLanguage(code)
  }

  // Extract run permission
  const allowRun = preElement.getAttribute('data-allow-run') === 'true' ||
                  element.getAttribute('data-allow-run') === 'true'

  return {
    code,
    language: language || 'javascript',
    allowRun,
    preElement,
    codeElement
  }
}

/**
 * Simple language detection based on content patterns
 * @param {string} code - The code content
 * @returns {string} - Detected language
 */
function detectLanguage(code) {
  const patterns = [
    { lang: 'php', regex: /<\?php|<\?=/ },
    { lang: 'python', regex: /^\s*(def|import|from|class)\s+/m },
    { lang: 'javascript', regex: /(function\s*\(|=>\s*{|import\s+.*from|const\s+\w+\s*=)/ },
    { lang: 'typescript', regex: /(interface\s+\w+|type\s+\w+\s*=|:\s*(string|number|boolean))/ },
    { lang: 'html', regex: /<!DOCTYPE|<html|<\/html>/ },
    { lang: 'css', regex: /{[\s\S]*}|@media|@keyframes/ },
    { lang: 'sql', regex: /(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)\s+/i },
    { lang: 'json', regex: /^[\s]*{[\s\S]*}[\s]*$|^[\s]*\[[\s\S]*\][\s]*$/ },
    { lang: 'yaml', regex: /^[\s]*\w+:\s*\w+/m },
    { lang: 'bash', regex: /^[\s]*#!\/bin\/(bash|sh)|^\s*\$\s+/ }
  ]

  for (const { lang, regex } of patterns) {
    if (regex.test(code)) {
      return lang
    }
  }

  return 'javascript' // default fallback
}

/**
 * Create and mount Vue component efficiently
 * @param {Object} codeInfo - Code block information
 * @returns {Element} - The wrapper element
 */
function createCodeBlockComponent(codeInfo) {
  const wrapper = document.createElement('div')
  wrapper.setAttribute('data-enhanced', 'code-block')
  wrapper.className = 'enhanced-code-block'

  // Create and mount Vue component
  const componentVNode = h(CodeBlockRenderer, {
    code: codeInfo.code,
    language: codeInfo.language,
    allowRun: codeInfo.allowRun
  })

  render(componentVNode, wrapper)
  return wrapper
}

/**
 * Process HTML content and replace code blocks with interactive components
 * Uses batch processing for better performance
 * @param {string} htmlContent - The HTML content to process
 * @param {HTMLElement} container - The container element to render into
 */
export async function processLessonContent(htmlContent, container) {
  return measurePerformance('content-processing-standard', async () => {
    if (!htmlContent || !container) return

    // Set the initial HTML content
    container.innerHTML = htmlContent

    // Use document fragment for batch DOM operations
    const codeBlocks = container.querySelectorAll(CODE_BLOCK_SELECTORS)

    if (codeBlocks.length === 0) return

    console.log(`Found ${codeBlocks.length} code blocks to process`)

    // Process in batches to avoid blocking the main thread
    const BATCH_SIZE = 5
    const batches = []

    for (let i = 0; i < codeBlocks.length; i += BATCH_SIZE) {
      batches.push(Array.from(codeBlocks).slice(i, i + BATCH_SIZE))
    }

    // Process batches with minimal delays
    const processBatch = async (batchIndex) => {
      if (batchIndex >= batches.length) return

      return measurePerformance(`dom-manipulation-batch-${batchIndex}`, async () => {
        const batch = batches[batchIndex]
        const replacements = []

        // Prepare all replacements for this batch
        for (const codeBlock of batch) {
          try {
            const codeInfo = extractCodeBlockInfo(codeBlock)
            if (!codeInfo) continue

            const wrapper = createCodeBlockComponent(codeInfo)
            replacements.push({ original: codeInfo.preElement, replacement: wrapper })
          } catch (error) {
            console.error('Error processing code block:', error)
          }
        }

        // Apply all replacements in this batch
        replacements.forEach(({ original, replacement }) => {
          try {
            if (original.parentNode) {
              original.parentNode.replaceChild(replacement, original)
            }
          } catch (error) {
            console.error('Error replacing code block:', error)
          }
        })

        // Schedule next batch
        if (batchIndex + 1 < batches.length) {
          await new Promise(resolve => {
            requestAnimationFrame(async () => {
              await processBatch(batchIndex + 1)
              resolve()
            })
          })
        }
      })
    }

    // Start processing
    await new Promise(resolve => {
      requestAnimationFrame(async () => {
        await processBatch(0)
        resolve()
      })
    })
  })
}

/**
 * Process TipTap HTML content specifically
 * This handles the HTML format that comes from TipTap editor
 * @param {string} htmlContent - The HTML content from TipTap
 * @param {HTMLElement} container - The container element to render into
 */
export function processTipTapContent(htmlContent, container) {
  if (!htmlContent || !container) return

  // Early return if no code blocks detected
  if (!/(<pre|<code|data-language=|class=["']?language-)/i.test(htmlContent)) {
    return
  }

  // Set the initial HTML content only if not already set
  if (container.innerHTML !== htmlContent) {
    container.innerHTML = htmlContent
  }

  // Find code blocks in TipTap format and other variations
  const codeBlocks = container.querySelectorAll(CODE_BLOCK_SELECTORS)

  if (codeBlocks.length === 0) return

  console.log(`Found ${codeBlocks.length} TipTap code blocks to process`)

  // Use the same batch processing as processLessonContent
  const BATCH_SIZE = 5
  const batches = []

  for (let i = 0; i < codeBlocks.length; i += BATCH_SIZE) {
    batches.push(Array.from(codeBlocks).slice(i, i + BATCH_SIZE))
  }

  const processBatch = (batchIndex) => {
    if (batchIndex >= batches.length) return

    const batch = batches[batchIndex]
    const replacements = []

    for (const element of batch) {
      try {
        // Skip if already processed
        if (element.closest('[data-enhanced]')) continue

        const codeInfo = extractCodeBlockInfo(element)
        if (!codeInfo) continue

        const wrapper = createCodeBlockComponent(codeInfo)
        replacements.push({ original: codeInfo.preElement, replacement: wrapper })
      } catch (error) {
        console.error('Error processing TipTap code block:', error)
      }
    }

    // Apply replacements
    replacements.forEach(({ original, replacement }) => {
      try {
        if (original.parentNode) {
          original.parentNode.replaceChild(replacement, original)
        }
      } catch (error) {
        console.error('Error replacing TipTap code block:', error)
      }
    })

    // Schedule next batch
    if (batchIndex + 1 < batches.length) {
      requestAnimationFrame(() => processBatch(batchIndex + 1))
    }
  }

  requestAnimationFrame(() => processBatch(0))
}

/**
 * Enhanced content processor that handles both formats with optimizations
 * @param {string} htmlContent - The HTML content to process
 * @param {HTMLElement} container - The container element to render into
 */
export async function enhanceLessonContent(htmlContent, container) {
  return measurePerformance('content-processing-enhanced', async () => {
    if (!htmlContent || !container) {
      console.warn('enhanceLessonContent: Missing htmlContent or container', {
        htmlContent: !!htmlContent,
        container: !!container
      })
      return
    }

    // Early return if no code blocks detected
    if (!/(<pre|<code|data-language=|class=["']?language-)/i.test(htmlContent)) {
      container.innerHTML = htmlContent
      return
    }

    console.log('Processing content with enhanceLessonContent', {
      contentLength: htmlContent.length,
      container: container.tagName
    })

    // Set initial content
    container.innerHTML = htmlContent

    // Use unified processing with the optimized selector
    const allCodeBlocks = container.querySelectorAll(CODE_BLOCK_SELECTORS)

    if (allCodeBlocks.length === 0) return

    console.log(`Found ${allCodeBlocks.length} total code blocks to process`)

    // Process all code blocks with batch processing
    const BATCH_SIZE = 3 // Smaller batch size for better responsiveness
    const batches = []

    for (let i = 0; i < allCodeBlocks.length; i += BATCH_SIZE) {
      batches.push(Array.from(allCodeBlocks).slice(i, i + BATCH_SIZE))
    }

    const processBatch = async (batchIndex) => {
      if (batchIndex >= batches.length) return

      return measurePerformance(`dom-manipulation-enhanced-batch-${batchIndex}`, async () => {
        const batch = batches[batchIndex]
        const replacements = []

        for (const element of batch) {
          try {
            // Skip if already processed
            if (element.closest('[data-enhanced]')) continue

            const codeInfo = extractCodeBlockInfo(element)
            if (!codeInfo) continue

            const wrapper = createCodeBlockComponent(codeInfo)
            replacements.push({ original: codeInfo.preElement, replacement: wrapper })
          } catch (error) {
            console.error('Error processing code block:', error)
          }
        }

        // Apply all replacements in this batch
        replacements.forEach(({ original, replacement }) => {
          try {
            if (original.parentNode && !original.closest('[data-enhanced]')) {
              original.parentNode.replaceChild(replacement, original)
            }
          } catch (error) {
            console.error('Error replacing code block:', error)
          }
        })

        // Schedule next batch with a small delay to maintain responsiveness
        if (batchIndex + 1 < batches.length) {
          await new Promise(resolve => {
            requestAnimationFrame(async () => {
              await processBatch(batchIndex + 1)
              resolve()
            })
          })
        }
      })
    }

    // Start processing
    await new Promise(resolve => {
      requestAnimationFrame(async () => {
        await processBatch(0)
        resolve()
      })
    })
  })
}
