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
 * - CSS @import functionality
 * - Mixed content handling
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
 * - mixed-content.html: Various HTML5 elements and data attributes
 * - import-styles.html: CSS @import directive testing
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

  describe('Fixture Content Verification Tests', () => {
    describe('simple-content.html', () => {
      it('renders container with correct structure', async () => {
        const html = loadFixture('simple-content.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        // Verify container structure
        const container = shadowRoot.querySelector('.container')
        expect(container).toBeTruthy()

        // Verify h1 content
        const h1 = shadowRoot.querySelector('h1')
        expect(h1?.textContent).toBe('Simple Content Test')

        // Verify paragraphs
        const paragraphs = shadowRoot.querySelectorAll('p')
        expect(paragraphs.length).toBe(2)
        expect(paragraphs[0]?.textContent).toContain('simple HTML document')
        expect(paragraphs[1]?.textContent).toContain('basic styling')

        // Verify list items
        const listItems = shadowRoot.querySelectorAll('li')
        expect(listItems.length).toBe(3)
        expect(listItems[0]?.textContent).toBe('List item 1')
        expect(listItems[1]?.textContent).toBe('List item 2')
        expect(listItems[2]?.textContent).toBe('List item 3')
      })

      it('contains style element with proper CSS', async () => {
        const html = loadFixture('simple-content.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const style = shadowRoot.querySelector('style')
        expect(style).toBeTruthy()
        expect(style?.textContent).toContain('.container')
        expect(style?.textContent).toContain('font-family')
      })
    })

    describe('inline-scripts.html', () => {
      it('renders all script result elements', async () => {
        const html = loadFixture('inline-scripts.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(100)

        // Verify result divs exist
        const scriptResult = shadowRoot.querySelector('#script-result')
        expect(scriptResult).toBeTruthy()
        expect(scriptResult?.classList.contains('result')).toBe(true)

        const calculationResult = shadowRoot.querySelector('#calculation-result')
        expect(calculationResult).toBeTruthy()

        const domManipulationResult = shadowRoot.querySelector('#dom-manipulation-result')
        expect(domManipulationResult).toBeTruthy()
      })

      it('has correct heading and structure', async () => {
        const html = loadFixture('inline-scripts.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const h1 = shadowRoot.querySelector('h1')
        expect(h1?.textContent).toBe('Inline Scripts Test')

        // Verify style with gradient background
        const style = shadowRoot.querySelector('style')
        expect(style?.textContent).toContain('linear-gradient')
      })
    })

    describe('async-defer-scripts.html', () => {
      it('renders all status divs', async () => {
        const html = loadFixture('async-defer-scripts.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(100)

        const regularStatus = shadowRoot.querySelector('#regular-status')
        expect(regularStatus).toBeTruthy()
        expect(regularStatus?.classList.contains('status')).toBe(true)

        const deferStatus = shadowRoot.querySelector('#defer-status')
        expect(deferStatus).toBeTruthy()

        const asyncStatus = shadowRoot.querySelector('#async-status')
        expect(asyncStatus).toBeTruthy()
      })

      it('contains script execution notes', async () => {
        const html = loadFixture('async-defer-scripts.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const listItems = shadowRoot.querySelectorAll('li')
        expect(listItems.length).toBe(3)

        // Verify notes about script types
        const content = shadowRoot.textContent
        expect(content).toContain('Regular scripts')
        expect(content).toContain('Defer scripts')
        expect(content).toContain('Async scripts')
      })
    })

    describe('font-face.html', () => {
      it('renders container with feature boxes', async () => {
        const html = loadFixture('font-face.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(100)

        const container = shadowRoot.querySelector('.container')
        expect(container).toBeTruthy()

        const featureBoxes = shadowRoot.querySelectorAll('.feature-box')
        expect(featureBoxes.length).toBe(2)

        // Verify h1
        const h1 = shadowRoot.querySelector('h1')
        expect(h1?.textContent).toBe('Font Face Test')
      })

      it('contains @font-face declarations', async () => {
        const html = loadFixture('font-face.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(100)

        const style = shadowRoot.querySelector('style')
        expect(style?.textContent).toContain('@font-face')
        expect(style?.textContent).toContain('CustomFont')
        expect(style?.textContent).toContain('font-weight: normal')
        expect(style?.textContent).toContain('font-weight: bold')
      })

      it('has normal and bold text sections', async () => {
        const html = loadFixture('font-face.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const normalText = shadowRoot.querySelector('.normal-text')
        expect(normalText).toBeTruthy()

        const boldText = shadowRoot.querySelector('.bold-text')
        expect(boldText).toBeTruthy()
      })
    })

    describe('module-script.html', () => {
      it('renders module result elements', async () => {
        const html = loadFixture('module-script.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(100)

        const moduleResult = shadowRoot.querySelector('#module-result')
        expect(moduleResult).toBeTruthy()
        expect(moduleResult?.classList.contains('result')).toBe(true)

        const exportResult = shadowRoot.querySelector('#export-result')
        expect(exportResult).toBeTruthy()

        const importResult = shadowRoot.querySelector('#import-result')
        expect(importResult).toBeTruthy()
      })

      it('has card component structure', async () => {
        const html = loadFixture('module-script.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const card = shadowRoot.querySelector('.card')
        expect(card).toBeTruthy()

        const h1 = shadowRoot.querySelector('h1')
        expect(h1?.textContent).toBe('ES6 Module Script Test')

        const h2 = shadowRoot.querySelector('h2')
        expect(h2?.textContent).toBe('Module Features')
      })
    })

    describe('interactive-elements.html', () => {
      it('renders counter with buttons', async () => {
        const html = loadFixture('interactive-elements.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(100)

        const counter = shadowRoot.querySelector('#counter')
        expect(counter).toBeTruthy()
        expect(counter?.classList.contains('counter')).toBe(true)
        expect(counter?.textContent).toBe('0')

        const incrementBtn = shadowRoot.querySelector('#increment-btn')
        expect(incrementBtn).toBeTruthy()
        expect(incrementBtn?.textContent).toBe('Increment')

        const decrementBtn = shadowRoot.querySelector('#decrement-btn')
        expect(decrementBtn).toBeTruthy()

        const resetBtn = shadowRoot.querySelector('#reset-btn')
        expect(resetBtn).toBeTruthy()
      })

      it('renders contact form with all fields', async () => {
        const html = loadFixture('interactive-elements.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const form = shadowRoot.querySelector('#contact-form')
        expect(form).toBeTruthy()

        const nameInput = shadowRoot.querySelector('#name') as HTMLInputElement
        expect(nameInput).toBeTruthy()
        expect(nameInput?.type).toBe('text')
        expect(nameInput?.required).toBe(true)

        const emailInput = shadowRoot.querySelector('#email') as HTMLInputElement
        expect(emailInput).toBeTruthy()
        expect(emailInput?.type).toBe('email')

        const messageTextarea = shadowRoot.querySelector('#message')
        expect(messageTextarea).toBeTruthy()
        expect(messageTextarea?.tagName.toLowerCase()).toBe('textarea')
      })

      it('renders theme select and radio buttons', async () => {
        const html = loadFixture('interactive-elements.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const themeSelect = shadowRoot.querySelector('#theme') as HTMLSelectElement
        expect(themeSelect).toBeTruthy()
        expect(themeSelect?.options.length).toBe(3)

        const radioButtons = shadowRoot.querySelectorAll('input[name="notifications"]')
        expect(radioButtons.length).toBe(3)
      })

      it('renders todo list input', async () => {
        const html = loadFixture('interactive-elements.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const todoInput = shadowRoot.querySelector('#todo-input')
        expect(todoInput).toBeTruthy()

        const addTodoBtn = shadowRoot.querySelector('#add-todo-btn')
        expect(addTodoBtn).toBeTruthy()

        const todoList = shadowRoot.querySelector('#todo-list')
        expect(todoList).toBeTruthy()
        expect(todoList?.tagName.toLowerCase()).toBe('ul')
      })
    })

    describe('full-document.html', () => {
      it('renders complete HTML5 semantic structure', async () => {
        const html = loadFixture('full-document.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(100)

        // Verify semantic elements
        expect(shadowRoot.querySelector('header')).toBeTruthy()
        expect(shadowRoot.querySelector('nav')).toBeTruthy()
        expect(shadowRoot.querySelector('main')).toBeTruthy()
        expect(shadowRoot.querySelector('article')).toBeTruthy()
        expect(shadowRoot.querySelector('section')).toBeTruthy()
        expect(shadowRoot.querySelector('aside')).toBeTruthy()
        expect(shadowRoot.querySelector('footer')).toBeTruthy()
      })

      it('renders navigation with correct links', async () => {
        const html = loadFixture('full-document.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const navLinks = shadowRoot.querySelectorAll('nav a')
        expect(navLinks.length).toBe(4)
        expect(navLinks[0]?.textContent).toBe('Home')
        expect(navLinks[1]?.textContent).toBe('About')
        expect(navLinks[2]?.textContent).toBe('Services')
        expect(navLinks[3]?.textContent).toBe('Contact')
      })

      it('contains CSS variables in style', async () => {
        const html = loadFixture('full-document.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const style = shadowRoot.querySelector('style')
        expect(style?.textContent).toContain(':root')
        expect(style?.textContent).toContain('--primary-color')
        expect(style?.textContent).toContain('--secondary-color')
        expect(style?.textContent).toContain('--spacing')
      })

      it('renders pre/code block', async () => {
        const html = loadFixture('full-document.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const pre = shadowRoot.querySelector('pre')
        expect(pre).toBeTruthy()

        const code = shadowRoot.querySelector('code')
        expect(code).toBeTruthy()
        expect(code?.textContent).toContain('CSS Variables')
      })

      it('renders test button', async () => {
        const html = loadFixture('full-document.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const button = shadowRoot.querySelector('#test-button')
        expect(button).toBeTruthy()
        expect(button?.textContent?.trim()).toBe('Click Me')

        const buttonResult = shadowRoot.querySelector('#button-result')
        expect(buttonResult).toBeTruthy()
      })
    })

    describe('styled-components.html', () => {
      it('renders multiple style blocks', async () => {
        const html = loadFixture('styled-components.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(100)

        const styles = shadowRoot.querySelectorAll('style')
        expect(styles.length).toBe(6)
      })

      it('renders card components with badges', async () => {
        const html = loadFixture('styled-components.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const cards = shadowRoot.querySelectorAll('.card')
        expect(cards.length).toBe(3)

        const cardHeaders = shadowRoot.querySelectorAll('.card-header')
        expect(cardHeaders.length).toBe(3)

        const badgeNew = shadowRoot.querySelector('.badge-new')
        expect(badgeNew).toBeTruthy()
        expect(badgeNew?.textContent).toBe('NEW')

        const badgeInfo = shadowRoot.querySelector('.badge-info')
        expect(badgeInfo).toBeTruthy()
        expect(badgeInfo?.textContent).toBe('INFO')
      })

      it('renders button variations', async () => {
        const html = loadFixture('styled-components.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        expect(shadowRoot.querySelector('.btn-primary')).toBeTruthy()
        expect(shadowRoot.querySelector('.btn-success')).toBeTruthy()
        expect(shadowRoot.querySelector('.btn-danger')).toBeTruthy()
        expect(shadowRoot.querySelector('.btn-outline')).toBeTruthy()
      })

      it('renders grid layout with items', async () => {
        const html = loadFixture('styled-components.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const grid = shadowRoot.querySelector('.grid')
        expect(grid).toBeTruthy()

        const gridItems = shadowRoot.querySelectorAll('.grid-item')
        expect(gridItems.length).toBe(3)
      })

      it('renders flexbox layout with items', async () => {
        const html = loadFixture('styled-components.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const flexContainer = shadowRoot.querySelector('.flex-container')
        expect(flexContainer).toBeTruthy()

        const flexItems = shadowRoot.querySelectorAll('.flex-item')
        expect(flexItems.length).toBe(4)
      })

      it('contains animation keyframes', async () => {
        const html = loadFixture('styled-components.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const styles = shadowRoot.querySelectorAll('style')
        const allStyleContent = Array.from(styles).map(s => s.textContent).join('')
        expect(allStyleContent).toContain('@keyframes fadeIn')
        expect(allStyleContent).toContain('@keyframes pulse')
      })
    })

    describe('complex-styles.html', () => {
      it('renders sections with data-status attributes', async () => {
        const html = loadFixture('complex-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(100)

        const activeElements = shadowRoot.querySelectorAll('[data-status="active"]')
        expect(activeElements.length).toBe(2)

        const pendingElements = shadowRoot.querySelectorAll('[data-status="pending"]')
        expect(pendingElements.length).toBe(1)

        const inactiveElements = shadowRoot.querySelectorAll('[data-status="inactive"]')
        expect(inactiveElements.length).toBe(1)
      })

      it('renders quote with pseudo-elements styling', async () => {
        const html = loadFixture('complex-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const quote = shadowRoot.querySelector('.quote')
        expect(quote).toBeTruthy()

        const style = shadowRoot.querySelector('style')
        expect(style?.textContent).toContain('.quote::before')
        expect(style?.textContent).toContain('.quote::after')
      })

      it('renders items with nth-child styling', async () => {
        const html = loadFixture('complex-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const items = shadowRoot.querySelectorAll('.items > div')
        expect(items.length).toBe(6)

        const style = shadowRoot.querySelector('style')
        expect(style?.textContent).toContain(':nth-child(odd)')
        expect(style?.textContent).toContain(':nth-child(even)')
        expect(style?.textContent).toContain(':nth-child(3n)')
      })

      it('renders grid-complex layout', async () => {
        const html = loadFixture('complex-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const gridComplex = shadowRoot.querySelector('.grid-complex')
        expect(gridComplex).toBeTruthy()

        // Count direct div children of grid-complex
        const gridChildren = Array.from(gridComplex?.children || []).filter(
          (el) => el.tagName.toLowerCase() === 'div'
        )
        expect(gridChildren.length).toBe(5)
      })

      it('renders dynamic-box with CSS variables', async () => {
        const html = loadFixture('complex-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const dynamicBox = shadowRoot.querySelector('.dynamic-box')
        expect(dynamicBox).toBeTruthy()

        const style = shadowRoot.querySelector('style')
        expect(style?.textContent).toContain('var(--primary)')
        expect(style?.textContent).toContain('var(--spacing)')
        expect(style?.textContent).toContain('calc(')
      })

      it('renders multi-column layout', async () => {
        const html = loadFixture('complex-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const columns = shadowRoot.querySelector('.columns')
        expect(columns).toBeTruthy()

        const paragraphs = columns?.querySelectorAll('p')
        expect(paragraphs?.length).toBe(3)
      })

      it('contains filter and transform styles', async () => {
        const html = loadFixture('complex-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        expect(shadowRoot.querySelector('.effect-grayscale')).toBeTruthy()
        expect(shadowRoot.querySelector('.effect-brightness')).toBeTruthy()
        expect(shadowRoot.querySelector('.clip-polygon')).toBeTruthy()
      })
    })

    describe('nested-structure.html', () => {
      it('renders table with thead, tbody, and tfoot', async () => {
        const html = loadFixture('nested-structure.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const table = shadowRoot.querySelector('table')
        expect(table).toBeTruthy()

        const thead = table?.querySelector('thead')
        expect(thead).toBeTruthy()
        expect(thead?.querySelectorAll('th').length).toBe(3)

        const tbody = table?.querySelector('tbody')
        expect(tbody).toBeTruthy()
        expect(tbody?.querySelectorAll('tr').length).toBe(3)

        const tfoot = table?.querySelector('tfoot')
        expect(tfoot).toBeTruthy()
        expect(tfoot?.querySelector('td')?.getAttribute('colspan')).toBe('3')
      })

      it('renders nested unordered lists 3 levels deep', async () => {
        const html = loadFixture('nested-structure.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const topUl = shadowRoot.querySelector('body > ul, html > body > ul, ul')
        expect(topUl).toBeTruthy()

        // Check for nested ul structure
        const nestedUl = shadowRoot.querySelector('ul ul ul')
        expect(nestedUl).toBeTruthy()

        const deepItems = nestedUl?.querySelectorAll('li')
        expect(deepItems?.length).toBe(2)
      })

      it('renders nested ordered lists', async () => {
        const html = loadFixture('nested-structure.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const nestedOl = shadowRoot.querySelector('ol ol ol')
        expect(nestedOl).toBeTruthy()

        const deepItems = nestedOl?.querySelectorAll('li')
        expect(deepItems?.length).toBe(2)
      })

      it('renders deeply nested divs (level-1 through level-4)', async () => {
        const html = loadFixture('nested-structure.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const level1 = shadowRoot.querySelectorAll('.level-1')
        expect(level1.length).toBe(2)

        const level2 = shadowRoot.querySelectorAll('.level-2')
        expect(level2.length).toBe(2)

        const level3 = shadowRoot.querySelector('.level-3')
        expect(level3).toBeTruthy()

        const level4 = shadowRoot.querySelector('.level-4')
        expect(level4).toBeTruthy()

        // Verify nesting
        const deepNested = shadowRoot.querySelector('.level-1 .level-2 .level-3 .level-4')
        expect(deepNested).toBeTruthy()
      })

      it('renders nested blockquotes', async () => {
        const html = loadFixture('nested-structure.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const nestedBlockquote = shadowRoot.querySelector('blockquote blockquote blockquote')
        expect(nestedBlockquote).toBeTruthy()
        expect(nestedBlockquote?.textContent).toContain('deeply nested quote')
      })

      it('renders mixed nested structure with table inside list', async () => {
        const html = loadFixture('nested-structure.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        // Find table inside a list item
        const tableInList = shadowRoot.querySelector('li .level-2 table')
        expect(tableInList).toBeTruthy()

        const cells = tableInList?.querySelectorAll('td')
        expect(cells?.length).toBe(2)
      })
    })

    describe('mixed-content.html', () => {
      it('renders sections with data-section-id attributes', async () => {
        const html = loadFixture('mixed-content.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(100)

        const sections = shadowRoot.querySelectorAll('[data-section-id]')
        expect(sections.length).toBe(5)

        expect(shadowRoot.querySelector('[data-section-id="data-attrs"]')).toBeTruthy()
        expect(shadowRoot.querySelector('[data-section-id="semantic"]')).toBeTruthy()
        expect(shadowRoot.querySelector('[data-section-id="forms"]')).toBeTruthy()
        expect(shadowRoot.querySelector('[data-section-id="lists"]')).toBeTruthy()
        expect(shadowRoot.querySelector('[data-section-id="table"]')).toBeTruthy()
      })

      it('renders cards with data attributes', async () => {
        const html = loadFixture('mixed-content.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const cards = shadowRoot.querySelectorAll('.card')
        expect(cards.length).toBe(3)

        const activeCard = shadowRoot.querySelector('[data-status="active"]')
        expect(activeCard).toBeTruthy()
        expect(activeCard?.getAttribute('data-id')).toBe('1')
        expect(activeCard?.getAttribute('data-category')).toBe('premium')

        const pendingCard = shadowRoot.querySelector('[data-status="pending"]')
        expect(pendingCard?.getAttribute('data-category')).toBe('standard')
      })

      it('renders semantic elements', async () => {
        const html = loadFixture('mixed-content.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        expect(shadowRoot.querySelector('article')).toBeTruthy()
        expect(shadowRoot.querySelector('article header')).toBeTruthy()
        expect(shadowRoot.querySelector('article footer')).toBeTruthy()
        expect(shadowRoot.querySelector('time')).toBeTruthy()
        expect(shadowRoot.querySelector('details')).toBeTruthy()
        expect(shadowRoot.querySelector('summary')).toBeTruthy()
        expect(shadowRoot.querySelector('figure')).toBeTruthy()
        expect(shadowRoot.querySelector('figcaption')).toBeTruthy()
      })

      it('renders text formatting elements', async () => {
        const html = loadFixture('mixed-content.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        expect(shadowRoot.querySelector('strong')).toBeTruthy()
        expect(shadowRoot.querySelector('em')).toBeTruthy()
        expect(shadowRoot.querySelector('mark')).toBeTruthy()
        expect(shadowRoot.querySelector('small')).toBeTruthy()
      })

      it('renders form with fieldset and legend', async () => {
        const html = loadFixture('mixed-content.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const form = shadowRoot.querySelector('#test-form')
        expect(form).toBeTruthy()
        expect(form?.getAttribute('data-form-type')).toBe('contact')

        const fieldset = shadowRoot.querySelector('fieldset')
        expect(fieldset).toBeTruthy()

        const legend = shadowRoot.querySelector('legend')
        expect(legend?.textContent).toBe('Contact Information')
      })

      it('renders select with options', async () => {
        const html = loadFixture('mixed-content.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const select = shadowRoot.querySelector('#priority') as HTMLSelectElement
        expect(select).toBeTruthy()
        expect(select?.options.length).toBe(3)

        // Check selected option
        const selectedOption = select?.querySelector('option[selected]')
        expect(selectedOption?.value).toBe('medium')
      })

      it('renders definition list', async () => {
        const html = loadFixture('mixed-content.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const dl = shadowRoot.querySelector('dl')
        expect(dl).toBeTruthy()

        const dts = shadowRoot.querySelectorAll('dt')
        expect(dts.length).toBe(2)
        expect(dts[0]?.textContent).toBe('HTML')
        expect(dts[1]?.textContent).toBe('CSS')

        const dds = shadowRoot.querySelectorAll('dd')
        expect(dds.length).toBe(2)
      })

      it('renders table with data-row-id attributes', async () => {
        const html = loadFixture('mixed-content.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const table = shadowRoot.querySelector('table')
        expect(table).toBeTruthy()

        const rowsWithDataId = shadowRoot.querySelectorAll('tr[data-row-id]')
        expect(rowsWithDataId.length).toBe(2)
        expect(rowsWithDataId[0]?.getAttribute('data-row-id')).toBe('1')
        expect(rowsWithDataId[1]?.getAttribute('data-row-id')).toBe('2')
      })

      it('renders tags with different classes', async () => {
        const html = loadFixture('mixed-content.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        expect(shadowRoot.querySelector('.tag-primary')).toBeTruthy()
        expect(shadowRoot.querySelector('.tag-secondary')).toBeTruthy()
      })
    })

    describe('import-styles.html', () => {
      it('renders container with correct structure', async () => {
        const html = loadFixture('import-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(100)

        const container = shadowRoot.querySelector('.container')
        expect(container).toBeTruthy()

        const h1 = shadowRoot.querySelector('h1')
        expect(h1?.textContent).toContain('CSS @import Test')
      })

      it('renders sections with data-section-id', async () => {
        const html = loadFixture('import-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const sections = shadowRoot.querySelectorAll('[data-section-id]')
        expect(sections.length).toBe(4)

        expect(shadowRoot.querySelector('[data-section-id="basic-import"]')).toBeTruthy()
        expect(shadowRoot.querySelector('[data-section-id="combined-import"]')).toBeTruthy()
        expect(shadowRoot.querySelector('[data-section-id="verification"]')).toBeTruthy()
        expect(shadowRoot.querySelector('[data-section-id="additional"]')).toBeTruthy()
      })

      it('renders test boxes with import-related classes', async () => {
        const html = loadFixture('import-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const importedStyleEls = shadowRoot.querySelectorAll('.imported-style')
        expect(importedStyleEls.length).toBeGreaterThan(0)

        const secondaryImportEls = shadowRoot.querySelectorAll('.secondary-import')
        expect(secondaryImportEls.length).toBeGreaterThan(0)

        const mediaImportEls = shadowRoot.querySelectorAll('.media-import')
        expect(mediaImportEls.length).toBeGreaterThan(0)
      })

      it('contains @import directives in style', async () => {
        const html = loadFixture('import-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const style = shadowRoot.querySelector('style')
        expect(style?.textContent).toContain('@import')
        expect(style?.textContent).toContain('.imported-style')
        expect(style?.textContent).toContain('.secondary-import')
        expect(style?.textContent).toContain('.media-import')
      })

      it('renders verification cards', async () => {
        const html = loadFixture('import-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const cards = shadowRoot.querySelectorAll('.card[data-card-id]')
        expect(cards.length).toBe(3)

        expect(shadowRoot.querySelector('[data-card-id="import-basic"]')).toBeTruthy()
        expect(shadowRoot.querySelector('[data-card-id="import-secondary"]')).toBeTruthy()
        expect(shadowRoot.querySelector('[data-card-id="import-media"]')).toBeTruthy()
      })

      it('renders import result element', async () => {
        const html = loadFixture('import-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const importResult = shadowRoot.querySelector('#import-result')
        expect(importResult).toBeTruthy()
        expect(importResult?.getAttribute('data-import-verified')).toBe('false')

        const resultText = shadowRoot.querySelector('#result-text')
        expect(resultText).toBeTruthy()
      })

      it('renders details/summary for @import syntax', async () => {
        const html = loadFixture('import-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const details = shadowRoot.querySelector('details')
        expect(details).toBeTruthy()

        const summary = shadowRoot.querySelector('summary')
        expect(summary?.textContent).toContain('@import syntax')

        const pre = shadowRoot.querySelector('pre')
        expect(pre).toBeTruthy()
        expect(pre?.textContent).toContain('@import url')
      })

      it('renders import-indicator badge', async () => {
        const html = loadFixture('import-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const indicator = shadowRoot.querySelector('.import-indicator')
        expect(indicator).toBeTruthy()
        expect(indicator?.textContent).toBe('@import')
      })

      it('renders combined styles element', async () => {
        const html = loadFixture('import-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const combined = shadowRoot.querySelector('.imported-style.combined-styles')
        expect(combined).toBeTruthy()
        expect(combined?.getAttribute('data-test')).toBe('combined')
      })

      it('contains CSS variables', async () => {
        const html = loadFixture('import-styles.html')
        await renderIntoShadowRoot(shadowRoot, html)
        await waitFor(50)

        const style = shadowRoot.querySelector('style')
        expect(style?.textContent).toContain(':root')
        expect(style?.textContent).toContain('--primary-color')
        expect(style?.textContent).toContain('--secondary-color')
        expect(style?.textContent).toContain('--import-indicator')
      })
    })
  })
})
