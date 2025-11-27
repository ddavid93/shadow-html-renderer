/**
 * CSS utility helpers used by the font-face extractor.
 *
 * The functions here are framework-agnostic and deal only with CSS text and URL handling.
 */

/** Strip block comments from a CSS string. */
export function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

/**
 * Extract all @font-face rule blocks from a CSS string using brace counting.
 */
export function extractFontFaceBlocks(css: string): string[] {
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

/** Create a new global RegExp that matches @import statements in CSS. */
export function createImportRegex(): RegExp {
  return /@import\s+(?:url\(\s*(["']?)([^)"']+)\1\s*\)|(["'])([^"']+)\3)[^;]*;/gi
}

/** Resolve a possibly-relative URL string against a base URL. */
export function resolveUrl(url: string, base: string): string {
  try {
    return new URL(url, base).toString()
  } catch {
    return url
  }
}

/**
 * Rebase relative url(...) entries inside a CSS block to absolute URLs, given a base URL.
 */
export function rebaseUrls(cssBlock: string, baseUrl: string): string {
  const urlRe = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)"']+))\s*\)/gi
  return cssBlock.replace(urlRe, (_m, d1: string, d2: string, d3: string) => {
    const orig = (d1 ?? d2 ?? d3 ?? '').trim()
    const quote = d1 != null ? '"' : d2 != null ? "'" : ''
    if (/^(data:|blob:|http:|https:|\/\/|#)/i.test(orig)) {
      return `url(${quote}${orig}${quote})`
    }
    let abs = orig
    try {
      abs = new URL(orig, baseUrl).toString()
    } catch {
      // keep original on failure
    }
    return `url(${quote}${abs}${quote})`
  })
}

/** Determine the base URL for a Document, accounting for <base href>. */
export function getDocBaseUrl(d: Document): string {
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
