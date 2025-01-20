import clsx from 'clsx';

// Button Component
export const Button = ({ 
  children, 
  variant = 'default', 
  className, 
  disabled, 
  ...props 
}) => {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    destructive: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-md text-sm font-medium",
        "px-4 py-2 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed",
        variants[variant],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};