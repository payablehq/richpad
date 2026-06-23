import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import type { Instance as TippyInstance } from 'tippy.js';
import { SlashMenu, DEFAULT_SLASH_COMMANDS } from '../components/SlashMenu/SlashMenu';
import type { SlashCommandDef, SlashMenuRef } from '../components/SlashMenu/SlashMenu';

export const SlashCommandExtension = Extension.create({
  name: 'slashCommands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.action(editor);
          editor.commands.deleteRange(range);
        },
      },
      commands: DEFAULT_SLASH_COMMANDS,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          return this.options.commands.filter((item: SlashCommandDef) => {
            const q = query.toLowerCase();
            return (
              item.title.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q) ||
              item.aliases?.some((alias) => alias.toLowerCase().includes(q))
            );
          });
        },
        render: () => {
          let component: ReactRenderer<SlashMenuRef>;
          let popup: TippyInstance[];

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(SlashMenu, {
                props: {
                  ...props,
                  items: props.items,
                },
                editor: props.editor,
              });

              if (!props.clientRect) return;

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              });
            },
            onUpdate: (props: any) => {
              component?.updateProps({
                ...props,
                items: props.items,
              });

              if (!props.clientRect) return;

              popup?.[0]?.setProps({
                getReferenceClientRect: props.clientRect,
              });
            },
            onKeyDown: (props: any) => {
              if (props.event.key === 'Escape') {
                popup?.[0]?.hide();
                return true;
              }
              return component?.ref?.onKeyDown(props.event) || false;
            },
            onExit: () => {
              popup?.[0]?.destroy();
              component?.destroy();
            },
          };
        },
      }),
    ];
  },
});
