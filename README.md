# Shadow HTML Renderer

A powerful and flexible framework-agnostic library for rendering HTML content into Shadow DOM with complete style isolation and full script execution support. Works with any JavaScript framework (React, Vue, Angular, Svelte, etc.) or vanilla JavaScript.

> **⚠️ SECURITY WARNING**  
> **This library does NOT sanitize or validate HTML content. If you render HTML containing malicious scripts, those scripts WILL execute. Always sanitize untrusted HTML content before passing it to this library.**

## 📋 Table of Contents

- [Overview](#overview)
- [Why Not iFrame?](#why-not-iframe)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Code Style](#code-style)
- [Contributing](#-contributing)

---

## 🎯 Overview

This library provides a unified solution for rendering HTML content in any JavaScript application with full control over rendering behavior. It addresses common challenges when working with dynamic HTML content, such as:

- **Script Execution**: Execute embedded JavaScript with proper browser-like semantics
- **Style Isolation**: Prevent CSS conflicts using Shadow DOM
- **Font Loading**: Proper @font-face handling in Shadow DOM, including resolving `@import` CSS files recursively and fetching linked stylesheets via `<link rel="stylesheet" href="…">`
- **HTML Structure Preservation**: Maintain complete HTML structure including `<html>`, `<head>`, and `<body>` tags

## 🚫 Why Not iFrame?

You might wonder: "Why not just use an `<iframe>`?" Here are the key reasons:

### Problems with iFrame:

1. **Manual Size Management**
   - iFrames require explicit width and height
   - Content doesn't naturally flow with the parent layout
   - Responsive sizing requires complex JavaScript solutions

2. **Complex Security Configuration**
   - Sandbox flags must be manually configured
   - Easy to misconfigure and create security vulnerabilities
   - Different browsers have different default behaviors

3. **Communication Overhead**
   - Parent-child communication requires postMessage API
   - Complex bidirectional data flow
   - Difficult to share state or context

4. **Performance Impact**
   - Each iframe creates a complete browser context
   - Higher memory usage
   - Slower initial load times

5. **SEO and Accessibility Issues**
   - Search engines may not index iframe content properly
   - Screen readers may have difficulty navigating
   - URL management is more complex

### Advantages of This Library:

✅ **Automatic Layout Integration**: Content flows naturally with the parent document  
✅ **Smart Script Handling**: Controlled execution with proper async/defer/sequential semantics  
✅ **Efficient Style Isolation**: Shadow DOM provides isolation without the overhead  
✅ **Better Performance**: Lower memory footprint, faster rendering  
✅ **Framework Agnostic**: Works with any JavaScript framework or vanilla JS  
✅ **Font Loading**: Automatic handling of @font-face declarations in Shadow DOM

---

## ✨ Features

- ✅ Complete style isolation using Shadow DOM
- ✅ Full script execution support (async, defer, sequential, module)
- ✅ Preserves full HTML structure (`<html>`, `<head>`, `<body>`)
- ✅ Automatic @font-face extraction and injection
- ✅ Browser-like script execution semantics
- ✅ CSS encapsulation (no style leakage)
- ✅ Framework agnostic (works with React, Vue, Angular, Svelte, vanilla JS)
- ✅ Full TypeScript support
- ✅ Comprehensive documentation
- ✅ Zero dependencies
- ✅ Clean lifecycle management

---

## 🏗️ Architecture

The library is organized by responsibility for easy maintenance:

```
shadow-html-renderer/
├── src/
│   ├── main.ts                    # Library entry point with exports
│   ├── extras/
│   │   ├── types.ts               # TypeScript type definitions
│   │   └── utils.ts               # Shared utility functions
│   ├── renderers/
│   │   ├── shadowRenderer.ts      # Shadow DOM rendering orchestrator
│   │   └── directRenderer.ts      # Direct rendering with script execution
│   └── styles/                    # Font-face extraction utilities
│       ├── cssUtils.ts            # Pure CSS/text helpers
│       ├── fontFaceCollector.ts   # Recursively collect @font-face rules
│       └── fontInjector.ts        # Inject fonts into document head
└── README.md                      # This file
```

### Design Principles

1. **Framework Agnostic**: No dependencies on any JavaScript framework
2. **Separation of Concerns**: Each module has a single, well-defined responsibility
3. **Type Safety**: Full TypeScript coverage with comprehensive type definitions
4. **Zero Dependencies**: Pure JavaScript/TypeScript with no external dependencies
5. **Documentation**: Every function and type is thoroughly documented

### Module Responsibilities

- `renderers/shadowRenderer.ts`
  - Orchestrates Shadow DOM rendering
  - Parses HTML and delegates font work to style modules
  - Public API: `extractAndInjectFontFaces`, `renderIntoShadowRoot`, `clearShadowRoot`

- `renderers/directRenderer.ts`
  - Direct DOM rendering with script execution
  - Public API: `renderDirectly`, `clearElement`, `extractScriptsWithPlaceholders`, `createExecutableScript`, `insertScriptAtPlaceholder`

- `styles/cssUtils.ts`
  - Pure functions for CSS manipulation and URL handling
  - `stripComments`, `extractFontFaceBlocks`, `createImportRegex`, `resolveUrl`, `rebaseUrls`, `getDocBaseUrl`

- `styles/fontFaceCollector.ts`
  - Recursively collects `@font-face` rules from inline styles, `@import` chains, and external stylesheets

- `styles/fontInjector.ts`
  - Injects collected rules into a single `<style id="shadow-dom-fonts">` in `document.head`

---

## 📦 Installation

```bash
npm install shadow-html-renderer
# or
yarn add shadow-html-renderer
# or
pnpm add shadow-html-renderer
```

---

## 🚀 Usage

### Basic Usage (Vanilla JavaScript)

```typescript
import { renderIntoShadowRoot, clearShadowRoot } from 'shadow-html-renderer';

// Create a host element
const host = document.createElement('div');
document.body.appendChild(host);

// Attach shadow root
const shadowRoot = host.attachShadow({ mode: 'open' });

// Render HTML into shadow root
await renderIntoShadowRoot(shadowRoot, `
  <!doctype html>
  <html>
    <head>
      <style>
        body { background: #f0f0f0; font-family: Arial; }
        h1 { color: blue; }
      </style>
    </head>
    <body>
      <h1>Hello World</h1>
      <p>Styles are isolated and won't affect the parent document!</p>
      <script>
        console.log('Scripts execute with full support!');
      </script>
    </body>
  </html>
`);

// Clear content when needed
clearShadowRoot(shadowRoot);
```

### Usage with React

```tsx
import { useEffect, useRef } from 'react';
import { renderIntoShadowRoot, clearShadowRoot } from 'shadow-html-renderer';

function HtmlRenderer({ html }: { html: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    // Attach shadow root on mount
    if (!shadowRootRef.current) {
      shadowRootRef.current = hostRef.current.attachShadow({ mode: 'open' });
    }

    // Render HTML
    renderIntoShadowRoot(shadowRootRef.current, html);

    // Cleanup on unmount
    return () => {
      if (shadowRootRef.current) {
        clearShadowRoot(shadowRootRef.current);
      }
    };
  }, [html]);

  return <div ref={hostRef} />;
}
```

### Usage with Vue

```vue
<template>
  <div ref="hostRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { renderIntoShadowRoot, clearShadowRoot } from 'shadow-html-renderer';

const props = defineProps<{ html: string }>();

const hostRef = ref<HTMLElement>();
let shadowRoot: ShadowRoot | null = null;

onMounted(async () => {
  if (!hostRef.value) return;
  
  shadowRoot = hostRef.value.attachShadow({ mode: 'open' });
  await renderIntoShadowRoot(shadowRoot, props.html);
});

onBeforeUnmount(() => {
  if (shadowRoot) {
    clearShadowRoot(shadowRoot);
  }
});
</script>
```

### Usage with Angular

```typescript
import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { renderIntoShadowRoot, clearShadowRoot } from 'shadow-html-renderer';

@Component({
  selector: 'app-html-renderer',
  template: '<div #host></div>'
})
export class HtmlRendererComponent implements OnInit, OnDestroy {
  @Input() html: string = '';
  @ViewChild('host', { static: true }) hostRef!: ElementRef<HTMLDivElement>;
  
  private shadowRoot: ShadowRoot | null = null;

  async ngOnInit() {
    this.shadowRoot = this.hostRef.nativeElement.attachShadow({ mode: 'open' });
    await renderIntoShadowRoot(this.shadowRoot, this.html);
  }

  ngOnDestroy() {
    if (this.shadowRoot) {
      clearShadowRoot(this.shadowRoot);
    }
  }
}
```

### Direct Rendering (Without Shadow DOM)

If you don't need style isolation, you can use direct rendering:

```typescript
import { renderDirectly, clearElement } from 'shadow-html-renderer';

const container = document.getElementById('content');

// Render HTML directly into element
await renderDirectly(container, '<div><h1>Hello</h1><script>console.log("Hi")</script></div>');

// Clear when needed
clearElement(container);
```

---

## 📚 API Reference

### Shadow Renderer

#### `renderIntoShadowRoot(shadowRoot, html)`

Renders HTML content into a Shadow Root with style isolation and script execution.

| Parameter | Type | Description |
|-----------|------|-------------|
| `shadowRoot` | `ShadowRoot` | The shadow root to render into |
| `html` | `string` | The HTML string to render |

Returns: `Promise<void>`

#### `clearShadowRoot(shadowRoot)`

Clears all content from a shadow root.

| Parameter | Type | Description |
|-----------|------|-------------|
| `shadowRoot` | `ShadowRoot` | The shadow root to clear |

#### `extractAndInjectFontFaces(doc, styleElementId?)`

Extracts @font-face rules from a document and injects them into the main document.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `doc` | `Document` | - | The parsed document containing style elements |
| `styleElementId` | `string` | `"shadow-dom-fonts"` | ID for the injected style element |

Returns: `Promise<void>`

### Direct Renderer

#### `renderDirectly(target, html)`

Renders HTML content directly into an element with script execution but without style isolation.

| Parameter | Type | Description |
|-----------|------|-------------|
| `target` | `HTMLElement` | The target element to render into |
| `html` | `string` | The HTML string to render |

Returns: `Promise<void>`

#### `clearElement(target)`

Clears all children from a target element.

| Parameter | Type | Description |
|-----------|------|-------------|
| `target` | `HTMLElement` | The element to clear |

### Utility Functions

```typescript
// Generate a unique ID
function uid(): string

// Normalize HTML (handle escaping/encoding)
function normalizeHtml(raw: string): string

// Normalize attribute values
function normalizeAttr(val: string): string

// Find placeholder comment node
function findPlaceholderNode(root: ParentNode, id: string): Comment | null
```

### Type Definitions

```typescript
interface IHtmlRendererOptions {
  html: string;
}

interface IScriptMeta {
  id: string;
  attrs: Record<string, string>;
  code: string | null;
  hasSrc: boolean;
  isAsync: boolean;
  isDefer: boolean;
  isModule: boolean;
}

interface IFontFaceExtractionOptions {
  styleElementId?: string;
  preventDuplicates?: boolean;
}
```

---

## 💡 Examples

### Example 1: Rendering a Styled Coupon

```typescript
import { renderIntoShadowRoot } from 'shadow-html-renderer';

const host = document.createElement('div');
document.body.appendChild(host);
const shadowRoot = host.attachShadow({ mode: 'open' });

await renderIntoShadowRoot(shadowRoot, `
  <!doctype html>
  <html>
    <head>
      <style>
        @font-face {
          font-family: 'CustomFont';
          src: url('https://example.com/font.woff2') format('woff2');
        }
        body {
          font-family: 'CustomFont', sans-serif;
          background: white;
          width: 18cm;
          height: 26.7cm;
        }
        .coupon-title {
          font-size: 24pt;
          color: #333;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="coupon-title">$50 Gift Certificate</div>
      <p>Valid until: 2025-12-31</p>
    </body>
  </html>
`);
```

### Example 2: Interactive Widget with Scripts

```typescript
import { renderIntoShadowRoot } from 'shadow-html-renderer';

const host = document.createElement('div');
document.body.appendChild(host);
const shadowRoot = host.attachShadow({ mode: 'open' });

await renderIntoShadowRoot(shadowRoot, `
  <div id="widget">
    <button id="clickMe">Click Me</button>
    <span id="counter">0</span>
  </div>
  <script>
    let count = 0;
    document.getElementById('clickMe').addEventListener('click', () => {
      count++;
      document.getElementById('counter').textContent = count;
    });
  </script>
`);
```

### Example 3: Loading External Scripts

```typescript
import { renderIntoShadowRoot } from 'shadow-html-renderer';

const host = document.createElement('div');
document.body.appendChild(host);
const shadowRoot = host.attachShadow({ mode: 'open' });

await renderIntoShadowRoot(shadowRoot, `
  <div id="map"></div>
  <script src="https://cdn.example.com/map-library.js" defer></script>
  <script defer>
    // This runs after map-library.js loads
    initMap('map');
  </script>
`);
```

---

## 🎯 Best Practices

### Security

1. **Always sanitize untrusted HTML** before rendering
2. **Validate external script sources** before including them
3. **Be cautious with inline event handlers** (`onclick`, etc.)
4. **Review scripts** in HTML content from external sources

### Performance

1. **Avoid re-rendering** - The renderer is optimized for single renders
2. **Minimize HTML size** for faster parsing
3. **Consider lazy loading** for heavy content

### Styling

1. **Include all styles in the HTML string** - they are isolated and won't leak to the parent document
2. **Use @font-face declarations** - they are automatically extracted and injected into the main document
3. **Take advantage of style isolation** - parent document styles won't affect rendered content
4. **Test font loading** - fonts are automatically injected into the main document

### Script Execution

1. **Understand execution order**: Sequential → Async (fire-and-forget) → Defer
2. **Use `defer`** for scripts that need DOM to be ready
3. **Use `async`** for independent scripts
4. **Module scripts** (`type="module"`) are always deferred by default

---

## 🧑‍💻 Code Style

To ensure readability and prevent subtle bugs, this project mandates using braces on all control statements.

- Always use braces for `if`, `else`, `else if`, `for`, `while`, and `do...while` blocks — even for single statements.
- This rule is enforced via ESLint: `curly: ['error', 'all']`.

Example:

```ts
// ✅ Correct
if (condition) {
  doSomething()
}

// ❌ Incorrect
// if (condition) doSomething()
```

---

## 🤝 Contributing

When contributing to this library, please follow these guidelines:

1. **Maintain separation of concerns**: Keep renderers and utilities separate
2. **Document everything**: All functions, types, and modules should have JSDoc comments
3. **Write tests**: Add tests for new features or bug fixes
4. **Follow TypeScript best practices**: Use strict typing, avoid `any`
5. **Update this README**: Keep documentation in sync with code changes

---

## 📄 License

MIT License - Free to use.

---

## 🙏 Acknowledgments

This library was built to solve real-world challenges in rendering dynamic HTML content in JavaScript applications, specifically for rendering formatted documents like coupons and vouchers with proper style isolation and font loading.

---

**Built with ❤️ for developers who need powerful, framework-agnostic HTML rendering capabilities.**
