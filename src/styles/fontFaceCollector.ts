import {
  createImportRegex,
  extractFontFaceBlocks,
  getDocBaseUrl,
  rebaseUrls,
  resolveUrl,
  stripComments,
} from './cssUtils'

/**
 * Collect @font-face rules from a parsed HTML Document.
 *
 * - Scans <style> blocks
 * - Follows @import chains recursively
 * - Fetches and processes external stylesheets from <link rel="stylesheet" href> and
 *   <link rel="preload" as="style" href>
 * - Rebases relative url() paths against the stylesheet URL
 * - Deduplicates via Set and guards against cycles via visited URLs
 */
export async function collectFontFaceRulesFromDocument(doc: Document): Promise<Set<string>> {
  const fontSet = new Set<string>()
  const visited = new Set<string>()
  const importRegex = createImportRegex()

  async function processCss(cssRaw: string, baseUrl: string): Promise<void> {
    const css = stripComments(cssRaw)

    // 1) Collect inline @font-face blocks
    for (const block of extractFontFaceBlocks(css)) {
      fontSet.add(rebaseUrls(block, baseUrl))
    }

    // 2) Resolve @import recursively
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
        await processCss(text, absUrl)
      } catch {
        // ignore fetch errors
      }
    }
  }

  const docBase = getDocBaseUrl(doc)

  // Inline <style>
  const styleElements = doc.querySelectorAll('style')
  for (const styleEl of Array.from(styleElements)) {
    const cssText = styleEl.textContent || ''
    await processCss(cssText, docBase)
  }

  // External stylesheets via <link>
  try {
    const linkNodes = doc.querySelectorAll(
      'link[rel~="stylesheet"][href], link[rel="preload"][as="style"][href]',
    )
    for (const linkEl of Array.from(linkNodes)) {
      const rel = (linkEl.getAttribute('rel') || '').toLowerCase()
      if (rel.includes('alternate') || linkEl.hasAttribute('disabled')) {
        continue
      }
      const media = linkEl.getAttribute('media')?.trim()
      if (media) {
        try {
          if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
            const mql = window.matchMedia(media)
            if (!mql.matches) {
              continue
            }
          }
        } catch {
          // ignore invalid media values
        }
      }

      const href = linkEl.getAttribute('href')?.trim() || ''
      if (!href) {
        continue
      }
      const absHref = resolveUrl(href, docBase)
      if (visited.has(absHref)) {
        continue
      }
      visited.add(absHref)
      try {
        const res = await fetch(absHref)
        if (!res.ok) {
          continue
        }
        const text = await res.text()
        await processCss(text, absHref)
      } catch {
        // ignore fetch errors
      }
    }
  } catch {
    // ignore selector errors
  }

  return fontSet
}
