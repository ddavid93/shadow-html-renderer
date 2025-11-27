/**
 * Unified HTML Renderer Composable
 *
 * This composable provides a unified interface for rendering HTML content using Shadow DOM
 * with style isolation and full script execution support.
 *
 * **Features:**
 * - Renders HTML in isolated Shadow DOM
 * - Complete style isolation
 * - Preserves full HTML structure (html, head, body tags)
 * - Extracts and injects @font-face rules for proper font loading
 * - Full script execution support (async, defer, sequential, module)
 *
 * @module useHtmlRenderer
 */

import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { IHtmlRendererComposable, IHtmlRendererOptions } from '../extras/types'
import { clearShadowRoot, renderIntoShadowRoot } from '../renderers/shadowRenderer'

/**
 * useHtmlRenderer
 *
 * A Vue 3 composable that renders HTML content using Shadow DOM with style isolation
 * and full script execution support.
 *
 * **How it works:**
 *
 * 1. Attaches a shadow root to the host element on mount
 * 2. Parses HTML using DOMParser to preserve structure
 * 3. Extracts @font-face rules and injects into main document
 * 4. Extracts scripts and replaces with placeholders
 * 5. Imports and appends entire HTML structure to shadow root
 * 6. Executes scripts in proper order (sequential, async, defer)
 *
 * **Usage Example:**
 *
 * ```ts
 * const { hostRef, shadowRoot } = useHtmlRenderer({
 *   html: '<html><head><style>body { color: red; }</style></head><body><script>console.log("Hello")</script></body></html>'
 * });
 * ```
 *
 * @param options - Configuration options
 * @param options.html - The HTML string to render
 *
 * @returns Object containing:
 * - hostRef: Template ref to bind to a container element
 * - clear: Function to remove all rendered content
 * - shadowRoot: Ref to shadow root
 *
 * @example
 * ```vue
 * <template>
 *   <div :ref="hostRef"></div>
 * </template>
 *
 * <script setup lang="ts">
 * import { useHtmlRenderer } from './composables/useHtmlRenderer';
 *
 * const { hostRef, shadowRoot } = useHtmlRenderer({
 *   html: '<div>Content</div>'
 * });
 * </script>
 * ```
 */
export function useHtmlRenderer(options: IHtmlRendererOptions): IHtmlRendererComposable {
  const { html } = options

  const hostRef = ref<HTMLElement>()
  const shadowRoot = ref<ShadowRoot>()

  /**
   * Clear all rendered content from the shadow root.
   */
  function clear(): void {
    if (shadowRoot.value) {
      clearShadowRoot(shadowRoot.value)
    }
  }

  /**
   * Render HTML content into the shadow root.
   *
   * This renders the HTML with style isolation and full script execution support.
   */
  async function render(): Promise<void> {
    if (!shadowRoot.value) {
      console.error('Shadow root not available for rendering')
      return
    }
    await renderIntoShadowRoot(shadowRoot.value, html)
  }

  /**
   * Lifecycle: Mount
   *
   * Sets up the rendering environment and performs initial render.
   * - Attaches shadow root in open mode
   * - Renders HTML into shadow root with script execution
   */
  onMounted(() => {
    if (!hostRef.value) {
      return
    }

    // Attach shadow root
    try {
      shadowRoot.value = hostRef.value.attachShadow({ mode: 'open' })
    } catch (e) {
      console.error('Failed to attach shadow root:', e)
      return
    }

    // Perform initial render
    void render()
  })

  /**
   * Lifecycle: Before Unmount
   *
   * Cleans up rendered content before the component unmounts.
   * - Clears shadow root content
   */
  onBeforeUnmount(() => {
    // Clear content safely
    try {
      clear()
    } catch (e) {
      if (typeof console !== 'undefined' && typeof console.debug === 'function') {
        console.debug('useHtmlRenderer: clear() failed during unmount', e)
      }
    }
  })

  return { hostRef, clear, shadowRoot }
}
