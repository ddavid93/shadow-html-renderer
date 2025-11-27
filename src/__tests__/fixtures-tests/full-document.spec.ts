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
 * full-document.html Fixture Tests
 *
 * Tests for complete HTML5 document structure:
 * - Semantic HTML5 elements
 * - Navigation links
 * - CSS variables
 * - Pre/code blocks
 * - Test button
 */
describe('Fixture: full-document.html', () => {
  let ctx: ShadowTestContext

  beforeEach(() => {
    ctx = setupShadowTest()
  })

  afterEach(() => {
    teardownShadowTest(ctx.host)
  })

  it('renders complete HTML5 semantic structure', async () => {
    const html = loadFixture('full-document.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    // Verify semantic elements
    expect(ctx.shadowRoot.querySelector('header')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('nav')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('main')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('article')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('section')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('aside')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('footer')).toBeTruthy()
  })

  it('renders navigation with correct links', async () => {
    const html = loadFixture('full-document.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const navLinks = ctx.shadowRoot.querySelectorAll('nav a')
    expect(navLinks.length).toBe(4)
    expect(navLinks[0]?.textContent).toBe('Home')
    expect(navLinks[1]?.textContent).toBe('About')
    expect(navLinks[2]?.textContent).toBe('Services')
    expect(navLinks[3]?.textContent).toBe('Contact')
  })

  it('contains CSS variables in style', async () => {
    const html = loadFixture('full-document.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const style = ctx.shadowRoot.querySelector('style')
    expect(style?.textContent).toContain(':root')
    expect(style?.textContent).toContain('--primary-color')
    expect(style?.textContent).toContain('--secondary-color')
    expect(style?.textContent).toContain('--spacing')
  })

  it('renders pre/code block', async () => {
    const html = loadFixture('full-document.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const pre = ctx.shadowRoot.querySelector('pre')
    expect(pre).toBeTruthy()

    const code = ctx.shadowRoot.querySelector('code')
    expect(code).toBeTruthy()
    expect(code?.textContent).toContain('CSS Variables')
  })

  it('renders test button', async () => {
    const html = loadFixture('full-document.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const button = ctx.shadowRoot.querySelector('#test-button')
    expect(button).toBeTruthy()
    expect(button?.textContent?.trim()).toBe('Click Me')

    const buttonResult = ctx.shadowRoot.querySelector('#button-result')
    expect(buttonResult).toBeTruthy()
  })
})
