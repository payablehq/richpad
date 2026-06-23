// ─── Components ──────────────────────────────────────────────────────────────
export { RichPad } from './components/RichPad';

// ─── Hooks ───────────────────────────────────────────────────────────────────
export { useRichPad } from './core/useRichPad';

// ─── Context ─────────────────────────────────────────────────────────────────
export { RichPadContextProvider, useRichPadContext } from './core/RichPadProvider';

// ─── Extensions ──────────────────────────────────────────────────────────────
export { createDefaultExtensions, createMinimalExtensions } from './extensions';

// ─── Types ───────────────────────────────────────────────────────────────────
export type {
  RichPadProps,
  RichPadRef,
  OutputFormat,
  ThemeMode,
  ThemeConfig,
  ToolbarConfig,
  ToolbarItemType,
  ToolbarItem,
  ToolbarGroup,
  MentionItem,
  MentionProvider,
  SlashCommandItem,
  ImageUploadHandler,
  RichPadContextValue,
} from './core/types';

// ─── Utilities ───────────────────────────────────────────────────────────────
export { toHTML, toJSON, toText, toMarkdown, fromHTML, fromJSON } from './utils/serialization';
export { sanitizeHTML, isSafeUrl } from './utils/sanitization';
export { formatShortcut, getModLabel, getAltLabel, getShiftLabel } from './utils/keyboard';
export { cn } from './utils/cn';

// ─── Constants ───────────────────────────────────────────────────────────────
export { KEYBOARD_SHORTCUTS, DEFAULT_TOOLBAR_GROUPS, DEFAULT_PLACEHOLDER } from './core/constants';

// ─── Sub-components (for headless usage) ─────────────────────────────────────
export { Toolbar } from './components/Toolbar/Toolbar';
export { BottomToolbar } from './components/Toolbar/BottomToolbar';
export { ToolbarButton } from './components/Toolbar/ToolbarButton';
export { ToolbarGroup as ToolbarGroupComponent } from './components/Toolbar/ToolbarGroup';
export { ToolbarDivider } from './components/Toolbar/ToolbarDivider';
export { ToolbarDropdown } from './components/Toolbar/ToolbarDropdown';
export { BubbleToolbar } from './components/BubbleToolbar/BubbleToolbar';
export { LinkEditor } from './components/LinkEditor/LinkEditor';
export { SlashMenu, DEFAULT_SLASH_COMMANDS } from './components/SlashMenu/SlashMenu';
export { MentionList } from './components/MentionList/MentionList';
export { Tooltip } from './components/common/Tooltip';
