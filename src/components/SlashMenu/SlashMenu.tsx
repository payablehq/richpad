import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code2,
  Minus,
  ImageIcon,
  TableIcon,
  Type,
} from 'lucide-react';
import type { Editor } from '@tiptap/react';
import { cn } from '../../utils/cn';
import './SlashMenu.css';

export interface SlashCommandDef {
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  aliases?: string[];
  action: (editor: Editor) => void;
}

// ─── Default Commands ────────────────────────────────────────────────────────

export const DEFAULT_SLASH_COMMANDS: SlashCommandDef[] = [
  {
    title: 'Text',
    description: 'Start writing with plain text',
    icon: <Type size={18} />,
    category: 'Basic',
    aliases: ['paragraph', 'text', 'normal'],
    action: (editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    title: 'Heading 1',
    description: 'Large section heading',
    icon: <Heading1 size={18} />,
    category: 'Basic',
    aliases: ['h1', 'heading1'],
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: <Heading2 size={18} />,
    category: 'Basic',
    aliases: ['h2', 'heading2'],
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: <Heading3 size={18} />,
    category: 'Basic',
    aliases: ['h3', 'heading3'],
    action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: 'Bullet list',
    description: 'Create a simple bullet list',
    icon: <List size={18} />,
    category: 'Lists',
    aliases: ['ul', 'unordered', 'bullet'],
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: 'Numbered list',
    description: 'Create a numbered list',
    icon: <ListOrdered size={18} />,
    category: 'Lists',
    aliases: ['ol', 'ordered', 'numbered'],
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: 'Task list',
    description: 'Track tasks with a to-do list',
    icon: <ListChecks size={18} />,
    category: 'Lists',
    aliases: ['todo', 'task', 'checklist'],
    action: (editor) => editor.chain().focus().toggleTaskList().run(),
  },
  {
    title: 'Blockquote',
    description: 'Add a quote or callout',
    icon: <Quote size={18} />,
    category: 'Blocks',
    aliases: ['quote', 'callout'],
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: 'Code block',
    description: 'Add a code snippet',
    icon: <Code2 size={18} />,
    category: 'Blocks',
    aliases: ['code', 'snippet', 'pre'],
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: 'Divider',
    description: 'Insert a horizontal line',
    icon: <Minus size={18} />,
    category: 'Blocks',
    aliases: ['hr', 'horizontal', 'separator', 'line'],
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
  {
    title: 'Image',
    description: 'Insert an image from URL',
    icon: <ImageIcon size={18} />,
    category: 'Media',
    aliases: ['img', 'picture', 'photo'],
    action: (editor) => {
      const url = window.prompt('Enter image URL:');
      if (url) editor.chain().focus().setImage({ src: url }).run();
    },
  },
  {
    title: 'Table',
    description: 'Insert a table',
    icon: <TableIcon size={18} />,
    category: 'Media',
    aliases: ['grid'],
    action: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
];

// ─── SlashMenu Component ─────────────────────────────────────────────────────

export interface SlashMenuRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

interface SlashMenuProps {
  items: SlashCommandDef[];
  command: (item: SlashCommandDef) => void;
  query: string;
}

export const SlashMenu = forwardRef<SlashMenuRef, SlashMenuProps>(
  ({ items, command, query }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Filter items by query
    const filteredItems = items.filter((item) => {
      const q = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.aliases?.some((alias) => alias.toLowerCase().includes(q))
      );
    });

    // Group items by category
    const grouped = filteredItems.reduce<Record<string, SlashCommandDef[]>>((acc, item) => {
      const cat = item.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    // Reset selection when query changes
    useEffect(() => {
      setSelectedIndex(0);
    }, [query]);

    // Scroll selected item into view
    useEffect(() => {
      itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }, [selectedIndex]);

    const selectItem = useCallback((index: number) => {
      const item = filteredItems[index];
      if (item) command(item);
    }, [filteredItems, command]);

    useImperativeHandle(ref, () => ({
      onKeyDown: (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((prev) => (prev <= 0 ? filteredItems.length - 1 : prev - 1));
          return true;
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex((prev) => (prev >= filteredItems.length - 1 ? 0 : prev + 1));
          return true;
        }
        if (event.key === 'Enter') {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      },
    }));

    if (filteredItems.length === 0) {
      return (
        <div className="rp-slash-menu">
          <div className="rp-slash-menu__empty">No results</div>
        </div>
      );
    }

    let flatIndex = 0;

    return (
      <div className="rp-slash-menu" ref={menuRef}>
        {Object.entries(grouped).map(([category, categoryItems]) => (
          <div key={category} className="rp-slash-menu__category">
            <div className="rp-slash-menu__category-label">{category}</div>
            {categoryItems.map((item) => {
              const currentIndex = flatIndex++;
              return (
                <button
                  key={item.title}
                  ref={(el) => { itemRefs.current[currentIndex] = el; }}
                  type="button"
                  className={cn(
                    'rp-slash-menu__item',
                    currentIndex === selectedIndex && 'rp-slash-menu__item--selected'
                  )}
                  onClick={() => selectItem(currentIndex)}
                  onMouseEnter={() => setSelectedIndex(currentIndex)}
                >
                  <div className="rp-slash-menu__item-icon">{item.icon}</div>
                  <div className="rp-slash-menu__item-content">
                    <div className="rp-slash-menu__item-title">{item.title}</div>
                    <div className="rp-slash-menu__item-desc">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
);

SlashMenu.displayName = 'SlashMenu';
