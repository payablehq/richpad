import { useState, useCallback, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Strikethrough,
  Link,
  Unlink,
  Check,
  X,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import './BottomToolbar.css';

// ─── Color palette ────────────────────────────────────────────────────────────

const COLORS = [
  { hex: '#172B4D', label: 'Navy' },
  { hex: '#0747A6', label: 'Blue' },
  { hex: '#008DA6', label: 'Teal' },
  { hex: '#00875A', label: 'Green' },
  { hex: '#FF991F', label: 'Orange' },
  { hex: '#DE350B', label: 'Red' },
  { hex: '#5243AA', label: 'Purple' },
  { hex: '#5E6C84', label: 'Gray' },
  { hex: '#2684FF', label: 'Blue (light)' },
  { hex: '#00C7E6', label: 'Cyan' },
  { hex: '#36B37E', label: 'Mint' },
  { hex: '#FFC400', label: 'Yellow' },
  { hex: '#FF5630', label: 'Coral' },
  { hex: '#6554C0', label: 'Violet' },
  { hex: '#FFFFFF', label: 'White' },
  { hex: '#B3D4FF', label: 'Sky' },
  { hex: '#79E2F2', label: 'Ice' },
  { hex: '#79F2C0', label: 'Seafoam' },
  { hex: '#FFF0B3', label: 'Cream' },
  { hex: '#FFBDAD', label: 'Blush' },
  { hex: '#EAE6FF', label: 'Lavender' },
];

const LIGHT_SWATCHES = new Set(['#FFFFFF', '#FFF0B3', '#EAE6FF', '#79E2F2', '#79F2C0', '#FFBDAD']);

// ─── usePopoverPosition ───────────────────────────────────────────────────────
// Given a trigger ref, returns { top, left } for a portal popover that opens
// upward, centered on the trigger button, using position: fixed.

function usePopoverPosition(
  anchorRef: React.RefObject<HTMLElement | null>,
  open: boolean,
) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    // We'll set top after render when we know the popover height,
    // but estimate upward from the button top edge.
    setPos({
      top: rect.top,   // will be refined by the popover itself
      left: rect.left + rect.width / 2,
    });
  }, [open, anchorRef]);

  return pos;
}

// ─── Color Popover ────────────────────────────────────────────────────────────

interface ColorPopoverProps {
  editor: Editor;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

function ColorPopover({ editor, anchorRef, onClose }: ColorPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const currentColor = editor.getAttributes('textStyle').color as string | undefined;
  const [style, setStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    visibility: 'hidden',
    zIndex: 9999,
  });

  // Calculate position after first paint so we know the popover height
  useLayoutEffect(() => {
    if (!anchorRef.current || !popoverRef.current) return;
    const anchor = anchorRef.current.getBoundingClientRect();
    const pop = popoverRef.current.getBoundingClientRect();
    const GAP = 8;

    const top = anchor.top - pop.height - GAP;
    const left = anchor.left + anchor.width / 2 - pop.width / 2;

    // Clamp horizontally so it doesn't go off-screen
    const clampedLeft = Math.max(8, Math.min(left, window.innerWidth - pop.width - 8));

    setStyle({
      position: 'fixed',
      top: `${top}px`,
      left: `${clampedLeft}px`,
      zIndex: 9999,
      visibility: 'visible',
    });
  }, [anchorRef]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current && !popoverRef.current.contains(target) &&
        anchorRef.current && !anchorRef.current.contains(target)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, anchorRef]);

  return createPortal(
    <div
      className="rp-bottom-color-popover"
      ref={popoverRef}
      role="dialog"
      aria-label="Text color picker"
      style={style}
    >
      <div className="rp-bottom-color-popover__title">Text colour</div>
      <div className="rp-bottom-color-grid">
        {COLORS.map(({ hex, label }) => (
          <button
            key={hex}
            className="rp-bottom-color-swatch"
            style={{ background: hex }}
            onMouseDown={e => {
              e.preventDefault(); // prevent editor blur
              editor.chain().focus().setColor(hex).run();
              onClose();
            }}
            title={label}
            aria-label={`Set text colour to ${label}`}
          >
            {currentColor === hex && (
              <Check size={12} color={LIGHT_SWATCHES.has(hex) ? '#000' : '#fff'} />
            )}
          </button>
        ))}
      </div>
      <button
        className="rp-bottom-color-remove"
        onMouseDown={e => {
          e.preventDefault();
          editor.chain().focus().unsetColor().run();
          onClose();
        }}
      >
        Remove colour
      </button>
    </div>,
    document.body,
  );
}

