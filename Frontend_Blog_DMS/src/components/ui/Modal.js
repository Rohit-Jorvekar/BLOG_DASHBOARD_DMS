import { useEffect } from 'react';
import { cn } from '../../lib/utils';

export default function Modal({ isOpen, onClose, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            'relative bg-white rounded-lg shadow-xl w-full animate-slide-up',
            sizes[size]
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function ModalHeader({ children, onClose }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function ModalBody({ children, className = '' }) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
}

export function ModalFooter({ children }) {
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
      {children}
    </div>
  );
}