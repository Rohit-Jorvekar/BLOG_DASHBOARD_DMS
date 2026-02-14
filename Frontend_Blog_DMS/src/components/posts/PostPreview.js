'use client';

import { formatDate } from '../../lib/utils';
import Card, { CardBody } from '../../components/ui/Card';

export default function PostPreview({ post }) {
  return (
    <Card>
      <CardBody className="p-8">
        {/* Header */}
        <div className="mb-8">
          {post.featuredImage && (
            <div className="w-full h-96 relative mb-6 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="mb-6">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 rounded-full mb-4">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {post.authorName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{post.authorName}</p>
                <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            <span className="text-sm">•</span>
            <span className="text-sm">{post.readTime} min read</span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
                     prose-headings:font-bold prose-headings:text-gray-900
                     prose-p:text-gray-700 prose-p:leading-relaxed
                     prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                     prose-strong:text-gray-900
                     prose-ul:text-gray-700 prose-ol:text-gray-700
                     prose-blockquote:border-l-primary-500 prose-blockquote:bg-gray-50
                     prose-img:rounded-lg prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">About the Author</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-lg font-medium text-primary-700">
                  {post.authorName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{post.authorName}</p>
                <p className="text-sm text-gray-600">Content Creator</p>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}