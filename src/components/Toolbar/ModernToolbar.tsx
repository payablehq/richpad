import { useState, useCallback, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  List,
  CodeSquare,
  Link,
  ImageIcon,
  Undo2,
  Redo2,
  Quote,
} from "lucide-react";
import { LinkEditor } from "../LinkEditor/LinkEditor";
import { ImageEditor } from "../ImageEditor/ImageEditor";
import {
  ModernBlockTypeDropdown,
  ModernFormatDropdown,
  ModernListDropdown,
  ModernColorDropdown,
  ModernAlignDropdown,
} from "./ModernToolbarDropdowns";
import { cn } from "../../utils/cn";
import "./ModernToolbar.css";

interface ModernToolbarProps {
  editor: Editor;
}

export function ModernToolbar({ editor }: ModernToolbarProps) {
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    if (!editor) return;
    const update = () => forceUpdate({});
    editor.on("transaction", update);
    editor.on("selectionUpdate", update);
    editor.on("update", update);
    editor.on("focus", update);

    return () => {
      editor.off("transaction", update);
      editor.off("selectionUpdate", update);
      editor.off("update", update);
      editor.off("focus", update);
    };
  }, [editor]);

  const isBold = editor.isActive("bold");
  const isBulletList = editor.isActive("bulletList");
  const isBlockquote = editor.isActive("blockquote");
  const isCodeBlock = editor.isActive("codeBlock");
  const isLink = editor.isActive("link");

  const handleLinkClick = useCallback(() => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
    } else {
      setShowLinkEditor(true);
      setShowImageEditor(false);
    }
  }, [editor]);

  const handleLinkSubmit = useCallback(
    (url: string) => {
      if (url) editor.chain().focus().setLink({ href: url }).run();
      setShowLinkEditor(false);
    },
    [editor],
  );

  const handleInsertImageClick = useCallback(() => {
    setShowImageEditor(true);
    setShowLinkEditor(false);
  }, []);

  const handleImageSubmit = useCallback(
    (url: string) => {
      if (url) editor.chain().focus().setImage({ src: url }).run();
      setShowImageEditor(false);
    },
    [editor],
  );

  return (
    <div
      className="rp-modern-toolbar"
      role="toolbar"
      aria-label="Formatting toolbar"
    >
      {/* ── Group 1: Block Type ── */}
      <div className="rp-modern-tg">
        <ModernBlockTypeDropdown editor={editor} />
      </div>

      {/* ── Group 2: Inline Formatting (bold + format dropdown) ── */}
      <div className="rp-modern-tg">
        <span className="rp-modern-tg-sep" aria-hidden="true" />
        <div className="rp-modern-toolbar-split-group">
          <button
            className={cn(
              "rp-modern-toolbar-btn",
              "rp-modern-toolbar-split-btn",
              isBold && "rp-modern-toolbar-btn--active",
            )}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (⌘B)"
          >
            <Bold size={16} />
          </button>
          <ModernFormatDropdown editor={editor} />
        </div>
      </div>

      {/* ── Group 3: Text Color ── moved next to inline formatting ── */}
      <div className="rp-modern-tg">
        <span className="rp-modern-tg-sep" aria-hidden="true" />
        <ModernColorDropdown editor={editor} />
      </div>

      {/* ── Group 4: Text Alignment ── hidden ≤600px ── */}
      <div className="rp-modern-tg rp-modern-tg--hide-sm">
        <span className="rp-modern-tg-sep" aria-hidden="true" />
        <ModernAlignDropdown editor={editor} />
      </div>

      {/* ── Group 5: Structure (lists + blockquote + code block) ── */}
      <div className="rp-modern-tg">
        <span className="rp-modern-tg-sep" aria-hidden="true" />
        <div className="rp-modern-toolbar-split-group">
          <button
            className={cn(
              "rp-modern-toolbar-btn",
              "rp-modern-toolbar-split-btn",
              isBulletList && "rp-modern-toolbar-btn--active",
            )}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bulleted list (⌘⇧8)"
          >
            <List size={16} />
          </button>
          <ModernListDropdown editor={editor} />
        </div>
        <button
          className={cn(
            "rp-modern-toolbar-btn",
            isBlockquote && "rp-modern-toolbar-btn--active",
          )}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote (⌘⇧B)"
        >
          <Quote size={16} />
        </button>
        <button
          className={cn(
            "rp-modern-toolbar-btn",
            isCodeBlock && "rp-modern-toolbar-btn--active",
          )}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code block (⌘⌥C)"
        >
          <CodeSquare size={16} />
        </button>
      </div>

      {/* ── Group 6: Insert (image + link) ── hidden ≤600px ── */}
      <div className="rp-modern-tg rp-modern-tg--hide-sm">
        <span className="rp-modern-tg-sep" aria-hidden="true" />
        <div style={{ position: "relative" }}>
          <button
            className="rp-modern-toolbar-btn"
            onClick={handleInsertImageClick}
            title="Insert image"
          >
            <ImageIcon size={16} />
          </button>
          {showImageEditor && (
            <div
              style={{ position: "absolute", top: "100%", left: 0, zIndex: 50 }}
            >
              <ImageEditor
                onSubmit={handleImageSubmit}
                onCancel={() => setShowImageEditor(false)}
              />
            </div>
          )}
        </div>
        <div style={{ position: "relative" }}>
          <button
            className={cn(
              "rp-modern-toolbar-btn",
              isLink && "rp-modern-toolbar-btn--active",
            )}
            onClick={handleLinkClick}
            title={isLink ? "Remove link" : "Add link (⌘K)"}
          >
            <Link size={16} />
          </button>
          {showLinkEditor && (
            <div
              style={{ position: "absolute", top: "100%", left: 0, zIndex: 50 }}
            >
              <LinkEditor
                onSubmit={handleLinkSubmit}
                onCancel={() => setShowLinkEditor(false)}
                initialUrl={editor.getAttributes("link").href || ""}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Flex spacer ── */}
      <div className="rp-modern-toolbar-flex-spacer" />

      {/* ── Group 7: History ── */}
      <div className="rp-modern-tg">
        <button
          className="rp-modern-toolbar-btn"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Undo (⌘Z)"
        >
          <Undo2 size={16} />
        </button>
        <button
          className="rp-modern-toolbar-btn"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Redo (⌘⇧Z)"
        >
          <Redo2 size={16} />
        </button>
      </div>
    </div>
  );
}
