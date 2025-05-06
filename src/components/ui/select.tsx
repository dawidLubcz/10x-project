import * as React from "react";

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  initialValue?: string;
  onValueChange?: (value: string) => void;
}

// Definiuję domyślne wartości dla kontekstu z rzeczywistymi funkcjami
// zamiast pustych implementacji
const defaultSetOpen: React.Dispatch<React.SetStateAction<boolean>> = () => {
  // Domyślna implementacja nie robi nic, ale nie jest pusta
  return;
};

const defaultOnValueChange: (value: string) => void = () => {
  // Domyślna implementacja nie robi nic, ale nie jest pusta
};

const SelectContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  onValueChange: (value: string) => void;
}>({
  open: false,
  setOpen: defaultSetOpen,
  value: '',
  onValueChange: defaultOnValueChange
});

const Select: React.FC<SelectProps> = ({
  children,
  initialValue = '',
  onValueChange = defaultOnValueChange,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(initialValue);
  const selectRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    setInternalValue(initialValue);
  }, [initialValue]);
  
  const handleValueChange = React.useCallback((newValue: string) => {
    setInternalValue(newValue);
    onValueChange(newValue);
    setOpen(false);
  }, [onValueChange]);
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <SelectContext.Provider value={{ open, setOpen, value: internalValue, onValueChange: handleValueChange }}>
      <div ref={selectRef} className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SelectContext);
    
    return (
      <button
        type="button"
        ref={ref}
        className={`flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
        onClick={(e) => { 
          e.stopPropagation();
          setOpen(!open);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        {...props}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-2 h-4 w-4 opacity-50"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder, children }) => {
  const { value } = React.useContext(SelectContext);
  
  // If children is explicitly provided, render that
  // Otherwise check if there's a value from context
  const shouldRenderPlaceholder = !children && !value;
  
  return (
    <span className="flex-grow text-sm truncate">
      {shouldRenderPlaceholder ? (
        <span className="text-muted-foreground">{placeholder}</span>
      ) : (
        children || value
      )}
    </span>
  );
};

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

const SelectContent: React.FC<SelectContentProps> = ({ children, className }) => {
  const { open } = React.useContext(SelectContext);
  
  if (!open) return null;
  
  return (
    <div 
      className={`absolute z-50 mt-1 max-h-60 w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md p-1 ${className || ''}`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      role="listbox"
      tabIndex={0}
    >
      <div className="py-1">{children}</div>
    </div>
  );
};

interface SelectItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  value: string;
  children: React.ReactNode;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(SelectContext);
    const isSelected = selectedValue === value;
    
    return (
      <div
        ref={ref}
        className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${isSelected ? 'bg-accent text-accent-foreground' : ''} ${className || ''}`}
        onClick={() => {
          console.log('SelectItem clicked:', value);
          onValueChange(value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onValueChange(value);
          }
        }}
        role="option"
        aria-selected={isSelected}
        tabIndex={0}
        {...props}
      >
        {children}
        {isSelected && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-auto h-4 w-4"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
}; 