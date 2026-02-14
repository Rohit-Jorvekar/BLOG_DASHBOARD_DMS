'use client';

import dynamic from 'next/dynamic';

// ✅ Import ReactQuill (React-19 compatible fork)
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-gray-100 animate-pulse rounded-lg" />
  ),
});

// Quill styles
import 'react-quill-new/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'color',
  'background',
  'link',
  'image',
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
}) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Content <span className="text-red-500">*</span>
      </label>

      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        className="bg-white rounded-lg"
      />
    </div>
  );
}
