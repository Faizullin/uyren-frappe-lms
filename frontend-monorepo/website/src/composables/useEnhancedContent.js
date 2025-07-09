/**
 * Composable for enhanced lesson content rendering with performance optimizations
 */
import { ref, watch, nextTick, shallowRef } from 'vue'
import { enhanceLessonContent } from '@/utils/contentProcessor'
import { measurePerformance, recordCacheMetric } from '@/utils/performanceUtils'

// Global cache and debounce management
const globalContentCache = new Map()
const processingQueue = new Map()
const MAX_CACHE_SIZE = 20

// Debounce timers
const debounceTimers = new Map()

export function useEnhancedContent() {
  const contentRef = ref(null)
  const instructorContentRef = ref(null)

  // Track processing state to prevent concurrent processing
  const isProcessing = shallowRef(false)

  /**
   * Create a content hash for caching
   * @param {string} content - The content to hash
   * @returns {string} - A short hash string
   */
  const createContentHash = (content) => {
    // Simple but effective hash for caching
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }

  /**
   * Clean up old cache entries
   */
  const cleanupCache = () => {
    if (globalContentCache.size > MAX_CACHE_SIZE) {
      const entries = Array.from(globalContentCache.entries())
      const toDelete = entries.slice(0, entries.length - MAX_CACHE_SIZE)
      toDelete.forEach(([key]) => globalContentCache.delete(key))
    }
  }

  /**
   * Check if content needs processing (has code blocks)
   * @param {string} htmlContent - The HTML content to check
   * @returns {boolean} - True if content has code blocks
   */
  const needsProcessing = (htmlContent) => {
    if (!htmlContent) return false

    // Quick check for code block indicators without full DOM parsing
    const hasCodeBlocks = /(<pre[^>]*>|<code[^>]*>|data-language=|class=["']?language-)/i.test(htmlContent)
    return hasCodeBlocks
  }

  /**
   * Process content and enhance it with interactive components
   * @param {string} htmlContent - The HTML content to process
   * @param {Ref} containerRef - Vue ref to the container element
   * @param {string} cacheKey - Optional cache key override
   */
  const processContent = async (htmlContent, containerRef, cacheKey = null) => {
    return measurePerformance('composable-process-content', async () => {
      if (!htmlContent || !containerRef.value) return

      // Skip processing if no code blocks detected
      if (!needsProcessing(htmlContent)) {
        containerRef.value.innerHTML = htmlContent
        return
      }

      // Create cache key
      const contentHash = cacheKey || createContentHash(htmlContent)

      // Check cache first
      if (globalContentCache.has(contentHash)) {
        recordCacheMetric(true) // Cache hit
        const cachedContent = globalContentCache.get(contentHash)
        containerRef.value.innerHTML = cachedContent
        return
      }

      recordCacheMetric(false) // Cache miss

      // Check if already processing this content
      if (processingQueue.has(contentHash)) {
        await processingQueue.get(contentHash)
        return
      }

      // Mark as processing
      isProcessing.value = true

      const processingPromise = (async () => {
        try {
          // Use requestIdleCallback for non-blocking processing
          await new Promise(resolve => {
            if (window.requestIdleCallback) {
              window.requestIdleCallback(async () => {
                await enhanceLessonContent(htmlContent, containerRef.value)
                resolve()
              }, { timeout: 1000 }) // 1 second timeout
            } else {
              // Fallback for browsers without requestIdleCallback
              setTimeout(async () => {
                await enhanceLessonContent(htmlContent, containerRef.value)
                resolve()
              }, 0)
            }
          })

          // Cache the processed content
          globalContentCache.set(contentHash, containerRef.value.innerHTML)
          cleanupCache()

        } catch (error) {
          console.error('Error processing lesson content:', error)
          // Fallback to basic HTML rendering
          containerRef.value.innerHTML = htmlContent
        } finally {
          isProcessing.value = false
          processingQueue.delete(contentHash)
        }
      })()

      processingQueue.set(contentHash, processingPromise)
      await processingPromise
    })
  }

  /**
   * Enhanced debounced watcher with intelligent updates
   * @param {ComputedRef} contentHtml - Computed ref with HTML content
   * @param {Ref} containerRef - Vue ref to the container element
   * @param {number} delay - Debounce delay in milliseconds
   */
  const watchContent = (contentHtml, containerRef, delay = 150) => {
    const watcherId = `watcher_${Math.random().toString(36).substr(2, 9)}`

    watch(
      [contentHtml, containerRef],
      ([newContent, container]) => {
        if (!newContent || !container) return

        // Clear existing debounce timer
        if (debounceTimers.has(watcherId)) {
          clearTimeout(debounceTimers.get(watcherId))
        }

        // Set new debounce timer
        const timerId = setTimeout(async () => {
          await processContent(newContent, containerRef)
          debounceTimers.delete(watcherId)
        }, delay)

        debounceTimers.set(watcherId, timerId)
      },
      { immediate: true, flush: 'post' }
    )

    // Cleanup function
    return () => {
      if (debounceTimers.has(watcherId)) {
        clearTimeout(debounceTimers.get(watcherId))
        debounceTimers.delete(watcherId)
      }
    }
  }

  /**
   * Watch for instructor content changes with optimized processing
   * @param {ComputedRef} instructorContentHtml - Computed ref with HTML content
   * @param {Ref} containerRef - Vue ref to the container element
   */
  const watchInstructorContent = (instructorContentHtml, containerRef) => {
    const watcherId = `instructor_watcher_${Math.random().toString(36).substr(2, 9)}`

    watch(
      [instructorContentHtml, containerRef],
      ([newContent, container]) => {
        if (!newContent || !container) return

        // Clear existing debounce timer
        if (debounceTimers.has(watcherId)) {
          clearTimeout(debounceTimers.get(watcherId))
        }

        // Use longer debounce for instructor content (usually less frequently updated)
        const timerId = setTimeout(async () => {
          await processContent(newContent, containerRef, `instructor_${createContentHash(newContent)}`)
          debounceTimers.delete(watcherId)
        }, 200)

        debounceTimers.set(watcherId, timerId)
      },
      { immediate: true, flush: 'post' }
    )

    // Cleanup function
    return () => {
      if (debounceTimers.has(watcherId)) {
        clearTimeout(debounceTimers.get(watcherId))
        debounceTimers.delete(watcherId)
      }
    }
  }

  /**
   * Manually clear the content cache (useful for debugging or memory management)
   */
  const clearCache = () => {
    globalContentCache.clear()
    processingQueue.clear()
    debounceTimers.forEach(timer => clearTimeout(timer))
    debounceTimers.clear()
  }

  /**
   * Get cache statistics for debugging
   */
  const getCacheStats = () => ({
    cacheSize: globalContentCache.size,
    processingQueueSize: processingQueue.size,
    activeTimers: debounceTimers.size,
    isProcessing: isProcessing.value
  })

  return {
    contentRef,
    instructorContentRef,
    processContent,
    watchContent,
    watchInstructorContent,
    clearCache,
    getCacheStats,
    isProcessing
  }
}
