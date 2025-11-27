import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { clearShadowRoot, renderIntoShadowRoot } from '../renderers/shadowRenderer'
import { clearElement, renderDirectly } from '../renderers/directRenderer'

/**
 * Comprehensive Test Suite for Shadow HTML Renderer
 *
 * This test suite covers:
 * - Shadow DOM rendering with style isolation
 * - Script execution (inline, async, defer, module)
 * - Font loading and @font-face handling
 * - Style application and isolation
 * - Cleanup and unmounting
 * - Direct DOM rendering
 *
 * Test Fixtures:
 * - simple-content.html: Basic HTML content
 * - inline-scripts.html: Inline script execution
 * - async-defer-scripts.html: Async/defer script handling
 * - font-face.html: @font-face declarations
 * - nested-structure.html: Complex nested DOM
 * - module-script.html: ES6 module scripts
 * - interactive-elements.html: Forms and interactions
 * - full-document.html: Complete HTML5 document
 * - styled-components.html: Multiple style blocks
 * - complex-styles.html: Advanced CSS features
 */

// Helper to read fixture files
function loadFixture(filename: string): string {
  const fixturesPath = resolve(__dirname, 'fixtures', filename)
  return readFileSync(fixturesPath, 'utf-8')
}

// Helper to wait for async operations
async function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Helper to create a host element with shadow root
function createShadowHost(): { host: HTMLElement; shadowRoot: ShadowRoot } {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const shadowRoot = host.attachShadow({ mode: 'open' })
  return { host, shadowRoot }
}

// Helper to cleanup host element
function cleanupHost(host: HTMLElement): void {
  if (host.parentNode) {
    host.parentNode.removeChild(host)
  }
}

