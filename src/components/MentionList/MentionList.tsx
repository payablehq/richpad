import { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import type { MentionItem } from '../../core/types';
import { cn } from '../../utils/cn';
import './MentionList.css';

export interface MentionListRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

interface MentionListProps {
  items: MentionItem[];
  command: (item: MentionItem) => void;
}

export const MentionList = forwardRef<MentionListRef, MentionListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    useEffect(() => {
      itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }, [selectedIndex]);

    const selectItem = useCallback((index: number) => {
      const item = items[index];
      if (item) command(item);
    }, [items, command]);

    useImperativeHandle(ref, () => ({
      onKeyDown: (event: KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((prev) => (prev <= 0 ? items.length - 1 : prev - 1));
          return true;
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex((prev) => (prev >= items.length - 1 ? 0 : prev + 1));
          return true;
        }
        if (event.key === 'Enter') {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      },
    }));

    if (items.length === 0) {
      return (
        <div className="rp-mention-list">
          <div className="rp-mention-list__empty">No users found</div>
        </div>
      );
    }

    return (
      <div className="rp-mention-list">
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(el) => { itemRefs.current[index] = el; }}
            type="button"
            className={cn(
              'rp-mention-list__item',
              index === selectedIndex && 'rp-mention-list__item--selected'
            )}
            onClick={() => selectItem(index)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            {item.avatar ? (
              <img
                src={item.avatar}
                alt=""
                className="rp-mention-list__avatar"
              />
            ) : (
              <div className="rp-mention-list__avatar-placeholder">
                {item.label.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="rp-mention-list__info">
              <span className="rp-mention-list__name">{item.label}</span>
              {item.description && (
                <span className="rp-mention-list__desc">{item.description}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  }
);

MentionList.displayName = 'MentionList';
