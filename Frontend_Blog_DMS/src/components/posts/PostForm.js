'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import slugify from 'slugify';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';
import { calculateReadTime } from '../../lib/utils';

// Dynamically import Rich Text Editor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import('../../components/ui/RichTextEditor'),
  { ssr: false }
);

export default function PostForm({ initialData, onSubmit, submitLabel = 'Create Post' }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    authorName: '',
    authorId: '',
    category: '',
    tags: [],
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    content: '',
    status: 'Draft',
    seoKeywords: '',
    isFeatured: false,
    ...initialData,
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !initialData) {
      const newSlug = slugify(formData.title, { lower: true, strict: true });
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  }, [formData.title, initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    handleChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.authorName.trim()) newErrors.authorName = 'Author name is required';
    if (!formData.authorId) newErrors.authorId = 'Author ID is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.metaTitle.trim()) newErrors.metaTitle = 'Meta title is required';
    if (!formData.metaDescription.trim()) newErrors.metaDescription = 'Meta description is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter post title"
                  required
                  error={errors.title}
                />

                <Input
                  label="Slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="post-url-slug"
                  helperText="URL-friendly version of the title"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Author Name"
                    value={formData.authorName}
                    onChange={(e) => handleChange('authorName', e.target.value)}
                    placeholder="John Doe"
                    required
                    error={errors.authorName}
                  />

                  <Input
                    label="Author ID"
                    type="number"
                    value={formData.authorId}
                    onChange={(e) => handleChange('authorId', e.target.value)}
                    placeholder="1"
                    required
                    error={errors.authorId}
                  />
                </div>

                <Input
                  label="Category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  placeholder="Technology"
                  required
                  error={errors.category}
                />

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add a tag"
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  {formData.tags && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-primary-900"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <Input
                  label="Featured Image URL"
                  value={formData.featuredImage}
                  onChange={(e) => handleChange('featuredImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardBody>
          </Card>

          {/* Content Card */}
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => handleChange('content', value)}
                placeholder="Start writing your post..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Estimated read time: {calculateReadTime(formData.content)} minutes
              </p>
            </CardBody>
          </Card>

          {/* SEO Card */}
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
              
              <div className="space-y-4">
                <Input
                  label="Meta Title"
                  value={formData.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  placeholder="SEO-friendly title"
                  required
                  error={errors.metaTitle}
                  helperText={`${formData.metaTitle.length} characters (ideal: 50-60)`}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => handleChange('metaDescription', e.target.value)}
                    placeholder="Brief description for search engines"
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.metaDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.metaDescription}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.metaDescription.length} characters (ideal: 150-160)
                  </p>
                </div>

                <Input
                  label="SEO Keywords"
                  value={formData.seoKeywords}
                  onChange={(e) => handleChange('seoKeywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  helperText="Comma-separated keywords (3-5 recommended)"
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Card */}
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish</h3>
              
              <div className="space-y-4">
                <Select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  options={[
                    { label: 'Draft', value: 'Draft' },
                    { label: 'Published', value: 'Published' },
                    { label: 'Archived', value: 'Archived' },
                  ]}
                  required
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => handleChange('isFeatured', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                    Mark as featured post
                  </label>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardBody>
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                >
                  {submitLabel}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </form>
  );
}