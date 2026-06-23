import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { Tooltip } from '../common/Tooltip';

interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  shortcut?: string;
  isActive?: boolean;
}

export function ToolbarButton({
  icon,
  label,
  shortcut,
  isActive = false,
  disabled = false,
  className,
  ...rest
}: ToolbarButtonProps) {
  return (
    <Tooltip content={label} shortcut={shortcut}>
      <button
        type="button"
        className={cn(
          'rp-toolbar-btn',
          isActive && 'rp-toolbar-btn--active',
          className
        )}
        disabled={disabled}
        aria-label={label}
        aria-pressed={isActive}
        tabIndex={-1}
        {...rest}
      >
        {icon}
      </button>
    </Tooltip>
  );
}
