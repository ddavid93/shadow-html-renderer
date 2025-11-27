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
 * module-script.html Fixture Tests
 *
 * Tests for ES6 module script handling:
 * - Module result elements rendering
 * - Card component structure
 */
describe('Fixture: module-script.html', () => {
  let ctx: ShadowTestContext

  beforeEach(() => {
    ctx = setupShadowTest()
  })

  afterEach(() => {
    teardownShadowTest(ctx.host)
  })

  it('renders module result elements', async () => {
    const html = loadFixture('module-script.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    const moduleResult = ctx.shadowRoot.querySelector('#module-result')
    expect(moduleResult).toBeTruthy()
    expect(moduleResult?.classList.contains('result')).toBe(true)

    const exportResult = ctx.shadowRoot.querySelector('#export-result')
    expect(exportResult).toBeTruthy()

    const importResult = ctx.shadowRoot.querySelector('#import-result')
    expect(importResult).toBeTruthy()
  })

  it('has card component structure', async () => {
    const html = loadFixture('module-script.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const card = ctx.shadowRoot.querySelector('.card')
    expect(card).toBeTruthy()

    const h1 = ctx.shadowRoot.querySelector('h1')
    expect(h1?.textContent).toBe('ES6 Module Script Test')

    const h2 = ctx.shadowRoot.querySelector('h2')
    expect(h2?.textContent).toBe('Module Features')
  })
})
