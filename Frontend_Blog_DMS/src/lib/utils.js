import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format date to readable string
 */
export function formatDate(date, formatStr = 'MMM dd, yyyy') {
  if (!date) return '-';
  return format(new Date(date), formatStr);
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date) {
  if (!date) return '-';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Get status badge color
 */
export function getStatusColor(status) {
  const colors = {
    Draft: 'bg-gray-100 text-gray-800',
    Published: 'bg-green-100 text-green-800',
    Archived: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get SEO score color
 */
export function getSeoScoreColor(score) {
  if (score >= 75) return 'text-green-600 bg-green-100';
  if (score >= 50) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
}

/**
 * Get SEO score label
 */
export function getSeoScoreLabel(score) {
  if (score >= 75) return 'Good';
  if (score >= 50) return 'Average';
  return 'Poor';
}

/**
 * Truncate text
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Strip HTML tags
 */
export function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Calculate read time
 */
export function calculateReadTime(content) {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const plainText = stripHtml(content);
  const wordCount = plainText.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime > 0 ? readTime : 1;
}

/**
 * Validate URL
 */
export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Class names helper
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}