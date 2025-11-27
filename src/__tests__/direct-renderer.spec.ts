import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { clearElement, renderDirectly } from '../renderers/directRenderer'
import { waitFor } from './test-utils'

/**
 * Direct Renderer Tests
 *
 * Tests for direct DOM rendering (without Shadow DOM):
 * - Direct content rendering
 * - Element cleanup
 */
describe('Direct Renderer Tests', () => {
  let directTarget: HTMLElement

  beforeEach(() => {
    directTarget = document.createElement('div')
    document.body.appendChild(directTarget)
  })

  afterEach(() => {
    if (directTarget.parentNode) {
      directTarget.parentNode.removeChild(directTarget)
    }
  })

  it('renders content directly into element', async () => {
    const html = '<div><h1>Direct Render Test</h1><p>Content here</p></div>'
    await renderDirectly(directTarget, html)
    await waitFor(50)

    expect(directTarget.querySelector('h1')?.textContent).toBe('Direct Render Test')
    expect(directTarget.querySelector('p')?.textContent).toBe('Content here')
  })

  it('clears element correctly', async () => {
    const html = '<div><h1>Test</h1></div>'
    await renderDirectly(directTarget, html)
    await waitFor(50)

    expect(directTarget.children.length).toBeGreaterThan(0)

    clearElement(directTarget)
    expect(directTarget.children.length).toBe(0)
  })
})
