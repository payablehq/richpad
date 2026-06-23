import { cn } from "../../utils/cn";

interface ToolbarDividerProps {
  className?: string;
}

export function ToolbarDivider({ className }: ToolbarDividerProps = {}) {
  return (
    <div
      className={cn("rp-toolbar-divider", className)}
      role="separator"
      aria-orientation="vertical"
    />
  );
}
