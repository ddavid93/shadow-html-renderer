/**
 * Inject collected @font-face rules into the main document head.
 *
 * - Creates (or reuses) a <style id="shadow-dom-fonts"> element
 * - Deduplicates against existing content to avoid repeated rules
 */
export function injectFontFaces(rules: Iterable<string>, styleElementId = 'shadow-dom-fonts'): void {
  // Assemble rules to append, checking against existing content
  let styleEl = document.getElementById(styleElementId) as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = styleElementId
    document.head.appendChild(styleEl)
  }

  const existing = styleEl.textContent || ''
  let appended = ''
  for (const rule of rules) {
    if (!existing.includes(rule)) {
      appended += (appended ? '\n' : '') + rule
    }
  }
  if (appended) {
    styleEl.textContent += (styleEl.textContent ? '\n' : '') + appended
  }
}
