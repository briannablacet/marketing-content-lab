// src/components/ui/alert.tsx
import React, { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  [key: string]: any;
}

export function Alert({ children, className = '', variant = 'default', ...props }: AlertProps) {
  const baseClass = 'p-4 rounded-lg border flex items-start';
  const variantClasses = {
    default: 'bg-gray-50 border-gray-200',
    destructive: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  return (
    <div className={`${baseClass} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AlertTitle({ children, className = '', ...props }: { children: ReactNode, className?: string, [key: string]: any }) {
  return (
    <h4 className={`font-medium mb-1 ${className}`} {...props}>
      {children}
    </h4>
  );
}

export function AlertDescription({ children, className = '', ...props }: { children: ReactNode, className?: string, [key: string]: any }) {
  return (
    <div className={`text-sm ${className}`} {...props}>
      {children}
    </div>
  );
}