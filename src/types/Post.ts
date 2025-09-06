import { MarkdownDocument } from "./MarkdownDocument";

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