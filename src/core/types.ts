import type { Editor, JSONContent } from '@tiptap/react';
import type { Extension } from '@tiptap/core';
import type { ReactNode } from 'react';

// ─── Output Format ───────────────────────────────────────────────────────────

export type OutputFormat = 'html' | 'json' | 'markdown' | 'text';

// ─── Theme ───────────────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark';

export interface ThemeConfig {
  /** Active theme mode */
  mode?: ThemeMode;
  /** Custom CSS class applied to the editor root */
  className?: string;
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

export type ToolbarItemType =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'code'
  | 'highlight'
  | 'heading'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'blockquote'
  | 'codeBlock'
  | 'horizontalRule'
  | 'link'
  | 'image'
  | 'table'
  | 'undo'
  | 'redo'
  | 'textAlign'
  | 'divider';

export interface ToolbarItem {
  type: ToolbarItemType;
  /** Override the default tooltip label */
  label?: string;
  /** Override the default icon */
  icon?: ReactNode;
  /** Whether this item is hidden */
  hidden?: boolean;
}

export type ToolbarGroup = ToolbarItem[];

export interface ToolbarConfig {
  /** Whether the toolbar is visible */
  enabled?: boolean;
  /** Toolbar item groups — items within a group are visually grouped, groups are separated by dividers */
  groups?: ToolbarGroup[];
  /** Whether to show the bubble (floating) toolbar on text selection */
  bubbleMenu?: boolean;
  /** Custom toolbar render function for full control */
  render?: (editor: Editor) => ReactNode;
}

// ─── Mention ─────────────────────────────────────────────────────────────────

export interface MentionItem {
  id: string;
  label: string;
  avatar?: string;
  description?: string;
  [key: string]: unknown;
}

export type MentionProvider = (query: string) => MentionItem[] | Promise<MentionItem[]>;

// ─── Slash Commands ──────────────────────────────────────────────────────────

export interface SlashCommandItem {
  title: string;
  description?: string;
  icon?: ReactNode;
  category?: string;
  aliases?: string[];
  action: (editor: Editor) => void;
}

// ─── Image Upload ────────────────────────────────────────────────────────────

export type ImageUploadHandler = (file: File) => Promise<string>;

// ─── Editor Props ────────────────────────────────────────────────────────────

export interface RichPadProps {
  /** Initial content — can be HTML string, JSON document, or Markdown string */
  content?: string | JSONContent;
  /** Callback fired on every content change */
  onChange?: (value: string | JSONContent) => void;
  /** Callback fired when editor loses focus */
  onBlur?: (value: string | JSONContent) => void;
  /** Callback fired when editor gains focus */
  onFocus?: () => void;
  /** Whether the editor is editable (true by default) */
  editable?: boolean;
  /** Whether the editor is in read-only mode (content visible, no editing affordances) */
  readOnly?: boolean;
  /** Whether the editor is disabled (reduced emphasis, no interaction) */
  disabled?: boolean;
  /** Placeholder text shown when editor is empty */
  placeholder?: string;
  /** Whether to autofocus the editor on mount */
  autofocus?: boolean | 'start' | 'end' | 'all';
  /** Additional CSS class for the root container */
  className?: string;
  /** Output format for onChange/onBlur callbacks */
  outputFormat?: OutputFormat;
  /** Theme configuration */
  theme?: ThemeConfig;
  /** Toolbar configuration — pass `false` to hide toolbar entirely */
  toolbar?: ToolbarConfig | false;
  /** Additional Tiptap extensions to register */
  extensions?: Extension[];
  /** Mention data provider */
  mentionProvider?: MentionProvider;
  /** Slash command items */
  slashCommands?: SlashCommandItem[] | false;
  /** Image upload handler */
  onImageUpload?: ImageUploadHandler;
  /** Minimum height of the editor content area */
  minHeight?: string | number;
  /** Maximum height of the editor content area (enables scroll) */
  maxHeight?: string | number;
  /** Unique ID for the editor instance */
  id?: string;
  /** Accessible label */
  ariaLabel?: string;
  /** Accessible description reference */
  ariaDescribedBy?: string;
  /** Which toolbar variant to render */
  toolbarVariant?: 'standard' | 'modern' | 'bottom';
}

// ─── Imperative Handle ───────────────────────────────────────────────────────

export interface RichPadRef {
  /** Get content as HTML string */
  getHTML: () => string;
  /** Get content as JSON document */
  getJSON: () => JSONContent;
  /** Get content as Markdown string */
  getMarkdown: () => string;
  /** Get content as plain text */
  getText: () => string;
  /** Set editor content from HTML, JSON, or Markdown */
  setContent: (content: string | JSONContent, emitUpdate?: boolean) => void;
  /** Clear all editor content */
  clearContent: (emitUpdate?: boolean) => void;
  /** Focus the editor */
  focus: (position?: 'start' | 'end' | 'all') => void;
  /** Blur the editor */
  blur: () => void;
  /** Check if the editor content is empty */
  isEmpty: () => boolean;
  /** Get the underlying Tiptap editor instance */
  getEditor: () => Editor | null;
}

// ─── Internal Context ────────────────────────────────────────────────────────

export interface RichPadContextValue {
  editor: Editor | null;
  editable: boolean;
  readOnly: boolean;
  disabled: boolean;
}
