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
 * inline-scripts.html Fixture Tests
 *
 * Tests for inline script execution:
 * - Script result elements rendering
 * - Heading and structure verification
 * - Gradient background styles
 */
describe('Fixture: inline-scripts.html', () => {
  let ctx: ShadowTestContext

  beforeEach(() => {
    ctx = setupShadowTest()
  })

  afterEach(() => {
    teardownShadowTest(ctx.host)
  })

  it('renders all script result elements', async () => {
    const html = loadFixture('inline-scripts.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    // Verify result divs exist
    const scriptResult = ctx.shadowRoot.querySelector('#script-result')
    expect(scriptResult).toBeTruthy()
    expect(scriptResult?.classList.contains('result')).toBe(true)

    const calculationResult = ctx.shadowRoot.querySelector('#calculation-result')
    expect(calculationResult).toBeTruthy()

    const domManipulationResult = ctx.shadowRoot.querySelector('#dom-manipulation-result')
    expect(domManipulationResult).toBeTruthy()
  })

  it('has correct heading and structure', async () => {
    const html = loadFixture('inline-scripts.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const h1 = ctx.shadowRoot.querySelector('h1')
    expect(h1?.textContent).toBe('Inline Scripts Test')

    // Verify style with gradient background
    const style = ctx.shadowRoot.querySelector('style')
    expect(style?.textContent).toContain('linear-gradient')
  })
})
