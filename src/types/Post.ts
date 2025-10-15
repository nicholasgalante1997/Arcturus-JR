import { isMarkdownDocument, type MarkdownDocument } from './MarkdownDocument';

export interface PostImage {
  src: string;
  alt: string;
  aspectRatio: string;
}

export interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  image: PostImage;
  readingTime: string;
  category: string;
  subcategory: string;
  searchTerms: string[];
  slug: string;
  visible: boolean;
}

export interface PostWithMarkdown extends Post {
  markdownContent: MarkdownDocument;
}

export function isPost(obj: unknown): obj is Post {
  if (typeof obj !== 'object' || obj === null) return false;
  const post = obj as Post;
  const hasId = typeof post.id === 'string';
  const hasTitle = typeof post.title === 'string';
  const hasDate = typeof post.date === 'string';
  const hasExcerpt = typeof post.excerpt === 'string';
  const hasTags = Array.isArray(post.tags) && post.tags.every((tag) => typeof tag === 'string');
  const hasImage =
    typeof post.image === 'object' &&
    post.image !== null &&
    typeof post.image.src === 'string' &&
    typeof post.image.alt === 'string' &&
    typeof post.image.aspectRatio === 'string';
  const hasReadingTime = typeof post.readingTime === 'string';
  const hasCategory = typeof post.category === 'string';
  const hasSubcategory = typeof post.subcategory === 'string';
  const hasSearchTerms =
    Array.isArray(post.searchTerms) && post.searchTerms.every((term) => typeof term === 'string');
  const hasSlug = typeof post.slug === 'string';
  const hasVisible = typeof post.visible === 'boolean';
  return (
    hasId &&
    hasTitle &&
    hasDate &&
    hasExcerpt &&
    hasTags &&
    hasImage &&
    hasReadingTime &&
    hasCategory &&
    hasSubcategory &&
    hasSearchTerms &&
    hasSlug &&
    hasVisible
  );
}

export function isPostWithMarkdown(obj: unknown): obj is PostWithMarkdown {
  const hasMarkdown =
    typeof (obj as PostWithMarkdown)?.markdownContent === 'object' &&
    (obj as PostWithMarkdown)?.markdownContent !== null;
  return isPost(obj) && hasMarkdown && isMarkdownDocument((obj as PostWithMarkdown)?.markdownContent);
}
