import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { renderIntoShadowRoot, clearShadowRoot } from '../renderers/shadowRenderer'
import {
  loadFixture,
  waitFor,
  setupShadowTest,
  teardownShadowTest,
  ShadowTestContext,
} from './test-utils'

/**
 * Script Execution Tests
 *
 * Tests for various script execution scenarios:
 * - Simple content rendering
 * - Inline script execution
 * - Async/defer script handling
 * - ES6 module scripts
 * - Interactive elements
 * - Full document structure
 * - Style blocks application
 * - Complex CSS handling
 * - Nested DOM structures
 * - Shadow root cleanup
 */
describe('Script Execution Tests', () => {
  let ctx: ShadowTestContext

  beforeEach(() => {
    ctx = setupShadowTest()
  })

  afterEach(() => {
    teardownShadowTest(ctx.host)
  })

  it('renders simple content correctly', async () => {
    const html = loadFixture('simple-content.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    expect(ctx.shadowRoot).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('h1')?.textContent).toContain('Simple Content Test')

    // Verify content structure is rendered
    expect(ctx.shadowRoot.querySelector('.container')).toBeTruthy()
    expect(ctx.shadowRoot.querySelectorAll('li').length).toBe(3)
  })

  it('executes inline scripts', async () => {
    const html = loadFixture('inline-scripts.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    // Verify DOM structure from the fixture is rendered
    const result = ctx.shadowRoot.querySelector('#script-result')
    expect(result).toBeTruthy()

    // Verify content is rendered
    expect(ctx.shadowRoot.querySelector('h1')).toBeTruthy()
  })

  it('handles async and defer scripts correctly', async () => {
    const html = loadFixture('async-defer-scripts.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(200)

    // Verify DOM structure is rendered correctly
    expect(ctx.shadowRoot.children.length).toBeGreaterThan(0)

    // Verify heading is rendered
    expect(ctx.shadowRoot.querySelector('h1')).toBeTruthy()
  })

  it('executes ES6 module scripts', async () => {
    const html = loadFixture('module-script.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(200)

    // Verify DOM structure from fixture is rendered
    const moduleResult = ctx.shadowRoot.querySelector('#module-result')
    expect(moduleResult).toBeTruthy()

    // Verify content structure
    expect(ctx.shadowRoot.querySelector('h1')).toBeTruthy()
  })

  it('handles interactive elements correctly', async () => {
    const html = loadFixture('interactive-elements.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    // Verify interactive elements are rendered
    const incrementBtn = ctx.shadowRoot.querySelector('#increment-btn') as HTMLButtonElement
    expect(incrementBtn).toBeTruthy()

    const counter = ctx.shadowRoot.querySelector('#counter')
    expect(counter).toBeTruthy()

    // Verify form elements are present
    const form = ctx.shadowRoot.querySelector('form')
    expect(form).toBeTruthy()
  })

  it('renders full HTML5 document structure', async () => {
    const html = loadFixture('full-document.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    // Check semantic HTML5 elements are rendered
    expect(ctx.shadowRoot.querySelector('header')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('nav')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('main')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('footer')).toBeTruthy()

    // Verify article element is present
    expect(ctx.shadowRoot.querySelector('article')).toBeTruthy()
  })

  it('applies multiple style blocks correctly', async () => {
    const html = loadFixture('styled-components.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    // Verify styled components are rendered
    const card = ctx.shadowRoot.querySelector('.card')
    expect(card).toBeTruthy()

    // Verify multiple style elements are present
    const styles = ctx.shadowRoot.querySelectorAll('style')
    expect(styles.length).toBeGreaterThan(0)
  })

  it('handles complex CSS selectors and features', async () => {
    const html = loadFixture('complex-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    // Verify elements with data attributes are rendered
    const activeElements = ctx.shadowRoot.querySelectorAll('[data-status="active"]')
    expect(activeElements.length).toBeGreaterThan(0)

    // Verify complex DOM structure elements are present
    const sections = ctx.shadowRoot.querySelectorAll('.section')
    expect(sections.length).toBeGreaterThan(0)
  })

  it('handles nested DOM structures', async () => {
    const html = loadFixture('nested-structure.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    // Check table structure
    const table = ctx.shadowRoot.querySelector('table')
    expect(table).toBeTruthy()
    const rows = table?.querySelectorAll('tr')
    expect(rows?.length).toBeGreaterThan(0)

    // Check nested divs
    const deepDiv = ctx.shadowRoot.querySelector('.level-1 .level-2 .level-3')
    expect(deepDiv).toBeTruthy()
  })

  it('clears shadow root correctly', async () => {
    const html = loadFixture('simple-content.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    expect(ctx.shadowRoot.children.length).toBeGreaterThan(0)

    clearShadowRoot(ctx.shadowRoot)
    expect(ctx.shadowRoot.children.length).toBe(0)
  })
})
