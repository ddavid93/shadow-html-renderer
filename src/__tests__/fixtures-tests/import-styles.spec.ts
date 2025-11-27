import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { renderIntoShadowRoot } from '../../renderers/shadowRenderer'
import {
  loadFixture,
  waitFor,
  setupShadowTest,
  teardownShadowTest,
  ShadowTestContext,
} from '../test-utils'

/**
 * import-styles.html Fixture Tests
 *
 * Tests for CSS @import directive handling:
 * - Container structure
 * - Sections with data-section-id
 * - Test boxes with import-related classes
 * - @import directives in style
 * - Verification cards
 * - Import result element
 * - Details/summary for @import syntax
 * - Import-indicator badge
 * - Combined styles element
 * - CSS variables
 */
describe('Fixture: import-styles.html', () => {
  let ctx: ShadowTestContext

  beforeEach(() => {
    ctx = setupShadowTest()
  })

  afterEach(() => {
    teardownShadowTest(ctx.host)
  })

  it('renders container with correct structure', async () => {
    const html = loadFixture('import-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    const container = ctx.shadowRoot.querySelector('.container')
    expect(container).toBeTruthy()

    const h1 = ctx.shadowRoot.querySelector('h1')
    expect(h1?.textContent).toContain('CSS @import Test')
  })

  it('renders sections with data-section-id', async () => {
    const html = loadFixture('import-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const sections = ctx.shadowRoot.querySelectorAll('[data-section-id]')
    expect(sections.length).toBe(4)

    expect(ctx.shadowRoot.querySelector('[data-section-id="basic-import"]')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('[data-section-id="combined-import"]')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('[data-section-id="verification"]')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('[data-section-id="additional"]')).toBeTruthy()
  })

  it('renders test boxes with import-related classes', async () => {
    const html = loadFixture('import-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const importedStyleEls = ctx.shadowRoot.querySelectorAll('.imported-style')
    expect(importedStyleEls.length).toBeGreaterThan(0)

    const secondaryImportEls = ctx.shadowRoot.querySelectorAll('.secondary-import')
    expect(secondaryImportEls.length).toBeGreaterThan(0)

    const mediaImportEls = ctx.shadowRoot.querySelectorAll('.media-import')
    expect(mediaImportEls.length).toBeGreaterThan(0)
  })

  it('contains @import directives in style', async () => {
    const html = loadFixture('import-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const style = ctx.shadowRoot.querySelector('style')
    expect(style?.textContent).toContain('@import')
    expect(style?.textContent).toContain('.imported-style')
    expect(style?.textContent).toContain('.secondary-import')
    expect(style?.textContent).toContain('.media-import')
  })

  it('renders verification cards', async () => {
    const html = loadFixture('import-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const cards = ctx.shadowRoot.querySelectorAll('.card[data-card-id]')
    expect(cards.length).toBe(3)

    expect(ctx.shadowRoot.querySelector('[data-card-id="import-basic"]')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('[data-card-id="import-secondary"]')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('[data-card-id="import-media"]')).toBeTruthy()
  })

  it('renders import result element', async () => {
    const html = loadFixture('import-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const importResult = ctx.shadowRoot.querySelector('#import-result')
    expect(importResult).toBeTruthy()
    expect(importResult?.getAttribute('data-import-verified')).toBe('false')

    const resultText = ctx.shadowRoot.querySelector('#result-text')
    expect(resultText).toBeTruthy()
  })

  it('renders details/summary for @import syntax', async () => {
    const html = loadFixture('import-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const details = ctx.shadowRoot.querySelector('details')
    expect(details).toBeTruthy()

    const summary = ctx.shadowRoot.querySelector('summary')
    expect(summary?.textContent).toContain('@import syntax')

    const pre = ctx.shadowRoot.querySelector('pre')
    expect(pre).toBeTruthy()
    expect(pre?.textContent).toContain('@import url')
  })

  it('renders import-indicator badge', async () => {
    const html = loadFixture('import-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const indicator = ctx.shadowRoot.querySelector('.import-indicator')
    expect(indicator).toBeTruthy()
    expect(indicator?.textContent).toBe('@import')
  })

  it('renders combined styles element', async () => {
    const html = loadFixture('import-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const combined = ctx.shadowRoot.querySelector('.imported-style.combined-styles')
    expect(combined).toBeTruthy()
    expect(combined?.getAttribute('data-test')).toBe('combined')
  })

  it('contains CSS variables', async () => {
    const html = loadFixture('import-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const style = ctx.shadowRoot.querySelector('style')
    expect(style?.textContent).toContain(':root')
    expect(style?.textContent).toContain('--primary-color')
    expect(style?.textContent).toContain('--secondary-color')
    expect(style?.textContent).toContain('--import-indicator')
  })
})
