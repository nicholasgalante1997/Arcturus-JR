import { memo, use, useEffect, useMemo,useState } from "react";

import { pipeline } from "@/utils/pipeline";
import { withProfiler } from "@/utils/profiler";

import { PostContentView } from "./components/PostContent";
import { PostHeaderView } from "./components/PostHeader";
import { RelatedPostsView } from "./components/RelatedPosts";
import { TableOfContentsView } from "./components/TableOfContents";

import type { HeadingItem,V2PostDetailViewProps } from "./types";

const WORDS_PER_MINUTE = 200;

function calculateReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

/**
 * Converts heading text to a slug ID (matches rehype-slug behavior)
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
}

/**
 * Extract headings from markdown content (h2-h4)
 * Generates IDs that match rehype-slug output
 */
function extractHeadings(content: string): HeadingItem[] {
  // Match markdown headings: ## Title, ### Subtitle, #### Sub-subtitle
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const headings: HeadingItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);

    headings.push({
      level,
      id,
      text,
    });
  }

  return headings;
}

function V2PostDetailView({ queries }: V2PostDetailViewProps) {
  const [postQuery, relatedPostsQuery] = queries;
  const post = use(postQuery.promise);
  const relatedPosts = use(relatedPostsQuery.promise);

  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

  const content = post.markdownContent?.markdown || "";

  const readingTime = useMemo(
    () => calculateReadingTime(content),
    [content]
  );

  const headings = useMemo(
    () => extractHeadings(content),
    [content]
  );

  // Intersection Observer for active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -66% 0px",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <div className="v2-post-detail">
      <div className="v2-container">
        <PostHeaderView post={post} readingTime={readingTime} />

        <div className="v2-post-detail__layout">
          {/* Table of Contents - Desktop */}
          <div className="v2-post-detail__sidebar">
            <div className="v2-post-detail__sidebar-sticky">
              <TableOfContentsView
                headings={headings}
                activeId={activeHeadingId}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="v2-post-detail__main">
            <PostContentView content={content} />
          </div>
        </div>

        {/* Related Posts */}
        <RelatedPostsView posts={relatedPosts} />
      </div>
    </div>
  );
}

export default pipeline(memo, withProfiler("v2_Post_Detail_View"))(V2PostDetailView);
