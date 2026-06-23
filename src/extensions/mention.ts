import Mention from '@tiptap/extension-mention';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import type { Instance as TippyInstance } from 'tippy.js';
import { MentionList } from '../components/MentionList/MentionList';
import type { MentionListRef } from '../components/MentionList/MentionList';

// A mock provider for the demo
const mockUsers = [
  { id: '1', label: 'Alice', description: 'Product Manager' },
  { id: '2', label: 'Bob', description: 'Software Engineer' },
  { id: '3', label: 'Charlie', description: 'Designer' },
];

export const MentionExtension = Mention.configure({
  HTMLAttributes: {
    class: 'rp-mention',
  },
  suggestion: {
    items: ({ query }: { query: string }) => {
      return mockUsers.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
    },
    render: () => {
      let component: ReactRenderer<MentionListRef>;
      let popup: TippyInstance[];

      return {
        onStart: (props: any) => {
          component = new ReactRenderer(MentionList, {
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
  },
});
