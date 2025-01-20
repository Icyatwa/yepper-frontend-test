import React from 'react';

const Alert = React.forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="alert"
      {...props}
      className={`
        relative w-full rounded-lg border p-4
        ${variant === "default" ? "bg-gray-50 text-gray-700 border-gray-200" : ""}
        ${variant === "destructive" ? "bg-red-50 text-red-700 border-red-200" : ""}
        ${className || ""}
      `}
    >
      <div className="flex gap-2">
        {children}
      </div>
    </div>
  );
});

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    {...props}
    className={`font-medium leading-none tracking-tight ${className || ""}`}
  />
));

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    {...props}
    className={`text-sm [&_p]:leading-relaxed ${className || ""}`}
  />
));

Alert.displayName = "Alert";
AlertTitle.displayName = "AlertTitle";
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };