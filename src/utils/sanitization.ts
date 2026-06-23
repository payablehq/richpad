import DOMPurify from 'dompurify';

// ─── Sanitization Config ─────────────────────────────────────────────────────

const ALLOWED_TAGS = [
  // Block elements
  'p', 'div', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'pre', 'code',
  // Lists
  'ul', 'ol', 'li',
  // Tables
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
  // Inline elements
  'a', 'strong', 'b', 'em', 'i', 'u', 's', 'del', 'strike',
  'sub', 'sup', 'mark', 'span',
  // Media
  'img',
  // Label
  'label', 'input',
];

const ALLOWED_ATTRS = [
  'href', 'target', 'rel', 'title', 'alt', 'src', 'width', 'height',
  'class', 'id', 'style', 'data-*',
  'colspan', 'rowspan', 'scope',
  'type', 'checked', 'disabled',
  // Tiptap data attributes
  'data-type', 'data-id', 'data-label', 'data-checked',
  'data-language',
  'contenteditable',
];

const ALLOWED_PROTOCOLS = ['http', 'https', 'mailto', 'tel'];

// ─── Sanitize HTML ───────────────────────────────────────────────────────────

/**
 * Sanitize HTML content using DOMPurify.
 * Removes XSS vectors, script tags, event handlers, and dangerous URIs.
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTRS,
    ALLOWED_URI_REGEXP: new RegExp(`^(?:${ALLOWED_PROTOCOLS.join('|')}):`, 'i'),
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  }) as string;
}

/**
 * Check if a URL is safe to use.
 */
export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_PROTOCOLS.includes(parsed.protocol.replace(':', ''));
  } catch {
    // Relative URLs are allowed
    return !url.startsWith('javascript:') && !url.startsWith('data:');
  }
}
