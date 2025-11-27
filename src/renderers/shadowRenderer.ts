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
  // Helpers
  const stripComments = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '')

  const extractFontFaceBlocks = (css: string): string[] => {
    const blocks: string[] = []
    let pos = 0
    while (pos < css.length) {
      const start = css.indexOf('@font-face', pos)
      if (start === -1) {
        break
      }
      const braceStart = css.indexOf('{', start)
      if (braceStart === -1) {
        break
      }
      let depth = 1
      let i = braceStart + 1
      while (i < css.length && depth > 0) {
        const ch = css[i]
        if (ch === '{') {
          depth++
        } else if (ch === '}') {
          depth--
        }
        i++
      }
      if (depth === 0) {
        const rule = css.substring(start, i).trim()
        blocks.push(rule)
      }
      pos = i
    }
    return blocks
  }

  const importRegex = /@import\s+(?:url\(\s*(["']?)([^)"']+)\1\s*\)|(["'])([^"']+)\3)[^;]*;/gi

  const resolveUrl = (url: string, base: string): string => {
    try {
      return new URL(url, base).toString()
    } catch {
      return url
    }
  }

  const getDocBaseUrl = (d: Document): string => {
    const baseHref = d.querySelector('base[href]')?.getAttribute('href')?.trim()
    try {
      if (baseHref) {
        return new URL(baseHref, document.baseURI).toString()
      }
    } catch {
      // ignore
    }
    return document.baseURI || (typeof location !== 'undefined' ? location.href : '')
  }

  const visited = new Set<string>()
  const fontSet = new Set<string>()

  const rebaseUrls = (cssBlock: string, baseUrl: string): string => {
    const urlRe = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)"']+))\s*\)/gi
    return cssBlock.replace(urlRe, (_m, d1: string, d2: string, d3: string) => {
      const orig = (d1 ?? d2 ?? d3 ?? '').trim()
      const quote = d1 != null ? '"' : d2 != null ? "'" : ''
      // Skip special/absolute URLs
      if (/^(data:|blob:|http:|https:|\/\/|#)/i.test(orig)) {
        return `url(${quote}${orig}${quote})`
      }
      let abs = orig
      try {
        abs = new URL(orig, baseUrl).toString()
      } catch {
        // keep original if resolution fails
      }
      return `url(${quote}${abs}${quote})`
    })
  }

  const processCss = async (cssRaw: string, baseUrl: string): Promise<void> => {
    const css = stripComments(cssRaw)

    // 1) Collect inline @font-face blocks
    extractFontFaceBlocks(css).forEach((b) => fontSet.add(rebaseUrls(b, baseUrl)))

    // 2) Resolve @import chains recursively
    let match: RegExpExecArray | null
    importRegex.lastIndex = 0
    while ((match = importRegex.exec(css))) {
      const url = (match[2] || match[4] || '').trim()
      if (!url) {
        continue
      }
      const absUrl = resolveUrl(url, baseUrl)
      if (visited.has(absUrl)) {
        continue
      }
      visited.add(absUrl)
      try {
        const res = await fetch(absUrl)
        if (!res.ok) {
          continue
        }
        const text = await res.text()
        // The base for nested imports becomes the CSS file URL we just fetched
        await processCss(text, absUrl)
      } catch {
        // Silently ignore fetch errors to avoid breaking rendering
      }
    }
  }

  const styleElements = doc.querySelectorAll('style')
  const docBase = getDocBaseUrl(doc)
  for (const styleEl of Array.from(styleElements)) {
    const cssText = styleEl.textContent || ''
    await processCss(cssText, docBase)
  }

  // Inject into main document head, avoid duplicates
  if (fontSet.size > 0) {
    let fontStyleElement = document.getElementById(styleElementId) as HTMLStyleElement | null
    if (!fontStyleElement) {
      fontStyleElement = document.createElement('style')
      fontStyleElement.id = styleElementId
      document.head.appendChild(fontStyleElement)
    }
    const existing = fontStyleElement.textContent || ''
    let appended = ''
    for (const rule of fontSet) {
      if (!existing.includes(rule)) {
        appended += (appended ? '\n' : '') + rule
      }
    }
    if (appended) {
      fontStyleElement.textContent += (fontStyleElement.textContent ? '\n' : '') + appended
    }
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
