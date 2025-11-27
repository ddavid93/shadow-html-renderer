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
 * nested-structure.html Fixture Tests
 *
 * Tests for nested DOM structures:
 * - Table with thead, tbody, tfoot
 * - Nested unordered lists
 * - Nested ordered lists
 * - Deeply nested divs
 * - Nested blockquotes
 * - Mixed nested structure
 */
describe('Fixture: nested-structure.html', () => {
  let ctx: ShadowTestContext

  beforeEach(() => {
    ctx = setupShadowTest()
  })

  afterEach(() => {
    teardownShadowTest(ctx.host)
  })

  it('renders table with thead, tbody, and tfoot', async () => {
    const html = loadFixture('nested-structure.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const table = ctx.shadowRoot.querySelector('table')
    expect(table).toBeTruthy()

    const thead = table?.querySelector('thead')
    expect(thead).toBeTruthy()
    expect(thead?.querySelectorAll('th').length).toBe(3)

    const tbody = table?.querySelector('tbody')
    expect(tbody).toBeTruthy()
    expect(tbody?.querySelectorAll('tr').length).toBe(3)

    const tfoot = table?.querySelector('tfoot')
    expect(tfoot).toBeTruthy()
    expect(tfoot?.querySelector('td')?.getAttribute('colspan')).toBe('3')
  })

  it('renders nested unordered lists 3 levels deep', async () => {
    const html = loadFixture('nested-structure.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const topUl = ctx.shadowRoot.querySelector('body > ul, html > body > ul, ul')
    expect(topUl).toBeTruthy()

    // Check for nested ul structure
    const nestedUl = ctx.shadowRoot.querySelector('ul ul ul')
    expect(nestedUl).toBeTruthy()

    const deepItems = nestedUl?.querySelectorAll('li')
    expect(deepItems?.length).toBe(2)
  })

  it('renders nested ordered lists', async () => {
    const html = loadFixture('nested-structure.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const nestedOl = ctx.shadowRoot.querySelector('ol ol ol')
    expect(nestedOl).toBeTruthy()

    const deepItems = nestedOl?.querySelectorAll('li')
    expect(deepItems?.length).toBe(2)
  })

  it('renders deeply nested divs (level-1 through level-4)', async () => {
    const html = loadFixture('nested-structure.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const level1 = ctx.shadowRoot.querySelectorAll('.level-1')
    expect(level1.length).toBe(2)

    const level2 = ctx.shadowRoot.querySelectorAll('.level-2')
    expect(level2.length).toBe(2)

    const level3 = ctx.shadowRoot.querySelector('.level-3')
    expect(level3).toBeTruthy()

    const level4 = ctx.shadowRoot.querySelector('.level-4')
    expect(level4).toBeTruthy()

    // Verify nesting
    const deepNested = ctx.shadowRoot.querySelector('.level-1 .level-2 .level-3 .level-4')
    expect(deepNested).toBeTruthy()
  })

  it('renders nested blockquotes', async () => {
    const html = loadFixture('nested-structure.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const nestedBlockquote = ctx.shadowRoot.querySelector('blockquote blockquote blockquote')
    expect(nestedBlockquote).toBeTruthy()
    expect(nestedBlockquote?.textContent).toContain('deeply nested quote')
  })

  it('renders mixed nested structure with table inside list', async () => {
    const html = loadFixture('nested-structure.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    // Find table inside a list item
    const tableInList = ctx.shadowRoot.querySelector('li .level-2 table')
    expect(tableInList).toBeTruthy()

    const cells = tableInList?.querySelectorAll('td')
    expect(cells?.length).toBe(2)
  })
})
