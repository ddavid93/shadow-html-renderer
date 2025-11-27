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
 * font-face.html Fixture Tests
 *
 * Tests for @font-face handling:
 * - Container and feature boxes rendering
 * - @font-face declarations in styles
 * - Normal and bold text sections
 */
describe('Fixture: font-face.html', () => {
  let ctx: ShadowTestContext

  beforeEach(() => {
    ctx = setupShadowTest()
  })

  afterEach(() => {
    teardownShadowTest(ctx.host)
  })

  it('renders container with feature boxes', async () => {
    const html = loadFixture('font-face.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    const container = ctx.shadowRoot.querySelector('.container')
    expect(container).toBeTruthy()

    const featureBoxes = ctx.shadowRoot.querySelectorAll('.feature-box')
    expect(featureBoxes.length).toBe(2)

    // Verify h1
    const h1 = ctx.shadowRoot.querySelector('h1')
    expect(h1?.textContent).toBe('Font Face Test')
  })

  it('contains @font-face declarations', async () => {
    const html = loadFixture('font-face.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    const style = ctx.shadowRoot.querySelector('style')
    expect(style?.textContent).toContain('@font-face')
    expect(style?.textContent).toContain('CustomFont')
    expect(style?.textContent).toContain('font-weight: normal')
    expect(style?.textContent).toContain('font-weight: bold')
  })

  it('has normal and bold text sections', async () => {
    const html = loadFixture('font-face.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const normalText = ctx.shadowRoot.querySelector('.normal-text')
    expect(normalText).toBeTruthy()

    const boldText = ctx.shadowRoot.querySelector('.bold-text')
    expect(boldText).toBeTruthy()
  })
})
