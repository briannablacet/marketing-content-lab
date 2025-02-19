// src/components/ui/alert.tsx
export function Alert({ children, className = '', variant = 'default', ...props }) {
    const baseClass = 'p-4 rounded-lg border flex items-start';
    const variantClasses = {
      default: 'bg-gray-50 border-gray-200',
      error: 'bg-red-50 border-red-200',
      success: 'bg-green-50 border-green-200',
    };
  
    return (
      <div 
        role="alert" 
        className={`${baseClass} ${variantClasses[variant]} ${className}`} 
        {...props}
      >
        {children}
      </div>
    );
  }
  
  export function AlertTitle({ children, className = '', ...props }) {
    return (
      <h5 className={`font-medium text-sm mb-1 ${className}`} {...props}>
        {children}
      </h5>
    );
  }
  
  export function AlertDescription({ children, className = '', ...props }) {
    return (
      <div className={`text-sm text-gray-600 ${className}`} {...props}>
        {children}
      </div>
    );
  }