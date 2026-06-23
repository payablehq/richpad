import { cn } from "../../utils/cn";
import type { ReactNode } from "react";

interface ToolbarGroupProps {
  children: ReactNode;
  className?: string;
}

export function ToolbarGroup({ children, className }: ToolbarGroupProps) {
  return (
    <div className={cn("rp-toolbar-group", className)} role="group">
      {children}
    </div>
  );
}
