import { cn } from '../../lib/utils';

export default function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        hover && 'card-hover cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200', className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-200 bg-gray-50', className)}>
      {children}
    </div>
  );
}