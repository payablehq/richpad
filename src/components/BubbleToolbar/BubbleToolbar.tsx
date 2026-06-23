import { BubbleMenu } from '@tiptap/react/menus';
import type { Editor } from '@tiptap/react';
import { Bold, Italic, Underline, Strikethrough, Code, Link, Unlink, Highlighter } from 'lucide-react';
import { ToolbarButton } from '../Toolbar/ToolbarButton';
import { KEYBOARD_SHORTCUTS } from '../../core/constants';
import './BubbleToolbar.css';

interface BubbleToolbarProps {
  editor: Editor;
  onLinkClick: () => void;
}

export function BubbleToolbar({ editor, onLinkClick }: BubbleToolbarProps) {
  return (
    <BubbleMenu
      editor={editor}
      className="rp-bubble-toolbar"
      appendTo={document.body}
      options={{ strategy: 'fixed', placement: 'top', offset: 8, flip: {}, shift: {} }}
      shouldShow={({ editor: ed }) => {
        const { selection } = ed.state;
        const { empty } = selection;

        // Don't show for empty selections or code blocks
        if (empty || ed.isActive('codeBlock')) return false;

        return true;
      }}
    >
      <ToolbarButton
        icon={<Bold size={15} />}
        label="Bold"
        shortcut={KEYBOARD_SHORTCUTS.bold}
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={<Italic size={15} />}
        label="Italic"
        shortcut={KEYBOARD_SHORTCUTS.italic}
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={<Underline size={15} />}
        label="Underline"
        shortcut={KEYBOARD_SHORTCUTS.underline}
        isActive={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        icon={<Strikethrough size={15} />}
        label="Strikethrough"
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />

      <div className="rp-bubble-divider" />

      <ToolbarButton
        icon={<Code size={15} />}
        label="Code"
        shortcut={KEYBOARD_SHORTCUTS.code}
        isActive={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />
      <ToolbarButton
        icon={<Highlighter size={15} />}
        label="Highlight"
        isActive={editor.isActive('highlight')}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      />

      <div className="rp-bubble-divider" />

      {editor.isActive('link') ? (
        <ToolbarButton
          icon={<Unlink size={15} />}
          label="Remove link"
          isActive={false}
          onClick={() => editor.chain().focus().unsetLink().run()}
        />
      ) : (
        <ToolbarButton
          icon={<Link size={15} />}
          label="Add link"
          shortcut={KEYBOARD_SHORTCUTS.link}
          isActive={false}
          onClick={onLinkClick}
        />
      )}
    </BubbleMenu>
  );
}
