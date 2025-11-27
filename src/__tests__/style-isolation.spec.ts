import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { renderIntoShadowRoot } from '../renderers/shadowRenderer'
import {
  loadFixture,
  waitFor,
  setupShadowTest,
  teardownShadowTest,
  ShadowTestContext,
} from './test-utils'

/**
 * Style Isolation Tests
 *
 * Tests for Shadow DOM style isolation:
 * - Simple content rendering in shadow DOM
 * - Style encapsulation
 * - @font-face extraction and injection
 * - Complete HTML structure preservation
 * - Complex CSS handling in shadow DOM
 * - Nested structure rendering
 */
describe('Style Isolation Tests', () => {
  let ctx: ShadowTestContext

  beforeEach(() => {
    ctx = setupShadowTest()
  })

  afterEach(() => {
    teardownShadowTest(ctx.host)
  })

  it('renders simple content in shadow DOM', async () => {
    const html = loadFixture('simple-content.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    expect(ctx.shadowRoot).toBeTruthy()

    const h1 = ctx.shadowRoot.querySelector('h1')
    expect(h1?.textContent).toContain('Simple Content Test')
  })

  it('isolates styles in shadow DOM', async () => {
    const html = loadFixture('styled-components.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    expect(ctx.shadowRoot).toBeTruthy()

    // Styles should be in shadow DOM, not in main document
    const shadowStyles = ctx.shadowRoot.querySelectorAll('style')
    expect(shadowStyles.length).toBeGreaterThan(0)

    const shadowCard = ctx.shadowRoot.querySelector('.card')
    expect(shadowCard).toBeTruthy()
  })

  it('extracts and injects @font-face rules', async () => {
    const html = loadFixture('font-face.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    // Font styles should be injected into main document head
    const fontStyle = document.getElementById('shadow-dom-fonts')
    expect(fontStyle).toBeTruthy()
    expect(fontStyle?.textContent).toContain('@font-face')
    expect(fontStyle?.textContent).toContain('CustomFont')
  })

  it('preserves complete HTML structure in shadow DOM', async () => {
    const html = loadFixture('full-document.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    expect(ctx.shadowRoot).toBeTruthy()

    // Should have html element as root
    const htmlElement = ctx.shadowRoot.querySelector('html')
    expect(htmlElement).toBeTruthy()

    // Should have head and body
    const head = ctx.shadowRoot.querySelector('head')
    const body = ctx.shadowRoot.querySelector('body')
    expect(head).toBeTruthy()
    expect(body).toBeTruthy()

    // Check semantic elements
    expect(ctx.shadowRoot.querySelector('header')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('nav')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('main')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('footer')).toBeTruthy()
  })

  it('handles complex CSS in shadow DOM', async () => {
    const html = loadFixture('complex-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    // Verify complex selectors work in shadow DOM
    const sections = ctx.shadowRoot.querySelectorAll('.section')
    expect(sections.length).toBeGreaterThan(0)

    const statusElements = ctx.shadowRoot.querySelectorAll('[data-status]')
    expect(statusElements.length).toBeGreaterThan(0)
  })

  it('renders nested structures in shadow DOM', async () => {
    const html = loadFixture('nested-structure.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const table = ctx.shadowRoot.querySelector('table')
    expect(table).toBeTruthy()

    const nestedDiv = ctx.shadowRoot.querySelector('.level-1 .level-2 .level-3')
    expect(nestedDiv).toBeTruthy()
  })
})
