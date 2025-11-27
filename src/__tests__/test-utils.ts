import { afterEach, beforeEach } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { clearShadowRoot } from '../renderers/shadowRenderer'

/**
 * Shared Test Utilities for Shadow HTML Renderer
 *
 * This module provides common utilities, setup, and teardown functions
 * for all test files in the test suite.
 */

// Helper to read fixture files
export function loadFixture(filename: string): string {
  const fixturesPath = resolve(__dirname, 'fixtures', filename)
  return readFileSync(fixturesPath, 'utf-8')
}

// Helper to wait for async operations
export async function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Helper to create a host element with shadow root
export function createShadowHost(): { host: HTMLElement; shadowRoot: ShadowRoot } {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const shadowRoot = host.attachShadow({ mode: 'open' })
  return { host, shadowRoot }
}

// Helper to cleanup host element
export function cleanupHost(host: HTMLElement): void {
  if (host.parentNode) {
    host.parentNode.removeChild(host)
  }
}

// Window properties that may be set by test scripts
export const WINDOW_PROPERTIES_TO_CLEAN = [
  '__simpleContentLoaded',
  '__inlineScriptExecuted',
  '__asyncScriptExecuted',
  '__deferScriptExecuted',
  '__regularScriptExecuted',
  '__moduleScriptExecuted',
  '__secondModuleExecuted',
  '__interactiveElementsLoaded',
  '__fullDocumentLoaded',
  '__styledComponentsLoaded',
  '__complexStylesLoaded',
  '__buttonClicked',
  '__formSubmitted',
  '__todosAdded',
  '__fontFaceLoaded',
  '__appliedFontFamily',
  '__nestedStructureLoaded',
  '__nestingLevels',
  '__tableStats',
  '__mixedContentLoaded',
  '__sectionCount',
  '__cardCount',
  '__formCount',
  '__tableCount',
  '__dataStatusElements',
  '__dataIdElements',
  '__sectionsWithDataId',
  '__moduleExports',
  '__scriptsExecutionOrder',
  '__executionOrder',
  '__deferScript2Executed',
  '__cardBackgroundColor',
  '__cardBorderRadius',
  '__styleElementCount',
  '__sectionBorderRadius',
  '__sectionBoxShadow',
  '__dynamicBoxBackground',
  '__statusActiveCount',
  '__nthChildItems',
]

// Clear all window properties set by test scripts
export function clearWindowProperties(): void {
  WINDOW_PROPERTIES_TO_CLEAN.forEach((prop) => {
    delete (window as any)[prop]
  })
}

// Clean up any injected font styles
export function cleanupFontStyles(): void {
  const fontStyle = document.getElementById('shadow-dom-fonts')
  if (fontStyle) {
    fontStyle.remove()
  }
}

// Setup context for shadow DOM tests
export interface ShadowTestContext {
  host: HTMLElement
  shadowRoot: ShadowRoot
}

// Create a reusable setup function for shadow DOM tests
export function setupShadowTest(): ShadowTestContext {
  clearWindowProperties()
  const result = createShadowHost()
  return {
    host: result.host,
    shadowRoot: result.shadowRoot,
  }
}

// Create a reusable teardown function for shadow DOM tests
export function teardownShadowTest(host: HTMLElement): void {
  cleanupFontStyles()
  cleanupHost(host)
}

// Use this in describe blocks for standard shadow DOM test setup
export function useShadowTestSetup(): { getContext: () => ShadowTestContext } {
  let context: ShadowTestContext

  beforeEach(() => {
    context = setupShadowTest()
  })

  afterEach(() => {
    teardownShadowTest(context.host)
  })

  return {
    getContext: () => context,
  }
}
