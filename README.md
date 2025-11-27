# VueHTMLRenderer

A powerful and flexible Vue library for rendering arbitrary HTML content using Shadow DOM with complete style isolation and full script execution support. Compatible with Vue 2.7+ and Vue 3.

> **⚠️ SECURITY WARNING**  
> **This library does NOT sanitize or validate HTML content. If you render HTML containing malicious scripts, those scripts WILL execute. Always sanitize untrusted HTML content before passing it to this component.**

## 📋 Table of Contents

- [Overview](#overview)
- [Why Not iFrame?](#why-not-iframe)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Rendering Modes Comparison](#rendering-modes-comparison)
- [Examples](#examples)
- [Best Practices](#best-practices)
 - [Code Style](#code-style)
 - [Contributing](#-contributing)

---

## 🎯 Overview

This library provides a unified solution for rendering HTML content in Vue applications (Vue 2.7+ and Vue 3) with full control over rendering behavior. It addresses common challenges when working with dynamic HTML content, such as:

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
✅ **Seamless Integration**: Direct access to Vue context and reactivity  
✅ **Font Loading**: Automatic handling of @font-face declarations in Shadow DOM

---

## ✨ Features

- ✅ Complete style isolation using Shadow DOM
- ✅ Full script execution support (async, defer, sequential, module)
- ✅ Preserves full HTML structure (`<html>`, `<head>`, `<body>`)
- ✅ Automatic @font-face extraction and injection
- ✅ Browser-like script execution semantics
- ✅ CSS encapsulation (no style leakage)
- ✅ Vue Composition API (Vue 2.7+ and Vue 3)
- ✅ Full TypeScript support
- ✅ Comprehensive documentation
- ✅ Custom Element compatibility
- ✅ Clean lifecycle management
- ✅ Framework-agnostic utilities

---

## 🏗️ Architecture

The library is organized by responsibility for easy maintenance and potential library distribution:

```
vue-html-renderer/
├── src/
│   ├── App.vue                    # Demo app component (for local development)
│   ├── extras/
│   │   ├── types.ts               # TypeScript type definitions
│   │   └── utils.ts               # Shared utility functions
│   ├── composables/
│   │   └── useHtmlRenderer.ts     # Composable (internal use)
│   ├── renderers/
│   │   ├── shadowRenderer.ts      # Shadow DOM rendering orchestrator
│   │   └── directRenderer.ts      # Direct rendering with script execution
│   └── styles/                    # Font-face extraction utilities (SRP-focused)
│       ├── cssUtils.ts            # Pure CSS/text helpers (strip, imports, rebase URLs, base URL)
│       ├── fontFaceCollector.ts   # Recursively collect @font-face from <style>, @import, and <link>
│       └── fontInjector.ts        # Dedup and inject into <head> (#shadow-dom-fonts)
└── README.md                      # This file
```

### Design Principles

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **Type Safety**: Full TypeScript coverage with comprehensive type definitions
3. **Extensibility**: Easy to add new rendering modes or features
4. **Reusability**: Framework-agnostic utilities can be used outside Vue
5. **Documentation**: Every function and type is thoroughly documented

### Module Responsibilities (Robust Split)

- `renderers/shadowRenderer.ts`
  - Orchestrates Shadow DOM rendering
  - Parses HTML and delegates font work to style modules
  - Public API: `extractAndInjectFontFaces`, `renderIntoShadowRoot`, `clearShadowRoot`

- `styles/cssUtils.ts`
  - Pure functions for CSS manipulation and URL handling
  - `stripComments`, `extractFontFaceBlocks`, `createImportRegex`, `resolveUrl`, `rebaseUrls`, `getDocBaseUrl`

- `styles/fontFaceCollector.ts`
  - Recursively collects `@font-face` rules from:
    - Inline `<style>` blocks
    - `@import` chains (nested imports supported)
    - External stylesheets via `<link rel="stylesheet" href="…">` and preloaded styles (`rel="preload" as="style"`)
  - Deduplicates visited URLs and rebases relative `url()` sources

- `styles/fontInjector.ts`
  - Injects collected rules into a single `<style id="shadow-dom-fonts">` in `document.head`
  - Avoids duplicate rules by comparing against existing content

---

## 📦 Installation

```typescript
import HtmlRenderer from '@/components/htmlRenderer/HtmlRenderer.vue'
// or
import { useHtmlRenderer } from '@/components/htmlRenderer/composables/useHtmlRenderer'
```

### As a Standalone Library (Future)

For distribution as a standalone npm package:

```bash
npm install @your-org/html-renderer
# or
yarn add @your-org/html-renderer
```

---

## 🚀 Usage

### Basic Component Usage

```vue
<template>
  <HtmlRenderer :html="htmlContent" />
</template>

<script setup lang="ts">
import HtmlRenderer from '@/components/htmlRenderer/HtmlRenderer.vue'

const htmlContent = `
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
`
</script>
```

### Composable Usage

```vue
<template>
  <div ref="hostRef"></div>
</template>

<script setup lang="ts">
import { useHtmlRenderer } from '@/components/htmlRenderer/composables/useHtmlRenderer'

const { hostRef, clear, shadowRoot } = useHtmlRenderer({
  html: '<div>Content</div>',
})

// Manually clear content if needed
// clear();
</script>
```

#### Async font loading: `@import` and external `<link rel="stylesheet">`

Font rules referenced via CSS `@import` are fetched asynchronously and recursively resolved. In addition, external stylesheets linked with `<link rel="stylesheet" href="…">` inside the provided HTML are fetched and scanned for `@font-face` declarations as well. Relative `url()` sources in collected font rules are rebased to absolute URLs based on the stylesheet URL.

When you use the `HtmlRenderer` component or the `useHtmlRenderer` composable, this is handled automatically. If you directly call the lower-level renderer, remember it is async:

```ts
import { renderIntoShadowRoot } from './src/renderers/shadowRenderer'

const host = document.createElement('div')
const shadow = host.attachShadow({ mode: 'open' })
await renderIntoShadowRoot(shadow, '<html><head><style>@import url("https://cdn.example.com/fonts.css");</style></head><body>Hi</body></html>')
```

You can also rely on linked stylesheets in the HTML you render:

```html
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.example.com/site-styles.css" />
  </head>
  <body>Content</body>
  
</html>
```

Notes and caveats:
- External fetches must comply with CORS. If the remote server doesn’t allow cross-origin requests, stylesheets/fonts may not be retrievable by the extractor.
- Media queries on `<link media="…">` are respected; links that don’t match the current environment are skipped.
- Alternate stylesheets (`rel` containing `alternate`) and disabled links are skipped.

---

## 📚 API Reference

### Component: `HtmlRenderer`

#### Props

| Prop   | Type     | Required | Default | Description               |
| ------ | -------- | -------- | ------- | ------------------------- |
| `html` | `string` | Yes      | -       | The HTML string to render |

#### Example

```vue
<HtmlRenderer :html="myHtmlString" />
```

---

### Composable: `useHtmlRenderer`

#### Parameters

```typescript
interface IHtmlRendererOptions {
  html: string // The HTML string to render
}
```

#### Returns

```typescript
interface IHtmlRendererComposable {
  hostRef: Ref<HTMLElement | undefined> // Template ref for the host element
  clear: () => void // Function to clear rendered content
  shadowRoot: Ref<ShadowRoot | undefined> // Shadow root ref
}
```

#### Example

```typescript
const { hostRef, clear, shadowRoot } = useHtmlRenderer({
  html: '<div>Content</div>',
})
```

---

### Utility Functions

#### From `utils.ts`

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

---

### Type Definitions

See `types.ts` for complete type definitions:

- `IHtmlRendererOptions`
- `IHtmlRendererComposable`
- `IHtmlRendererProps`
- `IScriptMeta`
- `IFontFaceExtractionOptions`

---

## 💡 Examples

### Example 1: Rendering a Styled Coupon

```vue
<template>
  <HtmlRenderer :html="couponHtml" />
</template>

<script setup lang="ts">
import HtmlRenderer from '@/components/htmlRenderer/HtmlRenderer.vue'

const couponHtml = `
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
`
</script>
```

### Example 2: Interactive Widget with Scripts

```vue
<template>
  <HtmlRenderer :html="widgetHtml" />
</template>

<script setup lang="ts">
import HtmlRenderer from '@/components/htmlRenderer/HtmlRenderer.vue';

const widgetHtml = `
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
`;
</script>
```

### Example 3: Loading External Scripts

```vue
<template>
  <HtmlRenderer :html="scriptHtml" />
</template>

<script setup lang="ts">
const scriptHtml = `
  <div id="map"></div>
  <script src="https://cdn.example.com/map-library.js" defer></script>
  <script defer>
    // This runs after map-library.js loads
    initMap('map');
  </script>
`;
</script>
```

---

## 🎯 Best Practices

### Security

1. **Always sanitize untrusted HTML** before rendering
2. **Validate external script sources** before including them
3. **Be cautious with inline event handlers** (`onclick`, etc.)
4. **Review scripts** in HTML content from external sources

### Performance

1. **Avoid re-rendering** - The component renders once on mount
2. **Use keys** if you need to force re-rendering with different content
3. **Minimize HTML size** for faster parsing
4. **Consider lazy loading** for heavy content

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

Note: The library code has been updated to follow this guideline everywhere.

---

## 🤝 Contributing

When contributing to this library, please follow these guidelines:

1. **Maintain separation of concerns**: Keep renderers, composables, and utilities separate
2. **Document everything**: All functions, types, and modules should have JSDoc comments
3. **Write tests**: Add tests for new features or bug fixes
4. **Follow TypeScript best practices**: Use strict typing, avoid `any`
5. **Update this README**: Keep documentation in sync with code changes

---

## 📄 License

Free to use.

---

## 🙏 Acknowledgments

This library was built to solve real-world challenges in rendering dynamic HTML content in Vue applications (Vue 2.7+ and Vue 3), specifically for rendering formatted documents like coupons and vouchers with proper style isolation and font loading.

---

**Built with ❤️ for Vue developers (Vue 2.7+ and Vue 3) who need powerful HTML rendering capabilities.**
