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
 * async-defer-scripts.html Fixture Tests
 *
 * Tests for async and defer script handling:
 * - Status div rendering
 * - Script execution notes
 */
describe('Fixture: async-defer-scripts.html', () => {
  let ctx: ShadowTestContext

  beforeEach(() => {
    ctx = setupShadowTest()
  })

  afterEach(() => {
    teardownShadowTest(ctx.host)
  })

  it('renders all status divs', async () => {
    const html = loadFixture('async-defer-scripts.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    const regularStatus = ctx.shadowRoot.querySelector('#regular-status')
    expect(regularStatus).toBeTruthy()
    expect(regularStatus?.classList.contains('status')).toBe(true)

    const deferStatus = ctx.shadowRoot.querySelector('#defer-status')
    expect(deferStatus).toBeTruthy()

    const asyncStatus = ctx.shadowRoot.querySelector('#async-status')
    expect(asyncStatus).toBeTruthy()
  })

  it('contains script execution notes', async () => {
    const html = loadFixture('async-defer-scripts.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const listItems = ctx.shadowRoot.querySelectorAll('li')
    expect(listItems.length).toBe(3)

    // Verify notes about script types
    const content = ctx.shadowRoot.textContent
    expect(content).toContain('Regular scripts')
    expect(content).toContain('Defer scripts')
    expect(content).toContain('Async scripts')
  })
})
