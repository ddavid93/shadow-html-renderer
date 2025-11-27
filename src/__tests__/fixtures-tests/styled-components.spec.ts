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
 * styled-components.html Fixture Tests
 *
 * Tests for multiple style blocks and components:
 * - Multiple style blocks
 * - Card components with badges
 * - Button variations
 * - Grid layout
 * - Flexbox layout
 * - Animation keyframes
 */
describe('Fixture: styled-components.html', () => {
  let ctx: ShadowTestContext

  beforeEach(() => {
    ctx = setupShadowTest()
  })

  afterEach(() => {
    teardownShadowTest(ctx.host)
  })

  it('renders multiple style blocks', async () => {
    const html = loadFixture('styled-components.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    const styles = ctx.shadowRoot.querySelectorAll('style')
    expect(styles.length).toBe(6)
  })

  it('renders card components with badges', async () => {
    const html = loadFixture('styled-components.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const cards = ctx.shadowRoot.querySelectorAll('.card')
    expect(cards.length).toBe(3)

    const cardHeaders = ctx.shadowRoot.querySelectorAll('.card-header')
    expect(cardHeaders.length).toBe(3)

    const badgeNew = ctx.shadowRoot.querySelector('.badge-new')
    expect(badgeNew).toBeTruthy()
    expect(badgeNew?.textContent).toBe('NEW')

    const badgeInfo = ctx.shadowRoot.querySelector('.badge-info')
    expect(badgeInfo).toBeTruthy()
    expect(badgeInfo?.textContent).toBe('INFO')
  })

  it('renders button variations', async () => {
    const html = loadFixture('styled-components.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    expect(ctx.shadowRoot.querySelector('.btn-primary')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('.btn-success')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('.btn-danger')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('.btn-outline')).toBeTruthy()
  })

  it('renders grid layout with items', async () => {
    const html = loadFixture('styled-components.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const grid = ctx.shadowRoot.querySelector('.grid')
    expect(grid).toBeTruthy()

    const gridItems = ctx.shadowRoot.querySelectorAll('.grid-item')
    expect(gridItems.length).toBe(3)
  })

  it('renders flexbox layout with items', async () => {
    const html = loadFixture('styled-components.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const flexContainer = ctx.shadowRoot.querySelector('.flex-container')
    expect(flexContainer).toBeTruthy()

    const flexItems = ctx.shadowRoot.querySelectorAll('.flex-item')
    expect(flexItems.length).toBe(4)
  })

  it('contains animation keyframes', async () => {
    const html = loadFixture('styled-components.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const styles = ctx.shadowRoot.querySelectorAll('style')
    const allStyleContent = Array.from(styles).map((s) => s.textContent).join('')
    expect(allStyleContent).toContain('@keyframes fadeIn')
    expect(allStyleContent).toContain('@keyframes pulse')
  })
})
