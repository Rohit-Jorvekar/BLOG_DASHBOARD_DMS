'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { postsApi } from '../lib/api';
import Header from '../components/layout/Header';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function HomePage() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all posts to calculate stats
        const allPosts = await postsApi.getAll({ limit: 1000 });
        const posts = allPosts.data;

        setStats({
          total: posts.length,
          published: posts.filter((p) => p.status === 'Published').length,
          draft: posts.filter((p) => p.status === 'Draft').length,
          archived: posts.filter((p) => p.status === 'Archived').length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.total,
      icon: (
        <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-primary-50',
    },
    {
      title: 'Published',
      value: stats.published,
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-50',
    },
    {
      title: 'Drafts',
      value: stats.draft,
      icon: (
        <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'bg-yellow-50',
    },
    {
      title: 'Archived',
      value: stats.archived,
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      color: 'bg-red-50',
    },
  ];

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's an overview of your blog."
        action={
          <Link href="/posts/new">
            <Button>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Post
            </Button>
          </Link>
        }
      />

      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {loading ? (
                        <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded"></span>
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/posts/new">
                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer text-center">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <h3 className="font-medium text-gray-900">Create New Post</h3>
                  <p className="text-sm text-gray-500 mt-1">Start writing a new blog post</p>
                </div>
              </Link>

              <Link href="/posts?status=Draft">
                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer text-center">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <h3 className="font-medium text-gray-900">View Drafts</h3>
                  <p className="text-sm text-gray-500 mt-1">Continue working on drafts</p>
                </div>
              </Link>

              <Link href="/posts?status=Published">
                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer text-center">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-medium text-gray-900">Published Posts</h3>
                  <p className="text-sm text-gray-500 mt-1">View all published content</p>
                </div>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}