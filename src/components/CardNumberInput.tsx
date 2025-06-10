
import React from 'react';
import { cn } from '@/lib/utils';

interface CardNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CardNumberInput: React.FC<CardNumberInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Enter Card Number",
  className 
}) => {
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <input
      type="text"
      value={formatCardNumber(value)}
      onChange={(e) => {
        const rawValue = e.target.value.replace(/\s/g, '');
        if (rawValue.length <= 16 && /^\d*$/.test(rawValue)) {
          onChange(rawValue);
        }
      }}
      placeholder={placeholder}
      className={cn(
        "w-full bg-gray-800 border-2 border-green-500/30 rounded-md px-4 py-3 text-green-400 placeholder-green-600 focus:outline-none focus:border-green-500 font-mono text-center text-xl tracking-wider",
        className
      )}
      maxLength={19} // 16 digits + 3 spaces
    />
  );
};
