'use client';

import { useEffect, useState } from 'react';
import { getSeoScoreColor, getSeoScoreLabel } from '../../lib/utils';

export default function SEOScore({ postId, inline = false }) {
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const fetchScore = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.180:3001/api'}/posts/${postId}/seo-score`);
        const data = await response.json();
        setSeoData(data);
      } catch (error) {
        console.error('Error fetching SEO score:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [postId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    );
  }

  if (!seoData) return null;

  // Inline compact version for cards
  if (inline) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600">SEO:</span>
        <div className={`px-2 py-0.5 rounded text-xs font-medium ${getSeoScoreColor(seoData.score)}`}>
          {seoData.score}%
        </div>
      </div>
    );
  }

  // Full detailed version
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">SEO Score</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeoScoreColor(seoData.score)}`}>
          {seoData.score}% - {getSeoScoreLabel(seoData.score)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              seoData.score >= 75
                ? 'bg-green-500'
                : seoData.score >= 50
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${seoData.score}%` }}
          ></div>
        </div>
      </div>

      {/* Score Details */}
      {seoData.details && (
        <div className="space-y-2 mb-4">
          <div className="text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Meta Title Length:</span>
              <span className={`font-medium ${
                seoData.details.metaTitleLength >= 50 && seoData.details.metaTitleLength <= 60
                  ? 'text-green-600'
                  : seoData.details.metaTitleLength >= 40 && seoData.details.metaTitleLength < 70
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                {seoData.details.metaTitleLength} chars
              </span>
            </div>
            
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Meta Description Length:</span>
              <span className={`font-medium ${
                seoData.details.metaDescriptionLength >= 150 && seoData.details.metaDescriptionLength <= 160
                  ? 'text-green-600'
                  : seoData.details.metaDescriptionLength >= 120 && seoData.details.metaDescriptionLength < 180
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                {seoData.details.metaDescriptionLength} chars
              </span>
            </div>
            
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">SEO Keywords:</span>
              <span className={`font-medium ${
                seoData.details.keywordsCount >= 3 && seoData.details.keywordsCount <= 5
                  ? 'text-green-600'
                  : seoData.details.keywordsCount > 0
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                {seoData.details.keywordsCount} keywords
              </span>
            </div>
            
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Slug Length:</span>
              <span className={`font-medium ${
                seoData.details.slugLength <= 60 && seoData.details.slugLength >= 10
                  ? 'text-green-600'
                  : seoData.details.slugLength < 80
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                {seoData.details.slugLength} chars
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {seoData.recommendations && seoData.recommendations.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Recommendations:</h4>
          <ul className="space-y-1">
            {seoData.recommendations.map((recommendation, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                <svg className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}