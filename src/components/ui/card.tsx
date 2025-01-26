// src/components/ui/card.tsx
export function Card({ children, className = '', ...props }) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`} {...props}>
        {children}
      </div>
    );
  }
  
  export function CardHeader({ children, className = '', ...props }) {
    return <div className={`p-6 pb-0 ${className}`} {...props}>{children}</div>;
  }
  
  export function CardTitle({ children, className = '', ...props }) {
    return <h3 className={`text-lg font-medium ${className}`} {...props}>{children}</h3>;
  }
  
  export function CardContent({ children, className = '', ...props }) {
    return <div className={`p-6 ${className}`} {...props}>{children}</div>;
  }