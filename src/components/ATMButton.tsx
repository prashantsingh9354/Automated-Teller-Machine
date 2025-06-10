
import React from 'react';
import { cn } from '@/lib/utils';

interface ATMButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

export const ATMButton: React.FC<ATMButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-4 py-3 rounded-md font-semibold transition-all duration-200 font-mono tracking-wide",
        "border-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        {
          'bg-green-600 border-green-500 text-white hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/30': variant === 'primary',
          'bg-gray-700 border-gray-600 text-green-400 hover:bg-gray-600 hover:border-green-500': variant === 'secondary',
          'bg-red-600 border-red-500 text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/30': variant === 'danger',
        },
        className
      )}
    >
      {children}
    </button>
  );
};
