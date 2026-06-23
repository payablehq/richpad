import {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
  useMemo,
} from "react";
import { EditorContent } from "@tiptap/react";
import type { RichPadProps, RichPadRef } from "../core/types";
import { RichPadContextProvider } from "../core/RichPadProvider";
import { useRichPad } from "../core/useRichPad";
import { Toolbar } from "./Toolbar/Toolbar";
import { BubbleToolbar } from "./BubbleToolbar/BubbleToolbar";
import { ModernToolbar } from "./Toolbar/ModernToolbar";
import { BottomToolbar } from "./Toolbar/BottomToolbar";
import { cn } from "../utils/cn";

// Theme & prose imports
import "../themes/tokens.css";
import "../themes/light.css";
import "../themes/dark.css";
import "../themes/prose.css";
import "./RichPad.css";

export const RichPad = forwardRef<RichPadRef, RichPadProps>((props, ref) => {
  const {
    editable = true,
    readOnly = false,
    disabled = false,
    className,
    theme,
    toolbar,
    toolbarVariant = "standard",
    minHeight = 120,
    maxHeight,
    id,
    ariaLabel,
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  const isEditable = editable && !readOnly && !disabled;
  const showToolbar = toolbar !== false && isEditable;
  const showBubbleMenu =
    toolbar !== false &&
    (toolbar === undefined || toolbar?.bubbleMenu !== false) &&
    isEditable;
  const themeMode = theme?.mode ?? "light";

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    props.onFocus?.();
  }, [props]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const mergedProps = useMemo(
    () => ({
      ...props,
      onFocus: handleFocus,
    }),
    [props, handleFocus],
  );

  const { editor, ref: editorRef } = useRichPad({ props: mergedProps });

  useImperativeHandle(ref, () => editorRef, [editorRef]);

  const contextValue = useMemo(
    () => ({
      editor,
      editable: isEditable,
      readOnly,
      disabled,
    }),
    [editor, isEditable, readOnly, disabled],
  );

  if (!editor) return null;

  return (
    <RichPadContextProvider value={contextValue}>
      <div
        id={id}
        className={cn(
          "rp-root",
          `rp-theme-${themeMode}`,
          isFocused && "rp-root--focused",
          disabled && "rp-root--disabled",
          readOnly && "rp-root--readonly",
          theme?.className,
          className,
        )}
        data-focused={isFocused || undefined}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        onBlur={handleBlur}
      >
        {showToolbar &&
          (toolbarVariant === "modern" ? (
            <ModernToolbar editor={editor} />
          ) : toolbarVariant === "bottom" ? null : (
            <Toolbar editor={editor} />
          ))}

        {showBubbleMenu && (
          <BubbleToolbar
            editor={editor}
            onLinkClick={() => {
              const url = window.prompt("Enter URL:");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
          />
        )}

        <div
          className="rp-editor-scroll"
          style={{
            position: "relative",
            zIndex: 1,
            minHeight:
              typeof minHeight === "number" ? `${minHeight}px` : minHeight,
            maxHeight: maxHeight
              ? typeof maxHeight === "number"
                ? `${maxHeight}px`
                : maxHeight
              : undefined,
            overflowY: maxHeight ? "auto" : undefined,
          }}
        >
          <EditorContent
            editor={editor}
            className="rp-editor-content-wrapper"
            aria-label={ariaLabel}
          />
        </div>

        {showToolbar && toolbarVariant === "bottom" && (
          <BottomToolbar editor={editor} />
        )}
      </div>
    </RichPadContextProvider>
  );
});

RichPad.displayName = "RichPad";
