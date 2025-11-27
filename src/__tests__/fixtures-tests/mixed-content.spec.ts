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
 * mixed-content.html Fixture Tests
 *
 * Tests for various HTML5 elements and data attributes:
 * - Sections with data-section-id
 * - Cards with data attributes
 * - Semantic elements
 * - Text formatting elements
 * - Form with fieldset and legend
 * - Select with options
 * - Definition list
 * - Table with data-row-id
 * - Tags with different classes
 */
describe('Fixture: mixed-content.html', () => {
  let ctx: ShadowTestContext

  beforeEach(() => {
    ctx = setupShadowTest()
  })

  afterEach(() => {
    teardownShadowTest(ctx.host)
  })

  it('renders sections with data-section-id attributes', async () => {
    const html = loadFixture('mixed-content.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    const sections = ctx.shadowRoot.querySelectorAll('[data-section-id]')
    expect(sections.length).toBe(5)

    expect(ctx.shadowRoot.querySelector('[data-section-id="data-attrs"]')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('[data-section-id="semantic"]')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('[data-section-id="forms"]')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('[data-section-id="lists"]')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('[data-section-id="table"]')).toBeTruthy()
  })

  it('renders cards with data attributes', async () => {
    const html = loadFixture('mixed-content.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const cards = ctx.shadowRoot.querySelectorAll('.card')
    expect(cards.length).toBe(3)

    const activeCard = ctx.shadowRoot.querySelector('[data-status="active"]')
    expect(activeCard).toBeTruthy()
    expect(activeCard?.getAttribute('data-id')).toBe('1')
    expect(activeCard?.getAttribute('data-category')).toBe('premium')

    const pendingCard = ctx.shadowRoot.querySelector('[data-status="pending"]')
    expect(pendingCard?.getAttribute('data-category')).toBe('standard')
  })

  it('renders semantic elements', async () => {
    const html = loadFixture('mixed-content.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    expect(ctx.shadowRoot.querySelector('article')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('article header')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('article footer')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('time')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('details')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('summary')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('figure')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('figcaption')).toBeTruthy()
  })

  it('renders text formatting elements', async () => {
    const html = loadFixture('mixed-content.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    expect(ctx.shadowRoot.querySelector('strong')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('em')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('mark')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('small')).toBeTruthy()
  })

  it('renders form with fieldset and legend', async () => {
    const html = loadFixture('mixed-content.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const form = ctx.shadowRoot.querySelector('#test-form')
    expect(form).toBeTruthy()
    expect(form?.getAttribute('data-form-type')).toBe('contact')

    const fieldset = ctx.shadowRoot.querySelector('fieldset')
    expect(fieldset).toBeTruthy()

    const legend = ctx.shadowRoot.querySelector('legend')
    expect(legend?.textContent).toBe('Contact Information')
  })

  it('renders select with options', async () => {
    const html = loadFixture('mixed-content.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const select = ctx.shadowRoot.querySelector('#priority') as HTMLSelectElement
    expect(select).toBeTruthy()
    expect(select?.options.length).toBe(3)

    // Check selected option
    const selectedOption = select?.querySelector('option[selected]')
    expect(selectedOption?.value).toBe('medium')
  })

  it('renders definition list', async () => {
    const html = loadFixture('mixed-content.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const dl = ctx.shadowRoot.querySelector('dl')
    expect(dl).toBeTruthy()

    const dts = ctx.shadowRoot.querySelectorAll('dt')
    expect(dts.length).toBe(2)
    expect(dts[0]?.textContent).toBe('HTML')
    expect(dts[1]?.textContent).toBe('CSS')

    const dds = ctx.shadowRoot.querySelectorAll('dd')
    expect(dds.length).toBe(2)
  })

  it('renders table with data-row-id attributes', async () => {
    const html = loadFixture('mixed-content.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const table = ctx.shadowRoot.querySelector('table')
    expect(table).toBeTruthy()

    const rowsWithDataId = ctx.shadowRoot.querySelectorAll('tr[data-row-id]')
    expect(rowsWithDataId.length).toBe(2)
    expect(rowsWithDataId[0]?.getAttribute('data-row-id')).toBe('1')
    expect(rowsWithDataId[1]?.getAttribute('data-row-id')).toBe('2')
  })

  it('renders tags with different classes', async () => {
    const html = loadFixture('mixed-content.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    expect(ctx.shadowRoot.querySelector('.tag-primary')).toBeTruthy()
    expect(ctx.shadowRoot.querySelector('.tag-secondary')).toBeTruthy()
  })
})
