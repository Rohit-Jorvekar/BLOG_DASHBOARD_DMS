'use client';

import Link from 'next/link';
import { formatDate, formatRelativeTime, getStatusColor, truncateText, stripHtml } from '../../lib/utils';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import SeoScore from'../../components/posts/SEOScore';


// Utility to safely convert to array
function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }
  return [];
}

export default function PostCard({ post, onDelete, onTogglePublish }) {
    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!post) {
            console.error('Post object is undefined');
            alert('Error: Cannot delete post - Post data is missing');
            return;
        }
        
        console.log('Deleting post:', post.id, post.title);
        onDelete(post); // Pass entire post object
    };

    const handleTogglePublish = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!post?.id) {
            console.error('Post ID is undefined:', post);
            alert('Error: Cannot toggle publish - ID is missing');
            return;
        }
        
        await onTogglePublish(post.id);
    };

    // Validate featured image URL
    const isValidImageUrl = (url) => {
        if (!url) return false;
        try {
            return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
        } catch {
            return false;
        }
    };

    // Safely get arrays
    const keywords = toArray(post.seoKeywords);
    const tags = toArray(post.tags);

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
                <div className="flex items-start gap-4">
                    {/* Featured Image */}
                    {post.featuredImage && isValidImageUrl(post.featuredImage) && (
                        <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>';
                                }}
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Top Row: Status Badges & SEO Score */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                                    {post.status}
                                </span>
                                {post.isFeatured && (
                                    <Badge variant="warning">⭐ Featured</Badge>
                                )}
                            </div>
                            
                            {/* SEO Score Inline */}
                            <SeoScore postId={post.id} inline />
                        </div>

                        {/* Title */}
                        <Link href={`/posts/${post.id}`}>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors mb-1 line-clamp-2">
                                {post.title}
                            </h3>
                        </Link>

                        {/* Slug */}
                        {post.slug && (
                            <div className="flex items-center gap-1 mb-2">
                                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <span className="text-xs text-gray-500 font-mono">/{post.slug}</span>
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500 mb-2">
                            <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {post.authorName || 'Unknown'}
                            </span>
                            <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {post.readTime || 1} min read
                            </span>
                            <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {post.views || 0} views
                            </span>
                            {post.category && (
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {post.category}
                                </span>
                            )}
                        </div>

                        {/* Content Preview or Meta Description */}
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {post.metaDescription || truncateText(stripHtml(post.content), 120)}
                        </p>

                        {/* SEO Keywords */}
                        {keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                    Keywords:
                                </span>
                                {keywords.slice(0, 3).map((keyword, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                                {keywords.length > 3 && (
                                    <span className="text-xs text-gray-500">
                                        +{keywords.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                                {tags.slice(0, 3).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                                {tags.length > 3 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-500">
                                        +{tags.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-gray-500">
                                    Created {formatRelativeTime(post.createdAt)}
                                </span>
                                {post.publishedAt && post.status === 'Published' && (
                                    <span className="text-xs text-green-600 font-medium">
                                        📅 Published {formatDate(post.publishedAt, 'MMM dd, yyyy')}
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Link href={`/posts?action=preview&id=${post.id}`}>
                                    <Button variant="ghost" size="sm">
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Preview
                                    </Button>
                                </Link>
                                <Link href={`/posts?action=edit&id=${post.id}`}>
                                    <Button variant="ghost" size="sm">
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleTogglePublish}
                                >
                                    {post.status === 'Published' ? 'Unpublish' : 'Publish'}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDelete}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}