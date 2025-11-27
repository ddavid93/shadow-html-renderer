<template>
  <!--
    Host element for the renderer.
    The composable will attach a shadow root to this element.
  -->
  <div ref="hostRef"></div>
</template>

<!--
  HtmlRenderer Component

  A Vue 3 component for rendering arbitrary HTML content using Shadow DOM
  with style isolation and full script execution support.

  Features:
  - Renders HTML in isolated Shadow DOM
  - Complete style isolation
  - Preserves full HTML structure (html, head, body tags)
  - Extracts and injects @font-face rules for proper font loading
  - Full script execution support (async, defer, sequential, module)
  - No reactive updates (renders once on mount)
  - Clean unmount with proper cleanup

  Usage Example:
  ```vue
  <HtmlRenderer :html="myHtmlString" />
  ```

  Props:
  - html (String, required): The HTML string to render
-->
<script lang="ts" setup>
import { useHtmlRenderer } from './composables/useHtmlRenderer'
import type { IHtmlRendererProps } from './extras/types'

/**
 * Component props definition
 */
const props = defineProps<IHtmlRendererProps>()

/**
 * Use the composable with the provided props
 */
const { hostRef } = useHtmlRenderer({
  html: props.html,
})

/**
 * Expose the hostRef so parent components can access the root element.
 * This allows parent components to use ResizeObserver or access the DOM element.
 *
 * In Vue 3 with script setup, we need to explicitly expose internal refs.
 * We expose the hostRef itself so parent components can access it as a computed getter.
 *
 * Usage in parent:
 * - rendererRef.value.hostRef will return the Ref
 * - Or we can expose $el as a getter that returns hostRef.value
 */
defineExpose({
  get $el() {
    return hostRef.value
  },
})
</script>
