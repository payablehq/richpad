const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

/**
 * Get platform-aware modifier key label.
 */
export function getModLabel(): string {
  return isMac ? '⌘' : 'Ctrl';
}

export function getAltLabel(): string {
  return isMac ? '⌥' : 'Alt';
}

export function getShiftLabel(): string {
  return '⇧';
}

/**
 * Format a keyboard shortcut for display in tooltips.
 *
 * @example formatShortcut('Mod-b') => '⌘B' (Mac) or 'Ctrl+B' (Windows)
 */
export function formatShortcut(shortcut: string): string {
  return shortcut
    .replace('Mod', getModLabel())
    .replace('Alt', getAltLabel())
    .replace('Shift', getShiftLabel())
    .replace(/-/g, isMac ? '' : '+')
    .replace(/\b([a-z])\b/g, (_, c: string) => c.toUpperCase());
}

/**
 * Check if the current platform uses the Meta key as the primary modifier.
 */
export function usesMeta(): boolean {
  return isMac;
}
