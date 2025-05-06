import * as React from "react";

interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ 
  open = false, 
  onOpenChange,
  children 
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
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

interface AlertDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export const AlertDialogContent: React.FC<AlertDialogContentProps> = ({ 
  children,
  className = ""
}) => {
  return (
    <div className={`relative z-50 grid w-full max-w-lg gap-4 bg-background p-6 shadow-lg sm:rounded-lg ${className}`}>
      {children}
    </div>
  );
};

interface AlertDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({ 
  children,
  className = ""
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>
      {children}
    </div>
  );
};

interface AlertDialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({ 
  children,
  className = ""
}) => {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>
      {children}
    </div>
  );
};

interface AlertDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({ 
  children,
  className = ""
}) => {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h2>
  );
};

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({ 
  children,
  className = ""
}) => {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </p>
  );
};

interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const AlertDialogAction: React.FC<AlertDialogActionProps> = ({ 
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface AlertDialogCancelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({ 
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}; 