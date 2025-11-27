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
 * simple-content.html Fixture Tests
 *
 * Tests for basic HTML content rendering:
 * - Container structure verification
 * - Heading and paragraph content
 * - List items rendering
 * - Style element presence
 */
describe('Fixture: simple-content.html', () => {
  let ctx: ShadowTestContext

  beforeEach(() => {
    ctx = setupShadowTest()
  })

  afterEach(() => {
    teardownShadowTest(ctx.host)
  })

  it('renders container with correct structure', async () => {
    const html = loadFixture('simple-content.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    // Verify container structure
    const container = ctx.shadowRoot.querySelector('.container')
    expect(container).toBeTruthy()

    // Verify h1 content
    const h1 = ctx.shadowRoot.querySelector('h1')
    expect(h1?.textContent).toBe('Simple Content Test')

    // Verify paragraphs
    const paragraphs = ctx.shadowRoot.querySelectorAll('p')
    expect(paragraphs.length).toBe(2)
    expect(paragraphs[0]?.textContent).toContain('simple HTML document')
    expect(paragraphs[1]?.textContent).toContain('basic styling')

    // Verify list items
    const listItems = ctx.shadowRoot.querySelectorAll('li')
    expect(listItems.length).toBe(3)
    expect(listItems[0]?.textContent).toBe('List item 1')
    expect(listItems[1]?.textContent).toBe('List item 2')
    expect(listItems[2]?.textContent).toBe('List item 3')
  })

  it('contains style element with proper CSS', async () => {
    const html = loadFixture('simple-content.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const style = ctx.shadowRoot.querySelector('style')
    expect(style).toBeTruthy()
    expect(style?.textContent).toContain('.container')
    expect(style?.textContent).toContain('font-family')
  })
})
