import { useState, useRef, useEffect, useCallback } from "react";
import { useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";
import "./ToolbarDropdown.css";

interface ToolbarDropdownProps {
  editor: Editor;
}

interface BlockOption {
  label: string;
  value: string;
  level?: number;
}

const BLOCK_OPTIONS: BlockOption[] = [
  { label: "Normal text", value: "paragraph" },
  { label: "Heading 1", value: "heading", level: 1 },
  { label: "Heading 2", value: "heading", level: 2 },
  { label: "Heading 3", value: "heading", level: 3 },
  { label: "Heading 4", value: "heading", level: 4 },
];

function getCurrentBlock(editor: Editor): string {
  for (const opt of BLOCK_OPTIONS) {
    if (opt.value === "heading" && opt.level) {
      if (editor.isActive("heading", { level: opt.level })) {
        return opt.label;
      }
    }
  }
  return "Normal text";
}

export function ToolbarDropdown({ editor }: ToolbarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentBlock = useEditorState({
    editor,
    selector: ({ editor: ed }) => getCurrentBlock(ed),
  });

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    setActiveIndex(-1);
  }, []);

  const selectOption = useCallback(
    (option: BlockOption) => {
      if (option.value === "paragraph") {
        editor.chain().focus().setParagraph().run();
      } else if (option.value === "heading" && option.level) {
        editor
          .chain()
          .focus()
          .toggleHeading({ level: option.level as 1 | 2 | 3 | 4 | 5 | 6 })
          .run();
      }
      close();
    },
    [editor, close],
  );

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setIsOpen(true);
          setActiveIndex(0);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            Math.min(prev + 1, BLOCK_OPTIONS.length - 1),
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0) {
            selectOption(BLOCK_OPTIONS[activeIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          close();
          break;
      }
    },
    [isOpen, activeIndex, selectOption, close],
  );

  return (
    <div
      className="rp-toolbar-dropdown"
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={cn(
          "rp-toolbar-dropdown__trigger",
          isOpen && "rp-toolbar-dropdown__trigger--open",
        )}
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        tabIndex={-1}
      >
        <span className="rp-toolbar-dropdown__label">{currentBlock}</span>
        <ChevronDown size={14} className="rp-toolbar-dropdown__chevron" />
      </button>

      {isOpen && (
        <div className="rp-toolbar-dropdown__menu" ref={menuRef} role="listbox">
          {BLOCK_OPTIONS.map((option, index) => (
            <button
              key={option.label}
              type="button"
              role="option"
              aria-selected={currentBlock === option.label}
              className={cn(
                "rp-toolbar-dropdown__item",
                currentBlock === option.label &&
                  "rp-toolbar-dropdown__item--selected",
                activeIndex === index && "rp-toolbar-dropdown__item--focused",
              )}
              onClick={() => selectOption(option)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span
                className="rp-toolbar-dropdown__item-label"
                style={{
                  fontSize: option.level
                    ? `${1.25 - (option.level - 1) * 0.1}rem`
                    : undefined,
                  fontWeight: option.level ? 600 : undefined,
                }}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
