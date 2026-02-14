'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePost } from '../../../hooks/usePost';
import { formatDate, getStatusColor } from '../../../lib/utils';
import Header from '../../../components/layout/Header';
import Button from '../../../components/ui/Button';
import Card, { CardBody } from '../../../components/ui/Card';
import SEOScore from '../../../components/posts/SEOScore';

export default function ViewPostPage() {
  const params = useParams();
  const router = useRouter();
  const { post, loading } = usePost(params.id);

  if (loading) {
    return (
      <>
        <Header title="Loading..." />
        <div className="p-8 flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header title="Post Not Found" />
        <div className="p-8">
          <Card>
            <CardBody>
              <p className="text-center text-gray-500">Post not found.</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title={post.title}
        action={
          <div className="flex gap-2">
            <Link href={`/posts/${post.id}/preview`}>
              <Button variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </Button>
            </Link>
            <Link href={`/posts/${post.id}/edit`}>
              <Button>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardBody>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                    {post.isFeatured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Featured
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {post.authorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {post.readTime} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {post.views} views
                    </span>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                </div>

                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* SEO Score */}
            <SEOScore postId={post.id} />

            {/* Post Details */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 font-medium text-gray-900">{post.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Slug:</span>
                    <span className="ml-2 font-medium text-gray-900">{post.slug}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-2 font-medium text-gray-900">{formatDate(post.createdAt, 'PPP')}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Updated:</span>
                    <span className="ml-2 font-medium text-gray-900">{formatDate(post.updatedAt, 'PPP')}</span>
                  </div>
                  {post.publishedDate && (
                    <div>
                      <span className="text-gray-600">Published:</span>
                      <span className="ml-2 font-medium text-gray-900">{formatDate(post.publishedDate, 'PPP')}</span>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* SEO Meta */}
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Meta</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Meta Title</label>
                    <p className="text-sm text-gray-900 mt-1">{post.metaTitle}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Meta Description</label>
                    <p className="text-sm text-gray-900 mt-1">{post.metaDescription}</p>
                  </div>
                  {post.seoKeywords && (
                    <div>
                      <label className="text-xs font-medium text-gray-600">Keywords</label>
                      <p className="text-sm text-gray-900 mt-1">{post.seoKeywords}</p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}