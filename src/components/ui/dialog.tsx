import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"

// Create components without exporting them immediately
const DialogComponent: React.FC<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}> = ({ 
  open = false, 
  onOpenChange,
  children 
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onOpenChange?.(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange?.(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      {children}
    </div>
  );
};

const DialogContentComponent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ 
  children,
  className = ""
}) => {
  return (
    <div className={`relative z-50 grid w-full max-w-lg gap-4 bg-background p-6 shadow-lg sm:rounded-lg ${className}`}>
      {children}
    </div>
  );
};

const DialogHeaderComponent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ 
  children,
  className = ""
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>
      {children}
    </div>
  );
};

const DialogFooterComponent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ 
  children,
  className = ""
}) => {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>
      {children}
    </div>
  );
};

const DialogTitleComponent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ 
  children,
  className = ""
}) => {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h2>
  );
};

const DialogDescriptionComponent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ 
  children,
  className = ""
}) => {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </p>
  );
};

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

// Export all components once
export const Dialog = DialogComponent
export const DialogContent = DialogContentComponent
export const DialogHeader = DialogHeaderComponent
export const DialogFooter = DialogFooterComponent
export const DialogTitle = DialogTitleComponent
export const DialogDescription = DialogDescriptionComponent

export {
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
}