// ─── Link Popover ─────────────────────────────────────────────────────────────

interface LinkPopoverProps {
  editor: Editor;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

function LinkPopover({ editor, anchorRef, onClose }: LinkPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const existingHref = editor.getAttributes('link').href as string | undefined;
  const [url, setUrl] = useState(existingHref ?? '');
  const [style, setStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    visibility: 'hidden',
    zIndex: 9999,
  });

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  // Calculate position after first paint
  useLayoutEffect(() => {
    if (!anchorRef.current || !popoverRef.current) return;
    const anchor = anchorRef.current.getBoundingClientRect();
    const pop = popoverRef.current.getBoundingClientRect();
    const GAP = 8;

    const top = anchor.top - pop.height - GAP;
    const left = anchor.left + anchor.width / 2 - pop.width / 2;
    const clampedLeft = Math.max(8, Math.min(left, window.innerWidth - pop.width - 8));

    setStyle({
      position: 'fixed',
      top: `${top}px`,
      left: `${clampedLeft}px`,
      zIndex: 9999,
      visibility: 'visible',
    });
  }, [anchorRef]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current && !popoverRef.current.contains(target) &&
        anchorRef.current && !anchorRef.current.contains(target)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, anchorRef]);

  const applyLink = useCallback(() => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const finalUrl = /^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    editor.chain().focus().setLink({ href: finalUrl }).run();
    onClose();
  }, [url, editor, onClose]);

  const removeLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
    onClose();
  }, [editor, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  }, [applyLink, onClose]);

  return createPortal(
    <div
      className="rp-bottom-link-popover"
      ref={popoverRef}
      role="dialog"
      aria-label="Link editor"
      style={style}
    >
      <div className="rp-bottom-link-popover__row">
        <input
          ref={inputRef}
          type="url"
          className="rp-bottom-link-popover__input"
          placeholder="Paste or type a link…"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="URL"
        />
        <button
          className="rp-bottom-link-popover__btn rp-bottom-link-popover__btn--confirm"
          onMouseDown={e => { e.preventDefault(); applyLink(); }}
          disabled={!url.trim()}
          aria-label="Apply link"
        >
          <Check size={14} />
        </button>
        <button
          className="rp-bottom-link-popover__btn rp-bottom-link-popover__btn--cancel"
          onMouseDown={e => { e.preventDefault(); onClose(); }}
          aria-label="Cancel"
        >
          <X size={14} />
        </button>
        {existingHref && (
          <button
            className="rp-bottom-link-popover__btn rp-bottom-link-popover__btn--remove"
            onMouseDown={e => { e.preventDefault(); removeLink(); }}
            aria-label="Remove link"
          >
            <Unlink size={14} />
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}

// ─── Bottom Toolbar ───────────────────────────────────────────────────────────

interface BottomToolbarProps {
  editor: Editor;
}

export function BottomToolbar({ editor }: BottomToolbarProps) {
  const [showColor, setShowColor] = useState(false);
  const [showLink, setShowLink] = useState(false);

  // Refs pointing directly at the trigger buttons (for getBoundingClientRect)
  const colorBtnRef = useRef<HTMLButtonElement>(null);
  const linkBtnRef = useRef<HTMLButtonElement>(null);

  // Force re-render on editor state changes
  const [, forceUpdate] = useState({});
  useEffect(() => {
    if (!editor) return;
    const update = () => forceUpdate({});
    editor.on('transaction', update);
    editor.on('selectionUpdate', update);
    editor.on('update', update);
    editor.on('focus', update);
    return () => {
      editor.off('transaction', update);
      editor.off('selectionUpdate', update);
      editor.off('update', update);
      editor.off('focus', update);
    };
  }, [editor]);

  const isBold = editor.isActive('bold');
  const isItalic = editor.isActive('italic');
  const isStrike = editor.isActive('strike');
  const isLink = editor.isActive('link');
  const currentColor = editor.getAttributes('textStyle').color as string | undefined;

  const handleLinkClick = useCallback(() => {
    setShowColor(false);
    setShowLink(v => !v);
  }, []);

  const handleColorClick = useCallback(() => {
    setShowLink(false);
    setShowColor(v => !v);
  }, []);

  return (
    <div
      className="rp-bottom-toolbar"
      role="toolbar"
      aria-label="Bottom formatting toolbar"
    >
      {/* Bold */}
      <button
        id="rp-bottom-btn-bold"
        className={cn('rp-bottom-toolbar-btn', isBold && 'rp-bottom-toolbar-btn--active')}
        onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        title="Bold (⌘B)"
        aria-pressed={isBold}
        aria-label="Bold"
      >
        <Bold size={15} />
      </button>

      {/* Italic */}
      <button
        id="rp-bottom-btn-italic"
        className={cn('rp-bottom-toolbar-btn', isItalic && 'rp-bottom-toolbar-btn--active')}
        onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        title="Italic (⌘I)"
        aria-pressed={isItalic}
        aria-label="Italic"
      >
        <Italic size={15} />
      </button>

      {/* Strikethrough */}
      <button
        id="rp-bottom-btn-strikethrough"
        className={cn('rp-bottom-toolbar-btn', isStrike && 'rp-bottom-toolbar-btn--active')}
        onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
        title="Strikethrough"
        aria-pressed={isStrike}
        aria-label="Strikethrough"
      >
        <Strikethrough size={15} />
      </button>

      <div className="rp-bottom-toolbar-divider" role="separator" />

      {/* Text Color */}
      <button
        id="rp-bottom-btn-color"
        ref={colorBtnRef}
        className={cn(
          'rp-bottom-toolbar-btn',
          'rp-bottom-toolbar-color-btn',
          showColor && 'rp-bottom-toolbar-btn--active',
        )}
        onMouseDown={e => { e.preventDefault(); handleColorClick(); }}
        title="Text colour"
        aria-expanded={showColor}
        aria-haspopup="dialog"
        aria-label="Text colour"
      >
        A
        <span
          className="rp-bottom-toolbar-color-indicator"
          style={{ background: currentColor ?? 'currentColor' }}
        />
      </button>

      {showColor && (
        <ColorPopover
          editor={editor}
          anchorRef={colorBtnRef}
          onClose={() => setShowColor(false)}
        />
      )}

      <div className="rp-bottom-toolbar-divider" role="separator" />

      {/* Link */}
      <button
        id="rp-bottom-btn-link"
        ref={linkBtnRef}
        className={cn(
          'rp-bottom-toolbar-btn',
          (isLink || showLink) && 'rp-bottom-toolbar-btn--active',
        )}
        onMouseDown={e => { e.preventDefault(); handleLinkClick(); }}
        title={isLink ? 'Edit link' : 'Add link (⌘K)'}
        aria-expanded={showLink}
        aria-haspopup="dialog"
        aria-label={isLink ? 'Edit link' : 'Add link'}
      >
        <Link size={15} />
      </button>

      {showLink && (
        <LinkPopover
          editor={editor}
          anchorRef={linkBtnRef}
          onClose={() => setShowLink(false)}
        />
      )}

      <div className="rp-bottom-toolbar-spacer" />
    </div>
  );
}
