
import React from 'react';
import { cn } from '@/lib/utils';

interface ATMScreenProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const ATMScreen: React.FC<ATMScreenProps> = ({ children, title, className }) => {
  return (
    <div className={cn(
      "bg-gray-900 text-green-400 p-6 rounded-lg border-2 border-green-500/30 min-h-[400px] font-mono",
      "shadow-2xl shadow-green-500/20 relative overflow-hidden",
      className
    )}>
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-pulse pointer-events-none" />
      
      {title && (
        <div className="text-center mb-6 pb-4 border-b border-green-500/30">
          <h2 className="text-xl font-bold text-green-300 tracking-wide">{title}</h2>
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
