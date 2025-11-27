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
 * complex-styles.html Fixture Tests
 *
 * Tests for advanced CSS features:
 * - Data-status attributes
 * - Pseudo-elements styling
 * - nth-child styling
 * - Grid-complex layout
 * - CSS variables and calc()
 * - Multi-column layout
 * - Filter and transform styles
 */
describe('Fixture: complex-styles.html', () => {
  let ctx: ShadowTestContext

  beforeEach(() => {
    ctx = setupShadowTest()
  })

  afterEach(() => {
    teardownShadowTest(ctx.host)
  })

  it('renders sections with data-status attributes', async () => {
    const html = loadFixture('complex-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    const activeElements = ctx.shadowRoot.querySelectorAll('[data-status="active"]')
    expect(activeElements.length).toBe(2)

    const pendingElements = ctx.shadowRoot.querySelectorAll('[data-status="pending"]')
    expect(pendingElements.length).toBe(1)

    const inactiveElements = ctx.shadowRoot.querySelectorAll('[data-status="inactive"]')
    expect(inactiveElements.length).toBe(1)
  })

  it('renders quote with pseudo-elements styling', async () => {
    const html = loadFixture('complex-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const quote = ctx.shadowRoot.querySelector('.quote')
    expect(quote).toBeTruthy()

    const style = ctx.shadowRoot.querySelector('style')
    expect(style?.textContent).toContain('.quote::before')
    expect(style?.textContent).toContain('.quote::after')
  })

  it('renders items with nth-child styling', async () => {
    const html = loadFixture('complex-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const items = ctx.shadowRoot.querySelectorAll('.items > div')
    expect(items.length).toBe(6)

    const style = ctx.shadowRoot.querySelector('style')
    expect(style?.textContent).toContain(':nth-child(odd)')
    expect(style?.textContent).toContain(':nth-child(even)')
    expect(style?.textContent).toContain(':nth-child(3n)')
  })

  it('renders grid-complex layout', async () => {
    const html = loadFixture('complex-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const gridComplex = ctx.shadowRoot.querySelector('.grid-complex')
    expect(gridComplex).toBeTruthy()

    // Count direct div children of grid-complex
    const gridChildren = Array.from(gridComplex?.children || []).filter(
      (el) => el.tagName.toLowerCase() === 'div'
    )
    expect(gridChildren.length).toBe(5)
  })

  it('renders dynamic-box with CSS variables', async () => {
    const html = loadFixture('complex-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const dynamicBox = ctx.shadowRoot.querySelector('.dynamic-box')
    expect(dynamicBox).toBeTruthy()

    const style = ctx.shadowRoot.querySelector('style')
    expect(style?.textContent).toContain('var(--primary)')
    expect(style?.textContent).toContain('var(--spacing)')
    expect(style?.textContent).toContain('calc(')
  })

  it('renders multi-column layout', async () => {
    const html = loadFixture('complex-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const columns = ctx.shadowRoot.querySelector('.columns')
    expect(columns).toBeTruthy()

    const paragraphs = columns?.querySelectorAll('p')
    expect(paragraphs?.length).toBe(3)
  })

  it('contains filter and transform styles', async () => {
    const html = loadFixture('complex-styles.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    expect(ctx.shadowRoot.querySelector('.effect-grayscale')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('.effect-brightness')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('.clip-polygon')).toBeTruthy()
  })
})
