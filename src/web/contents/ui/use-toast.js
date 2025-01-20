
import React, { useState } from 'react';
import { addDays, format, isWithinInterval } from 'date-fns';

// Basic Calendar Component
export const Calendar = ({ 
  mode = 'single', 
  selected, 
  onSelect, 
  className 
}) => {
  const [internalDate, setInternalDate] = useState(selected);
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined
  });

  const handleDateSelect = (date) => {
    if (mode === 'range') {
      if (!dateRange.from) {
        setDateRange({ from: date, to: undefined });
        onSelect({ from: date, to: undefined });
      } else if (!dateRange.to) {
        const newRange = {
          from: dateRange.from < date ? dateRange.from : date,
          to: dateRange.from < date ? date : dateRange.from
        };
        setDateRange(newRange);
        onSelect(newRange);
      } else {
        setDateRange({ from: date, to: undefined });
        onSelect({ from: date, to: undefined });
      }
    } else {
      setInternalDate(date);
      onSelect(date);
    }
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const daysInMonth = 31;
    const days = [];

    for (let i = 0; i < daysInMonth; i++) {
      const currentDate = addDays(today, i);
      days.push(currentDate);
    }

    return days;
  };

  const isDateSelected = (date) => {
    if (mode === 'range') {
      return dateRange.from && dateRange.to 
        ? isWithinInterval(date, { 
            start: dateRange.from, 
            end: dateRange.to 
          }) 
        : false;
    }
    return internalDate && format(internalDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
  };

  return (
    <div className={`p-4 bg-white border rounded-lg ${className}`}>
      <div className="grid grid-cols-7 gap-2 text-center">
        {generateCalendarDays().map((date, index) => (
          <button
            key={index}
            onClick={() => handleDateSelect(date)}
            className={`
              p-2 rounded 
              ${isDateSelected(date) 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-blue-100'
              }
            `}
          >
            {format(date, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
};

// Simple Toast Notification System
const ToastContext = React.createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = 'default' }) => {
    const id = Date.now();
    const newToast = { id, title, description, variant };
    
    setToasts(current => [...current, newToast]);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts(current => current.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(current => current.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`
              p-4 rounded-lg shadow-lg 
              ${toast.variant === 'destructive' 
                ? 'bg-red-500 text-white' 
                : 'bg-green-500 text-white'
              }
            `}
          >
            <div className="font-bold">{toast.title}</div>
            <div>{toast.description}</div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="mt-2 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === null) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};