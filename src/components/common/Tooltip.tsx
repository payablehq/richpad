import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import './Tooltip.css';

interface TooltipProps {
  content: ReactNode;
  shortcut?: string;
  children: ReactNode;
  side?: 'top' | 'bottom';
  delay?: number;
}

export function Tooltip({ content, shortcut, children, side = 'top', delay = 400 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);
  const triggerRef = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    timeoutRef.current = window.setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    window.clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div
      ref={triggerRef}
      className="rp-tooltip-trigger"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div
          className={cn('rp-tooltip', `rp-tooltip--${side}`)}
          role="tooltip"
        >
          <span className="rp-tooltip__text">{content}</span>
          {shortcut && (
            <kbd className="rp-tooltip__shortcut">{shortcut}</kbd>
          )}
        </div>
      )}
    </div>
  );
}
