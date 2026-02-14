'use client';

export default function Header({ title, subtitle, action }) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="flex items-center gap-3">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}