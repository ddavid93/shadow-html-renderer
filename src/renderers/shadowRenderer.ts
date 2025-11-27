/**
 * Shadow DOM Renderer Implementation
 *
 * This module contains the core logic for rendering HTML content into a Shadow DOM
 * with style isolation and font-face handling.
 *
 * Key Features:
 * - Style isolation using Shadow DOM
 * - Preserves complete HTML structure (html, head, body tags)
 * - Extracts @font-face rules and injects into main document
 * - No script execution (by design)
 *
 * @module shadowRenderer
 */

import { normalizeHtml } from '../extras/utils'
import { collectFontFaceRulesFromDocument } from '../styles/fontFaceCollector'
import { injectFontFaces } from '../styles/fontInjector'

/**
 * Extract @font-face rules from style elements and inject into main document.
 *
 * Shadow DOM has limitations with @font-face: fonts declared inside shadow trees
 * may not download properly. This function extracts @font-face rules and injects
 * them into the main document's <head> so fonts load at document level.
 *
 * The extraction uses brace-counting to properly handle nested braces and
 * multi-line declarations within @font-face blocks.
 *
 * @param doc - The parsed document containing style elements
 * @param styleElementId - ID for the injected style element (default: "shadow-dom-fonts")
 *
 * @example
 * ```ts
 * const parser = new DOMParser();
 * const doc = parser.parseFromString(html, "text/html");
 * await extractAndInjectFontFaces(doc);
 * ```
 */
export async function extractAndInjectFontFaces(
  doc: Document,
  styleElementId: string = 'shadow-dom-fonts',
): Promise<void> {
  const rules = await collectFontFaceRulesFromDocument(doc)
  if (rules.size > 0) {
    injectFontFaces(rules, styleElementId)
  }
}

/**
 * Render HTML content into a Shadow Root with style isolation.
 *
 * This function:
 * 1. Parses the HTML using DOMParser to preserve all structural tags
 * 2. Extracts @font-face rules and injects them into the main document
 * 3. Imports and appends the entire HTML structure to the shadow root
 *
 * The rendered content is completely isolated from the parent document's styles,
 * but can still access fonts declared at the document level.
 *
 * @param shadowRoot - The shadow root to render into
 * @param html - The HTML string to render
 *
 * @example
 * ```ts
 * const host = document.createElement('div');
 * const shadowRoot = host.attachShadow({ mode: 'open' });
 * await renderIntoShadowRoot(shadowRoot, '<html><body>Content</body></html>');
 * ```
 */
export async function renderIntoShadowRoot(shadowRoot: ShadowRoot, html: string): Promise<void> {
  // Clear existing content
  while (shadowRoot.firstChild) {
    shadowRoot.removeChild(shadowRoot.firstChild)
  }

  // Parse HTML using DOMParser to preserve structural tags like <html>, <body>, <head>
  const parser = new DOMParser()
  const doc = parser.parseFromString(normalizeHtml(html), 'text/html')

  // Extract and inject @font-face rules into main document
  // This ensures fonts are loaded at document level and available to shadow DOM
  await extractAndInjectFontFaces(doc)

  // Import the entire documentElement (html tag and all its contents)
  // This preserves the complete HTML structure including html, head, and body tags
  const importedNode = document.importNode(doc.documentElement, true)

  // Append directly to shadow root without wrapper or scaler
  shadowRoot.appendChild(importedNode)
}

/**
 * Clear all children from a shadow root.
 *
 * This is a utility function for cleanup operations. It uses a while loop
 * with removeChild for deterministic cleanup without touching the shadow
 * root element itself.
 *
 * @param shadowRoot - The shadow root to clear
 *
 * @example
 * ```ts
 * clearShadowRoot(shadowRoot);
 * ```
 */
export function clearShadowRoot(shadowRoot: ShadowRoot): void {
  while (shadowRoot.firstChild) {
    shadowRoot.removeChild(shadowRoot.firstChild)
  }
}
