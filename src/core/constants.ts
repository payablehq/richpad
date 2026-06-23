import type { ToolbarGroup } from './types';

// ─── Platform Detection ──────────────────────────────────────────────────────

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

export const MOD_KEY = isMac ? '⌘' : 'Ctrl';
export const ALT_KEY = isMac ? '⌥' : 'Alt';
export const SHIFT_KEY = '⇧';

// ─── Keyboard Shortcuts ──────────────────────────────────────────────────────

export const KEYBOARD_SHORTCUTS: Record<string, string> = {
  bold: `${MOD_KEY}+B`,
  italic: `${MOD_KEY}+I`,
  underline: `${MOD_KEY}+U`,
  strikethrough: `${MOD_KEY}+${SHIFT_KEY}+X`,
  code: `${MOD_KEY}+E`,
  link: `${MOD_KEY}+K`,
  heading1: `${MOD_KEY}+${ALT_KEY}+1`,
  heading2: `${MOD_KEY}+${ALT_KEY}+2`,
  heading3: `${MOD_KEY}+${ALT_KEY}+3`,
  bulletList: `${MOD_KEY}+${SHIFT_KEY}+8`,
  orderedList: `${MOD_KEY}+${SHIFT_KEY}+7`,
  taskList: `${MOD_KEY}+${SHIFT_KEY}+9`,
  blockquote: `${MOD_KEY}+${SHIFT_KEY}+B`,
  codeBlock: `${MOD_KEY}+${ALT_KEY}+C`,
  horizontalRule: `${MOD_KEY}+${SHIFT_KEY}+H`,
  undo: `${MOD_KEY}+Z`,
  redo: `${MOD_KEY}+${SHIFT_KEY}+Z`,
};

// ─── Default Toolbar Groups ──────────────────────────────────────────────────

export const DEFAULT_TOOLBAR_GROUPS: ToolbarGroup[] = [
  // Text formatting
  [
    { type: 'bold' },
    { type: 'italic' },
    { type: 'underline' },
    { type: 'strikethrough' },
    { type: 'code' },
  ],
  // Block type
  [
    { type: 'heading' },
  ],
  // Lists
  [
    { type: 'bulletList' },
    { type: 'orderedList' },
    { type: 'taskList' },
  ],
  // Block elements
  [
    { type: 'blockquote' },
    { type: 'codeBlock' },
    { type: 'horizontalRule' },
  ],
  // Insert
  [
    { type: 'link' },
    { type: 'image' },
    { type: 'table' },
  ],
  // History
  [
    { type: 'undo' },
    { type: 'redo' },
  ],
];

// ─── Default Placeholder ─────────────────────────────────────────────────────

export const DEFAULT_PLACEHOLDER = "Type '/' for commands...";
