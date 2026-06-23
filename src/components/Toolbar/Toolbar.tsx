import { useState, useCallback, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  CodeSquare,
  Minus,
  Link,
  ImageIcon,
  TableIcon,
  Undo2,
  Redo2,
  Highlighter,
} from "lucide-react";
import { ToolbarButton } from "./ToolbarButton";
import { ToolbarGroup } from "./ToolbarGroup";
import { ToolbarDivider } from "./ToolbarDivider";
import { ToolbarDropdown } from "./ToolbarDropdown";
import { LinkEditor } from "../LinkEditor/LinkEditor";
import { KEYBOARD_SHORTCUTS } from "../../core/constants";
import "./Toolbar.css";

interface ToolbarProps {
  editor: Editor;
}

export function Toolbar({ editor }: ToolbarProps) {
  const [showLinkEditor, setShowLinkEditor] = useState(false);

  // Force re-render when editor state changes
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

  const editorState = {
    isBold: editor.isActive("bold"),
    isItalic: editor.isActive("italic"),
    isUnderline: editor.isActive("underline"),
    isStrike: editor.isActive("strike"),
    isCode: editor.isActive("code"),
    isHighlight: editor.isActive("highlight"),
    isLink: editor.isActive("link"),
    isBulletList: editor.isActive("bulletList"),
    isOrderedList: editor.isActive("orderedList"),
    isTaskList: editor.isActive("taskList"),
    isBlockquote: editor.isActive("blockquote"),
    isCodeBlock: editor.isActive("codeBlock"),
    canBold: editor.can().chain().focus().toggleBold().run(),
    canItalic: editor.can().chain().focus().toggleItalic().run(),
    canUnderline: editor.can().chain().focus().toggleUnderline().run(),
    canStrike: editor.can().chain().focus().toggleStrike().run(),
    canCode: editor.can().chain().focus().toggleCode().run(),
    canUndo: editor.can().chain().focus().undo().run(),
    canRedo: editor.can().chain().focus().redo().run(),
    linkHref: editor.getAttributes("link").href || "",
  };

  const handleLinkClick = useCallback(() => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
    } else {
      setShowLinkEditor(true);
    }
  }, [editor]);

  const handleLinkSubmit = useCallback(
    (url: string) => {
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
      setShowLinkEditor(false);
    },
    [editor],
  );

  const handleInsertTable = useCallback(() => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  const handleInsertImage = useCallback(() => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  return (
    <div className="rp-toolbar" role="toolbar" aria-label="Formatting toolbar">
      {/* Block type dropdown */}
      <ToolbarGroup>
        <ToolbarDropdown editor={editor} />
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Text formatting */}
      <ToolbarGroup>
        <ToolbarButton
          icon={<Bold size={16} />}
          label="Bold"
          shortcut={KEYBOARD_SHORTCUTS.bold}
          isActive={editorState.isBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
        />
        <ToolbarButton
          icon={<Italic size={16} />}
          label="Italic"
          shortcut={KEYBOARD_SHORTCUTS.italic}
          isActive={editorState.isItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
        />
        <ToolbarButton
          icon={<Underline size={16} />}
          label="Underline"
          shortcut={KEYBOARD_SHORTCUTS.underline}
          isActive={editorState.isUnderline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editorState.canUnderline}
        />
        <ToolbarButton
          icon={<Strikethrough size={16} />}
          label="Strikethrough"
          shortcut={KEYBOARD_SHORTCUTS.strikethrough}
          isActive={editorState.isStrike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
        />
        <ToolbarButton
          icon={<Code size={16} />}
          label="Inline code"
          shortcut={KEYBOARD_SHORTCUTS.code}
          isActive={editorState.isCode}
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
        />
        <ToolbarButton
          icon={<Highlighter size={16} />}
          label="Highlight"
          isActive={editorState.isHighlight}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        />
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarGroup>
        <ToolbarButton
          icon={<List size={16} />}
          label="Bullet list"
          shortcut={KEYBOARD_SHORTCUTS.bulletList}
          isActive={editorState.isBulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          icon={<ListOrdered size={16} />}
          label="Numbered list"
          shortcut={KEYBOARD_SHORTCUTS.orderedList}
          isActive={editorState.isOrderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          icon={<ListChecks size={16} />}
          label="Task list"
          shortcut={KEYBOARD_SHORTCUTS.taskList}
          isActive={editorState.isTaskList}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        />
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Block elements */}
      <ToolbarGroup>
        <ToolbarButton
          icon={<Quote size={16} />}
          label="Blockquote"
          shortcut={KEYBOARD_SHORTCUTS.blockquote}
          isActive={editorState.isBlockquote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          icon={<CodeSquare size={16} />}
          label="Code block"
          shortcut={KEYBOARD_SHORTCUTS.codeBlock}
          isActive={editorState.isCodeBlock}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        />
        <ToolbarButton
          icon={<Minus size={16} />}
          label="Divider"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Insert */}
      <ToolbarGroup>
        <div style={{ position: "relative" }}>
          <ToolbarButton
            icon={<Link size={16} />}
            label={editorState.isLink ? "Remove link" : "Add link"}
            shortcut={KEYBOARD_SHORTCUTS.link}
            isActive={editorState.isLink}
            onClick={handleLinkClick}
          />
          {showLinkEditor && (
            <LinkEditor
              onSubmit={handleLinkSubmit}
              onCancel={() => setShowLinkEditor(false)}
              initialUrl={editorState.linkHref}
            />
          )}
        </div>
        <ToolbarButton
          icon={<ImageIcon size={16} />}
          label="Insert image"
          onClick={handleInsertImage}
        />
        <ToolbarButton
          icon={<TableIcon size={16} />}
          label="Insert table"
          onClick={handleInsertTable}
        />
      </ToolbarGroup>

      <ToolbarDivider />

      {/* History */}
      <ToolbarGroup>
        <ToolbarButton
          icon={<Undo2 size={16} />}
          label="Undo"
          shortcut={KEYBOARD_SHORTCUTS.undo}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
        />
        <ToolbarButton
          icon={<Redo2 size={16} />}
          label="Redo"
          shortcut={KEYBOARD_SHORTCUTS.redo}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
        />
      </ToolbarGroup>
    </div>
  );
}
