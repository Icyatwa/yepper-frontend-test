import clsx from 'clsx';
import React from 'react';

// Popover Component
export const Popover = ({ children, open, onOpenChange }) => {
  return (
    <div className="relative">
      {React.Children.map(children, child => 
        React.cloneElement(child, { 
          open, 
          onOpenChange 
        })
      )}
    </div>
  );
};

export const PopoverTrigger = ({ children, open, onOpenChange, ...props }) => (
  <div {...props}>
    {children}
  </div>
);

export const PopoverContent = ({ children, className, ...props }) => (
  <div 
    className={clsx(
      "absolute z-50 w-72 rounded-md border bg-white p-4 shadow-md",
      "top-full mt-2 right-0",
      className
    )}
    {...props}
  >
    {children}
  </div>
);