import React from 'react';
import clsx from 'clsx';

// Card Component
export const Card = ({ children, className, ...props }) => (
  <div 
    className={clsx(
      "rounded-lg border bg-white text-card-foreground shadow-sm", 
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className, ...props }) => (
  <div 
    className={clsx(
      "flex flex-col space-y-1.5 p-6", 
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h3 
    className={clsx(
      "text-2xl font-semibold leading-none tracking-tight", 
      className
    )} 
    {...props}
  >
    {children}
  </h3>
);

export const CardContent = ({ children, className, ...props }) => (
  <div 
    className={clsx(
      "p-6 pt-0", 
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

export const CardDescription = ({ children, className, ...props }) => (
  <p 
    className={clsx(
      "text-sm text-muted-foreground", 
      className
    )} 
    {...props}
  >
    {children}
  </p>
);