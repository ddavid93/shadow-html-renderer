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
 * interactive-elements.html Fixture Tests
 *
 * Tests for interactive form elements:
 * - Counter with buttons
 * - Contact form with all fields
 * - Theme select and radio buttons
 * - Todo list input
 */
describe('Fixture: interactive-elements.html', () => {
  let ctx: ShadowTestContext

  beforeEach(() => {
    ctx = setupShadowTest()
  })

  afterEach(() => {
    teardownShadowTest(ctx.host)
  })

  it('renders counter with buttons', async () => {
    const html = loadFixture('interactive-elements.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(100)

    const counter = ctx.shadowRoot.querySelector('#counter')
    expect(counter).toBeTruthy()
    expect(counter?.classList.contains('counter')).toBe(true)
    expect(counter?.textContent).toBe('0')

    const incrementBtn = ctx.shadowRoot.querySelector('#increment-btn')
    expect(incrementBtn).toBeTruthy()
    expect(incrementBtn?.textContent).toBe('Increment')

    const decrementBtn = ctx.shadowRoot.querySelector('#decrement-btn')
    expect(decrementBtn).toBeTruthy()

    const resetBtn = ctx.shadowRoot.querySelector('#reset-btn')
    expect(resetBtn).toBeTruthy()
  })

  it('renders contact form with all fields', async () => {
    const html = loadFixture('interactive-elements.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const form = ctx.shadowRoot.querySelector('#contact-form')
    expect(form).toBeTruthy()

    const nameInput = ctx.shadowRoot.querySelector('#name') as HTMLInputElement
    expect(nameInput).toBeTruthy()
    expect(nameInput?.type).toBe('text')
    expect(nameInput?.required).toBe(true)

    const emailInput = ctx.shadowRoot.querySelector('#email') as HTMLInputElement
    expect(emailInput).toBeTruthy()
    expect(emailInput?.type).toBe('email')

    const messageTextarea = ctx.shadowRoot.querySelector('#message')
    expect(messageTextarea).toBeTruthy()
    expect(messageTextarea?.tagName.toLowerCase()).toBe('textarea')
  })

  it('renders theme select and radio buttons', async () => {
    const html = loadFixture('interactive-elements.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const themeSelect = ctx.shadowRoot.querySelector('#theme') as HTMLSelectElement
    expect(themeSelect).toBeTruthy()
    expect(themeSelect?.options.length).toBe(3)

    const radioButtons = ctx.shadowRoot.querySelectorAll('input[name="notifications"]')
    expect(radioButtons.length).toBe(3)
  })

  it('renders todo list input', async () => {
    const html = loadFixture('interactive-elements.html')
    await renderIntoShadowRoot(ctx.shadowRoot, html)
    await waitFor(50)

    const todoInput = ctx.shadowRoot.querySelector('#todo-input')
    expect(todoInput).toBeTruthy()

    const addTodoBtn = ctx.shadowRoot.querySelector('#add-todo-btn')
    expect(addTodoBtn).toBeTruthy()

    const todoList = ctx.shadowRoot.querySelector('#todo-list')
    expect(todoList).toBeTruthy()
    expect(todoList?.tagName.toLowerCase()).toBe('ul')
  })
})
