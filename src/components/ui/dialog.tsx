'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ isOpen, onClose, title, description, children, className }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div
        className={cn(
          'relative w-full max-w-lg rounded-2xl border border-[#e4ded4] bg-white p-6 shadow-xl transition-all max-h-[90vh] overflow-y-auto',
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 ltr:right-4 rtl:left-4 rounded-full p-1.5 text-stone-400 hover:bg-[#f4f0eb] hover:text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </button>

        {title && (
          <div className="mb-4">
            <h3 className="text-xl font-bold text-stone-900">{title}</h3>
            {description && <p className="text-sm text-stone-500 mt-1">{description}</p>}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
}
