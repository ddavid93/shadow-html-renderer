/**
 * Shadow HTML Renderer Library - Main Entry Point
 *
 * A framework-agnostic library for rendering HTML content into Shadow DOM
 * with style isolation and full script execution support.
 *
 * This library can be used with any JavaScript framework (React, Vue, Angular, Svelte, etc.)
 * or vanilla JavaScript.
 *
 * @example
 * ```typescript
 * // Import the renderer function
 * import { renderIntoShadowRoot } from 'shadow-html-renderer';
 *
 * // Create a host element and attach shadow root
 * const host = document.createElement('div');
 * document.body.appendChild(host);
 * const shadowRoot = host.attachShadow({ mode: 'open' });
 *
 * // Render HTML into the shadow root
 * await renderIntoShadowRoot(shadowRoot, '<div>Hello World</div>');
 * ```
 *
 * @module ShadowHTMLRenderer
 */

// ============================================================================
// RENDERER EXPORTS
// ============================================================================

/**
 * Shadow DOM renderer functions for rendering HTML with style isolation
 * and full script execution support.
 */
export {
  renderIntoShadowRoot,
  clearShadowRoot,
  extractAndInjectFontFaces,
} from './renderers/shadowRenderer'

/**
 * Direct DOM renderer functions for rendering HTML with script execution
 * but without style isolation.
 */
export {
  renderDirectly,
  clearElement,
  extractScriptsWithPlaceholders,
  createExecutableScript,
  insertScriptAtPlaceholder,
} from './renderers/directRenderer'

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

/**
 * Utility functions for HTML and attribute normalization.
 */
export {
  uid,
  normalizeHtml,
  normalizeAttr,
  findPlaceholderNode,
} from './extras/utils'

/**
 * CSS utility functions for font-face handling.
 */
export {
  stripComments,
  extractFontFaceBlocks,
  createImportRegex,
  resolveUrl,
  rebaseUrls,
  getDocBaseUrl,
} from './styles/cssUtils'

/**
 * Font-face collection and injection utilities.
 */
export { collectFontFaceRulesFromDocument } from './styles/fontFaceCollector'
export { injectFontFaces } from './styles/fontInjector'

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * TypeScript type definitions.
 *
 * Import these for type-safe usage:
 * ```typescript
 * import type { IScriptMeta, IHtmlRendererOptions } from 'shadow-html-renderer';
 * ```
 */
export type {
  IScriptMeta,
  IHtmlRendererOptions,
  IFontFaceExtractionOptions,
} from './extras/types'
