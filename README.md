# @payablehq/richpad

> Enterprise-grade rich text editor component built with Tiptap, React, and TypeScript.

[![npm version](https://img.shields.io/npm/v/@payablehq/richpad)](https://www.npmjs.com/package/@payablehq/richpad)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**[📖 Live Demo & Docs →](https://payablehq.github.io/richpad)**

---

#### Full Editor Example
<img width="910" height="641" alt="image" src="https://github.com/user-attachments/assets/f72543d4-d3b2-4ef5-961e-6a7e54aa514b" />

#### Color Picker
<img width="912" height="239" alt="image" src="https://github.com/user-attachments/assets/d545aeec-e393-4aab-b3bf-d443c1655124" />

#### Inline Editor
<img width="905" height="313" alt="image" src="https://github.com/user-attachments/assets/51af77a1-b2ea-447a-acd5-99a81f6120fa" />

---

## Features

- ✅ **Batteries-included** — all dependencies bundled, only `react` + `react-dom` required
- 🎨 **3 toolbar variants** — `standard`, `modern`, `bottom`
- 🌙 **Dark mode** built-in
- 💬 **@Mentions** with custom data provider
- ⚡ **Slash commands** (`/heading`, `/code`, …)
- 📋 **Tables**, task lists, code blocks with syntax highlighting
- 🔗 **Links**, images, blockquotes, horizontal rules
- 💡 **Bubble toolbar** on text selection
- 📤 **Output formats** — HTML, JSON, Markdown, plain text
- ♿ **Accessible** — ARIA roles and keyboard navigation

---

## Installation

```bash
npm install @payablehq/richpad
# or
yarn add @payablehq/richpad
# or
pnpm add @payablehq/richpad
```

**Peer dependencies** (install separately):

```bash
npm install react react-dom
```

---

## Quick Start

```tsx
import { RichPad } from '@payablehq/richpad';
import '@payablehq/richpad/styles';

function MyEditor() {
  return (
    <RichPad
      placeholder="Start writing..."
      theme={{ mode: 'light' }}
      toolbarVariant="modern"   // 'standard' | 'modern' | 'bottom'
      onChange={(html) => console.log(html)}
      minHeight={200}
    />
  );
}
```

---

## Toolbar Variants

| Variant | Description |
|---|---|
| `standard` | Full-featured top toolbar (default) |
| `modern` | Compact modern-style top toolbar |
| `bottom` | Minimal bottom toolbar — ideal for comment inputs |

```tsx
// Comment / chat input
<RichPad toolbarVariant="bottom" placeholder="Add a comment..." />
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | `string \| JSONContent` | `""` | Initial content (HTML, JSON, or Markdown) |
| `onChange` | `(value) => void` | — | Fired on every change |
| `onBlur` | `(value) => void` | — | Fired when editor loses focus |
| `placeholder` | `string` | — | Placeholder text |
| `theme` | `{ mode: 'light' \| 'dark' }` | `{ mode: 'light' }` | Theme config |
| `toolbarVariant` | `'standard' \| 'modern' \| 'bottom'` | `'standard'` | Toolbar style |
| `toolbar` | `ToolbarConfig \| false` | — | Pass `false` to hide toolbar entirely |
| `minHeight` | `number \| string` | `120` | Min editor height |
| `maxHeight` | `number \| string` | — | Max height (enables scroll) |
| `outputFormat` | `'html' \| 'json' \| 'markdown' \| 'text'` | `'html'` | onChange/onBlur return format |
| `readOnly` | `boolean` | `false` | Read-only mode |
| `disabled` | `boolean` | `false` | Disabled mode |
| `extensions` | `Extension[]` | — | Extra Tiptap extensions |
| `mentionProvider` | `(query) => MentionItem[]` | — | @mention data provider |
| `slashCommands` | `SlashCommandItem[] \| false` | — | Custom slash commands |

---

## Imperative API

```tsx
import { useRef } from 'react';
import { RichPad, type RichPadRef } from '@payablehq/richpad';

function MyEditor() {
  const editorRef = useRef<RichPadRef>(null);

  return (
    <>
      <RichPad ref={editorRef} />
      <button onClick={() => console.log(editorRef.current?.getHTML())}>
        Get HTML
      </button>
      <button onClick={() => editorRef.current?.clearContent()}>
        Clear
      </button>
    </>
  );
}
```

Available ref methods: `getHTML()`, `getJSON()`, `getMarkdown()`, `getText()`, `setContent()`, `clearContent()`, `focus()`, `blur()`, `isEmpty()`, `getEditor()`

---

## Releasing a New Version

1. Bump the version in `package.json`
2. Push a git tag: `git tag v1.0.1 && git push origin v1.0.1`
3. The GitHub Actions workflow auto-publishes to npm

---

## Development

```bash
git clone https://github.com/payablehq/richpad
cd richpad
npm install

# Start dev server (demo app)
npm run dev

# Build library bundle
npm run build:lib

# Build demo site
npm run build:demo
```

---

## License

MIT © [Payable HQ](https://github.com/payablehq)
