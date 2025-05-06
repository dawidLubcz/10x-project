"use client"

// Create a simplified toast component without external dependencies
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// Types for toast
type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToasterContextValue {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

// Create context for toasts
const ToasterContext = createContext<ToasterContextValue | undefined>(undefined);

export const useToaster = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider');
  }
  return context;
};

// Use a mutable ref object to store context instead of a global variable
const contextRef = {
  current: null as ToasterContextValue | null,
};

// ToasterProvider component
export const ToasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Create a ref to store the context functions
  const contextValueRef = useRef<ToasterContextValue | null>(null);

  const addToast = (message: string, type: ToastType = 'default', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, type, message, duration };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    // Remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Create the value object
  const value = { toasts, addToast, removeToast };
  
  // Update our ref
  useEffect(() => {
    contextValueRef.current = value;
    // Update the global contextRef only in an effect, not during render
    contextRef.current = value;
    return () => {
      contextRef.current = null;
    };
  }, [value]);

  return (
    <ToasterContext.Provider value={value}>
      {children}
      <Toaster />
    </ToasterContext.Provider>
  );
};

// Toast component
const Toast: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const typeToColorClass = {
    default: 'bg-background border-border',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div 
      className={`rounded-md shadow-lg border p-4 mb-3 flex justify-between ${typeToColorClass[toast.type]}`}
    >
      <div>{toast.message}</div>
      <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
        ×
      </button>
    </div>
  );
};

// Toaster component that displays all toasts
export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToaster();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

// Create a toast object with common methods
export const toast = {
  success: (message: string) => {
    if (contextRef.current) {
      contextRef.current.addToast(message, 'success');
    } else {
      console.error('Toast context not available');
    }
  },
  error: (message: string) => {
    if (contextRef.current) {
      contextRef.current.addToast(message, 'error');
    } else {
      console.error('Toast context not available');
    }
  },
  info: (message: string) => {
    if (contextRef.current) {
      contextRef.current.addToast(message, 'info');
    } else {
      console.error('Toast context not available');
    }
  },
  warning: (message: string) => {
    if (contextRef.current) {
      contextRef.current.addToast(message, 'warning');
    } else {
      console.error('Toast context not available');
    }
  }
};

// For backward compatibility with imports
export { Toaster as Sonner }; 