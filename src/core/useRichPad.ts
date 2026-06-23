import { useEditor } from '@tiptap/react';
import type { Editor, JSONContent } from '@tiptap/react';
import type { RichPadProps, RichPadRef, OutputFormat } from './types';
import { createDefaultExtensions } from '../extensions';
import { DEFAULT_PLACEHOLDER } from './constants';

// ─── Content Helpers ─────────────────────────────────────────────────────────

function getOutput(editor: Editor, format: OutputFormat): string | JSONContent {
  switch (format) {
    case 'html':
      return editor.getHTML();
    case 'json':
      return editor.getJSON();
    case 'text':
      return editor.getText();
    case 'markdown':
      // Markdown export falls back to HTML if extension isn't loaded
      return editor.getHTML();
    default:
      return editor.getHTML();
  }
}

function isJSONContent(content: unknown): content is JSONContent {
  return (
    typeof content === 'object' &&
    content !== null &&
    'type' in content
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

interface UseRichPadOptions {
  props: RichPadProps;
  onReady?: (editor: Editor) => void;
}

export function useRichPad({ props, onReady }: UseRichPadOptions): {
  editor: Editor | null;
  ref: RichPadRef;
} {
  const {
    content = '',
    onChange,
    onBlur,
    onFocus,
    editable = true,
    readOnly = false,
    disabled = false,
    placeholder = DEFAULT_PLACEHOLDER,
    autofocus = false,
    outputFormat = 'html',
    extensions: extraExtensions = [],
    mentionProvider,
    slashCommands,
    onImageUpload,
  } = props;

  const isEditable = editable && !readOnly && !disabled;

  const defaultExtensions = createDefaultExtensions({
    placeholder,
    mentionProvider,
    slashCommands,
    onImageUpload,
  });

  const allExtensions = [...defaultExtensions, ...extraExtensions];

  const editor = useEditor({
    extensions: allExtensions,
    content: isJSONContent(content) ? content : (content || undefined),
    editable: isEditable,
    autofocus,
    immediatelyRender: true,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class: 'rp-editor-content',
        role: 'textbox',
        'aria-multiline': 'true',
        ...(props.ariaLabel ? { 'aria-label': props.ariaLabel } : {}),
        ...(props.ariaDescribedBy ? { 'aria-describedby': props.ariaDescribedBy } : {}),
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange?.(getOutput(ed, outputFormat));
    },
    onBlur: ({ editor: ed }) => {
      onBlur?.(getOutput(ed, outputFormat));
    },
    onFocus: () => {
      onFocus?.();
    },
    onCreate: ({ editor: ed }) => {
      onReady?.(ed);
    },
  });

  // Imperative ref API
  const ref: RichPadRef = {
    getHTML: () => editor?.getHTML() ?? '',
    getJSON: () => editor?.getJSON() ?? { type: 'doc', content: [] },
    getMarkdown: () => editor?.getHTML() ?? '',
    getText: () => editor?.getText() ?? '',
    setContent: (newContent, emitUpdate = false) => {
      if (!editor) return;
      editor.commands.setContent(newContent, { emitUpdate });
    },
    clearContent: (emitUpdate = false) => {
      editor?.commands.clearContent(emitUpdate);
    },
    focus: (position = 'end') => {
      editor?.commands.focus(position);
    },
    blur: () => {
      editor?.commands.blur();
    },
    isEmpty: () => editor?.isEmpty ?? true,
    getEditor: () => editor,
  };

  return { editor, ref };
}
