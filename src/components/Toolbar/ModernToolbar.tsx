import { useState, useCallback, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  List,
  CodeSquare,
  Link,
  ImageIcon,
  Smile,
  Plus,
  Undo2,
  Redo2,
} from "lucide-react";
import { LinkEditor } from "../LinkEditor/LinkEditor";
import { ImageEditor } from "../ImageEditor/ImageEditor";
import {
  ModernBlockTypeDropdown,
  ModernFormatDropdown,
  ModernListDropdown,
  ModernColorDropdown,
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
      {/* 3. Block Type Dropdown */}
      <ModernBlockTypeDropdown editor={editor} />

      {/* 4. Bold + Format Dropdown */}
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

      <div className="rp-modern-toolbar-spacer" />

      {/* 5. Bullet List + List Dropdown */}
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

      {/* 6. Text Color Dropdown */}
      <ModernColorDropdown editor={editor} />

      {/* 7. Image, Code Block, Emoji, Plus, Link */}
      <div style={{ position: "relative" }}>
        <button
          className="rp-modern-toolbar-btn rp-modern-toolbar-btn-icon-only"
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

      <button
        className={cn(
          "rp-modern-toolbar-btn rp-modern-toolbar-btn-icon-only",
          editor.isActive("codeBlock") && "rp-modern-toolbar-btn--active",
        )}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="Code block"
      >
        <CodeSquare size={16} />
      </button>

      <button
        className="rp-modern-toolbar-btn rp-modern-toolbar-btn-icon-only"
        title="Emoji (placeholder)"
      >
        <Smile size={16} />
      </button>

      <button
        className="rp-modern-toolbar-btn rp-modern-toolbar-btn-icon-only"
        title="Insert (placeholder)"
      >
        <Plus size={16} />
      </button>

      <div style={{ position: "relative" }}>
        <button
          className={cn(
            "rp-modern-toolbar-btn rp-modern-toolbar-btn-icon-only",
            editor.isActive("link") && "rp-modern-toolbar-btn--active",
          )}
          onClick={handleLinkClick}
          title={editor.isActive("link") ? "Remove link" : "Add link"}
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

      <div className="rp-modern-toolbar-spacer" style={{ flexGrow: 1 }} />

      {/* 8. History */}
      <button
        className="rp-modern-toolbar-btn rp-modern-toolbar-btn-icon-only"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        title="Undo (⌘Z)"
      >
        <Undo2 size={16} />
      </button>

      <button
        className="rp-modern-toolbar-btn rp-modern-toolbar-btn-icon-only"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        title="Redo (⌘⇧Z)"
      >
        <Redo2 size={16} />
      </button>
    </div>
  );
}
