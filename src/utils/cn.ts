/**
 * Merge CSS class names, filtering out falsy values.
 *
 * @example
 * cn('btn', isActive && 'btn--active', className)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
