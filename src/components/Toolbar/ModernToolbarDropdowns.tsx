import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Editor } from '@tiptap/react';
import {
  ChevronDown,
  Check,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Subscript,
  Superscript,
  RemoveFormatting,
  List,
  ListOrdered,
  ListChecks,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Type,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import './ModernToolbarDropdown.css';

// ─── Base Dropdown Wrapper ───────────────────────────────────────────────────

interface DropdownWrapperProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

function DropdownWrapper({ trigger, children, isOpen, onClose, className }: DropdownWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', zIndex: isOpen ? 100 : undefined }}>
      {trigger}
      {isOpen && (
        <div 
          className={cn('rp-modern-dropdown-menu', className)} 
          style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', zIndex: 100 }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Block Type Dropdown ─────────────────────────────────────────────────────

interface ModernBlockTypeDropdownProps {
  editor: Editor;
}

export function ModernBlockTypeDropdown({ editor }: ModernBlockTypeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const blockTypes = [
    { label: 'Normal text', value: 'paragraph', icon: <Type size={16} />, shortcut: '⌘⌥0' },
    { label: 'Heading 1', value: 'heading', level: 1, icon: <Heading1 size={16} />, shortcut: '⌘⌥1' },
    { label: 'Heading 2', value: 'heading', level: 2, icon: <Heading2 size={16} />, shortcut: '⌘⌥2' },
    { label: 'Heading 3', value: 'heading', level: 3, icon: <Heading3 size={16} />, shortcut: '⌘⌥3' },
    { label: 'Heading 4', value: 'heading', level: 4, icon: <Heading4 size={16} />, shortcut: '⌘⌥4' },
    { label: 'Heading 5', value: 'heading', level: 5, icon: <Heading5 size={16} />, shortcut: '⌘⌥5' },
    { label: 'Heading 6', value: 'heading', level: 6, icon: <Heading6 size={16} />, shortcut: '⌘⌥6' },
  ];

  const currentBlock = blockTypes.find(t => 
    t.value === 'heading' 
      ? editor.isActive('heading', { level: t.level }) 
      : editor.isActive('paragraph')
  ) || blockTypes[0];

  const selectOption = (opt: typeof blockTypes[0]) => {
    if (opt.value === 'paragraph') editor.chain().focus().setParagraph().run();
    else if (opt.level) editor.chain().focus().toggleHeading({ level: opt.level as any }).run();
    setIsOpen(false);
  };

  return (
    <DropdownWrapper
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={
        <button
          className={cn('rp-modern-toolbar-btn', 'rp-modern-toolbar-btn-text', isOpen && 'rp-modern-toolbar-btn--active')}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{currentBlock.value === 'heading' ? `Heading ${currentBlock.level}` : 'Normal text'}</span>
          <ChevronDown size={14} />
        </button>
      }
    >
      <div className="rp-modern-dropdown-group-title" style={{ padding: '4px 16px', fontSize: '11px', fontWeight: 'bold', color: 'var(--rp-text-tertiary)', textTransform: 'uppercase' }}>Text Styles</div>
      {blockTypes.map((opt) => (
        <button
          key={opt.label}
          className={cn('rp-modern-dropdown-item', currentBlock.label === opt.label && 'rp-modern-dropdown-item--active')}
          onClick={() => selectOption(opt)}
        >
          <span className="rp-modern-dropdown-item-icon">{opt.icon}</span>
          <span className="rp-modern-dropdown-item-label" style={opt.level ? { fontSize: `${1.2 - (opt.level * 0.05)}em`, fontWeight: 600 } : {}}>
            {opt.label}
          </span>
          <span className="rp-modern-dropdown-item-shortcut">{opt.shortcut}</span>
        </button>
      ))}
    </DropdownWrapper>
  );
}

// ─── Format Dropdown ─────────────────────────────────────────────────────────

export function ModernFormatDropdown({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);

  const formats = [
    { label: 'Bold', action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold'), icon: <Bold size={16} />, shortcut: '⌘B' },
    { label: 'Italic', action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic'), icon: <Italic size={16} />, shortcut: '⌘I' },
    { label: 'Underline', action: () => editor.chain().focus().toggleUnderline().run(), isActive: editor.isActive('underline'), icon: <Underline size={16} />, shortcut: '⌘U' },
    { label: 'Strikethrough', action: () => editor.chain().focus().toggleStrike().run(), isActive: editor.isActive('strike'), icon: <Strikethrough size={16} />, shortcut: '⌘⇧S' },
    { label: 'Code', action: () => editor.chain().focus().toggleCode().run(), isActive: editor.isActive('code'), icon: <Code size={16} />, shortcut: '⌘⇧M' },
    { label: 'Subscript', action: () => editor.chain().focus().toggleSubscript().run(), isActive: editor.isActive('subscript'), icon: <Subscript size={16} />, shortcut: '⌘,' },
    { label: 'Superscript', action: () => editor.chain().focus().toggleSuperscript().run(), isActive: editor.isActive('superscript'), icon: <Superscript size={16} />, shortcut: '⌘.' },
  ];

  return (
    <DropdownWrapper
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={
        <button
          className={cn('rp-modern-toolbar-btn', 'rp-modern-toolbar-split-trigger', isOpen && 'rp-modern-toolbar-btn--active')}
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown size={14} />
        </button>
      }
    >
      {formats.map((fmt) => (
        <button
          key={fmt.label}
          className={cn('rp-modern-dropdown-item', fmt.isActive && 'rp-modern-dropdown-item--active')}
          onClick={() => { fmt.action(); setIsOpen(false); }}
        >
          <span className="rp-modern-dropdown-item-icon">{fmt.icon}</span>
          <span className="rp-modern-dropdown-item-label">{fmt.label}</span>
          <span className="rp-modern-dropdown-item-shortcut">{fmt.shortcut}</span>
        </button>
      ))}
      <div className="rp-modern-dropdown-divider" />
      <button
        className="rp-modern-dropdown-item"
        style={{ color: 'var(--rp-text-tertiary)' }}
        onClick={() => { editor.chain().focus().unsetAllMarks().run(); setIsOpen(false); }}
      >
        <span className="rp-modern-dropdown-item-icon"><RemoveFormatting size={16} /></span>
        <span className="rp-modern-dropdown-item-label">Clear formatting</span>
        <span className="rp-modern-dropdown-item-shortcut">⌘\</span>
      </button>
    </DropdownWrapper>
  );
}

// ─── List Dropdown ───────────────────────────────────────────────────────────

export function ModernListDropdown({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);

  const lists = [
    { label: 'Bulleted list', action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList'), icon: <List size={16} />, shortcut: '⌘⇧8' },
    { label: 'Numbered list', action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList'), icon: <ListOrdered size={16} />, shortcut: '⌘⇧7' },
    { label: 'Task list', action: () => editor.chain().focus().toggleTaskList().run(), isActive: editor.isActive('taskList'), icon: <ListChecks size={16} />, shortcut: '⌘⇧6' },
  ];

  return (
    <DropdownWrapper
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={
        <button
          className={cn('rp-modern-toolbar-btn', 'rp-modern-toolbar-split-trigger', isOpen && 'rp-modern-toolbar-btn--active')}
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown size={14} />
        </button>
      }
    >
      {lists.map((list) => (
        <button
          key={list.label}
          className={cn('rp-modern-dropdown-item', list.isActive && 'rp-modern-dropdown-item--active')}
          onClick={() => { list.action(); setIsOpen(false); }}
        >
          <span className="rp-modern-dropdown-item-icon">{list.icon}</span>
          <span className="rp-modern-dropdown-item-label">{list.label}</span>
          <span className="rp-modern-dropdown-item-shortcut">{list.shortcut}</span>
        </button>
      ))}
    </DropdownWrapper>
  );
}

// ─── Color Dropdown ──────────────────────────────────────────────────────────

const JIRA_COLORS = [
  '#202124', '#0747A6', '#008DA6', '#00875A', '#FF991F', '#DE350B', '#5243AA',
  '#5E6C84', '#2684FF', '#00C7E6', '#36B37E', '#FFC400', '#FF5630', '#6554C0',
  '#FFFFFF', '#B3D4FF', '#79E2F2', '#79F2C0', '#FFF0B3', '#FFBDAD', '#EAE6FF'
];

export function ModernColorDropdown({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentColor = editor.getAttributes('textStyle').color;

  return (
    <DropdownWrapper
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={
        <button
          className={cn('rp-modern-toolbar-btn', isOpen && 'rp-modern-toolbar-btn--active')}
          onClick={() => setIsOpen(!isOpen)}
          style={{ width: '32px', position: 'relative' }}
          title="Text color"
        >
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>A</span>
          <div style={{ position: 'absolute', bottom: '4px', left: '8px', right: '8px', height: '3px', background: currentColor || 'currentColor', borderRadius: '2px' }} />
        </button>
      }
    >
      <div style={{ padding: '8px 16px', fontWeight: 'bold', fontSize: '12px' }}>Text colour</div>
      <div className="rp-modern-dropdown-color-grid">
        {JIRA_COLORS.map(color => (
          <button
            key={color}
            className="rp-modern-color-btn"
            style={{ background: color }}
            onClick={() => { editor.chain().focus().setColor(color).run(); setIsOpen(false); }}
          >
            {currentColor === color && <Check size={14} color={['#FFFFFF', '#FFF0B3', '#EAE6FF', '#79E2F2', '#79F2C0', '#FFBDAD'].includes(color) ? '#000' : '#fff'} />}
          </button>
        ))}
      </div>
      <button
        className="rp-modern-color-remove"
        onClick={() => { editor.chain().focus().unsetColor().run(); setIsOpen(false); }}
      >
        Remove colour
      </button>
    </DropdownWrapper>
  );
}
