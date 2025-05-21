import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    [key: string]: any;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`bg-white rounded-lg shadow ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`p-6 pb-0 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardTitle: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <h3 className={`text-lg font-medium ${className}`} {...props}>
            {children}
        </h3>
    );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`p-6 ${className}`} {...props}>
            {children}
        </div>
    );
};