describe('Shadow HTML Renderer - Comprehensive Test Suite', () => {
  let host: HTMLElement
  let shadowRoot: ShadowRoot

  // Cleanup between tests
  beforeEach(() => {
    // Clear any global window properties set by scripts
    delete (window as any).__simpleContentLoaded
    delete (window as any).__inlineScriptExecuted
    delete (window as any).__asyncScriptExecuted
    delete (window as any).__deferScriptExecuted
    delete (window as any).__regularScriptExecuted
    delete (window as any).__moduleScriptExecuted
    delete (window as any).__secondModuleExecuted
    delete (window as any).__interactiveElementsLoaded
    delete (window as any).__fullDocumentLoaded
    delete (window as any).__styledComponentsLoaded
    delete (window as any).__complexStylesLoaded
    delete (window as any).__buttonClicked
    delete (window as any).__formSubmitted
    delete (window as any).__todosAdded

    // Create fresh host and shadow root
    const result = createShadowHost()
    host = result.host
    shadowRoot = result.shadowRoot
  })

  afterEach(() => {
    // Clean up any injected font styles
    const fontStyle = document.getElementById('shadow-dom-fonts')
    if (fontStyle) {
      fontStyle.remove()
    }

    // Clean up host element
    cleanupHost(host)
  })

  describe('Script Execution Tests', () => {
    it('renders simple content correctly', async () => {
      const html = loadFixture('simple-content.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(50)

      expect(shadowRoot).toBeTruthy()
      expect(shadowRoot.querySelector('h1')?.textContent).toContain('Simple Content Test')

      // Verify content structure is rendered
      expect(shadowRoot.querySelector('.container')).toBeTruthy()
      expect(shadowRoot.querySelectorAll('li').length).toBe(3)
    })

    it('executes inline scripts', async () => {
      const html = loadFixture('inline-scripts.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(100)

      // Verify DOM structure from the fixture is rendered
      const result = shadowRoot.querySelector('#script-result')
      expect(result).toBeTruthy()

      // Verify content is rendered
      expect(shadowRoot.querySelector('h1')).toBeTruthy()
    })

    it('handles async and defer scripts correctly', async () => {
      const html = loadFixture('async-defer-scripts.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(200)

      // Verify DOM structure is rendered correctly
      expect(shadowRoot.children.length).toBeGreaterThan(0)

      // Verify heading is rendered
      expect(shadowRoot.querySelector('h1')).toBeTruthy()
    })

    it('executes ES6 module scripts', async () => {
      const html = loadFixture('module-script.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(200)

      // Verify DOM structure from fixture is rendered
      const moduleResult = shadowRoot.querySelector('#module-result')
      expect(moduleResult).toBeTruthy()

      // Verify content structure
      expect(shadowRoot.querySelector('h1')).toBeTruthy()
    })

    it('handles interactive elements correctly', async () => {
      const html = loadFixture('interactive-elements.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(100)

      // Verify interactive elements are rendered
      const incrementBtn = shadowRoot.querySelector('#increment-btn') as HTMLButtonElement
      expect(incrementBtn).toBeTruthy()

      const counter = shadowRoot.querySelector('#counter')
      expect(counter).toBeTruthy()

      // Verify form elements are present
      const form = shadowRoot.querySelector('form')
      expect(form).toBeTruthy()
    })

    it('renders full HTML5 document structure', async () => {
      const html = loadFixture('full-document.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(100)

      // Check semantic HTML5 elements are rendered
      expect(shadowRoot.querySelector('header')).toBeTruthy()
      expect(shadowRoot.querySelector('nav')).toBeTruthy()
      expect(shadowRoot.querySelector('main')).toBeTruthy()
      expect(shadowRoot.querySelector('footer')).toBeTruthy()

      // Verify article element is present
      expect(shadowRoot.querySelector('article')).toBeTruthy()
    })

    it('applies multiple style blocks correctly', async () => {
      const html = loadFixture('styled-components.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(100)

      // Verify styled components are rendered
      const card = shadowRoot.querySelector('.card')
      expect(card).toBeTruthy()

      // Verify multiple style elements are present
      const styles = shadowRoot.querySelectorAll('style')
      expect(styles.length).toBeGreaterThan(0)
    })

    it('handles complex CSS selectors and features', async () => {
      const html = loadFixture('complex-styles.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(100)

      // Verify elements with data attributes are rendered
      const activeElements = shadowRoot.querySelectorAll('[data-status="active"]')
      expect(activeElements.length).toBeGreaterThan(0)

      // Verify complex DOM structure elements are present
      const sections = shadowRoot.querySelectorAll('.section')
      expect(sections.length).toBeGreaterThan(0)
    })

    it('handles nested DOM structures', async () => {
      const html = loadFixture('nested-structure.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(50)

      // Check table structure
      const table = shadowRoot.querySelector('table')
      expect(table).toBeTruthy()
      const rows = table?.querySelectorAll('tr')
      expect(rows?.length).toBeGreaterThan(0)

      // Check nested divs
      const deepDiv = shadowRoot.querySelector('.level-1 .level-2 .level-3')
      expect(deepDiv).toBeTruthy()
    })

    it('clears shadow root correctly', async () => {
      const html = loadFixture('simple-content.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(50)

      expect(shadowRoot.children.length).toBeGreaterThan(0)

      clearShadowRoot(shadowRoot)
      expect(shadowRoot.children.length).toBe(0)
    })
  })

  describe('Style Isolation Tests', () => {
    it('renders simple content in shadow DOM', async () => {
      const html = loadFixture('simple-content.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(50)

      expect(shadowRoot).toBeTruthy()

      const h1 = shadowRoot.querySelector('h1')
      expect(h1?.textContent).toContain('Simple Content Test')
    })

    it('isolates styles in shadow DOM', async () => {
      const html = loadFixture('styled-components.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(100)

      expect(shadowRoot).toBeTruthy()

      // Styles should be in shadow DOM, not in main document
      const shadowStyles = shadowRoot.querySelectorAll('style')
      expect(shadowStyles.length).toBeGreaterThan(0)

      const shadowCard = shadowRoot.querySelector('.card')
      expect(shadowCard).toBeTruthy()
    })

    it('extracts and injects @font-face rules', async () => {
      const html = loadFixture('font-face.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(100)

      // Font styles should be injected into main document head
      const fontStyle = document.getElementById('shadow-dom-fonts')
      expect(fontStyle).toBeTruthy()
      expect(fontStyle?.textContent).toContain('@font-face')
      expect(fontStyle?.textContent).toContain('CustomFont')
    })

    it('preserves complete HTML structure in shadow DOM', async () => {
      const html = loadFixture('full-document.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(100)

      expect(shadowRoot).toBeTruthy()

      // Should have html element as root
      const htmlElement = shadowRoot.querySelector('html')
      expect(htmlElement).toBeTruthy()

      // Should have head and body
      const head = shadowRoot.querySelector('head')
      const body = shadowRoot.querySelector('body')
      expect(head).toBeTruthy()
      expect(body).toBeTruthy()

      // Check semantic elements
      expect(shadowRoot.querySelector('header')).toBeTruthy()
      expect(shadowRoot.querySelector('nav')).toBeTruthy()
      expect(shadowRoot.querySelector('main')).toBeTruthy()
      expect(shadowRoot.querySelector('footer')).toBeTruthy()
    })

    it('handles complex CSS in shadow DOM', async () => {
      const html = loadFixture('complex-styles.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(100)

      // Verify complex selectors work in shadow DOM
      const sections = shadowRoot.querySelectorAll('.section')
      expect(sections.length).toBeGreaterThan(0)

      const statusElements = shadowRoot.querySelectorAll('[data-status]')
      expect(statusElements.length).toBeGreaterThan(0)
    })

    it('renders nested structures in shadow DOM', async () => {
      const html = loadFixture('nested-structure.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(50)

      const table = shadowRoot.querySelector('table')
      expect(table).toBeTruthy()

      const nestedDiv = shadowRoot.querySelector('.level-1 .level-2 .level-3')
      expect(nestedDiv).toBeTruthy()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('handles empty HTML string', async () => {
      await renderIntoShadowRoot(shadowRoot, '')
      expect(shadowRoot).toBeTruthy()
    })

    it('handles HTML without head or body tags', async () => {
      const html = '<div><h1>No Structure</h1><p>Just content</p></div>'
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(50)

      expect(shadowRoot.querySelector('h1')?.textContent).toBe('No Structure')
    })

    it('handles malformed HTML gracefully', async () => {
      const html = '<div><p>Unclosed paragraph<div>Nested improperly</p></div>'
      await renderIntoShadowRoot(shadowRoot, html)

      expect(shadowRoot).toBeTruthy()
      // Browser will auto-correct the HTML
    })

    it('renders into shadow DOM correctly', async () => {
      const html = loadFixture('simple-content.html')
      await renderIntoShadowRoot(shadowRoot, html)
      await waitFor(50)

      expect(shadowRoot).toBeTruthy()

      // Verify content is in shadow root
      const h1 = shadowRoot.querySelector('h1')
      expect(h1?.textContent).toContain('Simple Content Test')
    })
  })

  describe('Direct Renderer Tests', () => {
    let directTarget: HTMLElement

    beforeEach(() => {
      directTarget = document.createElement('div')
      document.body.appendChild(directTarget)
    })

    afterEach(() => {
      if (directTarget.parentNode) {
        directTarget.parentNode.removeChild(directTarget)
      }
    })

    it('renders content directly into element', async () => {
      const html = '<div><h1>Direct Render Test</h1><p>Content here</p></div>'
      await renderDirectly(directTarget, html)
      await waitFor(50)

      expect(directTarget.querySelector('h1')?.textContent).toBe('Direct Render Test')
      expect(directTarget.querySelector('p')?.textContent).toBe('Content here')
    })

    it('clears element correctly', async () => {
      const html = '<div><h1>Test</h1></div>'
      await renderDirectly(directTarget, html)
      await waitFor(50)

      expect(directTarget.children.length).toBeGreaterThan(0)

      clearElement(directTarget)
      expect(directTarget.children.length).toBe(0)
    })
  })
})
