
import React from 'react';
import { cn } from '@/lib/utils';

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  className?: string;
}

export const PinInput: React.FC<PinInputProps> = ({ 
  value, 
  onChange, 
  maxLength = 4, 
  placeholder = "Enter PIN",
  className 
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <input
        type="password"
        value={value}
        onChange={(e) => {
          const numericValue = e.target.value.replace(/\D/g, '');
          if (numericValue.length <= maxLength) {
            onChange(numericValue);
          }
        }}
        placeholder={placeholder}
        className="w-full bg-gray-800 border-2 border-green-500/30 rounded-md px-4 py-3 text-green-400 placeholder-green-600 focus:outline-none focus:border-green-500 font-mono text-center text-2xl tracking-widest"
        maxLength={maxLength}
      />
      <div className="flex justify-center space-x-2">
        {Array.from({ length: maxLength }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-4 h-4 rounded-full border-2 transition-colors",
              i < value.length 
                ? "bg-green-500 border-green-500" 
                : "border-green-500/30"
            )}
          />
        ))}
      </div>
    </div>
  );
};
