import React, { useState, useEffect, createContext, useContext } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Pomocnicze funkcje dla API
export const toast = {
  success: (message: string) => {
    try {
      const { addToast } = useToast();
      addToast(message, 'success');
    } catch (error) {
      console.error('Toast context not available', error);
    }
  },
  error: (message: string) => {
    try {
      const { addToast } = useToast();
      addToast(message, 'error');
    } catch (error) {
      console.error('Toast context not available', error);
    }
  },
  info: (message: string) => {
    try {
      const { addToast } = useToast();
      addToast(message, 'info');
    } catch (error) {
      console.error('Toast context not available', error);
    }
  }
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  // Automatycznie usuń powiadomienia po 3 sekundach
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, 3000);
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, removeToast]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-72">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md transition-all animate-in fade-in slide-in-from-top-1 
            ${toast.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : ''} 
            ${toast.type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' : ''} 
            ${toast.type === 'info' ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500' : ''}`}
        >
          <div className="flex justify-between items-center">
            <p className="text-sm">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; 