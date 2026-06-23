import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Markdown } from 'tiptap-markdown';
import { MentionExtension } from './mention';
import { SlashCommandExtension } from './slash';
import { common, createLowlight } from 'lowlight';
import type { Extension } from '@tiptap/core';
import type { MentionProvider, SlashCommandItem, ImageUploadHandler } from '../core/types';
import { DEFAULT_PLACEHOLDER } from '../core/constants';

const lowlight = createLowlight(common);

// ─── Extension Factory Options ───────────────────────────────────────────────

export interface DefaultExtensionOptions {
  placeholder?: string;
  mentionProvider?: MentionProvider;
  slashCommands?: SlashCommandItem[] | false;
  onImageUpload?: ImageUploadHandler;
}

// ─── Default Extensions ──────────────────────────────────────────────────────

export function createDefaultExtensions(
  options: DefaultExtensionOptions = {}
): Extension[] {
  const {
    placeholder = DEFAULT_PLACEHOLDER,
  } = options;

  const extensions: Extension[] = [
    StarterKit.configure({
      codeBlock: false, // We use CodeBlockLowlight instead
      horizontalRule: {
        HTMLAttributes: {
          class: 'rp-hr',
        },
      },
    }) as unknown as Extension,

    Underline as unknown as Extension,

    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: {
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }) as unknown as Extension,

    Placeholder.configure({
      placeholder,
      emptyEditorClass: 'is-editor-empty',
      emptyNodeClass: 'is-empty',
    }) as unknown as Extension,

    Typography as unknown as Extension,

    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }) as unknown as Extension,

    Highlight.configure({
      multicolor: false,
    }) as unknown as Extension,

    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: 'plaintext',
      HTMLAttributes: {
        class: 'rp-code-block',
      },
    }) as unknown as Extension,

    Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'rp-image',
      },
    }) as unknown as Extension,

    Table.configure({
      resizable: true,
      handleWidth: 5,
      cellMinWidth: 80,
      lastColumnResizable: true,
      allowTableNodeSelection: true,
    }) as unknown as Extension,

    TableRow as unknown as Extension,
    TableCell as unknown as Extension,
    TableHeader as unknown as Extension,

    TaskList.configure({
      HTMLAttributes: {
        class: 'rp-task-list',
      },
    }) as unknown as Extension,

    TaskItem.configure({
      nested: true,
    }) as unknown as Extension,

    TextStyle as unknown as Extension,

    Color as unknown as Extension,

    Subscript as unknown as Extension,
    Superscript as unknown as Extension,
    Markdown.configure({
      html: true,
      tightLists: false,
      transformPastedText: true,
      transformCopiedText: false,
    }) as unknown as Extension,
    MentionExtension as unknown as Extension,
    SlashCommandExtension as unknown as Extension,
  ];

  return extensions;
}

// ─── Minimal Extensions ──────────────────────────────────────────────────────

export function createMinimalExtensions(
  options: { placeholder?: string } = {}
): Extension[] {
  const { placeholder = DEFAULT_PLACEHOLDER } = options;

  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }) as unknown as Extension,

    Underline as unknown as Extension,

    Link.configure({
      openOnClick: false,
      autolink: true,
    }) as unknown as Extension,

    Placeholder.configure({
      placeholder,
      emptyEditorClass: 'is-editor-empty',
    }) as unknown as Extension,
  ];
}
