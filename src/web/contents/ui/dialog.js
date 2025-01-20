import clsx from 'clsx';

// Dialog Component
export const Dialog = ({ children, open, onOpenChange, ...props }) => (
    <div 
      className={`${open ? 'block' : 'hidden'} fixed inset-0 z-50`}
      {...props}
    >
      {children}
    </div>
  );
  
  export const DialogContent = ({ children, className, onClose, ...props }) => (
    <div 
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/50 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
  
  export const DialogHeader = ({ children, className, ...props }) => (
    <div 
      className={clsx(
        "flex flex-col space-y-1.5 mb-4", 
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
  
  export const DialogTitle = ({ children, className, ...props }) => (
    <h2 
      className={clsx(
        "text-lg font-semibold leading-none tracking-tight", 
        className
      )} 
      {...props}
    >
      {children}
    </h2>
  );
  
  export const DialogDescription = ({ children, className, ...props }) => (
    <p 
      className={clsx(
        "text-sm text-gray-500", 
        className
      )} 
      {...props}
    >
      {children}
    </p>
  );