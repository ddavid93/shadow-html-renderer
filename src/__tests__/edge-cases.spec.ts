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
 * Edge Cases and Error Handling Tests
 *
 * Tests for edge cases and error scenarios:
 * - Empty HTML string handling
 * - HTML without head or body tags
 * - Malformed HTML handling
 * - Shadow DOM rendering verification
 */
describe('Edge Cases and Error Handling', () => {
  let ctx: ShadowTestContext

  beforeEach(() => {
    ctx = setupShadowTest()
  })

  afterEach(() => {
    teardownShadowTest(ctx.host)
  })

  it('handles empty HTML string', async () => {
    await renderIntoShadowRoot(ctx.shadowRoot, '')
    expect(ctx.shadowRoot).toBeTruthy()
  })

  it('handles HTML without head or body tags', async () => {
    const html = '<div><h1>No Structure</h1><p>Just content</p></div>'
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    expect(ctx.shadowRoot.querySelector('h1')?.textContent).toBe('No Structure')
  })

  it('handles malformed HTML gracefully', async () => {
    const html = '<div><p>Unclosed paragraph<div>Nested improperly</p></div>'
    await renderIntoShadowRoot(ctx.shadowRoot, html)

    expect(ctx.shadowRoot).toBeTruthy()
    // Browser will auto-correct the HTML
  })

  it('renders into shadow DOM correctly', async () => {
    const html = loadFixture('simple-content.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    expect(ctx.shadowRoot).toBeTruthy()

    // Verify content is in shadow root
    const h1 = ctx.shadowRoot.querySelector('h1')
    expect(h1?.textContent).toContain('Simple Content Test')
  })
})
