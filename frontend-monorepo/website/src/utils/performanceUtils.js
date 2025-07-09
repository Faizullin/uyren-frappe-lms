/**
 * Performance utilities for monitoring content enhancement
 */

// Performance monitoring
const performanceMetrics = {
  contentProcessingTimes: [],
  highlightingTimes: [],
  domManipulationTimes: [],
  cacheHits: 0,
  cacheMisses: 0
}

/**
 * Measure the time taken by a function
 * @param {string} label - Label for the measurement
 * @param {Function} fn - Function to measure
 * @returns {*} - Result of the function
 */
export async function measurePerformance(label, fn) {
  const start = performance.now()

  try {
    const result = await fn()
    const end = performance.now()
    const duration = end - start

    // Store metrics
    if (label.includes('content')) {
      performanceMetrics.contentProcessingTimes.push(duration)
    } else if (label.includes('highlight')) {
      performanceMetrics.highlightingTimes.push(duration)
    } else if (label.includes('dom')) {
      performanceMetrics.domManipulationTimes.push(duration)
    }

    // Log slow operations
    if (duration > 100) {
      console.warn(`⚠️ Slow operation: ${label} took ${duration.toFixed(2)}ms`)
    }

    return result
  } catch (error) {
    const end = performance.now()
    console.error(`❌ Failed operation: ${label} failed after ${(end - start).toFixed(2)}ms`, error)
    throw error
  }
}

/**
 * Record cache hit/miss for performance tracking
 * @param {boolean} isHit - Whether it was a cache hit
 */
export function recordCacheMetric(isHit) {
  if (isHit) {
    performanceMetrics.cacheHits++
  } else {
    performanceMetrics.cacheMisses++
  }
}

/**
 * Get performance statistics
 * @returns {Object} - Performance statistics
 */
export function getPerformanceStats() {
  const calculateStats = (times) => {
    if (times.length === 0) return { min: 0, max: 0, avg: 0, count: 0 }

    const sorted = [...times].sort((a, b) => a - b)
    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: times.reduce((a, b) => a + b, 0) / times.length,
      p95: sorted[Math.floor(sorted.length * 0.95)],
      count: times.length
    }
  }

  const cacheHitRate = performanceMetrics.cacheHits + performanceMetrics.cacheMisses > 0
    ? (performanceMetrics.cacheHits / (performanceMetrics.cacheHits + performanceMetrics.cacheMisses) * 100)
    : 0

  return {
    contentProcessing: calculateStats(performanceMetrics.contentProcessingTimes),
    highlighting: calculateStats(performanceMetrics.highlightingTimes),
    domManipulation: calculateStats(performanceMetrics.domManipulationTimes),
    cache: {
      hits: performanceMetrics.cacheHits,
      misses: performanceMetrics.cacheMisses,
      hitRate: cacheHitRate.toFixed(2) + '%'
    }
  }
}

/**
 * Clear performance metrics
 */
export function clearPerformanceMetrics() {
  performanceMetrics.contentProcessingTimes = []
  performanceMetrics.highlightingTimes = []
  performanceMetrics.domManipulationTimes = []
  performanceMetrics.cacheHits = 0
  performanceMetrics.cacheMisses = 0
}

/**
 * Log performance summary to console
 */
export function logPerformanceSummary() {
  const stats = getPerformanceStats()

  console.group('🚀 Content Enhancement Performance Summary')

  if (stats.contentProcessing.count > 0) {
    console.log('📄 Content Processing:', {
      'Average': `${stats.contentProcessing.avg.toFixed(2)}ms`,
      'P95': `${stats.contentProcessing.p95.toFixed(2)}ms`,
      'Count': stats.contentProcessing.count
    })
  }

  if (stats.highlighting.count > 0) {
    console.log('🎨 Syntax Highlighting:', {
      'Average': `${stats.highlighting.avg.toFixed(2)}ms`,
      'P95': `${stats.highlighting.p95.toFixed(2)}ms`,
      'Count': stats.highlighting.count
    })
  }

  if (stats.domManipulation.count > 0) {
    console.log('🔧 DOM Manipulation:', {
      'Average': `${stats.domManipulation.avg.toFixed(2)}ms`,
      'P95': `${stats.domManipulation.p95.toFixed(2)}ms`,
      'Count': stats.domManipulation.count
    })
  }

  console.log('💾 Cache Performance:', stats.cache)

  console.groupEnd()
}

/**
 * Debounce function with performance tracking
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Whether to execute immediately
 * @returns {Function} - Debounced function
 */
export function performantDebounce(func, wait, immediate = false) {
  let timeout
  let lastCallTime = 0

  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) {
        const callTime = performance.now()
        const timeSinceLastCall = callTime - lastCallTime

        if (timeSinceLastCall > wait * 2) {
          console.log(`⏱️ Long debounce delay: ${timeSinceLastCall.toFixed(2)}ms`)
        }

        func.apply(this, args)
        lastCallTime = callTime
      }
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) {
      func.apply(this, args)
      lastCallTime = performance.now()
    }
  }
}

/**
 * Throttle function with performance tracking
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export function performantThrottle(func, limit) {
  let inThrottle
  let lastCallTime = 0

  return function(...args) {
    if (!inThrottle) {
      const callTime = performance.now()
      const timeSinceLastCall = callTime - lastCallTime

      func.apply(this, args)
      lastCallTime = callTime
      inThrottle = true

      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Development mode helpers
if (process.env.NODE_ENV === 'development') {
  // Add global access for debugging
  window.enhancementPerformance = {
    getStats: getPerformanceStats,
    clear: clearPerformanceMetrics,
    logSummary: logPerformanceSummary
  }

  // Automatically log summary every 30 seconds in development
  setInterval(logPerformanceSummary, 30000)
}
