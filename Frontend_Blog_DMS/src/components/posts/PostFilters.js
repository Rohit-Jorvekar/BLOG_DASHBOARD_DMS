'use client';

import { useState } from 'react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

export default function PostFilters({ onFilterChange, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    status: initialFilters.status || '',
    sort: initialFilters.sort || 'DESC',
  });

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const clearedFilters = { search: '', status: '', sort: 'DESC' };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <Input
            placeholder="Search by title or author..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div>
          <Select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={[
              { label: 'All Status', value: '' },
              { label: 'Draft', value: 'Draft' },
              { label: 'Published', value: 'Published' },
              { label: 'Archived', value: 'Archived' },
            ]}
          />
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          <Select
            value={filters.sort}
            onChange={(e) => handleChange('sort', e.target.value)}
            options={[
              { label: 'Newest First', value: 'DESC' },
              { label: 'Oldest First', value: 'ASC' },
            ]}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleClear}
            className="px-3"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}